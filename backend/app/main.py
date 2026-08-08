import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.services.websocket_manager import ws_manager
from app.services.replay_engine import replay_engine

from app.api.replay import router as replay_router
from app.api.heatmap import router as heatmap_router
from app.api.telemetry import router as telemetry_router
from app.api.ai import router as ai_router
from app.api.reports import router as reports_router
from app.api.dashboard import router as dashboard_router
from app.api.analysis import router as analysis_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("fluxx.backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("FLUXX 3.0 Environmental Intelligence Backend Starting...")
    yield
    if replay_engine.is_playing:
        await replay_engine.pause()
    logger.info("FLUXX 3.0 Backend Shutdown.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FLUXX 3.0 — Real-Time Environmental Intelligence & Spatial Digital Twin Engine",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST API Routers
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(analysis_router, prefix=settings.API_V1_STR)
app.include_router(replay_router, prefix=settings.API_V1_STR)
app.include_router(heatmap_router, prefix=settings.API_V1_STR)
app.include_router(telemetry_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)

# Also mount on /api direct routes for seamless compatibility
app.include_router(dashboard_router, prefix="")
app.include_router(analysis_router, prefix="")
app.include_router(replay_router, prefix="")
app.include_router(heatmap_router, prefix="")
app.include_router(telemetry_router, prefix="")
app.include_router(ai_router, prefix="")
app.include_router(reports_router, prefix="")

@app.get("/")
def root():
    status = replay_engine.get_status()
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "ONLINE",
        "dataset": "Kharghar 50-Node Diurnal Survey (kharghar_dataset.csv)",
        "observations_loaded": status["totalSamples"],
        "frontend_url": "http://localhost:5173",
        "api_docs": "/docs",
        "endpoints": {
            "health": "/health",
            "ai_chat": "/api/ai/chat",
            "ai_context": "/api/ai/context",
            "heatmap": "/api/heatmap?parameter=pm25",
            "telemetry_history": "/api/telemetry/history",
            "report_download": "/api/reports/download",
            "replay_samples": "/api/replay/samples"
        }
    }

@app.get("/health")
def health_check():
    status = replay_engine.get_status()
    return {
        "status": "HEALTHY",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "observations_loaded": status["totalSamples"],
        "active_sample": status["currentSample"],
        "replay_active": status["playing"]
    }

@app.websocket("/ws/live")
async def websocket_live_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    # Send initial state immediately upon connection
    initial_reading = replay_engine.get_current_reading()
    if initial_reading:
        from app.services.eri_engine import calculate_eri
        eri = calculate_eri(initial_reading.get("sensors", {}), initial_reading.get("timestamp", ""))
        await websocket.send_json({
            "type": "INITIAL_STATE",
            "reading": initial_reading,
            "eri": eri,
            "status": replay_engine.get_status()
        })
        
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming client commands if any
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)
