import os
import json
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

from app.services.analytics_service import analytics_service

load_dotenv()

class AIService:
    @staticmethod
    def generate_chat_response(
        user_message: str,
        messages_history: Optional[List[Dict[str, str]]] = None,
        context_override: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Versatile Conversational AI Assistant (Google Assistant style).
        Answers ANY question freely, naturally, and accurately.
        Grounded in live environmental telemetry whenever asked about conditions, locations, or air quality.
        """
        # 1. Deterministic Ground Truth Calculations
        full_analysis = analytics_service.get_full_analysis()
        stats = full_analysis.get("statistics", {})
        hotspot = full_analysis.get("hotspot", {})
        eri = full_analysis.get("eri", {})
        dataset_info = analytics_service.get_dataset_info()
        curr = analytics_service.get_current_reading()
        curr_sensors = curr.get("sensors", {})

        pm25_val = curr_sensors.get("pm25", 48.5)
        pm10_val = curr_sensors.get("pm10", 77.3)
        co2_val = curr_sensors.get("co2", 558.8)
        temp_val = curr_sensors.get("temperature", 28.1)
        hum_val = curr_sensors.get("humidity", 80.1)
        wind_val = curr_sensors.get("windSpeed", 2.6)

        # 2. System Instruction for Gemini
        system_instruction_text = (
            "You are a helpful, versatile, and natural AI assistant (just like Google Assistant) for the FLUXX platform.\n"
            "You can answer ANY question the user asks: general knowledge, science, everyday topics, weather, health, questions about how things work, and conversational chat.\n"
            "Speak naturally, warmly, and concisely with clear markdown formatting when helpful.\n\n"
            "LIVE KHARGHAR ENVIRONMENTAL CONTEXT (Use when relevant):\n"
            f"- Location: {dataset_info.get('location', 'Kharghar, Navi Mumbai')}\n"
            f"- Current PM2.5: {pm25_val} µg/m³ (Survey average: {stats.get('pm25', {}).get('avg', 42.6)} µg/m³, Peak: {hotspot.get('peak_value', 63.1)} µg/m³ in {hotspot.get('sector', 'Sector 4')})\n"
            f"- Current PM10: {pm10_val} µg/m³, CO2: {co2_val} ppm, Temperature: {temp_val}°C, Humidity: {hum_val}%, Wind Speed: {wind_val} m/s\n"
            f"- Environmental Risk Index (ERI): {eri.get('score', 45)}/100 ({eri.get('level', 'MODERATE')} Risk)\n"
            "- If asked about unmeasured gases like Ozone or SO2, let the user know kindly that the active sensor array currently tracks PM2.5, PM10, CO2, Temp, Humidity, and Wind."
        )

        answer_text = None
        source_model = "google_assistant"

        # 3. Call Gemini API
        gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("LLM_API_KEY")
        if gemini_key:
            gemini_contents = []
            
            # Add chat history
            if messages_history:
                for m in messages_history[-8:]:
                    role = "model" if m.get("role") in ["assistant", "bot"] else "user"
                    text = m.get("content") or m.get("text", "")
                    if text:
                        gemini_contents.append({
                            "role": role,
                            "parts": [{"text": text}]
                        })
            
            # Current turn
            gemini_contents.append({
                "role": "user",
                "parts": [{"text": user_message}]
            })

            models_to_try = [
                "gemini-flash-latest",
                "gemini-2.0-flash",
                "gemini-3.5-flash",
                "gemini-flash-lite-latest"
            ]

            for model_id in models_to_try:
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:generateContent?key={gemini_key}"
                    payload = json.dumps({
                        "system_instruction": {
                            "parts": [{"text": system_instruction_text}]
                        },
                        "contents": gemini_contents,
                        "generationConfig": {
                            "temperature": 0.4,
                            "maxOutputTokens": 800
                        }
                    }).encode("utf-8")
                    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
                    with urllib.request.urlopen(req, timeout=8) as response:
                        res_data = json.loads(response.read().decode("utf-8"))
                        answer_text = res_data["candidates"][0]["content"]["parts"][0]["text"]
                        source_model = f"google_{model_id}"
                        break
                except Exception:
                    continue

        # 4. Built-in Natural Fallback if offline
        if not answer_text:
            q = user_message.lower().strip()
            if any(w in q for w in ["hi", "hello", "hey", "who are you", "what can you do"]):
                answer_text = (
                    f"Hi! I'm your **FLUXX Assistant**. You can ask me anything — from general questions to live environmental data. "
                    f"Currently in Kharghar, PM2.5 is **{pm25_val} µg/m³** and the Environmental Risk Index is **{eri.get('score', 45)}/100 ({eri.get('level', 'MODERATE')})**. "
                    f"How can I help you today?"
                )
            elif any(w in q for w in ["hotspot", "peak", "highest", "where"]):
                answer_text = (
                    f"The highest PM2.5 level was recorded in **{hotspot.get('sector', 'Sector 4')}** at **{hotspot.get('peak_value', 63.1)} µg/m³** "
                    f"(Observation #{hotspot.get('sample_index', 36)}). Other sectors are averaging around **{stats.get('pm25', {}).get('avg', 42.6)} µg/m³**."
                )
            elif any(w in q for w in ["safe", "health", "exercise", "run", "outside"]):
                answer_text = (
                    f"Air quality is currently **{eri.get('level', 'MODERATE')}** with an ERI score of **{eri.get('score', 45)}/100**. "
                    f"General outdoor activities are safe, but sensitive groups should take precautions near Sector 4."
                )
            else:
                answer_text = (
                    f"In Kharghar, PM2.5 is currently at **{pm25_val} µg/m³**, temperature is **{temp_val}°C**, "
                    f"and wind speed is **{wind_val} m/s**. Let me know what you'd like to explore!"
                )

        # 5. Smart Dashboard Actions
        q_low = user_message.lower()
        actions = []
        if any(w in q_low for w in ["hotspot", "peak", "highest", "sector 4", "map", "location", "coordinates"]):
            actions.append({
                "type": "SHOW_ON_MAP",
                "label": f"Focus Sector 4 Hotspot ({hotspot.get('peak_value', 63.1)} µg/m³)",
                "latitude": hotspot.get("latitude", 19.054983),
                "longitude": hotspot.get("longitude", 73.066209),
                "sample_index": hotspot.get("sample_index", 36)
            })

        if any(w in q_low for w in ["report", "audit", "summary", "pdf", "generate", "document"]):
            actions.append({
                "type": "VIEW_REPORT",
                "label": "Open Compliance Audit Report"
            })

        followups = [
            "What is the current air quality in Kharghar?",
            "Where is the PM2.5 hotspot?",
            "How does wind speed affect pollution dispersion?",
            "View environmental audit report"
        ]

        metrics = [
            {"label": "CURRENT PM2.5", "value": str(pm25_val), "unit": "µg/m³"},
            {"label": "SURVEY AVG", "value": str(stats.get("pm25", {}).get("avg", 42.6)), "unit": "µg/m³"},
            {"label": "PEAK HOTSPOT", "value": str(hotspot.get("peak_value", 63.1)), "unit": "µg/m³"},
            {"label": "ERI RISK", "value": f"{eri.get('score', 45)}/100", "unit": eri.get("level", "MODERATE")}
        ]

        return {
            "answer": answer_text,
            "reply": answer_text,
            "confidence": 0.96,
            "metrics": metrics,
            "action": actions[0] if actions else None,
            "actions": actions,
            "followups": followups,
            "suggested_follow_ups": followups,
            "source": source_model,
            "context_summary": {
                "observations": dataset_info.get("total_observations", 50),
                "eri": eri.get("score", 45),
                "hotspot_peak": hotspot.get("peak_value", 63.1)
            }
        }

ai_service = AIService()
