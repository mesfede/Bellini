import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeSection?: string;
}

export function Navbar({ activeSection = 'hero' }: NavbarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const navLinks = [
    { name: 'Inicio', href: '#hero', targetId: 'hero' },
    { name: 'Nosotros', href: '#nosotros', targetId: 'nosotros' },
    { name: 'Casos', href: '#casos', targetId: 'casos' },
    { name: 'Servicios', href: '#servicios', targetId: 'servicios' },
    { name: 'Contacto', href: '#contacto', targetId: 'contacto' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    setIsOpenMobile(false);
    const container = document.getElementById('main-scroll-container');
    if (container) {
      const sections = ['hero', 'nosotros', 'casos', 'servicios', 'experiencia', 'contacto'];
      const index = sections.indexOf(targetId);
      if (index !== -1) {
        window.dispatchEvent(new CustomEvent('nav-scroll-start', { detail: { targetIndex: index } }));
        container.scrollTo({
          left: index * container.clientWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  const currentLink = navLinks.find(l => l.targetId === activeSection) || navLinks[0];

  return (
    <>
      <div className="fixed top-8 left-6 md:top-12 md:left-12 z-50">
        {/* LOGO */}
        <a 
          href="#" 
          onClick={(e) => handleNavClick(e, 'hero')}
          className="flex flex-col items-center z-50 transition-opacity hover:opacity-75"
        >
          <span className="text-2xl md:text-3xl tracking-[0.25em] font-serif uppercase text-[var(--color-bellini-primary)]" style={{ transform: 'translateX(0.125em)' }}>
            Bellini
          </span>
          <span className="text-[7px] md:text-[9px] tracking-[0.4em] font-sans uppercase text-[var(--color-bellini-primary)]/80 mt-1" style={{ transform: 'translateX(0.2em)' }}>
            Odontología
          </span>
        </a>
      </div>

      {/* Floating Dynamic Menu - Desktop */}
      <div className="hidden md:flex fixed top-12 right-12 z-50 justify-end flex-row-reverse">
        <motion.div
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative flex items-center h-12 bg-[#121212]/85 backdrop-blur-xl border border-white/10 rounded-full px-2 overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] cursor-pointer"
          style={{ originX: 1 }}
          animate={{
            width: isHovered ? 'auto' : '160px',
            paddingLeft: isHovered ? '24px' : '16px',
            paddingRight: isHovered ? '24px' : '16px',
          }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
        >
          <AnimatePresence mode="popLayout">
            {!isHovered ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 w-full justify-center"
              >
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-[var(--color-bellini-primary)]"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-bellini-bone)] font-medium">
                  {currentLink.name}
                </span>
                <span className="absolute right-4 text-[#A3A6AC]/50 text-[10px]">
                  +
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center gap-8 whitespace-nowrap pl-2 pr-2"
              >
                {navLinks.map((link) => {
                  const isActive = activeSection === link.targetId;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.targetId)}
                      className={`relative py-1 text-[9px] uppercase font-medium tracking-[0.2em] transition-colors duration-500 flex flex-col items-center gap-1 ${
                        isActive ? 'text-[var(--color-bellini-bone)]' : 'text-[#A3A6AC]/40 hover:text-[var(--color-bellini-bone)]'
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <motion.div 
                          layoutId="activeDot" 
                          className="absolute -bottom-1 w-[3px] h-[3px] rounded-full bg-[var(--color-bellini-primary)]"
                          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                        />
                      )}
                    </a>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Mobile Menu Button - Top Right */}
       <div className="md:hidden fixed top-8 right-6 z-50">
         <button 
           onClick={() => setIsOpenMobile(!isOpenMobile)}
           className="relative w-8 h-8 flex flex-col justify-center items-end gap-1.5 focus:outline-none"
         >
           <motion.div 
             animate={isOpenMobile ? { rotate: -45, y: 6 } : { rotate: 0, y: 0 }}
             className="w-6 h-[1px] bg-[var(--color-bellini-primary)]" 
           />
           <motion.div 
             animate={isOpenMobile ? { opacity: 0 } : { opacity: 1 }}
             className="w-4 h-[1px] bg-[var(--color-bellini-primary)]" 
           />
           <motion.div 
             animate={isOpenMobile ? { rotate: 45, y: -7, width: 24 } : { rotate: 0, y: 0, width: 16 }}
             className="h-[1px] bg-[var(--color-bellini-primary)]" 
           />
         </button>
       </div>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isOpenMobile && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl flex flex-col justify-center items-center gap-10"
          >
            {navLinks.map((link, i) => {
              const isActive = activeSection === link.targetId;
              return (
                <motion.a 
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.targetId)}
                  className={`text-2xl font-serif tracking-[0.1em] transition-all ${
                    isActive ? 'text-[var(--color-bellini-primary)]' : 'text-[#A3A6AC]/60 hover:text-[var(--color-bellini-bone)]'
                  }`}
                >
                  {link.name}
                </motion.a>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
