from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import categories, transactions, documents, exports
from app.api.middlewares.size_validator import MaxBodySizeMiddleware
from app.db.database import engine, Base
from app.models import domain 
from app.db.seed import seed_categories

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
seed_categories()

app = FastAPI(
    title="Expense Intelligence API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(MaxBodySizeMiddleware, max_size=5 * 1024 * 1024)

app.include_router(documents.router, prefix=f"{settings.API_V1_STR}/documents", tags=["documents"])
app.include_router(transactions.router, prefix=f"{settings.API_V1_STR}/transactions", tags=["transactions"])
app.include_router(categories.router, prefix=f"{settings.API_V1_STR}/categories", tags=["categories"])
app.include_router(exports.router, prefix=f"{settings.API_V1_STR}/exports", tags=["Exports"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "backend"}