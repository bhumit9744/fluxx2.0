"use client";

import { PRODUCT_CHAPTERS } from "@/lib/productTimeline";

interface TimelineScrubberProps {
  progress: number;
  onNavigate: (progress: number) => void;
  isDark?: boolean;
}

export function TimelineScrubber({
  progress,
  onNavigate,
  isDark = true,
}: TimelineScrubberProps) {
  // Current active chapter
  let activeChapter = PRODUCT_CHAPTERS[0];
  for (let i = 0; i < PRODUCT_CHAPTERS.length; i++) {
    const ch = PRODUCT_CHAPTERS[i];
    if (progress >= ch.scrollRange[0] && progress <= ch.scrollRange[1]) {
      activeChapter = ch;
      break;
    }
  }

  // Key navigation waypoints for Vision Pro pill
  const keyNavItems = [
    { label: "Hero", rangeStart: 0.0 },
    { label: "Frame", rangeStart: 0.07 },
    { label: "Motors", rangeStart: 0.14 },
    { label: "Battery", rangeStart: 0.21 },
    { label: "Camera", rangeStart: 0.42 },
    { label: "LiDAR", rangeStart: 0.49 },
    { label: "Tank", rangeStart: 0.56 },
    { label: "Exploded", rangeStart: 0.84 },
    { label: "Mission", rangeStart: 0.70 },
    { label: "CTA", rangeStart: 0.93 },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <div className="bg-[#070b14]/85 dark:bg-[#070b14]/90 backdrop-blur-2xl px-4 py-2 rounded-full border border-white/15 shadow-2xl flex items-center gap-1.5 font-mono text-[10px]">
        {keyNavItems.map((item, idx) => {
          const isActive =
            progress >= item.rangeStart &&
            (idx === keyNavItems.length - 1 || progress < keyNavItems[idx + 1].rangeStart);

          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.rangeStart)}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                isActive
                  ? "bg-white text-slate-950 font-bold shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? "bg-[#00E7B3]" : "bg-slate-500"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
