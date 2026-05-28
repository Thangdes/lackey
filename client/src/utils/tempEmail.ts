export function generateTempEmail(
  prefix: string = "guest", 
  domain: string = "temp.hatx.com.vn"
): string {
  const timestamp = Date.now().toString(36); 
  const randomPart = Math.random().toString(36).substring(2, 8); 
  
  return `${prefix}-${timestamp}-${randomPart}@${domain}`;
}

export function generatePersonalizedTempEmail(
  fullName?: string,
  phone?: string,
  domain: string = "temp.hatx.com.vn"
): string {
  const cleanName = fullName?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '') 
    .substring(0, 10) || "guest";
  
  const cleanPhone = phone?.replace(/[^0-9]/g, '').substring(-4) || ""; 
  const timestamp = Date.now().toString(36).substring(-4); 
  
  if (cleanPhone) {
    return `${cleanName}.${cleanPhone}.${timestamp}@${domain}`;
  }
  
  return `${cleanName}.${timestamp}@${domain}`;
}

export function isTempEmail(email: string): boolean {
  return email.includes('@temp.hatx.com.vn') || 
         email.includes('@temp.') ||
         email.startsWith('guest-');
}


export function parseTempEmailInfo(email: string): {
  prefix: string;
  timestamp?: string;
  phone?: string;
  isPersonalized: boolean;
} | null {
  if (!isTempEmail(email)) return null;
  
  const [localPart] = email.split('@');
  
  if (localPart.includes('.') && !localPart.startsWith('guest-')) {
    const parts = localPart.split('.');
    return {
      prefix: parts[0],
      phone: parts[1]?.length === 4 ? parts[1] : undefined,
      timestamp: parts[parts.length - 1],
      isPersonalized: true
    };
  }
  
  if (localPart.startsWith('guest-')) {
    const parts = localPart.split('-');
    return {
      prefix: parts[0],
      timestamp: parts[1],
      isPersonalized: false
    };
  }
  
  return {
    prefix: localPart,
    isPersonalized: false
  };
}


export function getDisplayEmail(email: string, maxLength: number = 30): string {
  if (email.length <= maxLength) return email;
  
  const [localPart, domain] = email.split('@');
  const availableLocal = maxLength - domain.length - 4;
  
  if (availableLocal <= 3) return `${email.substring(0, maxLength - 3)}...`;
  
  return `${localPart.substring(0, availableLocal)}...@${domain}`;
}
