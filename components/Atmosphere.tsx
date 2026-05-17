"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Site-wide atmosphere:
 *  - a warm candlelight that softly trails the cursor (pointer devices only)
 *  - a thin ember line at the top that tracks scroll progress
 * Both are purely decorative, GPU-cheap, and disabled for reduced-motion.
 */
export function Atmosphere() {
  const lightRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setPointer(fine && !reduced);

    let raf = 0;
    let tx = 0.5;
    let ty = 0;
    let cx = 0.5;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth;
      ty = e.clientY / window.innerHeight;
    };

    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      const el = lightRef.current;
      if (el) {
        el.style.setProperty("--cx", `${cx * 100}%`);
        el.style.setProperty("--cy", `${cy * 100}%`);
      }
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const h =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(p, 1)})`;
      }
    };

    if (fine && !reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(tick);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {pointer && (
        <div ref={lightRef} className="candlelight" aria-hidden />
      )}
      <div
        ref={barRef}
        className="scroll-ember w-full"
        style={{ transform: "scaleX(0)" }}
        aria-hidden
      />
    </>
  );
}
