const isClient = typeof window !== 'undefined';

export const safeLocalStorage = {
  getItem(key: string): string | null {
    if (!isClient) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error);
      return null;
    }
  },

  setItem(key: string, value: string): boolean {
    if (!isClient) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to set item in localStorage: ${key}`, error);
      return false;
    }
  },

  removeItem(key: string): boolean {
    if (!isClient) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove item from localStorage: ${key}`, error);
      return false;
    }
  },

  clear(): boolean {
    if (!isClient) return false;
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage', error);
      return false;
    }
  },

  getJSON<T>(key: string, defaultValue?: T): T | null {
    const item = this.getItem(key);
    if (!item) return defaultValue ?? null;
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Failed to parse JSON from localStorage: ${key}`, error);
      return defaultValue ?? null;
    }
  },

  setJSON<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      return this.setItem(key, serialized);
    } catch (error) {
      console.warn(`Failed to stringify value for localStorage: ${key}`, error);
      return false;
    }
  },
};

export const safeSessionStorage = {
  getItem(key: string): string | null {
    if (!isClient) return null;
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get item from sessionStorage: ${key}`, error);
      return null;
    }
  },

  setItem(key: string, value: string): boolean {
    if (!isClient) return false;
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to set item in sessionStorage: ${key}`, error);
      return false;
    }
  },

  removeItem(key: string): boolean {
    if (!isClient) return false;
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove item from sessionStorage: ${key}`, error);
      return false;
    }
  },

  clear(): boolean {
    if (!isClient) return false;
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear sessionStorage', error);
      return false;
    }
  },

  getJSON<T>(key: string, defaultValue?: T): T | null {
    const item = this.getItem(key);
    if (!item) return defaultValue ?? null;
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Failed to parse JSON from sessionStorage: ${key}`, error);
      return defaultValue ?? null;
    }
  },

  setJSON<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      return this.setItem(key, serialized);
    } catch (error) {
      console.warn(`Failed to stringify value for sessionStorage: ${key}`, error);
      return false;
    }
  },
};
