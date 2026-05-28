










export function generateVariantNameWithWeight(baseName: string, weight: number | string): string {
  const cleanBaseName = baseName.trim();
  const weightNum = typeof weight === 'string' ? parseInt(weight) : weight;
  
  if (!cleanBaseName) return '';
  if (!weightNum || weightNum <= 0) return cleanBaseName;
  
  
  const weightPattern = /\(\d+g?\)|\d+g\b|\d+\s*gram/i;
  if (weightPattern.test(cleanBaseName)) {
    return cleanBaseName; 
  }
  
  
  let weightText: string;
  if (weightNum >= 1000 && weightNum % 1000 === 0) {
    
    weightText = `${weightNum / 1000}kg`;
  } else {
    weightText = `${weightNum}g`;
  }
  
  return `${cleanBaseName} (${weightText})`;
}






export function extractBaseNameFromVariant(variantName: string): string {
  if (!variantName) return '';
  
  
  return variantName
    .replace(/\s*\(\d+(?:\.\d+)?(?:g|kg|gram|kilogram)?\)\s*$/i, '') 
    .replace(/\s+\d+(?:\.\d+)?(?:g|kg|gram|kilogram)\s*$/i, '') 
    .trim();
}






export function extractWeightFromVariantName(variantName: string): number | null {
  if (!variantName) return null;
  
  
  const patterns = [
    /\((\d+(?:\.\d+)?)g\)/i,           
    /\((\d+(?:\.\d+)?)kg\)/i,          
    /(\d+(?:\.\d+)?)g\b/i,             
    /(\d+(?:\.\d+)?)kg\b/i,            
    /(\d+(?:\.\d+)?)\s*gram/i,         
    /(\d+(?:\.\d+)?)\s*kilogram/i,     
  ];
  
  for (const pattern of patterns) {
    const match = variantName.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      if (isNaN(value)) continue;
      
      
      if (pattern.source.includes('kg') || pattern.source.includes('kilogram')) {
        return Math.round(value * 1000);
      }
      return Math.round(value);
    }
  }
  
  return null;
}







export function validateAndSuggestVariantName(baseName: string, weight: string | number) {
  const cleanBaseName = baseName.trim();
  const weightNum = typeof weight === 'string' ? parseInt(weight) : weight;
  
  const result = {
    suggestedName: '',
    isValid: true,
    warnings: [] as string[],
    hasWeightInName: false,
  };
  
  if (!cleanBaseName) {
    result.isValid = false;
    result.warnings.push('Tên biến thể không được để trống');
    return result;
  }
  
  
  const existingWeight = extractWeightFromVariantName(cleanBaseName);
  result.hasWeightInName = existingWeight !== null;
  
  if (result.hasWeightInName && weightNum && weightNum !== existingWeight) {
    result.warnings.push(`Tên đã chứa khối lượng ${existingWeight}g, khác với khối lượng nhập ${weightNum}g`);
  }
  
  if (!weightNum || weightNum <= 0) {
    if (!result.hasWeightInName) {
      result.warnings.push('Nên nhập khối lượng để tự động thêm vào tên biến thể');
    }
    result.suggestedName = cleanBaseName;
  } else {
    result.suggestedName = generateVariantNameWithWeight(cleanBaseName, weightNum);
  }
  
  return result;
}


export const VARIANT_NAME_EXAMPLES = {
  
  
  
  
  
  
  
  
  
  
  
};
