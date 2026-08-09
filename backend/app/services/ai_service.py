import os
import json
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

from .csv_ai.csv_tools import csv_tools
from .csv_ai.query_router import (
    detect_parameter,
    detect_operation,
    is_data_question,
    resolve_dataset,
)
from .csv_ai.context_builder import (
    build_data_context,
)
from .rag_engine import rag_engine

load_dotenv()

SYSTEM_PROMPT = """
You are FLUXX Environmental Intelligence Copilot.

You answer using verified FLUXX data supplied by the backend.

CRITICAL RULES:

1. Never invent sensor measurements.
2. Never change a number supplied by the backend.
3. Never invent coordinates.
4. Never invent timestamps.
5. Never claim a pollutant was measured if it is absent.
6. Python/Pandas calculations are authoritative.
7. Your job is to explain the verified results naturally.
8. Clearly distinguish measured data from general knowledge.
9. If data is unavailable, say so.
10. Do not make up environmental statistics.
"""

class AIService:
    async def chat(
        self,
        question: str,
        history: Optional[List[Dict[str, str]]] = None,
    ) -> Dict[str, Any]:

        data_context = ""
        dataset = None

        if is_data_question(question):
            dataset = resolve_dataset(question)
            
            if dataset:
                parameter = detect_parameter(question)
                operation = detect_operation(question)
                
                try:
                    result = await self.execute_query(
                        dataset=dataset,
                        parameter=parameter,
                        operation=operation,
                    )
                    
                    data_context = build_data_context(
                        question,
                        dataset,
                        result,
                    )
                except ValueError as e:
                    data_context = f"FLUXX VERIFIED DATA ERROR:\n{str(e)}\n\nIMPORTANT RULES:\nTell the user the requested parameter is not available. List the available parameters. Do not apologize, just state the facts."
                    
        # RAG Retrieval - Supplement with semantic search context from vector database
        rag_context = rag_engine.retrieve(question, k=5)
        if rag_context:
            data_context += f"\n\nADDITIONAL RAG CONTEXT (VECTOR SEARCH RESULTS):\n{rag_context}\n"

        prompt = f"""
{SYSTEM_PROMPT}

{data_context}

USER QUESTION:
{question}
"""

        answer_text = None
        gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("LLM_API_KEY")

        if gemini_key:
            gemini_contents = []
            
            if history:
                for m in history[-8:]:
                    role = "model" if m.get("role") in ["assistant", "bot"] else "user"
                    text = m.get("content") or m.get("text", "")
                    if text:
                        gemini_contents.append({
                            "role": role,
                            "parts": [{"text": text}]
                        })
                        
            gemini_contents.append({
                "role": "user",
                "parts": [{"text": prompt}]
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
                        "contents": gemini_contents,
                        "generationConfig": {
                            "temperature": 0.3,
                            "maxOutputTokens": 800
                        }
                    }).encode("utf-8")
                    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
                    with urllib.request.urlopen(req, timeout=8) as response:
                        res_data = json.loads(response.read().decode("utf-8"))
                        answer_text = res_data["candidates"][0]["content"]["parts"][0]["text"]
                        break
                except Exception:
                    continue

        if not answer_text:
            answer_text = "Sorry, I am currently unable to reach the AI models. However, your data is still being processed."

        return {
            "answer": answer_text,
            "dataset": dataset if data_context else None,
            "grounded": bool(data_context),
        }

    async def translate_text(self, text: str, target_language: str) -> str:
        """Translates text to the target language using Gemini API."""
        if target_language.lower() in ["en", "english"]:
            return text
            
        gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("LLM_API_KEY")
        if not gemini_key:
            return text
            
        prompt = f"Translate the following text into {target_language}. Keep technical terms intact and maintain the formatting. Return ONLY the translated text, without quotes or extra conversational text.\n\nText to translate:\n{text}"
        
        gemini_contents = [{"role": "user", "parts": [{"text": prompt}]}]
        models_to_try = ["gemini-flash-latest", "gemini-2.0-flash", "gemini-3.5-flash", "gemini-flash-lite-latest"]
        
        for model_id in models_to_try:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:generateContent?key={gemini_key}"
                payload = json.dumps({
                    "contents": gemini_contents,
                    "generationConfig": {"temperature": 0.1, "maxOutputTokens": 2048}
                }).encode("utf-8")
                req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
                with urllib.request.urlopen(req, timeout=8) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    return res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
            except Exception as e:
                continue
                
        return text

    async def execute_query(
        self,
        dataset: str,
        parameter: Optional[str],
        operation: Optional[str],
    ) -> Dict[str, Any]:

        if operation == "average":
            return csv_tools.average(dataset, parameter)

        if operation == "maximum":
            return csv_tools.maximum(dataset, parameter)

        if operation == "minimum":
            return csv_tools.minimum(dataset, parameter)

        if operation == "latest":
            return csv_tools.latest(dataset, parameter)

        if operation == "trend":
            return csv_tools.trend(dataset, parameter)

        if operation == "count":
            return csv_tools.count(dataset)

        if operation == "compare":
            parameters = [parameter] if parameter else []
            return csv_tools.compare(dataset, parameters)

        return csv_tools.records(dataset, parameter)

ai_service = AIService()
