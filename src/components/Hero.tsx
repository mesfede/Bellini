import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import img10 from '../assets/images/bellini_imagen (10).jpeg';
import img11 from '../assets/images/bellini_imagen (11).jpeg';
import img12 from '../assets/images/bellini_imagen (12).jpeg';

interface HeroProps {
  activeSubSlide?: number;
}

const slideData = [
  {
    img: img10,
    subtitle: "Estudio de Odontología",
    title: "Odontología de precisión estética.",
  },
  {
    img: img11,
    subtitle: "Estudio de Odontología",
    title: "La sutileza de una armonía invisible.",
  },
  {
    img: img12,
    subtitle: "Estudio de Odontología",
    title: "Su bienestar comienza con la calma.",
  }
];

export function Hero({ activeSubSlide = 0 }: HeroProps) {
  const currentSlide = activeSubSlide;
  const [prevSlide, setPrevSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right (next), -1 for left (prev)

  useEffect(() => {
    if (activeSubSlide > prevSlide) {
      setDirection(1);
    } else if (activeSubSlide < prevSlide) {
      setDirection(-1);
    }
    setPrevSlide(activeSubSlide);
  }, [activeSubSlide, prevSlide]);

  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Image Slider with Real Scroll-Slide Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0a0a]">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.img 
            key={currentSlide}
            src={slideData[currentSlide]?.img || img10} 
            alt="Bellini luxury dentistry" 
            className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 select-none"
            custom={direction}
            initial={{ 
              x: direction > 0 ? "100%" : "-100%", 
              opacity: 0 
            }}
            animate={{ 
              x: "0%", 
              opacity: 0.25,
              transition: { 
                x: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 1.2, ease: "easeInOut" }
              }
            }}
            exit={{ 
              x: direction > 0 ? "-100%" : "100%",
              opacity: 0,
              transition: { 
                x: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 1.2, ease: "easeInOut" }
              }
            }}
          />
        </AnimatePresence>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-90 z-10 pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col justify-end pb-32 md:pb-36">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between w-full gap-8 border-l border-[var(--color-bellini-primary)]/10 pl-6 md:pl-8">
          
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start text-left"
            >
              {/* Very snug line spacing and removed 'Autor' */}
              <span className="block text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#4C4F54] mb-0.5 select-none">
                {slideData[currentSlide]?.subtitle}
              </span>

              <h1 className="font-serif text-sm sm:text-lg md:text-2xl lg:text-3xl tracking-[0.05em] text-[var(--color-bellini-primary)]/35 leading-none font-light whitespace-nowrap select-none">
                {slideData[currentSlide]?.title}
              </h1>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="hidden md:flex flex-col text-[8px] uppercase tracking-[0.3em] text-[#4C4F54] text-right font-light items-end pl-12"
          >
            <span className="font-semibold text-[var(--color-bellini-primary)]/50 mb-1">Bellini Studio</span>
            <span className="text-[#4C4F54]/80">Espacios de Salud & Arquitectura</span>
          </motion.div>
        </div>
      </div>

      {/* Sutil microindicador de scroll hacia la derecha */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none opacity-50 select-none">
        <span className="text-[7.5px] uppercase tracking-[0.3em] text-[#4C4F54] mb-2 font-light">
          Scroll para recorrer
        </span>
        <div className="flex items-center gap-2">
          {/* Mouse silhouette style horizontal track */}
          <div className="w-10 h-5 rounded-full border border-[#4C4F54]/30 relative flex items-center px-1">
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-[var(--color-bellini-primary)]"
              animate={{ x: [0, 22, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          <motion.span 
            className="text-[10px] text-[#4C4F54] leading-none"
            animate={{ x: [0, 3, 0] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            →
          </motion.span>
        </div>
      </div>
    </section>
  );
}
