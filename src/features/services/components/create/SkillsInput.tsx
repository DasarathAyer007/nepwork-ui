import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useGetSkillsQuery } from "@/features/auth/api/authApi"; // adjust to your actual path
import type { Skill } from "../../types";

interface Props {
  value: string[];
  onChange: (skills: string[]) => void;
  error?: string;
}

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SkillsInput({ value, onChange, error }: Props) {
  const [inputOpen, setInputOpen] = useState(value.length === 0);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const { data: suggestions = [], isFetching } = useGetSkillsQuery(
    { search: debouncedQuery },
    { skip: debouncedQuery.trim().length === 0 },
  );

  const filteredSuggestions = suggestions.filter(
    (s: Skill) => !value.includes(s.name),
  );

  function addSkill(name: string) {
    const trimmed = name.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setQuery("");
  }

  function removeSkill(name: string) {
    onChange(value.filter((s) => s !== name));
  }

  return (
    <div className="space-y-xs">
      <label className="font-headline-sm text-headline-sm block text-on-surface">
        Skills
      </label>

      <div className="flex flex-wrap gap-2">
        {value.map((skill) => (
          <span
            key={skill}
            className="bg-primary text-on-primary px-3 py-1 rounded-full text-body-sm font-medium flex items-center gap-1"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              aria-label={`Remove ${skill}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <button
          type="button"
          onClick={() => setInputOpen((v) => !v)}
          className="border border-dashed border-outline text-primary text-body-sm px-3 py-1 rounded-full hover:bg-surface-container-high transition-colors flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add skill
        </button>
      </div>

      {error && <p className="text-body-sm text-error">{error}</p>}

      {inputOpen && (
        <div className="relative">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(query);
                }
              }}
              placeholder="Type a skill, e.g. Plumbing"
              className="flex-1 bg-surface-container border border-outline-variant rounded-lg px-md py-sm text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => addSkill(query)}
              className="bg-primary text-on-primary px-md py-sm rounded-lg text-body-sm hover:shadow transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {query && (
            <div className="mt-2 flex flex-wrap gap-2">
              {isFetching && (
                <span className="text-body-sm text-on-surface-variant">
                  Searching…
                </span>
              )}
              {!isFetching &&
                filteredSuggestions.slice(0, 10).map((rec: Skill) => (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => addSkill(rec.name)}
                    className="bg-surface-container-high text-on-surface-variant text-body-sm px-3 py-1 rounded-full border border-outline-variant hover:bg-primary-container hover:text-on-primary-container transition"
                  >
                    {rec.name}
                  </button>
                ))}
              {!isFetching && query.trim() && filteredSuggestions.length === 0 && (
                <span className="text-body-sm text-on-surface-variant">
                  No match — press Enter to add "{query.trim()}" as a new skill
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}