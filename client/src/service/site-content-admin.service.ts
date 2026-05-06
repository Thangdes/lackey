import { http, httpSuccess } from "@/utils/http";
import { API } from "@/constant/api";
import { api } from "@/utils/http";
import { unwrapData, unwrapDataArray } from "@/utils/response";

export type ContentType = "BANNER" | "TESTIMONIAL" | "GALLERY";

export type SiteContentAdminItem = {
  id: string;
  type: ContentType;
  title: string;
  content?: string;
  thumbnailUrl?: string;
  linkUrl?: string;
  authorName?: string;
  authorTitle?: string;
  displayOrder?: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateSiteContentPayload = {
  type: ContentType;
  title: string;
  content?: string;
  thumbnailUrl?: string;
  linkUrl?: string;
  authorName?: string;
  authorTitle?: string;
  displayOrder?: number;
  isPublished?: boolean;
};

export type UpdateSiteContentPayload = Partial<CreateSiteContentPayload>;

export const siteContentAdminService = {
  list: (type?: ContentType) =>
    http.get<unknown>(API.siteContent.adminAll(type)).then((raw) => unwrapDataArray<SiteContentAdminItem>(raw)),
  getById: (id: string) =>
    http.get<unknown>(API.siteContent.adminById(id)).then((raw) => unwrapData<SiteContentAdminItem>(raw)),
  create: (payload: CreateSiteContentPayload) => httpSuccess.postData<SiteContentAdminItem>(API.siteContent.create, payload),
  update: (id: string, payload: UpdateSiteContentPayload) => httpSuccess.patchData<SiteContentAdminItem>(API.siteContent.adminById(id), payload),
  remove: (id: string) => httpSuccess.deleteData<{ id: string }>(API.siteContent.adminById(id)),
  uploadThumbnail: (id: string, file: File) => {
    const form = new FormData();
    form.append("thumbnail", file);
    return api
      .post<SiteContentAdminItem>(API.siteContent.thumbnail(id), form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      .then((r) => r.data);
  },
};
