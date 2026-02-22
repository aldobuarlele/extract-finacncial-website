from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO
from sqlalchemy.orm import Session
from app.models.domain import DocumentReport, ExpenseTransaction
import datetime

def generate_expense_pdf(report_id, db: Session):
    report = db.query(DocumentReport).filter(DocumentReport.id == report_id).first()
    transactions = db.query(ExpenseTransaction).filter(ExpenseTransaction.report_id == report_id).all()
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Title'],
        fontSize=18,
        spaceAfter=20
    )
    elements.append(Paragraph(f"Expense Intelligence Report", title_style))
    elements.append(Paragraph(f"Filename: {report.filename}", styles['Normal']))
    elements.append(Paragraph(f"Date Exported: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
    elements.append(Spacer(1, 20))

    data = [["Date", "Merchant", "Category", "Type", "Amount"]]
    
    total_amount = 0
    for tx in transactions:
        row = [
            tx.transaction_date.strftime('%Y-%m-%d') if tx.transaction_date else "-",
            tx.merchant_name or "-",
            "Expense",
            tx.type or "DEBIT",
            f"{float(tx.amount):,.2f}"
        ]
        data.append(row)
        total_amount += float(tx.amount)

    # 4. Styling Tabel
    table = Table(data, colWidths=[80, 180, 80, 60, 90])
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (1, 1), (1, -1), 'LEFT'),
        ('ALIGN', (-1, 1), (-1, -1), 'RIGHT'), 
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ])
    table.setStyle(style)
    elements.append(table)

    elements.append(Spacer(1, 20))
    total_style = ParagraphStyle('TotalStyle', parent=styles['Normal'], alignment=2, fontSize=12, fontName='Helvetica-Bold')
    elements.append(Paragraph(f"TOTAL EXPENDITURE: {total_amount:,.2f}", total_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer