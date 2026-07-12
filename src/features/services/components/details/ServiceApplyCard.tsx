import { Link } from 'react-router-dom';
import type { ServiceDetail } from '../../types';

interface Props {
  service: ServiceDetail;
}

function ServiceApplyCard({ service }: Props) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
      <h3 className="text-headline-sm font-bold text-on-surface mb-6">
        Service Details
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-label-md text-on-surface-variant">
            Price
          </p>

          <p className="font-bold text-primary text-title-lg">
            {service.currency} {service.price}
            {service.price_type === 'hourly' && '/hr'}
          </p>
        </div>

        <div>
          <p className="text-label-md text-on-surface-variant">
            Availability
          </p>

          <p className="text-on-surface">
            {service.availability_status}
          </p>
        </div>

        <Link
          to={`/services/${service.id}/apply`}
          className="w-full inline-flex justify-center px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:brightness-110"
        >
          Request Service
        </Link>
      </div>
    </div>
  );
}

export default ServiceApplyCard;