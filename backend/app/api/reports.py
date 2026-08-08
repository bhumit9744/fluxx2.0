from fastapi import APIRouter, Response, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.services.report_service import report_service
from app.services.replay_engine import replay_engine
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/reports", tags=["Reports"])

class UploadCSVPayload(BaseModel):
    csv_text: str
    filename: Optional[str] = "custom_survey.csv"

@router.get("/data")
def get_report_data():
    return report_service.get_report_data()

@router.post("/generate")
def generate_report():
    return {
        "status": "SUCCESS",
        "message": "AI Environmental Compliance Audit Report generated",
        "report": report_service.get_report_data()
    }

@router.post("/upload-csv")
async def upload_csv_file(file: UploadFile = File(...)):
    """
    Accepts a user-uploaded CSV file, parses the observations,
    activates it across all analytics engines, and re-generates the report.
    """
    try:
        content = await file.read()
        csv_str = content.decode("utf-8", errors="ignore")
        res = replay_engine.load_custom_csv(csv_str, filename=file.filename or "uploaded.csv")
        fresh_report = report_service.get_report_data()
        return {
            "status": "SUCCESS",
            "message": f"Successfully ingested {res['observations_count']} environmental observations from {file.filename}.",
            "observations_count": res["observations_count"],
            "report": fresh_report,
            "analysis": analytics_service.get_full_analysis()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")

@router.post("/upload-csv-text")
def upload_csv_text(payload: UploadCSVPayload):
    """
    Accepts raw CSV text in JSON payload for programmatic ingestion.
    """
    try:
        res = replay_engine.load_custom_csv(payload.csv_text, filename=payload.filename or "uploaded.csv")
        fresh_report = report_service.get_report_data()
        return {
            "status": "SUCCESS",
            "message": f"Successfully ingested {res['observations_count']} observations.",
            "observations_count": res["observations_count"],
            "report": fresh_report,
            "analysis": analytics_service.get_full_analysis()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")
