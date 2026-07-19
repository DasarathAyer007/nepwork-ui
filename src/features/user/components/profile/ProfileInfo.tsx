import type { UserDetails } from '@/types/user.types';

import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import SocialLinksSection from './sections/SocialLinksSection';
import BasicInfoSection from './sections/BasicInfoSection';
// import Location from './Location';

type ProfileInfoProps = {
  profileDetails: UserDetails;
  editable: boolean;
};

function ProfileInfo({
  profileDetails,
  editable,
}: ProfileInfoProps) {
  return (
    <div className="lg:col-span-4 flex flex-col gap-gutter">

        {editable && (
            <BasicInfoSection
                profile={profileDetails}
                editable={editable}
            />
        )}

        <AboutSection
          profile={profileDetails}
          editable={editable}
        />

      {profileDetails.account_type === 'personal' && (
        <SkillsSection
          profile={profileDetails}
          editable={editable}
        />
      )}

      <SocialLinksSection
        profile={profileDetails}
        editable={editable}
      />
      {/* <Location user_id={profileDetails.id} /> */}

    </div>
  );
}

export default ProfileInfo;