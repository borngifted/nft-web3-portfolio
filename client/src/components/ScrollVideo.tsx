import { memo, useEffect, useRef } from 'react';

interface ScrollVideoProps {
  videoUrl: string;
  onComplete?: () => void;
}

const ScrollVideo = memo(function ScrollVideo({ videoUrl, onComplete }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const readyRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Video loading effect - runs once per videoUrl
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const handleLoadedData = async () => {
      if (cancelled) return;
      // Play/pause trick to force the browser to decode and render a frame
      try {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        if (cancelled) return;
        video.pause();
        video.currentTime = 0;
        readyRef.current = true;
      } catch {
        // Autoplay may be blocked; just seek to show first frame
        if (!cancelled) {
          video.currentTime = 0;
          readyRef.current = true;
        }
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.load();

    return () => {
      cancelled = true;
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [videoUrl]);

  // Scroll-driven playback effect
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const updateVideo = () => {
      if (!readyRef.current || !video.duration) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress: 0 when section top enters viewport bottom, 1 when section bottom exits viewport top
      const scrollProgress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ));

      const targetTime = scrollProgress * video.duration;
      if (!isNaN(targetTime) && Math.abs(video.currentTime - targetTime) > 0.05) {
        video.currentTime = targetTime;
      }

      if (scrollProgress >= 0.98 && onCompleteRef.current) {
        onCompleteRef.current();
      }
    };

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateVideo);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [videoUrl]);

  return (
    <div ref={containerRef} className="sticky top-0 w-full h-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
});

export default ScrollVideo;
