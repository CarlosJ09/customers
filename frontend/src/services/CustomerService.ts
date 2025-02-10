import { api } from "@/interceptor/axios";
import { ResponseWithPagination } from "@/types/api";
import { CustomerResponse, CustomerRequest, DashboardStats } from "@/types/customer";

export const customerService = {
  getAll: async (page: number, search?: string, countryId?: number) => {
    const params = new URLSearchParams({ page: page.toString() });

    if (search) params.append("search", search);
    if (countryId) params.append("country_id", countryId.toString());

    const response = await api.get<ResponseWithPagination<CustomerResponse>>(
      `/customers?${params.toString()}`
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

  bulkDelete: async (customerIds: number[]) => {
    const response = await api.post<{ error?: string }>("/customers/bulk_delete/", {
      customer_ids: customerIds,
    });
    return response;
  },

  getDashboardStats: async () => {
    const response = await api.get<DashboardStats>("/dashboard/");
    return response;
  },
};
