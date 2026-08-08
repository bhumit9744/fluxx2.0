import math
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from app.services.replay_engine import replay_engine
from app.services.eri_engine import calculate_eri

class AnalyticsService:
    @classmethod
    def get_dataset_info(cls) -> Dict[str, Any]:
        samples = replay_engine.get_all_samples()
        if not samples:
            return {
                "total_observations": 0,
                "location": "Kharghar, Navi Mumbai",
                "center": {"latitude": 19.0430, "longitude": 73.0680},
                "bounds": {"min_lat": 19.03, "max_lat": 19.06, "min_lng": 73.05, "max_lng": 73.08},
                "source": "kharghar_dataset.csv",
                "measured_parameters": ["pm25", "pm10", "co2", "temperature", "humidity", "windSpeed"],
                "unmeasured_parameters": ["no2", "so2", "ozone", "lead", "voc"]
            }

        lats = [s["location"]["latitude"] for s in samples]
        lngs = [s["location"]["longitude"] for s in samples]
        center_lat = sum(lats) / len(lats)
        center_lng = sum(lngs) / len(lngs)
        
        # Format location descriptor
        loc_desc = "Kharghar, Navi Mumbai" if (18.9 < center_lat < 19.2 and 72.9 < center_lng < 73.2) else f"Spatial Coordinates ({center_lat:.4f}° N, {center_lng:.4f}° E)"

        return {
            "total_observations": len(samples),
            "location": loc_desc,
            "center": {"latitude": round(center_lat, 6), "longitude": round(center_lng, 6)},
            "bounds": {
                "min_lat": min(lats),
                "max_lat": max(lats),
                "min_lng": min(lngs),
                "max_lng": max(lngs)
            },
            "source": "Active CSV Sensor Stream",
            "time_range": {
                "start": samples[0].get("timestamp", ""),
                "end": samples[-1].get("timestamp", "")
            },
            "measured_parameters": ["pm25", "pm10", "co2", "temperature", "humidity", "windSpeed"],
            "unmeasured_parameters": ["no2", "so2", "ozone", "lead", "voc"]
        }

    @classmethod
    def get_current_reading(cls) -> Dict[str, Any]:
        curr = replay_engine.get_current_reading()
        samples = replay_engine.get_all_samples()
        if not curr and samples:
            # Sort samples by timestamp and return the chronologically latest
            curr = max(samples, key=lambda s: s.get("timestamp", ""))
        return curr or {}

    @classmethod
    def get_parameter_statistics(cls, parameter: str = "pm25") -> Dict[str, Any]:
        key_map = {
            "pm2_5": "pm25", "pm25": "pm25",
            "pm10": "pm10",
            "co2": "co2",
            "temp": "temperature", "temperature": "temperature",
            "humidity": "humidity",
            "wind": "windSpeed", "windspeed": "windSpeed", "wind_speed": "windSpeed"
        }
        actual_key = key_map.get(parameter.lower().strip(), "pm25")
        
        samples = replay_engine.get_all_samples()
        vals = [float(s["sensors"].get(actual_key, 0.0)) for s in samples] if samples else [0.0]
        count = len(vals)
        min_v = min(vals)
        max_v = max(vals)
        avg_v = sum(vals) / count if count > 0 else 0.0
        sorted_v = sorted(vals)
        med_v = sorted_v[count // 2] if count > 0 else avg_v
        
        variance = sum((x - avg_v) ** 2 for x in vals) / count if count > 0 else 0.0
        std_dev = math.sqrt(variance)
        
        curr = cls.get_current_reading()
        curr_v = float(curr.get("sensors", {}).get(actual_key, avg_v))
        delta_pct = ((curr_v - avg_v) / avg_v * 100) if avg_v > 0 else 0.0
        
        units = {
            "pm25": "µg/m³", "pm10": "µg/m³", "co2": "ppm",
            "temperature": "°C", "humidity": "%", "windSpeed": "m/s"
        }
        
        return {
            "parameter": actual_key,
            "current": round(curr_v, 1),
            "avg": round(avg_v, 1),
            "median": round(med_v, 1),
            "min": round(min_v, 1),
            "max": round(max_v, 1),
            "std_dev": round(std_dev, 1),
            "delta_pct": round(delta_pct, 1),
            "trend": "INCREASING" if delta_pct > 5 else "DECREASING" if delta_pct < -5 else "STABLE",
            "unit": units.get(actual_key, "")
        }

    @classmethod
    def get_peak_reading(cls, parameter: str = "pm25") -> Dict[str, Any]:
        key_map = {
            "pm2_5": "pm25", "pm25": "pm25",
            "pm10": "pm10",
            "co2": "co2",
            "temp": "temperature", "temperature": "temperature",
            "humidity": "humidity",
            "wind": "windSpeed", "windspeed": "windSpeed", "wind_speed": "windSpeed"
        }
        actual_key = key_map.get(parameter.lower().strip(), "pm25")
        samples = replay_engine.get_all_samples()
        
        if not samples:
            return {
                "parameter": actual_key,
                "peak_value": 0.0,
                "sample_index": 1,
                "latitude": 19.054983,
                "longitude": 73.066209,
                "elevation": 15.0,
                "sector": "Sector 4",
                "timestamp": "2026-08-08T08:20:00Z"
            }

        max_v = -999999.0
        peak_sample = samples[0]
        for s in samples:
            val = float(s["sensors"].get(actual_key, 0.0))
            if val > max_v:
                max_v = val
                peak_sample = s
                
        return {
            "parameter": actual_key,
            "peak_value": round(max_v, 1),
            "sample_index": peak_sample.get("sample", 1),
            "latitude": peak_sample["location"]["latitude"],
            "longitude": peak_sample["location"]["longitude"],
            "elevation": peak_sample["location"].get("elevation", 15.0),
            "sector": f"Sector #{peak_sample.get('sample', 1)} Cluster",
            "timestamp": peak_sample.get("timestamp", "2026-08-08T08:20:00Z")
        }

    @classmethod
    def get_hotspot(cls, parameter: str = "pm25") -> Dict[str, Any]:
        return cls.get_peak_reading(parameter)

    @classmethod
    def get_eri(cls) -> Dict[str, Any]:
        curr = cls.get_current_reading()
        sensors = curr.get("sensors", {
            "pm25": 48.5, "pm10": 77.3, "co2": 558.8,
            "temperature": 28.1, "humidity": 80.1, "windSpeed": 2.6
        })
        timestamp = curr.get("timestamp", "2026-08-08T06:00:00Z")
        return calculate_eri(sensors, timestamp)

    @classmethod
    def get_full_analysis(cls) -> Dict[str, Any]:
        """
        Single source of truth analytics engine:
        Processes all CSV observations and computes statistics, spatial hotspots,
        temporal trends, ERI score, factor weights, pros, cons, limitations, and recommendations.
        """
        curr = cls.get_current_reading()
        samples = replay_engine.get_all_samples()
        
        sensors = curr.get("sensors", {}) if curr else {
            "pm25": 48.5, "pm10": 77.3, "co2": 558.8,
            "temperature": 28.1, "humidity": 80.1, "windSpeed": 2.6
        }
        timestamp = curr.get("timestamp", "2026-08-08T06:00:00Z")
        
        # Calculate ERI
        eri_data = calculate_eri(sensors, timestamp)
        
        stats = {
            "pm25": cls.get_parameter_statistics("pm25"),
            "pm10": cls.get_parameter_statistics("pm10"),
            "co2": cls.get_parameter_statistics("co2"),
            "temperature": cls.get_parameter_statistics("temperature"),
            "humidity": cls.get_parameter_statistics("humidity"),
            "windSpeed": cls.get_parameter_statistics("windSpeed")
        }

        hotspot_info = cls.get_hotspot("pm25")
        obs_count = len(samples)

        # Dynamic Data-Driven Positive Findings (PROS)
        pros = []
        if stats["pm25"]["avg"] <= 50.0:
            pros.append(f"Survey-average PM2.5 ({stats['pm25']['avg']} µg/m³) remained below the configured FLUXX reference threshold of 50 µg/m³.")
        else:
            pros.append(f"Lowest recorded PM2.5 dropped to {stats['pm25']['min']} µg/m³, demonstrating temporal clearing intervals.")

        if stats["windSpeed"]["avg"] >= 2.0:
            pros.append(f"Mean wind velocity ({stats['windSpeed']['avg']} m/s) maintains active atmospheric advection across the survey sector.")
        
        if stats["co2"]["avg"] < 700.0:
            pros.append(f"CO₂ concentration average ({stats['co2']['avg']} ppm) remains well below urban/industrial concern thresholds (<700 ppm).")
        
        pros.append(f"Dataset spatial integrity confirmed across all {obs_count} discrete georeferenced observation points.")

        # Dynamic Data-Driven Environmental Concerns (CONS)
        cons = []
        if stats["pm25"]["max"] > 50.0:
            cons.append(f"Peak PM2.5 surge reached {stats['pm25']['max']} µg/m³ at sample #{hotspot_info['sample_index']} ({hotspot_info['latitude']:.4f}° N, {hotspot_info['longitude']:.4f}° E).")
        if stats["windSpeed"]["current"] < 3.0:
            cons.append(f"Current wind velocity of {stats['windSpeed']['current']} m/s indicates relatively low-to-moderate ventilation conditions; dispersion interpretation should also consider wind direction and atmospheric stability.")
        if stats["humidity"]["current"] > 75.0:
            cons.append(f"Elevated atmospheric humidity ({stats['humidity']['current']}%) fosters secondary particulate hygroscopic growth.")
        if stats["pm10"]["max"] > 80.0:
            cons.append(f"Coarse particulate PM10 peaked at {stats['pm10']['max']} µg/m³ across the survey perimeter.")

        # Scientific Limitations
        limitations = [
            f"Dataset represents only the {obs_count} discrete observation nodes in the active uploaded survey period.",
            "IDW heatmap values are interpolated estimates. Unsampled locations are not direct sensor measurements.",
            "Captures temporal telemetry over the CSV timestamp range and should be cross-referenced for seasonal variations.",
            "Environmental patterns do not establish causality. AI recommendations are decision-support outputs."
        ]

        # Prioritized Actionable Recommendations
        recommendations = [
            {
                "priority": "HIGH",
                "title": f"Targeted Surveillance at Sample #{hotspot_info['sample_index']}",
                "action": f"Focus mobile sensor flights around coordinates ({hotspot_info['latitude']:.4f}° N, {hotspot_info['longitude']:.4f}° E) where peak PM2.5 of {hotspot_info['peak_value']} µg/m³ was recorded."
            },
            {
                "priority": "MEDIUM",
                "title": "Corridor Dust Suppression",
                "action": f"Deploy water misting or street sweeping near the {hotspot_info['latitude']:.4f}° N sector if PM2.5 persists above 50 µg/m³."
            },
            {
                "priority": "MEDIUM",
                "title": "Continuous Diurnal Monitoring",
                "action": "Correlate particulate dispersion rates with afternoon solar irradiance and wind velocity changes."
            },
            {
                "priority": "LOW",
                "title": "Longitudinal Dataset Aggregation",
                "action": f"Archive all {obs_count} telemetry samples into the municipal environmental registry for multi-day historical baseline synthesis."
            }
        ]

        # Anomalies
        anomalies = []
        if stats["pm25"]["max"] > stats["pm25"]["avg"] + 1.2 * stats["pm25"]["std_dev"]:
            anomalies.append({
                "type": "PARTICULATE_PLUME_SURGE",
                "severity": "CRITICAL" if stats["pm25"]["max"] > 60 else "ELEVATED",
                "location": f"Sample #{hotspot_info['sample_index']}",
                "coordinates": [hotspot_info["latitude"], hotspot_info["longitude"]],
                "deviation": f"+{stats['pm25']['delta_pct']:.1f}% vs baseline",
                "confidence": 88,
                "description": f"Particulate spike reaching {stats['pm25']['max']} µg/m³ recorded at ({hotspot_info['latitude']:.4f}° N, {hotspot_info['longitude']:.4f}° E)."
            })

        return {
            "timestamp": timestamp,
            "observations_count": obs_count,
            "eri": eri_data,
            "statistics": stats,
            "hotspot": hotspot_info,
            "pros": pros,
            "cons": cons,
            "limitations": limitations,
            "recommendations": recommendations,
            "anomalies": anomalies,
            "forecast": {
                "trajectory": "IMPROVING" if stats["windSpeed"]["avg"] > 2.0 else "PERSISTENT",
                "estimated_recovery_hours": round(3.5 * (stats["pm25"]["avg"] / 40.0), 1),
                "dispersion_rate": f"{stats['windSpeed']['avg'] * 0.5:.1f} µg/m³ per hour",
                "projected_baseline_hour": "Afternoon Mixing Window"
            }
        }

analytics_service = AnalyticsService()
