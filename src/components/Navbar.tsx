import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface NavbarProps {
  activeSection?: string;
}

export function Navbar({ activeSection = 'hero' }: NavbarProps) {
  const { scrollY } = useScroll();
  const background = useTransform(scrollY, [0, 50], ["rgba(244, 243, 239, 0)", "rgba(244, 243, 239, 0.95)"]);
  const backdropFilter = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);

  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Nosotros', href: '#nosotros', targetId: 'nosotros' },
    { name: 'Casos', href: '#casos', targetId: 'casos' },
    { name: 'Servicios', href: '#servicios', targetId: 'servicios' },
    { name: 'Contacto', href: '#contacto', targetId: 'contacto' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    const container = document.getElementById('main-scroll-container');
    if (container) {
      const sections = ['hero', 'nosotros', 'casos', 'servicios', 'experiencia', 'contacto'];
      const index = sections.indexOf(targetId);
      if (index !== -1) {
        container.scrollTo({
          left: index * container.clientWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <>
      <motion.nav 
        style={{ background, backdropFilter }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-16 flex justify-between items-center bg-transparent"
      >
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            const container = document.getElementById('main-scroll-container');
            if (container) {
              container.scrollTo({
                left: 0,
                behavior: 'smooth'
              });
            }
          }}
          className="flex flex-col items-center z-50 transition-opacity hover:opacity-75 animate-fade-in"
        >
          <span className="text-xl md:text-2xl tracking-[0.25em] font-serif uppercase text-[var(--color-bellini-primary)]">
            Bellini
          </span>
          <span className="text-[6px] md:text-[8px] tracking-[0.4em] font-sans uppercase text-[var(--color-bellini-primary)]/80 mt-1">
            Odontología
          </span>
        </a>
        <div className="hidden md:flex gap-12 text-[10px] uppercase font-medium tracking-[0.2em]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.targetId;
            return (
              <a 
                key={link.name}
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.targetId)}
                className={`relative py-1 transition-colors duration-500 hover:text-[var(--color-bellini-primary)] ${
                  isActive ? 'text-[var(--color-bellini-bone)] font-semibold' : 'text-[var(--color-bellini-bone)]/50'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="activeUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--color-bellini-primary)]"
                    transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                  />
                )}
              </a>
            );
          })}
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[10px] uppercase tracking-[0.2em] z-50 p-2 text-[var(--color-bellini-bone)]"
        >
          {isOpen ? 'Cerrar' : 'Menú'}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div 
        initial={{ opacity: 0, y: '-100%' }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col justify-center items-center gap-8"
      >
        {navLinks.map((link) => (
          <a 
            key={link.name}
            href={link.href} 
            onClick={(e) => handleNavClick(e, link.targetId)}
            className="text-3xl font-serif text-[var(--color-bellini-bone)] hover:opacity-50 transition-opacity"
          >
            {link.name}
          </a>
        ))}
      </motion.div>
    </>
  );
}
