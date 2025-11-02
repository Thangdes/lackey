export const HELP_PAGE = {
  metadata: {
    description:
      "Các câu hỏi thường gặp và liên hệ hỗ trợ khách hàng của LắcKey.",
  },
  badge: "Hỗ trợ",
  title: "Trung tâm trợ giúp",
  introPrefix:
    "Các câu hỏi thường gặp và liên hệ hỗ trợ khách hàng của",
  sections: {
    faq: {
      title: "Câu hỏi thường gặp",
      items: [
        "Theo dõi đơn hàng như thế nào? – Sau khi đặt hàng, bạn sẽ nhận được mã vận đơn. Bạn có thể theo dõi trên trang của đơn vị vận chuyển hoặc liên hệ CSKH để được hỗ trợ.",
        "Phí và thời gian giao hàng? – Xem chi tiết tại Chính sách giao hàng.",
        "Điều kiện đổi trả? – Xem chính sách đổi trả.",
      ],
      linkTexts: {
        shipping: "Chính sách giao hàng",
        return: "Chính sách đổi trả",
      },
    },
    quickLinks: {
      title: "Liên kết nhanh",
      links: {
        shipping: "Giao hàng",
        return: "Đổi trả",
        terms: "Điều khoản",
        privacy: "Bảo mật",
      },
    },
  },
} as const;

