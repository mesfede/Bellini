import { motion } from 'motion/react';
import { default as portrait } from '../assets/images/bellini_imagen (2).jpeg';
import { Watermark } from './Watermark';

export function About() {
  return (
    <section className="w-screen h-screen shrink-0 snap-start relative px-6 md:px-16 lg:px-24 py-16 md:py-24 flex flex-col justify-center bg-[#0a0a0a] overflow-hidden">
      <Watermark text="EXCELENCIA" />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-1 md:col-span-5 relative"
        >
          <div className="aspect-[3/4] max-h-[50vh] md:max-h-[60vh] overflow-hidden relative mx-auto rounded-lg border border-white/5">
            <img 
              src={portrait} 
              alt="Elegancia y precisión" 
              className="w-full h-full object-cover scale-[1.02] filter grayscale opacity-75 transition-all duration-1000 origin-center hover:opacity-90"
            />
          </div>
          <div className="absolute -bottom-6 left-6 w-36 h-36 border border-[var(--color-bellini-primary)] opacity-10 -z-10 rounded-full"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-1 md:col-span-7 flex flex-col justify-center pt-4 md:pt-0"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--color-bellini-primary)]/50 mb-4 md:mb-6 block">
            El Estudio
          </span>
          
          <h2 className="font-serif text-2xl md:text-4xl lg:text-5xl text-[var(--color-bellini-primary)] leading-tight mb-6 md:mb-8">
            Una sinergia <i className="text-[#f4f3ef]/60 font-light">silenciosa</i> <br className="hidden lg:block" />entre ciencia y arte.
          </h2>

          <div className="flex flex-col gap-4 md:gap-6 text-[13px] md:text-[14px] leading-relaxed text-[#f4f3ef]/70 font-light max-w-xl">
            <p>
              Bellini nace de la premisa de que la verdadera excelencia no necesita elevar la voz. Nos definimos por la precisión milimétrica, la tecnología de vanguardia y una experiencia humana diseñada para transmitir absoluta calma.
            </p>
            <p>
              Nuestro enfoque se aleja de la odontología tradicional para abrazar una visión más cercana a la alta relojería o el diseño arquitectónico: cuidamos cada plano, cada textura, cada proporción.
            </p>
          </div>
          
          <div className="mt-8 md:mt-12">
            <a 
              href="#contacto" 
              onClick={(e) => {
                e.preventDefault();
                const container = document.getElementById('main-scroll-container');
                if (container) {
                  container.scrollTo({
                    left: 5 * container.clientWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-[var(--color-bellini-bone)] hover:opacity-50 transition-opacity"
            >
              <span>Conocer más</span>
              <div className="w-8 h-[1px] bg-[var(--color-bellini-primary)]"></div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
