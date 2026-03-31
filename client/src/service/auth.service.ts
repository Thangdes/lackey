import { httpSuccess } from "@/utils/http";
import { API } from "@/constant/api";
import type { User } from "@/type/user";

export const authService = {
  signup: (payload: { username: string; email: string; password: string }) =>
    httpSuccess.postData<{ message: string }>(API.auth.signup, payload),

  login: (payload: { email: string; password: string }) =>
    httpSuccess.postData<{ message: string }>(API.auth.login, payload),

  profile: () => httpSuccess.getData<User | null>(API.auth.profile),

  refresh: () => httpSuccess.postData<{ message: string }>(API.auth.refresh),

  logout: () => httpSuccess.postData<{ message: string }>(API.auth.logout),
};
