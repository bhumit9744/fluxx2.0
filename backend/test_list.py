import os
import urllib.request
import json
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=10) as response:
        res_data = json.loads(response.read().decode("utf-8"))
        for m in res_data.get("models", []):
            if "embed" in m["name"].lower():
                print(m["name"], m["supportedGenerationMethods"])
except Exception as e:
    print(f"Exception: {e}")
