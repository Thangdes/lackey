/**
 * Parse keychain product data from made-in-china.com HTML file
 * Output: keychain_products.json
 *
 * Usage: node parse_keychain.js [input.html] [output.json]
 */

const fs = require("fs");
const path = require("path");

const inputFile = process.argv[2] || "keychain.html";
const outputFile = process.argv[3] || "keychain_products.json";

// Minimal HTML parser using regex (no external deps needed)
function parseProducts(html) {
  const products = [];

  // Split by prod-item divs
  const itemRegex = /<div class="prod-item[^"]*"[^>]*ads-data="([^"]*)"[^>]*>([\s\S]*?)(?=<div class="prod-item|$)/g;
  let match;

  while ((match = itemRegex.exec(html)) !== null) {
    const adsData = match[1];
    const block = match[2];
    const product = {};

    // Title & product URL — from prod-title anchor
    const titleMatch = block.match(/<div class="prod-title">\s*<a href="([^"]+)"[^>]*title="([^"]+)"/);
    if (titleMatch) {
      product.url = titleMatch[1];
      product.title = titleMatch[2];
    } else {
      // fallback: skip items without title
      continue;
    }

    // Price
    const priceMatch = block.match(/<strong class="price">([^<]+)<\/strong>\s*\/\s*([^<\n]+)/);
    if (priceMatch) {
      product.price = priceMatch[1].trim();
      product.price_unit = priceMatch[2].trim();
    }

    // Min order
    const qtyNumMatch = block.match(/<span class="quantity-num">\s*([^<]+?)\s*<\/span>/);
    const qtyLabelMatch = block.match(/<span class="quantity-label">\s*([^<]+?)\s*<\/span>/);
    if (qtyNumMatch) {
      product.min_order = qtyNumMatch[1].trim();
      if (qtyLabelMatch) product.min_order += " " + qtyLabelMatch[1].trim();
    }

    // Supplier name & URL
    const supplierMatch = block.match(/class="com-link">\s*([^<]+?)\s*<\/a>/);
    const supplierUrlMatch = block.match(/class="prod-com">\s*<a href="([^"]+)"/);
    if (supplierMatch) {
      product.supplier = supplierMatch[1].trim();
    }
    if (supplierUrlMatch) {
      let sUrl = supplierUrlMatch[1];
      if (sUrl.startsWith("//")) sUrl = "https:" + sUrl;
      product.supplier_url = sUrl;
    }

    // First image (active slide or first img in prod-img)
    const imgMatch = block.match(/swiper-slide-active[^>]*>[\s\S]*?<img src="([^"]+)"/);
    const imgFallback = block.match(/<div class="prod-img[^"]*"[\s\S]*?<img src="([^"]+)"/);
    product.image = imgMatch ? imgMatch[1] : (imgFallback ? imgFallback[1] : "");

    // Has video
    product.has_video = block.includes("has-video-icon");

    // Sample available
    product.is_sample = adsData.includes("is_sample:1");

    products.push(product);
  }

  return products;
}

const html = fs.readFileSync(path.resolve(__dirname, inputFile), "utf-8");
const products = parseProducts(html);

fs.writeFileSync(
  path.resolve(__dirname, outputFile),
  JSON.stringify(products, null, 2),
  "utf-8"
);

console.log(`Extracted ${products.length} products → ${outputFile}`);
