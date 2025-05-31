import { logger } from './logger';
import { analyticsManager } from './analytics';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
}

interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  timestamp: number;
}

class PerformanceManager {
  private static instance: PerformanceManager;
  private marks: Map<string, number> = new Map();
  private measures: Map<string, PerformanceEntry[]> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  private constructor() {
    this.initializeObservers();
  }

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  private initializeObservers() {
    if (typeof window === 'undefined' || !window.performance) return;

    // Observe Largest Contentful Paint
    this.observeLCP();

    // Observe First Input Delay
    this.observeFID();

    // Observe Cumulative Layout Shift
    this.observeCLS();

    // Observe First Contentful Paint
    this.observeFCP();
  }

  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('LCP', observer);
    } catch (error) {
      logger.error('Failed to initialize LCP observer', error as Error);
    }
  }

  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric('FID', entry.duration);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('FID', observer);
    } catch (error) {
      logger.error('Failed to initialize FID observer', error as Error);
    }
  }

  private observeCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric('CLS', clsValue);
          }
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('CLS', observer);
    } catch (error) {
      logger.error('Failed to initialize CLS observer', error as Error);
    }
  }

  private observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        this.recordMetric('FCP', firstEntry.startTime);
      });

      observer.observe({ entryTypes: ['paint'] });
      this.observers.set('FCP', observer);
    } catch (error) {
      logger.error('Failed to initialize FCP observer', error as Error);
    }
  }

  private recordMetric(name: string, value: number) {
    const rating = this.getMetricRating(name, value);
    const metric: PerformanceMetric = {
      name,
      value,
      rating
    };

    logger.info('Performance metric recorded', metric);
    analyticsManager.trackEvent({
      category: 'Performance',
      action: 'Metric',
      label: name,
      value: Math.round(value),
      properties: metric
    });
  }

  private getMetricRating(name: string, value: number): PerformanceMetric['rating'] {
    switch (name) {
      case 'LCP':
        if (value <= 2500) return 'good';
        if (value <= 4000) return 'needs-improvement';
        return 'poor';
      case 'FID':
        if (value <= 100) return 'good';
        if (value <= 300) return 'needs-improvement';
        return 'poor';
      case 'CLS':
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';
      case 'FCP':
        if (value <= 1800) return 'good';
        if (value <= 3000) return 'needs-improvement';
        return 'poor';
      default:
        return 'needs-improvement';
    }
  }

  mark(name: string): void {
    if (typeof window === 'undefined' || !window.performance) return;

    try {
      window.performance.mark(name);
      this.marks.set(name, performance.now());
      logger.debug('Performance mark', { name });
    } catch (error) {
      logger.error('Failed to create performance mark', error as Error);
    }
  }

  measure(name: string, startMark: string, endMark: string): void {
    if (typeof window === 'undefined' || !window.performance) return;

    try {
      window.performance.measure(name, startMark, endMark);
      const entries = window.performance.getEntriesByName(name);
      this.measures.set(name, entries);
      logger.debug('Performance measure', { name, entries });
    } catch (error) {
      logger.error('Failed to create performance measure', error as Error);
    }
  }

  getMarks(): Map<string, number> {
    return new Map(this.marks);
  }

  getMeasures(): Map<string, PerformanceEntry[]> {
    return new Map(this.measures);
  }

  clearMarks(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    try {
      window.performance.clearMarks();
      this.marks.clear();
      logger.debug('Performance marks cleared');
    } catch (error) {
      logger.error('Failed to clear performance marks', error as Error);
    }
  }

  clearMeasures(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    try {
      window.performance.clearMeasures();
      this.measures.clear();
      logger.debug('Performance measures cleared');
    } catch (error) {
      logger.error('Failed to clear performance measures', error as Error);
    }
  }

  disconnectObservers(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    logger.debug('Performance observers disconnected');
  }

  // Utility function to measure function execution time
  async measureFunction<T>(
    name: string,
    fn: () => Promise<T> | T
  ): Promise<T> {
    this.mark(`${name}-start`);
    try {
      const result = await fn();
      this.mark(`${name}-end`);
      this.measure(name, `${name}-start`, `${name}-end`);
      return result;
    } catch (error) {
      this.mark(`${name}-error`);
      this.measure(`${name}-error`, `${name}-start`, `${name}-error`);
      throw error;
    }
  }

  // Utility function to measure component render time
  measureRender(componentName: string): () => void {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.recordMetric(`${componentName}-render`, duration);
    };
  }

  // Utility function to measure API call duration
  measureApiCall(apiName: string): () => void {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.recordMetric(`${apiName}-duration`, duration);
    };
  }

  // Utility function to measure page load time
  measurePageLoad(pageName: string): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      this.recordMetric(`${pageName}-load`, loadTime);
    });
  }
}

export const performanceManager = PerformanceManager.getInstance(); 