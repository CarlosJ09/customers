export interface AddressForm {
  id: number;
  countryId: number | null;
  stateId: number | null;
  cityId: number | null;
  street: string;
  postalCode: string;
}
export interface Country {
  id: number;
  name: string;
  code: string;
}

export interface State {
  id: number;
  name: string;
  countryId: number;
}

export interface City {
  id: number;
  name: string;
  stateId: number;
}
