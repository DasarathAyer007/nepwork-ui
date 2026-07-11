import { useGetCategoryQuery } from '@/features/services/serviceApi';

import CategoryIcon from '@/components/CategoryIcon';
import { Label } from '@/components/ui/forms';

import type { Category } from '../../types';

interface Props {
  value: string;
  onChange: (categoryId: string) => void;
  error?: string;
}

export default function CategorySelector({ value, onChange, error }: Props) {
  const { data: categories, isLoading, isError } = useGetCategoryQuery(null);

  return (
    <div className="space-y-2">
      {isLoading && (
        <div className="flex flex-wrap gap-2 max-h-[172px] overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 rounded-full bg-surface-container-high animate-pulse shrink-0"
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-xs text-error font-medium">
          Couldn't load categories. Try refreshing the page.
        </p>
      )}

      {categories && (
        <div className="flex flex-wrap content-start gap-2 max-h-[172px] overflow-y-auto overscroll-contain -mx-1 px-1 pr-2 scrollbar-thin">
          {categories?.map((cat: Category) => {
            const selected = String(value) === String(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChange(String(cat.id))}
                title={cat.description}
                className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all cursor-pointer ${
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

      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
