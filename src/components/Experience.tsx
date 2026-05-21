import { motion } from 'motion/react';
import { default as roomImg } from '../assets/images/bellini_interior_1779193559514.png';

export function Experience() {
  return (
    <section className="w-screen h-screen shrink-0 snap-start relative px-6 md:px-16 lg:px-24 py-16 md:py-24 flex flex-col justify-center bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        <div className="order-2 lg:order-1 flex flex-col justify-center">
           <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[9px] uppercase tracking-[0.3em] text-[#f4f3ef]/50 mb-4 md:mb-6 block"
            >
              La Experiencia Bellini
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-serif text-2xl md:text-3xl lg:text-5xl text-[var(--color-bellini-bone)] leading-tight mb-6 md:mb-8"
            >
              Silencio.<br/>Privacidad.<br/><span className="italic text-[#f4f3ef]/60 font-light">Cuidado exclusivo.</span>
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-4 text-[13px] text-[#f4f3ef]/70 font-light leading-relaxed max-w-md"
            >
              <p>Cada entorno en nuestro estudio ha sido curado para fomentar una sensación inmediata de bienestar y tranquilidad.</p>
              <p>Desde la iluminación atenuada en las áreas de espera hasta la sincronización de agendas para garantizar intimidad total, la experiencia de nuestros pacientes es tratada con el mismo rigor y perfeccionismo que nuestros procedimientos clínicos.</p>
            </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 lg:order-2 aspect-[4/5] max-h-[45vh] lg:max-h-[55vh] relative rounded-2xl overflow-hidden mx-auto border border-white/5"
        >
          <img 
            src={roomImg} 
            alt="Interior de la clínica" 
            className="w-full h-full object-cover filter grayscale opacity-75 hover:opacity-90 transition-opacity duration-1000"
          />
          <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none"></div>
        </motion.div>

      </div>
    </section>
  )
}
