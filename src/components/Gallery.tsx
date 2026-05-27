import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import teethBefore from '../assets/images/bellini_teeth_before_1779371123423.png';
import teethAfter from '../assets/images/bellini_teeth_after_1779371142222.png';
import belliniFoto1 from '../assets/images/bellini_foto01.jpg';
import belliniFoto2 from '../assets/images/bellini_foto02.jpg';
import belliniFoto3 from '../assets/images/bellini_foto03.jpg';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { resolveClinicalImagePath } from '../lib/imageResolver';

const STATIC_FALLBACK_CASES = [
  {
    id: 'case_static_1',
    category: 'Reconstrucción Dental Anterior de Alta Complejidad',
    tabLabel: 'Caso Principal 01',
    name: 'Reconstrucción Dental Anterior de Alta Complejidad',
    desc: 'Restauración biomimética de la arquitectura adamantina mediante microcarillas cerámicas de preparación nula.',
    challenge: 'Paciente presenta un severo desgaste erosivo incisal, desmineralización en el esmalte cervical y diastemas dispersos. Esta pérdida de soporte generaba fatiga biomecánica y sensibilidad constante.',
    solution: 'Se elaboró un plan de adición mínimamente invasivo sin tallar dientes. Se cementaron microcarillas cerámicas sinterizadas imitando las propiedades prismáticas, refractarias y el halo opalescente natural de los dientes.',
    material: 'Porcelana refractaria artesanal (0.3mm)',
    duration: '2 citas (Diseño + Adhesión)',
    beforeImg: teethBefore,
    afterImg: teethAfter,
    galleryImages: [belliniFoto1, belliniFoto2, belliniFoto3],
    doctorNotes: 'El objetivo prioritario fue restablecer la guía anterior y proteger la articulación temporomandibular mediante una adición aditiva, respetando el tejido biológico sano del paciente.'
  }
];

