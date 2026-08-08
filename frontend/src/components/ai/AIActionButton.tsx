import React from 'react';
import { MapPin, BarChart3, FileText, ArrowRight } from 'lucide-react';
import { ChatAction } from '../../services/ai';

interface AIActionButtonProps {
  action: ChatAction;
  onClick: (action: ChatAction) => void;
}

export const AIActionButton: React.FC<AIActionButtonProps> = ({ action, onClick }) => {
  const getIcon = () => {
    switch (action.type) {
      case 'SHOW_ON_MAP':
        return <MapPin className="w-3.5 h-3.5 text-[#0EA89A]" />;
      case 'VIEW_COMPARISON':
        return <BarChart3 className="w-3.5 h-3.5 text-blue-500" />;
      case 'VIEW_REPORT':
      case 'GENERATE_REPORT':
        return <FileText className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5 text-[#0EA89A]" />;
    }
  };

  return (
    <button
      onClick={() => onClick(action)}
      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#0EA89A] hover:text-[#0EA89A] shadow-xs transition-all cursor-pointer group"
    >
      {getIcon()}
      <span>{action.label}</span>
      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#0EA89A] group-hover:translate-x-0.5 transition-all" />
    </button>
  );
};
