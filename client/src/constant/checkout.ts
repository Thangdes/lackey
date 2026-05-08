export const PROVINCES = [
  "Hà Nội",
  "Thừa Thiên Huế",
  "Lai Châu",
  "Điện Biên",
  "Sơn La",
  "Lạng Sơn",
  "Quảng Ninh",
  "Thanh Hóa",
  "Nghệ An",
  "Hà Tĩnh",
  "Cao Bằng",
  "Tuyên Quang",       // Tuyên Quang + Hà Giang
  "Lào Cai",           // Lào Cai + Yên Bái
  "Thái Nguyên",       // Thái Nguyên + Bắc Kạn
  "Phú Thọ",           // Phú Thọ + Vĩnh Phúc + Hòa Bình
  "Bắc Ninh",          // Bắc Ninh + Bắc Giang
  "Hưng Yên",          // Hưng Yên + Thái Bình
  "Hải Phòng",         // Hải Phòng + Hải Dương
  "Ninh Bình",         // Ninh Bình + Hà Nam + Nam Định
  "Quảng Trị",         // Quảng Trị + Quảng Bình
  "Đà Nẵng",           // Đà Nẵng + Quảng Nam
  "Quảng Ngãi",        // Quảng Ngãi + Kon Tum
  "Gia Lai",           // Gia Lai + Bình Định
  "Khánh Hòa",         // Khánh Hòa + Ninh Thuận
  "Lâm Đồng",          // Lâm Đồng + Đắk Nông + Bình Thuận
  "Đắk Lắk",           // Đắk Lắk + Phú Yên
  "Thành phố Hồ Chí Minh", // TP.HCM + Bình Dương + Bà Rịa - Vũng Tàu
  "Đồng Nai",          // Đồng Nai + Bình Phước
  "Tây Ninh",          // Tây Ninh + Long An
  "Cần Thơ",           // Cần Thơ + Sóc Trăng + Hậu Giang
  "Vĩnh Long",         // Vĩnh Long + Bến Tre + Trà Vinh
  "Đồng Tháp",         // Đồng Tháp + Tiền Giang
  "Cà Mau",            // Cà Mau + Bạc Liêu
  "An Giang"           // An Giang + Kiên Giang
];

export const HCM_DISTRICTS = [
  "Quận 1","Quận 3","Quận 4","Quận 5","Quận 6","Quận 7","Quận 8","Quận 10","Quận 11",
  "Quận 12","Quận Bình Thạnh","Quận Bình Tân","Quận Gò Vấp","Quận Phú Nhuận",
  "Quận Tân Bình","Quận Tân Phú",
  "Thành phố Thủ Đức",
  "Huyện Bình Chánh","Huyện Cần Giờ","Huyện Củ Chi","Huyện Hóc Môn","Huyện Nhà Bè"
];


export const CHECKOUT_TEXT = {
  sectionPaymentInfoTitle: "Thông tin thanh toán",
  sectionPaymentInfoDesc: "Vui lòng nhập chính xác địa chỉ để giao hàng nhanh chóng.",
  labels: {
    fullName: "Họ và tên *",
    email: "Email *",
    phone: "Số điện thoại *",
    city: "Tỉnh/Thành phố *",
    district: "Quận/Huyện",
    wardOptional: "Phường/Xã (tuỳ chọn)",
    ward: "Phường/Xã",
    street: "Địa chỉ *",
    notesOptional: "Ghi chú (tuỳ chọn)",
  },
  placeholders: {
    district: "Nhập quận/huyện",
    street: "Số nhà, đường...",
    notes: "Ghi chú cho đơn hàng...",
    chooseDistrict: "Chọn quận/huyện",
  },
  requiredMark: "*",
  optionalSuffix: "(tuỳ chọn)",
  shipToDifferent: "Giao hàng tới địa chỉ khác?",
  actions: {
    backToCart: "Quay lại giỏ hàng",
    placeOrder: "Đặt hàng",
  },
  successToast: "Đặt hàng thành công! Chúng tôi sẽ liên hệ xác nhận.",
} as const;

export const CHECKOUT_ERROR = {
  fullNameRequired: "Vui lòng nhập Họ và tên",
  phoneRequired: "Vui lòng nhập Số điện thoại",
  cityRequired: "Vui lòng chọn Tỉnh/Thành phố",
  districtRequired: "Vui lòng chọn Quận/Huyện",
  streetRequired: "Vui lòng nhập Địa chỉ",
  altFullNameRequired: "Vui lòng nhập Họ và tên (địa chỉ khác)",
  altPhoneRequired: "Vui lòng nhập SĐT (địa chỉ khác)",
  altCityRequired: "Vui lòng chọn Tỉnh/Thành (địa chỉ khác)",
  altDistrictRequired: "Vui lòng chọn Quận/Huyện (địa chỉ khác)",
  altStreetRequired: "Vui lòng nhập Địa chỉ (địa chỉ khác)",
  cartEmpty: "Giỏ hàng trống",
} as const;

export const PAYMENT_UI = {
  title: "Phương thức thanh toán",
  cod: {
    title: "Thanh toán tiền mặt khi nhận hàng",
    desc: "Thanh toán trực tiếp với shipper khi nhận hàng. Kiểm tra kỹ trước khi thanh toán. Nếu có lỗi vui lòng liên hệ hotline 0356 356 497",
  },
  vietqr: {
    title: "Thanh toán ngân hàng",
    descPrefix: "Sau khi đặt hàng, chúng tôi sẽ hiển thị mã QR với số tiền ",
    descSuffix: " và hướng dẫn chuyển khoản.",
  },
} as const;

export const VIETQR_MODAL = {
  title: "Quét mã VietQR để thanh toán",
  closeAria: "Đóng",
  imageAlt: "VietQR",
  labels: {
    bank: "Ngân hàng",
    accountNumber: "Số tài khoản",
    accountName: "Chủ tài khoản",
    amount: "Số tiền",
    transferNote: "Nội dung chuyển khoản",
  },
  actions: {
    copy: "Sao chép",
    close: "Đóng",
  },
  note: "Sau khi chuyển khoản thành công, đơn hàng sẽ được xác nhận tự động hoặc nhân viên sẽ liên hệ xác nhận. Cảm ơn bạn!",
} as const;

export const ORDER_SUMMARY = {
  title: "Đơn hàng của bạn",
  empty: "Giỏ hàng trống",
  subtotal: "Tạm tính",
  shipping: "Giao hàng",
  shippingFree: "Miễn phí",
  shippingStandard: "Tiêu chuẩn",
  shippingExpress: "Hỏa tốc",
  total: "Tổng",
} as const;

export const CHECKOUT_STEPS = {
  cart: "Giỏ hàng",
  payment: "Thanh toán",
  complete: "Hoàn tất",
} as const;

export const CHECKOUT_COMPLETE = {
  title: "Đặt hàng thành công!",
  description: "Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất và tiến hành giao hàng.",
  deliveryTitle: "Thời gian giao dự kiến",
  deliveryHCM: "TP. HCM: 1–2 ngày làm việc",
  deliveryOthers: "Tỉnh/TP khác: 2–5 ngày làm việc",
  supportTitle: "Hỗ trợ đơn hàng",
  supportHelp: "Nếu cần hỗ trợ, hãy liên hệ đội ngũ CSKH của chúng tôi.",
  callNow: "Gọi ngay",
  chatZalo: "Chat Zalo",
  backHome: "Về trang chủ",
  continueShopping: "Tiếp tục mua sắm",
} as const;
