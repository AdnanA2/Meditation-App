import { logger } from './logger';
import { audioManager } from './audio';

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number; // in seconds
  hold: number; // in seconds
  exhale: number; // in seconds
  cycles: number;
  totalDuration: number; // in seconds
}

export interface BreathingState {
  phase: 'inhale' | 'hold' | 'exhale' | 'rest';
  remainingTime: number;
  cycle: number;
  totalCycles: number;
}

class BreathingManager {
  private static instance: BreathingManager;
  private patterns: Map<string, BreathingPattern> = new Map();
  private currentState: BreathingState | null = null;
  private timer: NodeJS.Timeout | null = null;
  private onStateChange: ((state: BreathingState) => void) | null = null;

  private constructor() {
    this.initializePatterns();
  }

  static getInstance(): BreathingManager {
    if (!BreathingManager.instance) {
      BreathingManager.instance = new BreathingManager();
    }
    return BreathingManager.instance;
  }

  private initializePatterns() {
    // 4-7-8 Breathing
    this.addPattern({
      id: '478',
      name: '4-7-8 Breathing',
      description: 'Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds',
      inhale: 4,
      hold: 7,
      exhale: 8,
      cycles: 4,
      totalDuration: 76 // (4 + 7 + 8) * 4
    });

    // Box Breathing
    this.addPattern({
      id: 'box',
      name: 'Box Breathing',
      description: 'Equal duration for inhale, hold, exhale, and rest',
      inhale: 4,
      hold: 4,
      exhale: 4,
      cycles: 5,
      totalDuration: 80 // (4 + 4 + 4 + 4) * 5
    });

    // Calming Breath
    this.addPattern({
      id: 'calming',
      name: 'Calming Breath',
      description: 'Long exhale to activate the parasympathetic nervous system',
      inhale: 4,
      hold: 0,
      exhale: 6,
      cycles: 6,
      totalDuration: 60 // (4 + 6) * 6
    });

    // Energizing Breath
    this.addPattern({
      id: 'energizing',
      name: 'Energizing Breath',
      description: 'Quick inhales and exhales to increase energy',
      inhale: 2,
      hold: 0,
      exhale: 2,
      cycles: 10,
      totalDuration: 40 // (2 + 2) * 10
    });

    // Deep Relaxation
    this.addPattern({
      id: 'deep_relaxation',
      name: 'Deep Relaxation',
      description: 'Long, deep breaths for deep relaxation',
      inhale: 6,
      hold: 2,
      exhale: 8,
      cycles: 4,
      totalDuration: 64 // (6 + 2 + 8) * 4
    });
  }

  private addPattern(pattern: BreathingPattern) {
    this.patterns.set(pattern.id, pattern);
  }

  async startBreathing(patternId: string, onStateChange: (state: BreathingState) => void): Promise<void> {
    const pattern = this.patterns.get(patternId);
    if (!pattern) {
      throw new Error('Breathing pattern not found');
    }

    if (this.timer) {
      this.stopBreathing();
    }

    this.onStateChange = onStateChange;
    this.currentState = {
      phase: 'inhale',
      remainingTime: pattern.inhale,
      cycle: 1,
      totalCycles: pattern.cycles
    };

    // Play start sound
    await audioManager.playSound('/sounds/breathing-start.mp3', {
      volume: 0.3,
      fadeIn: 200
    });

    this.startTimer(pattern);
    logger.info('Breathing exercise started', { patternId });
  }

  private startTimer(pattern: BreathingPattern) {
    this.timer = setInterval(() => {
      if (!this.currentState) return;

      this.currentState.remainingTime--;

      if (this.currentState.remainingTime <= 0) {
        this.transitionPhase(pattern);
      }

      this.onStateChange?.(this.currentState);
    }, 1000);
  }

  private async transitionPhase(pattern: BreathingPattern) {
    if (!this.currentState) return;

    switch (this.currentState.phase) {
      case 'inhale':
        if (pattern.hold > 0) {
          this.currentState.phase = 'hold';
          this.currentState.remainingTime = pattern.hold;
          await this.playPhaseSound('hold');
        } else {
          this.currentState.phase = 'exhale';
          this.currentState.remainingTime = pattern.exhale;
          await this.playPhaseSound('exhale');
        }
        break;

      case 'hold':
        this.currentState.phase = 'exhale';
        this.currentState.remainingTime = pattern.exhale;
        await this.playPhaseSound('exhale');
        break;

      case 'exhale':
        if (this.currentState.cycle < pattern.cycles) {
          this.currentState.cycle++;
          this.currentState.phase = 'inhale';
          this.currentState.remainingTime = pattern.inhale;
          await this.playPhaseSound('inhale');
        } else {
          this.stopBreathing();
        }
        break;
    }
  }

  private async playPhaseSound(phase: BreathingState['phase']) {
    const soundMap = {
      inhale: '/sounds/breathing-in.mp3',
      hold: '/sounds/breathing-hold.mp3',
      exhale: '/sounds/breathing-out.mp3'
    };

    const sound = soundMap[phase];
    if (sound) {
      await audioManager.playSound(sound, {
        volume: 0.2,
        fadeIn: 100,
        fadeOut: 100
      });
    }
  }

  stopBreathing(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    if (this.currentState) {
      this.currentState = null;
      this.onStateChange = null;
      logger.info('Breathing exercise stopped');
    }
  }

  getPattern(id: string): BreathingPattern | undefined {
    return this.patterns.get(id);
  }

  getAllPatterns(): BreathingPattern[] {
    return Array.from(this.patterns.values());
  }

  getCurrentState(): BreathingState | null {
    return this.currentState;
  }

  isBreathingActive(): boolean {
    return this.timer !== null;
  }
}

export const breathingManager = BreathingManager.getInstance(); 