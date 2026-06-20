const NeonCurves = () => {
  // Two flowing S-curves: one blue (top-left → bottom-right), one red (mirror)
  const paths = [
    {
      d: "M -50 180 C 200 80, 420 320, 650 200 S 1100 60, 1450 280",
      color: "hsl(210 100% 55%)",
      glow: "hsl(210 100% 60%)",
      delay: 0,
    },
    {
      d: "M 1450 120 C 1200 240, 980 60, 720 220 S 280 420, -50 260",
      color: "hsl(0 100% 60%)",
      glow: "hsl(0 100% 65%)",
      delay: 1.2,
    },
    {
      d: "M -50 420 C 250 360, 500 520, 780 440 S 1200 320, 1450 480",
      color: "hsl(210 100% 55%)",
      glow: "hsl(210 100% 60%)",
      delay: 2.4,
    },
    {
      d: "M 1450 560 C 1150 640, 880 480, 600 600 S 200 720, -50 660",
      color: "hsl(0 100% 60%)",
      glow: "hsl(0 100% 65%)",
      delay: 3.6,
    },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1400 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {paths.map((p, i) => (
          <filter key={i} id={`neon-glow-${i}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>

      {paths.map((p, i) => (
        <g key={i} style={{ filter: `url(#neon-glow-${i})` }}>
          {/* Soft wide glow */}
          <path
            d={p.d}
            fill="none"
            stroke={p.glow}
            strokeWidth="6"
            strokeOpacity="0.25"
            strokeLinecap="round"
            style={{
              strokeDasharray: 3000,
              strokeDashoffset: 3000,
              animation: `neon-draw 6s ${p.delay}s ease-in-out infinite`,
            }}
          />
          {/* Bright core line */}
          <path
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: 3000,
              strokeDashoffset: 3000,
              animation: `neon-draw 6s ${p.delay}s ease-in-out infinite`,
            }}
          />
          {/* Parallel dashed companion */}
          <path
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth="1"
            strokeOpacity="0.7"
            strokeDasharray="2 8"
            strokeLinecap="round"
            transform="translate(0 18)"
            style={{
              animation: `neon-dash 6s ${p.delay}s linear infinite`,
            }}
          />
        </g>
      ))}
    </svg>
  );
};

export default NeonCurves;
