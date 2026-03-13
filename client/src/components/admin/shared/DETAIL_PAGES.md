# Admin Detail Pages - Design Guide

Hướng dẫn thiết kế và sử dụng components cho các trang chi tiết (detail pages) trong admin panel.

## 🎯 Components Overview

### 1. AdminDetailHeader
Header chuẩn cho detail pages với back button, title, badge và actions.

```tsx
<AdminDetailHeader
  backHref="/admin/orders"
  backLabel="Danh sách đơn hàng"
  title="Đơn hàng #12345"
  subtitle="Tạo lúc: 15/01/2024 10:30"
  badge={<Badge variant="default">Đã thanh toán</Badge>}
  actions={
    <>
      <Button variant="outline" size="sm">
        <Printer className="size-4" />
        In hóa đơn
      </Button>
      <Button variant="destructive" size="sm">
        <Trash2 className="size-4" />
        Xóa
      </Button>
    </>
  }
/>
```

### 2. AdminDetailSection
Section wrapper với title, description và actions.

```tsx
<AdminDetailSection
  title="Sản phẩm"
  description="3 sản phẩm trong đơn hàng"
  actions={
    <Button variant="outline" size="sm">
      <Plus className="size-4" />
      Thêm
    </Button>
  }
>
  {/* Content here */}
</AdminDetailSection>
```

### 3. AdminDetailField
Field hiển thị label-value với tùy chọn copy.

```tsx
// Horizontal layout (default)
<AdminDetailField
  label="Mã đơn hàng"
  value="#12345"
  copyable
  copyValue="12345"
/>

// Vertical layout
<AdminDetailField
  label="Địa chỉ"
  value="123 Nguyễn Huệ, Q1, TP.HCM"
  vertical
/>
```

### 4. AdminInfoCard
Card wrapper cho nhóm thông tin liên quan.

```tsx
<AdminInfoCard icon={User} title="Thông tin khách hàng">
  <AdminDetailField label="Họ tên" value="Nguyễn Văn A" vertical />
  <AdminDetailField label="Email" value="email@example.com" copyable vertical />
  <AdminDetailField label="Số điện thoại" value="0123456789" copyable vertical />
</AdminInfoCard>
```

### 5. AdminTimeline
Timeline component cho lịch sử/tracking.

```tsx
const timelineItems: AdminTimelineItem[] = [
  {
    title: "Đơn hàng đã giao",
    description: "Giao hàng thành công",
    timestamp: "15/01/2024 14:30",
    status: "completed",
  },
  {
    title: "Đang giao hàng",
    description: "Shipper đang trên đường giao",
    timestamp: "15/01/2024 10:00",
    status: "current",
  },
  {
    title: "Đã xác nhận",
    timestamp: "14/01/2024 16:00",
    status: "completed",
  },
];

<AdminTimeline items={timelineItems} />
```

## 📐 Layout Patterns

### Pattern 1: Two-Column Layout (Recommended)

```tsx
<div className="space-y-6 p-6">
  <AdminDetailHeader {...headerProps} />
  
  <div className="grid gap-6 lg:grid-cols-3">
    {/* Main content - 2/3 width */}
    <div className="lg:col-span-2 space-y-6">
      <AdminDetailSection title="Main Content">
        {/* Primary content */}
      </AdminDetailSection>
      
      <div className="grid gap-6 md:grid-cols-2">
        <AdminInfoCard title="Info 1">...</AdminInfoCard>
        <AdminInfoCard title="Info 2">...</AdminInfoCard>
      </div>
    </div>
    
    {/* Sidebar - 1/3 width */}
    <aside className="space-y-6">
      <AdminDetailSection title="Summary">
        {/* Summary info */}
      </AdminDetailSection>
      
      <AdminDetailSection title="Actions">
        {/* Action buttons */}
      </AdminDetailSection>
    </aside>
  </div>
</div>
```

### Pattern 2: Single Column Layout

```tsx
<div className="space-y-6 p-6 max-w-4xl mx-auto">
  <AdminDetailHeader {...headerProps} />
  
  <AdminDetailSection title="Details">
    {/* Content */}
  </AdminDetailSection>
  
  <div className="grid gap-6 md:grid-cols-2">
    <AdminInfoCard title="Info 1">...</AdminInfoCard>
    <AdminInfoCard title="Info 2">...</AdminInfoCard>
  </div>
</div>
```

## 🎨 Design Principles

### 1. Information Hierarchy
- **Header**: Title, subtitle, status badge
- **Main content**: Primary information (products, details)
- **Sidebar**: Summary, actions, metadata
- **Footer**: Timeline, history, notes

### 2. Spacing
- Page padding: `p-6`
- Section spacing: `space-y-6`
- Card spacing: `space-y-4`
- Field spacing: `space-y-2` or `space-y-3`

### 3. Responsive Behavior
- Mobile: Stack all sections vertically
- Tablet: 2-column grid for info cards
- Desktop: 2/3 + 1/3 layout for main + sidebar

### 4. Visual Grouping
- Use `AdminDetailSection` for major sections
- Use `AdminInfoCard` for related fields
- Use borders and backgrounds to separate content

## 📝 Complete Examples

### Order Detail Page

