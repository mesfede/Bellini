import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { default as img3 } from '../assets/images/bellini_imagen (3).jpeg';
import { default as img4 } from '../assets/images/bellini_imagen (4).jpeg';
import { default as img5 } from '../assets/images/bellini_imagen (5).jpeg';
import { default as img6 } from '../assets/images/bellini_imagen (6).jpeg';
import { default as img7 } from '../assets/images/bellini_imagen (7).jpeg';
import { default as img8 } from '../assets/images/bellini_imagen (8).jpeg';
import { default as img9 } from '../assets/images/bellini_imagen (9).jpeg';
import { default as img10 } from '../assets/images/bellini_imagen (10).jpeg';
import { default as img11 } from '../assets/images/bellini_imagen (11).jpeg';
import { default as img12 } from '../assets/images/bellini_imagen (12).jpeg';
import { default as img13 } from '../assets/images/bellini_imagen (13).jpeg';
import { default as img14 } from '../assets/images/bellini_imagen (14).jpeg';
import { default as img15 } from '../assets/images/bellini_imagen (15).jpeg';

export function Experience() {
  const images = [img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const spaceNames = [
    "Consultorio de Precisión",
    "Área de Espera Privada",
    "Gabinete de Estética Avanzada",
    "Equipamiento de Vanguardia",
    "Detalle de Arquitectura",
    "Luz Natural y Calma",
    "Diseño de Interiores Minimalista",
    "Box de Odontología Digital",
    "Materiales de Alta Selección",
    "Sillón de Confort Ergonómico",
    "Tecnología Láser Integrada",
    "Sanidad y Bioseguridad",
    "Detalle de Fina Terminación"
  ];

  return (
    <section className="w-screen h-screen shrink-0 snap-start relative px-6 md:px-16 lg:px-24 py-16 md:py-24 flex flex-col justify-center bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        <div className="order-2 lg:order-1 flex flex-col justify-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[9px] uppercase tracking-[0.3em] text-[var(--color-bellini-primary)]/50 mb-4 md:mb-6 block"
          >
            La Experiencia Bellini
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-serif text-2xl md:text-3xl lg:text-5xl text-[var(--color-bellini-primary)] leading-tight mb-6 md:mb-8"
          >
            Nuestros Espacios.<br/>
            <span className="italic text-[#f4f3ef]/60 font-light">Diseño de autor.</span>
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-4 text-[13px] text-[#f4f3ef]/70 font-light leading-relaxed max-w-md mb-8"
          >
            <p>Cada entorno en nuestro estudio ha sido curado por arquitectos de renombre para fomentar una sensación inmediata de bienestar, privacidad y absoluta tranquilidad médica.</p>
            <p>Explore nuestras salas haciendo clic en el visor interactivo de la derecha para conocer el verdadero espacio de consulta donde creamos su nueva sonrisa.</p>
          </motion.div>

          {/* Interactive controls located under the description for easier desktop pairing */}
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <button 
                onClick={prevImage}
                className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs"
                title="Anterior"
              >
                ←
              </button>
              <button 
                onClick={nextImage}
                className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs"
                title="Siguiente"
              >
                →
              </button>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#f4f3ef] block font-medium">
                {spaceNames[currentIndex] || "Instalaciones Premium"}
              </span>
              <span className="text-[9px] text-[#8e8e8e] tracking-wider uppercase block">
                Fotografía Real — {currentIndex + 1} de {images.length}
              </span>
            </div>
          </div>
        </div>

        {/* Visualizer Container */}
        <div className="order-1 lg:order-2 flex flex-col gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="aspect-[4/3] md:aspect-[4/5] max-h-[40vh] lg:max-h-[55vh] relative rounded-2xl overflow-hidden mx-auto border border-white/5 w-full bg-[#111]"
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentIndex}
                src={images[currentIndex]} 
                alt={spaceNames[currentIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-110 hover:opacity-100 hover:scale-105 transition-all duration-1000"
              />
            </AnimatePresence>
            <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none"></div>
            
            {/* Quick click area overlays */}
            <div 
              className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize" 
              onClick={prevImage}
              title="Imagen anterior"
            />
            <div 
              className="absolute inset-y-0 right-0 w-1/2 cursor-e-resize" 
              onClick={nextImage}
              title="Siguiente imagen"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
