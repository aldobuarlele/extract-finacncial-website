from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="Expense Intelligence API", version="1.0.0")

@app.get("/health")
async def health_check():
    return JSONResponse(content={"status": "ok", "service": "backend"})