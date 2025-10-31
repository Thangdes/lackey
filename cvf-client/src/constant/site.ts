const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

export const siteConfig = {
  name: "LắcKey",
  slogan: "Trang · Phụ kiện · Thiết kế & Thời trang · Cửa hàng phụ kiện giải trí",
  url: envUrl || "https://example.com",
  logo: (envUrl || "https://example.com") + "/logo/logo.jpg",
  contact: {
    telephone: "091 960 08 01",
    telephoneE164: "+84919600801",
    secondaryTelephone: "091 960 08 01",
    secondaryTelephoneE164: "+84919600801",
    email: "lackey6886@gmail.com",
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=61581934494103",
    "https://zalo.me/0356356497",
  ],
  shipping: {
    regions: ["TP.HCM", "Hà Nội", "Toàn quốc (tùy điều kiện bảo quản)"],
    defaultFee: 26000,
  },
  payments: {
    vietqr: {
      bank: "OCB",
      bankCode: "970448",
      accountName: "LE THANH TU",
      accountNumber: "0067100005148005",
      template:
        "https://img.vietqr.io/image/970448-0067100005148005-compact2.png?amount={amount}&addInfo={orderCode}",
    },
  },
  openingHours: ["Mo-Fr 08:30-17:30", "Sa 08:30-12:00"],
  company: {
    legalName: "LắcKey",
    taxId: "",
    address: "Số 27/8, Đường Lê Văn Việt, Phường Hiệp Phú, Thành phố Thủ Đức, TP. Hồ Chí Minh., Thủ Đức, Vietnam",
  },
  support: {
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "lackey6886@gmail.com",
    phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+84919600801",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com",
  },
  default: {
    title: "LắcKey - Cửa hàng trang trí chuyên cung cấp đầy đủ các loại móc khóa, đặc biệt cung cấp móc khóa theo ý tưởng hình ảnh từ khách hàng.",
    description:
      "LắcKey - Cửa hàng trang trí chuyên cung cấp đầy đủ các loại móc khóa, đặc biệt cung cấp móc khóa theo ý tưởng hình ảnh từ khách hàng.",
    keywords: [
      "LắcKey",
      "móc khóa",
      "phụ kiện",
      "thiết kế",
      "thời trang",
      "cửa hàng phụ kiện giải trí",
      "móc khóa theo ý tưởng",
      "custom keychain",
    ],
  },
};
