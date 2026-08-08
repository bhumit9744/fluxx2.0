from typing import Dict, Any, Optional
from datetime import datetime, timezone

def normalize_environmental_reading(raw: Dict[str, Any], sample_idx: int = 1, total_samples: int = 50) -> Dict[str, Any]:
    """
    Normalizes any sensor reading or CSV row into the unified FLUXX EnvironmentalReading schema.
    Robust against diverse column headers from user-uploaded CSV datasets.
    """
    # Key extraction helper (case-insensitive and trimmed)
    lookup = {str(k).strip().lower(): v for k, v in raw.items()}

    def get_val(keys, default):
        for k in keys:
            if k in lookup and lookup[k] is not None and str(lookup[k]).strip() != "":
                try:
                    return float(lookup[k])
                except (ValueError, TypeError):
                    continue
        return default

    ts = lookup.get("timestamp") or lookup.get("time") or lookup.get("datetime")
    if not ts:
        ts = datetime.now(timezone.utc).isoformat()
    elif isinstance(ts, str) and not ts.endswith("Z") and "+" not in ts:
        ts = ts.replace(" ", "T") + "Z"
        
    lat = get_val(["latitude", "lat", "y"], 19.05028)
    lng = get_val(["longitude", "lng", "lon", "long", "x"], 73.06907)
    elevation = get_val(["elevation", "alt", "altitude"], 15.0)

    pm25 = get_val(["pm2_5", "pm25", "pm2.5", "pm2_5_ug_m3", "pm25_ug_m3"], 48.5)
    pm10 = get_val(["pm10", "pm10_ug_m3", "pm10_0"], 77.3)
    co2 = get_val(["co2", "co2_ppm", "carbon_dioxide"], 558.8)
    temp = get_val(["temperature", "temp", "temperature_c", "temp_c"], 28.1)
    hum = get_val(["humidity", "humidity_percent", "hum", "rh"], 80.1)
    wind_spd = get_val(["wind_speed", "windspeed", "wind_speed_m_s", "wind"], 2.6)
    wind_dir = get_val(["wind_direction", "winddirection", "wind_direction_deg", "wind_dir"], 240.0)

    return {
        "sample": sample_idx,
        "total_samples": total_samples,
        "timestamp": str(ts),
        "source": "kharghar_csv",
        "mode": "replay",
        "location": {
            "latitude": round(lat, 6),
            "longitude": round(lng, 6),
            "elevation": round(elevation, 1)
        },
        "sensors": {
            "pm25": round(pm25, 1),
            "pm10": round(pm10, 1),
            "co2": round(co2, 1),
            "temperature": round(temp, 1),
            "humidity": round(hum, 1),
            "windSpeed": round(wind_spd, 1),
            "windDirection": round(wind_dir, 1)
        }
    }
