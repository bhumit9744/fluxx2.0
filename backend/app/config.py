import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]

DATA_DIR = BASE_DIR / "data"
ENVIRONMENT_DATA_DIR = DATA_DIR / "environment"
TELEMETRY_DATA_DIR = DATA_DIR / "telemetry"
KNOWLEDGE_DATA_DIR = DATA_DIR / "knowledge"

class Settings:
    PROJECT_NAME: str = "FLUXX Environmental Intelligence"
    VERSION: str = "3.0.0"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list = ["*"]
    
    # Base directory
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATASET_PATH: str = os.path.join(BASE_DIR, "data", "kharghar_dataset.csv")

settings = Settings()
