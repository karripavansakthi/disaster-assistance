import React from 'react';
import { Link } from 'react-router-dom';

export default function DisasterLogo({ inverted = false, size = 'default', to = '/', showTagline = true }) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const badgeSize = isSmall ? 'w-8 h-8' : isLarge ? 'w-11 h-11' : 'w-9 h-9';
  const titleSize = isSmall ? 'text-base' : isLarge ? 'text-xl' : 'text-lg';
  const taglineSize = isSmall ? 'text-[9px]' : 'text-[10px]';

  const content = (
    <div className="flex items-center gap-2.5 select-none">
      {/* Red Shield with White Cross */}
      <div className={`relative ${badgeSize} shrink-0 rounded-xl bg-gradient-to-b from-[#F52D3D] to-[#d81f2f] flex items-center justify-center shadow-sm shadow-red-500/30 ring-1 ring-white/20`}>
        {/* Shield outline / heart cross symbol */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isSmall ? 'w-4 h-4' : isLarge ? 'w-6 h-6' : 'w-5 h-5'}
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#F52D3D" />
          <line x1="12" y1="8" x2="12" y2="14" stroke="white" strokeWidth="2.5" />
          <line x1="9" y1="11" x2="15" y2="11" stroke="white" strokeWidth="2.5" />
        </svg>
      </div>

      <div>
        <div className={`font-black ${titleSize} tracking-tight leading-none ${inverted ? 'text-white' : 'text-[#062B4C]'}`}>
          Disaster<span className={inverted ? 'text-white' : 'text-[#1268E8]'}>Assist</span>
        </div>
        {showTagline && (
          <div className={`${taglineSize} font-medium tracking-wide mt-1 leading-none ${inverted ? 'text-slate-300' : 'text-[#667085]'}`}>
            Help Today <span className="text-red-500">•</span> Hope Tomorrow
          </div>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block transition-transform hover:scale-[1.01]">
        {content}
      </Link>
    );
  }

  return content;
}
