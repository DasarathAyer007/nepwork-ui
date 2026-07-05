interface Props {
  step: number;
  totalSteps: number;
  label: string;
}

export default function ServiceStepIndicator({
  step,
  totalSteps,
  label,
}: Props) {
  const completedSteps = Math.max(0, step - 1);
  const percent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="mb-xl">
      <div className="flex justify-between items-end mb-xs">
        <div>
          <span className="font-label-lg text-label-lg text-primary uppercase font-bold">
            Step {step} of {totalSteps}
          </span>
          <h1 className=" font-headline-lg text-headline-lg text-on-background mt-1">
            {label}
          </h1>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant mb-1">
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
