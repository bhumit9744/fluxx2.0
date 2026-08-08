import React, { useState } from 'react';
import { GlassShell } from '../../layouts/GlassShell';
import { Sidebar } from '../../components/navigation/Sidebar';
import { TopBar } from '../../components/navigation/TopBar';
import { OverviewView } from './Overview/OverviewView';
import { AnalysePage } from './Analyse/AnalysePage';
import { IntelligenceView } from './Intelligence/IntelligenceView';
import { ReportsView } from './Reports/ReportsView';
import { FlightOpsView } from './FlightOps/FlightOpsView';
import { AICopilot } from '../../components/ai/AICopilot';
import { Modal } from '../../components/ui/Modal';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const DashboardLayout: React.FC = () => {
  const { 
    activeSection, 
    mapEngine, 
    setMapEngine, 
    googleMapsApiKey, 
    setGoogleMapsApiKey,
  } = useEnvironmentStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(googleMapsApiKey);

  const handleSaveSettings = () => {
    setGoogleMapsApiKey(apiKeyInput);
    setIsSettingsOpen(false);
  };

  return (
    <GlassShell>
      
      {/* 1. Left Compact Sidebar Navigation */}
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* 2. Main Analytics & Intelligence Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-transparent">
        
        {/* Top Header Rail */}
        <TopBar />

        {/* Dynamic Section Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {activeSection === 'overview' && <OverviewView />}
          {activeSection === 'environment' && <AnalysePage />}
          {activeSection === 'flight-ops' && <FlightOpsView />}
          {activeSection === 'intelligence' && <IntelligenceView />}
          {activeSection === 'reports' && <ReportsView />}
        </main>
      </div>

      {/* 3. AI Copilot Drawer (Docked Right) */}
      <AICopilot />

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Platform & Map Configuration"
      >
        <div className="space-y-4 font-sans text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Google Maps Platform API Key
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:outline-hidden focus:border-[#0EA89A]"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Required for Google 3D Photorealistic Earth and spatial tile streaming.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              3D Map Rendering Engine
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMapEngine('google_3d')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  mapEngine === 'google_3d'
                    ? 'border-[#0EA89A] bg-[#DDF6F2] font-bold text-[#0EA89A]'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                Google 3D Earth
              </button>
              <button
                type="button"
                onClick={() => setMapEngine('maplibre_twin')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  mapEngine === 'maplibre_twin'
                    ? 'border-[#0EA89A] bg-[#DDF6F2] font-bold text-[#0EA89A]'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                MapLibre Twin
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            className="w-full mt-4 bg-[#0EA89A] text-white py-2 rounded-xl font-bold font-mono tracking-widest hover:bg-[#0B857A] transition-colors"
          >
            SAVE CONFIGURATION
          </button>
        </div>
      </Modal>
    </GlassShell>
  );
};
