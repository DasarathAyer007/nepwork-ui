import { ArrowRight, Clock, MapPin } from 'lucide-react';

export interface Job {
  type: string;
  typeColor: string;
  salary: string;
  title: string;
  location: string;
  name: string;
  avatar: string;
  postedAt?: string;
  tags?: string[];
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="group flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant/50 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300  h-full">
      <div className="p-6 flex flex-col flex-1">
        {/* Top row */}
        <div className="flex justify-between items-start mb-4">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${job.typeColor}`}>
            {job.type}
          </span>
          <span className="text-primary font-bold text-base">{job.salary}</span>
        </div>

        {/* Title */}
        <h4 className="text-lg font-bold text-on-surface mb-1 group-hover:text-primary transition-colors duration-200 leading-snug">
          {job.title}
        </h4>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-on-surface-variant text-sm mt-1 mb-4">
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {job.location}
          </span>
          {job.postedAt && (
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {job.postedAt}
            </span>
          )}
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom */}
        <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4 mt-2">
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full object-cover ring-2 ring-outline-variant/40"
              src={job.avatar}
              alt={job.name}
            />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-on-surface">
                {job.name}
              </p>
              <p className="text-xs text-on-surface-variant">Employer</p>
            </div>
          </div>

          <button className="flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all duration-200">
            Apply <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
