export type ServicePriceType = 'fixed' | 'hourly' | '';
export type ServiceAvailabilityStatus =
  'available' | 'unavailable' | 'break' | 'holiday' | '';
export type ServiceStatusFilter = 'draft' | 'active' | 'paused' | 'closed' | '';

export interface MyServicesFilters {
  search: string;
  priceType: ServicePriceType;
  availabilityStatus: ServiceAvailabilityStatus;
  status: ServiceStatusFilter;
  category: string;
}

export const DEFAULT_MY_SERVICES_FILTERS: MyServicesFilters = {
  search: '',
  priceType: '',
  availabilityStatus: '',
  status: '',
  category: '',
};
