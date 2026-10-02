/**
 * CHARACTER CARD
 * Pokemon-style card that displays NFT character info with real metadata
 */

import { X, MapPin, Users, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface CharacterCardProps {
  character: {
    id: string;
    name: string;
    image: string;
    tier: 'Common' | 'Rare' | 'Legendary';
    edition: string;
    backstory?: string;
    powers?: string[];
    faction?: string;
    rarityScore?: number;
    originCity?: string;
    stats?: {
      strength: number;
      speed: number;
      intelligence: number;
      resilience: number;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

const tierColors = {
  Common: 'from-gray-600 to-gray-800',
  Rare: 'from-blue-600 to-purple-600',
  Legendary: 'from-yellow-500 to-orange-600',
};

const tierBorders = {
  Common: 'border-gray-500',
  Rare: 'border-blue-400',
  Legendary: 'border-yellow-400',
};

const tierGlow = {
  Common: 'shadow-gray-500/50',
  Rare: 'shadow-blue-400/50',
  Legendary: 'shadow-yellow-400/50',
};

export default function CharacterCard({ character, isOpen, onClose }: CharacterCardProps) {
  const stats = character.stats || {
    strength: Math.floor(Math.random() * 100) + 1,
    speed: Math.floor(Math.random() * 100) + 1,
    intelligence: Math.floor(Math.random() * 100) + 1,
    resilience: Math.floor(Math.random() * 100) + 1,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm md:max-w-md p-0 bg-transparent border-none overflow-hidden">
        <DialogTitle className="sr-only">{character.name} - {character.tier} Character Card</DialogTitle>
        {/* Pokemon-style card */}
        <div className={`relative bg-gradient-to-br ${tierColors[character.tier]} rounded-2xl border-4 ${tierBorders[character.tier]} shadow-2xl ${tierGlow[character.tier]} overflow-hidden`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Tier badge */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/70 rounded-full backdrop-blur-sm">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              character.tier === 'Legendary' ? 'text-yellow-400' :
              character.tier === 'Rare' ? 'text-blue-400' :
              'text-gray-400'
            }`}>
              {character.tier}
            </span>
          </div>

          {/* Rarity score badge */}
          {character.rarityScore && (
            <div className="absolute top-4 right-20 z-10 px-3 py-1 bg-black/70 rounded-full backdrop-blur-sm flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400">{character.rarityScore}/10</span>
            </div>
          )}

          {/* Character image */}
          <div className="relative aspect-square bg-black/20 p-4 md:p-6">
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          {/* Card info section */}
          <div className="bg-white p-4 md:p-6 space-y-3 md:space-y-4 max-h-[50vh] overflow-y-auto">
            {/* Name and edition */}
            <div className="text-center border-b-2 border-gray-200 pb-2 md:pb-3">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{character.name}</h2>
              <p className="text-sm text-gray-600 uppercase tracking-wide">{character.edition}</p>
            </div>

            {/* Faction and Origin */}
            <div className="grid grid-cols-2 gap-3">
              {character.faction && (
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Faction</p>
                    <p className="text-xs font-semibold text-gray-900 leading-tight">{character.faction}</p>
                  </div>
                </div>
              )}
              
              {character.originCity && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Origin</p>
                    <p className="text-xs font-semibold text-gray-900 leading-tight">{character.originCity}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Backstory */}
            {character.backstory && (
              <div className="text-xs md:text-sm text-gray-700 leading-relaxed bg-gray-50 p-2 md:p-3 rounded-lg">
                <p className="italic line-clamp-3">"{character.backstory}"</p>
              </div>
            )}

            {/* Powers */}
            {character.powers && character.powers.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Powers</h3>
                <div className="flex flex-wrap gap-2">
                  {character.powers.map((power, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold rounded-full"
                    >
                      {power}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Stats</h3>
              <div className="space-y-2">
                {Object.entries(stats).map(([stat, value]) => (
                  <div key={stat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-gray-700 capitalize">{stat}</span>
                      <span className="font-bold text-gray-900">{value}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t-2 border-gray-200 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                The Goodagains Collection
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Created by BornGifted (Tyqawn Headen)
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
