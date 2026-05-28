




interface ErrorMapping {
  pattern: RegExp | string;
  message: string;
  userMessage: string;
}

const ERROR_MAPPINGS: ErrorMapping[] = [
  
  {
    pattern: /email.*already.*registered|email.*exists/i,
    message: "Email already registered",
    userMessage: "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.",
  },
  {
    pattern: /username.*already.*exists|username.*taken/i,
    message: "Username already exists",
    userMessage: "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.",
  },
  {
    pattern: /sai.*email|sai.*m.t.*kh.u|email.*m.t.*kh.u|m.t.*kh.u.*email|wrong.*credentials|invalid.*credentials/i,
    message: "Wrong credentials",
    userMessage: "Thông tin tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại.",
  },
  {
    pattern: /password.*incorrect|wrong.*password|invalid.*password/i,
    message: "Invalid password",
    userMessage: "Thông tin tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại.",
  },
  {
    pattern: /user.*not.*found|account.*not.*found/i,
    message: "User not found",
    userMessage: "Tài khoản không tồn tại. Vui lòng kiểm tra lại email.",
  },
  {
    pattern: /token.*expired|refresh.*token.*invalid/i,
    message: "Session expired",
    userMessage: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
  },
  {
    pattern: /unauthorized|not.*authenticated/i,
    message: "Unauthorized",
    userMessage: "Bạn cần đăng nhập để thực hiện hành động này.",
  },

  
  {
    pattern: /password.*at least.*8|password.*minimum.*8/i,
    message: "Password too short",
    userMessage: "Mật khẩu phải có ít nhất 8 ký tự.",
  },
  {
    pattern: /invalid.*email|email.*format/i,
    message: "Invalid email",
    userMessage: "Định dạng email không hợp lệ.",
  },
  {
    pattern: /required|missing.*field/i,
    message: "Missing required field",
    userMessage: "Vui lòng điền đầy đủ thông tin bắt buộc.",
  },

  
  {
    pattern: /not.*enough.*stock|stock.*unavailable|quantity.*not.*available/i,
    message: "Out of stock",
    userMessage: "Sản phẩm này hiện không có đủ số lượng. Vui lòng thử lại sau.",
  },
  {
    pattern: /product.*not.*found|product.*does.*not.*exist/i,
    message: "Product not found",
    userMessage: "Sản phẩm không tồn tại hoặc đã bị xóa.",
  },
  {
    pattern: /cart.*empty|no.*items/i,
    message: "Cart is empty",
    userMessage: "Giỏ hàng của bạn trống. Vui lòng thêm sản phẩm.",
  },

  
  {
    pattern: /order.*not.*found|order.*does.*not.*exist/i,
    message: "Order not found",
    userMessage: "Đơn hàng không tồn tại.",
  },
  {
    pattern: /cannot.*cancel|order.*cannot.*be.*cancelled/i,
    message: "Cannot cancel order",
    userMessage: "Không thể hủy đơn hàng này. Vui lòng liên hệ hỗ trợ.",
  },
  {
    pattern: /payment.*failed|payment.*error/i,
    message: "Payment failed",
    userMessage: "Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức khác.",
  },
  {
    pattern: /amount.*mismatch|payment.*amount.*incorrect/i,
    message: "Payment amount mismatch",
    userMessage: "Số tiền thanh toán không khớp. Vui lòng thử lại.",
  },

  
  {
    pattern: /discount.*code.*invalid|coupon.*invalid|code.*not.*found/i,
    message: "Invalid discount code",
    userMessage: "Mã giảm giá không hợp lệ hoặc đã hết hạn.",
  },
  {
    pattern: /discount.*expired|coupon.*expired/i,
    message: "Discount expired",
    userMessage: "Mã giảm giá đã hết hạn.",
  },
  {
    pattern: /minimum.*amount|subtotal.*must.*be/i,
    message: "Minimum order amount not met",
    userMessage: "Giá trị đơn hàng chưa đạt mức tối thiểu để sử dụng mã này.",
  },

  
  {
    pattern: /shipping.*address.*incomplete|address.*invalid/i,
    message: "Invalid shipping address",
    userMessage: "Địa chỉ giao hàng không hợp lệ. Vui lòng kiểm tra lại.",
  },
  {
    pattern: /cannot.*ship.*to.*location|shipping.*not.*available/i,
    message: "Shipping not available",
    userMessage: "Chúng tôi hiện không giao hàng đến địa chỉ này.",
  },

  
  {
    pattern: /internal.*server.*error|something.*went.*wrong/i,
    message: "Server error",
    userMessage: "Có lỗi xảy ra. Vui lòng thử lại sau.",
  },
  {
    pattern: /timeout|request.*timeout/i,
    message: "Request timeout",
    userMessage: "Yêu cầu mất quá lâu. Vui lòng kiểm tra kết nối và thử lại.",
  },
  {
    pattern: /network.*error|connection.*failed/i,
    message: "Network error",
    userMessage: "Lỗi kết nối. Vui lòng kiểm tra kết nối internet và thử lại.",
  },
];







