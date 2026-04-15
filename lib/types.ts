export interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: number;
  name: string;
  taxId?: string;
  plan: string;
  credits: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreditPackage {
  id: number;
  name: string;
  credits: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  company: Company;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  companyId: number;
}
