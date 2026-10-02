/**
 * CINEMATIC INTRO - Igloo.inc-style scroll-driven video experience
 * Uses the same pinned fullscreen video stage + crossfade architecture as TheGoodagains
 * 
 * Opens with a dynamic animated title on black that dissolves into the first video on scroll.
 * Narrative text overlays tell the story as you scroll through 14 video scenes.
 * Ends with an exploration section to navigate the rest of the portfolio.
 * Does NOT loop.
 */

import { useRef, useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { introVideosConfig, IntroTimeMarker } from '@/config/introVideos.config';
import { useScrollIntroVideo } from '@/hooks/useScrollIntroVideo';
import AudioController from '@/components/AudioController';

// Title configuration
const TITLE_LINES = [
  { text: 'TYQAWN', className: 'text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-bold tracking-[0.1em] sm:tracking-[0.15em]' },
  { text: 'HEADEN', className: 'text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-bold tracking-[0.1em] sm:tracking-[0.15em]' },
];
const SUBTITLE = 'CREATIVE TECHNOLOGIST \u00B7 FILMMAKER \u00B7 SYSTEMS DESIGNER';

// Portfolio exploration links
const EXPLORE_LINKS = [
  {
    href: '/noir',
    label: 'NOIR COLLECTION',
    description: 'Digital art at the intersection of film, AI, and systems design',
    accent: 'from-cyan-400/20 to-cyan-400/0',
  },
  {
    href: '/the-goodagains',
    label: 'THE GOODAGAINS',
    description: 'A collective vision for the digital frontier',
    accent: 'from-emerald-400/20 to-emerald-400/0',
  },
  {
    href: '/manifesto',
    label: 'MANIFESTO',
    description: 'The philosophy behind the work',
    accent: 'from-violet-400/20 to-violet-400/0',
  },
  {
    href: '/studio',
    label: 'STUDIO',
    description: 'Tools, process, and creative infrastructure',
    accent: 'from-amber-400/20 to-amber-400/0',
  },
  {
    href: '/contact',
    label: 'CONTACT',
    description: 'Collaborate, commission, or connect',
    accent: 'from-rose-400/20 to-rose-400/0',
  },
];

// Landscape mode hook
function useOrientation() {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsLandscape(width > height);
      setIsMobile(width < 768 || (width < 1024 && height < 500));
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => {
      // Delay to let the browser settle after orientation change
      setTimeout(checkOrientation, 100);
    });

    // Also listen to screen orientation API if available
    if (screen.orientation) {
      screen.orientation.addEventListener('change', () => {
        setTimeout(checkOrientation, 100);
      });
    }

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return { isLandscape, isMobile };
}

