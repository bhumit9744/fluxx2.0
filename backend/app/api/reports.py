from fastapi import APIRouter, Response, UploadFile, File, HTTPException, Query, Request
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os

from app.services.report_service import report_service
from app.services.replay_engine import replay_engine
from app.services.analytics_service import analytics_service
from app.db.reports_db import reports_repository

router = APIRouter(prefix="/reports", tags=["Reports"])

class UploadCSVPayload(BaseModel):
    csv_text: str
    filename: Optional[str] = "custom_survey.csv"

class SaveReportPayload(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = "survey"
    location: Optional[str] = None
    language: Optional[str] = "en"

templates_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
templates = Jinja2Templates(directory=templates_dir)

@router.get("")
@router.get("/")
def get_all_reports(
    search: Optional[str] = Query(None, description="Search term for title, location, or id"),
    category: Optional[str] = Query(None, description="Filter by category (survey, analysis, compliance, incident)"),
    sort_by: str = Query("newest", description="Sort by newest, oldest, highest_risk, lowest_risk")
):
    """
    Returns list of stored reports from SQLite matching the query filters.
    """
    reports = reports_repository.get_all_reports(search=search, category=category, sort_by=sort_by)
    return {
        "status": "SUCCESS",
        "count": len(reports),
        "reports": reports
    }

@router.get("/data")
async def get_active_report_data():
    """
    Returns the active live report dossier data for current telemetry.
    """
    return await report_service.get_report_data()

@router.get("/{report_id}")
def get_report_by_id(report_id: str):
    """
    Fetches detailed metadata, analysis snapshot, and full dossier for a specific report.
    """
    report = reports_repository.get_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail=f"Report with ID {report_id} not found.")
    return {
        "status": "SUCCESS",
        "report": report
    }

@router.post("/generate")
async def generate_and_save_report(payload: Optional[SaveReportPayload] = None):
    """
    Generates a complete environmental report snapshot from active dataset observations
    and persists it into SQLite database.
    """
    lang = payload.language if payload else "en"
    full_report = await report_service.get_report_data(language=lang)
    dataset_info = analytics_service.get_dataset_info()
    analysis = analytics_service.get_full_analysis()

    title = payload.title if (payload and payload.title) else full_report["report"].get("title", "Kharghar Environmental Survey")
    rep_type = payload.type if (payload and payload.type) else "survey"
    location = payload.location if (payload and payload.location) else full_report["report"].get("location", "Kharghar, Navi Mumbai")

    stats = analysis.get("statistics", {})
    eri = analysis.get("eri", {})

    report_record = {
        "title": title,
        "type": rep_type,
        "location": location,
        "dataset": {
            "filename": dataset_info.get("source", "kharghar_survey.csv"),
            "observations": dataset_info.get("total_observations", 300),
            "startTime": dataset_info.get("time_range", {}).get("start", "00:00"),
            "endTime": dataset_info.get("time_range", {}).get("end", "23:59")
        },
        "metrics": {
            "pm25": stats.get("pm25", {}).get("current", 48.5),
            "pm10": stats.get("pm10", {}).get("current", 77.3),
            "co2": stats.get("co2", {}).get("current", 559.0),
            "temperature": stats.get("temperature", {}).get("current", 28.4),
            "humidity": stats.get("humidity", {}).get("current", 64.0),
            "wind": stats.get("windSpeed", {}).get("current", 4.2)
        },
        "risk": {
            "score": eri.get("score", 64),
            "level": eri.get("level", "MODERATE")
        },
        "summary": full_report.get("summary", {}).get("primary_driver", "Air quality survey analyzed by FLUXX."),
        "findings": [f"Dominant driver: {eri.get('primary_factor', 'PM2.5 Surge')}"],
        "pros": full_report.get("pros", []),
        "cons": full_report.get("cons", []),
        "recommendations": full_report.get("ai", {}).get("recommendations", []),
        "fullReport": full_report
    }

    report_id = reports_repository.save_report(report_record)
    saved_report = reports_repository.get_report_by_id(report_id)

    return {
        "status": "SUCCESS",
        "message": f"Report {report_id} generated and saved to repository.",
        "reportId": report_id,
        "report": saved_report
    }

@router.delete("/{report_id}")
def delete_report(report_id: str):
    """
    Deletes a report from the SQLite repository.
    """
    success = reports_repository.delete_report(report_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Report {report_id} not found.")
    return {
        "status": "SUCCESS",
        "message": f"Report {report_id} successfully removed."
    }

@router.get("/{report_id}/pdf")
def download_report_pdf(report_id: str):
    """
    Triggers PDF download metadata for a given report ID.
    """
    report = reports_repository.get_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail=f"Report {report_id} not found.")
    return {
        "status": "SUCCESS",
        "reportId": report_id,
        "title": report["title"],
        "pdfUrl": report.get("pdfUrl", f"/api/v1/reports/{report_id}/html")
    }

@router.get("/{report_id}/html")
def view_report_html(request: Request, report_id: str):
    """
    Renders the report as a styled HTML dossier.
    """
    report = reports_repository.get_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail=f"Report {report_id} not found.")
    
    report_data = report.get("fullReport", {})
    if not report_data:
        raise HTTPException(status_code=404, detail="HTML data missing from report.")
        
    lang = report_data.get("report", {}).get("language", "en")
    template_name = f"report_template_{lang}.html"
    if not os.path.exists(os.path.join(templates_dir, template_name)):
        template_name = "report_template_en.html"
        
    return templates.TemplateResponse(
        template_name,
        {
            "request": request,
            **report_data
        }
    )

@router.post("/upload-csv")
async def upload_csv_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        csv_str = content.decode("utf-8", errors="ignore")
        res = replay_engine.load_custom_csv(csv_str, filename=file.filename or "uploaded.csv")
        fresh_report = await report_service.get_report_data()
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
async def upload_csv_text(payload: UploadCSVPayload):
    try:
        res = replay_engine.load_custom_csv(payload.csv_text, filename=payload.filename or "uploaded.csv")
        fresh_report = await report_service.get_report_data()
        return {
            "status": "SUCCESS",
            "message": f"Successfully ingested {res['observations_count']} observations.",
            "observations_count": res["observations_count"],
            "report": fresh_report,
            "analysis": analytics_service.get_full_analysis()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")
