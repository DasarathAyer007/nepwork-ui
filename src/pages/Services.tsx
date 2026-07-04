// import { useCallback, useEffect, useMemo, useState } from 'react';
// import { SearchBar, ServiceFilter, ServiceList, ServiceMapView } from '@/features/services';
// import {
//   useGetCategoryQuery,
//   useGetServicesListQuery,
// } from '@/features/services/serviceApi';
// import type { Filters, ServicesQueryParams } from '@/features/services/types';
// import { useGeolocation } from '@/hooks/useGeolocation';
// export default function Services() {
//   const [serviceName, setServiceName] = useState('');
//   const [locationQuery, setLocationQuery] = useState('');
//   const [geoParams, setGeoParams] = useState<{ lat: number; lng: number; radius_km: number } | null>(null);
//   const geolocation= useGeolocation();
//     const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
//   const [filters, setFilters] = useState<Filters>({
//     category: '',
//     skills: [],
//     priceMin: '',
//     priceMax: '',
//     priceType: '',
//     availabilityStatus: '',
//     availableNow: false,
//     hasLocation: null,
//   });
//   const [sortBy, setSortBy] = useState('created_at');
//   const [currentPage, setCurrentPage] = useState(1);
//   // Fetch categories for dropdown
//   const { data: categories } = useGetCategoryQuery(null);
//   const queryParams = useMemo<ServicesQueryParams>(
//     () => ({
//       page: currentPage,
//       page_size: 20,
//       ordering: sortBy,
//       ...(serviceName.trim() && {
//         search: serviceName.trim(),
//       }),
//       ...(locationQuery.trim() && {
//         city: locationQuery.trim(), // or state/country depending on your UI
//       }),
//       ...(filters.category && {
//         category: (filters.category),
//       }),
//       ...(filters.skills.length > 0 && {
//         skill: filters.skills,
//       }),
//       ...(filters.priceMin && {
//         price_min: filters.priceMin,
//       }),
//       ...(filters.priceMax && {
//         price_max: filters.priceMax,
//       }),
//       ...(filters.priceType && {
//         price_type: filters.priceType,
//       }),
//       ...(filters.availabilityStatus && {
//         availability_status: filters.availabilityStatus,
//       }),
//       ...(filters.availableNow && {
//         is_available: 'true',
//       }),
//       ...(filters.hasLocation !== null && {
//         has_location: filters.hasLocation ? 'true' : 'false',
//       }),
//         ...(viewMode === 'map' &&
//         geoParams && {
//           lat: geoParams.lat,
//           lng: geoParams.lng,
//           radius_km: geoParams.radius_km,
//         })
//     }),
//     [serviceName, locationQuery, filters, sortBy, currentPage,viewMode, geoParams]
//   );
// console.log('queryParams sent to API:', queryParams);
//   const { data, isLoading, isError, error } =useGetServicesListQuery(queryParams);
//   const totalPages = data?.total_pages ?? 1;
//   // Handlers
//   const handleSearch = () => setCurrentPage(1);
//   const handleFilterChange = (newFilters: Filters) => {
//     setFilters(newFilters);
//     setCurrentPage(1);
//   };
//   const handleResetFilters = () => {
//     setFilters({
//       category: '',
//       skills: [],
//       priceMin: '',
//       priceMax: '',
//       priceType: '',
//       availabilityStatus: '',
//       availableNow: false,
//       hasLocation: null,
//     });
//     setServiceName('');
//     setLocationQuery('');
//     setCurrentPage(1);
//   };
//   useEffect(() => {
//     if (viewMode === 'map' && !geoParams && geolocation.lat && geolocation.lng) {
//       setGeoParams({ lat: geolocation.lat, lng: geolocation.lng, radius_km: 10 });
//     }
//   }, [viewMode, geolocation, geoParams]);
//   const handleBoundsChange = useCallback((lat: number, lng: number, radius_km: number) => {
//     setGeoParams({ lat, lng, radius_km });
//   }, []);
// const totalCount = data?.count ?? 0;
// if (viewMode === 'map') {
//     return (
//       <div className="fixed inset-0 top-15 z-0">
//         {/* Map fills the entire viewport below the header */}
//          {/* <ServiceMapView
//     services={data?.results || []}
//     totalCount={totalCount}
//     center={geoParams ? { lat: geoParams.lat, lng: geoParams.lng } : null}
//     onBoundsChange={handleBoundsChange}
//     isLoading={isLoading}
//     permissionStatus={geolocation.permissionStatus}
//     onRequestLocation={() => {
//         geolocation.requestLocation();
//     }
//   }
//   /> */}
//   <ServiceMapView
//   services={data?.results || []}
//   totalCount={totalCount}
//   center={geoParams ? { lat: geoParams.lat, lng: geoParams.lng } : null}
//   userLocation={geolocation.lat && geolocation.lng ? { lat: geolocation.lat, lng: geolocation.lng } : null}
//   onBoundsChange={handleBoundsChange}
//   isLoading={isLoading}
//   permissionStatus={geolocation.permissionStatus}
//   onRequestLocation={geolocation.requestLocation}
// />
//         {/* Floating search bar, full width, sits above the map */}
//         <div className="absolute top-4 left-4 right-4 z-20">
//           <SearchBar
//             serviceName={serviceName}
//             onSearchChange={setServiceName}
//             onSearch={handleSearch}
//             onSortChange={setSortBy}
//             sortBy={sortBy}
//             viewMode={viewMode}
//             onViewModeChange={setViewMode}
//           />
//         </div>
//         {/* Floating filter panel, pinned to the very left edge */}
//         <div className="absolute top-30 left-4 z-20 w-72 max-h-[calc(100vh-6rem)] overflow-y-auto">
//           <ServiceFilter
//             categories={categories || []}
//             filters={filters}
//             onChange={handleFilterChange}
//             onReset={handleResetFilters}
//             mapview={true}
//           />
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className="max-w-7xl mx-auto px-4 md:px-8 mt-4 mb-6">
//       <div className="mb-6">
//         <SearchBar
//           serviceName={serviceName}
//           onSearchChange={setServiceName}
//           onSearch={handleSearch}
//           onSortChange={setSortBy}
//           sortBy={sortBy}
//           viewMode={viewMode}
//           onViewModeChange={setViewMode}
//         />
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         <div className="lg:col-span-1">
//           <div className="lg:sticky lg:top-24">
//             <ServiceFilter
//               categories={categories || []}
//               filters={filters}
//               onChange={handleFilterChange}
//               onReset={handleResetFilters}
//               mapview={false}
//             />
//           </div>
//         </div>
//         <div className="lg:col-span-3 space-y-4">
//           {isLoading && (
//             <div className="flex-grow flex items-center justify-center">
//               <p className="text-on-surface-variant">Loading services…</p>
//             </div>
//           )}
//           {isError && (
//             <div className="flex-grow flex items-center justify-center">
//               <p className="text-error">Error: {(error as any)?.message}</p>
//             </div>
//           )}
//           {!isLoading && !isError && (
//             <ServiceList
//               services={data?.results || []}
//               totalCount={totalCount}
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={setCurrentPage}
//               sortBy={sortBy}
//               onSortChange={(val) => {
//                 setSortBy(val);
//                 setCurrentPage(1);
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
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
import type { Filters, ServicesQueryParams } from '@/features/services/types';

