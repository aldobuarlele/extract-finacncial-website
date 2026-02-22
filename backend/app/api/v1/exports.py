from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.exporters.pdf_builder import generate_expense_pdf
from app.services.exporters.excel_builder import generate_expense_excel
import uuid

router = APIRouter()

@router.get("/pdf/{report_id}")
async def export_pdf(report_id: uuid.UUID, db: Session = Depends(get_db)):
    pdf_buffer = generate_expense_pdf(report_id, db)
    
    filename = f"Expense_Report_{report_id}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/excel/{report_id}")
async def export_excel(report_id: uuid.UUID, db: Session = Depends(get_db)):
    excel_buffer = generate_expense_excel(report_id, db)
    
    filename = f"Expense_Report_{report_id}.xlsx"
    
    return StreamingResponse(
        excel_buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )