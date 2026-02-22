import pandas as pd
from io import BytesIO
from sqlalchemy.orm import Session
from app.models.domain import ExpenseTransaction, DocumentReport, ExpenseCategory

def generate_expense_excel(report_id, db: Session):
    transactions = db.query(ExpenseTransaction).join(ExpenseCategory)\
        .filter(ExpenseTransaction.report_id == report_id).all()
    
    data = []
    for tx in transactions:
        category_name = tx.category.name if tx.category else "Uncategorized"
        transaction_type = tx.type.name if hasattr(tx.type, 'name') else str(tx.type)

        data.append({
            "Date": tx.transaction_date,
            "Merchant": tx.merchant_name,
            "Category": category_name,
            "Type": transaction_type, 
            "Amount": float(tx.amount)
        })

    df = pd.DataFrame(data)

    buffer = BytesIO()
    with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Transactions')
        
        worksheet = writer.sheets['Transactions']
        for i, col in enumerate(df.columns):
            max_len = len(col)
            for item in df[col]:
                if item is not None:
                    max_len = max(max_len, len(str(item)))
            
            adjusted_width = (max_len + 2)
            worksheet.column_dimensions[chr(65 + i)].width = adjusted_width

    buffer.seek(0)
    return buffer