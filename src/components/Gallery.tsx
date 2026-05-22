import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { default as teethBefore } from '../assets/images/bellini_teeth_before_1779371123423.png';
import { default as teethAfter } from '../assets/images/bellini_teeth_after_1779371142222.png';
import { default as img4 } from '../assets/images/bellini_imagen (4).jpeg';
import { default as img5 } from '../assets/images/bellini_imagen (5).jpeg';
import { default as img7 } from '../assets/images/bellini_imagen (7).jpeg';
import { default as img8 } from '../assets/images/bellini_imagen (13).jpeg';
import { default as img9 } from '../assets/images/bellini_imagen (14).jpeg';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface CaseDetail {
  id: string;
  name: string;
  desc: string;
  challenge: string;
  solution: string;
  material: string;
  duration: string;
  thumbnail: string;
  beforeImg: string;
  afterImg: string;
  doctorNotes?: string;
}

export function Gallery() {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseDetail | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const archiveCases: CaseDetail[] = [
    {
      id: '01',
      name: 'Arquitectura Proporcional',
      desc: 'Carillas cerámicas ultra finas y re-estructuración de arcada',
      challenge: 'Desalineación dental severa, asimetría de márgenes gingivales e hipoplasia del esmalte generalizada que causaba timidez sistemática en el paciente.',
      solution: 'Micro-gingivectomía de alta precisión asistida por tecnología diagnóstica avanzada para armonizar contornos, acompañada de la colocación minuciosa de 10 carillas cerámicas sinterizadas de disilicato de litio de espesor mínimo (0.3mm), adaptadas individualmente respetando la microtextura interna.',
      material: 'Disilicato de litio Feldespático puro de alta pureza lumínica',
      duration: '3 sesiones clínicas',
      thumbnail: img4,
      beforeImg: teethBefore,
      afterImg: teethAfter,
      doctorNotes: 'Diseño morfológico enfocado en la refracción de luz ambiental. Logramos mimetizar prismas de esmalte de carácter natural con terminaciones imperceptibles.'
    },
    {
      id: '02',
      name: 'Armonía Tisular',
      desc: 'Implantología guiada de vanguardia y estética rosa',
      challenge: 'Pérdida ósea localizada en sector anterosuperior con colapso de la encía vecina y asimetría crítica de la línea de la sonrisa.',
      solution: 'Regeneración ósea guiada en 3D seguida de la colocación tridimensional exacta de implante de alta gama con carga inmediata asistida por computadora. El contorno marginal fue guiado mediante un provisional de acrílico biomimético pulido a espejo.',
      material: 'Titanio Grado 5 de alta integración y corona de Circonio multilaminada',
      duration: '4 meses de maduración tisular',
      thumbnail: img5,
      beforeImg: teethBefore,
      afterImg: teethAfter,
      doctorNotes: 'La arquitectura gingival alrededor del implante mantiene una consistencia y tono idénticos a los cuadrantes adyacentes, logrando la máxima naturalidad.'
    },
    {
      id: '03',
      name: 'Re-diseño Gingival Láser',
      desc: 'Nivelación de encías y rejuvenecimiento dentolabial',
      challenge: 'Erupción pasiva alterada (sonrisa gingival severa) con coronas dentales cortas y un margen tisular rugoso.',
      solution: 'Plástica gingival micro-quirúrgica selectiva con láser Er,Cr:YSGG para exponer la corona clínica real en su proporción áurea, complementada con microcarillas adhesivas ultra-lúcidas refinadas a mano.',
      material: 'Cerámica inyectada de silicato multilaminado refractario',
      duration: '2 sesiones personalizadas',
      thumbnail: img7,
      beforeImg: teethBefore,
      afterImg: teethAfter,
      doctorNotes: 'Un tratamiento mínimamente invasivo con postoperatorio indoloro. La sonrisa recuperó su balance geométrico con el labio superior.'
    },
    {
      id: '04',
      name: 'Restauración Biomimética',
      desc: 'Rehabilitación posfacial de desgaste por bruxismo severo',
      challenge: 'Pérdida acusada de la dimensión vertical con destrucción del tercio medio de las caras oclusales, sensibilidad dentaria constante y fatiga muscular.',
      solution: 'Restablecimiento de la guía canina y oclusión céntrica mediante fragmentos cerámicos de alta resistencia micro-adheridos (overlays table-tops) sin tallado agresivo.',
      material: 'Composite nanohíbrido estructurado y Silicato de Litio prensado',
      duration: '4 sesiones de rehabilitación holística',
      thumbnail: img8,
      beforeImg: teethBefore,
      afterImg: teethAfter,
      doctorNotes: 'Además de la indudable corrección estética, devolvemos la función articular protegiendo la estructura biológica de largo plazo.'
    },
    {
      id: '05',
      name: 'Alineación Micro-Sincrónica',
      desc: 'Ortodoncia invisible secuenciada de alta complejidad',
      challenge: 'Apiñamiento severo con rotaciones axiales incompatibles con carillas cerámicas directas sin previo alineamiento conservador.',
      solution: 'Planificación virtual tridimensional selectiva mediante simulación biomecánica tridimensional y uso secuenciado de alineadores transparentes de poliuretano de última generación.',
      material: 'Alineadores poliméricos inteligentes activos con memoria de forma',
      duration: '6 meses de modelamiento continuo',
      thumbnail: img9,
      beforeImg: teethBefore,
      afterImg: teethAfter,
      doctorNotes: 'Preparación dental ideal que nos permite realizar la colocación posterior de carillas conservadoras con cero tallado destructivo.'
    }
  ];

  // Lock scroll snap of main browser view whenever any modal is active
  useEffect(() => {
    if (isArchiveOpen || selectedCase) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isArchiveOpen, selectedCase]);

  return (
    <section 
      id="casos" 
      className="w-screen h-screen shrink-0 snap-start relative px-6 md:px-16 lg:px-24 py-16 md:py-24 flex flex-col justify-center bg-[#0a0a0a] text-[var(--color-bellini-primary)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col justify-between h-full py-4">
        {/* Editorial Heading */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#8e8e8e] mb-2 block font-light">
              Resultados Clínicos / Casos
            </span>
            <h2 className="font-serif text-2xl md:text-4xl leading-tight text-[#ECE8E1] font-light">
              Transformación <span className="italic text-[#8e8e8e]">Refinada</span>
            </h2>
          </motion.div>

          <div className="flex items-center gap-6">
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-[11px] text-[#8e8e8e] font-light max-w-sm hidden lg:block leading-relaxed"
            >
              Cada tratamiento es un tratado de anatomía, pulido óptico y mimetismo tisular. Seleccione uno de los casos destacados para examinar los protocolos clínicos y su antes y después interactivo.
            </motion.p>
            
            <button 
              onClick={() => setIsArchiveOpen(true)}
              className="text-[10px] uppercase tracking-[0.2em] border border-[#ECE8E1]/20 hover:border-[#ECE8E1] text-[#ECE8E1] px-5 py-3 transition-all duration-500 cursor-pointer rounded-sm bg-transparent pointer-events-auto"
              id="btn-open-archive"
            >
              Archivo de Casos
            </button>
          </div>
        </div>

        {/* Brand-new Thumbnail List Grid: 3 Main Clinical Cases with Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto pt-6 pb-4">
          {archiveCases.slice(0, 3).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedCase(item)}
              className="group relative flex flex-col bg-[#111] hover:bg-[#141414] border border-[#222]/40 hover:border-[var(--color-bellini-primary)]/20 p-4 rounded-lg cursor-pointer transition-all duration-500 overflow-hidden"
            >
              {/* Thumbnail Image Container */}
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded mb-4 bg-[#0a0a0a]">
                <img 
                  src={item.thumbnail} 
                  alt={item.name} 
                  className="w-full h-full object-cover filter grayscale contrast-[1.1] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 font-serif text-[10px] text-[var(--color-bellini-primary)] bg-[#0a0a0a]/80 py-1 px-2 rounded backdrop-blur-sm border border-white/5 uppercase tracking-wider">
                  Caso {item.id}
                </span>
                <span className="absolute bottom-3 right-3 text-[8px] uppercase tracking-widest text-white/50 group-hover:text-[var(--color-bellini-primary)] transition-colors">
                  Examen Clínico →
                </span>
              </div>

              {/* Title and Short description */}
              <div className="flex flex-col text-left pl-1">
                <h3 className="font-serif text-lg text-[#ECE8E1] mb-1 group-hover:text-[var(--color-bellini-primary)] transition-colors">
                  {item.name}
                </h3>
                <p className="text-[11px] text-[#8e8e8e] font-light leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
                
                {/* Micro Metadata */}
                <span className="text-[8.5px] uppercase tracking-wider text-[#4c4f54] mt-2 group-hover:text-[#8e8e8e] transition-colors">
                  {item.duration} · {item.material.split(' ')[0]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Micro guide text on bottom line */}
        <div className="flex justify-between items-center text-[8px] uppercase tracking-[0.25em] text-[#4c4f54] pt-2 border-t border-[#222]/40">
          <span>Estudio de Arquitectura Oral</span>
          <span>Haga clic en un caso para ver antes y después</span>
        </div>
      </div>

      {/* FULL ARCHIVE SLIDE-OUT PANEL (DEDICATED MODAL VIA PORTAL) */}
      {mounted && createPortal(
        <AnimatePresence>
          {isArchiveOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#060606]/95 z-[9999] backdrop-blur-md flex justify-end overflow-hidden pointer-events-auto"
              onClick={() => setIsArchiveOpen(false)}
            >
              {/* Main Slide-in Panel */}
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 170 }}
                className="w-full md:w-[600px] bg-[#0c0c0c] border-l border-[#222] h-full p-8 md:p-12 overflow-y-auto flex flex-col justify-between pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="flex justify-between items-center mb-8 border-b border-[#222] pb-6">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#8e8e8e]">Bellini Dental Studio</span>
                      <h3 className="font-serif text-2xl text-[#ECE8E1] mt-1 font-light">Casos de Éxito Clínico</h3>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsArchiveOpen(false);
                      }}
                      className="text-[10px] tracking-[0.2em] uppercase text-[#8e8e8e] hover:text-[var(--color-bellini-primary)] border border-white/10 hover:border-[var(--color-bellini-primary)]/40 px-3 py-2 transition-all cursor-pointer bg-transparent pointer-events-auto relative z-50"
                    >
                      Cerrar✕
                    </button>
                  </div>

                  <p className="text-[12px] text-[#8e8e8e] font-light leading-relaxed mb-6">
                    Presentamos una visión expandida de nuestras intervenciones estética-dentofaciales. Cada registro contiene un riguroso análisis estructural y la resolución biológica.
                  </p>

                  {/* Vertical Archive list items with image previews */}
                  <div className="flex flex-col gap-4">
                    {archiveCases.map((item) => (
                      <div 
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCase(item);
                        }}
                        className="group border border-[#222]/40 hover:border-[var(--color-bellini-primary)]/20 bg-[#111]/60 hover:bg-[#111] p-3 rounded transition-all duration-300 cursor-pointer flex gap-4 items-center text-left"
                      >
                        <div className="w-16 h-12 bg-[#0a0a0a] rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={item.thumbnail} 
                            alt={item.name} 
                            className="w-full h-full object-cover filter grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-serif text-[10.5px] text-[#555]">{item.id}</span>
                            <h4 className="font-serif text-[14px] text-[#ECE8E1] font-medium tracking-wide group-hover:text-[var(--color-bellini-primary)] transition-colors">
                              {item.name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-[#8e8e8e] font-light line-clamp-1">{item.desc}</p>
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-[#4c4f54] group-hover:text-[var(--color-bellini-primary)] pr-2 transition-colors">
                          Ficha →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#222] pt-6 mt-8 flex justify-between items-center text-[9px] uppercase tracking-[0.15em] text-[#555]">
                  <span>Práctica Odontológica Exclusiva</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsArchiveOpen(false);
                    }}
                    className="underline text-[#8e8e8e] hover:text-white transition-colors cursor-pointer bg-transparent pointer-events-auto"
                  >
                    Regresar al recorrido
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </ AnimatePresence>,
        document.body
      )}

      {/* SINGLE CASE DETAIL DIALOG + INTEGRATED BEFORE/AFTER SLIDER (VIA PORTAL) */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedCase && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCase(null)}
              className="fixed inset-0 bg-black/95 z-[99999] backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto pointer-events-auto"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl bg-[#0e0e0e] border border-[#222]/80 p-5 md:p-8 rounded-xl text-left flex flex-col max-h-[90vh] overflow-y-auto my-auto custom-scrollbar pointer-events-auto"
              >
                {/* Header inside Modal */}
                <div className="flex justify-between items-start mb-6 border-b border-[#222] pb-5">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#8e8e8e]">Estudio Clínico {selectedCase.id}</span>
                    <h4 className="font-serif text-xl md:text-2xl text-[#ECE8E1] mt-0.5">{selectedCase.name}</h4>
                    <p className="text-[11px] text-[#8e8e8e] font-light mt-1">{selectedCase.desc}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCase(null);
                    }}
                    className="text-[10px] tracking-wider text-[#8e8e8e] hover:text-[var(--color-bellini-primary)] border border-white/10 hover:border-[var(--color-bellini-primary)]/40 px-3 py-1.5 transition-all cursor-pointer bg-transparent rounded pointer-events-auto"
                  >
                    Regresar ✕
                  </button>
                </div>

                {/* INTERACTIVE BEFORE/AFTER SLIDER INSIDE DETAILED VIEW */}
                <div className="w-full max-h-[35vh] overflow-hidden relative flex justify-center items-center rounded-lg border border-white/5 mb-6 bg-[#060606]">
                  <BeforeAfterSlider 
                    beforeImage={selectedCase.beforeImg} 
                    afterImage={selectedCase.afterImg} 
                  />
                  
                  {/* Embedded instruction badge */}
                  <span className="absolute bottom-3 left-3 bg-[#0a0a0a]/90 text-[8px] uppercase tracking-[0.2em] text-[var(--color-bellini-primary)]/70 py-1 px-2.5 rounded border border-white/5 pointer-events-none select-none">
                    Deslice para comparar el cambio clínico
                  </span>
                </div>

                {/* Case content with sections */}
                <div className="space-y-5 text-[12px] md:text-[13px] leading-relaxed text-[#8e8e8e] font-light">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-[#111]/30 p-4 rounded border border-[#222]/30 text-left">
                      <h5 className="text-[9px] uppercase tracking-widest text-[#ECE8E1] mb-2 font-medium">Diagnóstico / Desafío Clínico</h5>
                      <p className="leading-relaxed font-light">{selectedCase.challenge}</p>
                    </div>

                    <div className="bg-[#111]/30 p-4 rounded border border-[#222]/30 text-left">
                      <h5 className="text-[9px] uppercase tracking-widest text-[#ECE8E1] mb-2 font-medium">Protocolo de Planificación y Solución</h5>
                      <p className="leading-relaxed font-light">{selectedCase.solution}</p>
                    </div>
                  </div>

                  {/* Additional Clinical observations / Doctor notes */}
                  {selectedCase.doctorNotes && (
                    <div className="border-l-2 border-[var(--color-bellini-primary)]/30 pl-4 py-1 italic bg-[#111]/10 text-[#8e8e8e]/95">
                      <span className="block not-italic text-[8px] uppercase tracking-widest text-[var(--color-bellini-primary)]/60 mb-1 font-medium">Observaciones de Autor</span>
                      &ldquo;{selectedCase.doctorNotes}&rdquo;
                    </div>
                  )}

                  {/* Core specifications grid */}
                  <div className="grid grid-cols-2 gap-4 border-t border-[#222]/60 pt-4 mt-4">
                    <div>
                      <h5 className="text-[9px] uppercase tracking-widest text-[#ECE8E1]/60 mb-0.5 font-medium">Materiales de Precisión</h5>
                      <p className="text-[11.5px] text-[#ECE8E1]/80 font-normal leading-snug">{selectedCase.material}</p>
                    </div>
                    <div>
                      <h5 className="text-[9px] uppercase tracking-widest text-[#ECE8E1]/60 mb-0.5 font-medium">Duración de Sesiones</h5>
                      <p className="text-[11.5px] text-[#ECE8E1]/80 font-normal leading-snug">{selectedCase.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Action layout */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t border-[#222] pt-5 gap-4">
                  <span className="text-[8.5px] uppercase tracking-[0.2em] text-[#4c4f54]">
                    Microfotografía intraoral de alta definición
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCase(null);
                      setIsArchiveOpen(false);
                      const container = document.getElementById('main-scroll-container');
                      if (container) {
                        container.scrollTo({
                          left: 5 * container.clientWidth,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="w-full sm:w-auto text-[9.5px] uppercase tracking-[0.2em] bg-[var(--color-bellini-primary)] text-[#0a0a0a] px-5 py-3 rounded hover:bg-[#fff] transition-all font-semibold cursor-pointer pointer-events-auto border-none"
                  >
                    Agendar valoración similar →
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
