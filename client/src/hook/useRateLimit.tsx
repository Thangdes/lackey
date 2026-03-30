import { useRef, useCallback } from 'react';

interface RateLimitOptions {
  maxCalls: number;
  windowMs: number;
}

export function useRateLimit({ maxCalls, windowMs }: RateLimitOptions) {
  const callTimestamps = useRef<number[]>([]);

  const isRateLimited = useCallback(() => {
    const now = Date.now();
    callTimestamps.current = callTimestamps.current.filter(
      timestamp => now - timestamp < windowMs
    );

    return callTimestamps.current.length >= maxCalls;
  }, [maxCalls, windowMs]);

  const recordCall = useCallback(() => {
    callTimestamps.current.push(Date.now());
  }, []);

  const execute = useCallback(<T extends (...args: unknown[]) => unknown>(
    fn: T,
    ...args: Parameters<T>
  ): ReturnType<T> | null => {
    if (isRateLimited()) {
      console.warn('Rate limit exceeded');
      return null;
    }

    recordCall();
    return fn(...args) as ReturnType<T>;
  }, [isRateLimited, recordCall]);

  return { execute, isRateLimited };
}

export function useDebounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fn(...(args as unknown[]));
    }, delay);
  }, [fn, delay]);
}

export function useThrottle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastCall = useRef<number>(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      fn(...(args as unknown[]));
    }
  }, [fn, delay]);
}
