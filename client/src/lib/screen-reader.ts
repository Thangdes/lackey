export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function createLiveRegion(
  id: string,
  priority: 'polite' | 'assertive' = 'polite'
): HTMLElement {
  let region = document.getElementById(id);

  if (!region) {
    region = document.createElement('div');
    region.id = id;
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.style.position = 'absolute';
    region.style.left = '-10000px';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.overflow = 'hidden';
    document.body.appendChild(region);
  }

  return region;
}

export function updateLiveRegion(id: string, message: string): void {
  const region = document.getElementById(id);
  if (region) {
    region.textContent = message;
  }
}

export interface AccessibilityIssue {
  element: string;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  wcagCriterion?: string;
  suggestion?: string;
}

export function auditPageAccessibility(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.alt && img.alt !== '') {
      issues.push({
        element: `img[src="${img.src}"]`,
        issue: 'Image missing alt attribute',
        severity: 'error',
        wcagCriterion: '1.1.1 Non-text Content',
        suggestion: 'Add descriptive alt text or alt="" for decorative images',
      });
    }
  });

  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
      issues.push({
        element: 'button',
        issue: 'Button has no accessible name',
        severity: 'error',
        wcagCriterion: '4.1.2 Name, Role, Value',
        suggestion: 'Add text content or aria-label attribute',
      });
    }
  });

  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    if (!link.textContent?.trim() && !link.getAttribute('aria-label')) {
      issues.push({
        element: `a[href="${link.href}"]`,
        issue: 'Link has no accessible name',
        severity: 'error',
        wcagCriterion: '2.4.4 Link Purpose',
        suggestion: 'Add descriptive link text or aria-label',
      });
    }
  });

  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
      issues.push({
        element: `input[type="${input.type}"]`,
        issue: 'Form input missing label',
        severity: 'error',
        wcagCriterion: '3.3.2 Labels or Instructions',
        suggestion: 'Add associated label or aria-label attribute',
      });
    }
  });

  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName[1]);
    if (level - lastLevel > 1) {
      issues.push({
        element: heading.tagName.toLowerCase(),
        issue: `Heading level skip detected (${lastLevel} to ${level})`,
        severity: 'warning',
        wcagCriterion: '1.3.1 Info and Relationships',
        suggestion: 'Use sequential heading levels',
      });
    }
    lastLevel = level;
  });

  if (!document.querySelector('[role="main"], main')) {
    issues.push({
      element: 'body',
      issue: 'Page missing main landmark',
      severity: 'error',
      wcagCriterion: '1.3.1 Info and Relationships',
      suggestion: 'Add <main> element or role="main"',
    });
  }

  return issues;
}

export function generateAccessibilityReport(): {
  errors: number;
  warnings: number;
  infos: number;
  issues: AccessibilityIssue[];
  score: number;
} {
  const issues = auditPageAccessibility();
  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  const infos = issues.filter((i) => i.severity === 'info').length;

  const totalChecks = 100;
  const score = Math.max(0, totalChecks - errors * 10 - warnings * 5 - infos);

  return {
    errors,
    warnings,
    infos,
    issues,
    score,
  };
}

export function logAccessibilityReport(): void {
  if (process.env.NODE_ENV === 'development') {
    const report = generateAccessibilityReport();

    console.group('🔍 Accessibility Audit Report');
    console.log(`Score: ${report.score}/100`);
    console.log(`Errors: ${report.errors}`);
    console.log(`Warnings: ${report.warnings}`);
    console.log(`Info: ${report.infos}`);

    if (report.issues.length > 0) {
      console.table(
        report.issues.map((issue) => ({
          Severity: issue.severity,
          Element: issue.element,
          Issue: issue.issue,
          WCAG: issue.wcagCriterion || 'N/A',
        }))
      );
    } else {
      console.log('✅ No accessibility issues found!');
    }

    console.groupEnd();
  }
}
