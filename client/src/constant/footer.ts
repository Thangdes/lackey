import { ROUTES } from "@/constant/route";

export const FOOTER_SECTIONS = [
  {
    title: 'Về LắcKey',
    links: [
      { label: 'Giới thiệu', href: ROUTES.about },
      { label: 'Liên hệ', href: ROUTES.contact },
      { label: 'Blog', href: ROUTES.blog },
    ],
  },
  {
    title: 'Hỗ trợ khách hàng',
    links: [
      { label: 'Trung tâm trợ giúp (FAQ)', href: ROUTES.help },
      { label: 'Tra cứu đơn hàng', href: ROUTES.ordersLookup },
      { label: 'Chính sách giao hàng', href: ROUTES.shipping },
      { label: 'Chính sách đổi trả', href: ROUTES.return },
    ],
  },
  {
    title: 'Chính sách',
    links: [
      { label: 'Điều khoản sử dụng', href: ROUTES.terms },
      { label: 'Chính sách bảo mật', href: ROUTES.privacy },
      { label: 'Chính sách giao hàng', href: ROUTES.shipping },
      { label: 'Đổi trả & Hoàn tiền', href: ROUTES.return },
    ],
  },
  {
    title: 'Mua sắm',
    links: [
      { label: 'Tất cả sản phẩm', href: ROUTES.products },
      { label: 'Tìm kiếm sản phẩm', href: ROUTES.products },
      { label: 'Hướng dẫn mua hàng', href: ROUTES.guide },
      { label: 'Liên hệ hỗ trợ', href: ROUTES.contact },
    ],
  },
] as const;

export const CONNECT_TITLE = 'Kết nối' as const;

export const APP_SECTION = {
  title: 'Tải ứng dụng',
  description:
    'Tải ứng dụng LắcKey để theo dõi đơn hàng, nhận ưu đãi mới nhất và trải nghiệm mượt mà hơn.',
} as const;

export const PAYMENT_SECTION_TITLE = 'Phương thức thanh toán' as const;

export const PAYMENT_GROUP_TITLES = {
  vn: 'Việt Nam',
  jp: 'Nhật Bản',
  global: 'Quốc tế',
} as const;

export const COPYRIGHT_TITLE = 'Bản quyền' as const;
export const COPYRIGHT_TEXT = '© 2026 LắcKey. Bảo lưu mọi quyền.' as const;

export const LEGAL_LINKS = [
  { label: 'Điều khoản sử dụng', href: ROUTES.terms },
  { label: 'Chính sách bảo mật', href: ROUTES.privacy },
  { label: 'Chính sách giao hàng', href: ROUTES.shipping },
  { label: 'Đổi trả & Hoàn tiền', href: ROUTES.return },
] as const;
