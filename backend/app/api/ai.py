from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.services.analytics_service import analytics_service
from app.services.ai_service import ai_service
from app.services.environmental_context import environmental_context_engine

router = APIRouter(prefix="/ai", tags=["AI Engine"])

@router.get("/analysis")
def get_ai_analysis():
    return analytics_service.get_full_analysis()

@router.get("/forecast")
def get_ai_forecast():
    analysis = analytics_service.get_full_analysis()
    return analysis["forecast"]

@router.get("/context")
def get_environmental_context():
    return environmental_context_engine.build_context()

@router.get("/hotspot")
def get_hotspot(parameter: str = "pm25"):
    return analytics_service.get_hotspot(parameter)

@router.get("/statistics")
def get_statistics(parameter: str = "pm25"):
    return analytics_service.get_parameter_statistics(parameter)

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    messages: Optional[List[Dict[str, str]]] = []
    history: Optional[List[dict]] = []

@router.post("/chat")
def chat_with_copilot(req: ChatRequest):
    """
    Environmental Intelligence Copilot endpoint powered by Gemini 2.5 Flash
    and deterministic AnalyticsService calculations.
    """
    history_to_use = req.messages or req.history or []
    res = ai_service.generate_chat_response(
        user_message=req.message,
        messages_history=history_to_use,
        context_override=req.context
    )
    return res
