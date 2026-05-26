import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Watermark } from './Watermark';

// Use actual images from the project
import img1 from '../assets/images/bellini_imagen (1).jpeg';
import img2 from '../assets/images/bellini_imagen (14).jpeg';
import img3 from '../assets/images/bellini_imagen (15).jpeg';
import img4 from '../assets/images/bellini_foto01.jpg';
import img5 from '../assets/images/bellini_imagen (12).jpeg';

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0);

  const services = [
    { title: 'Estética', subtitle: 'Dental', desc: 'Carillas cerámicas de espesor mínimo, blanqueamiento de alta precisión y escultura de composites.', img: img1 },
    { title: 'Rehabilitación', subtitle: 'Oral', desc: 'Restauración integral de la función y biología con materiales biomiméticos de última generación.', img: img2 },
    { title: 'Implantes', subtitle: '3D', desc: 'Implantología guiada por software 3D para posicionamiento quirúrgico milimétrico sin incisiones mayores.', img: img3 },
    { title: 'Diseño', subtitle: 'Digital', desc: 'Arquitectura dental digital. Planificación para predecir el resultado final con exactitud.', img: img4 },
    { title: 'Ortodoncia', subtitle: 'Invisible', desc: 'Alineación silenciosa y eficiente. Micro-movimientos calculados para un flujo ininterrumpido diario.', img: img5 },
  ];

  return (
    <section className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Subtle grid background for structural web feel */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', 
          backgroundSize: '100px 100px' 
        }} 
      />
      
      <Watermark text="EXCELENCIA" className="top-1/3 left-10 opacity-10" />

      {/* Main Content Box with fine borders */}
      <div className="w-full max-w-[1280px] border border-white/5 relative flex flex-col md:flex-row bg-[#0a0a0a]/50 backdrop-blur-sm shadow-2xl z-10 mt-12 md:mt-0">
        
        {/* Exquisite corner markings (filetes) */}
        <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-[var(--color-bellini-primary)]" />
        <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t border-r border-[var(--color-bellini-primary)]" />
        <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b border-l border-[var(--color-bellini-primary)]" />
        <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r border-[var(--color-bellini-primary)]" />
        
        {/* Left Panel: Context & Active Image */}
        <div className="w-full md:w-[40%] p-8 md:p-12 lg:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative">
          {/* Internal micro-guides */}
          <div className="hidden md:block absolute top-12 -right-[1px] w-[2px] h-8 bg-[var(--color-bellini-primary)]/50 z-20" />
          
          <div>
            <span className="flex items-center gap-4 text-[8px] lg:text-[9px] uppercase tracking-[0.4em] text-[var(--color-bellini-primary)] mb-8">
              <span className="w-6 h-[1px] bg-[var(--color-bellini-primary)]/40" />
              02 / Disciplinas
            </span>
            <p className="text-[11px] lg:text-[12px] font-light text-[#A3A6AC] leading-relaxed max-w-[280px] mb-12">
              Prácticas especializadas enfocadas en la restitución biológica y estética, guiadas por precisión micrométrica y tecnología de vanguardia.
            </p>
          </div>

          {/* Meticulous Image Frame */}
          <div className="relative w-full aspect-[4/5] max-w-[260px] p-2 border border-white/10 bg-white/[0.01] overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                src={services[activeIndex].img}
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
            </AnimatePresence>
            
            {/* Crop marks on image */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end mix-blend-difference pointer-events-none">
              <span className="text-[7px] font-mono tracking-widest text-white/50">
                FIG. 0{activeIndex + 1}
              </span>
              <div className="flex gap-1 flex-col items-end">
                 <span className="text-[6px] uppercase tracking-[0.3em] text-white/30">Sector</span>
                 <span className="text-[8px] uppercase tracking-[0.2em] text-white/70">{services[activeIndex].subtitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: The Ledger List */}
        <div className="w-full md:w-[60%] flex flex-col pt-8 md:pt-0 justify-center">
           {services.map((service, index) => {
             const isActive = activeIndex === index;
             return (
               <motion.div
                 key={service.title}
                 onMouseEnter={() => setActiveIndex(index)}
                 className="group relative flex flex-col py-6 lg:py-8 px-8 md:px-12 lg:px-16 border-b border-white/5 last:border-b-0 cursor-pointer overflow-hidden transition-colors duration-500 hover:bg-white/[0.02]"
               >
                 {/* Fine vertical line on active */}
                 <div className={`absolute left-0 top-0 bottom-0 w-[1px] transition-colors duration-500 ${isActive ? 'bg-[var(--color-bellini-primary)]' : 'bg-transparent'}`} />
                 
                 <div className="relative flex items-center justify-between gap-4 z-10">
                   <div className="flex items-end gap-6 md:gap-10">
                     <span className={`text-[9px] font-mono tracking-widest pb-1 transition-colors duration-500 ${isActive ? 'text-[var(--color-bellini-primary)]' : 'text-[#A3A6AC]/30'}`}>
                       0{index + 1}
                     </span>
                     <h2 className={`font-serif text-2xl md:text-3xl lg:text-4xl transition-all duration-500 font-light ${isActive ? 'text-[var(--color-bellini-bone)] italic' : 'text-[#A3A6AC]/60'}`}>
                       {service.title}
                     </h2>
                   </div>
                   
                   <div className="hidden sm:flex items-center gap-4">
                     <span className={`text-[8px] uppercase tracking-[0.3em] text-right transition-colors duration-500 ${isActive ? 'text-[var(--color-bellini-primary)]' : 'text-[#A3A6AC]/30'}`}>
                       {service.subtitle}
                     </span>
                     <div className={`w-8 h-[1px] transition-colors duration-500 ${isActive ? 'bg-[var(--color-bellini-primary)]/50' : 'bg-white/10'}`} />
                   </div>
                 </div>

                 <AnimatePresence>
                   {isActive && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                       exit={{ height: 0, opacity: 0, marginTop: 0 }}
                       className="pl-14 md:pl-[3.75rem] overflow-hidden"
                     >
                       <p className="text-[11px] md:text-[12px] text-[#A3A6AC] font-light max-w-sm leading-relaxed border-l border-white/10 pl-5 py-0.5">
                         {service.desc}
                       </p>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </motion.div>
             )
           })}
        </div>
        
      </div>
    </section>
  );
}
