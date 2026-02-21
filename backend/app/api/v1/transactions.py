from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from app.db.database import get_db
from app.models.domain import DocumentReport

router = APIRouter()

@router.get("/{report_id}")
def get_transaction_status(report_id: uuid.UUID, db: Session = Depends(get_db)):
    report = db.query(DocumentReport).filter(DocumentReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return report