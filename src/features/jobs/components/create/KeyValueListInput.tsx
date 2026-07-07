import { useState } from 'react';

import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/forms';

export interface KeyValueEntry {
  key: string;
  value: string;
}

interface Props {
  value: KeyValueEntry[];
  onChange: (entries: KeyValueEntry[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  error?: string;
}

export default function KeyValueListInput({
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
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((entry, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-surface-container-low/50 border border-outline-variant/30 rounded-lg px-4 py-2.5 hover:bg-surface-container-low transition-colors shadow-sm group">
              <span className="font-semibold text-xs text-on-surface shrink-0 min-w-[120px] max-w-[200px] truncate">
                {entry.key}
              </span>
              <span className="text-sm text-on-surface-variant flex-1 truncate">
                {entry.value}
              </span>
              <button
                type="button"
                onClick={() => removeEntry(i)}
                aria-label={`Remove ${entry.key}`}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error transition-all shrink-0 cursor-pointer">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
        <Input
          value={draftKey}
          onChange={(e) => setDraftKey(e.target.value)}
          placeholder={keyPlaceholder}
          className="sm:col-span-3"
        />
        <Input
          value={draftValue}
          onChange={(e) => setDraftValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addEntry();
            }
          }}
          placeholder={valuePlaceholder}
          className="sm:col-span-7"
        />
        <button
          type="button"
          onClick={addEntry}
          className="sm:col-span-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary font-semibold text-sm flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer">
          <Plus size={16} />
          Add
        </button>
      </div>

      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
