"use client";

/**
 * A living candle flame rendered in SVG with a soft halo and a few embers
 * drifting upward. CSS-only animation — cheap, and it stills for
 * prefers-reduced-motion via the global media query.
 */
export function Flame({ className = "" }: { className?: string }) {
  const embers = [
    { left: "46%", delay: "0s", dur: "5.5s", drift: "-14px" },
    { left: "52%", delay: "1.4s", dur: "6.8s", drift: "18px" },
    { left: "49%", delay: "2.9s", dur: "6s", drift: "-8px" },
    { left: "54%", delay: "4.1s", dur: "7.2s", drift: "10px" },
  ];

  return (
    <div
      className={`pointer-events-none relative select-none ${className}`}
      aria-hidden
    >
      {/* Halo */}
      <div
        className="absolute left-1/2 top-1/2 h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(240,180,85,0.42), rgba(217,122,50,0.14) 48%, transparent 72%)",
          filter: "blur(10px)",
          animation: "flame-glow 3.6s ease-in-out infinite",
        }}
      />

      {/* Embers */}
      {embers.map((e, i) => (
        <span
          key={i}
          className="absolute bottom-[38%] h-1 w-1 rounded-full"
          style={{
            left: e.left,
            background: "var(--color-amber)",
            boxShadow: "0 0 6px var(--color-amber)",
            // @ts-expect-error custom prop consumed by the keyframe
            "--drift": e.drift,
            animation: `ember-rise ${e.dur} ${e.delay} linear infinite`,
          }}
        />
      ))}

      {/* Flame */}
      <svg
        viewBox="0 0 64 110"
        className="relative h-full w-full"
        style={{
          transformOrigin: "50% 100%",
          animation: "flame-flicker 2.6s ease-in-out infinite",
          filter: "drop-shadow(0 0 14px rgba(240,180,85,0.55))",
        }}
      >
        <defs>
          <linearGradient id="fl-outer" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#d97a32" />
            <stop offset="55%" stopColor="#f0b455" />
            <stop offset="100%" stopColor="#e7cf94" />
          </linearGradient>
          <linearGradient id="fl-inner" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#fff6e0" />
            <stop offset="100%" stopColor="#f0b455" />
          </linearGradient>
        </defs>
        <path
          d="M32 6 C 18 30 8 44 8 64 C 8 86 22 100 32 100 C 42 100 56 86 56 64 C 56 46 46 32 32 6 Z"
          fill="url(#fl-outer)"
        />
        <path
          d="M32 40 C 25 54 22 60 22 71 C 22 84 27 92 32 92 C 37 92 42 84 42 71 C 42 60 39 54 32 40 Z"
          fill="url(#fl-inner)"
        />
      </svg>
    </div>
  );
}
