import type { KeyboardEvent, ReactNode } from 'react';
import { useState } from 'react';

import { Check, Loader2, Pencil, X } from 'lucide-react';

import { Label } from '@/components/ui/forms/Label';

type EditableSectionProps<T> = {
  id: string;
  label: string;
  description?: string;
  activeId: string | null;
  onActivate: (id: string) => void;
  onDeactivate: () => void;
  value: T;
  isSaving: boolean;
  error?: string | null;
  onSave: (draft: T) => void | Promise<void>;
  renderDisplay: (value: T) => ReactNode;
  renderEditor: (props: {
    draft: T;
    setDraft: (draft: T) => void;
  }) => ReactNode;
  isEqual?: (a: T, b: T) => boolean;
  /** Set false for multi-line editors (e.g. textareas) where Enter should insert a newline. */
  allowEnterToSave?: boolean;
};

export default function EditableSection<T>({
  id,
  label,
  description,
  activeId,
  onActivate,
  onDeactivate,
  value,
  isSaving,
  error,
  onSave,
  renderDisplay,
  renderEditor,
  isEqual,
  allowEnterToSave = true,
}: EditableSectionProps<T>) {
  const [draft, setDraft] = useState<T>(value);
  const isEditing = activeId === id;

  const equalFn =
    isEqual ?? ((a: T, b: T) => JSON.stringify(a) === JSON.stringify(b));
  const isDirty = !equalFn(draft, value);

  const startEdit = () => {
    setDraft(value);
    onActivate(id);
  };

  const cancelEdit = () => {
    setDraft(value);
    onDeactivate();
  };

  const handleSave = () => {
    if (!isDirty || isSaving) return;
    void onSave(draft);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
      return;
    }
    if (e.key === 'Enter' && allowEnterToSave && !e.shiftKey) {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleSave();
      }
    }
  };

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-label-md font-semibold uppercase tracking-wide text-on-surface-variant">
            <Label> {label}</Label>
          </h4>
          {description && !isEditing && (
            <p className="text-xs text-on-surface-variant/70 mt-0.5">
              {description}
            </p>
          )}
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={startEdit}
            aria-label={`Edit ${label}`}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors shrink-0 cursor-pointer">
            <Pencil size={15} />
          </button>
        )}
      </div>

      <div className="mt-2" onKeyDown={isEditing ? handleKeyDown : undefined}>
        {isEditing ? (
          <div className="space-y-3">
            {renderEditor({ draft, setDraft })}

            {error && <p className="text-xs text-error font-medium">{error}</p>}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all cursor-pointer">
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                Save
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant text-sm font-medium hover:bg-surface-container transition-all disabled:opacity-50 cursor-pointer">
                <X size={14} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          renderDisplay(value)
        )}
      </div>
    </div>
  );
}
