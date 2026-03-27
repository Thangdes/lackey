export const GUIDE_PAGE = {
  metadata: {
    description:
      "Hướng dẫn từng bước giúp bạn mua hàng dễ dàng trên LắcKey, từ tìm kiếm, thêm vào giỏ, đến thanh toán và theo dõi đơn.",
  },
  badge: "Hướng dẫn",
  title: "Hướng dẫn mua hàng",
  introPrefix:
    "Làm theo các bước sau để hoàn tất đơn hàng nhanh chóng tại",
  sections: {
    steps: {
      title: "Các bước mua hàng",
      items: [
        "Tìm kiếm sản phẩm bằng ô tìm kiếm hoặc duyệt theo danh mục.",
        "Xem chi tiết sản phẩm, chọn phân loại (nếu có), số lượng và thêm vào giỏ.",
        "Vào giỏ hàng để kiểm tra lại sản phẩm và nhấn Tiến hành thanh toán.",
        "Nhập thông tin giao hàng chính xác, chọn phương thức thanh toán và đặt hàng.",
        "Theo dõi trạng thái đơn trong mục Tra cứu đơn hàng hoặc email xác nhận.",
      ],
    },
    tips: {
      title: "Mẹo mua sắm",
      items: [
        "Đăng nhập để đồng bộ giỏ hàng và nhận ưu đãi nhanh hơn.",
        "Theo dõi trang Khuyến mãi/Blog để cập nhật deal tốt.",
        "Ưu tiên thanh toán điện tử để xử lý đơn nhanh hơn.",
      ],
    },
    support: {
      title: "Hỗ trợ & Chính sách",
      links: {
        shipping: "Chính sách giao hàng",
        return: "Chính sách đổi trả",
        help: "Trung tâm trợ giúp",
        contact: "Liên hệ hỗ trợ",
      },
    },
  },
} as const;
