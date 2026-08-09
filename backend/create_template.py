import os
import re

html_path = "/home/bhumit/fluxx3.0/frontend/public/camp-area-air-quality-report (1).html"
template_dir = "/home/bhumit/fluxx3.0/backend/app/templates"
os.makedirs(template_dir, exist_ok=True)
template_path = os.path.join(template_dir, "report_template.html")

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Make basic replacements for dynamic data using Jinja2 syntax
replacements = {
    "<title>Camp Area Air Quality Report — 11 Apr 2026</title>": "<title>{{ report.title }} — {{ report.generated_at }}</title>",
    "Camp Area, Pune": "{{ report.location }}",
    "Camp Area is reading unhealthy for sensitive groups": "{{ report.title }}",
    "REPORT DATE — 11 APR 2026": "REPORT DATE — {{ report.generated_at }}",
    "WINDOW — LAST 24 HOURS": "WINDOW — {{ report.window }}",
    "READINGS — 6 DATA POINTS": "READINGS — {{ methodology.observations }} DATA POINTS",
    "AQI · CAMP AREA": "AQI · {{ report.location.split(',')[0] | upper }}",
    "Unhealthy · Sensitive Groups": "{{ summary.risk }}",
    "<div class=\"gauge-number\">103</div>": "<div class=\"gauge-number\">{{ summary.eri }}</div>",
    
    # Readout Grid
    "<div class=\"rc-value\">1</div>": "<div class=\"rc-value\">{{ (methodology.observations / 6) | int }}</div>",  # Just an example logic for red zones
    "<div class=\"rc-value\">6</div>": "<div class=\"rc-value\">{{ methodology.observations }}</div>",
    "<div class=\"rc-value\">36.1<span style=\"font-size:13px;font-family:'IBM Plex Mono',monospace;\"> µg/m³</span></div>": "<div class=\"rc-value\">{{ metrics.pm25.current }}<span style=\"font-size:13px;font-family:'IBM Plex Mono',monospace;\"> {{ metrics.pm25.unit }}</span></div>",
    
    # AI Interpretation
    """Air in the <b>Camp Area of Pune</b> is currently unhealthy for sensitive groups, averaging an AQI of <b>103</b>. The dominant driver is fine particulate matter — PM2.5 is measured at <b>36.1 µg/m³</b>, more than double the WHO guideline of 15 µg/m³.""": "{{ ai.interpretation }}",
    
    # Scale Strip
    "Camp · 103": "{{ report.location.split(',')[0] }} · {{ summary.eri }}",
    "style=\"left:34.3%;\"": "style=\"left:{{ [summary.eri / 3, 100]|min }}%;\"",
    
    # Alert Band
    "Red zone alert — Camp Area, AQI 103": "Alert — {{ report.location }}, AQI {{ summary.eri }}",
    "Immediate attention advised for children, the elderly, and anyone with respiratory or heart conditions. See health precautions below before spending extended time outdoors.": "{{ summary.primary_driver }} alert triggered. Please refer to health precautions below.",
    
    # PM2.5 compare
    "Camp Area, measured": "{{ report.location.split(',')[0] }}, measured",
    "36.1 µg/m³": "{{ metrics.pm25.current }} µg/m³",
    "width:100%;": "width:{{ [metrics.pm25.current / 15 * 41.6, 100]|min }}%;",
    "Camp Area is currently reading <b>2.4×</b> the WHO annual PM2.5 guideline.": "{{ report.location.split(',')[0] }} is currently reading <b>{{ (metrics.pm25.current / 15) | round(1) }}×</b> the WHO annual PM2.5 guideline.",
    
    # Full Report Text
    "Region: <b>Camp Area</b>. Average AQI <b>103</b> — Unhealthy (Sensitive). <b>1</b> red zone, <b>0</b> yellow zones, <b>0</b> green zones across 1 monitored location.": "Region: <b>{{ report.location }}</b>. Average AQI <b>{{ summary.eri }}</b> — {{ summary.risk }}. Processed across {{ methodology.observations }} observations.",
    
    "Air quality in the Camp Area of Pune currently sits at an unhealthy level, with an average AQI of 103 — a band that particularly affects sensitive groups. The primary concern is elevated PM2.5, measured at 36.1 µg/m³, well above the WHO guideline of 15 µg/m³.": "{{ ai.interpretation }}",
    
    "Red Zone Alert — Camp Area (AQI 103)": "{{ summary.risk }} Alert — {{ report.location }} (AQI {{ summary.eri }})",
    
    "<b>Camp Area:</b> AQI 103 (Unhealthy for Sensitive Groups), with concerning PM2.5 levels driving the overall reading.": "<b>{{ report.location }}:</b> AQI {{ summary.eri }} ({{ summary.risk }}), with concerning {{ summary.primary_driver }} driving the overall reading.",
    
    "Peak pollution is recorded around <b>15:00</b> — flagged on the PM2.5 chart above — coinciding with the end of the workday when traffic is heaviest. Increased vehicular emissions and industrial output during this window drive the elevated readings.": "Peak pollution was observed near {{ spatial.hotspot.sector }} reaching {{ spatial.hotspot.peak_value }} {{ spatial.hotspot.parameter }}. {{ ai.interpretation }}",
    
    "REPORT GENERATED 11 APR 2026 · CAMP AREA, PUNE": "REPORT GENERATED {{ report.generated_at }} · {{ report.location | upper }}"
}

for k, v in replacements.items():
    html = html.replace(k, v)

# Replace the Recommendations list dynamically
rec_start = html.find('<ul class="rec-list">')
rec_end = html.find('</ul>', rec_start) + 5

new_recs = '''<ul class="rec-list">
      {% for rec in ai.recommendations %}
      <li><span class="rec-mark">0{{ loop.index }}</span><div><div class="rec-title">{{ rec.split(':')[0] if ':' in rec else 'Recommendation' }}</div><div class="rec-text">{{ rec.split(':')[1] if ':' in rec else rec }}</div></div></li>
      {% else %}
      <li><span class="rec-mark">01</span><div><div class="rec-title">Monitor Trends</div><div class="rec-text">Continue monitoring local environment data.</div></div></li>
      {% endfor %}
    </ul>'''

html = html[:rec_start] + new_recs + html[rec_end:]

with open(template_path, "w", encoding="utf-8") as f:
    f.write(html)
    
print("Template created successfully.")
