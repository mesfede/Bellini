import { useState, useRef, MouseEvent, TouchEvent } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    let newPosition = ((clientX - left) / width) * 100;
    newPosition = Math.max(0, Math.min(newPosition, 100)); // Clamp between 0 and 100
    setPosition(newPosition);
  };

  const handleMouseMove = (e: MouseEvent) => {
    // Optional: Only move on drag, or move on hover. Hover is very elegant in desktop.
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    // Explicitly prevent swiping the parent carousel or page snap
    e.stopPropagation();
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.stopPropagation();
    isDragging.current = true;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.stopPropagation();
    isDragging.current = false;
  };

  return (
    <div 
      className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden cursor-ew-resize group select-none rounded-xl"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
        className="absolute inset-0 w-full h-full pointer-events-none border-r-2 border-[var(--color-bellini-primary)]"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img 
          src={beforeImage} 
          alt="Antes" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none filter brightness-95"
          draggable="false"
        />
        <div className="absolute top-4 left-4 text-[9px] uppercase tracking-widest text-[#0a0a0a] bg-[var(--color-bellini-primary)]/80 backdrop-blur-md px-2 py-1 rounded shadow-md select-none font-semibold">Antes</div>
      </div>

      <div className="absolute top-4 right-4 text-[9px] uppercase tracking-widest text-white bg-black/60 backdrop-blur-md px-2 py-1 rounded shadow-md select-none font-semibold">Después</div>

      {/* Slider handle */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-[var(--color-bellini-primary)] pointer-events-none z-10"
        style={{ left: `${position}%` }}
      >
        {/* Animated circle handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-[var(--color-bellini-primary)] bg-[#0a0a0a]/90 backdrop-blur-md flex items-center justify-center opacity-100 shadow-xl transition-transform duration-200 group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-bellini-primary)] animate-pulse">
            <path d="m15 18-6-6 6-6"/>
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
