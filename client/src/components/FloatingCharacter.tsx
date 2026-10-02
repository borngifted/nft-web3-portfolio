/**
 * FLOATING CHARACTER
 * Randomly spawned clickable NFT character during scroll
 */

import { useState, useEffect } from 'react';

interface FloatingCharacterProps {
  character: {
    id: string;
    name: string;
    image: string;
    tier: 'Common' | 'Rare' | 'Legendary';
  };
  position: { x: number; y: number };
  onCatch: () => void;
  scrollProgress: number;
  spawnRange: [number, number]; // [start%, end%]
}

export default function FloatingCharacter({
  character,
  position,
  onCatch,
  scrollProgress,
  spawnRange,
}: FloatingCharacterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show/hide based on scroll progress
  useEffect(() => {
    const [start, end] = spawnRange;
    const visible = scrollProgress >= start && scrollProgress <= end;
    setIsVisible(visible);
  }, [scrollProgress, spawnRange]);

  if (!isVisible) return null;

  const tierGlow = {
    Common: 'shadow-[0_0_20px_rgba(156,163,175,0.6)]',
    Rare: 'shadow-[0_0_30px_rgba(59,130,246,0.8)]',
    Legendary: 'shadow-[0_0_40px_rgba(251,191,36,1)]',
  };

  return (
    <button
      onClick={onCatch}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed z-40 cursor-pointer transition-all duration-300 ${
        isHovered ? 'scale-125' : 'scale-100'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animation: 'float 3s ease-in-out infinite',
      }}
    >
      {/* Character image */}
      <div className={`relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg bg-black/30 backdrop-blur-sm border-2 ${
        character.tier === 'Legendary' ? 'border-yellow-400' :
        character.tier === 'Rare' ? 'border-blue-400' :
        'border-gray-400'
      } ${tierGlow[character.tier]} overflow-hidden`}>
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover rounded-lg"
        />
        
        {/* Pulse ring */}
        <div className={`absolute inset-0 rounded-lg border-2 ${
          character.tier === 'Legendary' ? 'border-yellow-400' :
          character.tier === 'Rare' ? 'border-blue-400' :
          'border-gray-400'
        }`} style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
      </div>

      {/* Hover label */}
      {isHovered && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-black/90 text-white text-xs font-bold rounded-full">
          Click to catch!
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </button>
  );
}
