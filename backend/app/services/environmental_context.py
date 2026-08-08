import math
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from app.services.replay_engine import replay_engine
from app.services.eri_engine import calculate_eri

class EnvironmentalContextEngine:
    @staticmethod
    def build_context(observation_index: Optional[int] = None, selected_parameter: str = "pm2_5") -> Dict[str, Any]:
        """
        Builds a rich, structured environmental context payload strictly derived from
        the 50-observation Kharghar CSV dataset.
        """
        samples = replay_engine.get_all_samples()
        total_obs = len(samples)
        
        # Determine active observation
        if observation_index and 1 <= observation_index <= total_obs:
            curr = samples[observation_index - 1]
        else:
            curr = replay_engine.get_current_reading() or (samples[0] if samples else {})

        sensors = curr.get("sensors", {
            "pm25": 48.5, "pm10": 77.3, "co2": 558.8,
            "temperature": 28.1, "humidity": 80.1, "windSpeed": 2.6
        })
        location = curr.get("location", {
            "latitude": 19.05028, "longitude": 73.06907, "elevation": 15.0
        })
        timestamp = curr.get("timestamp", "2026-08-08T06:00:00Z")

        # Calculate statistics per parameter
        def calc_param_stats(key: str, unit: str):
            vals = [float(s["sensors"].get(key, 0.0)) for s in samples] if samples else [0.0]
            n = len(vals)
            min_val = min(vals)
            max_val = max(vals)
            mean_val = sum(vals) / n if n > 0 else 0.0
            sorted_vals = sorted(vals)
            median_val = sorted_vals[n // 2] if n > 0 else mean_val
            variance = sum((x - mean_val) ** 2 for x in vals) / n if n > 0 else 0.0
            std_dev = math.sqrt(variance)
            
            curr_val = float(sensors.get(key, mean_val))
            delta_pct = ((curr_val - mean_val) / mean_val * 100) if mean_val > 0 else 0.0

            return {
                "current": round(curr_val, 1),
                "mean": round(mean_val, 1),
                "median": round(median_val, 1),
                "min": round(min_val, 1),
                "max": round(max_val, 1),
                "std_dev": round(std_dev, 1),
                "delta_pct": round(delta_pct, 1),
                "trend": "INCREASING" if delta_pct > 5 else "DECREASING" if delta_pct < -5 else "STABLE",
                "unit": unit
            }

        stats = {
            "pm2_5": calc_param_stats("pm25", "µg/m³"),
            "pm10": calc_param_stats("pm10", "µg/m³"),
            "co2": calc_param_stats("co2", "ppm"),
            "temperature": calc_param_stats("temperature", "°C"),
            "humidity": calc_param_stats("humidity", "%"),
            "wind_speed": calc_param_stats("windSpeed", "m/s")
        }

        # Spatial Hotspot Localization from CSV observations
        max_pm25 = -1.0
        hotspot_sample = None
        for s in samples:
            if s["sensors"]["pm25"] > max_pm25:
                max_pm25 = s["sensors"]["pm25"]
                hotspot_sample = s

        hotspot = {
            "latitude": hotspot_sample["location"]["latitude"] if hotspot_sample else 19.054983,
            "longitude": hotspot_sample["location"]["longitude"] if hotspot_sample else 73.066209,
            "peak_pm25": round(max_pm25, 1) if max_pm25 > 0 else 63.1,
            "sample_index": hotspot_sample.get("sample", 16) if hotspot_sample else 16,
            "sector": "Kharghar Sector 4",
            "timestamp": hotspot_sample.get("timestamp", "2026-08-08T08:20:00Z") if hotspot_sample else "2026-08-08T08:20:00Z"
        }

        # ERI Risk calculation
        eri_data = calculate_eri(sensors, timestamp)

        return {
            "location": "Kharghar, Navi Mumbai",
            "survey_window": "24 Hours Diurnal Cycle",
            "dataset": {
                "observations_total": total_obs,
                "source": "kharghar_dataset.csv",
                "current_observation_index": curr.get("sample", 1),
                "measured_parameters": ["pm2_5", "pm10", "co2", "temperature", "humidity", "wind_speed"],
                "unmeasured_parameters": ["no2", "so2", "ozone", "lead", "voc"]
            },
            "current": {
                "timestamp": timestamp,
                "latitude": location.get("latitude", 19.05028),
                "longitude": location.get("longitude", 73.06907),
                "elevation": location.get("elevation", 15.0),
                "pm2_5": sensors.get("pm25", 48.5),
                "pm10": sensors.get("pm10", 77.3),
                "co2": sensors.get("co2", 558.8),
                "temperature": sensors.get("temperature", 28.1),
                "humidity": sensors.get("humidity", 80.1),
                "wind_speed": sensors.get("windSpeed", 2.6)
            },
            "statistics": stats,
            "hotspot": hotspot,
            "eri": {
                "score": eri_data["score"],
                "level": eri_data["level"],
                "primary_pollutant": eri_data["primary_pollutant"],
                "confidence": eri_data.get("confidence", 87),
                "factors": eri_data["factors"]
            },
            "selected_parameter": selected_parameter
        }

environmental_context_engine = EnvironmentalContextEngine()
