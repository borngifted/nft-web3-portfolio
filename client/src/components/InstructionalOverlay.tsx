/**
 * INSTRUCTIONAL OVERLAY - Lower Left Corner
 * Persistent instructions matching nicolaromei.com layout
 * Fixed position in lower left, dismissible with CLOSE button
 * Updated with BornGifted Gallery branding
 */

import { useState } from 'react';
import { Link } from 'wouter';

export default function InstructionalOverlay() {
  const [isVisible, setIsVisible] = useState(() => {
    // Check if user has dismissed the overlay
    const hasDismissed = localStorage.getItem('hasClosedInstructions');
    return !hasDismissed;
  });

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasClosedInstructions', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50 pointer-events-auto max-w-[calc(100vw-2rem)] md:max-w-none">
      {/* Large title at bottom */}
      <div className="mb-6">
        <h1 
          className="text-[40px] md:text-[60px] lg:text-[80px] font-bold leading-none tracking-tight"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            color: 'oklch(0.95 0 0)',
            textShadow: '0 0 40px oklch(0 0 0 / 0.5)',
          }}
        >
          BornGifted Gallery
        </h1>
      </div>

      {/* Instructions box */}
      <div className="bg-background/95 backdrop-blur-sm border border-foreground/20 p-4 md:p-6 max-w-sm md:max-w-md">
        {/* Instructions */}
        <div className="space-y-4">
          <p className="text-[10px] text-foreground/90 uppercase tracking-wide leading-relaxed">
            <span className="text-primary">SCROLL / DRAG</span> TO INTERACT W/ <span className="text-primary">THE ARTBOARD</span> OR <span className="text-primary">CLICK ON THE GRID</span> TO EXPLORE <span className="text-primary">THE ARCHIVE</span>.
          </p>

          <p className="text-[10px] leading-relaxed text-foreground/60 pt-2 border-t border-foreground/10">
            THE ARTBOARD SERVES AS A STRUCTURED ENVIRONMENT WHERE CREATIONS, SYSTEMS, AND DESIGN RESEARCH ACCUMULATED OVER TIME ARE ORGANIZED, PRESERVED, AND CONTINUOUSLY REVISITED.
          </p>

          {/* Navigation links */}
          <div className="flex gap-4 pt-2 border-t border-foreground/10 mt-4">
            <Link href="/manifesto">
              <button className="text-[10px] text-foreground/60 hover:text-primary transition-colors uppercase tracking-wide">
                MANIFESTO
              </button>
            </Link>
            <Link href="/studio">
              <button className="text-[10px] text-foreground/60 hover:text-primary transition-colors uppercase tracking-wide">
                STUDIO
              </button>
            </Link>
            <Link href="/journal">
              <button className="text-[10px] text-foreground/60 hover:text-primary transition-colors uppercase tracking-wide">
                JOURNAL
              </button>
            </Link>
            <Link href="/contact">
              <button className="text-[10px] text-foreground/60 hover:text-primary transition-colors uppercase tracking-wide">
                CONTACT
              </button>
            </Link>
          </div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="text-[10px] text-foreground/60 hover:text-primary transition-colors uppercase tracking-wide pt-4"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
