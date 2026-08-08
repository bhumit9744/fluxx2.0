import React from 'react';
import { FileText, Download, CheckCircle2 } from 'lucide-react';
import { reportService } from '../../services/reports';

export const ReportLibrary: React.FC = () => {
  const reports = [
    {
      id: 'REP-2026-08-01',
      title: 'Kharghar Sector A-4 Comprehensive Audit',
      date: '2026-08-08 06:00:00',
      eri: 64,
      status: 'VERIFIED'
    },
    {
      id: 'REP-2026-08-02',
      title: 'Navi Mumbai Atmospheric Baseline Survey',
      date: '2026-08-07 14:00:00',
      eri: 48,
      status: 'ARCHIVED'
    }
  ];

  return (
    <div className="p-6 rounded-3xl bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-700">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-slate-900">
            Compliance Audit Library
          </h3>
          <p className="text-xs font-mono text-slate-400">
            Historical autonomous PDF reports
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100 font-mono text-xs">
        {reports.map((r) => (
          <div key={r.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">{r.title}</div>
              <div className="text-slate-400 text-[10px]">{r.date} • ERI: {r.eri}/100</div>
            </div>
            <button
              onClick={() => reportService.downloadPdf()}
              className="p-2 rounded-xl bg-slate-100 hover:bg-[#DDF6F2] hover:text-[#0EA89A] text-slate-600 transition-all cursor-pointer"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
