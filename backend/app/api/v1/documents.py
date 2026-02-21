from fastapi import APIRouter, Depends, UploadFile, File, status, BackgroundTasks
from sqlalchemy.orm import Session
import uuid
from app.db.database import get_db
from app.models.domain import DocumentReport, ReportStatus
from app.utils.file_hashing import calculate_hash
from app.services.extractors.receipt_extractor import ReceiptExtractorService 

router = APIRouter()

@router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_document(
    background_tasks: BackgroundTasks,
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

    background_tasks.add_task(
    ReceiptExtractorService.process_document_task, 
    new_report.id, 
    content, 
    file.content_type
    )    
    
    return {
        "message": "Document accepted and queued for processing",
        "report_id": new_report.id,
        "status": new_report.status
    }