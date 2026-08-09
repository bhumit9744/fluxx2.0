"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface AudioEngineState {
  isMuted: boolean;
  isUnlocked: boolean;
  toggleMute: () => void;
  playBeep: (freq?: number, type?: OscillatorType) => void;
  updateEngineSpeed: (speed: number) => void;
  updateSprayState: (isSpraying: boolean) => void;
  updateWindSpeed: (speed: number) => void;
}

export function useAudioEngine(): AudioEngineState {
  const [isMuted, setIsMuted] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Drone motor oscillators & filters
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const motorGainRef = useRef<GainNode | null>(null);
  const motorFilterRef = useRef<BiquadFilterNode | null>(null);

  // Wind noise generator
  const windGainRef = useRef<GainNode | null>(null);
  const windFilterRef = useRef<BiquadFilterNode | null>(null);

  // Spray atomizer noise
  const sprayGainRef = useRef<GainNode | null>(null);
  const sprayFilterRef = useRef<BiquadFilterNode | null>(null);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 1. Drone Motors (Dual Harmonic Sub-Oscillators)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const motorFilter = ctx.createBiquadFilter();
      const motorGain = ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(45, ctx.currentTime); // Base idle rumble

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(90, ctx.currentTime);

      motorFilter.type = "lowpass";
      motorFilter.frequency.setValueAtTime(220, ctx.currentTime);
      motorFilter.Q.setValueAtTime(3, ctx.currentTime);

      motorGain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc1.connect(motorFilter);
      osc2.connect(motorFilter);
      motorFilter.connect(motorGain);
      motorGain.connect(masterGain);

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      motorFilterRef.current = motorFilter;
      motorGainRef.current = motorGain;

      // 2. Wind & Aerodynamic Noise (Buffer-based White Noise)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoiseSource = ctx.createBufferSource();
      whiteNoiseSource.buffer = noiseBuffer;
      whiteNoiseSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = "bandpass";
      windFilter.frequency.setValueAtTime(400, ctx.currentTime);
      windFilter.Q.setValueAtTime(1.5, ctx.currentTime);

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.015, ctx.currentTime);

      whiteNoiseSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);

      whiteNoiseSource.start();
      windFilterRef.current = windFilter;
      windGainRef.current = windGain;

      // 3. Spray Atomizer Noise (High-pass filtered fine hiss)
      const sprayNoiseSource = ctx.createBufferSource();
      sprayNoiseSource.buffer = noiseBuffer;
      sprayNoiseSource.loop = true;

      const sprayFilter = ctx.createBiquadFilter();
      sprayFilter.type = "highpass";
      sprayFilter.frequency.setValueAtTime(2500, ctx.currentTime);

      const sprayGain = ctx.createGain();
      sprayGain.gain.setValueAtTime(0.0, ctx.currentTime);

      sprayNoiseSource.connect(sprayFilter);
      sprayFilter.connect(sprayGain);
      sprayGain.connect(masterGain);

      sprayNoiseSource.start();
      sprayFilterRef.current = sprayFilter;
      sprayGainRef.current = sprayGain;

      setIsUnlocked(true);
    } catch {
      // Ignore audio context autoplay restrictions gracefully
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioCtxRef.current) {
      initAudio();
    }
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

    setIsMuted((prev) => {
      const next = !prev;
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setTargetAtTime(next ? 0.0 : 0.65, audioCtxRef.current.currentTime, 0.1);
      }
      return next;
    });
  }, [initAudio]);

  const updateEngineSpeed = useCallback((speed: number) => {
    if (!audioCtxRef.current || isMuted) return;
    const ctx = audioCtxRef.current;
    const clamped = Math.max(0, Math.min(1, speed));
    const baseFreq = 40 + clamped * 120; // 40Hz to 160Hz motor whine
    osc1Ref.current?.frequency.setTargetAtTime(baseFreq, ctx.currentTime, 0.05);
    osc2Ref.current?.frequency.setTargetAtTime(baseFreq * 2, ctx.currentTime, 0.05);
    motorFilterRef.current?.frequency.setTargetAtTime(200 + clamped * 800, ctx.currentTime, 0.05);
    motorGainRef.current?.gain.setTargetAtTime(0.02 + clamped * 0.08, ctx.currentTime, 0.05);
  }, [isMuted]);

  const updateSprayState = useCallback((isSpraying: boolean) => {
    if (!audioCtxRef.current || isMuted) return;
    const ctx = audioCtxRef.current;
    sprayGainRef.current?.gain.setTargetAtTime(isSpraying ? 0.08 : 0.0, ctx.currentTime, 0.1);
  }, [isMuted]);

  const updateWindSpeed = useCallback((speed: number) => {
    if (!audioCtxRef.current || isMuted) return;
    const ctx = audioCtxRef.current;
    const clamped = Math.max(0, Math.min(1, speed / 120));
    windFilterRef.current?.frequency.setTargetAtTime(300 + clamped * 1200, ctx.currentTime, 0.1);
    windGainRef.current?.gain.setTargetAtTime(0.01 + clamped * 0.05, ctx.currentTime, 0.1);
  }, [isMuted]);

  const playBeep = useCallback((freq = 880, type: OscillatorType = "sine") => {
    if (!audioCtxRef.current || isMuted) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(masterGainRef.current || ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }, [isMuted]);

  useEffect(() => {
    const handleFirstTouch = () => {
      if (!audioCtxRef.current) {
        initAudio();
      }
      window.removeEventListener("pointerdown", handleFirstTouch);
      window.removeEventListener("keydown", handleFirstTouch);
    };

    window.addEventListener("pointerdown", handleFirstTouch, { once: true });
    window.addEventListener("keydown", handleFirstTouch, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstTouch);
      window.removeEventListener("keydown", handleFirstTouch);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [initAudio]);

  return {
    isMuted,
    isUnlocked,
    toggleMute,
    playBeep,
    updateEngineSpeed,
    updateSprayState,
    updateWindSpeed,
  };
}
