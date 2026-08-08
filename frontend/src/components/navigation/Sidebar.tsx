import React from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Settings, 
  Activity,
  Plane,
  FileText
} from 'lucide-react';

import { useEnvironmentStore } from '../../stores/environmentStore';

interface SidebarProps {
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSettings }) => {
  const { activeSection, setActiveSection } = useEnvironmentStore();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'environment', label: 'Environment', icon: MapIcon },
    { id: 'flight-ops', label: 'Flight Ops', icon: Plane },
    { id: 'intelligence', label: 'Intelligence', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  const renderNavItem = (item: any) => {
    const Icon = item.icon;
    const isActive = activeSection === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActiveSection(item.id)}
        className={`w-full flex items-center space-x-3 px-3 py-2 transition-all duration-200 text-left cursor-pointer group rounded-lg ${
          isActive
            ? 'text-black font-semibold bg-[rgba(244,122,36,0.08)]'
            : 'text-[var(--fluxx-muted)] hover:text-black hover:bg-[rgba(244,122,36,0.04)]'
        }`}
      >
        <Icon className={`w-4 h-4 transition-colors duration-200 ${
          isActive ? 'text-[var(--fluxx-orange)]' : 'text-[var(--fluxx-muted)] group-hover:text-black'
        }`} />
        <span className="text-sm tracking-tight flex-1">{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="w-56 bg-transparent flex flex-col justify-between p-4 z-20 select-none shrink-0 font-sans transition-colors duration-300">
      
      {/* Top Section */}
      <div className="space-y-6">
        
        <div className="flex items-center space-x-3 px-2 pt-1 mb-8">
          <div className="font-display font-black text-2xl text-[var(--fluxx-orange)] tracking-widest leading-none">F</div>
          <div>
            <div className="font-display font-black text-sm text-[var(--fluxx-text)] tracking-widest">FLUXX</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-6">
          
          <div>
            <div className="text-[10px] font-mono font-bold text-[#7A858C] tracking-widest uppercase px-3 mb-2">COMMAND CENTER</div>
            {navItems.map(renderNavItem)}
          </div>
          
        </nav>

      </div>

      {/* Bottom Section */}
      <div className="space-y-2 pt-4">
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center space-x-3 px-3 py-2 text-[var(--fluxx-muted)] hover:text-black hover:bg-[rgba(244,122,36,0.04)] rounded-lg transition-colors text-left"
        >
          <Settings className="w-4 h-4 text-[var(--fluxx-muted)]" />
          <span className="text-sm font-medium tracking-tight">Settings</span>
        </button>
      </div>
    </aside>
  );
};