export function Gallery() {
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);
  const [showFutureCasesModal, setShowFutureCasesModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [cases, setCases] = useState<any[]>(STATIC_FALLBACK_CASES);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);

  const fetchDbCases = async () => {
    try {
      const q = collection(db, 'cases');
      let loaded: any[] = [];
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          loaded.push({ id: doc.id, ...doc.data() });
        });
      } catch (dbErr) {
        console.warn("Could not fetch remote Firestore cases, accessing offline/local mode:", dbErr);
      }

      // Read local storage cases as well
      const getLocalCases = (): any[] => {
        try {
          const raw = localStorage.getItem('bellini_local_cases');
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      };

      const localCases = getLocalCases();
      let finalCases = [...loaded];
      
      localCases.forEach((lCase) => {
        const idx = finalCases.findIndex(c => c.id === lCase.id);
        if (idx > -1) {
          finalCases[idx] = { ...finalCases[idx], ...lCase };
        } else {
          finalCases.push(lCase);
        }
      });

      if (finalCases.length > 0) {
        const sorted = [...finalCases].sort((a: any, b: any) => {
          const valA = (a.orderIndex !== undefined && a.orderIndex !== null) ? Number(a.orderIndex) : 9999;
          const valB = (b.orderIndex !== undefined && b.orderIndex !== null) ? Number(b.orderIndex) : 9999;
          const normA = isNaN(valA) ? 9999 : valA;
          const normB = isNaN(valB) ? 9999 : valB;
          if (normA !== normB) {
            return normA - normB;
          }
          
          const getSecVal = (c: any) => {
            if (c.createdAt) {
              if (typeof c.createdAt.seconds === 'number') return c.createdAt.seconds;
              if (c.createdAt instanceof Date) return c.createdAt.getTime() / 1000;
              if (typeof c.createdAt.toDate === 'function') {
                return c.createdAt.toDate().getTime() / 1000;
              }
            }
            return 0;
          };
          return getSecVal(b) - getSecVal(a);
        });
        setCases(sorted);
        setActiveCaseIndex(0);
      } else {
        setCases([]);
        setActiveCaseIndex(0);
      }
    } catch (e) {
      console.warn("Could not fetch DB cases, using high-fidelity static fallback:", e);
      setCases(STATIC_FALLBACK_CASES);
      setActiveCaseIndex(0);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchDbCases();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchDbCases();
    };
    window.addEventListener('bellini-cases-updated', handleRefresh);
    return () => window.removeEventListener('bellini-cases-updated', handleRefresh);
  }, []);

  if (cases.length === 0) {
    return (
      <section 
        id="casos" 
        className="w-screen h-screen shrink-0 snap-start relative px-4 md:px-12 lg:px-20 pt-24 md:pt-[110px] pb-6 flex flex-col justify-center items-center bg-[#0a0a0a] text-[var(--color-bellini-primary)] overflow-hidden"
      >
         <span className="text-[10px] uppercase tracking-[0.3em] text-[#8e8e8e] mb-4 block font-light">
           Gabinete Clínico
         </span>
         <h2 className="font-serif text-2xl md:text-4xl leading-tight text-[#ECE8E1] font-light">
           No hay casos clínicos disponibles.
         </h2>
      </section>
    );
  }

  const activeCase = cases[activeCaseIndex] || cases[0];

  return (
    <section 
      id="casos" 
      className="w-screen h-screen shrink-0 snap-start relative px-4 md:px-12 lg:px-20 pt-24 md:pt-[110px] pb-6 flex flex-col justify-between bg-[#0a0a0a] text-[var(--color-bellini-primary)] overflow-hidden select-text"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full justify-between z-10 min-h-0 select-text">
        
        {/* Concise Editorial Title */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-[#222]/30 pb-4">
          <div className="flex-grow max-w-3xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8e8e8e] mb-1.5 block font-light">
              Gabinete Clínico / Casos Reales
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl leading-tight text-[#ECE8E1] font-semibold">
              {activeCase.name}
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <span className="text-[11px] text-[#8e8e8e] font-light max-w-xs hidden lg:block leading-relaxed text-left">
              {activeCase.beforeImg 
                ? 'Examine los registros reales deslizando el mouse de un lado a otro sobre la imagen central.'
                : 'Examine el registro fotográfico real de alta fidelidad de la restauración finalizada.'}
            </span>
            <button 
              onClick={() => setShowFutureCasesModal(true)}
              className="group text-[9.5px] uppercase tracking-[0.2em] border border-[var(--color-bellini-primary)] px-5 py-2.5 rounded-full hover:bg-[var(--color-bellini-primary)] hover:text-[#0a0a0a] hover:border-[var(--color-bellini-primary)] transition-all duration-300 font-semibold cursor-pointer whitespace-nowrap active:scale-95 pointer-events-auto flex items-center gap-1.5"
            >
              Ver más casos
              <motion.span 
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block"
              >
                ➔
              </motion.span>
            </button>
          </div>
        </div>

        {/* Master Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow overflow-hidden min-h-0 py-4 select-text">
          
          {/* LEFT: Before/After Interactive Slider / Standalone Image */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-0 bg-[#111]/20 rounded-xl p-4 border border-[#222]/30">
            <div className="flex-grow flex items-center justify-center relative rounded-lg overflow-hidden bg-[#060606] select-none">
              
              {activeCase.beforeImg ? (
                <>
                  {/* Overlapped before-after images with pure hover slide reveal */}
                  <BeforeAfterSlider 
                    beforeImage={resolveClinicalImagePath(activeCase.beforeImg)} 
                    afterImage={resolveClinicalImagePath(activeCase.afterImg)} 
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center pointer-events-none select-none">
                    <span className="bg-[#0a0a0a]/90 text-[8.5px] uppercase tracking-[0.15em] text-[var(--color-bellini-primary)] py-1.5 px-3 rounded border border-white/5 shadow-md">
                      ⇄ Deslice el mouse horizontalmente para revelar la transformación
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center relative bg-[#060606] group cursor-default">
                  <img 
                    src={resolveClinicalImagePath(activeCase.afterImg)} 
                    alt={activeCase.name} 
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-700 pointer-events-auto"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center pointer-events-none select-none">
                    <span className="bg-[#0a0a0a]/90 text-[8.5px] uppercase tracking-[0.15em] text-[var(--color-bellini-primary)] py-1.5 px-3 rounded border border-white/5 shadow-md">
                      Registro de Resultado de Tratamiento
                    </span>
                  </div>
                </div>
              )}
              
            </div>

            {/* Gallery of extra photos representing clinical process steps */}
            {activeCase.galleryImages && activeCase.galleryImages.length > 0 && (
              <div className="mt-4 flex flex-col gap-2 pointer-events-auto">
                <span className="text-[9px] uppercase tracking-widest text-[#666] font-semibold text-left pl-1">
                  Registro del Proceso de Laboratorio & Secuencia Clínica:
                </span>
                <div 
                  className="grid gap-3 transition-all duration-500"
                  style={{ gridTemplateColumns: `repeat(${Math.min(activeCase.galleryImages.length, 3)}, minmax(0, 1fr))` }}
                >
                  {activeCase.galleryImages.map((imgUrl: string, stepIdx: number) => (
                    <div 
                      key={stepIdx}
                      onClick={() => setActiveLightboxImg(resolveClinicalImagePath(imgUrl))}
                      className="group relative aspect-[14/9] bg-[#0c0c0c] border border-[#222] rounded overflow-hidden cursor-zoom-in transition-all duration-300 hover:border-[var(--color-bellini-primary)]/45 pointer-events-auto"
                    >
                      <img 
                        src={resolveClinicalImagePath(imgUrl)} 
                        alt={`Secuencia clínica ${stepIdx + 1}`}
                        className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-2 transition-opacity duration-300 pointer-events-none">
                        <p className="text-[7.5px] text-[var(--color-bellini-primary)] font-semibold uppercase tracking-wider line-clamp-1">Detalle {stepIdx + 1}</p>
                        <p className="text-[6.5px] text-white/50 font-light truncate">Protocolo Fotográfico</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Sophisticated Case Technical File ("Ficha Técnica") */}
          <div className="lg:col-span-5 flex flex-col bg-[#111]/40 border border-[#222]/50 hover:border-[var(--color-bellini-primary)]/25 rounded-xl transition-all duration-500 text-left h-full min-h-0 overflow-hidden select-text pointer-events-auto">
            
            {/* Scrollable informational details inside the card */}
            <div className="flex-grow overflow-y-auto p-6 space-y-5 custom-scrollbar scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
              
              <div>
                <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-[var(--color-bellini-primary)] bg-[var(--color-bellini-primary)]/10 px-2.5 py-1 rounded font-semibold mb-2">
                  {activeCase.category || 'Gabinete Clínico'}
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-[#ECE8E1] tracking-wide leading-tight">
                  {activeCase.name}
                </h3>
                <p className="text-xs md:text-sm text-[#8e8e8e] font-light leading-relaxed mt-2">
                  {activeCase.desc}
                </p>
              </div>

              {/* Ficha Técnica Details */}
              <div className="grid grid-cols-1 gap-5 border-t border-[#222]/60 pt-5">
                
                {/* Diagnóstico */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#ECE8E1] font-semibold text-[var(--color-bellini-primary)]/90 mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--color-bellini-primary)] rounded-full"></span>
                    Estado de Entrada (Antes)
                  </h4>
                  <p className="text-xs md:text-sm leading-relaxed text-[#c3c1bc] font-light">
                    {activeCase.challenge}
                  </p>
                </div>

                {/* Tratamiento */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#ECE8E1] font-semibold text-[var(--color-bellini-primary)]/90 mb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#8e8e8e] rounded-full"></span>
                    Tratamiento Clínico (Después)
                  </h4>
                  <p className="text-xs md:text-sm leading-relaxed text-[#c3c1bc] font-light">
                    {activeCase.solution}
                  </p>
                </div>

                {/* Technical specifications */}
                <div className="grid grid-cols-2 gap-4 border-t border-[#222]/40 pt-5">
                  <div>
                    <h5 className="text-[10px] uppercase tracking-widest text-[#8e8e8e] mb-1">Material Utilizado</h5>
                    <p className="text-xs md:text-sm text-[#ECE8E1] leading-snug font-medium">{activeCase.material}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase tracking-widest text-[#8e8e8e] mb-1">Sesiones Clínicas</h5>
                    <p className="text-xs md:text-sm text-[#ECE8E1] leading-snug font-medium">{activeCase.duration}</p>
                  </div>
                </div>

                {/* Professional Observaciones */}
                {activeCase.doctorNotes && (
                  <div className="border-l border-[var(--color-bellini-primary)]/40 pl-4 py-2 bg-white/[0.02] rounded-r mt-3">
                    <span className="block text-[8px] uppercase tracking-widest text-[var(--color-bellini-primary)]/70 mb-1 font-bold">
                      Nota del Especialista
                    </span>
                    <p className="text-xs md:text-[13px] leading-relaxed italic text-[#8e8e8e]/95">
                      &ldquo;{activeCase.doctorNotes}&rdquo;
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* Direct Booking Action - Pinned stably at the bottom of the card */}
            <div className="p-5 border-t border-[#222]/60 bg-[#111]/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8e8e8e]">
                Bellini Dental Studio
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const container = document.getElementById('main-scroll-container');
                  if (container) {
                    window.dispatchEvent(new CustomEvent('nav-scroll-start', { detail: { targetIndex: 5 } }));
                    container.scrollTo({
                      left: 5 * container.clientWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="w-full sm:w-auto text-[10px] uppercase tracking-[0.2em] bg-[var(--color-bellini-primary)] text-[#0a0a0a] px-6 py-3 rounded hover:bg-[#fff] hover:text-[#0a0a0a] transition-all duration-300 font-semibold cursor-pointer border-none shadow-md active:scale-95 whitespace-nowrap"
              >
                Solicitar valoración del Caso →
              </button>
            </div>
          </div>

        </div>

        {/* Footer info strip */}
        <div className="flex justify-between items-center text-[8px] uppercase tracking-[0.25em] text-[#4c4f54] pt-3 border-t border-[#222]/45">
          <span>Estudio de Mimetismo & Diseño Oral</span>
          <span>Imágenes reales de tratamiento clínico</span>
        </div>
      </div>

      {/* MODAL 1: PREVIEW ARCHIVE OF FUTURE CLINICAL CASES (VIA PORTAL) */}
      {mounted && createPortal(
        <AnimatePresence>
          {showFutureCasesModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[999999] backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
              onClick={() => setShowFutureCasesModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#0f0f0f] border border-[#222] p-6 md:p-10 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col justify-between overflow-hidden shadow-2xl relative text-left"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowFutureCasesModal(false)}
                  className="absolute top-4 right-4 text-[#8e8e8e] hover:text-white text-xs uppercase tracking-widest p-2 cursor-pointer transition-all border-none bg-transparent"
                >
                  Cerrar [X]
                </button>

                {/* Modal Title */}
                <div className="mb-6 border-b border-[#222]/60 pb-5">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-bellini-primary)]/80 block mb-1">
                    Gabinete Clínico Completo
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-[#ECE8E1] font-light">
                    Archivo de Casos Registrados
                  </h3>
                  <p className="text-xs text-[#8e8e8e] font-light mt-2 max-w-2xl leading-relaxed">
                    Explore la bitácora interactiva de mimetismo y reconstrucción oral. Haga clic en cualquiera de los casos presentados a continuación para cargarlo en el visualizador del gabinete principal y explorar su secuencia fotográfica completa.
                  </p>
                </div>

                {/* Dinámicos Casos Grid - Scrollable area inside Modal */}
                <div className="flex-grow overflow-y-auto space-y-4 pr-1 mb-6 custom-scrollbar">
                  {cases.map((c, idx) => (
                    <div 
                      key={c.id || idx}
                      onClick={() => {
                        setActiveCaseIndex(idx);
                        setShowFutureCasesModal(false);
                      }}
                      className={`p-5 rounded-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-4 items-center cursor-pointer pointer-events-auto border-2 ${
                        activeCaseIndex === idx
                          ? 'bg-[#FAF7F0] border-[var(--color-bellini-primary)] shadow-xl scale-[1.01]'
                          : 'bg-[#ECE8E1] hover:bg-[#F2EFE8] border-[#dbd6cc] hover:border-[#cbc6bc]'
                      }`}
                    >
                      {/* Left Column: Category and Custom Position Label */}
                      <div className="md:col-span-3 flex flex-col gap-1 text-left">
                        <span className="text-[10px] uppercase tracking-widest text-[#7C6E55] font-semibold leading-snug">
                          {c.category}
                        </span>
                      </div>

                      {/* Center Column: Text description of the case in Dark Mode colors reversed */}
                      <div className="md:col-span-6 flex flex-col justify-center text-left">
                        <h4 className="font-serif text-[16px] text-[#111111] tracking-wide font-medium leading-snug">
                          {c.name}
                        </h4>
                        <p className="text-[11.5px] text-[#4A463F] font-light leading-relaxed mt-1 line-clamp-2">
                          {c.desc}
                        </p>
                      </div>

                      {/* Right Column: Thumbnail image and action */}
                      <div className="md:col-span-3 text-right flex items-center justify-end gap-3 md:flex-row flex-row-reverse w-full">
                        {c.afterImg && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#cbc6bc] bg-black/5 shrink-0 self-center">
                            <img 
                              src={resolveClinicalImagePath(c.afterImg)} 
                              alt={c.name} 
                              className="w-full h-full object-cover filter transition-all duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <div className="text-left md:text-right flex flex-col gap-1 flex-grow">
                          <span className={`inline-block text-[8.5px] font-bold uppercase tracking-widest px-2.5 py-1 rounded w-fit md:ml-auto transition-all ${
                            activeCaseIndex === idx 
                              ? 'bg-[var(--color-bellini-primary)] text-[#0a0a0a]' 
                              : 'bg-[#1c1c1c] text-[#FAF7F0] hover:bg-[#333]'
                          }`}>
                            {activeCaseIndex === idx ? 'Activo' : 'Explorar ➔'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Modal Info */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-[#222]/40 text-[9px] uppercase tracking-[0.2em] text-[#555] gap-3">
                  <span>Bellini Dental Studio · Innovación Biométrica</span>
                  <button 
                    onClick={() => {
                      setShowFutureCasesModal(false);
                      const container = document.getElementById('main-scroll-container');
                      if (container) {
                        window.dispatchEvent(new CustomEvent('nav-scroll-start', { detail: { targetIndex: 5 } }));
                        container.scrollTo({
                          left: 5 * container.clientWidth,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="text-[9px] uppercase tracking-[0.2em] underline text-[var(--color-bellini-primary)] hover:text-white border-none bg-transparent cursor-pointer font-semibold"
                  >
                    Consultar disponibilidad de especialidades →
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* MODAL 2: FULL-SCREEN LIGHTBOX POPUP FOR PROCESS PHOTOS (VIA PORTAL) */}
      {mounted && createPortal(
        <AnimatePresence>
          {activeLightboxImg && (() => {
            const index = activeCase.galleryImages?.indexOf(activeLightboxImg) ?? -1;
            const descText = (activeCase.galleryDescriptions && activeCase.galleryDescriptions[index]) 
              ? activeCase.galleryDescriptions[index] 
              : "Detalle del paso clínico o de laboratorio. Secuencia fotográfica registrada por el especialista para certificar el mimetismo absoluto, la integridad marginal y la correcta refractariedad de la porcelana frente a la luz natural.";
            
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveLightboxImg(null)}
                className="fixed inset-0 bg-black/98 z-[999999] backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8 cursor-zoom-out pointer-events-auto animate-fadeIn"
              >
                {/* Modal Container */}
                <div 
                  className="bg-[#0b0b0b] border border-[#222] rounded-2xl max-w-5xl w-full max-h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  
                  {/* Left panel: Clinical Image */}
                  <div className="flex-grow md:w-3/5 bg-black flex items-center justify-center p-4 relative group">
                    <img 
                      src={resolveClinicalImagePath(activeLightboxImg || '')} 
                      alt="Registro clínico de laboratorio" 
                      className="max-w-full max-h-[50vh] md:max-h-[70vh] object-contain rounded-lg shadow-lg border border-white/5"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-black/80 px-2.5 py-1 rounded border border-white/5 text-[8.5px] font-mono text-[var(--color-bellini-primary)] uppercase tracking-widest">
                      Imagen {index !== -1 ? String(index + 1).padStart(2, '0') : 'Fase'}
                    </div>
                  </div>

                  {/* Right panel: Descriptive Content */}
                  <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#222]/80 bg-[#0e0e0e]/50 text-left select-text">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-bellini-primary)] font-bold block mb-1">
                          Secuencia Clínica Detallada
                        </span>
                        <h4 className="font-serif text-lg text-white font-light leading-snug">
                          {activeCase.name}
                        </h4>
                        <span className="text-[10px] text-[#666] block mt-0.5 uppercase tracking-wider">
                          Etiqueta: {activeCase.tabLabel}
                        </span>
                      </div>

                      <div className="border-t border-[#222]/40 pt-4">
                        <span className="text-[10px] uppercase tracking-widest text-[#8e8e8e] block mb-2 font-semibold">
                          Descripción de la Imagen
                        </span>
                        <p className="text-xs md:text-sm text-[#c3c1bc] font-light leading-relaxed whitespace-pre-line bg-[#080808]/40 p-4 rounded-lg border border-[#1a1a1a]">
                          {descText}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-[#222]/40 pt-4 mt-6 flex justify-between items-center bg-[#0e0e0e]/10">
                      <div className="text-[8px] font-mono text-[#555] uppercase tracking-wider">
                        Bellini Dental Studio
                      </div>
                      <button 
                        onClick={() => setActiveLightboxImg(null)}
                        className="text-[9px] uppercase tracking-wider text-[var(--color-bellini-primary)] bg-[#1c1c1c] border border-[#333] hover:border-[var(--color-bellini-primary)] px-3 py-1.5 rounded transition-all cursor-pointer font-bold active:scale-95"
                      >
                        Retornar ➔
                      </button>
                    </div>
                  </div>

                </div>
                
                <span className="text-[8.5px] tracking-widest text-[#555] uppercase mt-4">
                  HAGA CLIC AFUERA PARA CERRAR EL GABINETE CLÍNICO
                </span>
              </motion.div>
            );
          })()}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
