import uuid
import enum
from sqlalchemy import Column, String, Text, DateTime, Date, Numeric, ForeignKey, Enum, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base

class ReportStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class TransactionType(str, enum.Enum):
    DEBIT = "DEBIT"
    CREDIT = "CREDIT"

class ExpenseCategory(Base):
    __tablename__ = "expense_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parent_category_id = Column(UUID(as_uuid=True), ForeignKey("expense_categories.id"), nullable=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    sub_categories = relationship("ExpenseCategory", backref="parent_category", remote_side=[id])
    transactions = relationship("ExpenseTransaction", back_populates="category")

class DocumentReport(Base):
    __tablename__ = "document_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_hash = Column(String, unique=True, nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    status = Column(Enum(ReportStatus), default=ReportStatus.PENDING, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    error_message = Column(Text, nullable=True)

    transactions = relationship("ExpenseTransaction", back_populates="report")

class ExpenseTransaction(Base):
    __tablename__ = "expense_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("document_reports.id"), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("expense_categories.id"), nullable=False)
    transaction_date = Column(Date, nullable=False)
    merchant_name = Column(String, nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)

    report = relationship("DocumentReport", back_populates="transactions")
    category = relationship("ExpenseCategory", back_populates="transactions")