export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  addresses?: any[];
  created_at?: string;
}

export interface CustomerRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}
