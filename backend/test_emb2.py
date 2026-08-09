import os
import urllib.request
import urllib.error
import json
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

url = f"https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key={api_key}"
payload = json.dumps({
    "model": "models/embedding-001",
    "content": {
        "parts": [{"text": "test"}]
    }
}).encode("utf-8")

try:
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as response:
        res_data = json.loads(response.read().decode("utf-8"))
        print("Success! Dimensions:", len(res_data["embedding"]["values"]))
except Exception as e:
    print(f"Exception: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode())
