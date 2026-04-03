/**
 * Utility functions to help with ProductVariant name generation
 * Automatically appends weight to variant name to avoid admin missing weight info
 */

/**
 * Generate variant name with weight appended
 * @param baseName - Base name without weight (e.g., "Hạt điều rang muối")
 * @param weight - Weight in grams (e.g., 500)
 * @returns Complete variant name with weight (e.g., "Hạt điều rang muối (500g)")
 */
export function generateVariantNameWithWeight(baseName: string, weight: number | string): string {
  const cleanBaseName = baseName.trim();
  const weightNum = typeof weight === 'string' ? parseInt(weight) : weight;
  
  if (!cleanBaseName) return '';
  if (!weightNum || weightNum <= 0) return cleanBaseName;
  
  // Check if weight is already in the name to avoid duplication
  const weightPattern = /\(\d+g?\)|\d+g\b|\d+\s*gram/i;
  if (weightPattern.test(cleanBaseName)) {
    return cleanBaseName; // Already has weight info
  }
  
  // Format weight appropriately
  let weightText: string;
  if (weightNum >= 1000 && weightNum % 1000 === 0) {
    // Convert to kg if it's a whole number of kg
    weightText = `${weightNum / 1000}kg`;
  } else {
    weightText = `${weightNum}g`;
  }
  
  return `${cleanBaseName} (${weightText})`;
}

/**
 * Extract base name from variant name (remove weight info)
 * @param variantName - Full variant name (e.g., "Hạt điều rang muối (500g)")
 * @returns Base name without weight (e.g., "Hạt điều rang muối")
 */
export function extractBaseNameFromVariant(variantName: string): string {
  if (!variantName) return '';
  
  // Remove weight patterns: (500g), (1kg), 500g, 1kg, etc.
  return variantName
    .replace(/\s*\(\d+(?:\.\d+)?(?:g|kg|gram|kilogram)?\)\s*$/i, '') // Remove (500g) at end
    .replace(/\s+\d+(?:\.\d+)?(?:g|kg|gram|kilogram)\s*$/i, '') // Remove 500g at end
    .trim();
}

/**
 * Extract weight from variant name
 * @param variantName - Full variant name (e.g., "Hạt điều rang muối (500g)")
 * @returns Weight in grams or null if not found
 */
export function extractWeightFromVariantName(variantName: string): number | null {
  if (!variantName) return null;
  
  // Try to match weight patterns
  const patterns = [
    /\((\d+(?:\.\d+)?)g\)/i,           // (500g)
    /\((\d+(?:\.\d+)?)kg\)/i,          // (1kg) -> convert to grams
    /(\d+(?:\.\d+)?)g\b/i,             // 500g
    /(\d+(?:\.\d+)?)kg\b/i,            // 1kg -> convert to grams
    /(\d+(?:\.\d+)?)\s*gram/i,         // 500 gram
    /(\d+(?:\.\d+)?)\s*kilogram/i,     // 1 kilogram -> convert to grams
  ];
  
  for (const pattern of patterns) {
    const match = variantName.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      if (isNaN(value)) continue;
      
      // Convert kg to grams if needed
      if (pattern.source.includes('kg') || pattern.source.includes('kilogram')) {
        return Math.round(value * 1000);
      }
      return Math.round(value);
    }
  }
  
  return null;
}

/**
 * Validate and suggest variant name based on base name and weight
 * @param baseName - Base name input by admin
 * @param weight - Weight input by admin
 * @returns Object with suggested name and validation info
 */
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
  
  // Check if name already contains weight
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

// Example usage and test cases
export const VARIANT_NAME_EXAMPLES = {
  // Input: baseName="Hạt điều rang muối", weight=500
  // Output: "Hạt điều rang muối (500g)"
  
  // Input: baseName="Hạt điều cao cấp", weight=1000  
  // Output: "Hạt điều cao cấp (1kg)"
  
  // Input: baseName="Hạt điều rang muối (500g)", weight=500
  // Output: "Hạt điều rang muối (500g)" (no duplication)
  
  // Input: baseName="Hạt điều rang muối", weight=""
  // Output: "Hạt điều rang muối" (no weight added)
};
