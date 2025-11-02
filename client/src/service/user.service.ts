import { http, httpSuccess } from "@/utils/http";
import { API } from "@/constant/api";
import type { Paginated, UpdateUserPayload, User } from "@/type/user";

export const userService = {
  // GET /auth/profile
  getMe: () => http.get<User | null>(API.user.me),

  // GET /users/:id
  getById: (id: string) => httpSuccess.getData<User>(API.user.byId(id)),

  // PATCH /auth/profile
  updateMe: (payload: UpdateUserPayload) =>
    http.patch<User>(API.user.me, payload),

  // Example: GET /users?page=1&pageSize=10
  list: (params?: { page?: number; pageSize?: number }) =>
    http.get<Paginated<User>>(API.user.list(params?.page ?? 1, params?.pageSize ?? 10)),
};
