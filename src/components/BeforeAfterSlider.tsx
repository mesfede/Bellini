import { motion } from 'motion/react';
import { useState, useRef, MouseEvent, TouchEvent } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    let newPosition = ((clientX - left) / width) * 100;
    newPosition = Math.max(0, Math.min(newPosition, 100)); // Clamp between 0 and 100
    setPosition(newPosition);
  };

  const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div 
      className="relative w-full aspect-[4/5] md:aspect-[21/9] overflow-hidden cursor-ew-resize group select-none"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After image (base) */}
      <img 
        src={afterImage} 
        alt="Después" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable="false"
      />

      {/* Before image (clipped) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none border-r border-[var(--color-bellini-primary)]/30"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img 
          src={beforeImage} 
          alt="Antes" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none filter grayscale sepia-[0.3]"
          draggable="false"
        />
        <div className="absolute top-6 left-6 text-[9px] uppercase tracking-widest text-white/50">Antes</div>
      </div>

      <div className="absolute top-6 right-6 text-[9px] uppercase tracking-widest text-white/50">Después</div>

      {/* Slider handle */}
      <div 
        className="absolute top-0 bottom-0 w-[1px] bg-[#f4f3ef]/30 pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#f4f3ef]/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-4 h-[1px] bg-[#f4f3ef]"></div>
        </div>
      </div>
    </div>
  );
}
