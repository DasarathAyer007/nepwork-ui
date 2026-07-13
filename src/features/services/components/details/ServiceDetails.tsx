import MapComponent from '@/components/map/MapComponent';

import type { ServiceDetail } from '../../types';
import ServiceApplyCard from './ServiceApplyCard';
import ServiceDescription from './ServiceDescription';
import ServiceHeader from './ServiceHeader';
import ServiceProviderCard from './ServiceProviderCard';
import ServiceSkills from './ServiceSkills';

interface Props {
  service: ServiceDetail;
  onSaveToggle: () => void;
}

function ServiceDetails({ service, onSaveToggle }: Props) {
  const { location } = service;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <ServiceHeader service={service} onSaveToggle={onSaveToggle} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 space-y-6">
            <ServiceDescription service={service} />

            <ServiceSkills skills={service.skills} />
          </div>

          <ServiceProviderCard
            provider={service.user}
            thumbnail={service.thumbnail}
          />
        </div>

        <div className="space-y-6">
          <ServiceApplyCard service={service} />

          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
            <h3 className="text-headline-sm font-bold text-on-surface mb-4">
              Location
            </h3>

            {location?.point?.lat && location?.point?.lng ? (
              <MapComponent
                latitude={location.point.lat}
                longitude={location.point.lng}
                address={location.address}
                label={service.title}
                height={220}
                showExpandButton
              />
            ) : (
              <div className="h-55 flex items-center justify-center bg-surface-container rounded-lg">
                Location not available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetails;
