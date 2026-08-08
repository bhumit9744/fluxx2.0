import React, { useState } from 'react';
import { CSVUploadCard } from '../../../components/reports/CSVUploadCard';
import { ReportGenerator } from '../../../components/reports/ReportGenerator';
import { ReportPreview } from '../../../components/reports/ReportPreview';
import { ReportLibrary } from '../../../components/reports/ReportLibrary';

export const ReportsView: React.FC = () => {
  const [hasGenerated, setHasGenerated] = useState<boolean>(true);

  return (
    <div className="h-[calc(100vh-100px)] font-sans pb-4">
      
      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 h-full">
        
        {/* Left: Controls & Library */}
        <div className="space-y-5 h-full flex flex-col overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex items-center justify-between panel p-5 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-[var(--fluxx-text)] tracking-tight">REPORTS</h2>
              <div className="text-[11px] font-mono font-medium text-[var(--fluxx-muted)] mt-1 uppercase tracking-widest flex items-center space-x-2">
                <span>Document Generation</span>
              </div>
            </div>
          </div>

          <div>
            <CSVUploadCard onSuccess={() => setHasGenerated(true)} />
          </div>

          <div>
            <ReportGenerator onGenerated={() => setHasGenerated(true)} />
          </div>

          <div className="flex-1">
            <ReportLibrary />
          </div>
        </div>

        {/* Right: A4 Preview */}
        <div className="xl:col-span-2 relative bg-[rgba(255,255,255,0.2)] border border-[var(--fluxx-border)] rounded-2xl shadow-inner overflow-hidden flex flex-col items-center pt-8 overflow-y-auto h-full">
          {hasGenerated ? (
            <div className="w-[210mm] max-w-[95%] shrink-0 shadow-lg bg-white mb-8 rounded-sm overflow-hidden">
              <ReportPreview />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[var(--fluxx-muted)]">
              Upload a dataset to preview the report.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
