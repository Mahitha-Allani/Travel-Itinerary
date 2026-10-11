import React from 'react'

export default function TravelDoodleBg({ opacity = 'opacity-20' }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Warm Ambient Radial Mesh Glows */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-200/50 via-amber-200/40 to-transparent blur-3xl" />
      <div className="absolute top-1/4 -right-40 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-burgundy-200/45 via-pink-200/35 to-transparent blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-200/40 via-rose-200/40 to-transparent blur-3xl" />

      {/* Decorative Vintage Travel Stickers / Badges on edges */}
      <div className="absolute top-12 left-8 hidden xl:flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-burgundy-300/80 bg-white/70 backdrop-blur-md shadow-md rotate-[-12deg] text-center p-2">
        <span className="text-base">✈️</span>
        <span className="text-[10px] font-black uppercase tracking-wider text-burgundy-800">VOYARA</span>
        <span className="text-[8px] text-gray-500 font-semibold tracking-tighter">AIRWAYS • 2026</span>
      </div>

      <div className="absolute top-28 right-12 hidden xl:flex flex-col items-center justify-center px-4 py-2.5 rounded-xl border border-amber-300/80 bg-amber-50/80 backdrop-blur-md shadow-md rotate-[8deg] text-center">
        <span className="text-xs font-bold text-amber-900 tracking-wider">★ WANDERLUST ★</span>
        <span className="text-[9px] text-amber-700">EXPLORE INDIA</span>
      </div>

      <div className="absolute bottom-24 left-12 hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/75 backdrop-blur-md border border-rose-200/80 shadow-md rotate-[6deg]">
        <span className="text-lg">🧭</span>
        <div className="text-left">
          <p className="text-[10px] font-bold text-gray-800">COMPASS NORTH</p>
          <p className="text-[8px] text-gray-500">28.6139° N, 77.2090° E</p>
        </div>
      </div>

      <div className="absolute bottom-20 right-14 hidden xl:flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 border-burgundy-300/80 bg-white/75 backdrop-blur-md shadow-md rotate-[-8deg] p-1.5">
        <span className="text-xl">📸</span>
        <span className="text-[8px] font-black uppercase text-burgundy-800 mt-0.5">MEMORIES</span>
      </div>

      {/* Repeating SVG Travel Doodles Pattern */}
      <svg className={`absolute inset-0 w-full h-full ${opacity}`} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="travel-doodles-pattern-v2" width="240" height="240" patternUnits="userSpaceOnUse">
            {/* Airplane with curved loop trail */}
            <path d="M30 42 L48 38 L56 20 L62 22 L58 40 L76 41 L82 34 L86 35 L84 44 L58 47 L52 64 L46 63 L49 48 Z" fill="currentColor" />
            <path d="M12 48 Q 20 44 30 42" stroke="currentColor" strokeWidth="1.75" strokeDasharray="3 3" fill="none" />
            <path d="M12 48 C -5 55 5 70 18 64 C 26 60 22 50 15 50" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 3" fill="none" />

            {/* Hot Air Balloon */}
            <ellipse cx="200" cy="50" rx="14" ry="18" stroke="currentColor" strokeWidth="1.75" fill="none" />
            <path d="M190 42 Q 200 44 210 42" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M188 54 Q 200 58 212 54" stroke="currentColor" strokeWidth="1" fill="none" />
            <line x1="192" y1="68" x2="194" y2="74" stroke="currentColor" strokeWidth="1" />
            <line x1="208" y1="68" x2="206" y2="74" stroke="currentColor" strokeWidth="1" />
            <rect x="194" y="74" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.25" fill="none" />

            {/* Compass */}
            <circle cx="115" cy="40" r="18" stroke="currentColor" strokeWidth="1.75" fill="none" />
            <circle cx="115" cy="40" r="14" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" fill="none" />
            <polygon points="115,26 119,38 115,36 111,38" fill="currentColor" />
            <polygon points="115,54 119,42 115,44 111,42" fill="currentColor" opacity="0.5" />
            <circle cx="115" cy="40" r="2" fill="currentColor" />
            <text x="115" y="24" fontSize="6" fontWeight="bold" textAnchor="middle" fill="currentColor">N</text>

            {/* Suitcase / Luggage */}
            <rect x="30" y="130" width="36" height="26" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M42 130 V124 Q42 121 46 121 H50 Q54 121 54 124 V130" stroke="currentColor" strokeWidth="1.75" fill="none" />
            <line x1="30" y1="143" x2="66" y2="143" stroke="currentColor" strokeWidth="1" />
            <line x1="42" y1="130" x2="42" y2="156" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="54" y1="130" x2="54" y2="156" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="36" cy="158" r="2" fill="currentColor" />
            <circle cx="60" cy="158" r="2" fill="currentColor" />

            {/* Passport Stamp (Round) */}
            <circle cx="170" cy="135" r="22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
            <circle cx="170" cy="135" r="18" stroke="currentColor" strokeWidth="0.75" fill="none" />
            <text x="170" y="130" fontSize="5" fontWeight="bold" textAnchor="middle" fill="currentColor" letterSpacing="1">ENTRY</text>
            <text x="170" y="138" fontSize="6" fontWeight="900" textAnchor="middle" fill="currentColor">★ INDIA ★</text>
            <text x="170" y="145" fontSize="4.5" textAnchor="middle" fill="currentColor">IMMIGRATION</text>

            {/* Camera */}
            <rect x="95" y="105" width="34" height="24" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M104 105 L107 100 H117 L120 105 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="112" cy="117" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="122" cy="110" r="1.5" fill="currentColor" />
            <line x1="91" y1="102" x2="95" y2="105" stroke="currentColor" strokeWidth="1" />
            <line x1="124" y1="105" x2="128" y2="102" stroke="currentColor" strokeWidth="1" />

            {/* Globe */}
            <circle cx="45" cy="200" r="15" stroke="currentColor" strokeWidth="1.75" fill="none" />
            <ellipse cx="45" cy="200" rx="7" ry="15" stroke="currentColor" strokeWidth="1" fill="none" />
            <line x1="30" y1="200" x2="60" y2="200" stroke="currentColor" strokeWidth="1" />
            <path d="M34 193 Q 45 197 56 193" stroke="currentColor" strokeWidth="0.75" fill="none" />
            <path d="M34 207 Q 45 203 56 207" stroke="currentColor" strokeWidth="0.75" fill="none" />

            {/* Location Pin */}
            <path d="M185 205 C179 205 175 209 175 215 C175 224 185 233 185 233 C185 233 195 224 195 215 C195 209 191 205 185 205 Z" stroke="currentColor" strokeWidth="1.75" fill="none" />
            <circle cx="185" cy="213" r="3" fill="currentColor" />

            {/* Mountain outlines with snow caps */}
            <polygon points="100,225 118,198 136,225" stroke="currentColor" strokeWidth="2" fill="none" />
            <polyline points="112,207 118,212 124,207" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <polygon points="116,225 130,206 144,225" stroke="currentColor" strokeWidth="1.5" fill="none" />

            {/* Palm tree doodle */}
            <path d="M225 160 Q 220 145 223 130" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M223 130 Q 212 125 210 132" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M223 130 Q 225 120 235 124" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M223 130 Q 215 135 214 142" stroke="currentColor" strokeWidth="1.5" fill="none" />

            {/* Star Sparkles & Clouds */}
            <path d="M145 75 L147 70 L149 75 L154 77 L149 79 L147 84 L145 79 L140 77 Z" fill="currentColor" opacity="0.6" />
            <path d="M75 85 Q 80 80 87 82 Q 93 78 98 82 Q 102 85 100 89 H 74 Q 71 87 75 85 Z" stroke="currentColor" strokeWidth="1" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#travel-doodles-pattern-v2)" className="text-burgundy-950" />
      </svg>
    </div>
  )
}
