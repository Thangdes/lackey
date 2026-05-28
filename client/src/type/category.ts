export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  thumbnailUrl?: string | null;
};

export interface CategoryWithCount extends Category {
  productCount?: number;
}
