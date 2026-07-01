import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  description?: string;
  badge?: string | number;
  to?: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
};

export function MenuItem({
  icon,
  label,
  description,
  badge,
  to,
  onClick,
  variant = 'default',
}: MenuItemProps) {
  const baseClass = `
    group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
    transition-all duration-150 cursor-pointer
    ${
      variant === 'danger'
        ? 'text-error hover:bg-error/10'
        : 'text-text hover:bg-muted/10'
    }
  `;

  const content = (
    <>
      <span
        className={`
        shrink-0 size-8 rounded-lg flex items-center justify-center
        transition-colors duration-150
        ${
          variant === 'danger'
            ? 'bg-error/10 text-error group-hover:bg-error/20'
            : 'bg-muted/10 text-muted group-hover:bg-primary/10 group-hover:text-primary'
        }
      `}>
        {icon}
      </span>

      <div className="flex-1 text-left min-w-0">
        <span className="block text-sm font-medium leading-tight">{label}</span>
        {description && (
          <span className="block text-xs text-muted leading-tight mt-0.5 truncate">
            {description}
          </span>
        )}
      </div>

      {badge !== undefined && (
        <span
          className={`
          shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded-full
          ${
            variant === 'danger'
              ? 'bg-error/15 text-error'
              : 'bg-primary/15 text-primary'
          }
        `}>
          {badge}
        </span>
      )}

      {!badge && variant !== 'danger' && (
        <ChevronRight
          size={14}
          className="shrink-0 text-muted/50 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClass}>
        {content}
      </Link>
    );
  }

  return (
    <button className={baseClass} onClick={onClick}>
      {content}
    </button>
  );
}
