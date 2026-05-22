import { motion } from 'motion/react';

export function Watermark({ text = "BELLINI", className = "" }: { text?: string; className?: string }) {
  return (
    <div className={`overflow-hidden absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none ${className}`}>
      <h2 className="text-[25vw] font-serif uppercase tracking-[-0.02em] whitespace-nowrap text-[var(--color-bellini-primary)]">{text}</h2>
    </div>
  )
}
