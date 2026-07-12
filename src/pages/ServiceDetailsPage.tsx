import { Link, useParams } from 'react-router-dom';
import { useCallback } from 'react';

import ServiceDetails from '@/features/services/components/details/ServiceDetails';
import ServiceDetailsSkeleton from '@/features/services/components/details/ServiceDetailsSkeleton';

import {
  useGetServiceDetailQuery,
  useSaveServiceMutation,
  useUnsaveServiceMutation,
} from '@/features/services/serviceApi';

function NotFound() {
  return (
    <div className="bg-background min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center py-20">
        <h1 className="text-headline-lg font-bold text-on-surface">
          Service not found
        </h1>

        <p className="text-body-md text-on-surface-variant mt-2">
          The service you're looking for doesn't exist or has been removed.
        </p>

        <Link
          to="/services"
          className="mt-4 inline-block px-6 py-2 bg-primary text-on-primary rounded-lg"
        >
          Back to Services
        </Link>
      </div>
    </div>
  );
}

function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: service,
    isLoading,
    isError,
  } = useGetServiceDetailQuery(id ?? '', {
    skip: !id,
  });
  const [saveService] = useSaveServiceMutation();
  const [unsaveService] = useUnsaveServiceMutation();

  const handleSaveToggle = useCallback(async () => {
    if (!service) return;

    if (service.is_saved) {
      await unsaveService(service.id);
      return;
    }

    await saveService({ service_id: service.id });
  }, [saveService, service, unsaveService]);

  if (isLoading) return <ServiceDetailsSkeleton />;
  if (isError || !service) return <NotFound />;

  return (
    <div className="bg-background min-h-screen pt-20 pb-16">
      <ServiceDetails service={service} onSaveToggle={handleSaveToggle} />
    </div>
  );
}

export default ServiceDetailsPage;