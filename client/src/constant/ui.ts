export const GALLERY_ARIA = {
  open: "Mở xem ảnh lớn",
  prev: "Ảnh trước",
  next: "Ảnh sau",
  close: "Đóng",
  thumbLabel: (i: number) => `Xem ảnh ${i}`,
};

export const PRODUCT_SORT = {
  label: "Sắp xếp:",
  options: {
    popularity: "Bán chạy",
    rating: "Đánh giá cao",
    priceAsc: "Giá tăng",
    priceDesc: "Giá giảm",
  },
} as const;

export const PRODUCT_FILTERS = {
  all: "Tất cả",
} as const;

export const PRODUCT_RELATED = {
  title: "Sản phẩm liên quan",
  more: "Xem thêm",
} as const;

export const PRODUCT_UI = {
  stockLabel: "Tồn kho:",
  soldPrefix: "Đã bán",
  ratingSymbol: "⭐",
  descriptionTitle: "Mô tả sản phẩm",
} as const;

export const PRODUCT_PRESET_VARIANTS = {
  tenThirteen: {
    fiftyPack: "Túi 50 quả (10–13g)",
    hundredPack: "Túi 100 quả (10–13g)",
  },
} as const;

export const COLLECTIONS_UI = {
  midAutumn: {
    badgeLeft: "🎁 Ưu đãi đặc biệt",
    badgeRight: "Combo tiết kiệm",
    title: "Combo Bàn phím Custom",
    ctaDesktop: "Xem tất cả",
    ctaMobile: "Xem tất cả combo",
    ctaHref: "/products?category=cat-combo",
  },
  eggs: {
    badgeLeft: "⌨️ Sản phẩm",
    badgeRight: "Bàn phím & Keycap",
    title: "Bộ sưu tập Bàn phím cơ",
    ctaDesktop: "Xem tất cả",
    ctaMobile: "Xem tất cả sản phẩm",
    ctaHref: "/products",
    ctaMobileHref: "/products?category=cat-keyboards",
  },
} as const;

export const HOME_UI = {
  showcase: {
    title: "Khám phá ngay hôm nay",
    descPrefix: "Gợi ý setup bàn phím cơ: keycap artisan độc đáo, switch êm ái, dịch vụ build/mod chuyên nghiệp. Khám phá đầy đủ sản phẩm tại ",
    productsLinkText: "danh mục sản phẩm",
    descMiddle: " hoặc tìm hiểu thêm ",
    aboutLinkText: "về LắcKey",
    subheading: "Bàn phím cơ & Keycap độc lạ",
    ideas: {
      mooncake: "Keycap artisan handmade",
      sponge: "Switch êm ái, gõ phê",
      sauce: "Dịch vụ build/mod chuyên nghiệp",
    },
    prevAria: "Xem trước",
    nextAria: "Xem tiếp",
    dotLabel: (i: number) => `Tới slide ${i}`,
  },
  categories: {
    badgeLeft: "🗂️ Danh mục",
    badgeRight: "Sản phẩm nổi bật",
    title: "Khám phá danh mục",
  },
} as const;

export const TESTIMONIALS_UI = {
  section: {
    badgeLeft: "⭐ Đánh giá",
    badgeRight: "Khách hàng nói gì",
    title: "Cảm nhận từ khách hàng",
  },
  tiktok: {
    title: "Video review từ TikTok",
    emptyPrefix: "Chưa cấu hình link video TikTok. Vui lòng cung cấp URL dạng",
    emptySuffix: "để hiển thị embed. Hoặc xem trang hồ sơ:",
    linkText: "TikTok",
  },
  card: {
    variantPrefix: "Phân loại:",
    hasVideo: "Có video",
    helpfulPrefix: "Hữu ích:",
    expand: "Xem thêm",
    collapse: "Thu gọn",
    ratingAria: (rating: number) => `Đánh giá ${rating}/5`,
    sellerReplyTitle: "Phản hồi của Shop",
  },
} as const;

export const REVIEWS_UI = {
  title: "Đánh giá",
  filterLabel: "Lọc theo sao:",
  all: "Tất cả",
  noReviews: "Chưa có đánh giá.",
  prev: "Trước",
  next: "Sau",
  pageLabel: (current: number, total: number) => `Trang ${current}/${total}`,
  anonymous: "Ẩn danh",
} as const;

export const BUTTON_LABELS = {
  addToCart: "Thêm vào giỏ",
  outOfStock: "Hết hàng",
  buyNow: "Mua ngay",
};

export const MESSAGES = {
  addedToCart: "Đã thêm vào giỏ hàng!",
};

export const BADGES = {
  bestSeller: "Bán chạy",
};

export const TOOLTIP = {
  variantUnavailable: "Biến thể chưa có sẵn",
};

export const CART_UI = {
  title: "Giỏ hàng",
  empty: "Giỏ hàng trống",
  emptyHelp: "Bạn chưa có sản phẩm nào trong giỏ.",
  continue: "Tiếp tục mua sắm",
  checkout: "Thanh toán",
  remove: "Xóa",
  removeAll: "Xóa tất cả",
  removeAllAria: "Xóa tất cả sản phẩm",
  qty: "Số lượng",
  qtyDecrease: "Giảm số lượng",
  qtyIncrease: "Tăng số lượng",
  qtyFor: (name: string) => `Số lượng cho ${name}`,
  variantPrefix: "Phân loại:",
  summary: "Tóm tắt đơn",
  subtotal: "Tạm tính",
  shipping: "Phí vận chuyển",
  shippingFree: "Miễn phí",
  shippingStandard: "Tiêu chuẩn",
  shippingExpress: "Hỏa tốc",
  shippingAria: "Chọn phương thức vận chuyển",
  voucher: "Mã giảm giá",
  voucherPlaceholder: "VD: GIAM10, FREESHIP",
  voucherInputAria: "Nhập mã giảm giá",
  apply: "Áp dụng",
  applyVoucherAria: "Áp dụng mã giảm giá",
  discount: "Giảm giá",
  total: "Tổng cộng",
  totalItems: "Tổng số lượng:",
};
