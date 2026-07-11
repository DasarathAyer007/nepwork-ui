import { useState } from 'react';

import { useGetMyJobsQuery } from '@/features/jobs/jobApi';
import { useGetServiceRequestsQuery } from '@/features/services/serviceApi';
import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

import PreviewCard from './PreviewCard';

type Event = {
  key: string;
  label: string;
  detail: string;
  date: Date;
  to: string;
};

export default function UpcomingEventsCard() {
  const { data: jobsData } = useGetMyJobsQuery({
    page_size: 10,
    ordering: '-created_at',
  });
  const { data: receivedRequests } = useGetServiceRequestsQuery({
    scope: 'received',
    page_size: 10,
    ordering: '-created_at',
  });
  const { data: sentRequests } = useGetServiceRequestsQuery({
    scope: 'sent',
    page_size: 10,
    ordering: '-created_at',
  });

  const [now] = useState(() => Date.now());

  const jobEvents: Event[] = (jobsData?.results ?? [])
    .filter((job) => job.deadline && new Date(job.deadline).getTime() > now)
    .map((job) => ({
      key: `job-${job.id}`,
      label: 'Application deadline',
      detail: job.title,
      date: new Date(job.deadline as string),
      to: `/dashboard/jobs/${job.id}`,
    }));

  const requestEvents: Event[] = [
    ...(receivedRequests?.results ?? []),
    ...(sentRequests?.results ?? []),
  ]
    .filter(
      (req) =>
        (req.status === 'accepted' || req.status === 'in_progress') &&
        req.preferred_date &&
        new Date(req.preferred_date).getTime() > now
    )
    .map((req) => ({
      key: `request-${req.id}`,
      label: 'Scheduled service',
      detail: `${req.service.title}${req.preferred_time ? ` · ${req.preferred_time}` : ''}`,
      date: new Date(req.preferred_date as string),
      to: `/dashboard/requests-received/${req.id}`,
    }));

  const events = [...jobEvents, ...requestEvents]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  return (
    <PreviewCard
      title="Upcoming Events"
      isEmpty={events.length === 0}
      emptyMessage="No upcoming deadlines or scheduled services.">
      <ul className="divide-y divide-outline-variant/40">
        {events.map((event) => (
          <li key={event.key}>
            <Link to={event.to} className="flex items-start gap-3 py-2.5 group">
              <span className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Calendar size={15} />
              </span>
              <div className="min-w-0">
                <p className="text-body-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                  {event.label}
                </p>
                <p className="text-label-md text-on-surface-variant truncate">
                  {event.detail}
                </p>
                <p className="text-label-md text-on-surface-variant/70 flex items-center gap-1 mt-0.5">
                  <Clock size={11} />
                  {event.date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </PreviewCard>
  );
}
