from fastapi import APIRouter
from app.services.replay_engine import replay_engine
from app.services.eri_engine import calculate_eri

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])

@router.get("/live")
def get_live_telemetry():
    reading = replay_engine.get_current_reading()
    eri = calculate_eri(reading.get("sensors", {}), reading.get("timestamp", "")) if reading else {}
    return {
        "reading": reading,
        "eri": eri,
        "status": replay_engine.get_status()
    }

@router.get("/history")
def get_telemetry_history():
    samples = replay_engine.get_all_samples()
    return {
        "count": len(samples),
        "history": samples
    }
