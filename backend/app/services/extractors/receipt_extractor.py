import uuid
import asyncio
from sqlalchemy.orm import Session
from app.models.domain import DocumentReport, ReportStatus
from app.db.database import SessionLocal 

class ReceiptExtractorService:
    @staticmethod
    async def process_document_task(report_id: uuid.UUID):
        db = SessionLocal()
        try:
            report = db.query(DocumentReport).filter(DocumentReport.id == report_id).first()
            if not report:
                return

            report.status = ReportStatus.PROCESSING
            db.commit()
            print(f"Worker: Processing document {report.filename}...")

            await asyncio.sleep(5) 

            report.status = ReportStatus.COMPLETED
            db.commit()
            print(f"Worker: Success processing {report.filename}")

        except Exception as e:
            if report:
                report.status = ReportStatus.FAILED
                report.error_message = str(e)
                db.commit()
            print(f"Worker: Error processing document: {str(e)}")
        finally:
            db.close()