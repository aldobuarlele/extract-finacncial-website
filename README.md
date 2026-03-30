# Expense Intelligence System

An automated expense tracking and classification system. It extracts transactional data from bank statement PDFs or screenshots using native text extraction and Vision AI, strictly classifying them into user-defined categories.

## System Architecture

This project utilizes a Monorepo architecture separating the backend API and frontend UI, orchestrated via Docker.

* **Backend:** Python 3.11, FastAPI, SQLAlchemy
* **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
* **Background Worker:** Celery, Redis
* **Database:** PostgreSQL
* **AI Engine:** Integration with LLM/Vision capabilities for OCR fallback and structured JSON classification.

## Directory Structure

* `/backend` - Contains the FastAPI application, background tasks, and core extraction logic.
* `/frontend` - Contains the Next.js user interface.

## Local Development Setup (Manual)

### Backend
1. `cd backend`
2. `conda activate expense_intel`
3. `uvicorn app.main:app --reload --port 8000`

### Frontend
1. `cd frontend`
2. `npm run dev`
