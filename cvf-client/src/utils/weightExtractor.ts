
export interface WeightExtractionResult {
  weight: number;
  source: 'sku' | 'name' | 'fallback';
  extractedText?: string;
}


function extractWeightFromText(text: string): { weight: number; extractedText: string } | null {
  if (!text) return null;

  const normalizedText = text.toLowerCase().trim();

  const patterns = [
    { regex: /(\d+(?:\.\d+)?)\s*g(?:ram)?s?(?:\s|$|[^\w])/i, multiplier: 1 },
    
    { regex: /(\d+(?:\.\d+)?)\s*kg(?:ilogram)?s?(?:\s|$|[^\w])/i, multiplier: 1000 },
    
    { regex: /(\d+(?:\.\d+)?)\s*gr(?:am)?s?(?:\s|$|[^\w])/i, multiplier: 1 },
    
    { regex: /\((\d+(?:\.\d+)?)\s*(?:g|kg|gr)(?:ram|ilogram)?s?\)/i, multiplier: (match: string) => match.includes('kg') ? 1000 : 1 },
    
    { regex: /(\d+(?:\.\d+)?)\s*(?:g|kg|gr)(?:ram|ilogram)?s?$/i, multiplier: (match: string) => match.includes('kg') ? 1000 : 1 }
  ];

  for (const pattern of patterns) {
    const match = normalizedText.match(pattern.regex);
    if (match) {
      const numericValue = parseFloat(match[1]);
      if (!isNaN(numericValue) && numericValue > 0) {
        const multiplier = typeof pattern.multiplier === 'function' 
          ? pattern.multiplier(match[0]) 
          : pattern.multiplier;
        
        return {
          weight: Math.round(numericValue * multiplier),
          extractedText: match[0].trim()
        };
      }
    }
  }

  return null;
}


export function extractProductWeight(
  sku?: string, 
  name?: string, 
  fallbackWeight: number = 200
): WeightExtractionResult {
  
  if (sku) {
    const skuResult = extractWeightFromText(sku);
    if (skuResult) {
      return {
        weight: skuResult.weight,
        source: 'sku',
        extractedText: skuResult.extractedText
      };
    }
  }

  if (name) {
    const nameResult = extractWeightFromText(name);
    if (nameResult) {
      return {
        weight: nameResult.weight,
        source: 'name',
        extractedText: nameResult.extractedText
      };
    }
  }

  return {
    weight: fallbackWeight,
    source: 'fallback'
  };
}


export function extractCartItemWeight(item: {
  sku?: string;
  variantName?: string;
  productName?: string;
}): WeightExtractionResult {
  return extractProductWeight(
    item.sku,
    item.variantName || item.productName,
    200
  );
}


export function logWeightExtraction(
  item: { sku?: string; variantName?: string; productName?: string },
  result: WeightExtractionResult,
  quantity: number
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[WEIGHT_DEBUG] Item: ${item.variantName || item.productName}`);
    console.log(`[WEIGHT_DEBUG] - SKU: ${item.sku || 'N/A'}`);
    console.log(`[WEIGHT_DEBUG] - Weight: ${result.weight}g (source: ${result.source}${result.extractedText ? `, extracted: "${result.extractedText}"` : ''})`);
    console.log(`[WEIGHT_DEBUG] - Quantity: ${quantity}`);
    console.log(`[WEIGHT_DEBUG] - Item total: ${result.weight * quantity}g`);
  }
}

export const WEIGHT_EXTRACTION_EXAMPLES = {
  'HĐ-500G': 500,
  'hat-dieu-500g': 500,
  'Hạt điều rang muối (500g)': 500,
  'Hạt điều 500gram': 500,
  'HĐ-1KG': 1000,
  'hat-dieu-1kg': 1000,
  'Hạt điều rang muối 1kg': 1000,
  'Hạt điều (1kilogram)': 1000,
  'HĐ-250GR': 250,
  'hat-dieu-250gr': 250,
  'HĐ-PREMIUM': 200,
  'Hạt điều cao cấp': 200,
  'CASHEW-DELUXE': 200
};
