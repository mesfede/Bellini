import { motion } from 'motion/react';
import { Watermark } from './Watermark';

export function Services() {
  const services = [
    { title: 'Estética Dental', desc: 'Carillas cerámicas de espesor mínimo, blanqueamiento de alta precisión y escultura de composites.' },
    { title: 'Rehabilitación Oral', desc: 'Restauración integral de la función y biología con materiales biomiméticos de última generación.' },
    { title: 'Implantes', desc: 'Implantología guiada por software 3D para posicionamiento quirúrgico milimétrico sin incisiones mayores.' },
    { title: 'Diseño de Sonrisa', desc: 'Arquitectura dental digital. planificación para predecir el resultado final con exactitud.' },
    { title: 'Ortodoncia Invisible', desc: 'Alineación silenciosa y eficiente. Micro-movimientos calculados para un flujo ininterrumpido diario.' },
  ];

  return (
    <section className="w-screen h-screen shrink-0 snap-start relative px-6 md:px-16 lg:px-24 pt-28 md:pt-36 lg:pt-40 flex flex-col justify-start bg-[#0a0a0a] overflow-hidden animate-fade-in">
      <Watermark text="PRÁCTICA" className="top-1/4" />

      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-6 md:mb-8 lg:mb-10 animate-slide-up">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[9px] uppercase tracking-[0.3em] text-[var(--color-bellini-primary)]/50 mb-1.5 block"
          >
            Nuestras Disciplinas
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-2xl md:text-3xl lg:text-4xl text-[var(--color-bellini-primary)] font-light"
          >
            Intervenciones <span className="italic">especializadas.</span>
          </motion.h2>
        </div>

        <div className="flex flex-col border-t border-white/10">
          {services.map((service, index) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.08 }}
              className="group border-b border-white/10 py-3 md:py-4 lg:py-5 grid grid-cols-1 md:grid-cols-12 gap-2 items-start hover:bg-white/5 transition-colors duration-500 cursor-default px-6 -mx-6 md:px-10 md:-mx-10"
            >
              <div className="col-span-1 md:col-span-1 text-[10px] text-[#f4f3ef]/45 font-serif mt-1">
                0{index + 1}.
              </div>
              <div className="col-span-1 md:col-span-4">
                <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-[var(--color-bellini-bone)] group-hover:italic transition-all duration-300">
                  {service.title}
                </h3>
              </div>
              <div className="col-span-1 md:col-span-6 flex items-center h-full">
                <p className="text-[12px] md:text-[13px] text-[#f4f3ef]/70 font-light leading-relaxed">
                  {service.desc}
                </p>
              </div>
              <div className="col-span-1 md:col-span-1 flex justify-end md:justify-center items-center opacity-0 group-hover:opacity-40 transition-opacity">
                <div className="w-8 h-[1px] bg-[var(--color-bellini-primary)]"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
