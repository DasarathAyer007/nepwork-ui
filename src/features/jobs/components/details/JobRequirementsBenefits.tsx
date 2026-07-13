import { CheckCircle2, Gift } from 'lucide-react';

interface Props {
  requirements: Record<string, string>[];
  benefits: Record<string, string>[];
}

function DetailList({
  items,
  icon,
}: {
  items: Record<string, string>[];
  icon: typeof CheckCircle2 | typeof Gift;
}) {
  const Icon = icon;

  return (
    <ul className="space-y-3">
      {items.map((item, idx) => {
        const [key, value] = Object.entries(item)[0] ?? [];

        if (!key) return null;

        return (
          <li
            key={`${key}-${idx}`}
            className="flex items-start gap-3 text-body-md">
            <Icon size={18} className="text-primary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p
                className="font-medium text-on-surface"
                style={{ overflowWrap: 'anywhere' }}>
                {key}
              </p>
              <p
                className="text-on-surface-variant"
                style={{ overflowWrap: 'anywhere' }}>
                {value}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// Normalizes bad data (object instead of array) into the expected array shape,
// so the UI keeps working even if the upstream source is misbehaving.
function normalizeToArray(data: unknown): Record<string, string>[] {
  if (Array.isArray(data)) return data;

  if (data && typeof data === 'object') {
    console.warn(
      'Expected Record<string,string>[] but received a plain object. Fix the data source — normalizing for now.',
      data
    );
    return Object.entries(data as Record<string, string>).map(([k, v]) => ({
      [k]: v,
    }));
  }

  return [];
}

function JobRequirementsBenefits({ requirements, benefits }: Props) {
  const normalizedRequirements = normalizeToArray(requirements);
  const normalizedBenefits = normalizeToArray(benefits);

  const hasRequirements = normalizedRequirements.length > 0;
  const hasBenefits = normalizedBenefits.length > 0;

  if (!hasRequirements && !hasBenefits) return null;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {hasRequirements && (
          <div>
            <h3 className="text-headline-sm font-bold text-on-surface mb-3">
              Requirements
            </h3>
            <DetailList items={normalizedRequirements} icon={CheckCircle2} />
          </div>
        )}

        {hasBenefits && (
          <div>
            <h3 className="text-headline-sm font-bold text-on-surface mb-3">
              Benefits
            </h3>
            <DetailList items={normalizedBenefits} icon={Gift} />
          </div>
        )}
      </div>
    </div>
  );
}

export default JobRequirementsBenefits;
