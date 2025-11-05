export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve({ width: 1200, height: 630 });
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function generateSrcSet(src: string, widths: number[] = [640, 750, 828, 1080, 1200, 1920]): string {
  if (!src) return '';
  
  const isCloudinary = src.includes('cloudinary.com');
  
  if (isCloudinary) {
    return widths
      .map(w => {
        const cloudinaryUrl = src.replace('/upload/', `/upload/w_${w},f_auto,q_auto/`);
        return `${cloudinaryUrl} ${w}w`;
      })
      .join(', ');
  }
  
  return widths.map(w => `${src}?w=${w} ${w}w`).join(', ');
}

export function getOptimizedImageUrl(src: string, width?: number, quality: number = 85): string {
  if (!src) return '';
  
  const isCloudinary = src.includes('cloudinary.com');
  
  if (isCloudinary) {
    let transform = 'f_auto,q_auto';
    if (width) {
      transform += `,w_${width}`;
    }
    if (quality && quality !== 85) {
      transform += `,q_${quality}`;
    }
    return src.replace('/upload/', `/upload/${transform}/`);
  }
  
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  params.set('q', quality.toString());
  
  return `${src}${src.includes('?') ? '&' : '?'}${params.toString()}`;
}

export function convertToWebP(src: string): string {
  if (!src) return '';
  
  const isCloudinary = src.includes('cloudinary.com');
  
  if (isCloudinary) {
    return src.replace('/upload/', '/upload/f_webp,q_auto/');
  }
  
  return src;
}

export function getBlurDataURL(width: number = 10, height: number = 10): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f3f4f6"/>
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}
