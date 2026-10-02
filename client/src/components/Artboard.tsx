/**
 * DESIGN PHILOSOPHY: Infinite Continuous Grid
 * Seamless grid that wraps in all directions
 * Scroll moves the viewport, grid tiles repeat infinitely
 */

import { useState, useEffect, useRef } from 'react';
import { Artwork } from '@/types/artwork';

interface ArtboardProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
}

export default function Artboard({ artworks, onArtworkClick }: ArtboardProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(() => null);
  const [offset, setOffset] = useState(() => ({ x: 0, y: 0 }));
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Grid configuration - responsive
  const [cellSize, setCellSize] = useState(250);
  const [cols, setCols] = useState(4);
  
  useEffect(() => {
    const updateGridSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile
        setCellSize(150);
        setCols(2);
      } else if (width < 1024) {
        // Tablet
        setCellSize(200);
        setCols(3);
      } else {
        // Desktop
        setCellSize(250);
        setCols(4);
      }
    };
    
    updateGridSize();
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, []);
  
  const CELL_SIZE = cellSize;
  const COLS = cols;
  const ROWS = Math.ceil(artworks.length / COLS);
  const GRID_WIDTH = COLS * CELL_SIZE;
  const GRID_HEIGHT = ROWS * CELL_SIZE;

  // Size pattern for masonry effect
  const sizePattern = [
    { cols: 1, rows: 1 }, // Small square
    { cols: 2, rows: 1 }, // Wide rectangle
    { cols: 1, rows: 2 }, // Tall rectangle
    { cols: 1, rows: 1 }, // Small square
    { cols: 2, rows: 2 }, // Large square
    { cols: 1, rows: 1 }, // Small square
    { cols: 2, rows: 1 }, // Wide rectangle
    { cols: 1, rows: 1 }, // Small square
  ];

  const getGridPosition = (index: number) => {
    return sizePattern[index % sizePattern.length];
  };

  // Mouse drag to pan
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;

      setOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Scroll to move viewport
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      setOffset((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Shuffle array based on seed for consistent but varied tile layouts
  const shuffleArray = <T,>(array: T[], seed: number): T[] => {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    let randomValue;
    
    // Seeded random function
    const seededRandom = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };
    
    while (currentIndex !== 0) {
      randomValue = Math.floor(seededRandom(seed + currentIndex) * currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomValue]] = [shuffled[randomValue], shuffled[currentIndex]];
    }
    
    return shuffled;
  };
  
  // Render grid tiles with wrapping
  // Calculate how many tiles needed to cover viewport + buffer
  const renderGridTiles = () => {
    const tiles = [];
    
    // Get viewport dimensions
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    
    // Calculate which tile we're currently viewing
    const currentTileX = Math.floor(-offset.x / GRID_WIDTH);
    const currentTileY = Math.floor(-offset.y / GRID_HEIGHT);

    // Calculate how many tiles needed to cover viewport (with 1 tile buffer on each side)
    const tilesNeededX = Math.ceil(viewportWidth / GRID_WIDTH) + 2;
    const tilesNeededY = Math.ceil(viewportHeight / GRID_HEIGHT) + 2;
    
    const startTileX = -Math.floor(tilesNeededX / 2);
    const endTileX = Math.ceil(tilesNeededX / 2);
    const startTileY = -Math.floor(tilesNeededY / 2);
    const endTileY = Math.ceil(tilesNeededY / 2);

    // Render enough tiles to cover viewport in all directions
    for (let tileY = startTileY; tileY <= endTileY; tileY++) {
      for (let tileX = startTileX; tileX <= endTileX; tileX++) {
        const tileOffsetX = (currentTileX + tileX) * GRID_WIDTH + offset.x;
        const tileOffsetY = (currentTileY + tileY) * GRID_HEIGHT + offset.y;

        tiles.push(
          <div
            key={`tile-${tileX}-${tileY}`}
            className="absolute grid grid-cols-4 gap-0 auto-rows-[250px]"
            style={{
              transform: `translate(${tileOffsetX}px, ${tileOffsetY}px)`,
              width: `${GRID_WIDTH}px`,
              height: `${GRID_HEIGHT}px`,
            }}
          >
            {shuffleArray(artworks, tileX * 1000 + tileY).map((artwork, index) => {
              const { cols, rows } = getGridPosition(index);
              
              return (
                <div
                  key={`${tileX}-${tileY}-${artwork.id}`}
                  data-artwork-card
                  data-artwork-id={artwork.id}
                  className="relative cursor-pointer overflow-hidden noir-border transition-all duration-300"
                  style={{
                    gridColumn: `span ${cols}`,
                    gridRow: `span ${rows}`,
                  }}
                  onMouseEnter={() => setHoveredId(artwork.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onArtworkClick(artwork);
                  }}
                >
                  {/* Image */}
                  <picture>
                    <source
                      type="image/avif"
                      srcSet={`${artwork.srcset.avif['320']} 320w, ${artwork.srcset.avif['640']} 640w`}
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <source
                      type="image/webp"
                      srcSet={`${artwork.srcset.webp['320']} 320w, ${artwork.srcset.webp['640']} 640w`}
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <img
                      src={artwork.thumbnail}
                      alt={artwork.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-all duration-500"
                      draggable={false}
                      style={{
                        filter: hoveredId === artwork.id ? 'brightness(1.1)' : 'brightness(1)',
                      }}
                    />
                  </picture>

                  {/* Hover overlay */}
                  {hoveredId === artwork.id && (
                    <>
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center transition-opacity duration-300">
                        <p className="text-mono text-xs text-primary">SCROLL OR CLICK</p>
                      </div>
                      
                      {/* Subtle glow */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle at center, oklch(0.8 0.15 195 / 0.15) 0%, transparent 70%)',
                          mixBlendMode: 'screen',
                        }}
                      />
                    </>
                  )}

                  {/* Artifact number */}
                  <div className="absolute top-2 left-2 text-mono text-xs text-muted-foreground bg-background/60 px-2 py-1 opacity-0 hover:opacity-100 transition-opacity">
                    #{artwork.number.toString().padStart(3, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
    }

    return tiles;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden bg-background"
      style={{
        cursor: isDragging.current ? 'grabbing' : 'grab',
      }}
    >
      {/* Infinite grid container */}
      <div className="absolute inset-0">
        {renderGridTiles()}
      </div>
    </div>
  );
}
