import { http } from "@/utils/http";
import { API } from "@/constant/api";

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
  list: () => http.get<Supplier[]>(API.admin.suppliers.root),
  getById: (id: string) => http.get<SupplierDetails>(API.admin.suppliers.byId(id)),
  create: (dto: CreateSupplierDto) => http.post<Supplier>(API.admin.suppliers.root, dto),
  update: (id: string, dto: UpdateSupplierDto) => http.patch<Supplier>(API.admin.suppliers.byId(id), dto),
  delete: (id: string) => http.delete<{ message: string }>(API.admin.suppliers.byId(id)),
  activate: (id: string) => http.patch<{ message: string }>(API.admin.suppliers.activate(id)),
  createUser: (dto: CreateSupplierUserDto) => http.post<{ id: string; username: string; supplierId: string }>(API.admin.suppliers.users, dto),
  deactivateUser: (userId: string) => http.patch<{ message: string }>(API.admin.suppliers.deactivateUser(userId)),
  reactivateUser: (userId: string) => http.patch<{ message: string }>(API.admin.suppliers.reactivateUser(userId)),
  resetUserPassword: (userId: string, password: string) => http.patch<{ message: string }>(API.admin.suppliers.resetUserPassword(userId), { password }),
  deleteUser: (userId: string) => http.delete<{ message: string }>(API.admin.suppliers.deleteUser(userId)),
};
