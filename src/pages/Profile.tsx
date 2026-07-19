import { useAppSelector } from '@/app/hooks';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { IntroHeader, ProfileInfo } from '@/features/user';
import { useGetProfileDetailsQuery } from '@/features/user/api/profileApi';
import type { UserDetails } from '@/types/user.types';

import Location from '@/features/user/components/profile/Location';

import { useGetMyJobsQuery } from '@/features/jobs/jobApi';
import ProfileRecentJobCard from '@/features/jobs/components/ProfileRecentJobCard';

type ProfileParams = {
  username?: string;
};

function Profile() {
  const { username } = useParams<ProfileParams>();

  const currentUser = useAppSelector(
    (state) => state.auth.user
  );

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

  const {
    data: recentJobs,
  } = useGetMyJobsQuery(
    {
      page: 1,
      page_size: 4,
      ordering: '-created_at',
    },
    {
    skip:
        !currentUser ||
        currentUser.username !== username,
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

        {/* Header */}

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

        {/* Body */}

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

          {/* LEFT COLUMN */}

          <div className="lg:col-span-8">

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
            </div>

          </div>

          {/* RIGHT COLUMN */}

          <aside className="lg:col-span-4 space-y-6">

            {/* LOCATION */}

            <Location user_id={profile.id} />

            {/* RECENT JOBS - ONLY FOR OWN PROFILE */}

            {currentUser?.username === username && (

              <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-5">

                <div className="mb-5">

                  <h2 className="text-lg font-semibold text-on-surface">
                    Recent Jobs
                  </h2>

                  <p className="text-sm text-on-surface-variant">
                    Your latest job posts
                  </p>

                </div>

                {recentJobs?.results?.length ? (

                  <div className="grid grid-cols-2 gap-3">

                    {recentJobs.results
                      .slice(0, 4)
                      .map((job) => (

                        <ProfileRecentJobCard
                          key={job.id}
                          job={job}
                        />

                      ))}

                  </div>

                ) : (

                  <div className="rounded-xl border border-dashed border-outline-variant py-10 px-4 text-center">

                    <p className="text-sm text-on-surface-variant">
                      No jobs posted yet.
                    </p>

                  </div>

                )}

              </div>

            )}

          </aside>

        </section>

      </div>

    </main>
  );
}

export default Profile;