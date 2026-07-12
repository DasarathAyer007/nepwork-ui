import { BookmarkCheck, BookmarkPlus, MapPin, Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';

import CategoryIcon from '@/components/CategoryIcon';

import type { Category, ServiceResult } from '../types';

interface ServiceCardProps {
  data: ServiceResult;
  onSaveToggle: (data: ServiceResult) => void;
  maxSkillsShown?: number;
}

const buildLocation = (loc: ServiceResult['location']) => {
  if (!loc) return 'Remote';
  return (
    [loc.address, loc.city, loc.state, loc.country]
      .filter(Boolean)
      .join(', ') || 'Remote'
  );
};

const getCategoryIcon = (category: Category | null) => {
  if (!category) return null;

  return <CategoryIcon iconname={category.icon} />;
};

export default function ServiceCard({
  data,
  onSaveToggle,
  maxSkillsShown = 3,
}: ServiceCardProps) {
  const priceAmount = data?.price ? parseFloat(data.price) : 0;
  const locationText = buildLocation(data?.location);

  const visibleSkills = data.skills.slice(0, maxSkillsShown);
  const extraSkillsCount = data.skills.length - visibleSkills.length;

  return (
    <div className="group relative flex gap-3 p-3 bg-surface-container-lowest border border-outline-variant rounded-lg hover:shadow-md hover:border-primary/30 transition-all duration-200">
      {/* Thumbnail */}
      <Link
        to={`/services/${data.id}`}
        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden shrink-0 bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20">
        {data.thumbnail ? (
          <img
            src={data.thumbnail}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-2xl">image</span>
          </div>
        )}
        <span
          className={`absolute bottom-1 left-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium leading-none ${
            data.is_currently_available
              ? 'bg-green-500/90 text-white'
              : 'bg-surface-container-lowest/90 text-on-surface-variant'
          }`}>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              data.is_currently_available ? 'bg-white' : 'bg-outline'
            }`}
          />
          {data.is_currently_available ? 'Available' : 'Unavailable'}
        </span>
      </Link>

      {/* Content */}
      <div className="grow min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          {data.category ? (
            <div className="flex items-center gap-1 min-w-0">
              <span className="material-symbols-outlined text-primary text-sm shrink-0">
                {getCategoryIcon(data.category)}
              </span>
              <span className="text-label-md font-bold text-primary uppercase tracking-wider truncate">
                {data.category.name}
              </span>
            </div>
          ) : (
            <span />
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              onSaveToggle(data);
            }}
            className={`shrink-0 inline-flex items-center justify-center rounded-full border p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              data.is_saved
                ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/15'
                : 'border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
            }`}
            aria-pressed={data.is_saved}
            aria-label={data.is_saved ? 'Remove from saved services' : 'Save service'}>
            {data.is_saved ? (
              <BookmarkCheck className="w-5 h-5 fill-current text-primary" />
            ) : (
              <BookmarkPlus className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-title-md font-bold text-on-surface leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          <Link
            to={`/services/${data.id}`}
            className="focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-sm">
            {data.title}
          </Link>
        </h3>

        {/* Meta row: user, location, rating */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-body-sm text-on-surface-variant">
          {data.user && (
            <div className="flex items-center gap-1 min-w-0">
              {data.user.profile_picture ? (
                <img
                  src={data.user.profile_picture}
                  alt={data.user.username}
                  className="w-4 h-4 rounded-full object-cover border border-outline-variant shrink-0"
                />
              ) : (
                <User className="w-3.5 h-3.5 text-outline shrink-0" />
              )}
              <span className="truncate">{data.user.username}</span>
            </div>
          )}

          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>

          {data.avg_rating > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
              <span className="font-bold text-on-surface">
                {data.avg_rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Skills */}
        {visibleSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {visibleSkills.map((skillName) => (
              <span
                key={skillName}
                className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full text-label-sm">
                {skillName}
              </span>
            ))}
            {extraSkillsCount > 0 && (
              <span className="text-label-sm text-outline px-1">
                +{extraSkillsCount} more
              </span>
            )}
          </div>
        )}

        {/* Bottom bar */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-1.5 border-t border-outline-variant/40">
          <span className="text-body-sm text-on-surface-variant">
            {data.total_applies} applies
          </span>

          <div className="flex items-baseline gap-1">
            <span className="text-label-sm text-outline">
              {data.price_type === 'hourly' ? 'From' : 'Fixed'}
            </span>
            <span className="text-title-md font-bold text-primary leading-none">
              {data.currency} {priceAmount}
            </span>
            {data.price_type === 'hourly' && (
              <span className="text-label-sm text-on-surface-variant">/hr</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
