import type { UserDetails } from '@/types/user.types';
import { BadgeCheck, Building, MapPin, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type IntroHeaderProps = {
  profileDetails: UserDetails;
};

function IntroHeader({ profileDetails }: IntroHeaderProps) {
  const isOrg = profileDetails.account_type === 'organization';
  const navigate = useNavigate();

  const handleMessageClick = () => {
    const params = new URLSearchParams({
      userId: String(profileDetails.id),
      username: profileDetails.username,
      profile_picture: profileDetails.profile_picture || '',
      fullName: profileDetails.full_name,
    });
    navigate(`/messages?${params.toString()}`);
  };

  return (
    <header className="relative mb-xl bg-surface-container-lowest rounded-md overflow-hidden shadow-sm border border-outline-variant">
      {/* Cover photo */}
      <div className="h-64 md:h-80 w-full relative bg-surface-container-high">
        {profileDetails.cover_photo && (
          <img
            className="w-full h-full object-cover"
            src={profileDetails.cover_photo}
            alt="Cover photo"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
      </div>

      {/* Profile info row */}
      <div className="px-lg pb-lg flex flex-col md:flex-row items-end gap-md relative z-10">
        {/* Avatar — pulled upward with negative margin */}
        <div className="relative -mt-16">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl border-4 border-surface-container-lowest bg-surface-container-high overflow-hidden shadow-md flex items-center justify-center">
            {profileDetails.profile_picture ? (
              <img
                src={profileDetails.profile_picture}
                alt={`${profileDetails.full_name}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserRound size={48} className="text-on-surface-variant" />
            )}
          </div>
          {/* Verified badge */}
          <div className="absolute bottom-2 right-2 bg-secondary text-on-secondary p-1 rounded-full border-2 border-surface-container-lowest flex items-center justify-center">
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              <BadgeCheck />
            </span>
          </div>
        </div>

        {/* Name / username / location */}
        <div className="flex-1 pb-2">
          <div className="flex items-center gap-xs flex-wrap">
            <h1 className="text-headline-lg font-headline-lg text-on-surface">
              {profileDetails.full_name}
            </h1>
            {/* Account type badge */}
            <span className="text-primary font-label-md text-label-md px-2 py-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-1">
              {isOrg ? <Building size={16} /> : <UserRound size={16} />}
              <span className="text-xs">
                {isOrg ? 'Organization' : 'Individual'}
              </span>
            </span>
          </div>

          <p className="text-body-lg font-body-lg text-on-surface-variant mt-0.5">
            @{profileDetails.username}
          </p>

          <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-label-sm text-label-sm">
            <MapPin size={14} className="shrink-0" />
            <span>Nepal, Dhangadhi</span>
          </div>
        </div>

        <div className="flex gap-sm mb-2 w-full md:w-auto">
          <button
            onClick={handleMessageClick}
            className="flex-1 md:flex-none px-xl py-xs border border-primary text-primary rounded-xl font-label-md text-label-md hover:bg-primary/10 transition-colors">
            Message
          </button>
        </div>
      </div>
    </header>
  );
}

export default IntroHeader;
