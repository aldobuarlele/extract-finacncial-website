from fastapi import APIRouter, Depends, UploadFile, File, status, HTTPException # FIX 1: Tambahkan HTTPException
from sqlalchemy.orm import Session
import uuid
from app.db.database import get_db
from app.models.domain import DocumentReport, ReportStatus
from app.utils.file_hashing import calculate_hash
from app.worker import process_document_task_celery 

router = APIRouter()

@router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_document(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    content = await file.read()
    file_hash = await calculate_hash(content)

    existing_report = db.query(DocumentReport).filter(DocumentReport.file_hash == file_hash).first()
    
    if existing_report:
        return {
            "message": "File already exists",
            "report_id": existing_report.id,
            "status": existing_report.status
        }

    new_report = DocumentReport(
        id=uuid.uuid4(),
        filename=file.filename,
        file_type=file.content_type,
        file_hash=file_hash,
        status=ReportStatus.PENDING
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    process_document_task_celery.delay(
        str(new_report.id), 
        content, 
        file.content_type
    )    
    
    return {
        "message": "Document accepted and queued for processing",
        "report_id": new_report.id,
        "status": new_report.status
    }

@router.get("/")
async def get_all_documents(db: Session = Depends(get_db)):
    """
    Mengambil riwayat semua dokumen yang pernah diunggah.
    """
    docs = db.query(DocumentReport).order_by(DocumentReport.uploaded_at.desc()).all()
    
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "status": doc.status,
            "created_at": doc.uploaded_at 
        }
        for doc in docs
    ]

@router.get("/{report_id}")
def get_report_status(report_id: uuid.UUID, db: Session = Depends(get_db)):
    report = db.query(DocumentReport).filter(DocumentReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report