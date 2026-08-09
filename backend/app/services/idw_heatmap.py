import math
from typing import List, Dict, Any, Optional
from app.services.replay_engine import replay_engine

def calculate_idw_grid(
    layer: str = "pm25",
    upto: Optional[int] = None,
    grid_size: int = 75, # 75x75 = 5625 interpolated spatial cells
    power: float = 2.0
) -> Dict[str, Any]:
    """
    Computes mathematically rigorous Inverse Distance Weighting (IDW) spatial field
    directly from the Kharghar CSV observations (observations 1 to `upto`).
    """
    all_samples = replay_engine.get_all_samples()
    if not all_samples:
        return {
            "parameter": layer,
            "unit": "",
            "average": 0,
            "min": 0,
            "max": 0,
            "grid": [],
            "hotspot": {"lat": 0, "lng": 0, "value": 0}
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

    # Group and average by coordinates to prevent artificial spikes from repeated hovering
    spatial_groups = {}
    for s in samples:
        lat = round(float(s["location"]["latitude"]), 5)
        lng = round(float(s["location"]["longitude"]), 5)
        val = float(s["sensors"].get(sensor_key, 0.0))
        coord = (lat, lng)
        if coord not in spatial_groups:
            spatial_groups[coord] = []
        spatial_groups[coord].append(val)

    lats: List[float] = []
    lngs: List[float] = []
    vals: List[float] = []

    for (lat, lng), val_list in spatial_groups.items():
        avg_coord_val = sum(val_list) / len(val_list)
        lats.append(lat)
        lngs.append(lng)
        vals.append(avg_coord_val)

    # Exact CSV statistics for this parameter
    min_val = min(vals) if vals else 0.0
    max_val = max(vals) if vals else 100.0
    avg_val = sum(vals) / len(vals) if vals else 0.0

    # Compute bounding box with small geographic padding (6%)
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

    grid = []

    max_radius = 0.003 # Approx 300m threshold

    # Calculate IDW value at each cell point
    for i in range(grid_size):
        cell_lat = grid_min_lat + (i * lat_step)
        for j in range(grid_size):
            cell_lng = grid_min_lng + (j * lng_step)

            numerator = 0.0
            denominator = 0.0
            exact_match_val = None
            min_dist = float('inf')

            for (s_lat, s_lng, s_val) in zip(lats, lngs, vals):
                # Euclidean distance
                d = math.hypot(cell_lat - s_lat, cell_lng - s_lng)
                if d < min_dist:
                    min_dist = d

                # If virtually right on top of a sensor, take exact value
                if d < 1e-6:
                    exact_match_val = s_val
                    break

                weight = 1.0 / (d ** power)
                numerator += weight * s_val
                denominator += weight

            if min_dist > max_radius:
                interpolated = None
            elif exact_match_val is not None:
                interpolated = exact_match_val
            elif denominator > 0:
                interpolated = numerator / denominator
            else:
                interpolated = avg_val

            grid.append({
                "lat": round(cell_lat, 6),
                "lng": round(cell_lng, 6),
                "value": round(interpolated, 2) if interpolated is not None else None
            })

    # Find hotspot from the interpolated grid points (ignoring None)
    hotspot_lat = 0.0
    hotspot_lng = 0.0
    hotspot_val = -float('inf')
    
    for point in grid:
        val = point["value"]
        if val is not None and val > hotspot_val:
            hotspot_val = val
            hotspot_lat = point["lat"]
            hotspot_lng = point["lng"]
            
    if hotspot_val == -float('inf'):
        hotspot_val = 0.0

    return {
        "parameter": sensor_key,
        "unit": unit,
        "average": round(avg_val, 2),
        "min": round(min_val, 2),
        "max": round(max_val, 2),
        "grid": grid,
        "bounds": {
            "min_lat": grid_min_lat,
            "max_lat": grid_max_lat,
            "min_lng": grid_min_lng,
            "max_lng": grid_max_lng
        },
        "hotspot": {
            "lat": hotspot_lat,
            "lng": hotspot_lng,
            "value": hotspot_val
        }
    }
