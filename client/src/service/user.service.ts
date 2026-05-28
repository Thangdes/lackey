import { http, httpSuccess } from "@/utils/http";
import { API } from "@/constant/api";
import type { Paginated, UpdateUserPayload, User } from "@/type/user";

export const userService = {
  
  getMe: () => http.get<User | null>(API.user.me),

  
  getById: (id: string) => httpSuccess.getData<User>(API.user.byId(id)),

  
  updateMe: (payload: UpdateUserPayload) =>
    http.patch<User>(API.user.me, payload),

  
  list: (params?: { page?: number; pageSize?: number }) =>
    http.get<Paginated<User>>(API.user.list(params?.page ?? 1, params?.pageSize ?? 10)),
};
