/**
 * HERO VIDEOS CONFIGURATION
 * Igloo.inc-style scroll-driven video experience
 * 
 * HOW TO REPLACE VIDEOS:
 * 1. Place new videos in `/client/public/videos/goodagains/`
 * 2. Update the `videos` array below with new filenames
 * 3. Adjust `scrollLengthMultiplier` if needed (1.0 = proportional to duration)
 * 4. Update `timeMarkers` for editorial text overlays
 */

export interface VideoConfig {
  /** Video filename (relative to /videos/goodagains/) */
  src: string;
  /** Multiplier for scroll segment length (1.0 = proportional to duration) */
  scrollLengthMultiplier: number;
  /** Optional poster frame */
  poster?: string;
}

export interface TimeMarker {
  /** Video index (0-based) */
  videoIndex: number;
  /** Start time in seconds */
  timeStart: number;
  /** End time in seconds */
  timeEnd: number;
  /** Text to display */
  text: string;
  /** Optional position override */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export interface HeroVideosConfig {
  videos: VideoConfig[];
  transitionMode: 'crossfade' | 'cut';
  crossfadeDuration: number; // seconds
  timeMarkers: TimeMarker[];
}

export const heroVideosConfig: HeroVideosConfig = {
  // Transition mode: 'crossfade' for smooth blends, 'cut' for instant switches
  transitionMode: 'crossfade',
  
  // Crossfade duration in seconds
  crossfadeDuration: 0.5,
  
  // Video sequence (ordered)
  videos: [
    { src: '/media/zhGSbobtzCtmPMwX.mp4', scrollLengthMultiplier: 1.0 },
    { src: '/media/IJfNvIylUJCfyYPR.mp4', scrollLengthMultiplier: 1.0 },
    { src: '/media/lujgBlavNmjAlUkb.mp4', scrollLengthMultiplier: 1.0 },
    { src: '/media/NJTAdQsTXsbHngNE.mp4', scrollLengthMultiplier: 1.0 },
    { src: '/media/YepCvdrlcCUrdcXG.mp4', scrollLengthMultiplier: 1.0 },
    { src: '/media/kCJLCmTXXkeSXtWi.mp4', scrollLengthMultiplier: 1.0 },
    { src: '/media/MUTPHvbXiGvdhjtq.mp4', scrollLengthMultiplier: 1.0 },
    { src: '/media/FfYcAWxsHuxSsdpg.mp4', scrollLengthMultiplier: 1.0 },
    { src: '/media/GzxInXdcZIRqgLVl.mp4', scrollLengthMultiplier: 1.0 },
    { src: '/media/drzRxeKmvNRuyvGy.mp4', scrollLengthMultiplier: 1.0 },
  ],
  
  // Editorial text overlays (igloo.inc style)
  // These appear at specific timecodes and fade in/out smoothly
  timeMarkers: [
    // Chapter 1: The Streets
    {
      videoIndex: 0,
      timeStart: 1.0,
      timeEnd: 4.0,
      text: 'Jersey City, 2026',
      position: 'bottom-left',
    },
    {
      videoIndex: 1,
      timeStart: 2.0,
      timeEnd: 5.0,
      text: 'A city on the edge of transformation',
      position: 'center',
    },
    
    // Chapter 2: The Discovery
    {
      videoIndex: 2,
      timeStart: 1.5,
      timeEnd: 4.5,
      text: 'The quartz appeared without warning',
      position: 'top-right',
    },
    {
      videoIndex: 3,
      timeStart: 2.0,
      timeEnd: 5.0,
      text: 'Glowing. Pulsing. Calling.',
      position: 'center',
    },
    
    // Chapter 3: The Gift
    {
      videoIndex: 4,
      timeStart: 1.0,
      timeEnd: 4.0,
      text: 'Those who touched it... changed',
      position: 'bottom-right',
    },
    {
      videoIndex: 5,
      timeStart: 2.5,
      timeEnd: 6.0,
      text: '237 ordinary people became extraordinary',
      position: 'center',
    },
    
    // Chapter 4: The Surge
    {
      videoIndex: 6,
      timeStart: 1.0,
      timeEnd: 4.0,
      text: 'Power without control',
      position: 'top-left',
    },
    {
      videoIndex: 7,
      timeStart: 2.0,
      timeEnd: 5.0,
      text: 'Fear without understanding',
      position: 'center',
    },
    
    // Chapter 5: The Goodagains
    {
      videoIndex: 8,
      timeStart: 1.5,
      timeEnd: 5.0,
      text: 'They chose to protect, not destroy',
      position: 'bottom-left',
    },
    {
      videoIndex: 9,
      timeStart: 2.0,
      timeEnd: 6.0,
      text: 'The Goodagains',
      position: 'center',
    },
  ],
};
