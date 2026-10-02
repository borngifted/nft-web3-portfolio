/**
 * DESIGN PHILOSOPHY: Digital Noir - Cinematic Brutalism
 * Home page featuring the interactive artboard
 */

import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Artwork, ArtworkManifest } from '@/types/artwork';
import Artboard from '@/components/Artboard';
import ArtworkDetail from '@/components/ArtworkDetail';

import InstructionalOverlay from '@/components/InstructionalOverlay';
import ScrollReactiveCursor from '@/components/ScrollReactiveCursor';
import WalletConnect from '@/components/WalletConnect';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

const MANIFEST_URL = '/assets/manifest.json';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(() => true);
  const [error, setError] = useState<string | null>(() => null);

  // Load manifest
  useEffect(() => {
    async function loadManifest() {
      try {
        const response = await fetch(MANIFEST_URL);
        if (!response.ok) {
          throw new Error('Failed to load artwork manifest');
        }
        const data: ArtworkManifest = await response.json();
        setArtworks(data.artworks);
      } catch (err) {
        console.error('Error loading manifest:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        toast.error('Failed to load artworks');
      } finally {
        setLoading(false);
      }
    }

    loadManifest();
  }, []);

  // Handle ESC key to close detail view
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedArtwork) {
        setSelectedArtwork(null);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedArtwork]);

  // Handle Web3 actions
  const handleViewOnChain = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    // TODO: Open block explorer with contract address
    toast.info('Opening block explorer...');
  };

  const handleCollect = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    // TODO: Implement mint/collect functionality
    toast.info('Collect functionality - Contract integration pending');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-mono text-sm text-muted-foreground">LOADING COLLECTION</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-display text-2xl">ERROR</p>
          <p className="text-mono text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ cursor: 'none' }}>
      <ScrollReactiveCursor />
      <InstructionalOverlay />
      {/* Main artboard */}
      <Artboard
        artworks={artworks}
        onArtworkClick={setSelectedArtwork}
      />

      {/* Detail overlay */}
      {selectedArtwork && (
        <ArtworkDetail
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onViewOnChain={handleViewOnChain}
          onCollect={handleCollect}
        />
      )}

      {/* Header matching nicolaromei.com layout */}
      <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="bg-gradient-to-b from-black/90 via-black/70 to-transparent backdrop-blur-md pb-6 md:pb-8">
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4 md:gap-6">
              {/* Left side - Info columns */}
              <div className="flex gap-8 md:gap-14 lg:gap-20 text-[9px] md:text-[10px] leading-relaxed tracking-wide pointer-events-auto">
                <div className="space-y-1.5 md:space-y-2">
                  <p className="text-white/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-relaxed">DIGITAL / GLOBAL</p>
                  <p className="text-white/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-relaxed">SYSTEMS IN MOTION.</p>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <p className="text-white/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-relaxed mb-1">(DISCIPLINE)</p>
                  <p className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium leading-relaxed">CREATIVE TECHNOLOGIST</p>
                  <p className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium leading-relaxed">FILMMAKER</p>
                  <p className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium leading-relaxed">SYSTEMS DESIGNER</p>
                </div>
                <div className="space-y-1.5 md:space-y-2 hidden sm:block">
                  <p className="text-white/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-relaxed mb-1">(MEDIUM)</p>
                  <p className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium leading-relaxed">FILM + AI</p>
                  <p className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium leading-relaxed">MUSIC + SYSTEMS</p>
                  <p className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium leading-relaxed">CODE + CINEMA</p>
                </div>
              </div>
              
              {/* Center - Tagline (desktop only) */}
              <div className="hidden xl:block text-center text-[10px] leading-relaxed tracking-wide pointer-events-auto max-w-xl">
                <p className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium mb-2">
                  TYQAWN HEADEN OPERATES AT THE INTERSECTION OF FILM, MUSIC, AI, AND SYSTEMS DESIGN.
                </p>
                <p className="text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  THIS WORK EXPLORES HYPER-REALISTIC SURREALISM THROUGH CINEMATIC NARRATIVE AND PROCEDURAL INTELLIGENCE.
                </p>
              </div>
              
              {/* Right side - Navigation buttons */}
              <div className="flex flex-row lg:flex-col gap-2 pointer-events-auto flex-wrap">
                <Link href="/manifesto">
                  <button className="px-4 md:px-6 py-2 bg-white text-black text-[9px] md:text-[10px] font-bold tracking-wider hover:bg-white/90 transition-colors whitespace-nowrap shadow-lg">
                    MANIFESTO
                  </button>
                </Link>
                <Link href="/studio">
                  <button className="px-4 md:px-6 py-2 bg-white text-black text-[9px] md:text-[10px] font-bold tracking-wider hover:bg-white/90 transition-colors whitespace-nowrap shadow-lg">
                    STUDIO
                  </button>
                </Link>
                <Link href="/the-goodagains">
                  <button className="px-4 md:px-6 py-2 bg-cyan-500 text-white text-[9px] md:text-[10px] font-bold tracking-wider hover:bg-cyan-400 transition-colors whitespace-nowrap shadow-lg">
                    THE GOODAGAINS
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
