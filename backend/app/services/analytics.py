from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.domain import ExpenseTransaction, ExpenseCategory, DocumentReport
import uuid

class AnalyticsService:
    @staticmethod
    def get_report_summary(db: Session, report_id: uuid.UUID):
        stats = db.query(
            func.sum(ExpenseTransaction.amount).label("total_spent"),
            func.count(ExpenseTransaction.id).label("transaction_count")
        ).filter(ExpenseTransaction.report_id == report_id).first()

        category_dist = db.query(
            ExpenseCategory.name,
            func.sum(ExpenseTransaction.amount).label("amount")
        ).join(ExpenseTransaction, ExpenseTransaction.category_id == ExpenseCategory.id) \
         .filter(ExpenseTransaction.report_id == report_id) \
         .group_by(ExpenseCategory.name).all()

        report = db.query(DocumentReport).filter(DocumentReport.id == report_id).first()

        return {
            "report_id": report_id,
            "filename": report.filename,
            "summary": {
                "total_spent": float(stats.total_spent or 0),
                "transaction_count": stats.transaction_count or 0,
                "currency": "IDR"
            },
            "category_distribution": {
                name: float(amount) for name, amount in category_dist
            },
            "ai_usage": {
                "total_tokens": report.total_tokens,
                "status": report.status
            }
        }