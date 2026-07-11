import { Briefcase, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const QUICK_ACTIONS = [
  { label: 'Post a Job', to: '/create/job', icon: Plus, primary: true },
  {
    label: 'Create a Service',
    to: '/create/service',
    icon: Plus,
    primary: true,
  },
  { label: 'Browse Jobs', to: '/jobs', icon: Briefcase, primary: false },
  { label: 'Browse Services', to: '/services', icon: Search, primary: false },
];

export default function WelcomeHeader({ name }: { name: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-headline-md font-bold text-on-surface">
          {getGreeting()}, {name}
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Here's what's happening across your jobs and services today.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map(({ label, to, icon: Icon, primary }) => (
          <Link
            key={label}
            to={to}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              primary
                ? 'bg-primary text-on-primary hover:brightness-110 shadow-sm'
                : 'border border-outline-variant text-on-surface hover:bg-surface-container'
            }`}>
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
