"use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/service/category.service";
import { productService } from "@/service/product.service";

export type OptionItem = { id: string; name: string; slug?: string };

export function useOptionsData() {
  const [categoryOptions, setCategoryOptions] = useState<OptionItem[]>([]);
  const [brandOptions, setBrandOptions] = useState<OptionItem[]>([]);

  useEffect(() => {
    let mounted = true;
    categoryService
      .list()
      .then((cats) => {
        if (!mounted) return;
        const mapped = (cats || [])
          .map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
          .filter((c) => !!c.id && !!c.name);
        if (mapped.length > 0) setCategoryOptions(mapped);
      })
      .catch(() => {})
      .finally(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    productService
      .getSuppliers()
      .then((list) => {
        if (!mounted) return;
        const mapped = (list || [])
          .map((s) => ({ id: s.id, name: s.name }))
          .filter((b) => !!b.id && !!b.name);
        setBrandOptions(mapped);
      })
      .catch(() => {})
      .finally(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return { categoryOptions, brandOptions };
}
