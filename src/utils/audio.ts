import useSound from 'use-sound';
import { useCallback, useEffect, useRef } from 'react';
import { logger } from './logger';

interface AudioOptions {
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
  interrupt?: boolean;
}

class AudioManager {
  private static instance: AudioManager;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;

  private constructor() {
    // Initialize audio context
    this.setupAudioContext();
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private setupAudioContext() {
    // Create audio context on user interaction
    document.addEventListener('click', () => {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    }, { once: true });
  }

  private audioContext: AudioContext | null = null;

  async preloadSound(src: string): Promise<void> {
    if (this.audioCache.has(src)) return;

    try {
      const audio = new Audio(src);
      audio.preload = 'auto';
      
      // Wait for audio to be loaded
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve, { once: true });
        audio.addEventListener('error', reject, { once: true });
        audio.load();
      });

      this.audioCache.set(src, audio);
      logger.debug('Audio preloaded', { src });
    } catch (error) {
      logger.error('Failed to preload audio', error as Error, { src });
    }
  }

  async playSound(src: string, options: AudioOptions = {}): Promise<void> {
    const {
      volume = 1,
      fadeIn = 0,
      fadeOut = 0,
      interrupt = false
    } = options;

    try {
      let audio = this.audioCache.get(src);
      
      if (!audio) {
        await this.preloadSound(src);
        audio = this.audioCache.get(src);
      }

      if (!audio) throw new Error('Audio not loaded');

      // Stop any currently playing instance
      if (interrupt) {
        audio.pause();
        audio.currentTime = 0;
      }

      // Apply volume
      audio.volume = this.isMuted ? 0 : volume;

      // Fade in
      if (fadeIn > 0) {
        audio.volume = 0;
        const fadeInInterval = setInterval(() => {
          if (audio && audio.volume < volume) {
            audio.volume = Math.min(audio.volume + (volume / (fadeIn * 10)), volume);
          } else {
            clearInterval(fadeInInterval);
          }
        }, 100);
      }

      // Play the sound
      await audio.play();

      // Fade out
      if (fadeOut > 0) {
        const fadeOutInterval = setInterval(() => {
          if (audio && audio.volume > 0) {
            audio.volume = Math.max(audio.volume - (volume / (fadeOut * 10)), 0);
          } else {
            clearInterval(fadeOutInterval);
            audio?.pause();
          }
        }, 100);
      }

      logger.debug('Sound played', { src, options });
    } catch (error) {
      logger.error('Failed to play sound', error as Error, { src, options });
    }
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.audioCache.forEach(audio => {
      audio.volume = muted ? 0 : 1;
    });
    logger.info('Audio muted state changed', { muted });
  }

  isAudioMuted(): boolean {
    return this.isMuted;
  }
}

// Export singleton instance
export const audioManager = AudioManager.getInstance();

// React hook for using sounds with fade effects
export const useSoundWithFade = (src: string, options: AudioOptions = {}) => {
  const [play, { stop }] = useSound(src, {
    volume: options.volume ?? 1,
    interrupt: options.interrupt ?? false,
  });

  const playWithFade = useCallback(async () => {
    if (options.fadeIn) {
      // Implement fade in using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        options.volume ?? 1,
        audioContext.currentTime + options.fadeIn / 1000
      );
    }

    play();

    if (options.fadeOut) {
      setTimeout(() => {
        stop();
      }, options.fadeOut);
    }
  }, [play, stop, options]);

  return { play: playWithFade, stop };
}; 