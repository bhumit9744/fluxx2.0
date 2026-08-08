import React from 'react';
import { DashboardHeader } from './DashboardHeader';
import { KPIGrid } from './KPIGrid';
import { EnvironmentMapCard } from './EnvironmentMapCard';
import { OverviewSummary } from './OverviewSummary';
import { PM25TrendChart } from './PM25TrendChart';
import { ParameterComparison } from './ParameterComparison';
import { UploadDatasetModal } from '../../../components/modals/UploadDatasetModal';

export const OverviewView: React.FC = () => {
  return (
    <div className="space-y-5 pb-12 font-sans max-w-[1600px] mx-auto animate-fade-in">
      
      {/* 1. Header with Title & Action Controls */}
      <DashboardHeader />

      {/* 2. 6 KPI Cards Grid */}
      <KPIGrid />

      {/* 3. Middle Row: Environmental Heatmap (2/3) + Overview Summary (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2">
          <EnvironmentMapCard />
        </div>
        <div className="lg:col-span-1">
          <OverviewSummary />
        </div>
      </div>

      {/* 4. Bottom Row: PM2.5 Trend Chart (2/3) + Parameter Comparison (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2">
          <PM25TrendChart />
        </div>
        <div className="lg:col-span-1">
          <ParameterComparison />
        </div>
      </div>

      {/* Upload CSV Ingestion Modal */}
      <UploadDatasetModal />

    </div>
  );
};
