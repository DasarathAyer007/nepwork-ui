import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type NotFoundProps = {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  fullScreen?: boolean;
  className?: string;
};

export default function NotFound({
  icon: Icon = AlertTriangle,
  title = 'Not found',
  message,
  actionLabel,
  actionTo,
  onAction,
  fullScreen = false,
  className = '',
}: NotFoundProps) {
  const content = (
    <div
      className={`flex flex-col items-center justify-center text-center py-24 px-4 ${className}`}>
      <div className="size-14 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
        <Icon size={26} />
      </div>
      <h1 className="text-headline-sm font-bold text-on-surface">{title}</h1>
      {message && (
        <p className="text-body-md text-on-surface-variant mt-2 ">
          {message}
        </p>
      )}
      {actionLabel &&
        (actionTo ? (
          <Link
            to={actionTo}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium shadow-sm hover:shadow-md hover:brightness-110 transition-all duration-200 active:scale-95">
            <ArrowLeft size={16} />
            {actionLabel}
          </Link>
        ) : onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium shadow-sm hover:shadow-md hover:brightness-110 transition-all duration-200 active:scale-95 cursor-pointer">
            <ArrowLeft size={16} />
            {actionLabel}
          </button>
        ) : null)}
    </div>
  );

  if (!fullScreen) return content;

  return <div className="bg-background min-h-screen">{content}</div>;
}
