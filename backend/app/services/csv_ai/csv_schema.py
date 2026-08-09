import re
import pandas as pd


COLUMN_ALIASES = {
    "pm25": {
        "pm25",
        "pm2.5",
        "pm2_5",
        "pm_2_5",
        "particulate_matter_2_5",
        "pm2_5_ug_m3",
    },

    "pm10": {
        "pm10",
        "pm_10",
        "pm10_ugm3",
        "pm10_ug_m3",
    },

    "co2": {
        "co2",
        "co_2",
        "carbon_dioxide",
        "co2_ppm",
    },

    "co": {
        "co",
        "carbon_monoxide",
    },

    "no2": {
        "no2",
        "no_2",
        "nitrogen_dioxide",
    },

    "temperature": {
        "temperature",
        "temp",
        "temperature_c",
    },

    "humidity": {
        "humidity",
        "humidity_percent",
        "relative_humidity",
    },

    "wind_speed": {
        "wind_speed",
        "windspeed",
        "wind_velocity",
        "wind_speed_m_s",
    },

    "latitude": {
        "latitude",
        "lat",
    },

    "longitude": {
        "longitude",
        "lon",
        "lng",
    },

    "timestamp": {
        "timestamp",
        "datetime",
        "date_time",
        "time",
        "date",
    },

    "location": {
        "location",
        "site",
        "station",
        "region",
        "area",
    },

    "aqi": {
        "aqi",
        "air_quality_index",
    },
}


def normalize_name(value: str) -> str:
    value = value.strip().lower()
    value = value.replace("%", "percent")
    value = re.sub(r"[^a-z0-9]+", "_", value)
    return value.strip("_")


def normalize_dataframe(df: pd.DataFrame) -> pd.DataFrame:

    rename_map = {}

    normalized_columns = {
        column: normalize_name(str(column))
        for column in df.columns
    }

    for original, normalized in normalized_columns.items():

        canonical = normalized

        for target, aliases in COLUMN_ALIASES.items():

            if normalized == target or normalized in {
                normalize_name(alias)
                for alias in aliases
            }:
                canonical = target
                break

        rename_map[original] = canonical

    result = df.rename(columns=rename_map).copy()

    if "timestamp" in result.columns:
        result["timestamp"] = pd.to_datetime(
            result["timestamp"],
            errors="coerce",
        )

    numeric_columns = [
        "pm25",
        "pm10",
        "co",
        "co2",
        "no2",
        "temperature",
        "humidity",
        "wind_speed",
        "latitude",
        "longitude",
        "aqi",
    ]

    for column in numeric_columns:

        if column in result.columns:
            result[column] = pd.to_numeric(
                result[column],
                errors="coerce",
            )

    return result


def get_schema(df: pd.DataFrame) -> dict:

    normalized = normalize_dataframe(df)

    return {
        "rows": len(normalized),
        "columns": list(normalized.columns),
        "parameters": [
            column
            for column in [
                "aqi",
                "pm25",
                "pm10",
                "co",
                "no2",
                "co2",
                "temperature",
                "humidity",
                "wind_speed",
            ]
            if column in normalized.columns
        ],
        "has_coordinates": (
            "latitude" in normalized.columns
            and "longitude" in normalized.columns
        ),
        "has_timestamp": "timestamp" in normalized.columns,
    }
