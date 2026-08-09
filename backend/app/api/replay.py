from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any

from app.services.replay_engine import replay_engine
from app.services.eri_engine import calculate_eri

router = APIRouter(prefix="/replay", tags=["Replay"])

class SpeedRequest(BaseModel):
    speed: float = Field(..., ge=0.25, le=10.0, description="Playback speed multiplier (0.5, 1, 2, 4)")

class SeekRequest(BaseModel):
    sample: int = Field(..., ge=1, description="1-based sample index to seek to")

class SwitchDatasetRequest(BaseModel):
    filename: str = Field(..., description="The CSV filename to load")

@router.post("/start")
async def start_replay():
    await replay_engine.start()
    return {"status": "SUCCESS", "message": "Replay started", "data": replay_engine.get_status()}

@router.post("/pause")
async def pause_replay():
    await replay_engine.pause()
    return {"status": "SUCCESS", "message": "Replay paused", "data": replay_engine.get_status()}

@router.post("/reset")
async def reset_replay():
    await replay_engine.reset()
    return {"status": "SUCCESS", "message": "Replay reset to sample 1", "data": replay_engine.get_status()}

@router.post("/speed")
async def set_replay_speed(req: SpeedRequest):
    await replay_engine.set_speed(req.speed)
    return {"status": "SUCCESS", "message": f"Speed set to {req.speed}x", "data": replay_engine.get_status()}

@router.post("/seek")
async def seek_replay(req: SeekRequest):
    await replay_engine.seek(req.sample)
    return {"status": "SUCCESS", "message": f"Seeked to sample {req.sample}", "data": replay_engine.get_status()}

@router.post("/dataset")
async def switch_dataset(req: SwitchDatasetRequest):
    replay_engine._load_dataset(req.filename)
    await replay_engine.reset()
    return {"status": "SUCCESS", "message": f"Switched dataset to {req.filename}", "data": replay_engine.get_status()}

@router.get("/status")
def get_replay_status():
    return replay_engine.get_status()

@router.get("/current")
def get_replay_current():
    reading = replay_engine.get_current_reading()
    if not reading:
        raise HTTPException(status_code=404, detail="No active replay reading found")
    eri = calculate_eri(reading.get("sensors", {}), reading.get("timestamp", ""))
    return {
        "reading": reading,
        "eri": eri,
        "status": replay_engine.get_status()
    }

@router.get("/samples")
def get_all_samples():
    samples = replay_engine.get_all_samples()
    return {
        "count": len(samples),
        "source": getattr(replay_engine, 'active_filename', 'kharghar_csv'),
        "samples": samples
    }
