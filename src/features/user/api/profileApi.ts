import type { Location } from '@/types/location.types';
import type { UserDetails } from '@/types/user.types';
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../../../services/baseQuery';

export const ProfileApi = createApi({
  reducerPath: 'profileApi',

  baseQuery,

  tagTypes: ['User'],

  endpoints: (builder) => ({
    getProfileDetails: builder.query<UserDetails, { username: string }>({
      query: ({ username }) =>
        `/users/profile/${username}`,

      providesTags: [
        {
          type: 'User',
          id: 'PROFILE',
        },
      ],
    }),


    getLocationDetails: builder.query<Location, { userid: string }>({
      query: ({ userid }) =>
        `/users/${userid}/location`,

      providesTags: [
        {
          type: 'User',
          id: 'PROFILE',
        },
      ],
    }),


    updateProfile: builder.mutation<UserDetails, FormData |Record<string, unknown>>({
     query: (body) => {
        const payload =
          body instanceof FormData
            ? body
            : (() => {
                const formData = new FormData();

                Object.entries(body).forEach(([key, value]) => {
                  if (
                    value === undefined ||
                    value === null
                  ) {
                    return;
                  }

                  if (Array.isArray(value)) {
                    value.forEach((item) =>
                      formData.append(key, String(item))
                    );
                  } else if (
                    typeof value === 'object' &&
                    !(value instanceof File)
                  ) {
                    formData.append(
                      key,
                      JSON.stringify(value)
                    );
                  } else {
                    formData.append(
                      key,
                      value as string | Blob
                    );
                  }
                });

                return formData;
              })();

        return {
          url: '/users/profile/update/',
          method: 'PATCH',
          body: payload,
        };
      },

      invalidatesTags: [
        {
          type: 'User',
          id: 'PROFILE',
        },
      ],
    }),
  }),
});


export const {
  useGetProfileDetailsQuery,
  useGetLocationDetailsQuery,
  useUpdateProfileMutation,
} = ProfileApi;