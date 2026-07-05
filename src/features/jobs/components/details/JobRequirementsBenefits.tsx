import { CheckCircle2, Gift } from 'lucide-react';

interface Props {
  requirements: Record<string, string>;
  benefits: Record<string, string>;
}

function JobRequirementsBenefits({ requirements, benefits }: Props) {
  const requirementEntries = Object.entries(requirements ?? {});
  const benefitEntries = Object.entries(benefits ?? {});

  if (!requirementEntries.length && !benefitEntries.length) return null;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {requirementEntries.length > 0 && (
          <div>
            <h3 className="text-headline-sm font-bold text-on-surface mb-3">Requirements</h3>
            <ul className="space-y-2">
              {requirementEntries.map(([key, value]) => (
                <li key={key} className="flex items-start gap-2 text-body-md text-on-surface-variant">
                  <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                  {value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {benefitEntries.length > 0 && (
          <div>
            <h3 className="text-headline-sm font-bold text-on-surface mb-3">Benefits</h3>
            <ul className="space-y-2">
              {benefitEntries.map(([key, value]) => (
                <li key={key} className="flex items-start gap-2 text-body-md text-on-surface-variant">
                  <Gift size={18} className="text-primary shrink-0 mt-0.5" />
                  {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobRequirementsBenefits;