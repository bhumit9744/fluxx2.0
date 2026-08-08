import React, { useRef } from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';
import { Loader2, Download } from 'lucide-react';
import { Sparkline } from './ReportCharts';

export const ReportPreview: React.FC = () => {
  const { reportData, allSamples, isGeneratingReport } = useEnvironmentStore();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (isGeneratingReport || !reportData) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <div className="p-10 max-w-md w-full">
          <div className="flex flex-col items-center mb-8">
            <Loader2 className="w-12 h-12 text-[#0A9F91] animate-spin mb-4" />
            <h2 className="text-lg font-bold font-sans text-[#172027] tracking-tight">GENERATING ENVIRONMENTAL DOSSIER</h2>
          </div>
          <div className="space-y-3 font-mono text-xs text-[#7A858C]">
            <div className="flex items-center space-x-3"><span className="text-emerald-500">✓</span><span>Loading sensor observations</span></div>
            <div className="flex items-center space-x-3"><span className="text-emerald-500">✓</span><span>Calculating environmental statistics</span></div>
            <div className="flex items-center space-x-3"><span className="text-emerald-500">✓</span><span>Detecting spatial hotspots</span></div>
            <div className="flex items-center space-x-3 text-[#172027] font-bold"><Loader2 className="w-3 h-3 animate-spin text-[#0EA89A]" /><span>Calculating environmental risk...</span></div>
            <div className="flex items-center space-x-3 opacity-40"><span className="w-3" /><span>Running AI environmental analysis</span></div>
            <div className="flex items-center space-x-3 opacity-40"><span className="w-3" /><span>Building map snapshot</span></div>
          </div>
        </div>
      </div>
    );
  }

  const { report, summary, metrics, spatial, trends, ai, pros, cons, methodology } = reportData as any;

  // Calculate ERI angle for the SVG gauge
  const angle = (summary.eri / 100) * Math.PI; 
  const r = 90;
  const cx = 100 - Math.cos(angle) * r;
  const cy = 100 - Math.sin(angle) * r;

  return (
    <div className="flex flex-col items-center w-full min-h-full pb-12">
      
      {/* Controls Bar Outside Document (Hidden during print) */}
      <div className="w-full max-w-[980px] flex items-center justify-between bg-white px-5 py-3 border-b border-[#E4E9ED] mb-8 sticky top-0 z-10 print:hidden">
        <div className="text-xs text-[#7A858C] flex items-center space-x-2">
          <span className="font-bold text-[#172027] font-mono uppercase">ENVIRONMENTAL DOSSIER</span>
        </div>
        
        <button 
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-[#0EA89A] hover:bg-[#0B857A] text-white px-4 py-2 rounded-xl shadow-sm transition-colors text-xs font-bold font-mono tracking-widest uppercase"
        >
          <Download className="w-4 h-4" />
          <span>DOWNLOAD PDF</span>
        </button>
      </div>

      {/* Scoped CSS for the Dossier */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #root { background-color: white !important; }
          .print\\:hidden { display: none !important; }
          .fluxx-dossier, .fluxx-dossier * { visibility: visible; }
          .fluxx-dossier {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
          }
        }
        
        .fluxx-dossier {
          --bg: #FFFFFF;
          --ink: #14141A;
          --ink-soft: rgba(20,20,26,0.56);
          --ink-faint: rgba(20,20,26,0.34);
          --line: rgba(20,20,26,0.12);
          --accent: #E2711D;
          --accent-soft: rgba(226,113,29,0.10);
          --accent-line: rgba(226,113,29,0.35);
          --alert: #D62839;
          --alert-soft: rgba(214,40,57,0.07);
          
          width: 100%;
          max-width: 980px; 
          margin: 0 auto; 
          background: var(--bg);
          color: var(--ink);
          font-family: 'IBM Plex Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          text-align: left;
          box-shadow: 0 10px 40px rgba(20,33,38,0.1);
          border-radius: 8px;
          overflow: hidden;
        }

        .fluxx-dossier * { box-sizing: border-box; }
        .fluxx-dossier .wrap { padding: 0 40px 90px; }

        .fluxx-dossier .topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 0 18px;
          border-bottom: 1px solid var(--line);
          margin-bottom: 36px;
        }
        .fluxx-dossier .brand { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: 0.14em; }
        .fluxx-dossier .brand span { color: var(--accent); }
        .fluxx-dossier .station-tag {
          font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em;
          color: var(--ink-soft); display: flex; align-items: center; gap: 8px;
        }
        .fluxx-dossier .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--alert); box-shadow: 0 0 0 3px var(--alert-soft); }
        
        .fluxx-dossier .eyebrow {
          font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--accent); margin: 0 0 10px;
        }
        .fluxx-dossier h1 {
          font-family: 'Space Grotesk', sans-serif; font-weight: 600;
          font-size: clamp(30px, 4.4vw, 44px); line-height: 1.06; letter-spacing: -0.01em; margin: 0 0 12px;
        }
        .fluxx-dossier .meta-row {
          font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-soft);
          display: flex; gap: 18px; flex-wrap: wrap; text-transform: uppercase;
        }

        .fluxx-dossier .hero {
          margin-top: 40px; display: grid; grid-template-columns: 300px 1fr;
          border: 1px solid var(--line); border-radius: 16px; overflow: hidden;
        }
        @media (max-width: 720px){ .fluxx-dossier .hero{ grid-template-columns: 1fr; } }

        .fluxx-dossier .gauge-panel {
          padding: 28px 24px 24px; display: flex; flex-direction: column; align-items: center;
          border-right: 1px solid var(--line);
          background: radial-gradient(circle at 50% 22%, var(--accent-soft), transparent 65%);
        }
        @media (max-width: 720px){ .fluxx-dossier .gauge-panel{ border-right: none; border-bottom: 1px solid var(--line); } }

        .fluxx-dossier .panel-label {
          font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--ink-faint); align-self: flex-start; margin-bottom: 8px;
        }

        .fluxx-dossier .gauge-svg { width: 196px; height: 112px; overflow: visible; margin-top: 4px; }
        .fluxx-dossier .tick-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; fill: var(--ink-faint); }

        .fluxx-dossier .gauge-readout { text-align: center; margin-top: 0; }
        .fluxx-dossier .gauge-number {
          font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 56px;
          line-height: 1; color: var(--ink); letter-spacing: -0.02em;
        }
        .fluxx-dossier .gauge-unit { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink-soft); letter-spacing: 0.08em; margin-top: 2px; text-transform: uppercase; }
        .fluxx-dossier .gauge-status {
          margin-top: 14px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.06em;
          text-transform: uppercase; background: var(--ink); color: #fff; padding: 6px 14px; border-radius: 100px;
        }

        .fluxx-dossier .hero-side { padding: 28px 28px 24px; }
        .fluxx-dossier .readout-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
          background: var(--line); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; margin-bottom: 18px;
        }
        .fluxx-dossier .readout-cell { background: #fff; padding: 16px 18px; }
        .fluxx-dossier .rc-label { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 6px; }
        .fluxx-dossier .rc-value { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 24px; line-height: 1.1; }
        .fluxx-dossier .rc-sub { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: var(--ink-soft); margin-top: 2px; }
        .fluxx-dossier .readout-cell.flag .rc-value { color: var(--alert); }

        .fluxx-dossier .hero-summary { font-size: 14.5px; line-height: 1.65; color: var(--ink-soft); }
        .fluxx-dossier .hero-summary b { color: var(--ink); font-weight: 600; }

        .fluxx-dossier .scale-card { margin-top: 18px; border: 1px solid var(--line); border-radius: 14px; padding: 20px 22px; }
        .fluxx-dossier .chart-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14.5px; margin-bottom: 4px; }
        .fluxx-dossier .chart-note { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: var(--ink-soft); margin-bottom: 16px; text-transform: uppercase; }
        .fluxx-dossier .scale-track { position: relative; height: 34px; border-radius: 8px; overflow: visible; display: flex; }
        .fluxx-dossier .scale-seg { flex: 1; position: relative; }
        .fluxx-dossier .scale-seg:first-child { border-radius: 8px 0 0 8px; }
        .fluxx-dossier .scale-seg:last-child { border-radius: 0 8px 8px 0; }
        .fluxx-dossier .scale-labels { display: flex; margin-top: 8px; }
        .fluxx-dossier .scale-labels span {
          flex: 1; font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--ink-faint);
          text-align: center; line-height: 1.3;
        }
        .fluxx-dossier .scale-marker {
          position: absolute; top: -28px; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center;
        }
        .fluxx-dossier .sm-tag {
          font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 500; color: var(--ink);
          background: #fff; border: 1px solid var(--ink); border-radius: 6px; padding: 2px 7px; white-space: nowrap; text-transform: uppercase;
        }
        .fluxx-dossier .sm-tri {
          width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent;
          border-top: 6px solid var(--ink); margin-top: 1px;
        }

        .fluxx-dossier .alert {
          margin-top: 26px; border: 1px solid var(--alert); background: var(--alert-soft); border-radius: 14px;
          padding: 20px 24px; display: flex; gap: 16px; align-items: flex-start;
        }
        .fluxx-dossier .alert .flag-icon {
          flex: 0 0 auto; width: 34px; height: 34px; border-radius: 50%; background: var(--alert); color: #fff;
          display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px;
        }
        .fluxx-dossier .alert h3 { font-family: 'Space Grotesk', sans-serif; font-size: 16px; margin: 2px 0 4px; color: var(--alert); }
        .fluxx-dossier .alert p { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--ink); }

        .fluxx-dossier .section { margin-top: 52px; }
        .fluxx-dossier .section-head {
          display: flex; align-items: baseline; justify-content: space-between;
          border-bottom: 1px solid var(--line); padding-bottom: 10px; margin-bottom: 22px;
        }
        .fluxx-dossier .section-head h2 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 20px; margin: 0; }
        .fluxx-dossier .section-head .tag { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); }

        .fluxx-dossier .chart-card { border: 1px solid var(--line); border-radius: 14px; padding: 22px 22px 18px; margin-bottom: 18px; }
        
        .fluxx-dossier .two-col-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        @media (max-width: 720px){ .fluxx-dossier .two-col-charts { grid-template-columns: 1fr; } }
        
        .fluxx-dossier .report-lede { font-size: 15px; line-height: 1.75; color: var(--ink-soft); max-width: 70ch; }
        .fluxx-dossier .report-lede b { color: var(--ink); }

        .fluxx-dossier .subhead {
          font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px;
          margin: 26px 0 8px; display: flex; align-items: center; gap: 8px;
        }
        .fluxx-dossier .subhead .swatch-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
        .fluxx-dossier .body-text { font-size: 14.5px; line-height: 1.75; color: var(--ink-soft); max-width: 70ch; }
        .fluxx-dossier .body-text b { color: var(--ink); font-weight: 600; }

        .fluxx-dossier .precaution-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; }
        @media (max-width: 600px){ .fluxx-dossier .precaution-grid{ grid-template-columns: 1fr; } }
        .fluxx-dossier .precaution-card { border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; }
        .fluxx-dossier .pc-title { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); margin-bottom: 5px; }
        .fluxx-dossier .pc-text { font-size: 13.5px; line-height: 1.55; color: var(--ink-soft); }

        .fluxx-dossier .rec-list { list-style: none; margin: 14px 0 0; padding: 0; display: grid; gap: 10px; }
        .fluxx-dossier .rec-list li { display: flex; gap: 12px; align-items: flex-start; border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }
        .fluxx-dossier .rec-mark {
          flex: 0 0 auto; width: 20px; height: 20px; border-radius: 5px; background: var(--accent-soft); color: var(--accent);
          display: flex; align-items: center; justify-content: center; font-family: 'IBM Plex Mono', monospace; font-size: 11px; margin-top: 1px;
        }
        .fluxx-dossier .rec-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px; margin-bottom: 2px; }
        .fluxx-dossier .rec-text { font-size: 13px; line-height: 1.55; color: var(--ink-soft); }

        .fluxx-dossier .conclusion { margin-top: 46px; border: 1px solid var(--ink); border-radius: 14px; padding: 24px 26px; }
        .fluxx-dossier .c-label { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
        .fluxx-dossier .conclusion p { margin: 0; font-size: 14.5px; line-height: 1.7; color: var(--ink); max-width: 68ch; }

        .fluxx-dossier footer {
          margin-top: 60px; padding-top: 18px; border-top: 1px solid var(--line);
          display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px;
          color: var(--ink-faint); flex-wrap: wrap; gap: 8px;
        }
      `}</style>

      <div className="fluxx-dossier" ref={printRef}>
        <div className="wrap">
          <div className="topbar">
            <div className="brand">FLU<span>XX</span></div>
            <div className="station-tag"><span className="dot"></span> SENSOR NETWORK · LIVE</div>
          </div>

          <p className="eyebrow">Air Quality Report · {report.location}</p>
          <h1>{report.location} is {summary.risk.toLowerCase()}</h1>
          <div className="meta-row">
            <span>REPORT DATE — {report.generated_at.split(',')[0]}</span>
            <span>WINDOW — {report.window}</span>
            <span>READINGS — {spatial.sensor_count} DATA POINTS</span>
          </div>

          {/* HERO */}
          <div className="hero">
            <div className="gauge-panel">
              <div className="panel-label">AQI Dial</div>
              <svg className="gauge-svg" viewBox="0 0 200 112">
                <path d="M10,100 A90,90 0 0 1 190,100" fill="none" stroke="rgba(20,20,26,0.08)" strokeWidth="12" strokeLinecap="round"/>
                <path d={`M10,100 A90,90 0 0 1 ${cx},${cy}`} fill="none" stroke={summary.eri > 70 ? 'var(--alert)' : (summary.eri > 40 ? 'var(--accent)' : '#0A9F91')} strokeWidth="12" strokeLinecap="round"/>
                <line x1="100" y1="100" x2={cx} y2={cy} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="100" cy="100" r="6" fill="var(--ink)"/>
                <text x="10" y="110" className="tick-label" textAnchor="middle">0</text>
                <text x="100" y="6" className="tick-label" textAnchor="middle">50</text>
                <text x="190" y="110" className="tick-label" textAnchor="middle">100</text>
              </svg>
              <div className="gauge-readout">
                <div className="gauge-number">{summary.eri}</div>
                <div className="gauge-unit">ERI · {report.location.split(',')[0]}</div>
              </div>
              <div className="gauge-status" style={{ backgroundColor: summary.eri > 70 ? 'var(--alert)' : (summary.eri > 40 ? 'var(--accent)' : '#0A9F91') }}>
                {summary.risk}
              </div>
            </div>

            <div className="hero-side">
              <div className="panel-label">Sensor Readout</div>
              <div className="readout-grid">
                <div className={`readout-cell ${metrics.pm25.status !== 'NOMINAL' ? 'flag' : ''}`}>
                  <div className="rc-label">PM2.5</div>
                  <div className="rc-value">{metrics.pm25.current.toFixed(1)}<span style={{ fontSize: '13px', fontFamily: "'IBM Plex Mono', monospace" }}> {metrics.pm25.unit}</span></div>
                  <div className="rc-sub">status: {metrics.pm25.status}</div>
                </div>
                <div className={`readout-cell ${metrics.pm10.status !== 'NOMINAL' ? 'flag' : ''}`}>
                  <div className="rc-label">PM10</div>
                  <div className="rc-value">{metrics.pm10.current.toFixed(1)}<span style={{ fontSize: '13px', fontFamily: "'IBM Plex Mono', monospace" }}> {metrics.pm10.unit}</span></div>
                  <div className="rc-sub">status: {metrics.pm10.status}</div>
                </div>
                <div className={`readout-cell ${metrics.co2.status !== 'NOMINAL' ? 'flag' : ''}`}>
                  <div className="rc-label">CO2</div>
                  <div className="rc-value">{metrics.co2.current.toFixed(0)}<span style={{ fontSize: '13px', fontFamily: "'IBM Plex Mono', monospace" }}> {metrics.co2.unit}</span></div>
                  <div className="rc-sub">status: {metrics.co2.status}</div>
                </div>
                <div className="readout-cell">
                  <div className="rc-label">Confidence</div>
                  <div className="rc-value">{summary.confidence}<span style={{ fontSize: '13px', fontFamily: "'IBM Plex Mono', monospace" }}> %</span></div>
                  <div className="rc-sub">AI interpretation certainty</div>
                </div>
              </div>
              <div className="hero-summary">
                Air in <b>{report.location}</b> is currently classified as <b>{summary.risk.toLowerCase()}</b>, with an ERI of <b>{summary.eri}</b>. The dominant driver is <b>{summary.primary_driver.toLowerCase()}</b>, with the highest concentration observed at sample #{spatial.hotspot.sample_index}.
              </div>
            </div>
          </div>

          {/* AQI SCALE STRIP */}
          <div className="scale-card">
            <div className="chart-title">Where {summary.eri} sits on the ERI scale</div>
            <div className="chart-note">Environmental Risk Index (0-100)</div>
            <div className="scale-track">
              <div className="scale-marker" style={{ left: `${summary.eri}%` }}>
                <div className="sm-tag">ERI · {summary.eri}</div>
                <div className="sm-tri"></div>
              </div>
              <div className="scale-seg" style={{ background: 'rgba(10, 159, 145, 0.4)' }}></div>
              <div className="scale-seg" style={{ background: 'rgba(10, 159, 145, 0.8)' }}></div>
              <div className="scale-seg" style={{ background: 'rgba(226, 113, 29, 0.6)' }}></div>
              <div className="scale-seg" style={{ background: 'rgba(214, 40, 57, 0.7)' }}></div>
              <div className="scale-seg" style={{ background: 'var(--alert)' }}></div>
            </div>
            <div className="scale-labels">
              <span>Optimal<br/>0–20</span>
              <span>Nominal<br/>21–40</span>
              <span>Moderate<br/>41–70</span>
              <span>High Risk<br/>71–90</span>
              <span>Critical<br/>91–100</span>
            </div>
          </div>

          {/* ALERT */}
          {summary.eri > 40 && (
            <div className="alert" style={summary.eri > 70 ? {} : { borderColor: 'var(--accent)', background: 'var(--accent-soft)' }}>
              <div className="flag-icon" style={summary.eri > 70 ? {} : { background: 'var(--accent)' }}>!</div>
              <div>
                <h3 style={summary.eri > 70 ? {} : { color: 'var(--accent)' }}>Hotspot alert — {spatial.hotspot.sector}</h3>
                <p>Immediate attention advised for elevated levels of {spatial.hotspot.parameter}. Peak concentration of {spatial.hotspot.peak_value} detected at coordinates {spatial.hotspot.latitude.toFixed(5)}°N, {spatial.hotspot.longitude.toFixed(5)}°E.</p>
              </div>
            </div>
          )}

          {/* CHARTS */}
          <div className="section">
            <div className="section-head">
              <h2>Sensor Trends</h2>
              <span className="tag">Live Monitoring Window</span>
            </div>

            <div className="chart-card">
              <div className="chart-title">PM2.5 Trend Over Time</div>
              <div className="chart-note">micrograms per cubic metre · sparkline generated from sensor telemetry</div>
              <Sparkline data={allSamples} parameter="pm25" color="var(--accent)" height={140} />
            </div>

            <div className="two-col-charts">
              <div className="chart-card">
                <div className="chart-title">PM10 Trend Over Time</div>
                <div className="chart-note">micrograms per cubic metre</div>
                <Sparkline data={allSamples} parameter="pm10" color="var(--ink)" height={140} />
              </div>

              <div className="chart-card">
                <div className="chart-title">CO₂ Trend Over Time</div>
                <div className="chart-note">parts per million</div>
                <Sparkline data={allSamples} parameter="co2" color="#0A9F91" height={140} />
              </div>
            </div>
          </div>

          {/* FULL REPORT */}
          <div className="section">
            <div className="section-head">
              <h2>Full Environmental Report</h2>
              <span className="tag">AI Investigation Results</span>
            </div>

            <p className="report-lede">
              {ai.interpretation}
            </p>

            <div className="subhead"><span className="swatch-dot"></span>Executive Summary</div>
            <div className="body-text">
              The AI engine analyzed {methodology.observations} total observations across {methodology.parameters}. The dataset confirms a {summary.risk.toLowerCase()} environmental status, strongly influenced by {summary.primary_driver.toLowerCase()}. Spatial modeling (via {methodology.spatial_method}) confidently localizes the emission epicenter near {spatial.hotspot.sector}.
            </div>

            <div className="subhead"><span className="swatch-dot" style={{ background: 'var(--alert)' }}></span>Detected Environmental Concerns</div>
            <div className="body-text">
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                {cons.map((c: string, i: number) => (
                  <li key={i} style={{ marginBottom: '8px' }}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="subhead"><span className="swatch-dot" style={{ background: '#0A9F91' }}></span>Environmental Strengths</div>
            <div className="body-text">
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                {pros.map((p: string, i: number) => (
                  <li key={i} style={{ marginBottom: '8px' }}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="subhead"><span className="swatch-dot"></span>AI Recommendations</div>
            <ul className="rec-list">
              {ai.recommendations.map((r: any, i: number) => (
                <li key={i}>
                  <span className="rec-mark">0{i + 1}</span>
                  <div>
                    <div className="rec-title">{r.title || r}</div>
                    {r.action && <div className="rec-text">{r.action}</div>}
                  </div>
                </li>
              ))}
            </ul>

            <div className="conclusion">
              <div className="c-label">Limitation Notice</div>
              <p>{methodology.limitations}</p>
            </div>
          </div>

          <footer>
            <span>FLUXX AEROSPACE INTELLIGENCE</span>
            <span>REPORT ID: {report.id} · GENERATED {report.generated_at.toUpperCase()}</span>
          </footer>

        </div>
      </div>
    </div>
  );
};
