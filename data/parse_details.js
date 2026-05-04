/**
 * Parse keychain product details from made-in-china.com product page HTML
 * Converts USD to VND
 * 
 * Usage: node parse_details.js [input.html] [output.json] [usd_to_vnd_rate]
 */

const fs = require("fs");
const path = require("path");

const inputFile = process.argv[2] || "keychain-details.html";
const outputFile = process.argv[3] || "keychain_details.json";
const USD_TO_VND = parseFloat(process.argv[4]) || 25000; // Default rate

function convertUSDToVND(usdString) {
  // Extract numbers from strings like "US$0.78" or "US$ 0.1-0.65"
  const matches = usdString.match(/[\d.]+/g);
  if (!matches) return null;
  
  if (matches.length === 1) {
    const vnd = parseFloat(matches[0]) * USD_TO_VND;
    return {
      usd: `US$${matches[0]}`,
      vnd: `${Math.round(vnd).toLocaleString('vi-VN')} VND`,
      vnd_value: Math.round(vnd)
    };
  } else if (matches.length >= 2) {
    const vndMin = parseFloat(matches[0]) * USD_TO_VND;
    const vndMax = parseFloat(matches[1]) * USD_TO_VND;
    return {
      usd: `US$${matches[0]}-${matches[1]}`,
      vnd: `${Math.round(vndMin).toLocaleString('vi-VN')}-${Math.round(vndMax).toLocaleString('vi-VN')} VND`,
      vnd_min: Math.round(vndMin),
      vnd_max: Math.round(vndMax)
    };
  }
  return null;
}

function parseProductDetails(html) {
  const product = {};

  // Product title
  const titleMatch = html.match(/<h1 class="sr-proMainInfo-baseInfoH1[^"]*"[^>]*>\s*<span[^>]*><\/span>\s*<span>([^<]+)<\/span>/);
  if (titleMatch) {
    product.title = titleMatch[1].trim();
  }

  // Product ID
  const idMatch = html.match(/id="productId" value="([^"]+)"/);
  if (idMatch) {
    product.product_id = idMatch[1];
  }

  // Price tiers
  const priceTiers = [];
  const priceRegex = /<div class="swiper-money-container">([^<]+)<\/div>\s*<div class="swiper-unit-container">([^<]+)<span class="unit">([^<]+)<\/span>/g;
  let priceMatch;
  while ((priceMatch = priceRegex.exec(html)) !== null) {
    const usdPrice = priceMatch[1].trim();
    const quantity = priceMatch[2].trim();
    const unit = priceMatch[3].trim();
    
    const converted = convertUSDToVND(usdPrice);
    priceTiers.push({
      quantity: quantity + " " + unit,
      price_usd: usdPrice,
      price_vnd: converted ? converted.vnd : null,
      vnd_value: converted ? converted.vnd_value : null
    });
  }
  product.price_tiers = priceTiers;

  // Sample price
  const sampleMatch = html.match(/<span class="sample-price[^"]*">US\$ ([^<]+)<\/span>/);
  if (sampleMatch) {
    const converted = convertUSDToVND(`US$${sampleMatch[1]}`);
    product.sample_price = {
      usd: `US$${sampleMatch[1]}`,
      vnd: converted ? converted.vnd : null,
      vnd_value: converted ? converted.vnd_value : null
    };
  }

  // Product specifications from table
  const specs = {};
  const specRegex = /<th[^>]*class="th-label"[^>]*>([^:]+):<\/th>\s*<td>([^<]+)<\/td>/g;
  let specMatch;
  while ((specMatch = specRegex.exec(html)) !== null) {
    const key = specMatch[1].trim().toLowerCase().replace(/\s+/g, '_');
    const value = specMatch[2].trim();
    specs[key] = value;
  }
  product.specifications = specs;

  // Supplier info
  const supplierMatch = html.match(/<a href="([^"]+)" target="_blank" ads-data="st:3" title="([^"]+)"/);
  if (supplierMatch) {
    let supplierUrl = supplierMatch[1];
    if (supplierUrl.startsWith("//")) supplierUrl = "https:" + supplierUrl;
    product.supplier = {
      name: supplierMatch[2],
      url: supplierUrl
    };
  }

  // Supplier location
  const locationMatch = html.match(/<div class="tip-con">\s*([^<]+?),\s*China\s*<\/div>/);
  if (locationMatch) {
    product.supplier.location = locationMatch[1].trim() + ", China";
  }

  // Payment methods
  const paymentMethods = [];
  const paymentRegex = /alt="([^"]+)" (?:data=""|style="display: inline;")/g;
  let paymentMatch;
  while ((paymentMatch = paymentRegex.exec(html)) !== null) {
    const method = paymentMatch[1];
    if (!paymentMethods.includes(method) && method.length < 30) {
      paymentMethods.push(method);
    }
  }
  product.payment_methods = paymentMethods;

  // Rating
  const ratingMatch = html.match(/<span class="review-score">([^<]+)<\/span>/);
  if (ratingMatch) {
    product.rating = parseFloat(ratingMatch[1]);
  }

  // Images - extract all product images
  const images = [];
  const imgRegex = /data-original="(https:\/\/image\.made-in-china\.com[^"]+)"/g;
  let imgMatch;
  const seenImages = new Set();
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const imgUrl = imgMatch[1];
    if (!seenImages.has(imgUrl) && imgUrl.includes('.webp')) {
      images.push(imgUrl);
      seenImages.add(imgUrl);
    }
  }
  product.images = images.slice(0, 10); // Limit to first 10 unique images

  return product;
}

const html = fs.readFileSync(path.resolve(__dirname, inputFile), "utf-8");
const product = parseProductDetails(html);

// Add metadata
product.currency_rate = {
  usd_to_vnd: USD_TO_VND,
  note: "Exchange rate used for conversion"
};

fs.writeFileSync(
  path.resolve(__dirname, outputFile),
  JSON.stringify(product, null, 2),
  "utf-8"
);

console.log(`Extracted product details → ${outputFile}`);
console.log(`Title: ${product.title}`);
console.log(`Price tiers: ${product.price_tiers.length}`);
console.log(`USD to VND rate: ${USD_TO_VND}`);
