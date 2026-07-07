interface StepIndicatorProps {
  step: number;
  totalSteps: number;
  label: string;
}

export default function StepIndicator({
  step,
  totalSteps,
  label,
}: StepIndicatorProps) {
  const completedSteps = Math.max(0, step - 1);
  const percent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="mb-xl">
      <div className="flex justify-between items-end mb-xs">
        <div>
          <span className="text-label-md text-primary uppercase font-bold tracking-wider">
            Step {step} of {totalSteps}
          </span>
          <h1 className="text-headline-lg font-bold text-text mt-1">
            {label}
          </h1>
        </div>
        <span className="text-body-sm text-muted mb-1 font-medium">
          {percent}% Complete
        </span>
      </div>
      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
