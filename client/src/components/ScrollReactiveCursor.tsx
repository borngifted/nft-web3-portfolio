/**
 * SCROLL REACTIVE CURSOR
 * Custom cursor that responds to:
 * - Mouse position (follows with easing)
 * - Scroll direction (arrow indicator)
 * - Scroll speed (size changes)
 * - Hover state (expands with label)
 */

import { useEffect, useState, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CursorState {
  x: number;
  y: number;
  scrollDirection: 'up' | 'down' | 'idle';
  scrollSpeed: number;
  isHovering: boolean;
}

export default function ScrollReactiveCursor() {
  const [cursor, setCursor] = useState<CursorState>(() => ({
    x: 0,
    y: 0,
    scrollDirection: 'idle',
    scrollSpeed: 0,
    isHovering: false,
  }));
  
  const [isVisible, setIsVisible] = useState(() => false);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

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

  // Track mouse position and hover state
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
      
      // Check if hovering over artwork
      const target = e.target as HTMLElement;
      const artworkCard = target.closest('[data-artwork-card]');
      
      setCursor((prev) => ({
        ...prev,
        isHovering: !!artworkCard,
      }));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Track scroll direction and speed
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      const scrollSpeed = Math.abs(scrollDelta);
      
      // Determine direction
      const direction = scrollDelta > 0 ? 'down' : scrollDelta < 0 ? 'up' : 'idle';
      
      setCursor((prev) => ({
        ...prev,
        scrollDirection: direction,
        scrollSpeed: Math.min(scrollSpeed, 50), // Cap at 50 for size calculation
      }));
      
      lastScrollY.current = currentScrollY;
      
      // Reset to idle after scroll stops
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setCursor((prev) => ({
          ...prev,
          scrollDirection: 'idle',
          scrollSpeed: 0,
        }));
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  // Calculate cursor size based on state
  const baseSize = 20;
  const hoverSize = 60;
  const scrollSizeBoost = cursor.scrollSpeed * 0.5; // Grows with scroll speed
  const cursorSize = cursor.isHovering 
    ? hoverSize 
    : baseSize + scrollSizeBoost;

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-all duration-200"
      style={{
        left: cursor.x,
        top: cursor.y,
        transform: 'translate(-50%, -50%)',
        width: `${cursorSize}px`,
        height: `${cursorSize}px`,
      }}
    >
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full border transition-all duration-300"
        style={{
          borderColor: 'oklch(0.8 0.15 195)',
          borderWidth: cursor.scrollDirection !== 'idle' ? '2px' : '1px',
          opacity: cursor.isHovering ? 1 : 0.6,
        }}
      />
      
      {/* Inner dot */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-all duration-200"
        style={{
          width: '4px',
          height: '4px',
          opacity: cursor.scrollDirection === 'idle' ? 1 : 0,
        }}
      />

      {/* Scroll direction indicator */}
      {cursor.scrollDirection !== 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {cursor.scrollDirection === 'down' ? (
            <ChevronDown className="w-4 h-4 text-primary animate-pulse" />
          ) : (
            <ChevronUp className="w-4 h-4 text-primary animate-pulse" />
          )}
        </div>
      )}

      {/* Hover label */}
      {cursor.isHovering && cursor.scrollDirection === 'idle' && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-mono text-xs text-primary whitespace-nowrap">
          VIEW
        </div>
      )}
    </div>
  );
}
