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
        return <MapPin className="w-3.5 h-3.5 text-[#F47A24]" />;
      case 'VIEW_COMPARISON':
        return <BarChart3 className="w-3.5 h-3.5 text-[#F47A24]" />;
      case 'VIEW_REPORT':
      case 'GENERATE_REPORT':
        return <FileText className="w-3.5 h-3.5 text-[#F47A24]" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5 text-[#F47A24]" />;
    }
  };

  return (
    <button
      onClick={() => onClick(action)}
      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#2B211C] bg-[#FFF0E5] hover:bg-[#FFE5D3] border border-[#F47A24]/30 hover:border-[#F47A24] shadow-2xs transition-all cursor-pointer group"
    >
      {getIcon()}
      <span>{action.label}</span>
      <ArrowRight className="w-3 h-3 text-[#F47A24] group-hover:translate-x-0.5 transition-all" />
    </button>
  );
};
