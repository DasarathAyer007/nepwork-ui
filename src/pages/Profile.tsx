import { IntroHeader, ProfileInfo } from '@/features/user';
import { useGetProfileDetailsQuery } from '@/features/user/api/profileApi';
import type { UserDetails } from '@/types/user.types';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
// import AboutSection from '@/features/user/components/profile/sections/AboutSection';
// import SkillsSection from '@/features/user/components/profile/sections/SkillsSection';
// import SocialLinksSection from '@/features/user/components/profile/sections/SocialLinksSection';
type ProfileParams = {
  username?: string;
};


function Profile() {
  const { username } = useParams<ProfileParams>();

  const {
    data: profileDetails,
    isLoading,
    isError,
  } = useGetProfileDetailsQuery(
    {
      username: username ?? '',
    },
    {
      skip: !username,
    }
  );
    const [editMode, setEditMode] = useState(false);



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-sm text-gray-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }


  if (isError || !profileDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-sm rounded-xl p-8 text-center max-w-md">

          <h2 className="text-xl font-semibold text-gray-800">
            Profile unavailable
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            This profile does not exist or you do not have permission to view it.
          </p>

        </div>
      </div>
    );
  }


  const profile = profileDetails as UserDetails;


  return (
    <main className="min-h-screen bg-gray-50 pb-16">

      {/* Main profile container */}
      <div
        className="
          max-w-7xl 
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          pt-6
        "
      >

        {/* Profile Header */}
        <section
          className="
            bg-white
            rounded-2xl
            shadow-sm
            overflow-hidden
          "
        >
        <IntroHeader
          profileDetails={profile}
          editMode={editMode}
          setEditMode={setEditMode}
        />
        </section>



        {/* Profile Content */}
        <section
          className="
            mt-6
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-6
            items-start
          "
        >


          {/* Left/Main information */}
          <div
            className="
              lg:col-span-8
              space-y-6
            "
          >

            <div
              className="
                bg-white
                rounded-2xl
                shadow-sm
                p-5
                sm:p-6
              "
            >
              <ProfileInfo
                profileDetails={profile}
                editable={editMode}
              />
              {/* <AboutSection profile={profileDetails} />

              <SkillsSection profile={profileDetails} />
              <SocialLinksSection profile={profileDetails} /> */}
            </div>


          </div>



          {/* Right sidebar ready for future */}
          <aside
            className="
              lg:col-span-4
              space-y-6
            "
          >

            {/* Future sections:
                - Contact
                - Location
                - Skills
                - Social links
                - Reviews
            */}

          </aside>


        </section>


      </div>

    </main>
  );
}


export default Profile;