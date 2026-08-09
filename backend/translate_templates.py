import os
import json
import urllib.request
import time

def translate_html(html, target_lang):
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("LLM_API_KEY")
    if not gemini_key:
        print("No API key")
        return html
    
    prompt = f"""You are a professional translator. Translate all the English static text in the following HTML template into {target_lang}.
CRITICAL RULES:
1. DO NOT translate or modify any HTML tags, classes, styles, IDs, or structure.
2. DO NOT translate or modify any Jinja2 variables (e.g. {{{{ ... }}}}) or template logic (e.g. {{% ... %}}).
3. Only translate the human-readable English text content.
4. Return ONLY the translated HTML code, without markdown formatting or backticks.

HTML:
{html}
"""
    
    gemini_contents = [{"role": "user", "parts": [{"text": prompt}]}]
    models_to_try = ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-flash-latest"]
    
    for model_id in models_to_try:
        try:
            print(f"Trying {model_id} for {target_lang}...")
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:generateContent?key={gemini_key}"
            payload = json.dumps({
                "contents": gemini_contents,
                "generationConfig": {"temperature": 0.1, "maxOutputTokens": 8192}
            }).encode("utf-8")
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=30) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                text = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                if text.startswith("```html"):
                    text = text[7:]
                if text.endswith("```"):
                    text = text[:-3]
                return text.strip()
        except Exception as e:
            print(f"Error with {model_id}: {e}")
            continue
            
    return html

def main():
    templates_dir = "/home/bhumit/fluxx3.0/backend/app/templates"
    src_path = os.path.join(templates_dir, "report_template.html")
    en_path = os.path.join(templates_dir, "report_template_en.html")
    hi_path = os.path.join(templates_dir, "report_template_hi.html")
    mr_path = os.path.join(templates_dir, "report_template_mr.html")

    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Rename original to _en
    os.rename(src_path, en_path)
    print("Renamed to report_template_en.html")

    # Translate to Hindi
    hi_html = translate_html(html, "Hindi")
    with open(hi_path, "w", encoding="utf-8") as f:
        f.write(hi_html)
    print("Created report_template_hi.html")
    
    time.sleep(2) # rate limit prevention

    # Translate to Marathi
    mr_html = translate_html(html, "Marathi")
    with open(mr_path, "w", encoding="utf-8") as f:
        f.write(mr_html)
    print("Created report_template_mr.html")

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv("/home/bhumit/fluxx3.0/backend/.env")
    main()
