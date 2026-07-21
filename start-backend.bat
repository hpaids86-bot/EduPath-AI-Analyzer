@echo off
echo Starting ExamInsight Backend server...
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
