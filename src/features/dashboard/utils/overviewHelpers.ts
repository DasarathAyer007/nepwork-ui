import type { UserDetails } from '@/types/user.types';

export function formatRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 60) return 'just now';

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? '' : 's'} ago`;

  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;

  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;

  return new Date(dateString).toLocaleDateString();
}

/** Rough heuristic since the backend has no stored completeness percentage. */
export function computeProfileCompleteness(profile: UserDetails): number {
  const common: unknown[] = [
    profile.profile_picture,
    profile.bio,
    profile.phone_number,
    profile.cover_photo,
    Object.keys(profile.social_links ?? {}).length > 0 ? true : null,
    profile.is_onboarded ? true : null,
  ];

  const specific: unknown[] =
    profile.account_type === 'personal'
      ? [profile.skills?.length > 0 ? true : null, profile.date_of_birth]
      : [
          profile.organization_name,
          profile.logo,
          profile.industry,
          profile.address,
        ];

  const checklist = [...common, ...specific];
  const filled = checklist.filter(Boolean).length;
  return Math.round((filled / checklist.length) * 100);
}

/** Skill overlap between the user's own profile skills and a listing's required skills. */
export function computeSkillMatch(
  profileSkills: string[],
  requiredSkills: string[]
): { matched: number; total: number } | null {
  if (!requiredSkills.length) return null;
  const normalizedProfile = new Set(profileSkills.map((s) => s.toLowerCase()));
  const matched = requiredSkills.filter((s) =>
    normalizedProfile.has(s.toLowerCase())
  ).length;
  return { matched, total: requiredSkills.length };
}

/** Buckets items into the last `days` calendar days (oldest first) by `created_at`. */
export function bucketByDay(
  items: { created_at: string }[],
  days = 7
): { label: string; count: number }[] {
  const buckets: { label: string; date: string; count: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    buckets.push({
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      date: date.toDateString(),
      count: 0,
    });
  }

  for (const item of items) {
    const itemDate = new Date(item.created_at).toDateString();
    const bucket = buckets.find((b) => b.date === itemDate);
    if (bucket) bucket.count += 1;
  }

  return buckets.map(({ label, count }) => ({ label, count }));
}
