"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { blogKeys } from "@/constant/key/blog";
import { postService } from "@/service/post.service";
import type { BlogPost } from "@/type/blog";

export function usePosts(params?: { page?: number; limit?: number }) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  return useQuery({
    queryKey: blogKeys.list(page, limit),
    queryFn: () => postService.list({ page, limit }),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

export function usePostBySlug(slug?: string) {
  const enabled = typeof slug === "string" && slug.length > 0;
  return useQuery({
    queryKey: enabled ? blogKeys.detail(slug!) : blogKeys.detail(""),
    queryFn: () => postService.getBySlug(slug!),
    enabled,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

// Admin mutations
export function useCreatePost() {
  return useMutation({
    mutationFn: (payload: Partial<BlogPost>) => postService.admin.create(payload),
  });
}

export function useUpdatePost() {
  return useMutation({
    mutationFn: (params: { id: string; payload: Partial<BlogPost> }) =>
      postService.admin.update(params.id, params.payload),
  });
}

export function useDeletePost() {
  return useMutation({
    mutationFn: (id: string) => postService.admin.delete(id),
  });
}

export function useUploadPostThumbnail() {
  return useMutation({
    mutationFn: (params: { id: string; file: File }) =>
      postService.admin.uploadThumbnail(params.id, params.file),
  });
}
