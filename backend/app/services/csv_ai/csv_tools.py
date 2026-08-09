from __future__ import annotations

from typing import Optional

import pandas as pd

from .csv_manager import csv_manager
from .csv_schema import normalize_dataframe, get_schema


class CSVTools:

    def load(
        self,
        file: str,
        category: str = "environment",
    ) -> pd.DataFrame:

        df = csv_manager.load(file, category)

        return normalize_dataframe(df)

    def list_files(
        self,
        category: str = "environment",
    ) -> dict:

        files = csv_manager.list_files(category)

        return {
            "category": category,
            "files": files,
            "count": len(files),
        }

    def schema(
        self,
        file: str,
        category: str = "environment",
    ) -> dict:

        df = self.load(file, category)

        return get_schema(df)

    def average(
        self,
        file: str,
        parameter: str,
        category: str = "environment",
    ) -> dict:

        df = self.load(file, category)

        self._validate_parameter(df, parameter)

        values = df[parameter].dropna()

        return {
            "file": file,
            "parameter": parameter,
            "operation": "average",
            "value": float(values.mean()),
            "count": int(len(values)),
        }

    def minimum(
        self,
        file: str,
        parameter: str,
        category: str = "environment",
    ) -> dict:

        df = self.load(file, category)

        self._validate_parameter(df, parameter)

        values = df[parameter].dropna()

        return {
            "file": file,
            "parameter": parameter,
            "operation": "minimum",
            "value": float(values.min()),
        }

    def maximum(
        self,
        file: str,
        parameter: str,
        category: str = "environment",
    ) -> dict:

        df = self.load(file, category)

        self._validate_parameter(df, parameter)

        index = df[parameter].idxmax()

        row = df.loc[index]

        result = {
            "file": file,
            "parameter": parameter,
            "operation": "maximum",
            "value": float(row[parameter]),
            "row_index": int(index),
        }

        if "timestamp" in df.columns:
            result["timestamp"] = self._safe_value(
                row["timestamp"]
            )

        if "latitude" in df.columns:
            result["latitude"] = self._safe_value(
                row["latitude"]
            )

        if "longitude" in df.columns:
            result["longitude"] = self._safe_value(
                row["longitude"]
            )

        if "location" in df.columns:
            result["location"] = self._safe_value(
                row["location"]
            )

        return result

    def latest(
        self,
        file: str,
        parameter: Optional[str] = None,
        category: str = "environment",
    ) -> dict:

        df = self.load(file, category)

        if "timestamp" in df.columns:

            df = df.sort_values("timestamp")

        row = df.iloc[-1]

        result = {
            "file": file,
            "operation": "latest",
        }

        if "timestamp" in df.columns:
            result["timestamp"] = self._safe_value(
                row["timestamp"]
            )

        if parameter:

            self._validate_parameter(df, parameter)

            result["parameter"] = parameter
            result["value"] = self._safe_value(
                row[parameter]
            )

        else:

            result["data"] = {
                column: self._safe_value(row[column])
                for column in df.columns
            }

        return result

    def count(
        self,
        file: str,
        category: str = "environment",
    ) -> dict:

        df = self.load(file, category)

        return {
            "file": file,
            "operation": "count",
            "rows": int(len(df)),
        }

    def trend(
        self,
        file: str,
        parameter: str,
        category: str = "environment",
        window: int = 10,
    ) -> dict:

        df = self.load(file, category)

        self._validate_parameter(df, parameter)

        if "timestamp" in df.columns:
            df = df.sort_values("timestamp")

        values = df[parameter].dropna()

        if len(values) < 2:
            raise ValueError(
                "Not enough observations to calculate a trend"
            )

        window = min(window, len(values) // 2)

        if window < 1:
            window = 1

        first = float(values.iloc[:window].mean())
        latest = float(values.iloc[-window:].mean())

        change = latest - first

        percentage = (
            (change / first) * 100
            if first != 0
            else None
        )

        if change > 0:
            direction = "increasing"
        elif change < 0:
            direction = "decreasing"
        else:
            direction = "stable"

        return {
            "file": file,
            "parameter": parameter,
            "operation": "trend",
            "baseline_average": first,
            "latest_average": latest,
            "absolute_change": change,
            "percentage_change": percentage,
            "direction": direction,
            "window": window,
        }

    def time_series(
        self,
        file: str,
        parameter: str,
        category: str = "environment",
        limit: int = 100,
    ) -> dict:

        df = self.load(file, category)

        self._validate_parameter(df, parameter)

        if "timestamp" in df.columns:

            df = df.sort_values("timestamp")

        records = []

        subset = df.tail(limit)

        for _, row in subset.iterrows():

            item = {
                "value": self._safe_value(
                    row[parameter]
                )
            }

            if "timestamp" in df.columns:
                item["timestamp"] = self._safe_value(
                    row["timestamp"]
                )

            if "latitude" in df.columns:
                item["latitude"] = self._safe_value(
                    row["latitude"]
                )

            if "longitude" in df.columns:
                item["longitude"] = self._safe_value(
                    row["longitude"]
                )

            records.append(item)

        return {
            "file": file,
            "parameter": parameter,
            "operation": "time_series",
            "records": records,
        }

    def records(
        self,
        file: str,
        parameter: Optional[str] = None,
        category: str = "environment",
        limit: int = 20,
    ) -> dict:

        df = self.load(file, category)

        if parameter:
            self._validate_parameter(df, parameter)

            columns = [parameter]

            for extra in [
                "timestamp",
                "latitude",
                "longitude",
                "location",
            ]:
                if extra in df.columns:
                    columns.append(extra)

            df = df[columns]

        df = df.tail(limit)

        return {
            "file": file,
            "operation": "records",
            "records": df.to_dict(
                orient="records"
            ),
        }

    def compare(
        self,
        file: str,
        parameters: list[str],
        category: str = "environment",
    ) -> dict:

        df = self.load(file, category)

        output = {}

        for parameter in parameters:

            self._validate_parameter(
                df,
                parameter,
            )

            values = df[parameter].dropna()

            output[parameter] = {
                "average": float(values.mean()),
                "minimum": float(values.min()),
                "maximum": float(values.max()),
                "median": float(values.median()),
            }

        return {
            "file": file,
            "operation": "compare",
            "parameters": output,
        }

    @staticmethod
    def _validate_parameter(
        df: pd.DataFrame,
        parameter: str,
    ):

        if parameter not in df.columns:

            raise ValueError(
                f"Parameter '{parameter}' "
                f"is not available. "
                f"Available columns: "
                f"{list(df.columns)}"
            )

    @staticmethod
    def _safe_value(value):

        if pd.isna(value):
            return None

        if isinstance(value, pd.Timestamp):
            return value.isoformat()

        if hasattr(value, "item"):
            try:
                return value.item()
            except Exception:
                pass

        return value


csv_tools = CSVTools()
