/**
 * SMOOTH SCROLL
 * Enables smooth scroll behavior for navigation links
 */

import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function SmoothScroll() {
  const [location] = useLocation();

  useEffect(() => {
    // Smooth scroll to top on route change
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location]);

  return null;
}
