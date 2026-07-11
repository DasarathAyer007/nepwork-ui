import { useCallback, useEffect, useMemo, useState } from 'react';

import JobList from '@/features/jobs/components/JobList';
import type {
  JobCategory,
  JobFilters as JobFiltersType,
  JobResult,
} from '@/features/jobs/jobTypes';

import { SpinnerLoader } from '@/components/loaders/SpinnerLoader';

import { useGeolocation } from '@/hooks/useGeolocation';

import JobFilters from '../features/jobs/components/JobFilters';
import JobMapView from '../features/jobs/components/JobMapView';
import JobSearchBar from '../features/jobs/components/JobSearchBar';
import {
  useGetJobCategoryQuery,
  useGetJobsListQuery,
} from '../features/jobs/jobApi';
import getApiErrorMessage from '../utils/getApiErrorMessage';

const FALLBACK_CENTER = { lat: 27.7172, lng: 85.324 }; // Kathmandu — match JobMapView's fallback

const EMPTY_JOBS: JobResult[] = [];
const EMPTY_CATEGORIES: JobCategory[] = [];

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');

  const [geoParams, setGeoParams] = useState<{
    lat: number;
    lng: number;
    radius_km: number;
  } | null>(null);
  const [hasAppliedRealLocation, setHasAppliedRealLocation] = useState(false);
  const geolocation = useGeolocation();

  const [filters, setFilters] = useState<JobFiltersType>({
    category: '',
    jobType: '',
    workMode: '',
    experienceLevel: '',
    experienceYears: null,
    skills: [],
    salaryMin: '',
    salaryMax: '',
    currency: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    hasLocation: null,
    deadlineBefore: '',
    deadlineAfter: '',
  });

  const [sortBy, setSortBy] = useState('-created_at');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: categories } = useGetJobCategoryQuery(null);

  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {
      page: currentPage,
      page_size: viewMode === 'map' ? 200 : 20, // map isn't paginated visually — fetch everything in the radius
      ordering: sortBy,
    };

    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (filters.category) params.category = filters.category;
    if (filters.jobType) params.job_type = filters.jobType;
    if (filters.workMode) params.work_mode = filters.workMode;
    if (filters.experienceLevel)
      params.experience_level = filters.experienceLevel;
    if (filters.experienceYears !== null && filters.experienceYears > 0) {
      params.experience_years = filters.experienceYears;
    }
    if (filters.skills.length > 0) params.skills = filters.skills;
    if (filters.salaryMin) params.salary_min = filters.salaryMin;
    if (filters.salaryMax) params.salary_max = filters.salaryMax;
    if (filters.currency) params.currency = filters.currency;
    if (filters.city) params.city = filters.city;
    if (filters.state) params.state = filters.state;
    if (filters.country) params.country = filters.country;
    if (filters.postalCode) params.postal_code = filters.postalCode;
    if (filters.hasLocation !== null) params.has_location = filters.hasLocation;
    if (filters.deadlineBefore) params.deadline_before = filters.deadlineBefore;
    if (filters.deadlineAfter) params.deadline_after = filters.deadlineAfter;

    if (viewMode === 'map' && geoParams) {
      params.lat = geoParams.lat;
      params.lng = geoParams.lng;
      params.radius_km = geoParams.radius_km;
    }

    return params;
  }, [currentPage, sortBy, searchTerm, filters, viewMode, geoParams]);

  const { data, isLoading, isError, error } = useGetJobsListQuery(queryParams);
  const totalPages = data?.total_pages ?? 1;
  const totalCount = data?.count ?? 0;

  const handleSearch = useCallback(() => setCurrentPage(1), []);

  const handleFilterChange = useCallback((newFilters: JobFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      category: '',
      jobType: '',
      workMode: '',
      experienceLevel: '',
      experienceYears: null,
      skills: [],
      salaryMin: '',
      salaryMax: '',
      currency: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      hasLocation: null,
      deadlineBefore: '',
      deadlineAfter: '',
    });
    setSearchTerm('');
    setSortBy('-created_at');
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const userLocation = useMemo(
    () =>
      geolocation.lat && geolocation.lng
        ? { lat: geolocation.lat, lng: geolocation.lng }
        : null,
    [geolocation.lat, geolocation.lng]
  );

  // Reset/seed geo params whenever we switch modes.
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

  // Once real geolocation resolves after entering map mode, snap to it.
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
        <JobMapView
          jobs={data?.results ?? EMPTY_JOBS}
          totalCount={totalCount}
          center={geoParams ? { lat: geoParams.lat, lng: geoParams.lng } : null}
          userLocation={userLocation}
          onBoundsChange={handleBoundsChange}
          isLoading={isLoading}
          permissionStatus={geolocation.permissionStatus}
          onRequestLocation={geolocation.requestLocation}
          geoLoading={geolocation.loading}
          geoError={geolocation.error}
        />

        <div className="absolute top-4 left-4 right-4 z-999">
          <JobSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        <div className="absolute top-30 left-4 z-999 w-72 max-h-[calc(100%-8rem)] overflow-y-auto">
          <JobFilters
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
    <div className="bg-background min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-4">
        <div className="mb-6">
          <JobSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <JobFilters
                categories={categories ?? EMPTY_CATEGORIES}
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
                mapview={false}
              />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {/* {!isLoading && !isError && (
              <div className="text-body-md text-on-surface-variant">
                Showing {data?.results?.length || 0} of {totalCount} jobs
              </div>
            )} */}

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <SpinnerLoader />
              </div>
            )}

            {isError && (
              <div className="flex items-center justify-center py-12">
                <p className="text-error">
                  {getApiErrorMessage({
                    error,
                    fallbackMessage: 'An error occurred while fetching jobs.',
                  })}
                </p>
              </div>
            )}

            <JobList
              jobs={data?.results ?? EMPTY_JOBS}
              totalCount={totalCount}
              currentPage={currentPage}
              totalPages={totalPages}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
