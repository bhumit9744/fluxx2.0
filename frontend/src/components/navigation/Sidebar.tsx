import React from 'react';
import { 
  Home, 
  LayoutGrid, 
  FileText, 
  MapPin, 
  Sparkles, 
  Plane, 
  ChevronDown, 
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { useEnvironmentStore, PrimarySection } from '../../stores/environmentStore';

interface SidebarProps {
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { activeSection, setActiveSection, dashboardData, openUploadModal } = useEnvironmentStore();

  const navItems = [
    { id: 'overview' as PrimarySection, label: 'Dashboard', icon: Home },
    { id: 'environment' as PrimarySection, label: 'Analyse', icon: LayoutGrid },
    { id: 'reports' as PrimarySection, label: 'Reports', icon: FileText },
    { id: 'live-map' as PrimarySection, label: 'Live Map', icon: MapPin },
    { id: 'intelligence' as PrimarySection, label: 'Intelligence', icon: Sparkles },
    { id: 'flight-ops' as PrimarySection, label: 'Flight Control', icon: Plane }
  ];

  return (
    <aside className="w-[240px] bg-white border-r border-[#F3E6D7] flex flex-col justify-between p-5 z-20 select-none shrink-0 font-sans h-full shadow-[2px_0_20px_rgba(70,40,20,0.02)]">
      
      {/* Top Section: Logo & Menu */}
      <div className="space-y-7">
        
        {/* Logo */}
        <div className="flex items-center space-x-3 px-1 pt-1 cursor-pointer" onClick={() => setActiveSection('overview')}>
          {/* Custom Warm Leaf / Organic Wave Icon */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F47A24] to-[#FF9F5A] flex items-center justify-center shadow-[0_4px_12px_rgba(244,122,36,0.3)]">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L15 8L22 9L17 14L18 21L12 17.5L6 21L7 14L2 9L9 8L12 2Z" fill="currentColor" fillOpacity="0.3"/>
              <path d="M12 3C7.5 3 4 6.5 4 11C4 16 9 20 12 21C15 20 20 16 20 11C20 6.5 16.5 3 12 3Z"/>
              <path d="M12 7V16M8 11L12 7L16 11"/>
            </svg>
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight text-[#2B211C] leading-tight">FLUXX</div>
            <div className="text-[10px] font-medium text-[#8C827A] tracking-tight">Environmental Intelligence</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id || (item.id === 'environment' && activeSection === 'analyse');

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl transition-all duration-200 text-left cursor-pointer group font-medium text-[13.5px] ${
                  isActive
                    ? 'bg-[#FFF0E5] text-[#F47A24] font-semibold shadow-[0_2px_8px_rgba(244,122,36,0.08)]'
                    : 'text-[#6B5E55] hover:bg-[#FAF3EA] hover:text-[#2B211C]'
                }`}
              >
                <Icon className={`w-[19px] h-[19px] transition-colors ${
                  isActive ? 'text-[#F47A24]' : 'text-[#8C827A] group-hover:text-[#2B211C]'
                }`} />
                <span className="flex-1 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom Section: Dataset Info & User Profile */}
      <div className="space-y-4 pt-4 border-t border-[#F3E6D7]/80">
        
        {/* Dataset Status Card */}
        <div 
          onClick={openUploadModal}
          className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7] hover:border-[#F47A24]/40 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-[#8C827A] tracking-wider uppercase">DATASET</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3FA66B] animate-pulse"></span>
              <span className="text-[10.5px] font-semibold text-[#3FA66B]">Connected</span>
            </div>
          </div>
          <div className="font-bold text-[13px] text-[#2B211C] tracking-tight group-hover:text-[#F47A24] transition-colors">
            {dashboardData?.dataset?.name || 'Kharghar Survey'}
          </div>
          <div className="text-[11px] text-[#8C827A] mt-0.5 font-medium">
            {dashboardData?.dataset?.observations || 300} Observations
          </div>
          <div className="text-[10px] text-[#A0958C] mt-0.5">
            {dashboardData?.dataset?.date || '24 May 2025'} · {dashboardData?.dataset?.timeRange || '24H'}
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#F47A24] text-white flex items-center justify-center font-bold text-sm shadow-[0_2px_8px_rgba(244,122,36,0.3)]">
              B
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#2B211C] leading-snug">Bhumit Gupta</div>
              <div className="text-[11px] text-[#8C827A] font-medium leading-none">Project Lead</div>
            </div>
          </div>
          <button className="text-[#8C827A] hover:text-[#2B211C] p-1 rounded-lg hover:bg-black/5 transition-colors">
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

      </div>

    </aside>
  );
};
