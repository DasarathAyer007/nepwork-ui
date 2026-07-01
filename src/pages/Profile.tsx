import React from 'react';

import { IntroHeader, ProfileInfo } from '@/features/user/';
import { useGetProfileDetailsQuery } from '@/features/user/api/profileApi';
import type { UserDetails } from '@/types/user.types';
import { featureGroup } from 'leaflet';
import { useParams } from 'react-router-dom';

type Params = {
  username: string;
};

function Profile() {
  const { username } = useParams<Params>();

  const {
    data: profileDetails,
    isLoading,
    isError,
  } = useGetProfileDetailsQuery({
    username: username || '',
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !profileDetails) {
    return <div>Error loading profile details.</div>;
  }

  return (
    <>
      <main className=" pb-xl max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <IntroHeader profileDetails={profileDetails as UserDetails} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <ProfileInfo profileDetails={profileDetails as UserDetails} />

          <div className="lg:col-span-8 flex flex-col gap-gutter">
            <section className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
              <div className="flex justify-between items-center mb-md">
                <h3 className="text-headline-sm font-headline-sm text-on-surface">
                  Past Projects
                </h3>
                <a
                  className="text-primary font-label-md text-label-md hover:underline"
                  href="#">
                  View All
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-sm">
                <div className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    data-alt="A lush, modern rooftop garden in Kathmandu, featuring tiered wooden planters filled with organic vegetables and vibrant local flowers. The space is expertly designed for urban sustainability with a sleek drip irrigation system visible. Bright daylight highlights the rich greens and earthy textures. Corporate and modern aesthetic with focus on environmental technology."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXoStbwle4uZ6ZvtKTGfKZZ3UMDUJCOByUlWCtexDeRosAsKi4MB0HoxS4YYR_cAekktElCxcPJKp0amfOSdxq-SS06lIFQmdi6Wz24MlgLtV4hXNNhqSKyWn4bgrCgBlAKpA37-2JvQ9AsDkz5y6dzOytKeK6gubMJhSqDW3Y8gASlgO9CrpJGeatXhgvVpEdxs1z54Aa6pag90mm6VV9pEr_LX-RvsjOsM0NQ65tJYcQmKpYuwaPT1C3-hf-iFApEjYGnPkSNfmi"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-on-primary font-label-md text-label-md">
                      Modern Terrace Garden
                    </span>
                  </div>
                </div>
                <div className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    data-alt="High-tech hydroponic farm setup inside a clean, white-walled warehouse. Rows of vibrant green lettuce grow in illuminated PVC channels under cool-toned LED grow lights. The atmosphere is clinical, efficient, and technologically advanced. Visual style is professional and sharp, showcasing modern agricultural innovation in Nepal."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX9606_cgYbRYzOTiGnm91LQedbKC3qIWZaIxUTzd4rJK8RqlTrrOuxSLqR-lnVZPU_gX9GpQPWurx40nVbRNHWX0tHFcN4JcfQlQyO_WxsxaKMmfzKsUQBPjFNpzPv2BXIgkYbTTGFrkT0awzQiNVdX8PGx9mvrAw6_Ws80f8Eg8Axf09fUcM6wN8MuoTPB_GfOzupvNV6CqZ5Dj1rUlzlJeZuW0BQz8yNOMEH_aMdwPhlerPtIyecboMylqKcTjjeB5wf9iVme6U"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-on-primary font-label-md text-label-md">
                      Hydroponic Facility
                    </span>
                  </div>
                </div>
                <div className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    data-alt="A detailed landscape architectural blueprint displayed on a large tablet, showing the master plan for a community park in Nepal. The digital drawing features clean lines, topographic markings, and designated green zones. The lighting is focused and professional, emphasizing precision and design excellence. Modern soft-tech aesthetic."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwWJgw0qinLvawA0vhdACcSCShjha0E1StXkc-zMMuCe9zLeahOrRoFzl6TTiH0GHjQRulgL5kUMj9ztCwFUtsoevYvRruPwxVc4c7KAFWBwTejYYK490T7-Hh7M6OvkX5VHcrjtLSDXjgc0t6mTSh2QoSio3C3nMwbPYPx3R5jOjJ_zo9MdkzSrJY7uaizkYciydEYi7bzIXN8xNEUdovMNhhuRKQF4XfebR-f8E3a6g6GIZk26wJ45VEKc-USLUg_W_Nq7B-uOb3"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-on-primary font-label-md text-label-md">
                      Landscape Masterplan
                    </span>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
              <h3 className="text-headline-sm font-headline-sm mb-lg text-on-surface">
                Services Offered
              </h3>
              <div className="space-y-xl relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-surface-container-high">
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-primary rounded-full border-4 border-surface-container-lowest"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-label-md font-label-md text-primary uppercase">
                        Core Service
                      </h4>
                      <p className="text-body-lg font-headline-sm text-on-surface mt-1">
                        Smart Irrigation Infrastructure
                      </p>
                    </div>
                  </div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-md">
                    End-to-end design and installation of IoT-enabled drip and
                    sprinkler systems for commercial farms.
                  </p>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-primary rounded-full border-4 border-surface-container-lowest"></div>
                  <div>
                    <h4 className="text-label-md font-label-md text-primary uppercase">
                      Consultancy
                    </h4>
                    <p className="text-body-lg font-headline-sm text-on-surface mt-1">
                      Organic Certification Support
                    </p>
                  </div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-md">
                    Guiding local farmers through the process of international
                    organic certification and soil restoration.
                  </p>
                </div>
              </div>
            </section>
            <section className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
              <div className="flex justify-between items-center mb-lg">
                <h3 className="text-headline-sm font-headline-sm text-on-surface">
                  Client Reviews
                </h3>
                <div className="flex items-center gap-sm">
                  <span className="text-headline-sm font-headline-sm text-on-surface">
                    4.9
                  </span>
                  <div className="flex text-tertiary">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">
                    (124)
                  </span>
                </div>
              </div>
              <div className="space-y-lg">
                <div className="border-b border-outline-variant pb-lg last:border-0 last:pb-0">
                  <div className="flex items-center gap-md mb-xs">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      data-alt="Profile avatar of a professional middle-aged woman with a kind expression, representing a business client in Nepal. Soft professional lighting, neutral background, clean corporate style."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsuOzl1rTIV4bKhur1_V74C3nJUcvmgJ3CFKxI-kwUVs5JYy9nL6vHxfm6P-StgtSh8_-U-XXnvGOp7FxMWPiu-urOQ1-vFiI2Txhenz0adSb3Y4NL4LGMDAHMD4po_FeoZIwXMcr18RW70mgd2D2wpj98K_2pOK9zOkZ6DnFbZwit78Y0U4ZZf1UJSnceE3mF7158YBvHkmOjn_V7Are7ga3AT7AxGuxADzfozy_Q4ga7kl0505z5jHEqg0Dz35IlIi52QTpXNWXH"
                    />
                    <div>
                      <h5 className="text-label-md font-label-md text-on-surface">
                        Saraswati Thapa
                      </h5>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">
                        2 weeks ago
                      </p>
                    </div>
                    <div className="ml-auto flex text-tertiary">
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    </div>
                  </div>
                  <p className="text-body-md font-body-md text-on-surface-variant">
                    Highly professional and deep knowledge of local Nepali soil
                    conditions. Anish helped us transform our barren land into a
                    productive organic vegetable farm in just four months.
                  </p>
                </div>
                <div className="border-b border-outline-variant pb-lg last:border-0 last:pb-0">
                  <div className="flex items-center gap-md mb-xs">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      data-alt="Professional headshot of a young entrepreneur, clean-cut with a modern hairstyle, against a bright office background. Corporate lighting, approachable and sharp visual style."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjH9G4324m5mQRdWhs9HAy_j-rz9oPW3-h5NeDtZbxmnXdUlDcNs1yISLYCpRRJj8nDXxISRvCLdyp5d4W-uRwY-zumrEVgEzTN1mEHl0WGRQospfXvEbt7G3XfpBYoK6rxA6gUB1IzEiF3zM5uml49n6PX1roPfE16xpVvw_EzVOxKwRDPNqImI9bx7na6FLCeUn3epbGAEKIz7RGfRiK2CGAnpGtQLJFh2PWByD8GLDGy50UKuByXKL75kr2Cj6ip6heWhZsWQBu"
                    />
                    <div>
                      <h5 className="text-label-md font-label-md text-on-surface">
                        Rohan Karki
                      </h5>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">
                        1 month ago
                      </p>
                    </div>
                    <div className="ml-auto flex text-tertiary">
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 0.5" }}>
                        star
                      </span>
                    </div>
                  </div>
                  <p className="text-body-md font-body-md text-on-surface-variant">
                    Excellent communication and very punctual. The rooftop
                    landscape design exceeded our expectations. Will definitely
                    hire again for future projects.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;
