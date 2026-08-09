from __future__ import annotations

from pathlib import Path
from functools import lru_cache
from typing import Optional

import pandas as pd

from app.config import ENVIRONMENT_DATA_DIR, TELEMETRY_DATA_DIR


class CSVManager:
    def __init__(self):
        self.directories = {
            "environment": ENVIRONMENT_DATA_DIR,
            "telemetry": TELEMETRY_DATA_DIR,
        }

    def list_files(self, category: str = "environment") -> list[str]:
        directory = self.directories.get(category)

        if not directory:
            raise ValueError(f"Unknown data category: {category}")

        directory.mkdir(parents=True, exist_ok=True)

        return sorted(
            file.name
            for file in directory.glob("*.csv")
            if file.is_file()
        )

    def resolve_file(
        self,
        filename: str,
        category: str = "environment",
    ) -> Path:

        directory = self.directories.get(category)

        if not directory:
            raise ValueError(f"Unknown data category: {category}")

        directory = directory.resolve()
        requested = (directory / filename).resolve()

        # Security: prevent ../ traversal
        if directory not in requested.parents:
            raise ValueError("Invalid CSV path")

        if requested.suffix.lower() != ".csv":
            raise ValueError("Only CSV files are supported")

        if not requested.exists():
            raise FileNotFoundError(
                f"CSV file '{filename}' was not found"
            )

        return requested

    @lru_cache(maxsize=20)
    def load(
        self,
        filename: str,
        category: str = "environment",
    ) -> pd.DataFrame:

        path = self.resolve_file(filename, category)

        df = pd.read_csv(path)

        if df.empty:
            raise ValueError(f"{filename} contains no rows")

        return df

    def reload(
        self,
        filename: str,
        category: str = "environment",
    ) -> pd.DataFrame:

        self.load.cache_clear()

        return self.load(filename, category)

    def get_file_info(
        self,
        filename: str,
        category: str = "environment",
    ) -> dict:

        df = self.load(filename, category)

        return {
            "file": filename,
            "category": category,
            "rows": len(df),
            "columns": list(df.columns),
        }


csv_manager = CSVManager()
