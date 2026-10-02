/**
 * DESIGN PHILOSOPHY: Digital Noir - Cinematic Brutalism
 * Individual artwork card with light leak hover effects and scanline animation
 */

import { useState } from 'react';
import { Artwork } from '@/types/artwork';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: () => void;
}

export default function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      className="relative group cursor-pointer scanline"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        width: '320px',
        height: '320px',
      }}
    >
      {/* Image container */}
      <div className="relative w-full h-full overflow-hidden noir-border">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Artwork image */}
        <picture>
          <source
            type="image/avif"
            srcSet={`${artwork.srcset.avif['320']} 320w, ${artwork.srcset.avif['640']} 640w`}
            sizes="320px"
          />
          <source
            type="image/webp"
            srcSet={`${artwork.srcset.webp['320']} 320w, ${artwork.srcset.webp['640']} 640w`}
            sizes="320px"
          />
          <img
            src={artwork.thumbnail}
            alt={artwork.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
            onLoad={() => setImageLoaded(true)}
          />
        </picture>

        {/* Light leak glow on hover */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-150"
            style={{
              background: 'radial-gradient(circle at 50% 50%, oklch(0.8 0.15 195 / 0.2) 0%, transparent 70%)',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Hover info overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
          }}
        >
          <p className="text-display text-2xl mb-2">{artwork.title}</p>
          <p className="text-mono text-xs text-muted-foreground">
            {artwork.year} · {artwork.edition}
          </p>
          <p className="text-mono text-xs text-primary mt-4">VIEW</p>
        </div>
      </div>

      {/* Metadata label (always visible) */}
      <div className="absolute -bottom-6 left-0 text-mono text-xs text-muted-foreground">
        #{artwork.number.toString().padStart(3, '0')}
      </div>
    </div>
  );
}
