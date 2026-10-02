/**
 * AUDIO CONTROLLER
 * User-controlled background music and ambient sound effects
 * Supports both cinematic intro and portfolio pages
 */

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioControllerProps {
  scrollProgress?: number;
}

const AUDIO_URL = '/media/RpneedKWXtcrOfkS.mp3';

export default function AudioController({ scrollProgress = 0 }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';
    audio.src = AUDIO_URL;
    
    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });

    audio.addEventListener('error', (e) => {
      console.warn('Audio load error:', e);
    });

    // Explicitly call load
    audio.load();
    
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && !isMuted) {
      audioRef.current.play().catch(err => {
        console.log('Audio playback requires user interaction first');
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isMuted]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync volume with scroll progress (subtle ambient effect)
  useEffect(() => {
    if (!audioRef.current || !isPlaying) return;
    
    const modulatedVolume = 0.2 + (scrollProgress * 0.2);
    if (!isMuted) {
      audioRef.current.volume = Math.min(modulatedVolume, volume);
    }
  }, [scrollProgress, volume, isMuted, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 bg-black/80 backdrop-blur-lg rounded-xl p-2.5 md:p-3 border border-cyan-500/30 shadow-lg">
      <div className="flex items-center gap-2 md:gap-3">
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className="p-1.5 md:p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          <Music className={`w-4 h-4 md:w-5 md:h-5 ${isPlaying ? 'text-cyan-400' : 'text-white/70'}`} />
        </button>

        {/* Volume slider - hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
          />
        </div>

        {/* Mute button */}
        <button
          onClick={toggleMute}
          className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-white/70" />
          ) : (
            <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white/70" />
          )}
        </button>
      </div>

      {/* Label */}
      <div className="mt-1.5 text-[8px] md:text-[9px] text-white/50 uppercase tracking-wider text-center">
        {isLoaded ? 'Ambient Sound' : 'Loading...'}
      </div>
    </div>
  );
}
