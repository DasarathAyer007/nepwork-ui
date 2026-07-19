import type { KeyboardEvent, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import {
  Check,
  Loader2,
  Pencil,
  X,
} from 'lucide-react';

type EditableProfileSectionProps<T> = {
  id: string;
  title: string;
  subtitle?: string;

  editable: boolean;  

  value: T;

  activeId: string | null;

  onActivate: (id: string) => void;

  onDeactivate: () => void;

  onSave: (draft: T) => void | Promise<void>;

  renderDisplay: (value: T) => ReactNode;

  renderEditor: (props: {
    draft: T;
    setDraft: (draft: T) => void;
  }) => ReactNode;

  isSaving?: boolean;

  error?: string | null;

  allowEnterToSave?: boolean;

  isEqual?: (a: T, b: T) => boolean;
};

export default function EditableProfileSection<T>({
  id,
  title,
  subtitle,

  value,

  activeId,

  editable,

  onActivate,

  onDeactivate,

  onSave,

  renderDisplay,

  renderEditor,

  isSaving = false,

  error,

  allowEnterToSave = true,

  isEqual,
}: EditableProfileSectionProps<T>) {
  const [draft, setDraft] = useState(value);

const isEditing = editable && activeId === id;


  useEffect(() => {
    setDraft(value);
  }, [value]);

  const equal =
    isEqual ??
    ((a: T, b: T) =>
      JSON.stringify(a) === JSON.stringify(b));

  const isDirty = !equal(draft, value);

  // function startEdit() {
  //   setDraft(value);
  //   onActivate(id);
  // }

  function cancelEdit() {
    setDraft(value);
    onDeactivate();
  }

  function save() {
    if (!isDirty || isSaving) return;

    void onSave(draft);
  }

  function handleKeyDown(
    e: KeyboardEvent<HTMLDivElement>
  ) {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
      return;
    }

    if (
      e.key === 'Enter' &&
      allowEnterToSave &&
      !e.shiftKey
    ) {
      const target = e.target as HTMLElement;

      if (target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        save();
      }
    }
  }

  return (
    <section className="py-2.5">
      <div className="flex items-start justify-between">

        <div>

          <h3 className="text-lg font-semibold">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 text-sm text-on-surface-variant">
              {subtitle}
            </p>
          )}

        </div>

        {editable && !isEditing && (
            <button
                onClick={() => onActivate(id)}
                className="rounded-lg p-2 hover:bg-gray-100"
            >
                <Pencil size={16}/>
            </button>
        )}

      </div>

      <div
        className="mt-5"
        onKeyDown={
          isEditing
            ? handleKeyDown
            : undefined
        }>

        {isEditing ? (
          <>

            {renderEditor({
              draft,
              setDraft,
            })}

            {error && (
              <p className="mt-3 text-sm text-error">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={save}
                disabled={
                  !isDirty || isSaving
                }
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-50">

                {isSaving ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Check size={16} />
                )}

                Save

              </button>

              <button
                type="button"
                onClick={cancelEdit}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant px-5 py-2 text-sm hover:bg-surface-container">

                <X size={16} />

                Cancel

              </button>

            </div>

          </>
        ) : (
          renderDisplay(value)
        )}

      </div>

    </section>
  );
}