import { api } from "@/interceptor/axios";
import { Customer, CustomerRequest } from "@/types/customer";

export const customerService = {
  getAll: async () => {
    const response = await api.get<Customer[]>("/customers/");
    return response;
  },

  getById: async (id: number) => {
    const response = await api.get<Customer>(`/customers/${id}/`);
    return response;
  },

  create: async (customerData: CustomerRequest) => {
    const response = await api.post<Customer>("/customers/", customerData);
    return response;
  },

  update: async (id: number, customerData: CustomerRequest) => {
    const response = await api.put<Customer>(`/customers/${id}/`, customerData);
    return response;
  },

  delete: async (id: number) => {
    await api.delete(`/customers/${id}/`);
    return { success: true };
  },
};
