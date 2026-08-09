import asyncio
from app.services.ai_service import ai_service

async def run_tests():
    questions = [
        "What is the average PM2.5 in Kharghar?",
        "What is the maximum PM2.5 in kharghar dataset?",
        "What is the NO2 level in kharghar?"
    ]
    for q in questions:
        print(f"\n--- Q: {q} ---")
        try:
            res = await ai_service.chat(q)
            print(f"Grounded: {res['grounded']}, Dataset: {res['dataset']}")
            print(f"Answer: {res['answer']}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(run_tests())
