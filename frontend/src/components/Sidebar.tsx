import React from 'react';
import { 
  Globe, 
  Activity, 
  Sparkles, 
  FileText, 
  Settings, 
  ShieldCheck,
  Layers
} from 'lucide-react';
import { useEnvironmentStore, PrimarySection } from '../stores/environmentStore';

export const Sidebar: React.FC<{ onOpenSettings: () => void }> = ({ onOpenSettings }) => {
  const { activeSection, setActiveSection, presentationMode } = useEnvironmentStore();

  if (presentationMode) {
    return null; // Clean presentation mode hides sidebar to maximize map & data
  }

  const navItems: Array<{ id: PrimarySection; label: string; icon: any; desc: string }> = [
    { id: 'overview', label: 'Overview', icon: Globe, desc: 'Digital Twin & Key Metrics' },
    { id: 'environment', label: 'Environment', icon: Layers, desc: '3D Earth & IDW Heatmap' },
    { id: 'intelligence', label: 'Intelligence', icon: Sparkles, desc: 'AI Risk & Anomaly Reasoning' },
    { id: 'reports', label: 'Reports', icon: FileText, desc: 'Autonomous AI PDF Audits' }
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-[#080B10]/95 backdrop-blur-2xl flex flex-col justify-between p-4 z-20 select-none shrink-0">
      
      {/* Top Section */}
      <div className="space-y-6">
        
        {/* Brand Title */}
        <div className="flex items-center space-x-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0EA89A] to-[#3DD6C6] flex items-center justify-center shadow-lg shadow-[#0EA89A]/30">
            <Globe className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="font-display font-black text-base text-white tracking-wider">FLUXX</div>
            <div className="text-[10px] font-mono text-[#3DD6C6]">Environmental Intelligence</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 font-mono text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl transition-all duration-200 text-left cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0EA89A]/25 to-[#3DD6C6]/10 text-white font-bold border border-[#0EA89A]/40 shadow-lg shadow-[#0EA89A]/15'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-[#3DD6C6] text-slate-950' : 'bg-white/5 text-slate-400 group-hover:text-white'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom Section */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        
        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Platform Settings</span>
        </button>

        {/* Status Badge */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-mono text-slate-400 space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span>SURVEILLANCE</span>
            <span className="text-[#3DD6C6] font-bold">● ACTIVE</span>
          </div>
          <div>Location: Kharghar (50 Pts)</div>
        </div>

      </div>

    </aside>
  );
};
