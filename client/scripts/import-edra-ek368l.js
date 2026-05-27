/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Dữ liệu sản phẩm bàn phím E-Dra EK368L Beta
const newProduct = {
  id: "KB021",
  name: "Bàn phím cơ E-Dra không dây EK368L Beta",
  slug: "ban-phim-co-e-dra-khong-day-ek368l-beta",
  description: "Bàn phím cơ E-Dra EK368L Beta 68 phím với kết nối không dây 2.4G + Bluetooth 5.0. Switch Huano bền bỉ 50 triệu lần nhấn, keycap ABS DoubleShot in rõ nét. Layout mini-size tiết kiệm không gian, thời gian sử dụng lên đến 6 tháng. Tương thích đa nền tảng Windows và MacOS.",
  thumbnailUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop",
  variants: [
    {
      id: "v-KB021-yellow",
      name: "Yellow Switch - Trắng Xám",
      sku: "SKU-EK368L-BETA-YELLOW",
      price: 499000,
      stockQuantity: 35
    },
    {
      id: "v-KB021-blue",
      name: "Blue Switch - Trắng Xám",
      sku: "SKU-EK368L-BETA-BLUE",
      price: 499000,
      stockQuantity: 42
    },
    {
      id: "v-KB021-red",
      name: "Red Switch - Trắng Xám",
      sku: "SKU-EK368L-BETA-RED",
      price: 499000,
      stockQuantity: 38
    },
    {
      id: "v-KB021-brown",
      name: "Brown Switch - Trắng Xám",
      sku: "SKU-EK368L-BETA-BROWN",
      price: 499000,
      stockQuantity: 40
    }
  ],
  ratingAvg: 4.0,
  ratingCount: 1,
  buyCount: 0
};

// Đọc file products.json hiện tại
const productsPath = path.join(__dirname, '../data/products.json');
let products = [];

try {
  const data = fs.readFileSync(productsPath, 'utf8');
  products = JSON.parse(data);
  console.log(`✓ Đã đọc ${products.length} sản phẩm hiện có`);
} catch (error) {
  console.error('✗ Lỗi khi đọc file products.json:', error.message);
  process.exit(1);
}

// Kiểm tra xem sản phẩm đã tồn tại chưa
const existingProduct = products.find(p => p.id === newProduct.id);
if (existingProduct) {
  console.log(`⚠ Sản phẩm với ID ${newProduct.id} đã tồn tại. Đang cập nhật...`);
  const index = products.findIndex(p => p.id === newProduct.id);
  products[index] = newProduct;
} else {
  console.log(`✓ Thêm sản phẩm mới: ${newProduct.name}`);
  products.push(newProduct);
}

// Ghi lại vào file
try {
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  console.log(`✓ Đã lưu thành công vào ${productsPath}`);
  console.log(`✓ Tổng số sản phẩm: ${products.length}`);
  console.log('\nThông tin sản phẩm đã thêm:');
  console.log(`- ID: ${newProduct.id}`);
  console.log(`- Tên: ${newProduct.name}`);
  console.log(`- Số variants: ${newProduct.variants.length}`);
  console.log(`- Giá: ${newProduct.variants[0].price.toLocaleString('vi-VN')}đ`);
} catch (error) {
  console.error('✗ Lỗi khi ghi file:', error.message);
  process.exit(1);
}
