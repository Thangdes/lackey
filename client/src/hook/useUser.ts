"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/service/user.service";
import type { UpdateUserPayload, User } from "@/type/user";
import { userKeys as keys } from "@/constant/key/user";

import { useIsAuthenticated } from "@/hook/useIsAuthenticated";

export function useUserMe() {
  const isAuth = useIsAuthenticated();
  return useQuery({
    queryKey: keys.me(),
    queryFn: () => userService.getMe(),
    enabled: isAuth,
  });
}

export function useUserById(id: string) {
  return useQuery({
    queryKey: keys.byId(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

export function useUserList(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: keys.list(page, pageSize),
    queryFn: () => userService.list({ page, pageSize }),
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => userService.updateMe(payload),
    onSuccess: (updated: User) => {
      qc.setQueryData<User>(keys.me(), updated);
    },
  });
}
