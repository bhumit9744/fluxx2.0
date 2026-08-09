from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.services.analytics_service import analytics_service
from app.services.environmental_context import environmental_context_engine
from app.services.ai_service import ai_service
from app.services.csv_ai.csv_tools import csv_tools
from app.services.rag_engine import rag_engine

router = APIRouter(prefix="/ai", tags=["AI Engine"])

@router.get("/analysis")
def get_ai_analysis():
    return analytics_service.get_full_analysis()

@router.post("/rag/sync")
def sync_rag_index():
    result = rag_engine.build_index()
    return result

@router.get("/forecast")
def get_ai_forecast():
    analysis = analytics_service.get_full_analysis()
    return analysis["forecast"]

@router.get("/context")
def get_environmental_context():
    # Keep the old one for compatibility if needed, but also the new one.
    # The new request asked for a different response:
    # return { "dataset": "kharghar.csv", "rows": 300, ... }
    # Let's return the new schema format.
    try:
        files = csv_tools.list_files("environment")
        if files["count"] > 0:
            dataset = files["files"][0]
            schema = csv_tools.schema(dataset, "environment")
            return {
                "dataset": dataset,
                "rows": schema["rows"],
                "parameters": schema["parameters"],
                "grounded": True
            }
        return {"grounded": False}
    except Exception:
        return environmental_context_engine.build_context()

@router.get("/hotspot")
def get_hotspot(parameter: str = "pm25"):
    return analytics_service.get_hotspot(parameter)

@router.get("/statistics")
def get_statistics(parameter: str = "pm25"):
    return analytics_service.get_parameter_statistics(parameter)

@router.get("/datasets")
async def datasets():
    return csv_tools.list_files("environment")

@router.get("/datasets/{filename}")
async def dataset_schema(filename: str):
    return csv_tools.schema(filename, "environment")

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    history: list = []

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        result = await ai_service.chat(
            question=request.message,
            history=request.history,
        )
        return result

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:
        print(f"Error in chat endpoint: {exc}")
        raise HTTPException(
            status_code=500,
            detail="AI service failed",
        )
