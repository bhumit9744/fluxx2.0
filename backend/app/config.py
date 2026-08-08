import os

class Settings:
    PROJECT_NAME: str = "FLUXX Environmental Intelligence"
    VERSION: str = "3.0.0"
    API_V1_STR: str = "/api"
    CORS_ORIGINS: list = ["*"]
    
    # Base directory
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATASET_PATH: str = os.path.join(BASE_DIR, "data", "kharghar_dataset.csv")

settings = Settings()