export function normalizeErrorForUser(
  error: unknown,
  fallback: string = "Có lỗi xảy ra. Vui lòng thử lại."
): string {
  
  let errorMessage = "";

  if (error instanceof Error) {
    
    const axiosLike = error as unknown as {
      response?: { data?: { message?: unknown } | string; status?: number };
    };
    const respData = axiosLike?.response?.data;
    if (respData && typeof respData === "object") {
      const m = (respData as { message?: unknown }).message;
      if (typeof m === "string" && m.trim()) {
        errorMessage = m.trim();
      } else if (Array.isArray(m) && m.length > 0) {
        errorMessage = m.join("; ");
      }
    } else if (typeof respData === "string" && respData.trim()) {
      errorMessage = respData.trim();
    }
    
    if (!errorMessage) {
      errorMessage = error.message;
    }
  } else if (typeof error === "string") {
    errorMessage = error;
  } else if (error && typeof error === "object") {
    const err = error as Record<string, unknown>;
    
    const respData = (err.response as Record<string, unknown> | undefined)?.data;
    if (respData && typeof respData === "object") {
      const m = (respData as { message?: unknown }).message;
      if (typeof m === "string" && m.trim()) {
        errorMessage = m.trim();
      } else if (Array.isArray(m) && m.length > 0) {
        errorMessage = m.join("; ");
      }
    }
    if (!errorMessage) {
      if (typeof err.message === "string") {
        errorMessage = err.message;
      } else if (typeof err.error === "string") {
        errorMessage = err.error;
      }
    }
  }

  if (!errorMessage) {
    return fallback;
  }

  
  for (const mapping of ERROR_MAPPINGS) {
    const pattern = typeof mapping.pattern === "string" 
      ? new RegExp(mapping.pattern, "i")
      : mapping.pattern;

    if (pattern.test(errorMessage)) {
      return mapping.userMessage;
    }
  }

  
  
  if (errorMessage.length > 200 || /^<!DOCTYPE|^<html|<[^>]+>/i.test(errorMessage)) {
    return fallback;
  }

  
  return errorMessage;
}




export const errorNormalizers = {
  auth: (error: unknown) =>
    normalizeErrorForUser(error, "Lỗi xác thực. Vui lòng thử lại."),
  
  signup: (error: unknown) =>
    normalizeErrorForUser(error, "Tạo tài khoản thất bại. Vui lòng thử lại."),
  
  login: (error: unknown) => {
    const errWithStatus = error as { status?: number; response?: { status?: number } };
    const status = errWithStatus?.status ?? errWithStatus?.response?.status;
    if (status === 401) {
      return "Thông tin tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại.";
    }
    return normalizeErrorForUser(error, "Thông tin tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại.");
  },
  
  cart: (error: unknown) =>
    normalizeErrorForUser(error, "Lỗi giỏ hàng. Vui lòng thử lại."),
  
  checkout: (error: unknown) =>
    normalizeErrorForUser(error, "Lỗi thanh toán. Vui lòng thử lại."),
  
  order: (error: unknown) =>
    normalizeErrorForUser(error, "Lỗi đơn hàng. Vui lòng thử lại."),
  
  payment: (error: unknown) =>
    normalizeErrorForUser(error, "Lỗi thanh toán. Vui lòng thử lại."),
  
  shipping: (error: unknown) =>
    normalizeErrorForUser(error, "Lỗi giao hàng. Vui lòng thử lại."),
};
