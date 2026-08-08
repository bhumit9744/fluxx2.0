import React, { useEffect, useState } from 'react';
import { useEnvironmentStore, ReportItem } from '../../../stores/environmentStore';
import { ReportsHeader } from './ReportsHeader';
import { ReportsControls } from './ReportsControls';
import { ReportCard } from './ReportCard';
import { ReportsEmptyState } from './ReportsEmptyState';
import { ReportPreviewModal } from './ReportPreviewModal';
import { Loader2 } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    reportsList,
    isReportsLoading,
    fetchReports,
    fetchReportById,
    deleteReport,
    selectedReportDetail,
    setSelectedReportDetail,
    isReportPreviewOpen,
    setReportPreviewOpen
  } = useEnvironmentStore();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleViewReport = async (report: ReportItem) => {
    setSelectedReportDetail(report);
    setReportPreviewOpen(true);
    // Fetch full snapshot in background if needed
    fetchReportById(report.id);
  };

  const handleDeleteReport = async (id: string) => {
    await deleteReport(id);
  };

  return (
    <div className="space-y-4 font-sans pb-12 select-none animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <ReportsHeader />

      {/* 2. Search, Filter, Sort Controls */}
      <ReportsControls />

      {/* 3. Main Report List or Empty / Loading State */}
      {isReportsLoading && reportsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-3xl bg-white/70 backdrop-blur-xl border border-[#F3E6D7]">
          <Loader2 className="w-8 h-8 text-[#F47A24] animate-spin mb-3" />
          <div className="text-xs font-mono text-[#8C827A] font-bold uppercase tracking-wider">
            Loading Environmental Reports Archive...
          </div>
        </div>
      ) : reportsList.length === 0 ? (
        <ReportsEmptyState />
      ) : (
        <div className="space-y-3">
          {reportsList.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onView={handleViewReport}
              onDelete={handleDeleteReport}
            />
          ))}
        </div>
      )}

      {/* 4. A4 Report Dossier Preview Modal */}
      <ReportPreviewModal
        isOpen={isReportPreviewOpen}
        onClose={() => {
          setReportPreviewOpen(false);
          setSelectedReportDetail(null);
        }}
        report={selectedReportDetail}
      />

    </div>
  );
};
