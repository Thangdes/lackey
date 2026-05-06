# Hướng Dẫn Tạo Data - Products (Keyboard & Kit)

## Cấu trúc Product Model

Dựa trên schema Prisma, một Product bao gồm:
- **Product**: Thông tin chính về sản phẩm
- **ProductVariant**: Các biến thể (màu sắc, phiên bản, v.v.)
- **Category**: Danh mục sản phẩm
- **Brand**: Thương hiệu
- **Supplier**: Nhà cung cấp
- **Tags**: Các thẻ tag

---

## 1. Categories (Danh mục)

### Ví dụ Categories cho Keyboard Shop:

```json
[
  {
    "name": "Mechanical Keyboards",
    "slug": "mechanical-keyboards",
    "description": "Bàn phím cơ cao cấp với nhiều loại switch",
    "thumbnailUrl": "/images/categories/mechanical-keyboards.jpg"
  },
  {
    "name": "Custom Keyboard Kits",
    "slug": "custom-keyboard-kits",
    "description": "Bộ kit tự lắp ráp bàn phím theo sở thích",
    "thumbnailUrl": "/images/categories/keyboard-kits.jpg"
  },
  {
    "name": "Keycaps",
    "slug": "keycaps",
    "description": "Bộ keycap thay thế đa dạng màu sắc và chất liệu",
    "thumbnailUrl": "/images/categories/keycaps.jpg"
  },
  {
    "name": "Switches",
    "slug": "switches",
    "description": "Switch cơ các loại: Linear, Tactile, Clicky",
    "thumbnailUrl": "/images/categories/switches.jpg"
  },
  {
    "name": "Keyboard Accessories",
    "slug": "keyboard-accessories",
    "description": "Phụ kiện bàn phím: cable, foam, lube, v.v.",
    "thumbnailUrl": "/images/categories/accessories.jpg"
  }
]
```

---

## 2. Brands (Thương hiệu)

```json
[
  {
    "name": "Keychron",
    "slug": "keychron",
    "isActive": true
  },
  {
    "name": "Akko",
    "slug": "akko",
    "isActive": true
  },
  {
    "name": "Monsgeek",
    "slug": "monsgeek",
    "isActive": true
  },
  {
    "name": "GMMK",
    "slug": "gmmk",
    "isActive": true
  },
  {
    "name": "Razer",
    "slug": "razer",
    "isActive": true
  },
  {
    "name": "Logitech",
    "slug": "logitech",
    "isActive": true
  },
  {
    "name": "Ducky",
    "slug": "ducky",
    "isActive": true
  },
  {
    "name": "Leopold",
    "slug": "leopold",
    "isActive": true
  }
]
```

---

## 3. Tags (Thẻ tag)

```json
[
  {
    "name": "Hot-swap",
    "slug": "hot-swap",
    "isActive": true
  },
  {
    "name": "RGB",
    "slug": "rgb",
    "isActive": true
  },
  {
    "name": "Wireless",
    "slug": "wireless",
    "isActive": true
  },
  {
    "name": "75% Layout",
    "slug": "75-layout",
    "isActive": true
  },
  {
    "name": "65% Layout",
    "slug": "65-layout",
    "isActive": true
  },
  {
    "name": "TKL",
    "slug": "tkl",
    "isActive": true
  },
  {
    "name": "Full Size",
    "slug": "full-size",
    "isActive": true
  },
  {
    "name": "Gasket Mount",
    "slug": "gasket-mount",
    "isActive": true
  },
  {
    "name": "Aluminum Case",
    "slug": "aluminum-case",
    "isActive": true
  },
  {
    "name": "PBT Keycaps",
    "slug": "pbt-keycaps",
    "isActive": true
  }
]
```

---

## 4. Suppliers (Nhà cung cấp)

```json
[
  {
    "name": "KeyboardVN Official",
    "contactName": "Nguyễn Văn A",
    "email": "supplier@keyboardvn.com",
    "phone": "0901234567",
    "address": "123 Nguyễn Huệ, Q1, TP.HCM",
    "description": "Nhà phân phối chính thức các thương hiệu keyboard",
    "isActive": true
  },
  {
    "name": "MechKey Store",
    "contactName": "Trần Thị B",
    "email": "contact@mechkey.vn",
    "phone": "0912345678",
    "address": "456 Lê Lợi, Q1, TP.HCM",
    "description": "Chuyên cung cấp keyboard custom và phụ kiện",
    "isActive": true
  }
]
```

