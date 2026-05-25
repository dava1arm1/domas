interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export function TrashIcon({ size = 32, color = "#1D9E75", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6" />
    </svg>
  );
}

export function TruckIcon({ size = 32, color = "#1D9E75", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

export function LeafIcon({ size = 32, color = "#1D9E75", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22V12" />
      <path d="M12 12C12 7 17 2 22 2c0 5-5 10-10 10z" />
      <path d="M12 12C12 7 7 2 2 2c0 5 5 10 10 10z" />
    </svg>
  );
}

export function DropIcon({ size = 32, color = "#1D9E75", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L5.5 9.5a7 7 0 1013 0L12 2z" />
      <path d="M9 14.5a3 3 0 004 0" />
    </svg>
  );
}

export function SnowflakeIcon({ size = 32, color = "#1D9E75", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <g transform="translate(12,12)">
        <line x1="0" y1="-9" x2="0" y2="9" />
        <line x1="-2" y1="-7" x2="0" y2="-9" /><line x1="2" y1="-7" x2="0" y2="-9" />
        <line x1="-2" y1="7"  x2="0" y2="9"  /><line x1="2" y1="7"  x2="0" y2="9"  />
      </g>
      <g transform="translate(12,12) rotate(60)">
        <line x1="0" y1="-9" x2="0" y2="9" />
        <line x1="-2" y1="-7" x2="0" y2="-9" /><line x1="2" y1="-7" x2="0" y2="-9" />
        <line x1="-2" y1="7"  x2="0" y2="9"  /><line x1="2" y1="7"  x2="0" y2="9"  />
      </g>
      <g transform="translate(12,12) rotate(120)">
        <line x1="0" y1="-9" x2="0" y2="9" />
        <line x1="-2" y1="-7" x2="0" y2="-9" /><line x1="2" y1="-7" x2="0" y2="-9" />
        <line x1="-2" y1="7"  x2="0" y2="9"  /><line x1="2" y1="7"  x2="0" y2="9"  />
      </g>
    </svg>
  );
}

export function SparkleIcon({ size = 32, color = "#1D9E75", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l1.88 5.76a2 2 0 001.36 1.36L21 12l-5.76 1.88a2 2 0 00-1.36 1.36L12 21l-1.88-5.76a2 2 0 00-1.36-1.36L3 12l5.76-1.88a2 2 0 001.36-1.36L12 3z" />
      <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
    </svg>
  );
}

export function HomeIcon({ size = 32, color = "#1D9E75", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

export function ClipboardIcon({ size = 32, color = "#1D9E75", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

export function PhoneIcon({ size = 32, color = "#1D9E75", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 32, color = "#1D9E75", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
