import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneHero } from './scenes/SceneHero';
import { SceneData } from './scenes/SceneData';
import { SceneSensors } from './scenes/SceneSensors';
import { SceneHeatmap } from './scenes/SceneHeatmap';
import { SceneAI } from './scenes/SceneAI';
import { SceneTransition } from './scenes/SceneTransition';
import './home.css';

gsap.registerPlugin(ScrollTrigger);

export const HomeExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.scene-panel');
      
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          pin: true,
          pinSpacing: false,
          snap: 1
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#080B10] text-[#F1F5F9] select-none">
      
      <div className="scene-panel">
        <SceneHero />
      </div>

      <div className="scene-panel">
        <SceneData />
      </div>

      <div className="scene-panel">
        <SceneSensors />
      </div>

      <div className="scene-panel">
        <SceneHeatmap />
      </div>

      <div className="scene-panel">
        <SceneAI />
      </div>

      <div className="scene-panel">
        <SceneTransition />
      </div>

    </div>
  );
};
