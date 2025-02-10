import { api } from "@/interceptor/axios";
import { ResponseWithPagination } from "@/types/api";
import { CustomerResponse, CustomerRequest } from "@/types/customer";

export const customerService = {
  getAll: async (page: number) => {
    const response = await api.get<ResponseWithPagination<CustomerResponse>>(
      `/customers?page=${page}`
    );
    return response;
  },

  getById: async (id: number) => {
    const response = await api.get<CustomerResponse>(`/customers/${id}/`);
    return response;
  },

  create: async (customerData: CustomerRequest) => {
    const response = await api.post<CustomerResponse>("/customers/", customerData);
    return response;
  },

  update: async (id: number, customerData: CustomerRequest) => {
    const response = await api.put<CustomerResponse>(`/customers/${id}/`, customerData);
    return response;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/customers/${id}/`);
    return response;
  },
};
