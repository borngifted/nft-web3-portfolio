/**
 * useScrollIntroVideo Hook
 * Maps scroll position to video playback for cinematic intro
 * Based on the same architecture as useScrollVideo (Goodagains)
 * 
 * Reserves the first ~5% of scroll for black space before videos begin
 */

import { useState, useEffect, useRef } from 'react';
import { introVideosConfig } from '@/config/introVideos.config';

// Reserve the first 5% of scroll for black space
const BLACK_SPACE_RATIO = 0.05;

interface VideoSegment {
  videoIndex: number;
  startScroll: number;
  endScroll: number;
  duration: number;
}

export interface ScrollIntroVideoState {
  currentVideoIndex: number;
  currentTime: number;
  nextVideoIndex: number | null;
  transitionProgress: number;
  scrollProgress: number;
  isReady: boolean;
  inBlackSpace: boolean;
}

export function useScrollIntroVideo(videoRefs: React.RefObject<HTMLVideoElement | null>[]) {
  const [state, setState] = useState<ScrollIntroVideoState>(() => ({
    currentVideoIndex: 0,
    currentTime: 0,
    nextVideoIndex: null,
    transitionProgress: 0,
    scrollProgress: 0,
    isReady: false,
    inBlackSpace: true,
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
              resolve(8);
              return;
            }

            if (video.duration && !isNaN(video.duration)) {
              resolve(video.duration);
            } else {
              video.addEventListener('loadedmetadata', () => {
                resolve(video.duration || 8);
              }, { once: true });
            }
          });
        })
      );

      const totalWeightedDuration = durations.reduce((sum, duration, index) => {
        const multiplier = introVideosConfig.videos[index]?.scrollLengthMultiplier || 1.0;
        return sum + duration * multiplier;
      }, 0);

      // Videos start after black space
      const videoScrollRange = 1 - BLACK_SPACE_RATIO;
      let currentScrollPos = BLACK_SPACE_RATIO;

      const newSegments: VideoSegment[] = durations.map((duration, index) => {
        const multiplier = introVideosConfig.videos[index]?.scrollLengthMultiplier || 1.0;
        const weightedDuration = duration * multiplier;
        const segmentLength = (weightedDuration / totalWeightedDuration) * videoScrollRange;

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

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollProgress.current = Math.max(0, Math.min(1, scrollTop / scrollHeight));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation loop with lerp
  useEffect(() => {
    if (!state.isReady || segments.length === 0) return;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      currentScrollProgress.current = lerp(
        currentScrollProgress.current,
        targetScrollProgress.current,
        0.1
      );

      const progress = currentScrollProgress.current;

      // Check if we're still in black space
      if (progress < BLACK_SPACE_RATIO) {
        setState((prev) => ({
          ...prev,
          scrollProgress: progress,
          inBlackSpace: true,
        }));
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const segment = segments.find(
        (seg) => progress >= seg.startScroll && progress < seg.endScroll
      ) || segments[segments.length - 1];

      if (!segment) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const segmentProgress = (progress - segment.startScroll) / (segment.endScroll - segment.startScroll);
      const currentTime = segmentProgress * segment.duration;

      const transitionDuration = introVideosConfig.crossfadeDuration;
      const transitionThreshold = transitionDuration / segment.duration;

      let nextVideoIndex: number | null = null;
      let transitionProgress = 0;

      if (
        introVideosConfig.transitionMode === 'crossfade' &&
        segmentProgress > 1 - transitionThreshold &&
        segment.videoIndex < segments.length - 1
      ) {
        nextVideoIndex = segment.videoIndex + 1;
        transitionProgress = (segmentProgress - (1 - transitionThreshold)) / transitionThreshold;
      }

      // Fade in first video from black
      let fadeInOpacity = 1;
      if (segment.videoIndex === 0 && progress < BLACK_SPACE_RATIO + 0.02) {
        // Fade in over the first 2% of scroll after black space
        fadeInOpacity = (progress - BLACK_SPACE_RATIO) / 0.02;
      }

      setState({
        currentVideoIndex: segment.videoIndex,
        currentTime,
        nextVideoIndex,
        transitionProgress,
        scrollProgress: progress,
        isReady: true,
        inBlackSpace: false,
      });

      // Update video currentTime
      const currentVideo = videoRefs[segment.videoIndex]?.current;
      if (currentVideo && Math.abs(currentVideo.currentTime - currentTime) > 0.1) {
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