---

## 5. Products - 20 Sản phẩm Keyboard & Kit

### Product 1-5: Mechanical Keyboards

```json
[
  {
    "name": "Keychron K8 Pro QMK/VIA Wireless",
    "slug": "keychron-k8-pro-qmk-via-wireless",
    "categoryId": "[ID của Mechanical Keyboards]",
    "supplierId": "[ID của Supplier]",
    "brandId": "[ID của Keychron]",
    "description": "Bàn phím cơ TKL 87 phím, hỗ trợ QMK/VIA, kết nối không dây và có dây. Hot-swap switch, RGB backlight, pin 4000mAh.",
    "thumbnailUrl": "/images/products/keychron-k8-pro.jpg",
    "images": [
      "/images/products/keychron-k8-pro-1.jpg",
      "/images/products/keychron-k8-pro-2.jpg",
      "/images/products/keychron-k8-pro-3.jpg"
    ],
    "isActive": true,
    "initialBuyCount": 150,
    "buyCount": 150,
    "ratingAvg": 4.8,
    "ratingCount": 45,
    "variants": [
      {
        "name": "Keychron K8 Pro - Gateron G Pro Red",
        "sku": "K8PRO-RED-001",
        "price": 2890000,
        "discountPrice": 2590000,
        "stockQuantity": 25
      },
      {
        "name": "Keychron K8 Pro - Gateron G Pro Brown",
        "sku": "K8PRO-BROWN-001",
        "price": 2890000,
        "discountPrice": 2590000,
        "stockQuantity": 30
      },
      {
        "name": "Keychron K8 Pro - Gateron G Pro Blue",
        "sku": "K8PRO-BLUE-001",
        "price": 2890000,
        "discountPrice": null,
        "stockQuantity": 20
      }
    ],
    "tags": ["Hot-swap", "RGB", "Wireless", "TKL"]
  },
  {
    "name": "Akko 3098B Multi-Mode Mechanical Keyboard",
    "slug": "akko-3098b-multi-mode",
    "categoryId": "[ID của Mechanical Keyboards]",
    "supplierId": "[ID của Supplier]",
    "brandId": "[ID của Akko]",
    "description": "Bàn phím cơ 98 phím compact, kết nối đa chế độ (Bluetooth 5.0, 2.4GHz, USB-C). Hot-swap, pin 3000mAh, hỗ trợ Mac/Win.",
    "thumbnailUrl": "/images/products/akko-3098b.jpg",
    "images": [
      "/images/products/akko-3098b-1.jpg",
      "/images/products/akko-3098b-2.jpg"
    ],
    "isActive": true,
    "initialBuyCount": 200,
    "buyCount": 200,
    "ratingAvg": 4.6,
    "ratingCount": 67,
    "variants": [
      {
        "name": "Akko 3098B - Black & Pink",
        "sku": "AKKO-3098B-BP-001",
        "price": 1890000,
        "discountPrice": 1690000,
        "stockQuantity": 40
      },
      {
        "name": "Akko 3098B - World Tour Tokyo",
        "sku": "AKKO-3098B-WT-001",
        "price": 2190000,
        "discountPrice": null,
        "stockQuantity": 25
      }
    ],
    "tags": ["Hot-swap", "RGB", "Wireless", "Full Size"]
  },
  {
    "name": "Monsgeek M1 V3 Aluminum Keyboard",
    "slug": "monsgeek-m1-v3-aluminum",
    "categoryId": "[ID của Mechanical Keyboards]",
    "supplierId": "[ID của Supplier]",
    "brandId": "[ID của Monsgeek]",
    "description": "Bàn phím cơ 75% layout, vỏ nhôm CNC cao cấp, gasket mount, hot-swap 5-pin, foam tiêu âm đa lớp. Trải nghiệm gõ êm ái.",
    "thumbnailUrl": "/images/products/monsgeek-m1-v3.jpg",
    "images": [
      "/images/products/monsgeek-m1-v3-1.jpg",
      "/images/products/monsgeek-m1-v3-2.jpg",
      "/images/products/monsgeek-m1-v3-3.jpg"
    ],
    "isActive": true,
    "initialBuyCount": 80,
    "buyCount": 80,
    "ratingAvg": 4.9,
    "ratingCount": 32,
    "variants": [
      {
        "name": "Monsgeek M1 V3 - Black",
        "sku": "MSG-M1V3-BLK-001",
        "price": 3290000,
        "discountPrice": 2990000,
        "stockQuantity": 15
      },
      {
        "name": "Monsgeek M1 V3 - Silver",
        "sku": "MSG-M1V3-SLV-001",
        "price": 3290000,
        "discountPrice": 2990000,
        "stockQuantity": 12
      }
    ],
    "tags": ["Hot-swap", "75% Layout", "Gasket Mount", "Aluminum Case"]
  },
  {
    "name": "GMMK Pro 75% Barebone Kit",
    "slug": "gmmk-pro-75-barebone",
    "categoryId": "[ID của Mechanical Keyboards]",
    "supplierId": "[ID của Supplier]",
    "brandId": "[ID của GMMK]",
    "description": "Bàn phím custom 75% layout, vỏ nhôm anodized, gasket mount, hot-swap, RGB per-key. Barebone kit không bao gồm switch và keycap.",
    "thumbnailUrl": "/images/products/gmmk-pro.jpg",
    "images": [
      "/images/products/gmmk-pro-1.jpg",
      "/images/products/gmmk-pro-2.jpg"
    ],
    "isActive": true,
    "initialBuyCount": 60,
    "buyCount": 60,
    "ratingAvg": 4.7,
    "ratingCount": 28,
    "variants": [
      {
        "name": "GMMK Pro - Black Slate",
        "sku": "GMMK-PRO-BLK-001",
        "price": 4590000,
        "discountPrice": null,
        "stockQuantity": 10
      },
      {
        "name": "GMMK Pro - White Ice",
        "sku": "GMMK-PRO-WHT-001",
        "price": 4590000,
        "discountPrice": null,
        "stockQuantity": 8
      }
    ],
    "tags": ["Hot-swap", "75% Layout", "Gasket Mount", "Aluminum Case", "RGB"]
  },
  {
    "name": "Ducky One 3 TKL Mechanical Keyboard",
    "slug": "ducky-one-3-tkl",
    "categoryId": "[ID của Mechanical Keyboards]",
    "supplierId": "[ID của Supplier]",
    "brandId": "[ID của Ducky]",
    "description": "Bàn phím cơ TKL chất lượng cao, keycap PBT Double-shot, RGB backlight, build quality tuyệt vời. Không hot-swap.",
    "thumbnailUrl": "/images/products/ducky-one3-tkl.jpg",
    "images": [
      "/images/products/ducky-one3-tkl-1.jpg",
      "/images/products/ducky-one3-tkl-2.jpg"
    ],
    "isActive": true,
    "initialBuyCount": 120,
    "buyCount": 120,
    "ratingAvg": 4.8,
    "ratingCount": 52,
    "variants": [
      {
        "name": "Ducky One 3 TKL - Cherry MX Red",
        "sku": "DUCKY-ONE3-RED-001",
        "price": 3190000,
        "discountPrice": 2890000,
        "stockQuantity": 18
      },
      {
        "name": "Ducky One 3 TKL - Cherry MX Brown",
        "sku": "DUCKY-ONE3-BRN-001",
        "price": 3190000,
        "discountPrice": 2890000,
        "stockQuantity": 22
      },
      {
        "name": "Ducky One 3 TKL - Cherry MX Blue",
        "sku": "DUCKY-ONE3-BLU-001",
        "price": 3190000,
        "discountPrice": null,
        "stockQuantity": 15
      }
    ],
    "tags": ["RGB", "TKL", "PBT Keycaps"]
  }
]
```

