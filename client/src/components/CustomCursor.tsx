/**
 * CINEMATIC CURSOR SYSTEM
 * Contextual cursor that responds to interactions
 * - Default: Minimal dot
 * - Hover: Expands with label
 * - Drag: Directional indicator
 * - Interactive: Magnetic behavior
 */

import { useEffect, useState, useRef } from 'react';

interface CursorState {
  x: number;
  y: number;
  state: 'default' | 'hover' | 'drag' | 'interactive';
  label?: string;
}

export default function CustomCursor() {
  const [cursor, setCursor] = useState<CursorState>(() => ({
    x: 0,
    y: 0,
    state: 'default',
  }));
  
  const [isVisible, setIsVisible] = useState(() => false);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  // Smooth cursor following with easing
  useEffect(() => {
    const animate = () => {
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;
      
      currentRef.current.x += dx * 0.15;
      currentRef.current.y += dy * 0.15;
      
      setCursor((prev) => ({
        ...prev,
        x: currentRef.current.x,
        y: currentRef.current.y,
      }));
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
      
      // Check if hovering over artwork
      const target = e.target as HTMLElement;
      const artworkCard = target.closest('[data-artwork-card]');
      
      if (artworkCard) {
        setCursor((prev) => ({
          ...prev,
          state: 'hover',
          label: 'VIEW',
        }));
      } else {
        setCursor((prev) => ({
          ...prev,
          state: 'default',
          label: undefined,
        }));
      }
    };

    const handleMouseDown = () => {
      setCursor((prev) => ({
        ...prev,
        state: 'drag',
        label: undefined,
      }));
    };

    const handleMouseUp = () => {
      setCursor((prev) => ({
        ...prev,
        state: 'default',
        label: undefined,
      }));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  const cursorSize = cursor.state === 'hover' ? 60 : cursor.state === 'drag' ? 40 : 20;
  const cursorOpacity = cursor.state === 'default' ? 0.6 : 1;

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="fixed pointer-events-none z-[9999] transition-all duration-200"
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: 'translate(-50%, -50%)',
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          opacity: cursorOpacity,
        }}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-300"
          style={{
            border: '1px solid oklch(0.8 0.15 195)',
            opacity: cursor.state === 'hover' || cursor.state === 'drag' ? 1 : 0.4,
          }}
        />
        
        {/* Inner dot */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-all duration-200"
          style={{
            width: cursor.state === 'drag' ? '8px' : '4px',
            height: cursor.state === 'drag' ? '8px' : '4px',
          }}
        />

        {/* Label */}
        {cursor.label && (
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-mono text-xs text-primary whitespace-nowrap transition-opacity duration-200"
            style={{
              opacity: cursor.state === 'hover' ? 1 : 0,
            }}
          >
            {cursor.label}
          </div>
        )}
      </div>
    </>
  );
}
