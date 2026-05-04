# Keychain Data Extraction Tools

Công cụ parse dữ liệu keychain từ made-in-china.com

## Files

- `parse_keychain.js` - Parse danh sách sản phẩm từ trang search
- `parse_details.js` - Parse chi tiết sản phẩm từ trang product detail
- `keychain_products.json` - Output: danh sách sản phẩm
- `keychain_details.json` - Output: chi tiết 1 sản phẩm

## Cách sử dụng

### 1. Parse danh sách sản phẩm

```bash
node parse_keychain.js [input.html] [output.json]
```

**Ví dụ:**
```bash
node parse_keychain.js keychain.html keychain_products.json
```

**Output format:**
```json
[
  {
    "url": "https://...",
    "title": "Product name",
    "price": "US$ 0.1-0.65",
    "price_unit": "Piece",
    "min_order": "50 Pieces (Min. Order)",
    "supplier": "Company name",
    "supplier_url": "https://...",
    "image": "https://...",
    "has_video": true,
    "is_sample": true
  }
]
```

### 2. Parse chi tiết sản phẩm

```bash
node parse_details.js [input.html] [output.json] [usd_to_vnd_rate]
```

**Ví dụ:**
```bash
# Tỷ giá mặc định: 25,000 VND/USD
node parse_details.js keychain-details.html keychain_details.json

# Tùy chỉnh tỷ giá
node parse_details.js keychain-details.html keychain_details.json 25500
```

**Output format:**
```json
{
  "title": "Product name",
  "product_id": "WwAGTbfPVltL",
  "price_tiers": [
    {
      "quantity": "300-799 Pieces",
      "price_usd": "US$0.78",
      "price_vnd": "19.500 VND",
      "vnd_value": 19500
    }
  ],
  "sample_price": {
    "usd": "US$9.99/Piece",
    "vnd": "249.750 VND",
    "vnd_value": 249750
  },
  "specifications": {
    "customization": "Available",
    "usage": "Promotion Gifts",
    "metal_type": "Zinc Alloy"
  },
  "supplier": {
    "name": "Company name",
    "url": "https://...",
    "location": "Guangdong, China"
  },
  "payment_methods": ["T/T", "PayPal", "visa", ...],
  "rating": 5.0,
  "images": ["https://...", ...],
  "currency_rate": {
    "usd_to_vnd": 25000,
    "note": "Exchange rate used for conversion"
  }
}
```

## Workflow

1. **Lấy HTML từ trang search:**
   - Truy cập: https://trading.made-in-china.com/deals/multi-search/keychain/...
   - Save HTML → `keychain.html`
   - Chạy: `node parse_keychain.js`

2. **Lấy HTML từ trang chi tiết:**
   - Mở URL sản phẩm từ `keychain_products.json`
   - Save HTML → `keychain-details.html`
   - Chạy: `node parse_details.js keychain-details.html output.json 25000`

3. **Tự động hóa (tùy chọn):**
   - Sử dụng Puppeteer/Playwright để crawl tự động
   - Loop qua tất cả URLs trong `keychain_products.json`
   - Fetch và parse từng trang chi tiết

## Tỷ giá USD/VND

Tỷ giá mặc định: **25,000 VND/USD**

Để cập nhật tỷ giá, truyền tham số thứ 3:
```bash
node parse_details.js input.html output.json 25500
```

## Notes

- Scripts không cần thư viện ngoài (chỉ dùng Node.js built-in)
- HTML parsing dùng regex (đơn giản, nhanh)
- Hỗ trợ chuyển đổi USD → VND tự động
- Output là JSON chuẩn, dễ import vào database
