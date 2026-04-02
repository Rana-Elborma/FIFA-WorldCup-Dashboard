/* ── Football Stadium Logo SVG ──
   Bird's-eye view of a football stadium.
   Used as the CrowdSafe AI brand mark across all pages.
*/

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export function BrandLogo({ size = 36, className = '' }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer stadium ring */}
      <ellipse cx="30" cy="30" rx="27" ry="19" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />

      {/* Stand tier 1 */}
      <ellipse cx="30" cy="30" rx="22" ry="14.5" fill="#1a1540" stroke="#6d28d9" strokeWidth="1.5" />

      {/* Stand tier 2 */}
      <ellipse cx="30" cy="30" rx="16.5" ry="10.5" fill="#16103a" stroke="#5b21b6" strokeWidth="1" />

      {/* Grass field */}
      <ellipse cx="30" cy="30" rx="11.5" ry="7" fill="#14532d" stroke="#16a34a" strokeWidth="1" />

      {/* Field — lighter stripe */}
      <ellipse cx="30" cy="30" rx="9" ry="5.2" fill="#166534" />

      {/* Center line */}
      <line x1="30" y1="23" x2="30" y2="37" stroke="#22c55e" strokeWidth="0.9" opacity="0.85" />

      {/* Center circle */}
      <circle cx="30" cy="30" r="3.2" stroke="#22c55e" strokeWidth="0.9" fill="none" opacity="0.85" />

      {/* Football (center spot) */}
      <circle cx="30" cy="30" r="1.8" fill="#ffffff" opacity="0.95" />
      <circle cx="30" cy="30" r="1.1" fill="#1e1b4b" opacity="0.7" />

      {/* Left penalty area */}
      <rect x="18.5" y="26.5" width="5.5" height="7" rx="0.5"
        fill="none" stroke="#22c55e" strokeWidth="0.7" opacity="0.6" />

      {/* Right penalty area */}
      <rect x="36" y="26.5" width="5.5" height="7" rx="0.5"
        fill="none" stroke="#22c55e" strokeWidth="0.7" opacity="0.6" />

      {/* Stadium light towers */}
      <circle cx="7" cy="13"  r="2"   fill="#fbbf24" opacity="0.9" />
      <circle cx="53" cy="13" r="2"   fill="#fbbf24" opacity="0.9" />
      <circle cx="7" cy="47"  r="2"   fill="#fbbf24" opacity="0.9" />
      <circle cx="53" cy="47" r="2"   fill="#fbbf24" opacity="0.9" />

      {/* Light glow halos */}
      <circle cx="7"  cy="13" r="4" fill="#fbbf24" opacity="0.15" />
      <circle cx="53" cy="13" r="4" fill="#fbbf24" opacity="0.15" />
      <circle cx="7"  cy="47" r="4" fill="#fbbf24" opacity="0.15" />
      <circle cx="53" cy="47" r="4" fill="#fbbf24" opacity="0.15" />

      {/* Purple accent glow on outer ring (top arc) */}
      <path
        d="M 3 30 A 27 19 0 0 1 57 30"
        stroke="#a78bfa"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}