import { SpinnerLoader } from '@/components/loaders/SpinnerLoader';

import { useGeolocation } from '@/hooks/useGeolocation';

const FALLBACK_CENTER = { lat: 27.7172, lng: 85.324 }; // Kathmandu — match ServiceMapView's fallback

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

  const handleSearch = () => setCurrentPage(1);
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };
  const handleResetFilters = () => {
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
  };

  // Stable reference — only changes when the actual coordinates change, not on every render.
  // This is what fixed the "map jumps back while panning" bug.
  const userLocation = useMemo(
    () =>
      geolocation.lat && geolocation.lng
        ? { lat: geolocation.lat, lng: geolocation.lng }
        : null,
    [geolocation.lat, geolocation.lng]
  );

  // 1. Seed a fallback center the instant map view opens, so an API call fires immediately
  //    regardless of whether/when geolocation ever resolves.
  useEffect(() => {
    if (viewMode === 'map' && !geoParams) {
      setGeoParams({
        lat: userLocation?.lat ?? FALLBACK_CENTER.lat,
        lng: userLocation?.lng ?? FALLBACK_CENTER.lng,
        radius_km: 10,
      });
    }
  }, [viewMode, geoParams, userLocation]);

  // 2. Once the real device location resolves, upgrade geoParams to it — but only once,
  //    so it doesn't override the user's own subsequent panning.
  useEffect(() => {
    if (viewMode === 'map' && userLocation && !hasAppliedRealLocation) {
      setGeoParams({
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius_km: 10,
      });
      setHasAppliedRealLocation(true);
    }
  }, [viewMode, userLocation, hasAppliedRealLocation]);

  // 3. Reset when leaving map view, so re-entering seeds fresh rather than reusing stale coords.
  useEffect(() => {
    if (viewMode !== 'map') {
      setGeoParams(null);
      setHasAppliedRealLocation(false);
    }
  }, [viewMode]);

  // 4. Ask for permission proactively when entering map view, if we haven't asked yet.
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
      <div className="fixed inset-0 top-[3.75rem] z-0">
        <ServiceMapView
          services={data?.results || []}
          totalCount={totalCount}
          center={geoParams ? { lat: geoParams.lat, lng: geoParams.lng } : null}
          userLocation={userLocation}
          onBoundsChange={handleBoundsChange}
          isLoading={isLoading}
          permissionStatus={geolocation.permissionStatus}
          onRequestLocation={geolocation.requestLocation}
        />

        <div className="absolute top-4 left-4 right-4 z-[1000]">
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

        <div className="absolute top-[7.5rem] left-4 z-[1000] w-72 max-h-[calc(100%-8rem)] overflow-y-auto">
          <ServiceFilter
            categories={categories || []}
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
              categories={categories || []}
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              mapview={false}
            />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {isLoading && (
            <div className="flex-grow flex items-center justify-center">
              <SpinnerLoader />
            </div>
          )}
          {isError && (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-error">Error: {(error as any)?.message}</p>
            </div>
          )}
          {!isLoading && !isError && (
            <ServiceList
              services={data?.results || []}
              totalCount={totalCount}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              sortBy={sortBy}
              onSortChange={(val) => {
                setSortBy(val);
                setCurrentPage(1);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
