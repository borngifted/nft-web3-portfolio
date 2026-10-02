/**
 * DESIGN PHILOSOPHY: Digital Noir - Cinematic Brutalism
 * Full-screen artwork detail overlay with metadata and Web3 actions
 */

import { X } from 'lucide-react';
import { Artwork } from '@/types/artwork';
import { Button } from './ui/button';

interface ArtworkDetailProps {
  artwork: Artwork;
  onClose: () => void;
  onViewOnChain?: () => void;
  onCollect?: () => void;
}

export default function ArtworkDetail({
  artwork,
  onClose,
  onViewOnChain,
  onCollect,
}: ArtworkDetailProps) {
  return (
    <div 
      className="fixed inset-0 z-50 bg-background/95"
      style={{ backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <div className="h-full flex flex-col lg:flex-row" onClick={(e) => e.stopPropagation()}>
        {/* Image section */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="relative max-w-4xl w-full">
            <picture>
              <source
                type="image/avif"
                srcSet={`
                  ${artwork.srcset.avif['640']} 640w,
                  ${artwork.srcset.avif['960']} 960w,
                  ${artwork.srcset.avif['1280']} 1280w,
                  ${artwork.srcset.avif['1920']} 1920w
                `}
                sizes="(max-width: 1280px) 90vw, 1280px"
              />
              <source
                type="image/webp"
                srcSet={`
                  ${artwork.srcset.webp['640']} 640w,
                  ${artwork.srcset.webp['960']} 960w,
                  ${artwork.srcset.webp['1280']} 1280w,
                  ${artwork.srcset.webp['1920']} 1920w
                `}
                sizes="(max-width: 1280px) 90vw, 1280px"
              />
              <img
                src={artwork.srcset.webp['1280']}
                alt={artwork.title}
                className="w-full h-auto noir-border"
              />
            </picture>
          </div>
        </div>

        {/* Metadata sidebar */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border p-8 overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-2 hover:bg-muted transition-colors light-leak"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Title */}
          <h1 className="text-display text-4xl mb-4">{artwork.title}</h1>

          {/* Metadata grid */}
          <div className="space-y-6 mb-8">
            <div>
              <p className="text-mono text-xs text-muted-foreground mb-1">EDITION</p>
              <p className="text-sm">{artwork.edition}</p>
            </div>

            <div>
              <p className="text-mono text-xs text-muted-foreground mb-1">YEAR</p>
              <p className="text-sm">{artwork.year}</p>
            </div>

            <div>
              <p className="text-mono text-xs text-muted-foreground mb-1">STATUS</p>
              <p className="text-sm capitalize">{artwork.status}</p>
            </div>

            <div>
              <p className="text-mono text-xs text-muted-foreground mb-1">DIMENSIONS</p>
              <p className="text-sm">
                {artwork.dimensions.width} × {artwork.dimensions.height}
              </p>
            </div>

            {artwork.tags && artwork.tags.length > 0 && (
              <div>
                <p className="text-mono text-xs text-muted-foreground mb-2">TAGS</p>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-mono text-xs px-2 py-1 noir-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {onViewOnChain && (
              <Button
                onClick={onViewOnChain}
                variant="outline"
                className="w-full scanline"
              >
                <span className="text-mono text-xs">VIEW ON CHAIN</span>
              </Button>
            )}

            {onCollect && artwork.status === 'available' && (
              <Button
                onClick={onCollect}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 scanline"
              >
                <span className="text-mono text-xs">COLLECT</span>
              </Button>
            )}
          </div>

          {/* Back to board hint */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-mono text-xs text-muted-foreground">
              Press ESC or click outside to return to artboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
