import sqlite3
import json
import os
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "reports.db")

class ReportsRepository:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS reports (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    type TEXT NOT NULL,
                    location TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    dataset_name TEXT,
                    observation_count INTEGER,
                    start_time TEXT,
                    end_time TEXT,
                    pm25 REAL,
                    pm10 REAL,
                    co2 REAL,
                    temperature REAL,
                    humidity REAL,
                    wind REAL,
                    eri_score INTEGER,
                    risk_level TEXT,
                    summary TEXT,
                    findings_json TEXT,
                    pros_json TEXT,
                    cons_json TEXT,
                    recommendations_json TEXT,
                    full_report_json TEXT,
                    pdf_path TEXT
                )
            """)
            conn.commit()

            # Seed if table is empty
            cursor.execute("SELECT COUNT(*) as count FROM reports")
            count = cursor.fetchone()["count"]
            if count == 0:
                self._seed_initial_reports(cursor)
                conn.commit()

    def _seed_initial_reports(self, cursor):
        initial_reports = [
            {
                "id": "FLX-REP-20260809-001",
                "title": "Kharghar Environmental Survey",
                "type": "survey",
                "location": "Kharghar, Navi Mumbai",
                "created_at": "2026-08-09T01:20:00Z",
                "dataset_name": "kharghar_survey.csv",
                "observation_count": 300,
                "start_time": "00:00",
                "end_time": "23:59",
                "pm25": 48.5,
                "pm10": 77.3,
                "co2": 559.0,
                "temperature": 28.4,
                "humidity": 64.0,
                "wind": 4.2,
                "eri_score": 64,
                "risk_level": "MODERATE",
                "summary": "Air in Kharghar is classified as MODERATE with an ERI of 64. Primary risk driver is localized particulate matter (PM2.5) with highest elevation observed in Sector 4.",
                "findings_json": json.dumps([
                    "Elevated particulate concentration detected in Sector 4",
                    "Wind stagnation exacerbating localized accumulation",
                    "CO₂ and temperature within nominal bounds"
                ]),
                "pros_json": json.dumps([
                    "CO2 levels safely within normal ambient thresholds",
                    "Atmospheric dispersion active during morning hours",
                    "High sensor network integrity across all 300 points"
                ]),
                "cons_json": json.dumps([
                    "PM2.5 exceeds WHO standard by 3.2x during peak afternoon hours",
                    "Wind stagnation increases localized exposure risks in Sector 4"
                ]),
                "recommendations_json": json.dumps([
                    {"title": "Deploy misting units in Sector 4", "action": "Activate autonomous ground misting systems to suppress airborne PM2.5."},
                    {"title": "Optimize drone sampling frequency", "action": "Increase drone inspection passes between 14:00 and 18:00."},
                    {"title": "Issue public health advisory", "action": "Advise vulnerable residents in Sector 4 to limit strenuous outdoor activity."}
                ]),
                "pdf_path": "/reports/FLX-REP-20260809-001.pdf"
            },
            {
                "id": "FLX-REP-20260808-001",
                "title": "Kharghar PM2.5 Analysis",
                "type": "analysis",
                "location": "Kharghar Sector 3 & 4",
                "created_at": "2026-08-08T18:45:00Z",
                "dataset_name": "kharghar_pm25_audit.csv",
                "observation_count": 250,
                "start_time": "06:00",
                "end_time": "18:00",
                "pm25": 46.8,
                "pm10": 74.1,
                "co2": 540.0,
                "temperature": 29.1,
                "humidity": 61.0,
                "wind": 4.8,
                "eri_score": 59,
                "risk_level": "MODERATE",
                "summary": "Detailed PM2.5 spatial audit across 250 telemetry checkpoints. Spatial interpolation localized primary source near eastern transport corridor.",
                "findings_json": json.dumps([
                    "Corridor traffic responsible for 42% of fine particulate spikes",
                    "Evening dispersion rate improved by 14% with wind pick-up"
                ]),
                "pros_json": json.dumps([
                    "Rapid dispersion observed along highway perimeter",
                    "Humidity levels optimal for drone battery efficiency"
                ]),
                "cons_json": json.dumps([
                    "Transient PM2.5 surge during peak rush hour"
                ]),
                "recommendations_json": json.dumps([
                    {"title": "Traffic flow modulation", "action": "Coordinate with municipal traffic control to alleviate congestion bottlenecks."}
                ]),
                "pdf_path": "/reports/FLX-REP-20260808-001.pdf"
            },
            {
                "id": "FLX-REP-20260807-001",
                "title": "Environmental Compliance Report",
                "type": "compliance",
                "location": "Navi Mumbai Industrial Belt",
                "created_at": "2026-08-07T12:00:00Z",
                "dataset_name": "compliance_baseline.csv",
                "observation_count": 180,
                "start_time": "08:00",
                "end_time": "16:00",
                "pm25": 32.1,
                "pm10": 58.4,
                "co2": 490.0,
                "temperature": 27.5,
                "humidity": 58.0,
                "wind": 5.4,
                "eri_score": 38,
                "risk_level": "NOMINAL",
                "summary": "Comprehensive regulatory compliance verification. Overall environmental compliance rate verified at 97% across monitored industrial sectors.",
                "findings_json": json.dumps([
                    "All particulate and chemical markers within statutory limits",
                    "Industrial emissions scrubbers functioning optimally"
                ]),
                "pros_json": json.dumps([
                    "Zero hazardous emission breaches detected",
                    "Compliance index at 97% (statutory target > 90%)"
                ]),
                "cons_json": json.dumps([
                    "Slight PM10 uptick near unpaved perimeter roads"
                ]),
                "recommendations_json": json.dumps([
                    {"title": "Maintain routine drone audits", "action": "Schedule next regulatory drone flight in 7 days."}
                ]),
                "pdf_path": "/reports/FLX-REP-20260807-001.pdf"
            }
        ]

        for r in initial_reports:
            cursor.execute("""
                INSERT INTO reports (
                    id, title, type, location, created_at, dataset_name, observation_count,
                    start_time, end_time, pm25, pm10, co2, temperature, humidity, wind,
                    eri_score, risk_level, summary, findings_json, pros_json, cons_json,
                    recommendations_json, pdf_path
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                r["id"], r["title"], r["type"], r["location"], r["created_at"], r["dataset_name"],
                r["observation_count"], r["start_time"], r["end_time"], r["pm25"], r["pm10"],
                r["co2"], r["temperature"], r["humidity"], r["wind"], r["eri_score"],
                r["risk_level"], r["summary"], r["findings_json"], r["pros_json"], r["cons_json"],
                r["recommendations_json"], r["pdf_path"]
            ))

    def get_all_reports(
        self, 
        search: Optional[str] = None, 
        category: Optional[str] = None, 
        sort_by: str = "newest"
    ) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM reports WHERE 1=1"
            params = []

            if category and category.lower() not in ["all", ""]:
                cat_map = {
                    "surveys": "survey",
                    "environmental analysis": "analysis",
                    "analysis": "analysis",
                    "compliance": "compliance",
                    "incident reports": "incident",
                    "incident": "incident"
                }
                normalized_cat = cat_map.get(category.lower(), category.lower())
                query += " AND type = ?"
                params.append(normalized_cat)

            if search and search.strip():
                s = f"%{search.strip().lower()}%"
                query += " AND (LOWER(title) LIKE ? OR LOWER(location) LIKE ? OR LOWER(type) LIKE ? OR LOWER(id) LIKE ?)"
                params.extend([s, s, s, s])

            # Sorting
            if sort_by == "oldest":
                query += " ORDER BY created_at ASC"
            elif sort_by == "highest_risk" or sort_by == "highest risk":
                query += " ORDER BY eri_score DESC, created_at DESC"
            elif sort_by == "lowest_risk" or sort_by == "lowest risk":
                query += " ORDER BY eri_score ASC, created_at DESC"
            else:  # newest
                query += " ORDER BY created_at DESC"

            cursor.execute(query, params)
            rows = cursor.fetchall()
            results = []
            for row in rows:
                results.append({
                    "id": row["id"],
                    "title": row["title"],
                    "type": row["type"],
                    "location": row["location"],
                    "createdAt": row["created_at"],
                    "created_at": row["created_at"],
                    "dataset": {
                        "filename": row["dataset_name"] or "survey.csv",
                        "observations": row["observation_count"] or 0,
                        "startTime": row["start_time"] or "00:00",
                        "endTime": row["end_time"] or "23:59"
                    },
                    "observations": row["observation_count"] or 0,
                    "metrics": {
                        "pm25": row["pm25"],
                        "pm10": row["pm10"],
                        "co2": row["co2"],
                        "temperature": row["temperature"],
                        "humidity": row["humidity"],
                        "wind": row["wind"]
                    },
                    "pm25": row["pm25"],
                    "eri": row["eri_score"],
                    "risk": {
                        "score": row["eri_score"],
                        "level": row["risk_level"]
                    },
                    "risk_level": row["risk_level"],
                    "summary": row["summary"],
                    "pdfUrl": row["pdf_path"]
                })
            return results

    def get_report_by_id(self, report_id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM reports WHERE id = ?", (report_id,))
            row = cursor.fetchone()
            if not row:
                return None

            findings = json.loads(row["findings_json"]) if row["findings_json"] else []
            pros = json.loads(row["pros_json"]) if row["pros_json"] else []
            cons = json.loads(row["cons_json"]) if row["cons_json"] else []
            recommendations = json.loads(row["recommendations_json"]) if row["recommendations_json"] else []
            full_report = json.loads(row["full_report_json"]) if row["full_report_json"] else None

            return {
                "id": row["id"],
                "title": row["title"],
                "type": row["type"],
                "location": row["location"],
                "createdAt": row["created_at"],
                "created_at": row["created_at"],
                "dataset": {
                    "filename": row["dataset_name"] or "survey.csv",
                    "observations": row["observation_count"] or 0,
                    "startTime": row["start_time"] or "00:00",
                    "endTime": row["end_time"] or "23:59"
                },
                "observations": row["observation_count"] or 0,
                "metrics": {
                    "pm25": row["pm25"],
                    "pm10": row["pm10"],
                    "co2": row["co2"],
                    "temperature": row["temperature"],
                    "humidity": row["humidity"],
                    "wind": row["wind"]
                },
                "risk": {
                    "score": row["eri_score"],
                    "level": row["risk_level"]
                },
                "summary": row["summary"],
                "findings": findings,
                "pros": pros,
                "cons": cons,
                "recommendations": recommendations,
                "fullReport": full_report,
                "pdfUrl": row["pdf_path"]
            }

    def save_report(self, report_data: Dict[str, Any]) -> str:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Generate sequential ID for today
            today_str = datetime.now(timezone.utc).strftime("%Y%m%d")
            cursor.execute("SELECT COUNT(*) as count FROM reports WHERE id LIKE ?", (f"FLX-REP-{today_str}-%",))
            seq = cursor.fetchone()["count"] + 1
            report_id = f"FLX-REP-{today_str}-{seq:03d}"

            now_iso = datetime.now(timezone.utc).isoformat()
            title = report_data.get("title", f"Environmental Intelligence Survey")
            rep_type = report_data.get("type", "survey")
            location = report_data.get("location", "Kharghar, Navi Mumbai")

            dataset = report_data.get("dataset", {})
            metrics = report_data.get("metrics", {})
            risk = report_data.get("risk", {})

            cursor.execute("""
                INSERT INTO reports (
                    id, title, type, location, created_at, dataset_name, observation_count,
                    start_time, end_time, pm25, pm10, co2, temperature, humidity, wind,
                    eri_score, risk_level, summary, findings_json, pros_json, cons_json,
                    recommendations_json, full_report_json, pdf_path
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                report_id,
                title,
                rep_type,
                location,
                now_iso,
                dataset.get("filename", "survey.csv"),
                dataset.get("observations", 300),
                dataset.get("startTime", "00:00"),
                dataset.get("endTime", "23:59"),
                metrics.get("pm25", 48.5),
                metrics.get("pm10", 77.3),
                metrics.get("co2", 559.0),
                metrics.get("temperature", 28.4),
                metrics.get("humidity", 64.0),
                metrics.get("wind", 4.2),
                risk.get("score", 64),
                risk.get("level", "MODERATE"),
                report_data.get("summary", "Environmental survey generated autonomously by FLUXX."),
                json.dumps(report_data.get("findings", [])),
                json.dumps(report_data.get("pros", [])),
                json.dumps(report_data.get("cons", [])),
                json.dumps(report_data.get("recommendations", [])),
                json.dumps(report_data.get("fullReport", None)),
                f"/reports/{report_id}.pdf"
            ))
            conn.commit()
            return report_id

    def delete_report(self, report_id: str) -> bool:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM reports WHERE id = ?", (report_id,))
            conn.commit()
            return cursor.rowcount > 0

reports_repository = ReportsRepository()
