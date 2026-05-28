import { http, httpSuccess, api } from "@/utils/http";
import { API } from "@/constant/api";
import type { Product } from "@/type/product";
import type { Category } from "@/type/category";


export type { Category };

export const categoryService = {
  list: async () => {
    const res = await http.get<
      | Category[]
      | { data: Category[]; meta?: unknown }
      | { success?: boolean; data?: Category[] | { data?: Category[] } }
    >(API.category.root);

    if (Array.isArray(res)) return res;
    const wrapped = res as { success?: boolean; data?: Category[] | { data?: Category[] } };
    const data = wrapped?.data;
    if (Array.isArray(data)) return data;
    return (data as { data?: Category[] } | undefined)?.data ?? (res as { data?: Category[] } | undefined)?.data ?? [];
  },
  headerTop: async () => {
    
    const res = await http.get<
      | Category[]
      | { data: Category[] }
      | { success?: boolean; data?: Category[] | { data?: Category[] } }
    >(API.category.header);

    if (Array.isArray(res)) return res;
    const wrapped = res as { success?: boolean; data?: Category[] | { data?: Category[] } };
    const data = wrapped?.data;
    if (Array.isArray(data)) return data;
    return (data as { data?: Category[] } | undefined)?.data ?? (res as { data?: Category[] } | undefined)?.data ?? [];
  },
  getById: (id: string) => httpSuccess.getData<Category>(API.category.byId(id)),
  getWithProducts: (id: string) =>
    httpSuccess.getData<{ category: Category & { image?: string | null }; products: Product[] }>(API.category.products(id)),
  
  create: (payload: Partial<Category>) => http.post<Category>(API.category.root, payload),
  update: (id: string, payload: Partial<Category>) => httpSuccess.patchData<Category>(API.category.byId(id), payload),
  delete: (id: string) => httpSuccess.deleteData<{ id: string }>(API.category.byId(id)),
  uploadThumbnail: (id: string, file: File) => {
    const form = new FormData();
    form.append("thumbnail", file);
    return api.post<Category>(API.category.thumbnail(id), form, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }).then((r) => r.data);
  },
};
