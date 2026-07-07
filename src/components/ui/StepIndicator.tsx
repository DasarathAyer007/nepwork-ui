import { Check } from 'lucide-react';

interface StepIndicatorProps {
  step: number;
  totalSteps: number;
  label: string;
  stepLabels?: string[];
}

export default function StepIndicator({
  step,
  totalSteps,
  label,
  stepLabels = [],
}: StepIndicatorProps) {
  const percent = totalSteps > 1 ? Math.round(((step - 1) / (totalSteps - 1)) * 100) : 0;
  const barPercent = Math.round(((step - 1) / totalSteps) * 100);

  const leftPercent = 100 / (totalSteps * 2);
  const activeWidthPercent = (percent / 100) * (100 - (100 / totalSteps));

  return (
    <div className="mb-xl space-y-6">
      {/* Horizontal Steps Stepper */}
      {stepLabels.length > 0 && (
        <div className="relative hidden md:flex items-center justify-between w-full mb-8">
          {/* Connector Line Background */}
          <div
            className="absolute top-[20px] h-0.5 bg-surface-container-highest -translate-y-1/2 z-0"
            style={{
              left: `${leftPercent}%`,
              right: `${leftPercent}%`,
            }}
          />
          {/* Active Connector Line */}
          <div
            className="absolute top-[20px] h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-out"
            style={{
              left: `${leftPercent}%`,
              width: `${activeWidthPercent}%`,
            }}
          />

          {stepLabels.map((lbl, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < step;
            const isActive = stepNum === step;

            return (
              <div key={idx} className="relative z-10 flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2 ${
                    isCompleted
                      ? 'bg-primary border-primary text-on-primary'
                      : isActive
                        ? 'bg-surface-container-lowest border-primary text-primary shadow-md'
                        : 'bg-surface-container border-outline-variant text-muted'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
                </div>
                <span
                  className={`mt-2 text-xs font-semibold text-center max-w-[120px] transition-colors duration-300 ${
                    isActive ? 'text-primary' : isCompleted ? 'text-on-surface font-medium' : 'text-muted'
                  }`}
                >
                  {lbl}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile-friendly Progress header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-5 md:p-6 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            Step {step} of {totalSteps}
          </span>
          <h1 className="text-2xl font-bold text-on-surface mt-3">
            {label}
          </h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-semibold text-primary">{barPercent}% Complete</span>
          {/* Progress bar for mobile / general */}
          <div className="w-32 bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${barPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
