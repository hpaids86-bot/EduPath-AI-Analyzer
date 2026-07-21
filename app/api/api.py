from fastapi import APIRouter
from app.api.endpoints import analysis, planner, papers, agent

api_router = APIRouter()

api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
api_router.include_router(planner.router, prefix="/studyplan", tags=["studyplan"])
api_router.include_router(papers.router, prefix="/papers", tags=["papers"])
api_router.include_router(agent.router, prefix="/agent", tags=["agent"])
