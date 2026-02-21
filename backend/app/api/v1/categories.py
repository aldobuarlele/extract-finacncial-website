from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.domain import ExpenseCategory

router = APIRouter()

@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(ExpenseCategory).filter(ExpenseCategory.parent_category_id == None).all()
    return categories