from fastapi import APIRouter, Query, HTTPException
from typing import Optional, Dict, Any, List
from app.services.replay_engine import replay_engine
from app.services.idw_heatmap import calculate_idw_grid

router = APIRouter(prefix="/map", tags=["Live Map"])

@router.get("/data")
def get_map_data() -> Dict[str, Any]:
    """
    Returns unified dataset metadata, bounding box, sensor observations,
    active heatmap, and peak environmental hotspot from the active CSV dataset.
    """
    samples = replay_engine.get_all_samples()
    filename = getattr(replay_engine, "active_filename", "kharghar_survey.csv")

    if not samples:
        return {
            "dataset": {
                "name": filename,
                "observations": 0
            },
            "bounds": {
                "north": 19.08,
                "south": 19.02,
                "east": 73.10,
                "west": 73.04
            },
            "sensors": [],
            "heatmap": {
                "parameter": "pm25",
                "label": "PM2.5",
                "unit": "µg/m³",
                "bounds": {},
                "stats": {"min": 0, "max": 0, "avg": 0, "median": 0},
                "grid": []
            },
            "hotspot": None
        }

    # Extract coordinates & sensors
    lats = [float(s["location"]["latitude"]) for s in samples]
    lngs = [float(s["location"]["longitude"]) for s in samples]

    min_lat, max_lat = min(lats), max(lats)
    min_lng, max_lng = min(lngs), max(lngs)

    # Format simplified sensor points
    sensor_points = []
    max_pm25_sample = None
    max_pm25_val = -1.0

    for s in samples:
        pm25 = float(s["sensors"].get("pm25", 0.0))
        if pm25 > max_pm25_val:
            max_pm25_val = pm25
            max_pm25_sample = s

        sensor_points.append({
            "sample": s["sample"],
            "latitude": float(s["location"]["latitude"]),
            "longitude": float(s["location"]["longitude"]),
            "timestamp": s.get("timestamp", ""),
            "sensors": s["sensors"]
        })

    # Generate initial PM2.5 heatmap
    idw_result = calculate_idw_grid(layer="pm25", grid_size=24)

    # Calculate peak hotspot details
    hotspot = None
    if max_pm25_sample:
        hotspot = {
            "sample": max_pm25_sample["sample"],
            "latitude": float(max_pm25_sample["location"]["latitude"]),
            "longitude": float(max_pm25_sample["location"]["longitude"]),
            "location": "Kharghar Sector 4",
            "parameter": "pm25",
            "value": round(max_pm25_val, 1),
            "unit": "µg/m³",
            "timestamp": max_pm25_sample.get("timestamp", "15:42"),
            "sensors": max_pm25_sample["sensors"]
        }

    return {
        "dataset": {
            "name": filename,
            "observations": len(samples)
        },
        "bounds": {
            "north": round(max_lat + 0.005, 6),
            "south": round(min_lat - 0.005, 6),
            "east": round(max_lng + 0.005, 6),
            "west": round(min_lng - 0.005, 6),
            "center": {
                "lat": round((min_lat + max_lat) / 2.0, 6),
                "lng": round((min_lng + max_lng) / 2.0, 6)
            }
        },
        "sensors": sensor_points,
        "heatmap": {
            "parameter": "pm25",
            "label": idw_result.get("label", "PM2.5"),
            "unit": idw_result.get("unit", "µg/m³"),
            "bounds": idw_result.get("bounds", {}),
            "stats": idw_result.get("stats", {}),
            "grid": idw_result.get("grid_cells", [])
        },
        "hotspot": hotspot
    }


@router.get("/heatmap")
def get_parameter_heatmap(
    parameter: str = Query("pm25", description="pm25, pm10, co2, temperature, humidity, wind"),
    grid_size: int = Query(24, ge=8, le=48, description="Resolution of spatial interpolation matrix")
) -> Dict[str, Any]:
    """
    Calculates dynamic IDW spatial interpolation matrix for any selected parameter.
    """
    idw_result = calculate_idw_grid(layer=parameter, grid_size=grid_size)
    return {
        "parameter": idw_result.get("parameter", parameter),
        "label": idw_result.get("label", parameter.upper()),
        "unit": idw_result.get("unit", ""),
        "bounds": idw_result.get("bounds", {}),
        "stats": idw_result.get("stats", {}),
        "grid": idw_result.get("grid_cells", []),
        "sensor_points": idw_result.get("sensor_points", [])
    }
