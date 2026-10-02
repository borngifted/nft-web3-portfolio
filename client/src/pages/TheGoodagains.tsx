/**
 * THE GOODAGAINS - Continuous Loop Edition
 * Igloo.inc-style scroll-driven video + Pokemon-style character catching
 * 
 * NEW: Continuous infinite scroll loop with random NFT swapping
 * - Videos loop back to start at 95% scroll
 * - NFTs spawn randomly based on rarity tiers
 * - Updated images from new manifest
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import ScrollVideoHero from '@/components/ScrollVideoHero';
import FloatingCharacter from '@/components/FloatingCharacter';
import CharacterCard from '@/components/CharacterCard';
import AudioController from '@/components/AudioController';

interface Character {
  id: string;
  name: string;
  image: string;
  rarity: string;
  tier: string;
  edition: number;
  faction: string;
  origin: string;
  rarityScore: number;
}

interface FloatingChar {
  id: string;
  character: Character;
  position: { x: number; y: number };
  spawnRange: [number, number];
}

export default function TheGoodagains() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [caughtCharacters, setCaughtCharacters] = useState<Set<string>>(new Set());
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [floatingChars, setFloatingChars] = useState<FloatingChar[]>([]);
  const [loading, setLoading] = useState(true);
  
  const lastSpawnScroll = useRef(0);
  const spawnInterval = 5; // Spawn every 5% scroll

  // Load NEW manifest
  useEffect(() => {
    fetch('/assets/goodagains-new/manifest.json')
      .then(res => res.json())
      .then((data) => {
        setAllCharacters(data.characters || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load manifest:', err);
        setLoading(false);
      });
  }, []);

  // Track scroll progress with CONTINUOUS LOOP
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
      
      // LOOP: Reset scroll when reaching end (98% to catch near-bottom)
      if (progress >= 98) {
        // Smooth fade transition before loop
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setScrollProgress(0);
          lastSpawnScroll.current = 0;
          // Clear floating characters on loop
          setFloatingChars([]);
        }, 300);
      } else {
        setScrollProgress(progress);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // RANDOM NFT SPAWNING during scroll
  useEffect(() => {
    if (allCharacters.length === 0) return;

    // Spawn new characters at intervals
    if (scrollProgress - lastSpawnScroll.current > spawnInterval) {
      lastSpawnScroll.current = scrollProgress;
      
      // Remove old floating characters (keep last 12)
      setFloatingChars((prev) => {
        const newChars = [...prev];
        if (newChars.length > 12) {
          newChars.splice(0, newChars.length - 12);
        }
        return newChars;
      });

      // Spawn 2-4 new random characters
      const spawnCount = Math.floor(Math.random() * 3) + 2;
      const newFloatingChars: FloatingChar[] = [];

      for (let i = 0; i < spawnCount; i++) {
        // Rarity-based spawn rates: Common 75%, Rare 20%, Legendary 5%
        const rand = Math.random();
        let tierFilter: string;
        if (rand < 0.75) {
          tierFilter = 'common';
        } else if (rand < 0.95) {
          tierFilter = 'rare';
        } else {
          tierFilter = 'legendary';
        }

        const tierChars = allCharacters.filter((c) => c.tier === tierFilter);
        if (tierChars.length === 0) continue;

        const randomChar = tierChars[Math.floor(Math.random() * tierChars.length)];

        // Spawn on sides only: left (5-20%) or right (80-95%)
        const isLeftSide = Math.random() < 0.5;
        const xPosition = isLeftSide 
          ? Math.random() * 15 + 5   // Left side: 5-20%
          : Math.random() * 15 + 80; // Right side: 80-95%
        
        newFloatingChars.push({
          id: `${randomChar.id}-${Date.now()}-${i}`,
          character: randomChar,
          position: {
            x: xPosition,
            y: Math.random() * 60 + 20, // 20-80% from top
          },
          spawnRange: [scrollProgress, scrollProgress + 15], // Visible for 15% scroll range
        });
      }

      setFloatingChars((prev) => [...prev, ...newFloatingChars]);
    }
  }, [scrollProgress, allCharacters]);

  const handleCatchCharacter = (character: Character) => {
    // Enrich character with backstory
    const enrichedCharacter = {
      ...character,
      backstory: `${character.name} was an ordinary Jersey City resident until the Quartz event transformed them into a hero. Now part of ${character.faction}, they fight to protect the city.`,
      powers: [
        'Quartz Energy Manipulation',
        'Enhanced Abilities',
        character.faction.includes('Empathic') ? 'Emotional Connection' :
        character.faction.includes('Justice') ? 'Fairness Detection' :
        character.faction.includes('Valor') ? 'Courage Amplification' : 'Heroic Strength'
      ],
      originCity: character.origin,
    };
    
    setSelectedCharacter(enrichedCharacter);
    setCaughtCharacters(prev => new Set(Array.from(prev).concat(character.id)));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading The Goodagains...</div>
      </div>
    );
  }

  return (
    <div className="relative bg-black">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-sm pb-6">
          <div className="flex items-center justify-between p-4 md:p-6">
            <Link href="/">
              <button className="pointer-events-auto px-4 py-2 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white text-xs uppercase tracking-widest transition-colors rounded-lg border border-white/20">
                ← Back
              </button>
            </Link>

            <div className="pointer-events-auto text-white text-xs md:text-sm uppercase tracking-widest font-bold">
              The Goodagains
            </div>

            <div className="flex items-center gap-4">
              <div className="pointer-events-auto px-3 py-2 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs font-bold border border-cyan-500/30">
                {caughtCharacters.size}/{allCharacters.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Scroll progress indicator */}
      <div className="fixed bottom-6 right-6 z-50 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/30 pointer-events-none">
        <div className="text-cyan-400 text-sm font-mono">
          {Math.round(scrollProgress)}%
        </div>
      </div>

      {/* Floating characters */}
      {floatingChars.map((fc) => (
        <FloatingCharacter
          key={fc.id}
          character={{
            ...fc.character,
            tier: fc.character.rarity as 'Common' | 'Rare' | 'Legendary'
          }}
          position={fc.position}
          scrollProgress={scrollProgress}
          spawnRange={fc.spawnRange}
          onCatch={() => handleCatchCharacter(fc.character)}
        />
      ))}

      {/* Character card modal */}
      {selectedCharacter && (
        <CharacterCard
          character={selectedCharacter}
          isOpen={!!selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}

      {/* Scroll-driven video hero */}
      <ScrollVideoHero />

      {/* Caught characters showcase (bottom left) */}
      {caughtCharacters.size > 0 && (
        <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Caught</div>
            <div className="text-xs text-white/70">{caughtCharacters.size}/237</div>
          </div>
          <div className="flex gap-2 max-w-xs overflow-x-auto">
            {Array.from(caughtCharacters)
              .slice(-5)
              .map((id) => {
                const char = allCharacters.find((c) => c.id === id);
                if (!char) return null;
                return (
                  <button
                    key={id}
                    onClick={() => handleCatchCharacter(char)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 border-cyan-500/50 hover:border-cyan-400 transition-all hover:scale-110 flex-shrink-0"
                  >
                    <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="relative z-10 min-h-screen flex items-center justify-center bg-gradient-to-b from-transparent via-black to-black">
        <div className="text-center space-y-8 px-6">
          <h2 className="text-white text-4xl md:text-6xl font-light tracking-wide">
            Join the Movement
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            237 ordinary people became extraordinary heroes. Mint your Goodagain and become part of the story.
          </p>

          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-white text-3xl font-bold mb-2">237</div>
              <div className="text-white/50 text-xs uppercase tracking-wider">Heroes</div>
            </div>
            <div className="text-center">
              <div className="text-white text-3xl font-bold mb-2">3</div>
              <div className="text-white/50 text-xs uppercase tracking-wider">Tiers</div>
            </div>
            <div className="text-center">
              <div className="text-white text-3xl font-bold mb-2">Solana</div>
              <div className="text-white/50 text-xs uppercase tracking-wider">Blockchain</div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Controller */}
      <AudioController scrollProgress={scrollProgress / 100} />
    </div>
  );
}
