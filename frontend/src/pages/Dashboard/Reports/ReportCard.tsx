import React, { useState } from 'react';
import { Eye, Download, Trash2, Calendar, Database, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { ReportItem, useEnvironmentStore } from '../../../stores/environmentStore';

interface ReportCardProps {
  report: ReportItem;
  onView: (report: ReportItem) => void;
  onDelete: (id: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onView, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '09 Aug 2026';

  const typeLabels: Record<string, string> = {
    survey: 'ENVIRONMENTAL SURVEY',
    analysis: 'ENVIRONMENTAL ANALYSIS',
    compliance: 'COMPLIANCE REPORT',
    incident: 'INCIDENT REPORT'
  };

  const typeLabel = typeLabels[report.type] || 'ENVIRONMENTAL REPORT';
  const obsCount = report.observations || report.dataset?.observations || 300;
  const pm25Val = report.metrics?.pm25 != null ? report.metrics.pm25.toFixed(1) : (report.pm25 != null ? report.pm25.toFixed(1) : '48.5');
  const eriScore = report.risk?.score ?? report.eri ?? 64;
  const riskLevel = report.risk?.level ?? report.risk_level ?? 'MODERATE';

  // Determine risk level badge colors
  const getRiskBadgeStyles = (level: string) => {
    switch (level.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]';
      case 'MODERATE':
      case 'ELEVATED':
        return 'bg-[#FFF0E5] text-[#F47A24] border-[#F47A24]/30';
      case 'NOMINAL':
      case 'OPTIMAL':
      default:
        return 'bg-[#DCFCE7] text-[#16A34A] border-[#86EFAC]';
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView(report);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete report "${report.title}" (${report.id})?`)) {
      onDelete(report.id);
    }
  };

  return (
    <div 
      onClick={() => onView(report)}
      className="group relative rounded-3xl bg-white/80 hover:bg-white backdrop-blur-xl border border-[#F3E6D7] hover:border-[#F47A24]/50 shadow-xs hover:shadow-[0_8px_24px_rgba(70,40,20,0.06)] p-5 transition-all duration-200 cursor-pointer select-none font-sans"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left Column: Metadata & Title */}
        <div className="space-y-2 flex-1">
          
          {/* Top Tag Row */}
          <div className="flex items-center space-x-2.5">
            <span className="text-[10px] font-extrabold text-[#F47A24] uppercase tracking-wider font-mono bg-[#FFF0E5] px-2.5 py-0.5 rounded-md border border-[#F47A24]/20">
              {typeLabel}
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#3FA66B] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3FA66B] animate-pulse"></span>
              <span>GENERATED</span>
            </div>
            <span className="text-[11px] font-mono text-[#8C827A]">
              · {report.id}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-black text-[#2B211C] tracking-tight group-hover:text-[#F47A24] transition-colors">
            {report.title}
          </h3>

          {/* Subtitle / Context Metadata */}
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-[#8C827A]">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#F47A24]" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-[#8C827A]" />
              <span>{obsCount} observations</span>
            </div>
            <span>·</span>
            <span>{report.location}</span>
          </div>

        </div>

        {/* Middle Column: 3 Metric Pill Boxes */}
        <div className="grid grid-cols-3 gap-2.5 shrink-0 py-1 lg:py-0">
          
          {/* PM2.5 Box */}
          <div className="px-3.5 py-2 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7] min-w-[90px]">
            <div className="text-[9.5px] font-extrabold text-[#8C827A] uppercase font-mono">PM2.5</div>
            <div className="text-[16px] font-black text-[#2B211C] font-mono leading-none mt-1">
              {pm25Val} <span className="text-[10px] font-normal text-[#8C827A]">µg</span>
            </div>
          </div>

          {/* ERI Box */}
          <div className="px-3.5 py-2 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7] min-w-[90px]">
            <div className="text-[9.5px] font-extrabold text-[#8C827A] uppercase font-mono">ERI</div>
            <div className="text-[16px] font-black text-[#2B211C] font-mono leading-none mt-1">
              {eriScore} <span className="text-[10px] font-normal text-[#8C827A]">/100</span>
            </div>
          </div>

          {/* Status Box */}
          <div className={`px-3 py-2 rounded-2xl border flex flex-col justify-center min-w-[95px] ${getRiskBadgeStyles(riskLevel)}`}>
            <div className="text-[9px] font-extrabold uppercase font-mono opacity-80">STATUS</div>
            <div className="text-[12px] font-black uppercase font-mono mt-0.5 tracking-tight">
              {riskLevel}
            </div>
          </div>

        </div>

        {/* Right Column: Actions */}
        <div className="flex items-center space-x-2 shrink-0 border-t lg:border-t-0 border-[#FAF3EA] pt-3 lg:pt-0">
          
          {/* View Report */}
          <button
            onClick={() => onView(report)}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-[#F3E6D7] hover:border-[#F47A24] text-xs font-extrabold text-[#2B211C] shadow-2xs hover:bg-[#FFF0E5]/50 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#F47A24]" />
            <span>View</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-[#F47A24] hover:bg-[#E06815] text-xs font-extrabold text-white shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Delete Action */}
          <button
            onClick={handleDelete}
            title="Delete Report"
            className="p-2.5 rounded-2xl text-[#8C827A] hover:text-[#DC2626] hover:bg-[#FEE2E2]/60 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
