export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const;

export function isKeyboardClick(event: React.KeyboardEvent | KeyboardEvent): boolean {
  return event.key === KEYBOARD_KEYS.ENTER || event.key === KEYBOARD_KEYS.SPACE;
}

export function handleKeyboardClick(
  event: React.KeyboardEvent | KeyboardEvent,
  callback: () => void
): void {
  if (isKeyboardClick(event)) {
    event.preventDefault();
    callback();
  }
}

export function createKeyboardHandler(handlers: Record<string, () => void>) {
  return (event: React.KeyboardEvent | KeyboardEvent) => {
    const handler = handlers[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  };
}

export function getAllFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

export function getNextFocusableElement(
  container: HTMLElement,
  direction: 'next' | 'previous' = 'next'
): HTMLElement | null {
  const focusable = getAllFocusableElements(container);
  const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);

  if (currentIndex === -1) {
    return focusable[0] || null;
  }

  const nextIndex = direction === 'next' 
    ? (currentIndex + 1) % focusable.length
    : (currentIndex - 1 + focusable.length) % focusable.length;

  return focusable[nextIndex] || null;
}

export class KeyboardNavigationManager {
  private elements: HTMLElement[] = [];
  private currentIndex = 0;

  constructor(private container: HTMLElement) {
    this.updateElements();
  }

  updateElements(): void {
    this.elements = getAllFocusableElements(this.container);
  }

  focusFirst(): void {
    this.currentIndex = 0;
    this.elements[0]?.focus();
  }

  focusLast(): void {
    this.currentIndex = this.elements.length - 1;
    this.elements[this.currentIndex]?.focus();
  }

  focusNext(): void {
    this.currentIndex = (this.currentIndex + 1) % this.elements.length;
    this.elements[this.currentIndex]?.focus();
  }

  focusPrevious(): void {
    this.currentIndex = (this.currentIndex - 1 + this.elements.length) % this.elements.length;
    this.elements[this.currentIndex]?.focus();
  }

  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case KEYBOARD_KEYS.ARROW_DOWN:
        event.preventDefault();
        this.focusNext();
        break;
      case KEYBOARD_KEYS.ARROW_UP:
        event.preventDefault();
        this.focusPrevious();
        break;
      case KEYBOARD_KEYS.HOME:
        event.preventDefault();
        this.focusFirst();
        break;
      case KEYBOARD_KEYS.END:
        event.preventDefault();
        this.focusLast();
        break;
    }
  }
}

export function announceToScreenReader(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', politeness);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
