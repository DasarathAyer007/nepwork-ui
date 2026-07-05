import CategoryIcon from '@/components/CategoryIcon';

import { useGetJobCategoryQuery } from '../../jobApi';
import type { JobCategory } from '../../jobTypes';

interface Props {
  value: string;
  onChange: (categoryId: string) => void;
  error?: string;
}

export default function JobCategorySelector({ value, onChange, error }: Props) {
  const { data: categories, isLoading, isError } = useGetJobCategoryQuery(null);

  return (
    <div className="space-y-xs">
      <label className="font-headline-sm text-headline-sm block text-on-surface">
        Category
      </label>

      {isLoading && (
        <div className="flex gap-sm overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 rounded-full bg-surface-container-high animate-pulse shrink-0"
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-body-sm text-error">
          Couldn't load categories. Try refreshing the page.
        </p>
      )}

      {categories && (
        <div className="flex gap-sm overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
          {categories?.map((cat: JobCategory) => {
            const selected = value === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChange(String(cat.id))}
                title={cat.description}
                className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-full border text-body-md whitespace-nowrap transition-all ${
                  selected
                    ? 'border-primary bg-primary text-on-primary shadow-sm'
                    : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary/50 hover:bg-surface-container'
                }`}>
                <CategoryIcon
                  iconname={cat.icon}
                  size={16}
                  color="currentColor"
                />
                {cat.name}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="text-body-sm text-error">{error}</p>}
    </div>
  );
}