### Product 6-10: Custom Keyboard Kits

```json
[
  {
    "name": "Keychron Q1 Pro QMK Custom Kit",
    "slug": "keychron-q1-pro-qmk-custom-kit",
    "categoryId": "[ID của Custom Keyboard Kits]",
    "supplierId": "[ID của Supplier]",
    "brandId": "[ID của Keychron]",
    "description": "Kit bàn phím custom 75% layout, vỏ nhôm CNC, gasket mount, hot-swap, QMK/VIA. Bao gồm: case, PCB, plate, stabilizers, foam.",
    "thumbnailUrl": "/images/products/keychron-q1-pro-kit.jpg",
    "images": [
      "/images/products/keychron-q1-pro-kit-1.jpg",
      "/images/products/keychron-q1-pro-kit-2.jpg"
    ],
    "isActive": true,
    "initialBuyCount": 45,
    "buyCount": 45,
    "ratingAvg": 4.9,
    "ratingCount": 18,
    "variants": [
      {
        "name": "Keychron Q1 Pro Kit - Carbon Black",
        "sku": "Q1PRO-KIT-BLK-001",
        "price": 4290000,
        "discountPrice": 3990000,
        "stockQuantity": 8
      },
      {
        "name": "Keychron Q1 Pro Kit - Shell White",
        "sku": "Q1PRO-KIT-WHT-001",
        "price": 4290000,
        "discountPrice": 3990000,
        "stockQuantity": 6
      }
    ],
    "tags": ["Hot-swap", "75% Layout", "Gasket Mount", "Aluminum Case"]
  },
  {
    "name": "Akko MOD007B-HE Hall Effect Kit",
    "slug": "akko-mod007b-he-hall-effect-kit",
    "categoryId": "[ID của Custom Keyboard Kits]",
    "supplierId": "[ID của Supplier]",
    "brandId": "[ID của Akko]",
    "description": "Kit bàn phím Hall Effect 75%, vỏ nhôm, gasket mount. Công nghệ Hall Effect cho phép điều chỉnh actuation point. Barebone kit.",
    "thumbnailUrl": "/images/products/akko-mod007b-he.jpg",
    "images": [
      "/images/products/akko-mod007b-he-1.jpg",
      "/images/products/akko-mod007b-he-2.jpg"
    ],
    "isActive": true,
    "initialBuyCount": 30,
    "buyCount": 30,
    "ratingAvg": 4.7,
    "ratingCount": 12,
    "variants": [
      {
        "name": "Akko MOD007B-HE Kit - Black & Gold",
        "sku": "AKKO-MOD007B-HE-001",
        "price": 3790000,
        "discountPrice": null,
        "stockQuantity": 10
      }
    ],
    "tags": ["75% Layout", "Gasket Mount", "Aluminum Case"]
  },
  {
    "name": "Monsgeek M3 65% Aluminum Kit",
    "slug": "monsgeek-m3-65-aluminum-kit",
    "categoryId": "[ID của Custom Keyboard Kits]",
    "supplierId": "[ID của Supplier]",
    "brandId": "[ID của Monsgeek]",
    "description": "Kit bàn phím 65% compact, vỏ nhôm CNC, gasket mount, hot-swap 5-pin, foam đa lớp. Thiết kế tối giản, chất lượng cao.",
    "thumbnailUrl": "/images/products/monsgeek-m3.jpg",
    "images": [
      "/images/products/monsgeek-m3-1.jpg",
      "/images/products/monsgeek-m3-2.jpg"
    ],
    "isActive": true,
    "initialBuyCount": 50,
    "buyCount": 50,
    "ratingAvg": 4.8,
    "ratingCount": 22,
    "variants": [
      {
        "name": "Monsgeek M3 Kit - Black",
        "sku": "MSG-M3-BLK-001",
        "price": 2790000,
        "discountPrice": 2490000,
        "stockQuantity": 12
      },
      {
        "name": "Monsgeek M3 Kit - Navy Blue",
        "sku": "MSG-M3-NVY-001",
        "price": 2790000,
        "discountPrice": 2490000,
        "stockQuantity": 10
      }
    ],
    "tags": ["Hot-swap", "65% Layout", "Gasket Mount", "Aluminum Case"]
  },
  {
    "name": "GMMK 2 65% Barebone Kit",
    "slug": "gmmk-2-65-barebone-kit",
    "categoryId": "[ID của Custom Keyboard Kits]",
    "supplierId": "[ID của Supplier]",
    "brandId": "[ID của GMMK]",
    "description": "Kit bàn phím 65% layout, hot-swap, RGB per-key, foam tiêu âm. Giá cả phải chăng cho người mới bắt đầu custom keyboard.",
    "thumbnailUrl": "/images/products/gmmk2-65.jpg",
    "images": [
      "/images/products/gmmk2-65-1.jpg"
    ],
    "isActive": true,
    "initialBuyCount": 70,
    "buyCount": 70,
    "ratingAvg": 4.5,
    "ratingCount": 35,
    "variants": [
      {
        "name": "GMMK 2 65% Kit - Black",
        "sku": "GMMK2-65-BLK-001",
        "price": 1990000,
        "discountPrice": 1790000,
        "stockQuantity": 20
      },
      {
        "name": "GMMK 2 65% Kit - White",
        "sku": "GMMK2-65-WHT-001",
        "price": 1990000,
        "discountPrice": 1790000,
        "stockQuantity": 18
      }
    ],
    "tags": ["Hot-swap", "65% Layout", "RGB"]
  },
  {
    "name": "Leopold FC750R PD TKL Kit",
    "slug": "leopold-fc750r-pd-tkl-kit",
    "categoryId": "[ID của Custom Keyboard Kits]",
    "supplierId": "[ID của Supplier]",
    "brandId": "[ID của Leopold]",
    "description": "Kit bàn phím TKL chất lượng cao từ Leopold, keycap PBT Double-shot, build quality tuyệt vời. Không hot-swap.",
    "thumbnailUrl": "/images/products/leopold-fc750r.jpg",
    "images": [
      "/images/products/leopold-fc750r-1.jpg"
    ],
    "isActive": true,
    "initialBuyCount": 40,
    "buyCount": 40,
    "ratingAvg": 4.9,
    "ratingCount": 15,
    "variants": [
      {
        "name": "Leopold FC750R PD - Navy/White",
        "sku": "LEOPOLD-FC750R-NW-001",
        "price": 3490000,
        "discountPrice": null,
        "stockQuantity": 8
      }
    ],
    "tags": ["TKL", "PBT Keycaps"]
  }
]
```

