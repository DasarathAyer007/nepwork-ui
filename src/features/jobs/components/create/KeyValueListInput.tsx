import { useState } from 'react';

import { Plus, Trash2 } from 'lucide-react';

export interface KeyValueEntry {
  key: string;
  value: string;
}

interface Props {
  label: string;
  helperText?: string;
  value: KeyValueEntry[];
  onChange: (entries: KeyValueEntry[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  error?: string;
}

export default function KeyValueListInput({
  label,
  helperText,
  value,
  onChange,
  keyPlaceholder = 'e.g., Experience',
  valuePlaceholder = 'e.g., 3+ years in React',
  error,
}: Props) {
  const [draftKey, setDraftKey] = useState('');
  const [draftValue, setDraftValue] = useState('');

  function addEntry() {
    if (!draftKey.trim() || !draftValue.trim()) return;
    onChange([...value, { key: draftKey.trim(), value: draftValue.trim() }]);
    setDraftKey('');
    setDraftValue('');
  }

  function removeEntry(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-xs">
      <label className="font-headline-sm text-headline-sm block text-on-surface">
        {label}
      </label>
      {helperText && (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {helperText}
        </p>
      )}

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((entry, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm">
              <span className="font-medium text-body-sm text-on-surface shrink-0 min-w-30">
                {entry.key}
              </span>
              <span className="text-body-sm text-on-surface-variant flex-1 truncate">
                {entry.value}
              </span>
              <button
                type="button"
                onClick={() => removeEntry(i)}
                aria-label={`Remove ${entry.key}`}
                className="p-1 rounded-md hover:bg-surface-container-high transition-colors shrink-0">
                <Trash2 size={14} className="text-on-surface-variant" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={draftKey}
          onChange={(e) => setDraftKey(e.target.value)}
          placeholder={keyPlaceholder}
          className="sm:w-40 px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
        />
        <input
          value={draftValue}
          onChange={(e) => setDraftValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addEntry();
            }
          }}
          placeholder={valuePlaceholder}
          className="flex-1 px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
        />
        <button
          type="button"
          onClick={addEntry}
          className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md flex items-center justify-center gap-1 hover:shadow transition">
          <Plus size={16} />
          Add
        </button>
      </div>

      {error && <p className="text-body-sm text-error">{error}</p>}
    </div>
  );
}
