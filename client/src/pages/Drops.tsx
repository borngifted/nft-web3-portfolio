/**
 * DESIGN PHILOSOPHY: Digital Noir - Cinematic Brutalism
 * Drops page listing current, upcoming, and archived NFT drops
 */

import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Artwork, ArtworkManifest } from '@/types/artwork';
import { toast } from 'sonner';

const MANIFEST_URL = '/assets/manifest.json';

interface Drop {
  id: string;
  title: string;
  description: string;
  status: 'current' | 'upcoming' | 'archived';
  date: string;
  artworks: Artwork[];
}

export default function Drops() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(() => true);

  useEffect(() => {
    async function loadDrops() {
      try {
        const response = await fetch(MANIFEST_URL);
        const data: ArtworkManifest = await response.json();
        
        // Group artworks into drops (example: by number ranges)
        const generatedDrops: Drop[] = [
          {
            id: 'genesis',
            title: 'GENESIS COLLECTION',
            description: 'The inaugural drop featuring the first 100 artworks from the Digital Noir collection.',
            status: 'current',
            date: '2026-02-01',
            artworks: data.artworks.filter(a => a.number <= 100),
          },
          {
            id: 'noir-series',
            title: 'NOIR SERIES II',
            description: 'Continuation of the Digital Noir aesthetic with enhanced contrast and complexity.',
            status: 'current',
            date: '2026-02-15',
            artworks: data.artworks.filter(a => a.number > 100 && a.number <= 200),
          },
          {
            id: 'future-drop',
            title: 'CHROMATIC SHIFT',
            description: 'Breaking from monochrome - a new direction exploring color within the noir framework.',
            status: 'upcoming',
            date: '2026-03-01',
            artworks: [],
          },
        ];
        
        setDrops(generatedDrops);
      } catch (err) {
        console.error('Error loading drops:', err);
        toast.error('Failed to load drops');
      } finally {
        setLoading(false);
      }
    }

    loadDrops();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-mono text-sm text-muted-foreground">LOADING DROPS</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-display text-2xl hover:text-primary transition-colors">
                DIGITAL NOIR
              </Link>
            </div>
            <nav className="flex gap-6">
              <Link href="/" className="text-mono text-xs hover:text-primary transition-colors">
                ARTBOARD
              </Link>
              <Link href="/about" className="text-mono text-xs hover:text-primary transition-colors">
                ABOUT
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-16">
        <div className="mb-16">
          <h1 className="text-display text-6xl mb-4">DROPS</h1>
          <p className="text-muted-foreground max-w-2xl">
            Curated releases from the Digital Noir collection. Each drop represents a distinct chapter
            in the ongoing exploration of monochrome digital aesthetics.
          </p>
        </div>

        {/* Current drops */}
        <section className="mb-24">
          <h2 className="text-display text-3xl mb-8">CURRENT</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {drops
              .filter(d => d.status === 'current')
              .map(drop => (
                <DropCard key={drop.id} drop={drop} />
              ))}
          </div>
        </section>

        {/* Upcoming drops */}
        <section className="mb-24">
          <h2 className="text-display text-3xl mb-8">UPCOMING</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {drops
              .filter(d => d.status === 'upcoming')
              .map(drop => (
                <DropCard key={drop.id} drop={drop} />
              ))}
          </div>
        </section>

        {/* Archived drops */}
        {drops.filter(d => d.status === 'archived').length > 0 && (
          <section>
            <h2 className="text-display text-3xl mb-8">ARCHIVED</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {drops
                .filter(d => d.status === 'archived')
                .map(drop => (
                  <DropCard key={drop.id} drop={drop} />
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function DropCard({ drop }: { drop: Drop }) {
  return (
    <div className="noir-border p-8 group hover:noir-glow transition-all duration-300 scanline">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-display text-2xl mb-2">{drop.title}</h3>
          <p className="text-mono text-xs text-muted-foreground">
            {new Date(drop.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <span
          className={`text-mono text-xs px-2 py-1 noir-border ${
            drop.status === 'current' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {drop.status.toUpperCase()}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-6">{drop.description}</p>

      {drop.artworks.length > 0 && (
        <>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {drop.artworks.slice(0, 4).map(artwork => (
              <div key={artwork.id} className="aspect-square noir-border overflow-hidden">
                <img
                  src={artwork.thumbnail}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-mono text-xs text-muted-foreground">
              {drop.artworks.length} ARTWORKS
            </p>
            <Link href="/" className="text-mono text-xs text-primary hover:underline">
              VIEW COLLECTION →
            </Link>
          </div>
        </>
      )}

      {drop.status === 'upcoming' && (
        <p className="text-mono text-xs text-muted-foreground">
          Details coming soon
        </p>
      )}
    </div>
  );
}