---

## Lưu ý khi tạo data:

1. **ObjectId**: Khi import vào MongoDB, các trường `categoryId`, `supplierId`, `brandId` cần là ObjectId hợp lệ
2. **Slug**: Phải unique và URL-friendly
3. **SKU**: Mỗi variant phải có SKU unique
4. **Price**: Giá tính bằng VNĐ
5. **Images**: Đường dẫn ảnh phải tồn tại trong thư mục public
6. **Tags**: Cần tạo ProductTag records để liên kết Product với Tag

---

## Script Import (Tham khảo)

```typescript
// Ví dụ import một product với variants
const category = await prisma.category.findUnique({ where: { slug: 'mechanical-keyboards' } });
const supplier = await prisma.supplier.findUnique({ where: { email: 'supplier@keyboardvn.com' } });
const brand = await prisma.brand.findUnique({ where: { slug: 'keychron' } });

const product = await prisma.product.create({
  data: {
    name: "Keychron K8 Pro QMK/VIA Wireless",
    slug: "keychron-k8-pro-qmk-via-wireless",
    categoryId: category.id,
    supplierId: supplier.id,
    brandId: brand.id,
    description: "...",
    thumbnailUrl: "/images/products/keychron-k8-pro.jpg",
    images: ["..."],
    isActive: true,
    initialBuyCount: 150,
    buyCount: 150,
    ratingAvg: 4.8,
    ratingCount: 45,
    variants: {
      create: [
        {
          name: "Keychron K8 Pro - Gateron G Pro Red",
          sku: "K8PRO-RED-001",
          price: 2890000,
          discountPrice: 2590000,
          stockQuantity: 25
        }
      ]
    }
  }
});
```
