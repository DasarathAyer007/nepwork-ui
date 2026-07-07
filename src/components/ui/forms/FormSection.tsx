import type { ReactNode } from 'react';
import clsx from 'clsx';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section className={clsx("bg-surface-container-lowest border border-outline-variant rounded-lg p-5 md:p-6 shadow-sm space-y-5", className)}>
      <div className="border-b border-outline-variant/20 pb-4">
        <h3 className="text-base font-bold text-on-surface">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}
