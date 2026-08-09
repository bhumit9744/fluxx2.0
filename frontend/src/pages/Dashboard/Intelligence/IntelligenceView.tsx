import React from 'react';
import { IntelligenceHeader } from './IntelligenceHeader';
import { IntelligenceHeroMetrics } from './IntelligenceHeroMetrics';
import { MainEnvironmentalGraph } from './MainEnvironmentalGraph';
import { TimeIntelligenceBar } from './TimeIntelligenceBar';
import { AIBriefingCard } from './AIBriefingCard';
import { ContributingFactorsCard } from './ContributingFactorsCard';
import { EnvironmentalEventsTimeline } from './EnvironmentalEventsTimeline';
import { AnomaliesDetection } from './AnomaliesDetection';
import { ParameterAnalysisTable } from './ParameterAnalysisTable';
import { SpatialIntelligenceCard } from './SpatialIntelligenceCard';
import { ForecastProjectionCard } from './ForecastProjectionCard';
import { TimeLapseControlBar } from './TimeLapseControlBar';

export const IntelligenceView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 font-sans max-w-7xl mx-auto">
      
      {/* 1. Header & Parameter inspection */}
      <IntelligenceHeader />

      {/* 2. Top Metric Row (4 Hero KPI boxes) */}
      <IntelligenceHeroMetrics />

      {/* 3. Hero Component: Main Environmental Graph */}
      <MainEnvironmentalGraph />

      {/* 4. Time Intelligence Timeline (Directly below graph) */}
      <TimeIntelligenceBar />

      {/* 5. Briefing Row: AI Insight Card + Contributing Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIBriefingCard />
        <ContributingFactorsCard />
      </div>

      {/* 6. Chronological Environmental Events Timeline */}
      <EnvironmentalEventsTimeline />

      {/* 7. Anomalies Detection + Parameter Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnomaliesDetection />
        <ParameterAnalysisTable />
      </div>

      {/* 8. Spatial Intelligence & Modelled Projection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpatialIntelligenceCard />
        <ForecastProjectionCard />
      </div>

      {/* 9. Time-Lapse Continuous Replay Control Bar */}
      <TimeLapseControlBar />

    </div>
  );
};
