"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { PRODUCT_CHAPTERS, ProductChapter } from "@/lib/productTimeline";

export interface ScrollTimelineState {
  progress: number;
  currentChapter: ProductChapter;
  currentChapterIndex: number;
  scrollToChapter: (chapterId: number) => void;
  scrollToProgress: (targetP: number) => void;
  isScrollingUp: boolean;
}

export function useScrollTimeline(): ScrollTimelineState {
  const [progress, setProgress] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  const lastScrollY = useRef(0);
  const targetProgress = useRef(0);
  const currentProgressRef = useRef(0);
  const animFrameId = useRef<number | null>(null);

  const updateChapter = useCallback((p: number) => {
    let matchedIdx = 0;
    for (let i = 0; i < PRODUCT_CHAPTERS.length; i++) {
      const [start, end] = PRODUCT_CHAPTERS[i].scrollRange;
      if (p >= start && (p < end || i === PRODUCT_CHAPTERS.length - 1)) {
        matchedIdx = i;
        break;
      }
    }
    setCurrentChapterIndex(matchedIdx);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const currentY = window.scrollY;
      setIsScrollingUp(currentY < lastScrollY.current && currentY > 50);
      lastScrollY.current = currentY;

      const p = Math.max(0, Math.min(1, currentY / scrollHeight));
      targetProgress.current = p;
    };

    const loop = () => {
      // Smooth lerp towards target scroll
      const diff = targetProgress.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.15;
        setProgress(currentProgressRef.current);
        updateChapter(currentProgressRef.current);
      }
      animFrameId.current = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [updateChapter]);

  const scrollToProgress = useCallback((targetP: number) => {
    const clamped = Math.max(0, Math.min(1, targetP));
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: clamped * scrollHeight,
      behavior: "smooth",
    });
  }, []);

  const scrollToChapter = useCallback(
    (chapterId: number) => {
      const targetChapter = PRODUCT_CHAPTERS.find((c) => c.id === chapterId);
      if (targetChapter) {
        scrollToProgress(targetChapter.scrollRange[0]);
      }
    },
    [scrollToProgress]
  );

  return {
    progress,
    currentChapter: PRODUCT_CHAPTERS[currentChapterIndex] || PRODUCT_CHAPTERS[0],
    currentChapterIndex,
    scrollToChapter,
    scrollToProgress,
    isScrollingUp,
  };
}
