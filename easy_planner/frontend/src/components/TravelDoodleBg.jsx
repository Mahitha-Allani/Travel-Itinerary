import React from 'react'

export default function TravelDoodleBg({ opacity = 'opacity-[0.06]' }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Soft, Sophisticated Ambient Mesh Glows (harmonious warm-pearl palette) */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-100/40 via-burgundy-50/30 to-transparent blur-3xl" />
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-amber-50/40 via-rose-50/30 to-transparent blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-stone-100/50 to-transparent blur-3xl" />

      {/* Central Soft Radial Halo to guarantee 100% crisp text readability */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 25%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 55%, transparent 100%)'
        }}
      />

      {/* Subtle, Classy Vintage Travel Stamps on outer edges */}
      <div className="absolute top-10 left-8 hidden xl:flex flex-col items-center justify-center w-20 h-20 rounded-full border border-dashed border-burgundy-200/70 bg-white/60 backdrop-blur-md shadow-xs rotate-[-10deg] text-center p-1.5 opacity-70">
        <span className="text-sm">✈️</span>
        <span className="text-[9px] font-black uppercase tracking-wider text-burgundy-900">VOYARA</span>
        <span className="text-[7px] text-gray-500 font-medium tracking-tighter">EST. 2026</span>
      </div>

      <div className="absolute top-24 right-10 hidden xl:flex flex-col items-center justify-center px-3.5 py-2 rounded-xl border border-amber-200/70 bg-white/60 backdrop-blur-md shadow-xs rotate-[6deg] text-center opacity-70">
        <span className="text-[10px] font-bold text-amber-900 tracking-wider">★ WANDERLUST ★</span>
        <span className="text-[8px] text-amber-700">EXPLORE INDIA</span>
      </div>

      <div className="absolute bottom-20 left-10 hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 backdrop-blur-md border border-slate-200/70 shadow-xs rotate-[4deg] opacity-70">
        <span className="text-base">🧭</span>
        <div className="text-left">
          <p className="text-[9px] font-bold text-slate-800">EXPEDITION</p>
          <p className="text-[7px] text-slate-500">28° N, 77° E</p>
        </div>
      </div>

      {/* Ultra-subtle, high-class Repeating SVG Travel Doodles Pattern */}
      <svg className={`absolute inset-0 w-full h-full ${opacity}`} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="travel-doodles-pattern-v3" width="220" height="220" patternUnits="userSpaceOnUse">
            {/* Airplane with curved loop trail */}
            <path d="M28 40 L45 36 L52 18 L58 20 L54 38 L70 39 L76 32 L80 33 L78 42 L54 45 L48 61 L42 60 L45 46 Z" fill="currentColor" />
            <path d="M12 45 Q 20 42 28 40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
            <path d="M12 45 C -4 52 4 66 16 60 C 24 56 20 46 14 46" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" fill="none" />

            {/* Hot Air Balloon */}
            <ellipse cx="185" cy="48" rx="13" ry="17" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M175 40 Q 185 42 195 40" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <path d="M173 52 Q 185 55 197 52" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <line x1="178" y1="65" x2="180" y2="70" stroke="currentColor" strokeWidth="0.8" />
            <line x1="192" y1="65" x2="190" y2="70" stroke="currentColor" strokeWidth="0.8" />
            <rect x="180" y="70" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />

            {/* Compass */}
            <circle cx="110" cy="38" r="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="110" cy="38" r="12" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" fill="none" />
            <polygon points="110,25 114,36 110,34 106,36" fill="currentColor" />
            <polygon points="110,51 114,40 110,42 106,40" fill="currentColor" opacity="0.4" />
            <circle cx="110" cy="38" r="1.5" fill="currentColor" />

            {/* Suitcase */}
            <rect x="30" y="125" width="32" height="23" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M40 125 V120 Q40 118 43 118 H49 Q52 118 52 120 V125" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <line x1="30" y1="136" x2="62" y2="136" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="35" cy="149" r="1.5" fill="currentColor" />
            <circle cx="57" cy="149" r="1.5" fill="currentColor" />

            {/* Passport Stamp (Round) */}
            <circle cx="165" cy="130" r="19" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
            <circle cx="165" cy="130" r="15" stroke="currentColor" strokeWidth="0.6" fill="none" />
            <text x="165" y="126" fontSize="4.5" fontWeight="bold" textAnchor="middle" fill="currentColor">PASSPORT</text>
            <text x="165" y="133" fontSize="5.5" fontWeight="900" textAnchor="middle" fill="currentColor">★ VOYARA ★</text>
            <text x="165" y="139" fontSize="4" textAnchor="middle" fill="currentColor">APPROVED</text>

            {/* Camera */}
            <rect x="95" y="100" width="30" height="21" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M103 100 L105 96 H115 L117 100 Z" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="110" cy="110" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="119" cy="104" r="1" fill="currentColor" />

            {/* Globe */}
            <circle cx="42" cy="190" r="13" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <ellipse cx="42" cy="190" rx="6" ry="13" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <line x1="29" y1="190" x2="55" y2="190" stroke="currentColor" strokeWidth="0.8" />

            {/* Location Pin */}
            <path d="M175 195 C170 195 166 199 166 204 C166 212 175 220 175 220 C175 220 184 212 184 204 C184 199 180 195 175 195 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="175" cy="202" r="2.5" fill="currentColor" />

            {/* Mountain outlines */}
            <polygon points="95,215 111,192 127,215" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <polyline points="106,200 111,204 116,200" stroke="currentColor" strokeWidth="1" fill="none" />

            {/* Palm tree doodle */}
            <path d="M210 155 Q 206 142 208 128" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M208 128 Q 198 124 197 130" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M208 128 Q 210 120 218 123" stroke="currentColor" strokeWidth="1.2" fill="none" />

            {/* Clouds & Star sparkles */}
            <path d="M135 70 L137 66 L139 70 L143 72 L139 74 L137 78 L135 74 L131 72 Z" fill="currentColor" opacity="0.5" />
            <path d="M70 80 Q 74 75 80 77 Q 85 74 89 77 Q 92 80 91 83 H 69 Q 67 82 70 80 Z" stroke="currentColor" strokeWidth="0.8" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#travel-doodles-pattern-v3)" className="text-slate-800" />
      </svg>
    </div>
  )
}
