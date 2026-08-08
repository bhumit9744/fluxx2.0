import math
from typing import List, Dict, Any, Optional
from app.services.replay_engine import replay_engine

def calculate_idw_grid(
    layer: str = "pm25",
    upto: Optional[int] = None,
    grid_size: int = 24, # 24x24 = 576 interpolated spatial cells
    power: float = 2.0
) -> Dict[str, Any]:
    """
    Computes mathematically rigorous Inverse Distance Weighting (IDW) spatial field
    directly from the Kharghar CSV observations (observations 1 to `upto`).
    
    Formula:
        value(x) = Σ (val_i / d_i^p) / Σ (1 / d_i^p)
    """
    all_samples = replay_engine.get_all_samples()
    if not all_samples:
        return {
            "parameter": layer,
            "source": "kharghar_dataset.csv",
            "observations_used": 0,
            "bounds": {"min_lat": 19.04, "max_lat": 19.06, "min_lng": 73.06, "max_lng": 73.08},
            "stats": {"min": 0, "max": 100, "avg": 50, "median": 50},
            "grid_cells": [],
            "sensor_points": []
        }

    # Filter observations up to requested index
    if upto is not None and upto > 0:
        samples = all_samples[:min(upto, len(all_samples))]
    else:
        samples = all_samples

    # Normalize layer parameter alias
    layer_map = {
        "pm25": ("pm25", "µg/m³", "PM2.5"),
        "pm2_5": ("pm25", "µg/m³", "PM2.5"),
        "pm10": ("pm10", "µg/m³", "PM10"),
        "co2": ("co2", "ppm", "CO₂"),
        "temperature": ("temperature", "°C", "Temperature"),
        "temp": ("temperature", "°C", "Temperature"),
        "humidity": ("humidity", "%", "Humidity"),
        "windspeed": ("windSpeed", "m/s", "Wind Speed"),
        "wind": ("windSpeed", "m/s", "Wind Speed")
    }

    param_key = layer.lower().replace("-", "_")
    sensor_key, unit, label = layer_map.get(param_key, ("pm25", "µg/m³", "PM2.5"))

    lats: List[float] = []
    lngs: List[float] = []
    vals: List[float] = []
    pts: List[Dict[str, Any]] = []

    for s in samples:
        lat = float(s["location"]["latitude"])
        lng = float(s["location"]["longitude"])
        val = float(s["sensors"].get(sensor_key, 0.0))
        lats.append(lat)
        lngs.append(lng)
        vals.append(val)
        pts.append({
            "sample": s["sample"],
            "lat": lat,
            "lng": lng,
            "val": val,
            "timestamp": s.get("timestamp", ""),
            "sensors": s["sensors"]
        })

    # Exact CSV statistics for this parameter and observation window
    min_val = min(vals) if vals else 0.0
    max_val = max(vals) if vals else 100.0
    avg_val = sum(vals) / len(vals) if vals else 0.0
    sorted_vals = sorted(vals)
    median_val = sorted_vals[len(sorted_vals) // 2] if sorted_vals else avg_val

    # Compute bounding box with small 5% buffer
    min_lat, max_lat = min(lats), max(lats)
    min_lng, max_lng = min(lngs), max(lngs)

    lat_span = max_lat - min_lat if max_lat > min_lat else 0.005
    lng_span = max_lng - min_lng if max_lng > min_lng else 0.005

    lat_pad = lat_span * 0.06
    lng_pad = lng_span * 0.06

    grid_min_lat = min_lat - lat_pad
    grid_max_lat = max_lat + lat_pad
    grid_min_lng = min_lng - lng_pad
    grid_max_lng = max_lng + lng_pad

    lat_step = (grid_max_lat - grid_min_lat) / max(1, (grid_size - 1))
    lng_step = (grid_max_lng - grid_min_lng) / max(1, (grid_size - 1))

    grid_cells = []

    # Calculate IDW value at each cell point
    for i in range(grid_size):
        cell_lat = grid_min_lat + (i * lat_step)
        for j in range(grid_size):
            cell_lng = grid_min_lng + (j * lng_step)

            numerator = 0.0
            denominator = 0.0
            min_dist_to_sensor = float('inf')
            exact_match_val = None

            for (s_lat, s_lng, s_val) in zip(lats, lngs, vals):
                # Euclidean distance in spatial coordinates
                d = math.hypot(cell_lat - s_lat, cell_lng - s_lng)
                if d < min_dist_to_sensor:
                    min_dist_to_sensor = d

                # If virtually right on top of a sensor, take exact value
                if d < 1e-6:
                    exact_match_val = s_val
                    break

                weight = 1.0 / (d ** power)
                numerator += weight * s_val
                denominator += weight

            if exact_match_val is not None:
                interpolated = exact_match_val
            elif denominator > 0:
                interpolated = numerator / denominator
            else:
                interpolated = avg_val

            # True relative intensity within CSV range (never arbitrary 0-100)
            val_range = (max_val - min_val) if (max_val - min_val) > 0 else 1.0
            norm_intensity = max(0.0, min(1.0, (interpolated - min_val) / val_range))

            # Spatial boundary confidence falloff (far from any sensor -> fades to 0)
            # Max influence cutoff ~ 0.012 deg (~1.3 km)
            confidence = max(0.0, min(1.0, 1.0 - (min_dist_to_sensor / 0.012)))

            grid_cells.append({
                "lat": round(cell_lat, 6),
                "lng": round(cell_lng, 6),
                "val": round(interpolated, 2),
                "intensity": round(norm_intensity, 3),
                "confidence": round(confidence, 2)
            })

    return {
        "parameter": sensor_key,
        "label": label,
        "unit": unit,
        "source": "kharghar_dataset.csv",
        "observations_used": len(samples),
        "total_observations": len(all_samples),
        "bounds": {
            "min_lat": round(grid_min_lat, 6),
            "max_lat": round(grid_max_lat, 6),
            "min_lng": round(grid_min_lng, 6),
            "max_lng": round(grid_max_lng, 6),
            "center_lat": round((min_lat + max_lat) / 2.0, 6),
            "center_lng": round((min_lng + max_lng) / 2.0, 6)
        },
        "stats": {
            "min": round(min_val, 1),
            "max": round(max_val, 1),
            "avg": round(avg_val, 1),
            "median": round(median_val, 1)
        },
        "sensor_points": pts,
        "grid_cells": grid_cells
    }
