import pandas as pd
from io import BytesIO
from sqlalchemy.orm import Session
from app.models.domain import ExpenseTransaction, DocumentReport

def generate_expense_excel(report_id, db: Session):
    transactions = db.query(ExpenseTransaction).filter(ExpenseTransaction.report_id == report_id).all()
    report = db.query(DocumentReport).filter(DocumentReport.id == report_id).first()

    data = []
    for tx in transactions:
        data.append({
            "Date": tx.transaction_date,
            "Merchant": tx.merchant_name,
            "Category": "Expense", 
            "Type": tx.type,
            "Amount": float(tx.amount)
        })

    df = pd.DataFrame(data)

    buffer = BytesIO()
    with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Transactions')
        
        worksheet = writer.sheets['Transactions']
        for i, col in enumerate(df.columns):
            column_len = max(df[col].astype(str).map(len).max(), len(col)) + 2
            worksheet.column_dimensions[chr(65 + i)].width = column_len

    buffer.seek(0)
    return buffer