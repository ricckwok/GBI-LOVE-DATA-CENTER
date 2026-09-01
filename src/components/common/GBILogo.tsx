import React from 'react';

interface GBILogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const GBI_LOGO_SVG_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="gbiFlameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#FFB300" />
      <stop offset="45%" stop-color="#FF6B00" />
      <stop offset="100%" stop-color="#E50000" />
    </linearGradient>
    <path id="topTextArc" d="M 68 250 A 182 182 0 0 1 432 250" fill="none" />
    <path id="bottomTextArc" d="M 432 250 A 182 182 0 0 1 68 250" fill="none" />
  </defs>

  <!-- Background Circle & Gold Border Ring -->
  <circle cx="250" cy="250" r="235" fill="#FFFFFF" stroke="#C59632" stroke-width="26" />

  <!-- Arced Top Text: GEREJA BETHEL -->
  <text fill="#02096A" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="44" letter-spacing="4">
    <textPath href="#topTextArc" startOffset="50%" text-anchor="middle">
      GEREJA BETHEL
    </textPath>
  </text>

  <!-- Arced Bottom Text: INDONESIA -->
  <text fill="#02096A" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="44" letter-spacing="6">
    <textPath href="#bottomTextArc" startOffset="50%" text-anchor="middle">
      INDONESIA
    </textPath>
  </text>

  <!-- Central Red Cross -->
  <!-- Horizontal Cross Beam -->
  <rect x="130" y="171" width="240" height="22" rx="2" fill="#E50000" />
  <!-- Vertical Cross Beam -->
  <rect x="239" y="105" width="22" height="295" rx="2" fill="#E50000" />

  <!-- Holy Spirit Flame (Left of Cross) -->
  <path
    d="M 152 298 C 150 250 188 238 215 210 C 235 188 215 158 145 144 C 170 178 190 205 185 228 C 178 255 155 270 152 298 Z"
    fill="url(#gbiFlameGradient)"
  />

  <!-- Golden Vessel / Boat Base -->
  <path
    d="M 129 298 C 129 388 371 388 371 298 Z"
    fill="#C59632"
  />

  <!-- Lower Cross Tip extending below Golden Vessel -->
  <rect x="239" y="384" width="22" height="16" rx="1" fill="#E50000" />
</svg>
`.trim())}`;

export const GBILogo: React.FC<GBILogoProps> = ({ className = 'w-10 h-10', size, showText = false }) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={style}>
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full drop-shadow-xs"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gbiFlameGradComponent" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFB300" />
            <stop offset="45%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#E50000" />
          </linearGradient>
          <path id="topTextArcComponent" d="M 68 250 A 182 182 0 0 1 432 250" fill="none" />
          <path id="bottomTextArcComponent" d="M 432 250 A 182 182 0 0 1 68 250" fill="none" />
        </defs>

        {/* Outer Gold Ring */}
        <circle cx="250" cy="250" r="235" fill="#FFFFFF" stroke="#C59632" strokeWidth="26" />

        {/* Top Text: GEREJA BETHEL */}
        <text fill="#02096A" fontFamily="'Arial Black', 'Impact', sans-serif" fontWeight="900" fontSize="44" letterSpacing="4">
          <textPath href="#topTextArcComponent" startOffset="50%" textAnchor="middle">
            GEREJA BETHEL
          </textPath>
        </text>

        {/* Bottom Text: INDONESIA */}
        <text fill="#02096A" fontFamily="'Arial Black', 'Impact', sans-serif" fontWeight="900" fontSize="44" letterSpacing="6">
          <textPath href="#bottomTextArcComponent" startOffset="50%" textAnchor="middle">
            INDONESIA
          </textPath>
        </text>

        {/* Central Red Cross */}
        <rect x="130" y="171" width="240" height="22" rx="2" fill="#E50000" />
        <rect x="239" y="105" width="22" height="295" rx="2" fill="#E50000" />

        {/* Holy Spirit Flame */}
        <path
          d="M 152 298 C 150 250 188 238 215 210 C 235 188 215 158 145 144 C 170 178 190 205 185 228 C 178 255 155 270 152 298 Z"
          fill="url(#gbiFlameGradComponent)"
        />

        {/* Golden Vessel / Boat Base */}
        <path
          d="M 129 298 C 129 388 371 388 371 298 Z"
          fill="#C59632"
        />

        {/* Lower Cross Tip */}
        <rect x="239" y="384" width="22" height="16" rx="1" fill="#E50000" />
      </svg>
    </div>
  );
};
