
import type { UserDetails } from '@/types/user.types';
import { SocialIcon } from 'react-social-icons';

import Location from './Location';

type ProfileInfoProps = {
  profileDetails: UserDetails;
};

function ProfileInfo({ profileDetails }: ProfileInfoProps) {
  return (
    <>
      <div className="lg:col-span-4 flex flex-col gap-gutter">
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
          <h3 className="text-headline-sm font-headline-sm mb-md text-on-surface">
            {profileDetails.account_type === 'organization'
              ? 'Organization'
              : 'Individual'}{' '}
            Details
          </h3>
          <p className="text-body-md text-on-surface-variant mb-lg">
            {profileDetails.bio || 'No bio available.'}
          </p>
          <h4 className="text-label-md font-label-md mb-md text-on-surface-variant uppercase tracking-wider">
            Social Links
          </h4>
          <div className="flex gap-md">
            {Object.entries(profileDetails.social_links).map(
              ([platform, url], index) => (
                <a
                  key={index}
                  className=" bg-surface-container-high flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={platform}>
                  <SocialIcon url={url} />
                </a>
              )
            )}
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
          <h3 className="text-headline-sm font-headline-sm mb-md text-on-surface">
            Skills
          </h3>
          <div className="flex flex-wrap gap-xs">
            {profileDetails?.account_type === 'personal' &&
            profileDetails?.skills?.length ? (
              profileDetails.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="bg-surface-container-high text-on-surface-variant px-md py-1 rounded-full text-label-sm font-label-sm">
                  {skill.name}
                </span>
              ))
            ) : (
              <span className="text-on-surface-variant">
                No skills available.
              </span>
            )}
          </div>
        </div>
        {/* <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
          <h3 className="text-label-md font-label-md mb-md text-on-surface-variant uppercase tracking-wider">
            Location
          </h3>
          <div className="relative h-32 w-full rounded-lg overflow-hidden bg-surface-container-high mb-sm">
            <img
                alt="Map of Kathmandu"
                className="w-full h-full object-cover grayscale opacity-50"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_map_placeholder_kathmandu"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-primary text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}>
                  location_on
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-base">distance</span>
              <span>Serves Kathmandu Valley &amp; surrounding areas</span>
            </div>
          </div> */}
        <Location user_id={profileDetails?.id} />
      </div>
    </>
  );
}

export default ProfileInfo;
