import React from 'react';

interface StatusBadgeProps {
  status: 'ACTIVE' | 'PAUSED' | 'CRITICAL' | 'MODERATE' | 'GOOD' | 'AIRBORNE' | string;
  variant?: 'teal' | 'amber' | 'red' | 'emerald' | 'slate';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'teal',
  pulse = false
}) => {
  const styles: Record<string, string> = {
    teal: 'bg-[#DDF6F2] text-[#0EA89A] border-[#0EA89A]/30',
    amber: 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30',
    red: 'bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]/30',
    emerald: 'bg-[#D1FAE5] text-[#059669] border-[#059669]/30',
    slate: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${styles[variant] || styles.teal}`}>
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
      <span>{status}</span>
    </span>
  );
};
