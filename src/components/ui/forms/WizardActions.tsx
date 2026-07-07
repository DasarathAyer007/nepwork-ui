import type { LucideIcon } from 'lucide-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardActionsProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  submitLoadingLabel?: string;
  submitIcon?: LucideIcon;
}

export function WizardActions({
  step,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Submit',
  submitLoadingLabel = 'Submitting…',
  submitIcon: SubmitIcon = ArrowRight,
}: WizardActionsProps) {
  const isLastStep = step >= totalSteps;

  return (
    <div className="mt-8 flex justify-between items-center gap-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-6 shadow-sm">
      <button
        type="button"
        onClick={onBack}
        disabled={step === 1}
        className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-all flex items-center gap-2 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer">
        <ArrowLeft size={16} />
        Back
      </button>

      {!isLastStep ? (
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold text-sm shadow-sm hover:shadow-md hover:brightness-110 transition-all flex items-center gap-2 active:scale-[0.98] cursor-pointer">
          Next Step
          <ArrowRight size={16} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold text-sm shadow-sm hover:shadow-md hover:brightness-110 transition-all flex items-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer">
          {isSubmitting ? submitLoadingLabel : submitLabel}
          <SubmitIcon size={16} />
        </button>
      )}
    </div>
  );
}
