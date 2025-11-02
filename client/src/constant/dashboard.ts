export const DASHBOARD_TEXT = {
  title: "Bảng điều khiển",
  subtitle: "Tổng quan kinh doanh theo khoảng thời gian",
  from: "Từ",
  to: "Đến",
  presets: {
    today: "Hôm nay",
    last7: "7 ngày",
    last30: "30 ngày",
    thisMonth: "Tháng này",
    thisQuarter: "Quý này",
  },
  apply: "Áp dụng",
  reset: "Reset",
  validation: {
    invalidRange: "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.",
    unchanged: "Khoảng thời gian không thay đổi",
  },
  cards: {
    revenue: "Doanh thu",
    totalOrders: "Tổng đơn hàng",
    newCustomers: "Khách hàng mới",
    averageOrderValue: "Giá trị đơn hàng TB",
  },
  sections: {
    revenueOverTime: "Doanh thu theo thời gian",
    topProducts: "Sản phẩm bán chạy",
  },
  state: {
    done: "Hoàn tất",
    errorLoad: "Không thể tải danh sách.",
    loading: "Đang tải…",
  },
} as const;
