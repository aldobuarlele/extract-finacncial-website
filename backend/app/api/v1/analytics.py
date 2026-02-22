from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.analytics import AnalyticsService
import uuid

router = APIRouter()

@router.get("/summary/{report_id}")
async def get_report_analytics(report_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Mengambil ringkasan statistik untuk laporan tertentu.
    Data ini digunakan untuk Pie Chart dan Ringkasan Finansial di Dashboard.
    """
    try:
        summary = AnalyticsService.get_report_summary(db, report_id)
        if not summary:
            raise HTTPException(status_code=404, detail="Data analytics tidak ditemukan")
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses data: {str(e)}")