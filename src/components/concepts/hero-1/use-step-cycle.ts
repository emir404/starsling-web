"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useInView } from "motion/react";

/** Minimum gap between two advances, however they are triggered. */
const ADVANCE_COOLDOWN_MS = 700;
/** Wheel events closer together than this belong to the same (inertial) gesture. */
const WHEEL_GESTURE_GAP_MS = 200;
/** Downward travel required before a touch counts as a skip. */
const TOUCH_SWIPE_THRESHOLD_PX = 24;

/**
 * Cycles `index` through [0, count): auto-advances every `intervalMs`, or
 * immediately when the user scrolls down while `ref` is in view. Loops forever.
 *
 * No scroll jacking by construction — every listener is passive and never calls
 * preventDefault; a downward gesture merely *also* advances the step. The timer
 * pauses while the element is out of view or the tab is hidden, and any advance
 * (auto or manual) resets it.
 */
export function useStepCycle({
  count,
  intervalMs = 2000,
  ref,
}: {
  count: number;
  intervalMs?: number;
  ref: RefObject<HTMLElement | null>;
}) {
  const [index, setIndex] = useState(0);
  const inView = useInView(ref, { amount: 0.35 });
  const [pageVisible, setPageVisible] = useState(true);
  const lastAdvanceAt = useRef(0);
  const lastWheelAt = useRef(0);
  const touch = useRef<{ startY: number; consumed: boolean } | null>(null);

  const advance = useCallback(() => {
    lastAdvanceAt.current = performance.now();
    setIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Auto-advance. Keyed on `index` so any advance restarts the wait.
  useEffect(() => {
    if (!inView || !pageVisible || count < 2) return;
    const id = window.setTimeout(advance, intervalMs);
    return () => window.clearTimeout(id);
  }, [index, inView, pageVisible, count, intervalMs, advance]);

  // Scroll-down skips ahead — one flick, one step.
  useEffect(() => {
    if (!inView || count < 2) return;

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0) return;
      const now = performance.now();
      const sameGesture = now - lastWheelAt.current < WHEEL_GESTURE_GAP_MS;
      lastWheelAt.current = now;
      if (sameGesture || now - lastAdvanceAt.current < ADVANCE_COOLDOWN_MS) return;
      advance();
    };
    const onTouchStart = (event: TouchEvent) => {
      touch.current = { startY: event.touches[0].clientY, consumed: false };
    };
    const onTouchMove = (event: TouchEvent) => {
      const t = touch.current;
      if (!t || t.consumed) return;
      if (t.startY - event.touches[0].clientY < TOUCH_SWIPE_THRESHOLD_PX) return;
      if (performance.now() - lastAdvanceAt.current < ADVANCE_COOLDOWN_MS) return;
      t.consumed = true;
      advance();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [inView, count, advance]);

  return { index, inView };
}
