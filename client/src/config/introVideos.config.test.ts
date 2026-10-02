import { describe, it, expect } from 'vitest';
import { introVideosConfig } from './introVideos.config';

describe('introVideosConfig', () => {
  it('should have exactly 14 videos (7 scenes x 2)', () => {
    expect(introVideosConfig.videos).toHaveLength(14);
  });

  it('should have correct video order: Scene-N then Scene_N-end', () => {
    const expectedOrder = [
      'Scene-1', 'Scene_1-end',
      'Scene-2', 'Scene_2-end',
      'Scene-3', 'Scene_3-end',
      'Scene-4', 'Scene_4-end',
      'Scene-5', 'Scene_5-end',
      'Scene-6', 'Scene_6-end',
      'Scene-7', 'Scene_7-end',
    ];

    introVideosConfig.videos.forEach((video, index) => {
      expect(video.name).toBe(expectedOrder[index]);
    });
  });

  it('should have valid CDN URLs for all videos', () => {
    introVideosConfig.videos.forEach((video) => {
      expect(video.src).toMatch(/^\/media\//);
      expect(video.src).toMatch(/\.mp4$/);
    });
  });

  it('should have positive scrollLengthMultiplier for all videos', () => {
    introVideosConfig.videos.forEach((video) => {
      expect(video.scrollLengthMultiplier).toBeGreaterThan(0);
    });
  });

  it('should use crossfade transition mode', () => {
    expect(introVideosConfig.transitionMode).toBe('crossfade');
  });

  it('should have a positive crossfade duration', () => {
    expect(introVideosConfig.crossfadeDuration).toBeGreaterThan(0);
    expect(introVideosConfig.crossfadeDuration).toBeLessThanOrEqual(2);
  });

  it('should have narrative time markers', () => {
    expect(introVideosConfig.timeMarkers.length).toBeGreaterThan(0);
  });

  it('should have valid time markers with correct video indices and time ranges', () => {
    introVideosConfig.timeMarkers.forEach((marker) => {
      expect(marker.videoIndex).toBeGreaterThanOrEqual(0);
      expect(marker.videoIndex).toBeLessThan(introVideosConfig.videos.length);
      expect(marker.timeStart).toBeGreaterThanOrEqual(0);
      expect(marker.timeEnd).toBeGreaterThan(marker.timeStart);
      expect(marker.text.trim()).toBeTruthy();
    });
  });

  it('should have time markers with valid positions', () => {
    const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];
    introVideosConfig.timeMarkers.forEach((marker) => {
      if (marker.position) {
        expect(validPositions).toContain(marker.position);
      }
    });
  });

  it('should have narrative markers covering all 7 scene pairs', () => {
    const coveredPairs = new Set<number>();
    introVideosConfig.timeMarkers.forEach((marker) => {
      coveredPairs.add(Math.floor(marker.videoIndex / 2));
    });
    expect(coveredPairs.size).toBe(7);
  });
});
