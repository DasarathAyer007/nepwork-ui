import ServiceRequestForm from '@/features/services/components/ServiceRequestForm';
import { useGetServiceDetailQuery } from '@/features/services/serviceApi';
import { useParams } from 'react-router-dom';

function ServiceApplyPage() {
  const { id } = useParams();

  const {
    data: service,
    isLoading,
    isError,
  } = useGetServiceDetailQuery(id ?? '', {
    skip: !id,
  });

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  if (isError || !service) {
    return <div className="p-10">Service not found.</div>;
  }

  return <ServiceRequestForm service={service} />;
}

export default ServiceApplyPage;
