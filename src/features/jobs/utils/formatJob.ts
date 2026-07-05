export function formatSalaryRange(min: string, max: string, currency: string) {
  const minNum = Number(min);
  const maxNum = Number(max);
  const fmt = (n: number) =>
    Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—';
  return `${currency} ${fmt(minNum)} - ${fmt(maxNum)}`;
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// "part-time" / "onsite" / "senior" -> "Part Time" / "Onsite" / "Senior"
export function titleCase(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function employerDisplayName(job: {
  employer: { full_name?: string; username: string };
}) {
  return job.employer.full_name ?? job.employer.username;
}

export function employerLogo(job: {
  employer: { logo?: string | null; profile_picture?: string | null };
  thumbnail: string | null;
}) {
  return job.employer.logo ?? job.employer.profile_picture ?? job.thumbnail;
}