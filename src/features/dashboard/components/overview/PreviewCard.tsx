import type { ReactNode } from 'react';

import { Link } from 'react-router-dom';

type PreviewCardProps = {
  title: string;
  viewAllTo?: string;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
};

export default function PreviewCard({
  title,
  viewAllTo,
  isEmpty,
  emptyMessage,
  children,
}: PreviewCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-title-md font-bold text-on-surface">{title}</h2>
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="text-label-md font-semibold text-primary hover:underline">
            View All
          </Link>
        )}
      </div>

      {isEmpty ? (
        <p className="text-body-sm text-on-surface-variant py-4 text-center">
          {emptyMessage}
        </p>
      ) : (
        children
      )}
    </div>
  );
}
