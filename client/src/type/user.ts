export interface User {
  id: string;
  name?: string;
  username?: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string | null;
  role?: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UpdateUserPayload {
  name?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string | null;
}

export interface ApiSuccess<T> {
  data: T;
}
