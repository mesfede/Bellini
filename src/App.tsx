/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useEffect, useState } from 'react';
import { Navbar } from '@/src/components/Navbar';
import { Hero } from '@/src/components/Hero';
import { About } from '@/src/components/About';
import { Services } from '@/src/components/Services';
import { Gallery } from '@/src/components/Gallery';
import { Experience } from '@/src/components/Experience';
import { Contact } from '@/src/components/Contact';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const isTransitioning = useRef(false);

  const [heroSubSlide, _setHeroSubSlide] = useState(0);
  const heroSubSlideRef = useRef(0);
  const lastNavWasWheelUp = useRef(false);

  const setHeroSubSlide = (val: number | ((prev: number) => number)) => {
    if (typeof val === 'function') {
      _setHeroSubSlide(prev => {
        const next = val(prev);
        heroSubSlideRef.current = next;
        return next;
      });
    } else {
      _setHeroSubSlide(val);
      heroSubSlideRef.current = val;
    }
  };

  useEffect(() => {
    if (activeSection === 'hero') {
      if (!lastNavWasWheelUp.current) {
        setHeroSubSlide(0);
      }
    } else {
      lastNavWasWheelUp.current = false;
    }
  }, [activeSection]);

  const sections = ['hero', 'nosotros', 'casos', 'servicios', 'experiencia', 'contacto'];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Convert mouse wheel events to seamless section transitions
    const handleWheel = (e: WheelEvent) => {
      // Direct escape when any modal, modal-open class, or dialog is currently open
      if (
        document.body.classList.contains('modal-open') || 
        document.querySelector('.modal-overlay') || 
        document.querySelector('[role="dialog"]')
      ) {
        return; // Allow native, continuous vertical scrolling inside the open details panel
      }

      // Ignore if vertical scrolling is negligible or if a transition is active
      if (Math.abs(e.deltaY) < 15 || isTransitioning.current) {
        if (isTransitioning.current) {
          e.preventDefault();
        }
        return;
      }

      // Allow natural horizontal swipe adjustments on trackpads
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }

      e.preventDefault();

      // Find current index
      const currentScrollLeft = container.scrollLeft;
      const viewportWidth = window.innerWidth;
      const currentIndex = Math.round(currentScrollLeft / viewportWidth);

      // Scroll-driven Hero sub-slide management
      if (currentIndex === 0) {
        const currentHeroSlide = heroSubSlideRef.current;
        if (e.deltaY > 0) {
          // Scrolling down
          if (currentHeroSlide < 2) {
            isTransitioning.current = true;
            setHeroSubSlide(prev => prev + 1);
            setTimeout(() => {
              isTransitioning.current = false;
            }, 900);
            return;
          }
        } else {
          // Scrolling up
          if (currentHeroSlide > 0) {
            isTransitioning.current = true;
            setHeroSubSlide(prev => prev - 1);
            setTimeout(() => {
              isTransitioning.current = false;
            }, 900);
            return;
          }
        }
      }

      // Intercept wheel up on Nosotros (index 1) to land on the 3rd sub-slide of Hero (index 2)
      if (currentIndex === 1 && e.deltaY < 0) {
        isTransitioning.current = true;
        lastNavWasWheelUp.current = true;
        setHeroSubSlide(2);
        const targetElement = document.getElementById('hero');
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            inline: 'start',
            block: 'nearest'
          });
          setTimeout(() => {
            isTransitioning.current = false;
          }, 900);
        } else {
          isTransitioning.current = false;
        }
        return;
      }

      let targetIndex = currentIndex;
      if (e.deltaY > 0) {
        // Scroll down / scroll right
        targetIndex = Math.min(currentIndex + 1, sections.length - 1);
      } else {
        // Scroll up / scroll left
        targetIndex = Math.max(currentIndex - 1, 0);
      }

      if (targetIndex !== currentIndex) {
        isTransitioning.current = true;
        if (targetIndex !== 0) {
          lastNavWasWheelUp.current = false;
        }
        const targetElement = document.getElementById(sections[targetIndex]);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            inline: 'start',
            block: 'nearest'
          });

          // Throttle next trigger until transition completes for high-end feel
          setTimeout(() => {
            isTransitioning.current = false;
          }, 850);
        } else {
          isTransitioning.current = false;
        }
      }
    };

    // Track scroll progress and active section based on bounds
    const handleScroll = () => {
      const scrollWidth = container.scrollWidth - container.clientWidth;
      if (scrollWidth > 0) {
        setScrollProgress((container.scrollLeft / scrollWidth) * 100);
      }

      const viewportWidth = window.innerWidth;
      const currentScrollLeft = container.scrollLeft;

      const currentIndex = Math.round(currentScrollLeft / viewportWidth);
      if (sections[currentIndex]) {
        setActiveSection(sections[currentIndex]);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Quick navigation helpers for arrow keys or subtle side floating triggers
  const navigateHorizontal = (direction: 'next' | 'prev') => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = window.innerWidth;
    container.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden font-sans">
      {/* Absolute Noise Overlay */}
      <div className="fixed inset-0 bg-noise z-0 pointer-events-none"></div>

      {/* Modern Top Luxury Navbar */}
      <Navbar activeSection={activeSection} />

      {/* Main Horizontal Snapping Container */}
      <div
        ref={containerRef}
        className="flex flex-row overflow-x-auto overflow-y-hidden h-screen w-screen snap-x snap-mandatory scroll-smooth relative z-10 select-none scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div id="hero" className="w-screen h-screen flex-shrink-0 snap-start">
          <Hero activeSubSlide={heroSubSlide} />
        </div>
        <div id="nosotros" className="w-screen h-screen flex-shrink-0 snap-start">
          <About />
        </div>
        <div id="casos" className="w-screen h-screen flex-shrink-0 snap-start">
          <Gallery />
        </div>
        <div id="servicios" className="w-screen h-screen flex-shrink-0 snap-start">
          <Services />
        </div>
        <div id="experiencia" className="w-screen h-screen flex-shrink-0 snap-start">
          <Experience />
        </div>
        <div id="contacto" className="w-screen h-screen flex-shrink-0 snap-start">
          <Contact />
        </div>
      </div>

      {/* Slim Dynamic Editorial Timeline at the bottom */}
      <div className="fixed bottom-8 left-6 md:left-16 right-6 md:right-16 z-30 flex justify-between items-center pointer-events-none">
        {/* Progress line */}
        <div className="flex items-center gap-4 w-1/3">
          <span className="font-serif text-[10px] tracking-widest text-[#f4f3ef]/40 uppercase">01</span>
          <div className="relative h-[1px] flex-grow bg-white/10">
            <div 
              className="absolute top-0 left-0 h-full bg-[var(--color-bellini-bone)] transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
            ></div>
          </div>
          <span className="font-serif text-[10px] tracking-widest text-[#f4f3ef]/40 uppercase">06</span>
        </div>

        {/* Dynamic active section indicator name */}
        <div className="text-[9px] uppercase tracking-[0.3em] text-[#f4f3ef]/60 font-medium">
          {activeSection === 'hero' && 'Inicio'}
          {activeSection === 'nosotros' && 'Filosofía'}
          {activeSection === 'casos' && 'Casos Clínicos'}
          {activeSection === 'servicios' && 'Disciplinas'}
          {activeSection === 'experiencia' && 'La Experiencia'}
          {activeSection === 'contacto' && 'Sesión'}
        </div>
      </div>
    </div>
  );
}
