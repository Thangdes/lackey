import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Bắt đầu dọn dẹp dữ liệu ---');
  
  try {
    // 1. Rating (đánh giá sản phẩm)
    const ratingCount = await prisma.rating.deleteMany();
    console.log(`- Đã xóa ${ratingCount.count} đánh giá sản phẩm (Rating)`);

    // 2. Invoice & Payment & PaymentEvent (hóa đơn, thanh toán)
    const invoiceCount = await prisma.invoice.deleteMany();
    console.log(`- Đã xóa ${invoiceCount.count} hóa đơn (Invoice)`);
    
    const paymentEventCount = await prisma.paymentEvent.deleteMany();
    console.log(`- Đã xóa ${paymentEventCount.count} sự kiện thanh toán (PaymentEvent)`);

    const paymentCount = await prisma.payment.deleteMany();
    console.log(`- Đã xóa ${paymentCount.count} thanh toán (Payment)`);

    // 3. OrderItem & Order (chi tiết đơn hàng, đơn hàng)
    const orderItemCount = await prisma.orderItem.deleteMany();
    console.log(`- Đã xóa ${orderItemCount.count} sản phẩm trong đơn hàng (OrderItem)`);

    const orderCount = await prisma.order.deleteMany();
    console.log(`- Đã xóa ${orderCount.count} đơn hàng (Order)`);

    // 4. CartItem (giỏ hàng của người dùng)
    const cartItemCount = await prisma.cartItem.deleteMany();
    console.log(`- Đã xóa ${cartItemCount.count} sản phẩm trong giỏ hàng (CartItem)`);

    // 5. WishlistItem (danh sách yêu thích)
    const wishlistItemCount = await prisma.wishlistItem.deleteMany();
    console.log(`- Đã xóa ${wishlistItemCount.count} sản phẩm yêu thích (WishlistItem)`);

    // 6. InventoryMovement (lịch sử nhập/xuất kho)
    const inventoryMovementCount = await prisma.inventoryMovement.deleteMany();
    console.log(`- Đã xóa ${inventoryMovementCount.count} lịch sử kho (InventoryMovement)`);

    // 7. ProductVariant (biến thể sản phẩm)
    const productVariantCount = await prisma.productVariant.deleteMany();
    console.log(`- Đã xóa ${productVariantCount.count} biến thể sản phẩm (ProductVariant)`);

    // 8. ProductTag & Tag & Brand (nhãn tag sản phẩm, thương hiệu)
    const productTagCount = await prisma.productTag.deleteMany();
    console.log(`- Đã xóa ${productTagCount.count} liên kết tag (ProductTag)`);

    const tagCount = await prisma.tag.deleteMany();
    console.log(`- Đã xóa ${tagCount.count} tag sản phẩm (Tag)`);

    const brandCount = await prisma.brand.deleteMany();
    console.log(`- Đã xóa ${brandCount.count} thương hiệu (Brand)`);

    // 9. AttributeValue & Attribute (thuộc tính sản phẩm)
    const attributeValueCount = await prisma.attributeValue.deleteMany();
    console.log(`- Đã xóa ${attributeValueCount.count} giá trị thuộc tính (AttributeValue)`);

    const attributeCount = await prisma.attribute.deleteMany();
    console.log(`- Đã xóa ${attributeCount.count} thuộc tính sản phẩm (Attribute)`);

    // 10. Product (sản phẩm)
    const productCount = await prisma.product.deleteMany();
    console.log(`- Đã xóa ${productCount.count} sản phẩm (Product)`);

    // 11. Category (danh mục)
    const categoryCount = await prisma.category.deleteMany();
    console.log(`- Đã xóa ${categoryCount.count} danh mục (Category)`);

    // 12. SiteContent (testimonial, banner, gallery)
    const siteContentCount = await prisma.siteContent.deleteMany();
    console.log(`- Đã xóa ${siteContentCount.count} nội dung trang (SiteContent - Banners, Testimonials, Bảng ảnh)`);

    // 13. Post (bài viết blog)
    const postCount = await prisma.post.deleteMany();
    console.log(`- Đã xóa ${postCount.count} bài viết blog (Post)`);

    console.log('--- Dọn dẹp dữ liệu HOÀN TẤT thành công! ---');
    console.log('Lưu ý: Các tài khoản quản trị (Admin), nhà cung cấp (Supplier) và khách hàng đăng ký vẫn được giữ lại để bạn đăng nhập tạo dữ liệu mới.');

  } catch (error) {
    console.error('Lỗi trong quá trình dọn dẹp dữ liệu:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
