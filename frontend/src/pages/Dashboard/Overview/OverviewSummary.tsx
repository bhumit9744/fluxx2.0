import React from 'react';
import { 
  Database, 
  Radio, 
  Clock, 
  Map, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const OverviewSummary: React.FC = () => {
  const { dashboardData, setActiveSection } = useEnvironmentStore();
  const ds = dashboardData?.dataset;

  const summaryItems = [
    {
      label: 'Total Observations',
      value: ds?.observations ?? 300,
      icon: Database,
      iconBg: '#FFF0E5',
      iconColor: '#F47A24'
    },
    {
      label: 'Active Sensors',
      value: ds?.activeSensors ?? 50,
      icon: Radio,
      iconBg: '#EBF4FF',
      iconColor: '#3B82F6'
    },
    {
      label: 'Time Range',
      value: ds?.timeRange ?? '24 Hours',
      icon: Clock,
      iconBg: '#F3E8FF',
      iconColor: '#8B5CF6'
    },
    {
      label: 'Area Covered',
      value: `${ds?.areaKm2 ?? 31.2} km²`,
      icon: Map,
      iconBg: '#FFF9E6',
      iconColor: '#D97706'
    },
    {
      label: 'Data Quality',
      value: `${ds?.quality ?? 98.7}%`,
      icon: CheckCircle2,
      iconBg: '#EAF7EE',
      iconColor: '#3FA66B',
      highlightValue: true
    }
  ];

  return (
    <div className="rounded-[20px] bg-white border border-[#F3E6D7] shadow-[0_12px_35px_rgba(70,40,20,0.06)] p-5 flex flex-col justify-between h-[380px] sm:h-[420px] select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-[16px] font-extrabold text-[#2B211C] tracking-tight">
          Overview Summary
        </h2>
        <p className="text-[12px] text-[#8C827A] mt-0.5 font-medium">
          Aggregated spatial and temporal sensor metrics
        </p>

        {/* Metric List */}
        <div className="mt-4 space-y-3">
          {summaryItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.label}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF3EA]/60 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: item.iconBg, color: item.iconColor }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] font-semibold text-[#6B5E55]">
                    {item.label}
                  </span>
                </div>

                <span className={`text-[14px] font-extrabold tracking-tight ${
                  item.highlightValue ? 'text-[#3FA66B]' : 'text-[#2B211C]'
                }`}>
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Action Button */}
      <button
        onClick={() => setActiveSection('environment')}
        className="w-full mt-3 py-2.5 px-4 rounded-2xl bg-[#FFF9F2] hover:bg-[#FFF0E5] border border-[#F3E6D7] text-[#F47A24] font-bold text-[13px] tracking-tight flex items-center justify-center space-x-2 transition-all group cursor-pointer"
      >
        <span>View Data Details</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  );
};
