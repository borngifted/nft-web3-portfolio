/**
 * CINEMATIC INTRO VIDEOS CONFIGURATION
 * Igloo.inc-style scroll-driven video experience for the landing page
 * 
 * Video order: Scene-1, Scene_1-end, Scene-2, Scene_2-end, ... Scene-7, Scene_7-end
 * Each scene pair tells part of the story through editorial text overlays.
 */

export interface IntroVideoConfig {
  src: string;
  scrollLengthMultiplier: number;
  poster?: string;
  name: string;
}

export interface IntroTimeMarker {
  videoIndex: number;
  timeStart: number;
  timeEnd: number;
  text: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export interface IntroVideosConfig {
  videos: IntroVideoConfig[];
  transitionMode: 'crossfade' | 'cut';
  crossfadeDuration: number;
  timeMarkers: IntroTimeMarker[];
}

export const introVideosConfig: IntroVideosConfig = {
  transitionMode: 'crossfade',
  crossfadeDuration: 0.5,

  videos: [
    // Scene 1
    { src: '/media/tWVLxksGSWSRwQbf.mp4', scrollLengthMultiplier: 1.0, name: 'Scene-1' },
    { src: '/media/TSZFNpXmgKyvJoHD.mp4', scrollLengthMultiplier: 1.0, name: 'Scene_1-end' },
    // Scene 2
    { src: '/media/alKYYtYUbBbkOdsE.mp4', scrollLengthMultiplier: 1.0, name: 'Scene-2' },
    { src: '/media/beNuclxwtEBdycAK.mp4', scrollLengthMultiplier: 1.0, name: 'Scene_2-end' },
    // Scene 3
    { src: '/media/fvIlGdFbylHXyGEp.mp4', scrollLengthMultiplier: 1.0, name: 'Scene-3' },
    { src: '/media/TpNopzkONOZkBfjs.mp4', scrollLengthMultiplier: 1.0, name: 'Scene_3-end' },
    // Scene 4
    { src: '/media/rVyGsIrLwfYqIruf.mp4', scrollLengthMultiplier: 1.0, name: 'Scene-4' },
    { src: '/media/AdDiEtdcrxGENAQh.mp4', scrollLengthMultiplier: 1.0, name: 'Scene_4-end' },
    // Scene 5
    { src: '/media/jzOEEzwEFkHchvEQ.mp4', scrollLengthMultiplier: 1.0, name: 'Scene-5' },
    { src: '/media/YcGrlrfRbIYOajNQ.mp4', scrollLengthMultiplier: 1.0, name: 'Scene_5-end' },
    // Scene 6
    { src: '/media/TDzkkaSOSAoFvtvK.mp4', scrollLengthMultiplier: 1.0, name: 'Scene-6' },
    { src: '/media/CTmRfWUubaIwcjLg.mp4', scrollLengthMultiplier: 1.0, name: 'Scene_6-end' },
    // Scene 7
    { src: '/media/ysqXKtXtqnwqxZOq.mp4', scrollLengthMultiplier: 1.0, name: 'Scene-7' },
    { src: '/media/ZzQYEooaIKSkmwjV.mp4', scrollLengthMultiplier: 1.0, name: 'Scene_7-end' },
  ],

  // Narrative text overlays — each appears during a specific video at a specific time range
  // Videos are ~8s each. timeStart/timeEnd are in seconds within that video's duration.
  timeMarkers: [
    // Scene 1 — THE ARRIVAL
    {
      videoIndex: 0,
      timeStart: 1.0,
      timeEnd: 5.0,
      text: 'WHERE SYSTEMS MEET CINEMA',
      position: 'bottom-left',
    },
    {
      videoIndex: 1,
      timeStart: 1.5,
      timeEnd: 5.5,
      text: 'A NEW LANGUAGE IS BORN',
      position: 'bottom-right',
    },

    // Scene 2 — THE VISION
    {
      videoIndex: 2,
      timeStart: 1.0,
      timeEnd: 5.0,
      text: 'FILM + AI',
      position: 'center',
    },
    {
      videoIndex: 3,
      timeStart: 1.0,
      timeEnd: 5.0,
      text: 'HYPER-REALISTIC SURREALISM\nTHROUGH PROCEDURAL INTELLIGENCE',
      position: 'bottom-left',
    },

    // Scene 3 — THE CRAFT
    {
      videoIndex: 4,
      timeStart: 1.0,
      timeEnd: 5.5,
      text: 'MUSIC + SYSTEMS',
      position: 'center',
    },
    {
      videoIndex: 5,
      timeStart: 1.5,
      timeEnd: 5.5,
      text: 'EVERY FRAME IS A COMPOSITION\nEVERY BEAT IS A SIGNAL',
      position: 'bottom-right',
    },

    // Scene 4 — THE ARCHITECTURE
    {
      videoIndex: 6,
      timeStart: 1.0,
      timeEnd: 5.0,
      text: 'CODE + CINEMA',
      position: 'center',
    },
    {
      videoIndex: 7,
      timeStart: 1.0,
      timeEnd: 5.5,
      text: 'BUILDING WORLDS\nTHAT BREATHE AND RESPOND',
      position: 'bottom-left',
    },

    // Scene 5 — THE EVOLUTION
    {
      videoIndex: 8,
      timeStart: 1.0,
      timeEnd: 5.0,
      text: 'SYSTEMS IN MOTION',
      position: 'center',
    },
    {
      videoIndex: 9,
      timeStart: 1.5,
      timeEnd: 5.5,
      text: 'THE INTERSECTION OF\nART AND ALGORITHM',
      position: 'bottom-right',
    },

    // Scene 6 — THE COLLECTIVE
    {
      videoIndex: 10,
      timeStart: 1.0,
      timeEnd: 5.0,
      text: 'THE GOODAGAINS',
      position: 'center',
    },
    {
      videoIndex: 11,
      timeStart: 1.0,
      timeEnd: 5.5,
      text: 'A COLLECTIVE VISION\nFOR THE DIGITAL FRONTIER',
      position: 'bottom-left',
    },

    // Scene 7 — THE FUTURE
    {
      videoIndex: 12,
      timeStart: 1.0,
      timeEnd: 5.0,
      text: 'WHAT COMES NEXT',
      position: 'center',
    },
    {
      videoIndex: 13,
      timeStart: 1.0,
      timeEnd: 5.5,
      text: 'THE WORK CONTINUES',
      position: 'bottom-right',
    },
  ],
};
