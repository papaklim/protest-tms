import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, TerminalSquare, MousePointerClick } from 'lucide-react';

export const ProtestLogo = () => (
  <svg width="124" height="24" viewBox="0 0 124 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <defs>
      {/* Мягкий неоновый фильтр свечения */}
      <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.2" result="blur" />
        <feComponentTransfer in="blur" result="softGlow">
          <feFuncA type="linear" slope="0.6" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="softGlow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Левый треугольник, красная обводка, смотрит влево (ближе к тексту) */}
    <polygon points="12,4 4,12 12,20" fill="none" stroke="#f85149" strokeWidth="1.2" strokeLinejoin="round" filter="url(#logo-glow)" />
    
    {/* Текст ProTEST в один блок для автоматического кернинга с paint-order */}
    <text x="16" y="12" dominantBaseline="central" fontFamily="Outfit, Inter, sans-serif" fontWeight="900" fontSize="20px" letterSpacing="0.8px" paintOrder="stroke fill" strokeLinejoin="round" filter="url(#logo-glow)">
      <tspan fill="var(--panel-bg, #161b22)" stroke="#f85149" strokeWidth="2.4">Pro</tspan>
      <tspan dx="3px" fill="var(--panel-bg, #161b22)" stroke="#3fb950" strokeWidth="2.4">TEST</tspan>
    </text>
    
    {/* Правый треугольник, зеленая обводка, смотрит вправо (дальше от текста) */}
    <polygon points="112,4 120,12 112,20" fill="none" stroke="#3fb950" strokeWidth="1.2" strokeLinejoin="round" filter="url(#logo-glow)" />
  </svg>
);

export const AutoTestIcon = ({ size = 12, className = "" }) => (
  <TerminalSquare size={size} className={className} />
);

export const ManualTestIcon = ({ size = 12, className = "" }) => (
  <MousePointerClick size={size} className={`text-[#8b949e] ${className}`} />
);

export const CustomSelect = ({ value, onChange, options, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative w-[90px]" ref={dropdownRef} style={{ ...style }}>
      <div 
        className="flex justify-between items-center px-3 py-1.5 rounded-lg border border-[#30363d] bg-[#21262d] text-xs text-[#e6edf3] cursor-pointer hover:border-[#8b949e] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">{selectedOption.label}</span>
        <ChevronDown size={12} className="text-[#8b949e]" />
      </div>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-full rounded-lg border border-[#30363d] bg-[#161b22] shadow-xl overflow-hidden" style={{ zIndex: 9999 }}>
          {options.map(opt => (
            <div 
              key={opt.value}
              className={`px-3 py-2 text-[13px] cursor-pointer transition-colors ${
                opt.value === value 
                  ? 'text-[#58a6ff] bg-[#58a6ff]/10 hover:bg-[#58a6ff]/15 font-semibold' 
                  : 'text-[#c9d1d9] hover:bg-[#30363d]'
              }`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
