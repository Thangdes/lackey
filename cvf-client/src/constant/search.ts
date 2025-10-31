export const SEARCH_TEXT = {
  placeholder: 'Tìm kiếm sản phẩm, thương hiệu, danh mục...',
  ariaLabelInput: 'Tìm kiếm',
  ariaLabelDialog: 'Gợi ý tìm kiếm',
  ariaLabelButton: 'Thực hiện tìm kiếm',
  exploreNow: 'Khám phá ngay',
  suggestionsFor: (q: string) => `Gợi ý cho “${q}”`,
  recent: 'Gần đây',
  popular: 'Phổ biến',
  noSuggestions: 'Không có sản phẩm đó',
  pressEnterToSearch: (q: string) => `Nhấn Enter để tìm “${q || '...'}”`,
  viewAllResults: 'Xem tất cả kết quả',
  clear: 'Xoá',
};
