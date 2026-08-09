import requests
import json
import time

def test_query(q):
    print(f"\n======================================")
    print(f"QUESTION: {q}")
    print(f"======================================")
    try:
        resp = requests.post("http://127.0.0.1:8000/api/ai/chat", json={"message": q}, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            print(f"ANSWER: {data.get('answer', '')[:300]}...")
            print(f"SOURCES: {json.dumps(data.get('sources', {}), indent=2)}")
        else:
            print(f"ERROR: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"EXCEPTION: {e}")

test_query("What is the AQI in Kharghar?")
test_query("What does PM2.5 mean?")
test_query("Why is the AQI high in Kharghar?")
test_query("Has PM2.5 increased over the last 20 minutes?")
