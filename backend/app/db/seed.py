import uuid
from app.db.database import SessionLocal
from app.models.domain import ExpenseCategory

def seed_categories():
    db = SessionLocal()
    try:
        categories_data = [
            {"name": "Food & Beverage", "sub": ["Restaurant", "Groceries", "Coffee"]},
            {"name": "Transportation", "sub": ["Fuel", "Parking", "Public Transport", "Ride Hailing"]},
            {"name": "Bills & Utilities", "sub": ["Electricity", "Water", "Internet", "Phone Credit"]},
            {"name": "Shopping", "sub": ["Clothing", "Electronics", "Hobbies"]},
            {"name": "Health", "sub": ["Pharmacy", "Doctor", "Gym"]}
        ]

        for item in categories_data:
            parent = db.query(ExpenseCategory).filter(ExpenseCategory.name == item["name"]).first()
            if not parent:
                parent = ExpenseCategory(id=uuid.uuid4(), name=item["name"])
                db.add(parent)
                db.flush()

            for sub_name in item["sub"]:
                sub_exists = db.query(ExpenseCategory).filter(
                    ExpenseCategory.name == sub_name, 
                    ExpenseCategory.parent_category_id == parent.id
                ).first()
                if not sub_exists:
                    sub_cat = ExpenseCategory(
                        id=uuid.uuid4(),
                        name=sub_name,
                        parent_category_id=parent.id
                    )
                    db.add(sub_cat)
        
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_categories()