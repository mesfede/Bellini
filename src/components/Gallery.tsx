import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { default as teethBefore } from '../assets/images/bellini_teeth_before_1779371123423.png';
import { default as teethAfter } from '../assets/images/bellini_teeth_after_1779371142222.png';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface CaseDetail {
  id: string;
  name: string;
  desc: string;
  challenge: string;
  solution: string;
  material: string;
  duration: string;
}

export function Gallery() {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'featured' | 'archive'>('featured');
  const [selectedCase, setSelectedCase] = useState<CaseDetail | null>(null);

  const archiveCases: CaseDetail[] = [
    {
      id: '01',
      name: 'Arquitectura Proporcional',
      desc: 'Carillas cerámicas ultra finas y re-estructuración de arcada',
      challenge: 'Desalineación dental severa, asimetría de márgenes gingivales e hipoplasia del esmalte generalizada.',
      solution: 'Micro-gingivectomía láser de alta precisión seguida de la colocación de 10 carillas cerámicas sinterizadas de disilicato de litio de espesor mínimo (0.3mm), respetando la textura bionivelada natural.',
      material: 'Disilicato de litio Feldespático puro',
      duration: '3 sesiones clínicas'
    },
    {
      id: '02',
      name: 'Armonía Tisular',
      desc: 'Implantología guiada y estética rosa',
      challenge: 'Pérdida ósea localizada en sector anterosuperior con colapso de la encía y asimetría de la línea de la sonrisa.',
      solution: 'Regeneración ósea guiada y colocación de implante de titanio de grado médico asistido por computadora, con posterior corona provisional esculpida para guiar el perfil de emergencia tisular.',
      material: 'Titanio Grado 5 y Circonio Translúcido',
      duration: '4 meses de maduración'
    },
    {
      id: '03',
      name: 'Re-diseño Gingival Láser',
      desc: 'Nivelación de encías y rejuvenecimiento dentolabial',
      challenge: 'Sonrisa gingival pronunciada con coronas clínicas extremadamente cortas y tonalidad ocre subyacente.',
      solution: 'Plástica gingival micro-quirúrgica asistida con tecnología láser de CO2, revelando la proporción áurea de la anatomía coronaria, complementada con microcarillas de porcelana ultra-lúcida.',
      material: 'Cerámica inyectada de alta pureza',
      duration: '2 sesiones de mínima invasión'
    },
    {
      id: '04',
      name: 'Restauración Biomimética',
      desc: 'Rehabilitación posfacial de desgaste por bruxismo severo',
      challenge: 'Pérdida acusada de la dimensión vertical con destrucción del tercio medio de las caras oclusales y dolor muscular.',
      solution: 'Restablecimiento de la guía canina y oclusión céntrica mediante fragmentos cerámicos adheridos adheridos (overlays Table-tops) en sector posterior y carillas anteriores, devolviendo armonía mandibular.',
      material: 'Composite nanohíbrido y Silicato de Litio',
      duration: '4 sesiones de rehabilitación'
    },
    {
      id: '05',
      name: 'Alineación Micro-Sincrónica',
      desc: 'Ortodoncia invisible secuenciada de alta complejidad',
      challenge: 'Apiñamiento severo con rotaciones axiales complejas incompatibles con estética directa inmediata.',
      solution: 'Planificación virtual 3D selectiva y uso secuenciado de alineadores transparentes inteligentes de poliuretano médico de alta memoria elástica durante 6 meses previos al micro-tallado conservador.',
      material: 'Alineadores poliméricos inteligentes biocompatibles',
      duration: '6 meses de flujo continuo'
    }
  ];

  return (
    <section id="casos" className="w-screen h-screen shrink-0 snap-start relative px-6 md:px-16 lg:px-24 py-16 md:py-24 flex flex-col justify-center bg-[#0a0a0a] text-[#f4f3ef] overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 md:mb-10 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#8e8e8e] mb-2 block">
              Resultados Clínicos / Casos
            </span>
            <h2 className="font-serif text-2xl md:text-4xl leading-tight text-[#f4f3ef] font-light">
              Transformación <span className="italic text-[#8e8e8e]">Refinada</span>
            </h2>
          </motion.div>

          <div className="flex items-center gap-6">
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-[12px] text-[#8e8e8e] font-light max-w-sm hidden lg:block"
            >
              Cada sonrisa es abordada con rigor milimétrico: analizamos proporciones óseas, simetría labial y dinámica de la luz, alcanzando una estética invisible de apariencia natural.
            </motion.p>
            
            <button 
              onClick={() => setIsArchiveOpen(true)}
              className="text-[10px] uppercase tracking-[0.2em] border border-[#f4f3ef]/20 hover:border-[#f4f3ef] text-[#f4f3ef] px-5 py-3 transition-all duration-500 cursor-pointer rounded-sm"
              id="btn-open-archive"
            >
              Ver más casos
            </button>
          </div>
        </div>

        {/* Elegant Slider Component */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 max-h-[40vh] md:max-h-[48vh] overflow-hidden relative flex justify-center items-center rounded-lg border border-white/5"
        >
          <BeforeAfterSlider beforeImage={teethBefore} afterImage={teethAfter} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-4">
          {archiveCases.slice(0, 2).map((item, idx) => (
             <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 + (idx * 0.2) }}
              onClick={() => setSelectedCase(item)}
              className="border-t border-[#222] hover:border-[#444] pt-4 flex justify-between items-start group cursor-pointer transition-colors"
             >
                <div>
                  <h3 className="font-serif text-lg md:text-xl text-[#f4f3ef] mb-1 group-hover:italic transition-all">{item.name}</h3>
                  <p className="text-[10px] text-[#8e8e8e] uppercase tracking-widest">{item.desc}</p>
                </div>
                <div className="text-[9px] text-[#555] font-serif group-hover:text-[#f4f3ef] transition-colors uppercase tracking-widest border border-transparent group-hover:border-[#f4f3ef]/20 rounded px-2 py-1">
                  Detalles
                </div>
             </motion.div>
          ))}
        </div>
      </div>

      {/* FULL ARCHIVE OVERLAY SLEEK MODAL */}
      <AnimatePresence>
        {isArchiveOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#060606]/95 z-50 backdrop-blur-md flex justify-end overflow-hidden"
          >
            {/* Main Slide-in Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="w-full md:w-[650px] bg-[#0c0c0c] border-l border-[#222] h-full p-8 md:p-12 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-10 border-b border-[#222] pb-6">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#8e8e8e]">Bellini Dental Studio</span>
                    <h3 className="font-serif text-2xl text-[#f4f3ef] mt-1 font-light">Casos de Éxito Clínico</h3>
                  </div>
                  <button 
                    onClick={() => setIsArchiveOpen(false)}
                    className="text-[10px] tracking-[0.2em] uppercase text-[#8e8e8e] hover:text-[#f4f3ef] border border-white/10 hover:border-white/30 px-3 py-2 transition-all cursor-pointer"
                  >
                    Cerrar✕
                  </button>
                </div>

                <p className="text-[12px] text-[#8e8e8e] font-light leading-relaxed mb-8">
                  Presentamos una selección de nuestras intervenciones de armonización oral de alta complejidad. Cada ficha técnica expone el análisis anatómico, el desafío biológico y la solución arquitectónica implementada.
                </p>

                <div className="flex flex-col gap-6">
                  {archiveCases.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedCase(item)}
                      className="group border border-[#1c1c1c] hover:border-[#333] bg-[#0e0e0e] hover:bg-[#121212] p-5 rounded transition-all cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-serif text-[10px] text-[#555]">{item.id}</span>
                          <h4 className="font-serif text-md text-[#f4f3ef] font-medium tracking-wide group-hover:text-[var(--color-bellini-bone)] transition-colors">{item.name}</h4>
                        </div>
                        <p className="text-[11px] text-[#8e8e8e] font-light">{item.desc}</p>
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-[#555] group-hover:text-[#f4f3ef] transition-colors">
                        Ver Ficha →
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#222] pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-[0.15em] text-[#555]">
                <span>Práctica Odontológica Exclusiva</span>
                <button 
                  onClick={() => setIsArchiveOpen(false)}
                  className="mt-4 sm:mt-0 underline text-[#8e8e8e] hover:text-white transition-colors cursor-pointer"
                >
                  Regresar al recorrido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SINGLE CASE DETAIL DIALOG */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCase(null)}
            className="fixed inset-0 bg-[#000]/90 z-[60] backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#0e0e0e] border border-[#222] p-6 md:p-10 rounded-lg text-left"
            >
              <div className="flex justify-between items-start mb-6 border-b border-[#222] pb-4">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#8e8e8e]">Caso {selectedCase.id}</span>
                  <h4 className="font-serif text-xl md:text-2xl text-[#f4f3ef] mt-1">{selectedCase.name}</h4>
                </div>
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="text-[10px] tracking-wider text-[#8e8e8e] hover:text-white border border-[#222] hover:border-[#444] px-3 py-1.5 transition-all cursor-pointer"
                >
                  Regresar
                </button>
              </div>

              <div className="space-y-6 text-[13px] md:text-[14px] leading-relaxed text-[#8e8e8e] font-light">
                <div>
                  <h5 className="text-[10px] uppercase tracking-widest text-[#f4f3ef] mb-1 font-medium">Diagnóstico / Desafío Clínico</h5>
                  <p>{selectedCase.challenge}</p>
                </div>

                <div>
                  <h5 className="text-[10px] uppercase tracking-widest text-[#f4f3ef] mb-1 font-medium">Protocolo de Planificación y Solución</h5>
                  <p>{selectedCase.solution}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[#222] pt-4 mt-6">
                  <div>
                    <h5 className="text-[10px] uppercase tracking-widest text-[#f4f3ef]/60 mb-0.5 font-medium">Materiales Utilizados</h5>
                    <p className="text-[12px] text-[#f4f3ef]/80">{selectedCase.material}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase tracking-widest text-[#f4f3ef]/60 mb-0.5 font-medium">Duración de Sesiones</h5>
                    <p className="text-[12px] text-[#f4f3ef]/80">{selectedCase.duration}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => {
                    setSelectedCase(null);
                    setIsArchiveOpen(false);
                    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
                  }}
                  className="text-[10px] uppercase tracking-[0.2em] bg-[var(--color-bellini-bone)] text-[#0a0a0a] px-6 py-3 rounded hover:opacity-90 transition-all font-medium cursor-pointer"
                >
                  Agendar valoración similar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
