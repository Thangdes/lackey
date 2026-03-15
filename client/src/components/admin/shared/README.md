# Admin Shared Components

Hệ thống các component tái sử dụng cho admin panel với thiết kế minimal và đồng nhất.

## Components

### 1. AdminPageHeader

Header chuẩn cho các trang admin với icon, title, description và actions.

```tsx
import { AdminPageHeader } from "@/components/admin/shared";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

<AdminPageHeader
  icon={Package}
  title="Sản phẩm"
  description="Quản lý sản phẩm trong hệ thống"
  actions={
    <>
      <AdminSearchBar value={query} onChange={setQuery} />
      <Button>
        <Plus className="size-4" />
        Thêm sản phẩm
      </Button>
    </>
  }
/>
```

### 2. AdminSearchBar

Search bar với icon tìm kiếm tích hợp sẵn.

```tsx
import { AdminSearchBar } from "@/components/admin/shared";

<AdminSearchBar
  value={query}
  onChange={setQuery}
  placeholder="Tìm theo tên hoặc mã..."
  className="max-w-md"
/>
```

### 3. AdminTable

Table component linh hoạt với loading, empty state, và pagination.

```tsx
import { AdminTable, type AdminTableColumn } from "@/components/admin/shared";

const columns: AdminTableColumn<Product>[] = [
  {
    key: "name",
    label: "Tên sản phẩm",
    render: (item) => <span className="font-medium">{item.name}</span>,
  },
  {
    key: "price",
    label: "Giá",
    width: "120px",
    align: "right",
    render: (item) => formatCurrency(item.price),
  },
  {
    key: "actions",
    label: "",
    width: "100px",
    align: "right",
    render: (item) => (
      <AdminActionButtons
        onEdit={() => handleEdit(item.id)}
        onDelete={() => handleDelete(item.id)}
      />
    ),
  },
];

<AdminTable
  columns={columns}
  data={products}
  loading={isLoading}
  emptyMessage="Chưa có sản phẩm nào"
  emptyIcon={<Package className="size-12 text-muted-foreground/30" />}
  onRetry={refetch}
/>
```

### 4. AdminPagination

Pagination component với page selector và limit selector.

```tsx
import { AdminPagination } from "@/components/admin/shared";

<AdminPagination
  page={page}
  limit={limit}
  total={total}
  onPageChange={setPage}
  onLimitChange={setLimit}
/>
```

### 5. AdminFormField

Form field với label, error, hint tích hợp sẵn.

```tsx
import { AdminFormField } from "@/components/admin/shared";

<AdminFormField
  label="Tên sản phẩm"
  value={name}
  onChange={setName}
  placeholder="Nhập tên sản phẩm"
  error={nameError}
  hint="Tên hiển thị trên website"
  required
/>

<AdminFormField
  label="Mô tả"
  type="textarea"
  value={description}
  onChange={setDescription}
  rows={4}
  maxLength={1000}
/>

<AdminFormField
  label="Giá"
  type="number"
  value={price}
  onChange={setPrice}
  min={0}
  step={1000}
/>
```

### 6. AdminFormDialog

Dialog wrapper cho form create/edit với footer buttons.

```tsx
import { AdminFormDialog } from "@/components/admin/shared";

<AdminFormDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  title="Thêm sản phẩm"
  description="Tạo một sản phẩm mới"
  onSave={handleSave}
  saving={isSaving}
  saveLabel="Tạo"
  maxWidth="lg"
>
  <AdminFormField label="Tên" value={name} onChange={setName} required />
  <AdminFormField label="Giá" type="number" value={price} onChange={setPrice} required />
</AdminFormDialog>
```

### 7. AdminActionButtons

Action buttons (Edit/Delete) với confirmation dialog tích hợp.

```tsx
import { AdminActionButtons } from "@/components/admin/shared";

<AdminActionButtons
  onEdit={() => handleEdit(item.id)}
  onDelete={() => handleDelete(item.id)}
  deleteTitle="Xác nhận xóa sản phẩm"
  deleteDescription="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
/>
```

## Design Principles

### 1. Minimal Design
- Spacing đồng nhất: `space-y-6` cho page layout, `gap-4` cho form fields
- Border radius: `rounded-lg` cho containers, `rounded-md` cho inputs
- Colors: Sử dụng design tokens (primary, muted, destructive, etc.)

### 2. Consistent Typography
- Page title: `text-2xl font-semibold tracking-tight`
- Section title: `text-lg font-semibold`
- Label: `text-sm font-medium`
- Body text: `text-sm`
- Hint/helper: `text-xs text-muted-foreground`

### 3. Responsive Design
- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`
- Flexible layouts với `flex-col md:flex-row`

### 4. Accessibility
- Proper label associations
- ARIA labels cho icons
- Keyboard navigation support
- Focus states với ring

### 5. Loading States
- Skeleton loaders cho tables
- Disabled states cho buttons
- Loading spinners cho async actions

## Usage Pattern

### Typical Admin Page Structure

```tsx
"use client";
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AdminPageHeader,
  AdminSearchBar,
  AdminTable,
  AdminPagination,
  AdminActionButtons,
  type AdminTableColumn,
} from "@/components/admin/shared";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  
  const { data, isLoading } = useProducts({ page, limit });
  
  const filtered = useMemo(() => {
    if (!query) return data?.items || [];
    return data?.items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    ) || [];
  }, [data, query]);
  
  const columns: AdminTableColumn<Product>[] = [
    // Define columns...
  ];
  
  return (
    <div className="space-y-6 p-6">
      <AdminPageHeader
        icon={Package}
        title="Sản phẩm"
        description="Quản lý sản phẩm trong hệ thống"
        actions={
          <>
            <AdminSearchBar value={query} onChange={setQuery} />
            <Button>
              <Plus className="size-4" />
              Thêm
            </Button>
          </>
        }
      />
      
      <AdminTable
        columns={columns}
        data={filtered}
        loading={isLoading}
        emptyMessage="Chưa có sản phẩm"
      />
      
      <AdminPagination
        page={page}
        limit={limit}
        total={data?.total}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  );
}
```

## Migration Guide

### Before (Old Pattern)
```tsx
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <h1 className="text-xl font-bold">Sản phẩm</h1>
    <Input value={query} onChange={(e) => setQuery(e.target.value)} />
  </div>
  <Table>
    {/* Manual table implementation */}
  </Table>
</div>
```

### After (New Pattern)
```tsx
<div className="space-y-6 p-6">
  <AdminPageHeader
    title="Sản phẩm"
    actions={<AdminSearchBar value={query} onChange={setQuery} />}
  />
  <AdminTable columns={columns} data={data} />
</div>
```

## Benefits

1. **Consistency**: Tất cả admin pages có cùng look & feel
2. **Maintainability**: Thay đổi design ở một nơi, áp dụng toàn bộ
3. **Developer Experience**: Ít code hơn, dễ đọc hơn
4. **Type Safety**: Full TypeScript support
5. **Accessibility**: Built-in a11y best practices
