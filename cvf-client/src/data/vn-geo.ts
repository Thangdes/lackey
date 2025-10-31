export type Ward = string;
export type District = { name: string; wards: Ward[] };
export type Province = { name: string; districts: District[] };

// Minimal sample dataset. Extend as needed.
export const VN_GEO: Province[] = [
  {
    name: 'Hà Nội',
    districts: [
      { name: 'Ba Đình', wards: ['Phúc Xá', 'Trúc Bạch', 'Vĩnh Phúc', 'Cống Vị'] },
      { name: 'Hoàn Kiếm', wards: ['Chương Dương', 'Hàng Bạc', 'Hàng Buồm', 'Hàng Trống'] },
      { name: 'Cầu Giấy', wards: ['Dịch Vọng', 'Dịch Vọng Hậu', 'Nghĩa Tân', 'Trung Hòa'] },
    ],
  },
  {
    name: 'Hồ Chí Minh',
    districts: [
      { name: 'Quận 1', wards: ['Bến Nghé', 'Bến Thành', 'Cầu Ông Lãnh', 'Cô Giang'] },
      { name: 'Quận 3', wards: ['Võ Thị Sáu', 'Phường 7', 'Phường 8', 'Phường 9'] },
      { name: 'Quận Phú Nhuận', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4'] },
    ],
  },
  {
    name: 'Đà Nẵng',
    districts: [
      { name: 'Hải Châu', wards: ['Hòa Thuận Đông', 'Hòa Thuận Tây', 'Thạch Thang', 'Thanh Bình'] },
      { name: 'Sơn Trà', wards: ['An Hải Bắc', 'An Hải Đông', 'An Hải Tây', 'Mân Thái'] },
    ],
  },
  {
    name: 'Cần Thơ',
    districts: [
      { name: 'Ninh Kiều', wards: ['An Bình', 'An Cư', 'An Hòa', 'An Khánh'] },
      { name: 'Bình Thủy', wards: ['Bình Thủy', 'Bùi Hữu Nghĩa', 'Long Hòa'] },
    ],
  },
];
