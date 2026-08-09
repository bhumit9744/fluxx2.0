from __future__ import annotations

import re

from .csv_manager import csv_manager

PARAMETER_ALIASES = {
    "pm25": [
        "pm2.5",
        "pm25",
        "pm 2.5",
        "particulate matter",
    ],
    "pm10": [
        "pm10",
        "pm 10",
    ],
    "co2": [
        "co2",
        "carbon dioxide",
    ],
    "co": [
        "co",
        "carbon monoxide",
    ],
    "no2": [
        "no2",
        "nitrogen dioxide",
    ],
    "temperature": [
        "temperature",
        "temp",
    ],
    "humidity": [
        "humidity",
    ],
    "wind_speed": [
        "wind speed",
        "wind",
    ],
    "aqi": [
        "aqi",
        "air quality index",
    ],
}


def detect_parameter(question: str):

    q = question.lower()

    for parameter, aliases in PARAMETER_ALIASES.items():

        for alias in aliases:

            if alias in q:
                return parameter

    return None


def detect_operation(question: str):

    q = question.lower()

    if any(
        phrase in q
        for phrase in [
            "average",
            "mean",
            "avg",
        ]
    ):
        return "average"

    if any(
        phrase in q
        for phrase in [
            "highest",
            "maximum",
            "max",
            "peak",
            "worst",
        ]
    ):
        return "maximum"

    if any(
        phrase in q
        for phrase in [
            "lowest",
            "minimum",
            "min",
            "best",
        ]
    ):
        return "minimum"

    if any(
        phrase in q
        for phrase in [
            "trend",
            "increased",
            "decreased",
            "change",
            "rising",
            "falling",
        ]
    ):
        return "trend"

    if any(
        phrase in q
        for phrase in [
            "latest",
            "current",
            "now",
            "right now",
        ]
    ):
        return "latest"

    if any(
        phrase in q
        for phrase in [
            "compare",
            "comparison",
        ]
    ):
        return "compare"

    if any(
        phrase in q
        for phrase in [
            "observations",
            "records",
            "readings",
            "data points",
            "how many",
        ]
    ):
        return "count"

    return None


def is_data_question(question: str) -> bool:

    return (
        detect_parameter(question) is not None
        or detect_operation(question) is not None
        or any(
            word in question.lower()
            for word in [
                "dataset",
                "csv",
                "data",
                "reading",
                "sensor",
                "observation",
            ]
        )
    )

def resolve_dataset(
    question: str,
) -> str | None:

    files = csv_manager.list_files(
        "environment"
    )

    q = question.lower()

    for file in files:

        name = file.lower()

        if name.replace(".csv", "") in q:
            return file

    if len(files) == 1:
        return files[0]

    # Location-aware matching
    for file in files:

        stem = file.lower().replace(
            ".csv",
            "",
        )

        if stem in q:
            return file

    return None
