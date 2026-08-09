"use client";

import React, { useEffect } from "react";
import { useFluxxStore } from "@/store/useFluxxStore";
import { useBackendSync } from "@/hooks/useBackendSync";
import { FloatingNav } from "@/components/Navigation/FloatingNav";

import { OverviewView } from "@/components/views/OverviewView";
import { EnvironmentView } from "@/components/views/EnvironmentView";
import { MissionsView } from "@/components/views/MissionsView";
import { IntelligenceView } from "@/components/views/IntelligenceView";
import { ReportsView } from "@/components/views/ReportsView";

export default function DashboardPage() {
  // Initialize WebSocket connection to the backend
  useBackendSync("ws://localhost:8000/ws");

  const { currentView } = useFluxxStore();

  // Remove the dark class since we are pivoting to light glassmorphism
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const renderView = () => {
    switch (currentView) {
      case "overview":
        return <OverviewView />;
      case "environment":
        return <EnvironmentView />;
      case "missions":
        return <MissionsView />;
      case "intelligence":
        return <IntelligenceView />;
      case "reports":
        return <ReportsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-background font-sans">
      
      {/* Abstract Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-fluxx-teal/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fluxx-warning/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Floating Navigation Shell */}
      <FloatingNav />

      {/* Main View Area */}
      <div className="relative w-full h-full">
        {renderView()}
      </div>

    </main>
  );
}
