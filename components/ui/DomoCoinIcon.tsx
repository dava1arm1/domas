let _domoCoinCounter = 0;

export function DomoCoinIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  // Generate a stable per-render unique suffix so gradient IDs don't collide
  // when multiple instances appear on the same server-rendered page.
  const id = `dc${++_domoCoinCounter}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id={`${id}Base`} cx="40%" cy="35%" r="65%" fx="40%" fy="35%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
        <radialGradient id={`${id}Sheen`} cx="30%" cy="25%" r="50%" fx="30%" fy="25%">
          <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFBEB" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}Ring`} x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#92400E" stopOpacity="0.5" />
        </linearGradient>
        <filter id={`${id}Shadow`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#92400E" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Base coin circle */}
      <circle cx="20" cy="20" r="19" fill={`url(#${id}Base)`} filter={`url(#${id}Shadow)`} />

      {/* Inner ring */}
      <circle cx="20" cy="20" r="16" fill="none" stroke={`url(#${id}Ring)`} strokeWidth="1.2" />

      {/* "Д" monogram */}
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontSize="16"
        fontWeight="900"
        fontFamily="Georgia, serif"
        fill="#92400E"
        letterSpacing="-0.5"
      >
        Д
      </text>

      {/* Top-left sheen highlight */}
      <circle cx="20" cy="20" r="19" fill={`url(#${id}Sheen)`} />
    </svg>
  );
}