```tsx
export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id);
  
  if (isLoading) return <LoadingSkeleton />;
  if (!order) return <NotFound />;
  
  return (
    <div className="space-y-6 p-6">
      <AdminDetailHeader
        backHref="/admin/orders"
        title={`Đơn hàng #${order.code}`}
        subtitle={`Tạo lúc: ${formatDate(order.createdAt)}`}
        badge={<Badge>{order.status}</Badge>}
        actions={
          <Button variant="outline" size="sm">
            <Printer className="size-4" />
            In hóa đơn
          </Button>
        }
      />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <AdminDetailSection title="Sản phẩm">
            <Table>
              {/* Product rows */}
            </Table>
          </AdminDetailSection>
          
          {/* Customer & Shipping */}
          <div className="grid gap-6 md:grid-cols-2">
            <AdminInfoCard icon={User} title="Khách hàng">
              <AdminDetailField label="Họ tên" value={order.customerName} vertical />
              <AdminDetailField label="Email" value={order.email} copyable vertical />
            </AdminInfoCard>
            
            <AdminInfoCard icon={MapPin} title="Địa chỉ giao hàng">
              <AdminDetailField label="Người nhận" value={order.recipientName} vertical />
              <AdminDetailField label="Địa chỉ" value={order.address} vertical />
            </AdminInfoCard>
          </div>
          
          {/* Timeline */}
          <AdminDetailSection title="Lịch sử đơn hàng">
            <AdminTimeline items={timelineItems} />
          </AdminDetailSection>
        </div>
        
        <aside className="space-y-6">
          {/* Summary */}
          <AdminDetailSection title="Tổng quan">
            <AdminDetailField label="Tạm tính" value={formatVND(order.subtotal)} />
            <AdminDetailField label="Phí ship" value={formatVND(order.shippingFee)} />
            <div className="pt-3 border-t">
              <AdminDetailField
                label={<span className="font-semibold">Tổng cộng</span>}
                value={<span className="font-semibold text-lg">{formatVND(order.total)}</span>}
              />
            </div>
          </AdminDetailSection>
          
          {/* Actions */}
          <AdminDetailSection title="Cập nhật trạng thái">
            <StatusUpdater orderId={id} currentStatus={order.status} />
          </AdminDetailSection>
        </aside>
      </div>
    </div>
  );
}
```

### Product Detail Page

```tsx
export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  
  if (isLoading) return <LoadingSkeleton />;
  if (!product) return <NotFound />;
  
  return (
    <div className="space-y-6 p-6">
      <AdminDetailHeader
        backHref="/admin/products"
        title={product.name}
        subtitle={`SKU: ${product.sku}`}
        badge={<Badge variant={product.active ? "default" : "secondary"}>
          {product.active ? "Đang bán" : "Ngừng bán"}
        </Badge>}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Edit className="size-4" />
              Sửa
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="size-4" />
              Xóa
            </Button>
          </>
        }
      />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <AdminDetailSection title="Hình ảnh">
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <Image key={i} src={img} alt="" width={200} height={200} className="rounded-lg" />
              ))}
            </div>
          </AdminDetailSection>
          
          {/* Description */}
          <AdminDetailSection title="Mô tả">
            <div className="prose prose-sm max-w-none">
              {product.description}
            </div>
          </AdminDetailSection>
          
          {/* Variants */}
          <AdminDetailSection title="Biến thể" description={`${product.variants.length} biến thể`}>
            <Table>
              {/* Variant rows */}
            </Table>
          </AdminDetailSection>
        </div>
        
        <aside className="space-y-6">
          {/* Basic Info */}
          <AdminInfoCard icon={Package} title="Thông tin cơ bản">
            <AdminDetailField label="Giá" value={formatVND(product.price)} vertical />
            <AdminDetailField label="Tồn kho" value={product.stock} vertical />
            <AdminDetailField label="Danh mục" value={product.category} vertical />
          </AdminInfoCard>
          
          {/* SEO */}
          <AdminInfoCard icon={Globe} title="SEO">
            <AdminDetailField label="Slug" value={product.slug} copyable vertical />
            <AdminDetailField label="Meta title" value={product.metaTitle} vertical />
          </AdminInfoCard>
        </aside>
      </div>
    </div>
  );
}
```

## 🎯 Best Practices

### 1. Loading States
```tsx
if (isLoading) {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
```

### 2. Error States
```tsx
if (error || !data) {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <AlertCircle className="size-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Không thể tải dữ liệu</h3>
        <p className="text-sm text-muted-foreground mb-4">{error?.message}</p>
        <Button onClick={refetch}>Thử lại</Button>
      </div>
    </div>
  );
}
```

### 3. Empty States
```tsx
{items.length === 0 ? (
  <div className="text-center py-8">
    <Package className="size-12 text-muted-foreground mx-auto mb-3" />
    <p className="text-sm text-muted-foreground">Chưa có sản phẩm nào</p>
  </div>
) : (
  <Table>...</Table>
)}
```

### 4. Copyable Fields
Always provide copyable option for IDs, codes, emails, phones:
```tsx
<AdminDetailField
  label="Mã đơn hàng"
  value="#12345"
  copyable
  copyValue="12345"
/>
```

### 5. Status Badges
Use consistent badge variants:
```tsx
<Badge variant={
  status === "completed" ? "default" :
  status === "pending" ? "secondary" :
  "outline"
}>
  {statusLabel}
</Badge>
```

## 🚀 Migration Checklist

- [ ] Replace custom headers with `AdminDetailHeader`
- [ ] Wrap sections with `AdminDetailSection`
- [ ] Replace field displays with `AdminDetailField`
- [ ] Group related fields in `AdminInfoCard`
- [ ] Use `AdminTimeline` for history/tracking
- [ ] Implement proper loading states
- [ ] Implement proper error states
- [ ] Add copyable option to relevant fields
- [ ] Test responsive behavior
- [ ] Test accessibility (keyboard, screen readers)
