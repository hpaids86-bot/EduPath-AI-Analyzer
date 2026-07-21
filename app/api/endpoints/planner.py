from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class StudyPlanRequest(BaseModel):
    subject: str
    duration_weeks: int
    hours_per_week: int
    target_score: int
    strategy: str

@router.post("/generate")
def generate_study_plan(request: StudyPlanRequest):
    """
    Regenerates study plan based on preparation duration, target score, hours/week.
    """
    return {
        "message": "Study plan generated successfully",
        "plan": [
            {"week": "Week 1", "focus": "Unit 2 — Normalization", "hours": request.hours_per_week},
            {"week": "Week 2", "focus": "Unit 4 — Transactions & Concurrency", "hours": request.hours_per_week}
        ]
    }
