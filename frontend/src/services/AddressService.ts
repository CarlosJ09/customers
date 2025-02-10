import { api } from "@/interceptor/axios";
import { Country, State, City } from "@/types/address";
import { ResponseWithPagination } from "@/types/api";

export const addressService = {
  getCountries: async () => {
    const response = await api.get<ResponseWithPagination<Country>>("/countries/");
    return response;
  },

  getStatesByCountry: async (countryId: number) => {
    const response = await api.get<State[]>(`/states/by_country/?country_id=${countryId}`);
    return response;
  },

  getCitiesByState: async (stateId: number) => {
    const response = await api.get<City[]>(`/cities/by_state/?state_id=${stateId}`);
    return response;
  },
};