export default function CinematicIntro() {
  const [, setLocation] = useLocation();
  const { isLandscape, isMobile } = useOrientation();

  const videoRefs = useRef<React.RefObject<HTMLVideoElement | null>[]>(
    introVideosConfig.videos.map(() => ({ current: null }))
  );

  const [videosLoaded, setVideosLoaded] = useState(false);
  const [showTapToBegin, setShowTapToBegin] = useState(false);
  const [activeMarkers, setActiveMarkers] = useState<IntroTimeMarker[]>([]);
  const [titleMounted, setTitleMounted] = useState(false);

  const scrollState = useScrollIntroVideo(videoRefs.current);

  // Trigger title entrance animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setTitleMounted(true), 100);
    return () => clearTimeout(timer);
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
          } catch {
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
        } catch {
          // Silent fail
        }
      }
    }
    setShowTapToBegin(false);
  };

  // Update active text markers
  useEffect(() => {
    const { currentVideoIndex, currentTime } = scrollState;

    const active = introVideosConfig.timeMarkers.filter(
      (marker) =>
        marker.videoIndex === currentVideoIndex &&
        currentTime >= marker.timeStart &&
        currentTime <= marker.timeEnd
    );

    setActiveMarkers(active);
  }, [scrollState.currentVideoIndex, scrollState.currentTime]);

  // Calculate title animation values based on scroll progress
  const titleAnimValues = useMemo(() => {
    const progress = scrollState.scrollProgress;
    const titleProgress = Math.min(1, progress / 0.05);
    
    return {
      opacity: Math.max(0, 1 - titleProgress * 1.5),
      scale: 1 + titleProgress * 0.5,
      letterSpacing: titleProgress * 40,
      blur: titleProgress * 15,
      translateY: -titleProgress * 80,
      subtitleOpacity: Math.max(0, 1 - titleProgress * 2.5),
      subtitleTranslateY: titleProgress * 30,
    };
  }, [scrollState.scrollProgress]);

  // Check if we've reached the ending section (last ~5% of scroll)
  const showEndingSection = scrollState.scrollProgress >= 0.92 && scrollState.isReady;

  // Ending section fade-in progress (0 to 1 over the last 5%)
  const endingOpacity = useMemo(() => {
    if (scrollState.scrollProgress < 0.92) return 0;
    return Math.min(1, (scrollState.scrollProgress - 0.92) / 0.05);
  }, [scrollState.scrollProgress]);

  // Scroll space height
  const scrollSpaceHeight = typeof window !== 'undefined' ? window.innerHeight * 30 : 30000;

  return (
    <>
      {/* Scroll space (drives the pinned animation) */}
      <div style={{ height: `${scrollSpaceHeight}px` }} className="bg-black" />

      {/* Pinned video stage */}
      <div className="fixed inset-0 z-0 bg-black">
        {/* Video layers with crossfade */}
        {introVideosConfig.videos.map((videoConfig, index) => {
          const isCurrentVideo = index === scrollState.currentVideoIndex;
          const isNextVideo = index === scrollState.nextVideoIndex;

          let opacity = 0;

          if (scrollState.inBlackSpace || !scrollState.isReady) {
            opacity = 0;
          } else if (isCurrentVideo) {
            opacity = isNextVideo ? 1 - scrollState.transitionProgress : 1;
          } else if (isNextVideo) {
            opacity = scrollState.transitionProgress;
          }

          // Dim videos when ending section is showing
          if (showEndingSection) {
            opacity = opacity * (1 - endingOpacity * 0.7);
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
            />
          );
        })}

        {/* Film grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ===== DYNAMIC TITLE ON BLACK OPENING ===== */}
        {scrollState.scrollProgress < 0.06 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4"
            style={{
              opacity: titleAnimValues.opacity,
              transform: `translateY(${titleAnimValues.translateY}px) scale(${titleAnimValues.scale})`,
              filter: `blur(${titleAnimValues.blur}px)`,
              transition: titleMounted ? 'none' : 'all 0s',
            }}
          >
            {/* Main title lines */}
            <div className="flex flex-col items-center gap-0">
              {TITLE_LINES.map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className="overflow-hidden"
                  style={{
                    letterSpacing: `${(isMobile ? 0.1 : 0.15) + titleAnimValues.letterSpacing * 0.01}em`,
                  }}
                >
                  <div
                    className={`${line.className} text-white leading-none`}
                    style={{
                      fontFamily: 'var(--font-display)',
                      transform: titleMounted
                        ? 'translateY(0)'
                        : 'translateY(110%)',
                      transition: `transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${lineIndex * 0.15 + 0.3}s`,
                    }}
                  >
                    {line.text.split('').map((char, charIndex) => (
                      <span
                        key={charIndex}
                        className="inline-block"
                        style={{
                          opacity: titleMounted ? 1 : 0,
                          transform: titleMounted
                            ? 'translateY(0) rotateX(0deg)'
                            : 'translateY(40px) rotateX(-90deg)',
                          transition: `opacity 0.6s ease ${charIndex * 0.04 + lineIndex * 0.15 + 0.5}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${charIndex * 0.04 + lineIndex * 0.15 + 0.5}s`,
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative line */}
            <div
              className="mt-4 sm:mt-6 md:mt-8 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
              style={{
                width: titleMounted ? (isMobile ? '120px' : '200px') : '0px',
                opacity: titleMounted ? 1 : 0,
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1) 1.2s, opacity 0.6s ease 1.2s',
              }}
            />

            {/* Subtitle */}
            <div
              className="mt-3 sm:mt-4 md:mt-6 px-4"
              style={{
                opacity: titleMounted
                  ? titleAnimValues.subtitleOpacity
                  : 0,
                transform: `translateY(${titleMounted ? titleAnimValues.subtitleTranslateY : 20}px)`,
                transition: titleMounted
                  ? 'none'
                  : 'opacity 0.8s ease 1.5s, transform 0.8s ease 1.5s',
              }}
            >
              <p
                className="text-white/40 text-[7px] sm:text-[9px] md:text-xs tracking-[0.2em] sm:tracking-[0.35em] font-light text-center"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {SUBTITLE}
              </p>
            </div>
          </div>
        )}

        {/* ===== NARRATIVE TEXT OVERLAYS ===== */}
        {activeMarkers.map((marker, index) => {
          const position = marker.position || 'center';
          
          // Mobile-optimized position classes
          const positionClasses: Record<string, string> = isMobile && !isLandscape
            ? {
                'top-left': 'top-14 left-4 right-4',
                'top-right': 'top-14 left-4 right-4 text-right',
                'bottom-left': 'bottom-24 left-4 right-4',
                'bottom-right': 'bottom-24 left-4 right-4 text-right',
                center: 'top-1/2 left-4 right-4 -translate-y-1/2 text-center',
              }
            : isLandscape && isMobile
            ? {
                'top-left': 'top-4 left-6',
                'top-right': 'top-4 right-6 text-right',
                'bottom-left': 'bottom-12 left-6',
                'bottom-right': 'bottom-12 right-6 text-right',
                center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center',
              }
            : {
                'top-left': 'top-16 left-8 md:top-20 md:left-12',
                'top-right': 'top-16 right-8 md:top-20 md:right-12 text-right',
                'bottom-left': 'bottom-20 left-8 md:bottom-24 md:left-12',
                'bottom-right': 'bottom-20 right-8 md:bottom-24 md:right-12 text-right',
                center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center',
              };

          // Calculate fade based on time within the marker range
          const { currentTime } = scrollState;
          const markerDuration = marker.timeEnd - marker.timeStart;
          const markerProgress = (currentTime - marker.timeStart) / markerDuration;
          const fadeIn = Math.min(1, markerProgress * 4); // Fade in over first 25%
          const fadeOut = Math.min(1, (1 - markerProgress) * 4); // Fade out over last 25%
          const markerOpacity = Math.min(fadeIn, fadeOut);

          return (
            <div
              key={`${marker.videoIndex}-${marker.timeStart}-${index}`}
              className={`absolute ${positionClasses[position]} pointer-events-none z-10 max-w-[90vw] sm:max-w-lg md:max-w-xl`}
              style={{
                opacity: showEndingSection ? 0 : markerOpacity,
                transform: `translateY(${(1 - markerOpacity) * 15}px)`,
                transition: 'opacity 0.15s ease, transform 0.15s ease',
              }}
            >
              {marker.text.split('\n').map((line, lineIdx) => (
                <p
                  key={lineIdx}
                  className={`text-white font-light tracking-wide leading-relaxed ${
                    isMobile && !isLandscape
                      ? 'text-base sm:text-lg'
                      : isLandscape && isMobile
                      ? 'text-sm'
                      : 'text-lg sm:text-xl md:text-2xl lg:text-3xl'
                  }`}
                  style={{
                    fontFamily: 'var(--font-display)',
                    textShadow: '0 2px 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.5)',
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          );
        })}

        {/* ===== ENDING EXPLORATION SECTION ===== */}
        {showEndingSection && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-y-auto"
            style={{
              opacity: endingOpacity,
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* Dark overlay for readability */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              style={{ opacity: endingOpacity }}
            />

            {/* Content */}
            <div className={`relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-12 ${
              isLandscape && isMobile ? 'py-4' : 'py-8'
            }`}>
              {/* Section title */}
              <div className={`text-center ${isLandscape && isMobile ? 'mb-4' : 'mb-8 sm:mb-12 md:mb-16'}`}>
                <p
                  className="text-white/30 text-[8px] sm:text-[10px] tracking-[0.4em] uppercase mb-2 sm:mb-4"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  EXPLORE THE PORTFOLIO
                </p>
                <h2
                  className={`text-white font-light tracking-wide ${
                    isLandscape && isMobile
                      ? 'text-xl'
                      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Continue the Journey
                </h2>
                <div className="mt-2 sm:mt-4 mx-auto h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              </div>

              {/* Navigation grid */}
              <div className={`grid gap-3 sm:gap-4 md:gap-5 ${
                isLandscape && isMobile
                  ? 'grid-cols-3 lg:grid-cols-5'
                  : isMobile
                  ? 'grid-cols-1'
                  : 'grid-cols-2 lg:grid-cols-3'
              }`}>
                {EXPLORE_LINKS.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group relative block p-4 sm:p-6 md:p-8 border border-white/10 hover:border-white/25 transition-all duration-500 overflow-hidden"
                    style={{
                      opacity: endingOpacity,
                      transform: `translateY(${(1 - endingOpacity) * 30 + index * 5}px)`,
                      transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s, border-color 0.5s ease`,
                    }}
                  >
                    {/* Hover gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${link.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />

                    <div className="relative z-10">
                      <h3
                        className={`text-white tracking-[0.15em] sm:tracking-[0.2em] font-medium mb-1 sm:mb-2 group-hover:tracking-[0.25em] transition-all duration-500 ${
                          isLandscape && isMobile ? 'text-[10px]' : 'text-xs sm:text-sm md:text-base'
                        }`}
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {link.label}
                      </h3>
                      <p
                        className={`text-white/40 font-light leading-relaxed group-hover:text-white/60 transition-colors duration-500 ${
                          isLandscape && isMobile ? 'text-[9px] hidden' : 'text-[11px] sm:text-xs md:text-sm'
                        }`}
                      >
                        {link.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className={`absolute top-3 right-3 sm:top-6 sm:right-6 text-white/20 group-hover:text-white/60 transition-all duration-500 group-hover:translate-x-1`}>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Bottom tagline */}
              <div className={`text-center ${isLandscape && isMobile ? 'mt-4' : 'mt-6 sm:mt-10 md:mt-14'}`}>
                <p
                  className="text-white/20 text-[7px] sm:text-[9px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  TYQAWN HEADEN &mdash; DIGITAL / GLOBAL &mdash; SYSTEMS IN MOTION
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress indicator (14 ticks) - hidden during black space and ending */}
        {!scrollState.inBlackSpace && !showEndingSection && (
          <div className={`absolute left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 pointer-events-none transition-opacity duration-500 ${
            isLandscape && isMobile ? 'bottom-3' : 'bottom-6 sm:bottom-8'
          }`}>
            {introVideosConfig.videos.map((_, index) => (
              <div
                key={index}
                className={`h-0.5 transition-all duration-300 ${
                  isMobile ? 'w-2 sm:w-3' : 'w-4'
                } ${
                  index === scrollState.currentVideoIndex
                    ? 'bg-white'
                    : index < scrollState.currentVideoIndex
                    ? 'bg-white/50'
                    : 'bg-white/15'
                }`}
              />
            ))}
          </div>
        )}

        {/* Scene label - hidden during black space and ending */}
        {!scrollState.inBlackSpace && !showEndingSection && (
          <div className={`absolute pointer-events-none ${
            isLandscape && isMobile ? 'top-3 left-4' : 'top-6 left-4 sm:top-8 sm:left-8'
          }`}>
            <p className={`text-white/40 uppercase tracking-[0.3em] font-mono ${
              isMobile ? 'text-[8px]' : 'text-[10px]'
            }`}>
              {scrollState.currentVideoIndex + 1} / {introVideosConfig.videos.length}
            </p>
          </div>
        )}

        {/* Scroll indicator - only visible at the start */}
        {scrollState.scrollProgress < 0.05 && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 text-white/30 pointer-events-none ${
              isLandscape && isMobile ? 'bottom-3' : 'bottom-10 sm:bottom-16'
            }`}
            style={{
              opacity: titleMounted ? 1 : 0,
              transform: titleMounted ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.8s ease 2s, transform 0.8s ease 2s',
              animation: titleMounted ? 'bounce 2s ease-in-out 2.5s infinite' : 'none',
            }}
          >
            <span className={`tracking-[0.3em] font-light ${
              isMobile ? 'text-[8px]' : 'text-[10px]'
            }`} style={{ fontFamily: 'var(--font-mono)' }}>
              SCROLL
            </span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </div>

      {/* Audio Controller */}
      <AudioController scrollProgress={scrollState.scrollProgress} />

      {/* Skip button - hidden during ending section */}
      {!showEndingSection && (
        <button
          onClick={() => setLocation('/noir')}
          className={`fixed z-50 bg-white/5 hover:bg-white/15 backdrop-blur-sm text-white/40 hover:text-white/80 tracking-[0.2em] transition-all border border-white/10 hover:border-white/20 ${
            isLandscape && isMobile
              ? 'top-3 right-4 px-3 py-1.5 text-[8px]'
              : 'top-4 right-4 sm:top-8 sm:right-8 px-3 sm:px-5 py-1.5 sm:py-2.5 text-[8px] sm:text-[10px]'
          }`}
        >
          SKIP INTRO
        </button>
      )}

      {/* Tap to Begin overlay (iOS) */}
      {showTapToBegin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer"
          onClick={handleTapToBegin}
        >
          <div className="text-center space-y-3 sm:space-y-4 px-6">
            <p className="text-white text-xl sm:text-2xl font-light tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
              Tap to Begin
            </p>
            <p className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-[0.3em]">
              Cinematic Experience
            </p>
          </div>
        </div>
      )}
    </>
  );
}
