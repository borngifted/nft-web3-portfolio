/**
 * useScrollVideo Hook
 * Maps scroll position to video playback (igloo.inc style)
 * 
 * Core logic:
 * 1. Calculate total scroll height based on video durations
 * 2. Map scroll progress to (videoIndex, currentTime)
 * 3. Use requestAnimationFrame for smooth updates
 * 4. Lerp (smooth interpolation) for weighted feel
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { heroVideosConfig } from '@/config/heroVideos.config';

interface VideoSegment {
  videoIndex: number;
  startScroll: number; // 0-1
  endScroll: number; // 0-1
  duration: number; // seconds
}

interface ScrollVideoState {
  currentVideoIndex: number;
  currentTime: number;
  nextVideoIndex: number | null;
  transitionProgress: number; // 0-1 during crossfade
  scrollProgress: number; // 0-1 overall
  isReady: boolean;
}

export function useScrollVideo(videoRefs: React.RefObject<HTMLVideoElement | null>[]) {
  const [state, setState] = useState<ScrollVideoState>(() => ({
    currentVideoIndex: 0,
    currentTime: 0,
    nextVideoIndex: null,
    transitionProgress: 0,
    scrollProgress: 0,
    isReady: false,
  }));

  const [segments, setSegments] = useState<VideoSegment[]>(() => []);
  const rafRef = useRef<number | undefined>(undefined);
  const targetScrollProgress = useRef(0);
  const currentScrollProgress = useRef(0);

  // Calculate video segments once durations are loaded
  useEffect(() => {
    const loadDurations = async () => {
      const durations = await Promise.all(
        videoRefs.map((ref) => {
          return new Promise<number>((resolve) => {
            const video = ref.current;
            if (!video) {
              resolve(10); // fallback duration
              return;
            }

            if (video.duration && !isNaN(video.duration)) {
              resolve(video.duration);
            } else {
              video.addEventListener('loadedmetadata', () => {
                resolve(video.duration || 10);
              }, { once: true });
            }
          });
        })
      );

      // Calculate total weighted duration
      const totalWeightedDuration = durations.reduce((sum, duration, index) => {
        const multiplier = heroVideosConfig.videos[index]?.scrollLengthMultiplier || 1.0;
        return sum + duration * multiplier;
      }, 0);

      // Build segments
      let currentScrollPos = 0;
      const newSegments: VideoSegment[] = durations.map((duration, index) => {
        const multiplier = heroVideosConfig.videos[index]?.scrollLengthMultiplier || 1.0;
        const weightedDuration = duration * multiplier;
        const segmentLength = weightedDuration / totalWeightedDuration;

        const segment: VideoSegment = {
          videoIndex: index,
          startScroll: currentScrollPos,
          endScroll: currentScrollPos + segmentLength,
          duration,
        };

        currentScrollPos += segmentLength;
        return segment;
      });

      setSegments(newSegments);
      setState((prev) => ({ ...prev, isReady: true }));
    };

    loadDurations();
  }, [videoRefs]);

  // Scroll listener (passive)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollProgress.current = Math.max(0, Math.min(1, scrollTop / scrollHeight));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation loop with lerp
  useEffect(() => {
    if (!state.isReady || segments.length === 0) return;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      // Smooth interpolation (lerp) for weighted feel
      currentScrollProgress.current = lerp(
        currentScrollProgress.current,
        targetScrollProgress.current,
        0.1 // Smoothing factor (lower = smoother, higher = more responsive)
      );

      const progress = currentScrollProgress.current;

      // Find current segment
      const segment = segments.find(
        (seg) => progress >= seg.startScroll && progress < seg.endScroll
      ) || segments[segments.length - 1];

      if (!segment) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Calculate time within segment
      const segmentProgress = (progress - segment.startScroll) / (segment.endScroll - segment.startScroll);
      const currentTime = segmentProgress * segment.duration;

      // Check for transition
      const transitionDuration = heroVideosConfig.crossfadeDuration;
      const transitionThreshold = transitionDuration / segment.duration;
      
      let nextVideoIndex: number | null = null;
      let transitionProgress = 0;

      if (
        heroVideosConfig.transitionMode === 'crossfade' &&
        segmentProgress > 1 - transitionThreshold &&
        segment.videoIndex < segments.length - 1
      ) {
        nextVideoIndex = segment.videoIndex + 1;
        transitionProgress = (segmentProgress - (1 - transitionThreshold)) / transitionThreshold;
      }

      setState({
        currentVideoIndex: segment.videoIndex,
        currentTime,
        nextVideoIndex,
        transitionProgress,
        scrollProgress: progress,
        isReady: true,
      });

      // Update video currentTime
      const currentVideo = videoRefs[segment.videoIndex]?.current;
      if (currentVideo && Math.abs(currentVideo.currentTime - currentTime) > 0.1) {
        // Ensure video is in a playable state before seeking
        if (currentVideo.paused) {
          currentVideo.play().catch(() => {});
          currentVideo.pause();
        }
        currentVideo.currentTime = currentTime;
      }

      // Preload next video
      if (nextVideoIndex !== null) {
        const nextVideo = videoRefs[nextVideoIndex]?.current;
        if (nextVideo && nextVideo.readyState < 3) {
          nextVideo.load();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [state.isReady, segments, videoRefs]);

  return state;
}
