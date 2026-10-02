/**
 * ScrollVideoHero Component
 * Igloo.inc-style scroll-driven video experience
 * 
 * Features:
 * - Fullscreen pinned video stage
 * - Scroll controls playback
 * - Crossfade transitions between clips
 * - Editorial text overlays at timecodes
 * - Minimal progress indicators
 */

import { useRef, useEffect, useState } from 'react';
import { heroVideosConfig, TimeMarker } from '@/config/heroVideos.config';
import { useScrollVideo } from '@/hooks/useScrollVideo';

export default function ScrollVideoHero() {
  const videoRefs = useRef<React.RefObject<HTMLVideoElement | null>[]>(
    heroVideosConfig.videos.map(() => ({ current: null }))
  );

  const [videosLoaded, setVideosLoaded] = useState(false);
  const [showTapToBegin, setShowTapToBegin] = useState(false);
  const [activeMarkers, setActiveMarkers] = useState<TimeMarker[]>([]);
  const [debugMode, setDebugMode] = useState(false);

  const scrollState = useScrollVideo(videoRefs.current);

  // Check for debug mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebugMode(params.get('debug') === '1');
  }, []);

  // Warm start: unlock video decoding on iOS
  useEffect(() => {
    const warmStart = async () => {
      for (const ref of videoRefs.current) {
        const video = ref.current;
        if (video) {
          try {
            await video.play();
            video.pause();
            video.currentTime = 0;
          } catch (err) {
            // iOS requires user gesture
            setShowTapToBegin(true);
          }
        }
      }
      setVideosLoaded(true);
    };

    warmStart();
  }, []);

  // Handle "Tap to Begin" for iOS
  const handleTapToBegin = async () => {
    for (const ref of videoRefs.current) {
      const video = ref.current;
      if (video) {
        try {
          await video.play();
          video.pause();
        } catch (err) {
          console.error('Failed to unlock video:', err);
        }
      }
    }
    setShowTapToBegin(false);
  };

  // Update active text markers based on current video and time
  useEffect(() => {
    const { currentVideoIndex, currentTime } = scrollState;

    const active = heroVideosConfig.timeMarkers.filter(
      (marker) =>
        marker.videoIndex === currentVideoIndex &&
        currentTime >= marker.timeStart &&
        currentTime <= marker.timeEnd
    );

    setActiveMarkers(active);
  }, [scrollState.currentVideoIndex, scrollState.currentTime]);

  // Calculate scroll space height (proportional to total video duration)
  // Each video gets ~2-3 screen heights of scroll space for smooth playback control
  const scrollSpaceHeight = typeof window !== 'undefined' ? window.innerHeight * 25 : 25000;

  return (
    <>
      {/* Scroll space (drives the pinned animation) */}
      <div style={{ height: `${scrollSpaceHeight}px` }} />

      {/* Pinned video stage */}
      <div className="fixed inset-0 z-0">
        {/* Video layers */}
        {heroVideosConfig.videos.map((videoConfig, index) => {
          const isCurrentVideo = index === scrollState.currentVideoIndex;
          const isNextVideo = index === scrollState.nextVideoIndex;
          
          // Calculate opacity
          // Default to showing first video (index 0) when not ready or at scroll position 0
          let opacity = 0;
          
          if (!scrollState.isReady && index === 0) {
            // Show first video while loading
            opacity = 1;
          } else if (isCurrentVideo) {
            opacity = isNextVideo ? 1 - scrollState.transitionProgress : 1;
          } else if (isNextVideo) {
            opacity = scrollState.transitionProgress;
          }

          return (
            <video
              key={index}
              ref={(el) => {
                const ref = videoRefs.current[index];
                if (ref && 'current' in ref) {
                  (ref as React.MutableRefObject<HTMLVideoElement | null>).current = el;
                }
              }}
              src={videoConfig.src}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-100"
              style={{ opacity }}
              muted
              playsInline
              preload="auto"
              poster={videoConfig.poster}
            />
          );
        })}

        {/* Film grain overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Editorial text overlays */}
        {activeMarkers.map((marker, index) => {
          const position = marker.position || 'center';
          const positionClasses = {
            'top-left': 'top-12 left-12',
            'top-right': 'top-12 right-12',
            'bottom-left': 'bottom-12 left-12',
            'bottom-right': 'bottom-12 right-12',
            'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          };

          return (
            <div
              key={`${marker.videoIndex}-${marker.timeStart}-${index}`}
              className={`absolute ${positionClasses[position]} pointer-events-none animate-fadeIn`}
              style={{
                fontFamily: 'var(--font-display)',
                textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              }}
            >
              <p className="text-white text-2xl md:text-4xl lg:text-5xl font-light tracking-wide leading-tight max-w-3xl">
                {marker.text}
              </p>
            </div>
          );
        })}

        {/* Progress indicator (10 ticks) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
          {heroVideosConfig.videos.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-1 transition-all duration-300 ${
                index === scrollState.currentVideoIndex
                  ? 'bg-white'
                  : index < scrollState.currentVideoIndex
                  ? 'bg-white/50'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Scene label */}
        <div className="absolute top-8 left-8 pointer-events-none">
          <p className="text-white/60 text-xs uppercase tracking-widest font-mono">
            Scene {scrollState.currentVideoIndex + 1} / {heroVideosConfig.videos.length}
          </p>
        </div>

        {/* Debug overlay */}
        {debugMode && (
          <div className="absolute top-8 right-8 bg-black/80 text-white p-4 text-xs font-mono space-y-1 pointer-events-none">
            <div>Video Index: {scrollState.currentVideoIndex}</div>
            <div>Current Time: {scrollState.currentTime.toFixed(2)}s</div>
            <div>Scroll Progress: {(scrollState.scrollProgress * 100).toFixed(1)}%</div>
            <div>Transition: {(scrollState.transitionProgress * 100).toFixed(1)}%</div>
            {scrollState.nextVideoIndex !== null && (
              <div>Next Video: {scrollState.nextVideoIndex}</div>
            )}
          </div>
        )}
      </div>

      {/* Tap to Begin overlay (iOS) */}
      {showTapToBegin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-pointer"
          onClick={handleTapToBegin}
        >
          <div className="text-center space-y-4">
            <p className="text-white text-2xl font-light tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
              Tap to Begin
            </p>
            <p className="text-white/60 text-sm uppercase tracking-widest">
              The Goodagains
            </p>
          </div>
        </div>
      )}
    </>
  );
}
