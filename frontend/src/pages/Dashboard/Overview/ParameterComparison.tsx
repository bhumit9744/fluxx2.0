import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const ParameterComparison: React.FC = () => {
  const { dashboardData, setActiveSection } = useEnvironmentStore();
  const comparisons = dashboardData?.comparison || [];

  return (
    <div className="rounded-[20px] bg-white border border-[#F3E6D7] shadow-[0_12px_35px_rgba(70,40,20,0.06)] p-5 flex flex-col justify-between h-[340px] select-none">
      
      {/* Header Bar */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#F9F3EA]">
          <div>
            <h2 className="text-[16px] font-extrabold text-[#2B211C] tracking-tight">
              Parameter Comparison
            </h2>
            <p className="text-[12px] text-[#8C827A] font-medium mt-0.5">
              Live levels versus regulatory safety thresholds
            </p>
          </div>
          <div className="flex items-center space-x-6 text-[11px] font-bold text-[#8C827A] pr-1">
            <span>Current</span>
            <span>Recommended</span>
          </div>
        </div>

        {/* Progress List */}
        <div className="mt-3.5 space-y-3">
          {comparisons.map((item) => (
            <div key={item.key} className="space-y-1">
              {/* Labels & Values */}
              <div className="flex items-center justify-between text-[12.5px] font-bold">
                <span className="text-[#2B211C]">{item.name}</span>
                <div className="flex items-center space-x-6">
                  <span className="text-[#2B211C]">
                    {item.current} <span className="text-[11px] text-[#8C827A] font-normal">{item.unit}</span>
                  </span>
                  <span className="text-[11.5px] text-[#8C827A] font-medium min-w-[70px] text-right">
                    {item.recommended}
                  </span>
                </div>
              </div>

              {/* Rounded Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#FAF3EA] overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(Math.max(item.percentage, 5), 100)}%`,
                    backgroundColor: item.color 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action Button */}
      <button
        onClick={() => setActiveSection('environment')}
        className="w-full mt-2 py-2 px-4 rounded-2xl bg-[#FFF9F2] hover:bg-[#FFF0E5] border border-[#F3E6D7] text-[#F47A24] font-bold text-[12.5px] tracking-tight flex items-center justify-center space-x-2 transition-all group cursor-pointer"
      >
        <span>View All Parameters</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  );
};
