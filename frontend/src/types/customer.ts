export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  addresses?: any[];
  created_at?: string;
}

export interface CustomerResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  addresses: Array<{
    id: number;
    city: {
      id: number;
      name: string;
      state: {
        id: number;
        name: string;
        country: {
          id: number;
          name: string;
          code: string;
        };
      };
    };
    street: string;
    zip_code: string;
  }>;
}

export interface CustomerRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}
