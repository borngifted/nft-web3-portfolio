import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Noir Collection manifest.json', () => {
  const manifestPath = path.resolve(__dirname, '../../public/assets/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  it('should have 323 artworks', () => {
    expect(manifest.artworks).toHaveLength(323);
  });

  it('should have all thumbnails pointing to CDN URLs', () => {
    for (const artwork of manifest.artworks) {
      expect(artwork.thumbnail).toMatch(/^\/media\//);
    }
  });

  it('should have all webp srcset entries pointing to CDN URLs', () => {
    for (const artwork of manifest.artworks) {
      for (const [size, url] of Object.entries(artwork.srcset.webp)) {
        expect(url).toMatch(/^\/media\//);
      }
    }
  });

  it('should have all avif srcset entries pointing to CDN URLs', () => {
    for (const artwork of manifest.artworks) {
      for (const [size, url] of Object.entries(artwork.srcset.avif)) {
        expect(url).toMatch(/^\/media\//);
      }
    }
  });

  it('should have no local /assets/ paths remaining', () => {
    const json = JSON.stringify(manifest);
    expect(json).not.toContain('/assets/optimized/');
  });

  it('should have 5 webp sizes and 5 avif sizes per artwork', () => {
    for (const artwork of manifest.artworks) {
      expect(Object.keys(artwork.srcset.webp)).toHaveLength(5);
      expect(Object.keys(artwork.srcset.avif)).toHaveLength(5);
    }
  });
});

describe('Goodagains manifest.json', () => {
  const manifestPath = path.resolve(__dirname, '../../public/assets/goodagains-new/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  it('should have 237 characters', () => {
    expect(manifest.characters).toHaveLength(237);
  });

  it('should have all character images pointing to CDN URLs', () => {
    for (const char of manifest.characters) {
      expect(char.image).toMatch(/^\/media\//);
    }
  });

  it('should have no local /assets/ paths remaining', () => {
    const json = JSON.stringify(manifest);
    expect(json).not.toContain('/assets/goodagains-new/common/');
    expect(json).not.toContain('/assets/goodagains-new/rare/');
    expect(json).not.toContain('/assets/goodagains-new/legendary/');
  });
});
