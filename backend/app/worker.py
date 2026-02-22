from celery import Celery
import asyncio
import uuid
from app.services.extractors.receipt_extractor import ReceiptExtractorService

celery_app = Celery(
    "expense_worker",
    broker="redis://redis_cache:6379/0",
    backend="redis://redis_cache:6379/0"
)

celery_app.conf.task_routes = {
    "app.worker.process_document_task_celery": {"queue": "expense_tasks"}
}

@celery_app.task(name="app.worker.process_document_task_celery")
def process_document_task_celery(report_id_str: str, file_content: bytes, mime_type: str):
    """
    Task pembungkus Celery yang stabil.
    Menggunakan asyncio.run() untuk memastikan setiap task memiliki 
    event loop-nya sendiri di dalam worker Celery yang bersifat synchronous.
    """
    report_id = uuid.UUID(report_id_str)
    
    return asyncio.run(
        ReceiptExtractorService.process_document_task(report_id, file_content, mime_type)
    )