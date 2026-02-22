from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import date
from app.db.database import get_db
from app.models.domain import ExpenseTransaction, ExpenseCategory, TransactionType

router = APIRouter()

class TransactionBase(BaseModel):
    merchant_name: Optional[str] = None
    amount: Optional[float] = None
    transaction_date: Optional[date] = None
    category_name: Optional[str] = None
    type: Optional[TransactionType] = TransactionType.DEBIT

class TransactionCreate(TransactionBase):
    report_id: uuid.UUID
    merchant_name: str
    amount: float
    transaction_date: date
    category_name: str

class TransactionUpdate(TransactionBase):
    pass

@router.get("/categories", response_model=List[str])
async def get_categories(db: Session = Depends(get_db)):
    """Mengambil semua nama kategori yang unik untuk dropdown."""
    categories = db.query(ExpenseCategory.name).distinct().all()
    return [c[0] for c in categories]

@router.get("/report/{report_id}")
async def get_transactions_by_report(report_id: uuid.UUID, db: Session = Depends(get_db)):
    transactions = db.query(ExpenseTransaction).filter(ExpenseTransaction.report_id == report_id).order_by(ExpenseTransaction.transaction_date.desc()).all()
    
    return [{
        "id": tx.id,
        "date": tx.transaction_date,
        "merchant": tx.merchant_name,
        "amount": float(tx.amount),
        "category": tx.category.name if tx.category else "Uncategorized",
        "type": tx.type
    } for tx in transactions]

@router.post("/", status_code=201)
async def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db)):
    """Menambahkan transaksi baru secara manual."""
    cat = db.query(ExpenseCategory).filter(ExpenseCategory.name == payload.category_name).first()
    if not cat:
        cat = ExpenseCategory(id=uuid.uuid4(), name=payload.category_name)
        db.add(cat)
        db.commit()
        db.refresh(cat)

    new_tx = ExpenseTransaction(
        id=uuid.uuid4(),
        report_id=payload.report_id,
        category_id=cat.id,
        transaction_date=payload.transaction_date,
        merchant_name=payload.merchant_name,
        amount=payload.amount,
        type=payload.type
    )
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx

@router.put("/{transaction_id}")
async def update_transaction(transaction_id: uuid.UUID, payload: TransactionUpdate, db: Session = Depends(get_db)):
    tx = db.query(ExpenseTransaction).filter(ExpenseTransaction.id == transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    if payload.category_name:
        cat = db.query(ExpenseCategory).filter(ExpenseCategory.name == payload.category_name).first()
        if not cat:
            cat = ExpenseCategory(id=uuid.uuid4(), name=payload.category_name)
            db.add(cat)
            db.commit()
            db.refresh(cat)
        tx.category_id = cat.id

    if payload.merchant_name: tx.merchant_name = payload.merchant_name
    if payload.transaction_date: tx.transaction_date = payload.transaction_date
    if payload.amount: tx.amount = payload.amount
    if payload.type: tx.type = payload.type
        
    db.commit()
    return {"message": "Updated successfully", "transaction_id": tx.id}