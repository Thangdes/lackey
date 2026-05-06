# Hướng Dẫn Tạo Data - Blog Posts & Banners

## 1. Blog Posts (Model: Post)

### Cấu trúc Post Model:
```typescript
{
  id: string
  title: string
  slug: string (unique)
  content: string (HTML hoặc Markdown)
  excerpt: string (tóm tắt ngắn)
  thumbnailUrl: string
  isPublished: boolean
  authorId: string (ObjectId của User)
  createdAt: DateTime
  updatedAt: DateTime
  metaTitle: string (SEO)
  metaDescription: string (SEO)
}
```

---

### 10 Blog Posts về Keyboard:

```json
[
  {
    "title": "Hướng Dẫn Chọn Bàn Phím Cơ Đầu Tiên Cho Người Mới",
    "slug": "huong-dan-chon-ban-phim-co-dau-tien",
    "content": "<h2>Giới thiệu</h2><p>Bàn phím cơ đang ngày càng phổ biến trong cộng đồng game thủ và dân văn phòng...</p><h2>Các loại switch</h2><p>Switch là linh hồn của bàn phím cơ. Có 3 loại chính: Linear, Tactile, và Clicky...</p><h2>Layout bàn phím</h2><p>Các layout phổ biến: Full-size (100%), TKL (80%), 75%, 65%, 60%...</p><h2>Ngân sách</h2><p>Với người mới bắt đầu, nên chọn bàn phím trong khoảng 1-2 triệu...</p>",
    "excerpt": "Bạn mới bắt đầu tìm hiểu về bàn phím cơ? Hãy đọc bài viết này để biết cách chọn bàn phím cơ đầu tiên phù hợp với nhu cầu và ngân sách.",
    "thumbnailUrl": "/images/blog/chon-ban-phim-co.jpg",
    "isPublished": true,
    "authorId": "[ID của User/Admin]",
    "metaTitle": "Hướng Dẫn Chọn Bàn Phím Cơ Đầu Tiên | KeyboardVN",
    "metaDescription": "Hướng dẫn chi tiết cách chọn bàn phím cơ đầu tiên cho người mới: switch, layout, ngân sách, thương hiệu uy tín."
  },
  {
    "title": "So Sánh Switch Cherry MX vs Gateron vs Akko",
    "slug": "so-sanh-switch-cherry-mx-gateron-akko",
    "content": "<h2>Cherry MX - Ông tổ của switch cơ</h2><p>Cherry MX là thương hiệu switch lâu đời nhất, chất lượng ổn định...</p><h2>Gateron - Lựa chọn giá trị</h2><p>Gateron nổi tiếng với giá cả phải chăng nhưng chất lượng tốt...</p><h2>Akko - Tân binh đầy tiềm năng</h2><p>Akko V3 series đang được đánh giá cao với giá rẻ và chất lượng tốt...</p>",
    "excerpt": "Phân tích chi tiết sự khác biệt giữa 3 thương hiệu switch phổ biến: Cherry MX, Gateron và Akko. Đâu là lựa chọn tốt nhất cho bạn?",
    "thumbnailUrl": "/images/blog/so-sanh-switch.jpg",
    "isPublished": true,
    "authorId": "[ID của User/Admin]",
    "metaTitle": "So Sánh Switch Cherry MX vs Gateron vs Akko | KeyboardVN",
    "metaDescription": "So sánh chi tiết 3 thương hiệu switch phổ biến: Cherry MX, Gateron, Akko. Ưu nhược điểm, giá cả, cảm giác gõ."
  },
  {
    "title": "Gasket Mount vs Tray Mount: Sự Khác Biệt Là Gì?",
    "slug": "gasket-mount-vs-tray-mount",
    "content": "<h2>Tray Mount - Phương pháp truyền thống</h2><p>Tray mount là cách gắn PCB trực tiếp vào case bằng vít...</p><h2>Gasket Mount - Công nghệ hiện đại</h2><p>Gasket mount sử dụng các miếng đệm cao su để tạo cảm giác gõ mềm mại...</p><h2>So sánh trải nghiệm</h2><p>Gasket mount cho cảm giác gõ bouncy, trong khi tray mount cứng hơn...</p>",
    "excerpt": "Tìm hiểu sự khác biệt giữa Gasket Mount và Tray Mount - hai phương pháp gắn PCB phổ biến trong bàn phím custom.",
    "thumbnailUrl": "/images/blog/gasket-vs-tray-mount.jpg",
    "isPublished": true,
    "authorId": "[ID của User/Admin]",
    "metaTitle": "Gasket Mount vs Tray Mount: Sự Khác Biệt | KeyboardVN",
    "metaDescription": "Phân tích chi tiết sự khác biệt giữa Gasket Mount và Tray Mount. Ưu nhược điểm, trải nghiệm gõ, giá cả."
  },
  {
    "title": "Hướng Dẫn Lube Switch Cho Người Mới Bắt Đầu",
    "slug": "huong-dan-lube-switch-cho-nguoi-moi",
    "content": "<h2>Tại sao cần lube switch?</h2><p>Lube switch giúp giảm tiếng ồn, tăng độ mượt, cải thiện trải nghiệm gõ...</p><h2>Dụng cụ cần thiết</h2><p>Krytox 205g0, brush, switch opener, tweezers...</p><h2>Quy trình lube từng bước</h2><p>1. Mở switch 2. Lube stem 3. Lube housing 4. Lube spring 5. Lắp lại...</p><h2>Lưu ý quan trọng</h2><p>Không lube quá nhiều, tránh lube vào chân tactile...</p>",
    "excerpt": "Hướng dẫn chi tiết cách lube switch cho người mới: dụng cụ, quy trình, lưu ý quan trọng để có kết quả tốt nhất.",
    "thumbnailUrl": "/images/blog/lube-switch-guide.jpg",
    "isPublished": true,
    "authorId": "[ID của User/Admin]",
    "metaTitle": "Hướng Dẫn Lube Switch Chi Tiết | KeyboardVN",
    "metaDescription": "Hướng dẫn lube switch từ A-Z: dụng cụ cần thiết, quy trình chi tiết, mẹo hay và lưu ý quan trọng."
  },
  {
    "title": "Top 5 Bàn Phím Cơ Giá Rẻ Dưới 2 Triệu Đáng Mua 2026",
    "slug": "top-5-ban-phim-co-gia-re-duoi-2-trieu-2026",
    "content": "<h2>1. Akko 3098B - 1.69 triệu</h2><p>Bàn phím 98 phím, hot-swap, wireless, pin 3000mAh...</p><h2>2. GMMK 2 65% - 1.79 triệu</h2><p>Layout 65% compact, hot-swap, RGB per-key...</p><h2>3. Keychron C1 - 1.49 triệu</h2><p>Full-size, hot-swap, có dây, giá rẻ nhất...</p><h2>4. Royal Kludge RK84 - 1.59 triệu</h2><p>75% layout, wireless, pin tốt...</p><h2>5. Monsgeek M1W - 1.99 triệu</h2><p>Vỏ nhôm, gasket mount, chất lượng cao...</p>",
    "excerpt": "Tổng hợp 5 mẫu bàn phím cơ giá rẻ dưới 2 triệu đồng đáng mua nhất năm 2026. Chất lượng tốt, tính năng đầy đủ.",
    "thumbnailUrl": "/images/blog/top-5-ban-phim-gia-re.jpg",
    "isPublished": true,
    "authorId": "[ID của User/Admin]",
    "metaTitle": "Top 5 Bàn Phím Cơ Giá Rẻ Dưới 2 Triệu 2026 | KeyboardVN",
    "metaDescription": "Top 5 bàn phím cơ giá rẻ dưới 2 triệu đáng mua: Akko, GMMK, Keychron, Royal Kludge, Monsgeek. Review chi tiết."
  },
  {
    "title": "QMK và VIA: Tùy Biến Bàn Phím Theo Ý Muốn",
    "slug": "qmk-va-via-tuy-bien-ban-phim",
    "content": "<h2>QMK là gì?</h2><p>QMK là firmware mã nguồn mở cho phép lập trình bàn phím...</p><h2>VIA là gì?</h2><p>VIA là giao diện đồ họa giúp cấu hình QMK dễ dàng hơn...</p><h2>Tính năng nổi bật</h2><p>Remap phím, tạo layer, macro, tap dance, RGB control...</p><h2>Hướng dẫn sử dụng VIA</h2><p>1. Tải VIA 2. Kết nối bàn phím 3. Cấu hình phím 4. Save...</p>",
    "excerpt": "Tìm hiểu về QMK và VIA - công cụ mạnh mẽ giúp bạn tùy biến bàn phím theo ý muốn: remap phím, tạo macro, điều khiển RGB.",
    "thumbnailUrl": "/images/blog/qmk-via-guide.jpg",
    "isPublished": true,
    "authorId": "[ID của User/Admin]",
    "metaTitle": "QMK và VIA: Hướng Dẫn Tùy Biến Bàn Phím | KeyboardVN",
    "metaDescription": "Hướng dẫn sử dụng QMK và VIA để tùy biến bàn phím: remap phím, tạo layer, macro, RGB control."
  },
  {
    "title": "Keycap PBT vs ABS: Nên Chọn Loại Nào?",
    "slug": "keycap-pbt-vs-abs-nen-chon-loai-nao",
    "content": "<h2>Keycap ABS</h2><p>ABS (Acrylonitrile Butadiene Styrene) là nhựa phổ biến, giá rẻ...</p><h2>Keycap PBT</h2><p>PBT (Polybutylene Terephthalate) bền hơn, không bóng theo thời gian...</p><h2>So sánh chi tiết</h2><p>Độ bền: PBT > ABS. Âm thanh: PBT thấp hơn. Giá: ABS rẻ hơn...</p><h2>Kết luận</h2><p>PBT cho người dùng lâu dài, ABS cho người thích màu sắc đa dạng...</p>",
    "excerpt": "So sánh chi tiết keycap PBT và ABS: độ bền, âm thanh, cảm giác, giá cả. Đâu là lựa chọn phù hợp với bạn?",
    "thumbnailUrl": "/images/blog/pbt-vs-abs-keycap.jpg",
    "isPublished": true,
    "authorId": "[ID của User/Admin]",
    "metaTitle": "Keycap PBT vs ABS: So Sánh Chi Tiết | KeyboardVN",
    "metaDescription": "So sánh keycap PBT và ABS: độ bền, âm thanh, cảm giác gõ, giá cả. Ưu nhược điểm từng loại."
  },
  {
    "title": "Cách Chọn Layout Bàn Phím Phù Hợp: 60%, 65%, 75%, TKL",
    "slug": "cach-chon-layout-ban-phim-phu-hop",
    "content": "<h2>60% Layout (61 phím)</h2><p>Compact nhất, không có arrow keys và F-row. Phù hợp người thích tối giản...</p><h2>65% Layout (68 phím)</h2><p>Có arrow keys và một số phím điều hướng. Cân bằng giữa compact và tiện dụng...</p><h2>75% Layout (84 phím)</h2><p>Có F-row, arrow keys, compact nhưng đầy đủ chức năng...</p><h2>TKL (87 phím)</h2><p>Không có numpad, tiết kiệm không gian nhưng giữ đầy đủ phím chính...</p>",
    "excerpt": "Hướng dẫn chọn layout bàn phím phù hợp: 60%, 65%, 75%, TKL. Ưu nhược điểm từng layout và đối tượng phù hợp.",
    "thumbnailUrl": "/images/blog/chon-layout-ban-phim.jpg",
    "isPublished": true,
    "authorId": "[ID của User/Admin]",
    "metaTitle": "Cách Chọn Layout Bàn Phím: 60%, 65%, 75%, TKL | KeyboardVN",
    "metaDescription": "Hướng dẫn chọn layout bàn phím phù hợp: 60%, 65%, 75%, TKL. Ưu nhược điểm, đối tượng sử dụng."
  },
  {
    "title": "Stabilizers: Linh Hồn Của Các Phím Dài",
    "slug": "stabilizers-linh-hon-cua-cac-phim-dai",
    "content": "<h2>Stabilizers là gì?</h2><p>Stabilizers (stabs) giúp cân bằng các phím dài như Spacebar, Shift, Enter...</p><h2>Các loại stabilizers</h2><p>Plate-mount, PCB-mount (clip-in), Screw-in...</p><h2>Cách mod stabilizers</h2><p>Lube, band-aid mod, holee mod để giảm rattle...</p><h2>Thương hiệu uy tín</h2><p>Durock V2, Cherry, Staebies, TX Stabilizers...</p>",
    "excerpt": "Tìm hiểu về stabilizers - linh hồn của các phím dài trên bàn phím. Các loại stabs, cách mod và thương hiệu uy tín.",
    "thumbnailUrl": "/images/blog/stabilizers-guide.jpg",
    "isPublished": true,
    "authorId": "[ID của User/Admin]",
    "metaTitle": "Stabilizers: Hướng Dẫn Chi Tiết | KeyboardVN",
    "metaDescription": "Hướng dẫn về stabilizers: các loại, cách mod, lube, thương hiệu uy tín. Giảm rattle cho phím dài."
  },
  {
    "title": "Xu Hướng Bàn Phím Custom 2026: Hall Effect và Wireless",
    "slug": "xu-huong-ban-phim-custom-2026",
    "content": "<h2>Hall Effect - Công nghệ mới</h2><p>Switch Hall Effect sử dụng cảm biến từ, cho phép điều chỉnh actuation point...</p><h2>Wireless ngày càng phổ biến</h2><p>Bluetooth 5.0, 2.4GHz, pin lâu, độ trễ thấp...</p><h2>Gasket mount trở thành chuẩn</h2><p>Ngày càng nhiều bàn phím giá rẻ sử dụng gasket mount...</p><h2>QMK/VIA phổ biến hơn</h2><p>Nhiều thương hiệu hỗ trợ QMK/VIA ngay từ đầu...</p>",
    "excerpt": "Khám phá xu hướng bàn phím custom 2026: Hall Effect, wireless, gasket mount, QMK/VIA. Tương lai của bàn phím cơ.",
    "thumbnailUrl": "/images/blog/xu-huong-2026.jpg",
    "isPublished": true,
    "authorId": "[ID của User/Admin]",
    "metaTitle": "Xu Hướng Bàn Phím Custom 2026 | KeyboardVN",
    "metaDescription": "Xu hướng bàn phím custom 2026: Hall Effect, wireless, gasket mount, QMK/VIA. Công nghệ mới và tương lai."
  }
]
```

