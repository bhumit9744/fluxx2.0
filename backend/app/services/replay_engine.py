import asyncio
import csv
import logging
import os
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from app.config import settings
from app.services.data_normalizer import normalize_environmental_reading
from app.services.eri_engine import calculate_eri
from app.services.websocket_manager import ws_manager

logger = logging.getLogger("fluxx.replay")

class ReplayEngine:
    def __init__(self):
        self.samples: List[Dict[str, Any]] = []
        self.current_idx: int = 0  # 0-indexed
        self.is_playing: bool = False
        self.speed: float = 1.0
        self.task: Optional[asyncio.Task] = None
        self.active_filename: str = "kharghar_survey.csv"
        self._load_dataset()

    def _load_dataset(self, filename: str = None):
        csv_path = settings.DATASET_PATH
        if filename:
            from app.config import ENVIRONMENT_DATA_DIR
            csv_path = ENVIRONMENT_DATA_DIR / filename
            
        if not os.path.exists(csv_path):
            logger.error(f"Dataset not found at {csv_path}")
            return
        
        raw_rows = []
        with open(csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                raw_rows.append(row)
                
        total = len(raw_rows)
        self.samples = [
            normalize_environmental_reading(row, sample_idx=i + 1, total_samples=total)
            for i, row in enumerate(raw_rows)
        ]
        if filename:
            self.active_filename = filename
            self.current_idx = 0
            
        logger.info(f"Loaded {len(self.samples)} observations from {csv_path}")

    def load_custom_csv(self, csv_content: str, filename: str = "uploaded_dataset.csv") -> Dict[str, Any]:
        """
        Parses and activates an uploaded user CSV dataset in real time.
        """
        import io
        f = io.StringIO(csv_content.strip())
        reader = csv.DictReader(f)
        raw_rows = [row for row in reader if any(row.values())]
        
        if not raw_rows:
            raise ValueError("CSV file is empty or could not be parsed.")

        total = len(raw_rows)
        new_samples = [
            normalize_environmental_reading(row, sample_idx=i + 1, total_samples=total)
            for i, row in enumerate(raw_rows)
        ]
        
        self.samples = new_samples
        self.current_idx = 0
        self.active_filename = filename
        
        # Save to data directory for persistence
        save_path = os.path.join(os.path.dirname(settings.DATASET_PATH), "active_uploaded.csv")
        try:
            with open(save_path, "w", encoding="utf-8") as out:
                out.write(csv_content)
        except Exception:
            pass

        return {
            "status": "SUCCESS",
            "filename": filename,
            "observations_count": len(self.samples),
            "first_sample": self.samples[0] if self.samples else None
        }

    def get_current_reading(self) -> Dict[str, Any]:
        if not self.samples:
            return {}
        return self.samples[self.current_idx]

    def get_all_samples(self) -> List[Dict[str, Any]]:
        return self.samples

    def get_status(self) -> Dict[str, Any]:
        curr = self.get_current_reading()
        return {
            "playing": self.is_playing,
            "status": "PLAYING" if self.is_playing else "PAUSED",
            "speed": self.speed,
            "currentSample": self.current_idx + 1,
            "totalSamples": len(self.samples),
            "timestamp": curr.get("timestamp", ""),
            "source": getattr(self, "active_filename", "kharghar_dataset.csv"),
            "mode": "replay"
        }

    async def start(self):
        if self.is_playing:
            return
        self.is_playing = True
        if self.task is None or self.task.done():
            self.task = asyncio.create_task(self._loop())
        logger.info("Replay engine started.")

    async def pause(self):
        self.is_playing = False
        if self.task and not self.task.done():
            self.task.cancel()
            self.task = None
        logger.info("Replay engine paused.")

    async def reset(self):
        await self.pause()
        self.current_idx = 0
        await self._broadcast_current()
        logger.info("Replay engine reset to sample 1.")

    async def set_speed(self, speed: float):
        self.speed = max(0.25, min(10.0, float(speed)))
        logger.info(f"Replay speed set to {self.speed}x")

    async def seek(self, sample_number: int):
        target = max(1, min(len(self.samples), sample_number))
        self.current_idx = target - 1
        await self._broadcast_current()
        logger.info(f"Replay seeked to sample {target}/{len(self.samples)}")

    async def _broadcast_current(self):
        if not self.samples:
            return
        reading = self.get_current_reading()
        eri = calculate_eri(reading.get("sensors", {}), reading.get("timestamp", ""))
        payload = {
            "type": "TELEMETRY_UPDATE",
            "reading": reading,
            "eri": eri,
            "status": self.get_status()
        }
        await ws_manager.broadcast_json(payload)

    async def _loop(self):
        try:
            while self.is_playing and self.samples:
                await self._broadcast_current()
                
                # Dynamic interval: 3.0s / speed
                interval = max(0.1, 3.0 / self.speed)
                await asyncio.sleep(interval)
                
                self.current_idx = (self.current_idx + 1) % len(self.samples)
        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.error(f"Error in replay loop: {e}")
            self.is_playing = False

replay_engine = ReplayEngine()
