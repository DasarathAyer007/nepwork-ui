import { useMemo, useState } from 'react';

import {
  useGetPopularSkillsQuery,
  useGetSkillsQuery,
} from '@/features/auth/api/authApi';
import type { Skill } from '@/types/skill.types';
import { Search, X } from 'lucide-react';

import { useDebounce } from '@/hooks/useDebounce';

interface SkillFilterInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  selectBy?: 'id' | 'name';
  placeholder?: string;
  skillType?: 'job' | 'service' | 'personal' | 'all';
}

export default function SkillFilterInput({
  value,
  onChange,
  selectBy = 'id',
  placeholder = 'Search skills…',
  skillType = 'all',
}: SkillFilterInputProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const trimmedQuery = debouncedQuery.trim();

  const { data: searchResults = [], isFetching: isSearching } =
    useGetSkillsQuery(
      { search: trimmedQuery },
      { skip: trimmedQuery.length === 0 }
    );

  const { data: popularSkills = [], isFetching: isLoadingPopular } =
    useGetPopularSkillsQuery({ limit: 12, type: skillType });

  const keyOf = (skill: Skill) => (selectBy === 'id' ? skill.id : skill.name);

  const suggestions = trimmedQuery ? searchResults : popularSkills;
  const isFetching = trimmedQuery ? isSearching : isLoadingPopular;
  const visibleSuggestions = useMemo(
    () => suggestions.filter((s) => !value.includes(keyOf(s))),
    [suggestions, value, selectBy]
  );

  const addSkill = (skill: Skill) => {
    const key = keyOf(skill);
    if (value.includes(key)) return;
    onChange([...value, key]);
    setQuery('');
  };

  const removeSkill = (key: string) => {
    onChange(value.filter((v) => v !== key));
  };

  const labelFor = (key: string) => {
    if (selectBy === 'name') return key;
    const match = [...searchResults, ...popularSkills].find(
      (s) => s.id === key
    );
    return match?.name ?? key;
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((key) => (
            <span
              key={key}
              className="bg-primary text-on-primary px-2.5 py-1 rounded-full text-body-sm font-medium flex items-center gap-1">
              {labelFor(key)}
              <button
                type="button"
                onClick={() => removeSkill(key)}
                aria-label={`Remove ${labelFor(key)}`}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="space-y-1">
        {!trimmedQuery && (
          <p className="text-body-sm text-on-surface-variant">Popular skills</p>
        )}
        <div className="flex flex-wrap gap-2">
          {isFetching && (
            <span className="text-body-sm text-on-surface-variant">
              Loading…
            </span>
          )}
          {!isFetching &&
            visibleSuggestions.slice(0, 12).map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => addSkill(skill)}
                className="bg-surface-container-high text-on-surface-variant text-body-sm px-3 py-1 rounded-full border border-outline-variant hover:bg-primary hover:text-on-primary transition">
                {skill.name}
              </button>
            ))}
          {!isFetching && trimmedQuery && visibleSuggestions.length === 0 && (
            <span className="text-body-sm text-on-surface-variant">
              No matching skills
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
