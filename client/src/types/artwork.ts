/**
 * DESIGN PHILOSOPHY: Digital Noir - Cinematic Brutalism
 * Type definitions for NFT artwork data
 */

export interface ArtworkSrcSet {
  webp: {
    [size: string]: string;
  };
  avif: {
    [size: string]: string;
  };
}

export interface ArtworkDimensions {
  width: number;
  height: number;
}

export interface Artwork {
  id: string;
  title: string;
  number: number;
  original_filename: string;
  thumbnail: string;
  srcset: ArtworkSrcSet;
  dimensions: ArtworkDimensions;
  year: number;
  edition: string;
  tags: string[];
  status: 'available' | 'sold' | 'reserved';
}

export interface ArtworkManifest {
  version: string;
  generated: string;
  total_artworks: number;
  artworks: Artwork[];
}

export interface ArtboardPosition {
  x: number;
  y: number;
  scale: number;
}

export interface ArtboardBounds {
  minScale: number;
  maxScale: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
