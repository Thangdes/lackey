import { http } from "@/utils/http";
import { API } from "@/constant/api";
import { unwrapData, unwrapDataArray } from "@/utils/response";

export type Supplier = {
  id: string;
  name: string;
  email: string;
  contactName?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive?: boolean;
  createdAt?: string;
};

export type SupplierUser = {
  id: string;
  username: string;
  createdAt?: string;
  supplierId: string;
  isActive?: boolean;
};

export type SupplierDetails = Supplier & {
  users: Pick<SupplierUser, "id" | "username" | "createdAt" | "isActive">[];
};

export type CreateSupplierUserDto = {
  supplierId: string;
  username?: string;
  email?: string;
  password: string;
};

export type CreateSupplierDto = {
  name: string;
  email: string;
  contactName?: string;
  phone?: string;
  address?: string;
};

export type UpdateSupplierDto = Partial<CreateSupplierDto> & {
  isActive?: boolean;
};

export const supplierAdminService = {
  list: () => http.get<unknown>(API.admin.suppliers.root).then((raw) => unwrapDataArray<Supplier>(raw)),
  getById: (id: string) => http.get<unknown>(API.admin.suppliers.byId(id)).then((raw) => unwrapData<SupplierDetails>(raw)),
  create: (dto: CreateSupplierDto) => http.post<unknown>(API.admin.suppliers.root, dto).then((raw) => unwrapData<Supplier>(raw)),
  update: (id: string, dto: UpdateSupplierDto) => http.patch<unknown>(API.admin.suppliers.byId(id), dto).then((raw) => unwrapData<Supplier>(raw)),
  delete: (id: string) => http.delete<unknown>(API.admin.suppliers.byId(id)).then((raw) => unwrapData<{ message: string }>(raw)),
  activate: (id: string) => http.patch<unknown>(API.admin.suppliers.activate(id)).then((raw) => unwrapData<{ message: string }>(raw)),
  createUser: (dto: CreateSupplierUserDto) =>
    http.post<unknown>(API.admin.suppliers.users, dto).then((raw) => unwrapData<{ id: string; username: string; supplierId: string }>(raw)),
  deactivateUser: (userId: string) => http.patch<unknown>(API.admin.suppliers.deactivateUser(userId)).then((raw) => unwrapData<{ message: string }>(raw)),
  reactivateUser: (userId: string) => http.patch<unknown>(API.admin.suppliers.reactivateUser(userId)).then((raw) => unwrapData<{ message: string }>(raw)),
  resetUserPassword: (userId: string, password: string) =>
    http.patch<unknown>(API.admin.suppliers.resetUserPassword(userId), { password }).then((raw) => unwrapData<{ message: string }>(raw)),
  deleteUser: (userId: string) => http.delete<unknown>(API.admin.suppliers.deleteUser(userId)).then((raw) => unwrapData<{ message: string }>(raw)),
};