---

## 2. Banners (Model: SiteContent với type=BANNER)

### Cấu trúc SiteContent Model:
```typescript
{
  id: string
  type: ContentType (BANNER | TESTIMONIAL | GALLERY)
  title: string
  content: string (mô tả hoặc CTA text)
  thumbnailUrl: string (ảnh banner)
  linkUrl: string (link khi click banner)
  displayOrder: number (thứ tự hiển thị)
  isPublished: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

### 5 Banners cho Homepage:

```json
[
  {
    "type": "BANNER",
    "title": "Flash Sale Cuối Tuần - Giảm 30%",
    "content": "Giảm giá lên đến 30% cho tất cả bàn phím Keychron. Chỉ từ 2-4/5/2026!",
    "thumbnailUrl": "/images/banners/flash-sale-weekend.jpg",
    "linkUrl": "/products?brand=keychron&discount=true",
    "displayOrder": 1,
    "isPublished": true
  },
  {
    "type": "BANNER",
    "title": "Ra Mắt Monsgeek M5 - Bàn Phím Gasket Mount Giá Rẻ",
    "content": "Monsgeek M5 với vỏ nhôm, gasket mount, chỉ 2.49 triệu. Đặt hàng ngay!",
    "thumbnailUrl": "/images/banners/monsgeek-m5-launch.jpg",
    "linkUrl": "/products/monsgeek-m5-aluminum-keyboard",
    "displayOrder": 2,
    "isPublished": true
  },
  {
    "type": "BANNER",
    "title": "Bộ Sưu Tập Keycap GMK Mới Nhất",
    "content": "Khám phá bộ sưu tập keycap GMK cao cấp: Olivia++, Dracula, Botanical và nhiều hơn nữa.",
    "thumbnailUrl": "/images/banners/gmk-collection.jpg",
    "linkUrl": "/categories/keycaps?brand=gmk",
    "displayOrder": 3,
    "isPublished": true
  },
  {
    "type": "BANNER",
    "title": "Miễn Phí Vận Chuyển Đơn Từ 1 Triệu",
    "content": "Áp dụng cho tất cả đơn hàng từ 1.000.000đ trở lên. Giao hàng toàn quốc.",
    "thumbnailUrl": "/images/banners/free-shipping.jpg",
    "linkUrl": "/shipping",
    "displayOrder": 4,
    "isPublished": true
  },
  {
    "type": "BANNER",
    "title": "Custom Keyboard Workshop - Đăng Ký Ngay",
    "content": "Học cách build bàn phím custom từ A-Z. Workshop miễn phí mỗi thứ 7. Số lượng có hạn!",
    "thumbnailUrl": "/images/banners/workshop.jpg",
    "linkUrl": "/contact?subject=workshop",
    "displayOrder": 5,
    "isPublished": true
  }
]
```

---

## 3. Testimonials (Model: SiteContent với type=TESTIMONIAL)

### 5 Testimonials từ khách hàng:

```json
[
  {
    "type": "TESTIMONIAL",
    "title": "Chất lượng tuyệt vời!",
    "content": "Mình đã mua Keychron K8 Pro và rất hài lòng. Chất lượng build tốt, âm thanh gõ phím rất hay. Shop tư vấn nhiệt tình, giao hàng nhanh.",
    "thumbnailUrl": "/images/testimonials/customer-1.jpg",
    "authorName": "Nguyễn Văn A",
    "authorTitle": "Software Engineer",
    "displayOrder": 1,
    "isPublished": true
  },
  {
    "type": "TESTIMONIAL",
    "title": "Dịch vụ xuất sắc",
    "content": "Lần đầu mua bàn phím custom, shop tư vấn rất chi tiết từ switch đến keycap. Sau khi mua còn hướng dẫn lube switch nữa. 10/10!",
    "thumbnailUrl": "/images/testimonials/customer-2.jpg",
    "authorName": "Trần Thị B",
    "authorTitle": "Graphic Designer",
    "displayOrder": 2,
    "isPublished": true
  },
  {
    "type": "TESTIMONIAL",
    "title": "Giá cả hợp lý",
    "content": "So với các shop khác thì giá ở đây rất ok, có nhiều chương trình khuyến mãi. Sản phẩm chính hãng, bảo hành tốt.",
    "thumbnailUrl": "/images/testimonials/customer-3.jpg",
    "authorName": "Lê Văn C",
    "authorTitle": "Student",
    "displayOrder": 3,
    "isPublished": true
  },
  {
    "type": "TESTIMONIAL",
    "title": "Bàn phím đẹp, gõ sướng tay",
    "content": "Mua Monsgeek M1 V3 về dùng rất ưng. Vỏ nhôm chắc chắn, gasket mount gõ rất êm. Đáng đồng tiền bát gạo!",
    "thumbnailUrl": "/images/testimonials/customer-4.jpg",
    "authorName": "Phạm Thị D",
    "authorTitle": "Content Creator",
    "displayOrder": 4,
    "isPublished": true
  },
  {
    "type": "TESTIMONIAL",
    "title": "Sẽ quay lại ủng hộ",
    "content": "Đã mua 3 bàn phím ở shop rồi, lần nào cũng hài lòng. Sản phẩm đa dạng, nhân viên am hiểu, giao hàng nhanh. Highly recommended!",
    "thumbnailUrl": "/images/testimonials/customer-5.jpg",
    "authorName": "Hoàng Văn E",
    "authorTitle": "Marketing Manager",
    "displayOrder": 5,
    "isPublished": true
  }
]
```

---

## Lưu ý khi tạo data:

### Blog Posts:
1. **Content**: Nên viết HTML hoặc Markdown đầy đủ, ít nhất 500-1000 từ
2. **Excerpt**: Tóm tắt ngắn gọn 1-2 câu, dùng cho preview
3. **SEO**: Điền đầy đủ metaTitle và metaDescription
4. **Author**: Cần tạo User với role ADMIN trước
5. **Images**: Chuẩn bị ảnh thumbnail và ảnh trong bài viết

### Banners:
1. **Display Order**: Số thứ tự hiển thị (1 = hiển thị đầu tiên)
2. **Link URL**: Phải là đường dẫn hợp lệ trong website
3. **Image Size**: Nên dùng ảnh có tỷ lệ 16:9 hoặc 21:9 cho banner
4. **CTA**: Content nên có call-to-action rõ ràng

### Testimonials:
1. **Author Info**: Điền đầy đủ tên và title của khách hàng
2. **Content**: Nội dung ngắn gọn, chân thực, tích cực
3. **Avatar**: Có thể dùng ảnh placeholder hoặc ảnh thật (có sự đồng ý)

---

## Script Import (Tham khảo)

```typescript
// Import Blog Post
const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

const post = await prisma.post.create({
  data: {
    title: "Hướng Dẫn Chọn Bàn Phím Cơ Đầu Tiên",
    slug: "huong-dan-chon-ban-phim-co-dau-tien",
    content: "<h2>...</h2><p>...</p>",
    excerpt: "Bạn mới bắt đầu...",
    thumbnailUrl: "/images/blog/chon-ban-phim-co.jpg",
    isPublished: true,
    authorId: admin.id,
    metaTitle: "...",
    metaDescription: "..."
  }
});

// Import Banner
const banner = await prisma.siteContent.create({
  data: {
    type: "BANNER",
    title: "Flash Sale Cuối Tuần",
    content: "Giảm giá lên đến 30%...",
    thumbnailUrl: "/images/banners/flash-sale.jpg",
    linkUrl: "/products?discount=true",
    displayOrder: 1,
    isPublished: true
  }
});

// Import Testimonial
const testimonial = await prisma.siteContent.create({
  data: {
    type: "TESTIMONIAL",
    title: "Chất lượng tuyệt vời!",
    content: "Mình đã mua...",
    authorName: "Nguyễn Văn A",
    authorTitle: "Software Engineer",
    displayOrder: 1,
    isPublished: true
  }
});
```
