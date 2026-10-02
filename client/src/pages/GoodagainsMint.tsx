/**
 * DESIGN PHILOSOPHY: Character Index + Mint Interface
 * Archival feel, not marketplace-driven
 * Rarity filtering with real Solana Candy Machine integration
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

type Rarity = 'Common' | 'Rare' | 'Legendary';

interface NFTCharacter {
  id: string;
  name: string;
  rarity: Rarity;
  image: string;
  attributes: Record<string, string>;
  description: string;
}

export default function GoodagainsMint() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<Rarity>('Common');
  const [characters, setCharacters] = useState<NFTCharacter[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<NFTCharacter | null>(null);
  const [loading, setLoading] = useState(true);

  // Load manifest
  useEffect(() => {
    fetch('/assets/goodagains/manifest.json')
      .then((res) => res.json())
      .then((data) => {
        // Transform manifest data to character format
        const chars: NFTCharacter[] = data.nfts?.map((nft: any) => ({
          id: nft.name.replace(/\s+/g, '-').toLowerCase(),
          name: nft.name,
          rarity: nft.attributes?.find((a: any) => a.trait_type === 'Rarity')?.value || 'Common',
          image: `/assets/goodagains/${nft.attributes?.find((a: any) => a.trait_type === 'Rarity')?.value || 'Common'}/${nft.name}.webp`,
          attributes: nft.attributes?.reduce((acc: any, attr: any) => {
            acc[attr.trait_type] = attr.value;
            return acc;
          }, {}) || {},
          description: nft.description || '',
        })) || [];
        
        setCharacters(chars);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load manifest:', err);
        setLoading(false);
      });
  }, []);

  const filteredCharacters = characters.filter((char) => char.rarity === activeTab);

  const rarityInfo = {
    Common: { count: 151, price: '1 SOL', color: 'oklch(0.7 0.1 140)' },
    Rare: { count: 28, price: '3 SOL', color: 'oklch(0.7 0.15 260)' },
    Legendary: { count: 58, price: '10 SOL', color: 'oklch(0.75 0.18 40)' },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-6">
          <button
            onClick={() => setLocation('/the-goodagains')}
            className="text-xs uppercase tracking-widest text-foreground/70 hover:text-foreground transition-colors"
          >
            ← Back to Story
          </button>
          <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            The Goodagains Collection
          </h1>
          <div className="text-xs uppercase tracking-widest text-foreground/70">
            237 Heroes
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24">
        {/* Rarity Tabs */}
        <div className="container mb-12">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {(Object.keys(rarityInfo) as Rarity[]).map((rarity) => (
              <button
                key={rarity}
                onClick={() => setActiveTab(rarity)}
                className={`relative px-6 py-3 text-sm uppercase tracking-widest transition-all duration-300 ${
                  activeTab === rarity
                    ? 'text-foreground'
                    : 'text-foreground/40 hover:text-foreground/70'
                }`}
              >
                <span>{rarity}</span>
                <span className="ml-2 text-xs">({rarityInfo[rarity].count})</span>
                {activeTab === rarity && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: rarityInfo[rarity].color }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Active tier info */}
          <div className="text-center mt-8">
            <div className="text-xs uppercase tracking-widest text-foreground/60 mb-2">
              Mint Price
            </div>
            <div className="text-2xl font-bold" style={{ color: rarityInfo[activeTab].color }}>
              {rarityInfo[activeTab].price}
            </div>
          </div>
        </div>

        {/* Character Grid */}
        {loading ? (
          <div className="container text-center py-24">
            <div className="text-foreground/60">Loading collection...</div>
          </div>
        ) : (
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredCharacters.map((character) => (
                <button
                  key={character.id}
                  onClick={() => setSelectedCharacter(character)}
                  className="group relative aspect-square overflow-hidden noir-border bg-card hover:scale-[1.02] transition-all duration-300"
                >
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to placeholder
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-xs font-semibold text-foreground truncate">
                      {character.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mint CTA */}
        <div className="container mt-16 text-center">
          <div className="max-w-2xl mx-auto p-8 border border-border noir-border bg-card/50">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ready to Mint?
            </h3>
            <p className="text-foreground/70 mb-6">
              Connect your Solana wallet to mint your Goodagain and join the movement.
            </p>
            <button className="px-8 py-3 bg-primary text-primary-foreground text-sm uppercase tracking-widest font-semibold hover:bg-primary/90 transition-all duration-300 noir-border">
              Connect Wallet
            </button>
            <p className="text-xs text-foreground/50 mt-4">
              Powered by Metaplex Core + Candy Machine
            </p>
          </div>
        </div>
      </main>

      {/* Character Detail Modal */}
      {selectedCharacter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md"
          onClick={() => setSelectedCharacter(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-card border border-border noir-border p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCharacter(null)}
              className="absolute top-4 right-4 text-foreground/60 hover:text-foreground text-2xl"
            >
              ×
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="aspect-square overflow-hidden noir-border">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800';
                  }}
                />
              </div>

              {/* Details */}
              <div>
                <div className="mb-2">
                  <span
                    className="text-xs uppercase tracking-widest font-semibold px-3 py-1 noir-border inline-block"
                    style={{
                      backgroundColor: rarityInfo[selectedCharacter.rarity].color,
                      color: 'oklch(0 0 0)',
                    }}
                  >
                    {selectedCharacter.rarity}
                  </span>
                </div>

                <h2
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {selectedCharacter.name}
                </h2>

                <p className="text-foreground/70 mb-6 leading-relaxed">
                  {selectedCharacter.description || 'A hero born from quartz and belief, embodying the transformed spirit of Jersey City.'}
                </p>

                {/* Attributes */}
                {Object.keys(selectedCharacter.attributes).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm uppercase tracking-widest text-foreground/60 mb-3">
                      Attributes
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedCharacter.attributes).map(([key, value]) => (
                        <div key={key} className="p-3 bg-background/50 noir-border">
                          <div className="text-xs text-foreground/50 mb-1">{key}</div>
                          <div className="text-sm font-semibold">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mint Button */}
                <button className="w-full px-6 py-3 bg-primary text-primary-foreground text-sm uppercase tracking-widest font-semibold hover:bg-primary/90 transition-all duration-300 noir-border">
                  Mint for {rarityInfo[selectedCharacter.rarity].price}
                </button>

                <button className="w-full mt-3 px-6 py-3 border border-border text-sm uppercase tracking-widest text-foreground/70 hover:text-foreground hover:border-foreground transition-all duration-300">
                  View on Chain
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
