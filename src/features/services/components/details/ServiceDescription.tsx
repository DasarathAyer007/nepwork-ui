import type { ServiceDetail } from '../../types';

interface Props {
  service: ServiceDetail;
}

function ServiceDescription({ service }: Props) {
  return (
    <section>
      <h2 className="text-headline-sm font-bold text-on-surface mb-4">
        Description
      </h2>

      <p className="text-body-md text-on-surface-variant whitespace-pre-wrap leading-7">
        {service.description}
      </p>
    </section>
  );
}

export default ServiceDescription;
