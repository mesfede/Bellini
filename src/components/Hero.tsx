import { motion } from 'motion/react';
import { default as archHero } from '../assets/images/bellini_hero_arch_1779193529939.png';

export function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.25 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={archHero} 
          alt="Bellini luxury architecture" 
          className="w-full h-full object-cover filter grayscale contrast-125"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-90"></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <span className="block text-[9px] md:text-[11px] uppercase tracking-[0.4em] text-[var(--color-bellini-bone)]/50 mb-8">
            Estudio Odontológico
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-[var(--color-bellini-bone)] leading-[0.9] text-balance max-w-4xl"
        >
          Odontología de precisión estética.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="mt-20 md:mt-32"
        >
          <div className="w-[1px] h-24 bg-[var(--color-bellini-bone)] opacity-20 mx-auto"></div>
        </motion.div>
      </div>
    </section>
  );
}
