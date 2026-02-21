import uuid
from sqlalchemy.orm import Session
from app.models.domain import DocumentReport, ReportStatus, ExpenseTransaction, ExpenseCategory
from app.db.database import SessionLocal
from app.services.ai.gemini_client import GeminiClient

class ReceiptExtractorService:
    @staticmethod
    async def process_document_task(report_id: uuid.UUID, file_content: bytes, mime_type: str):
        db = SessionLocal()
        ai_client = GeminiClient()
        
        try:
            report = db.query(DocumentReport).filter(DocumentReport.id == report_id).first()
            if not report: return

            report.status = ReportStatus.PROCESSING
            db.commit()

            extracted_data, usage = await ai_client.extract_receipt_data(file_content, mime_type)
            
            print(f"--- AI EXTRACTION RESULT FOR {report.filename} ---")
            print(extracted_data)
            print(f"Usage: {usage}")
            print("--------------------------------------------------")

            if extracted_data and usage:
                report.prompt_tokens = usage["prompt_tokens"]
                report.completion_tokens = usage["completion_tokens"]
                report.total_tokens = usage["total_tokens"]

                fallback_category = db.query(ExpenseCategory).filter(
                    ExpenseCategory.name.ilike("%Others%")
                ).first()
                
                if not fallback_category:
                    fallback_category = db.query(ExpenseCategory).first()

                if not fallback_category:
                    raise Exception("Tabel expense_categories kosong. Harap lakukan seeding data kategori.")

                transactions_to_process = extracted_data if isinstance(extracted_data, list) else [extracted_data]

                for item in transactions_to_process:
                    category_name = item.get("suggested_category", "Others")
                    
                    category = db.query(ExpenseCategory).filter(
                        ExpenseCategory.name.ilike(f"%{category_name}%")
                    ).first()

                    final_category_id = category.id if category else fallback_category.id

                    new_transaction = ExpenseTransaction(
                        id=uuid.uuid4(),
                        report_id=report.id,
                        category_id=final_category_id, 
                        transaction_date=item.get("transaction_date"),
                        merchant_name=item.get("merchant_name"),
                        amount=item.get("total_amount", 0),
                        type="DEBIT" 
                    )
                    db.add(new_transaction)
                
                report.status = ReportStatus.COMPLETED
            else:
                report.status = ReportStatus.FAILED
                report.error_message = "AI returned empty data or usage metadata"

            db.commit()

        except Exception as e:
            db.rollback()
            print(f"Worker Error Detail: {str(e)}")
            if report:
                report.status = ReportStatus.FAILED
                report.error_message = str(e)
                db.commit()
        finally:
            db.close()