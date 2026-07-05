import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  SearchBar,
  ServiceFilter,
  ServiceList,
  ServiceMapView,
} from '@/features/services';
import {
  useGetCategoryQuery,
  useGetServicesListQuery,
} from '@/features/services/serviceApi';
import type {
  Category,
  Filters,
  ServiceResult,
  ServicesQueryParams,
} from '@/features/services/types';

import { SpinnerLoader } from '@/components/loaders/SpinnerLoader';

import { useGeolocation } from '@/hooks/useGeolocation';

const FALLBACK_CENTER = { lat: 27.7172, lng: 85.324 }; // Kathmandu — match ServiceMapView's fallback

const EMPTY_SERVICES: ServiceResult[] = [];
const EMPTY_CATEGORIES: Category[] = [];

export default function Services() {
  const [serviceName, setServiceName] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [geoParams, setGeoParams] = useState<{
    lat: number;
    lng: number;
    radius_km: number;
  } | null>(null);
  const [hasAppliedRealLocation, setHasAppliedRealLocation] = useState(false);
  const geolocation = useGeolocation();

  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');

  const [filters, setFilters] = useState<Filters>({
    category: '',
    skills: [],
    priceMin: '',
    priceMax: '',
    priceType: '',
    availabilityStatus: '',
    availableNow: false,
    hasLocation: null,
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: categories } = useGetCategoryQuery(null);

  const queryParams = useMemo<ServicesQueryParams>(
    () => ({
      page: currentPage,
      page_size: viewMode === 'map' ? 200 : 20, // map isn't paginated visually — fetch everything in the radius
      ordering: sortBy,

      ...(serviceName.trim() && { search: serviceName.trim() }),
      ...(locationQuery.trim() && { city: locationQuery.trim() }),
      ...(filters.category && { category: filters.category }),
      ...(filters.skills.length > 0 && { skill: filters.skills }),
      ...(filters.priceMin && { price_min: filters.priceMin }),
      ...(filters.priceMax && { price_max: filters.priceMax }),
      ...(filters.priceType && { price_type: filters.priceType }),
      ...(filters.availabilityStatus && {
        availability_status: filters.availabilityStatus,
      }),
      ...(filters.availableNow && { is_available: 'true' }),
      ...(filters.hasLocation !== null && {
        has_location: filters.hasLocation ? 'true' : 'false',
      }),
      ...(viewMode === 'map' &&
        geoParams && {
          lat: geoParams.lat,
          lng: geoParams.lng,
          radius_km: geoParams.radius_km,
        }),
    }),
    [
      serviceName,
      locationQuery,
      filters,
      sortBy,
      currentPage,
      viewMode,
      geoParams,
    ]
  );

  const { data, isLoading, isError, error } =
    useGetServicesListQuery(queryParams);
  const totalPages = data?.total_pages ?? 1;
  const totalCount = data?.count ?? 0;

  const handleSearch = useCallback(() => setCurrentPage(1), []);
  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);
  const handleResetFilters = useCallback(() => {
    setFilters({
      category: '',
      skills: [],
      priceMin: '',
      priceMax: '',
      priceType: '',
      availabilityStatus: '',
      availableNow: false,
      hasLocation: null,
    });
    setServiceName('');
    setLocationQuery('');
    setCurrentPage(1);
  }, []);

  const userLocation = useMemo(
    () =>
      geolocation.lat && geolocation.lng
        ? { lat: geolocation.lat, lng: geolocation.lng }
        : null,
    [geolocation.lat, geolocation.lng]
  );

  const [prevViewMode, setPrevViewMode] = useState(viewMode);
  if (viewMode !== prevViewMode) {
    setPrevViewMode(viewMode);
    if (viewMode === 'map') {
      setGeoParams({
        lat: userLocation?.lat ?? FALLBACK_CENTER.lat,
        lng: userLocation?.lng ?? FALLBACK_CENTER.lng,
        radius_km: 10,
      });
      setHasAppliedRealLocation(!!userLocation);
    } else {
      setGeoParams(null);
      setHasAppliedRealLocation(false);
    }
  }

  const [appliedLocationKey, setAppliedLocationKey] = useState<string | null>(
    null
  );
  const userLocationKey = userLocation
    ? `${userLocation.lat},${userLocation.lng}`
    : null;
  if (
    viewMode === 'map' &&
    userLocation &&
    !hasAppliedRealLocation &&
    userLocationKey !== appliedLocationKey
  ) {
    setAppliedLocationKey(userLocationKey);
    setHasAppliedRealLocation(true);
    setGeoParams({
      lat: userLocation.lat,
      lng: userLocation.lng,
      radius_km: 10,
    });
  }

  useEffect(() => {
    if (viewMode === 'map' && geolocation.permissionStatus === 'prompt') {
      geolocation.requestLocation();
    }
  }, [viewMode, geolocation.permissionStatus, geolocation.requestLocation]);

  const handleBoundsChange = useCallback(
    (lat: number, lng: number, radius_km: number) => {
      setGeoParams({ lat, lng, radius_km });
    },
    []
  );

  if (viewMode === 'map') {
    return (
      <div className="fixed inset-0 top-15 z-0">
        <ServiceMapView
          services={data?.results ?? EMPTY_SERVICES}
          totalCount={totalCount}
          center={geoParams ? { lat: geoParams.lat, lng: geoParams.lng } : null}
          userLocation={userLocation}
          onBoundsChange={handleBoundsChange}
          isLoading={isLoading}
          permissionStatus={geolocation.permissionStatus}
          onRequestLocation={geolocation.requestLocation}
        />

        <div className="absolute top-4 left-4 right-4 z-999">
          <SearchBar
            serviceName={serviceName}
            onSearchChange={setServiceName}
            onSearch={handleSearch}
            onSortChange={setSortBy}
            sortBy={sortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        <div className="absolute top-30 left-4 z-999 w-72 max-h-[calc(100%-8rem)] overflow-y-auto">
          <ServiceFilter
            categories={categories ?? EMPTY_CATEGORIES}
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            mapview={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 mt-4 mb-6">
      <div className="mb-6">
        <SearchBar
          serviceName={serviceName}
          onSearchChange={setServiceName}
          onSearch={handleSearch}
          onSortChange={setSortBy}
          sortBy={sortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <ServiceFilter
              categories={categories ?? EMPTY_CATEGORIES}
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              mapview={false}
            />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {isLoading && (
            <div className="grow flex items-center justify-center">
              <SpinnerLoader />
            </div>
          )}
          {isError && (
            <div className="grow flex items-center justify-center">
              <p className="text-error">Error: {(error as any)?.message}</p>
            </div>
          )}
          {!isLoading && !isError && (
            <ServiceList
              services={data?.results ?? EMPTY_SERVICES}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
