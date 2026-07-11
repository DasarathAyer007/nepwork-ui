import {
  type ChangeEvent,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Camera, User } from 'lucide-react';
import type {
  FieldValues,
  Path,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

interface ProfileImageFormProps<TFieldValues extends FieldValues> {
  setValue: UseFormSetValue<TFieldValues>;
  watch: UseFormWatch<TFieldValues>;
  profileFieldName?: Path<TFieldValues>;
  coverFieldName?: Path<TFieldValues>;
}

export function ProfileImageForm<TFieldValues extends FieldValues>({
  setValue,
  watch,
  profileFieldName,
  coverFieldName,
}: ProfileImageFormProps<TFieldValues>) {
  const resolvedProfileField =
    profileFieldName ?? ('profilePic' as Path<TFieldValues>);
  const resolvedCoverField =
    coverFieldName ?? ('coverPic' as Path<TFieldValues>);

  const profilePicFile = watch(resolvedProfileField) as File | null | undefined;
  const coverPicFile = watch(resolvedCoverField) as File | null | undefined;

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const profileUrlRef = useRef<string | null>(null);
  const coverUrlRef = useRef<string | null>(null);

  const {
    formState: { errors },
  } = useFormContext();

  const profileError = errors[resolvedProfileField]?.message as
    | string
    | undefined;
  const coverError = errors[resolvedCoverField]?.message as string | undefined;

  // Helper to update preview and revoke old URL
  const updatePreview = (
    file: File | null,
    setPreview: Dispatch<SetStateAction<string | null>>,
    urlRef: MutableRefObject<string | null>
  ) => {
    // Revoke old URL if any
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    if (file) {
      const url = URL.createObjectURL(file);
      urlRef.current = url;
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  // Handle profile file changes
  useEffect(() => {
    updatePreview(profilePicFile ?? null, setProfilePreview, profileUrlRef);
  }, [profilePicFile]);

  // Handle cover file changes
  useEffect(() => {
    updatePreview(coverPicFile ?? null, setCoverPreview, coverUrlRef);
  }, [coverPicFile]);

  // Cleanup on unmount only – revoke any remaining URLs
  useEffect(() => {
    const profileUrl = profileUrlRef;
    const coverUrl = coverUrlRef;
    return () => {
      if (profileUrl.current) {
        URL.revokeObjectURL(profileUrl.current);
      }
      if (coverUrl.current) {
        URL.revokeObjectURL(coverUrl.current);
      }
    };
  }, []);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue(resolvedProfileField, file as TFieldValues[Path<TFieldValues>], {
      shouldValidate: true,
    });
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue(resolvedCoverField, file as TFieldValues[Path<TFieldValues>], {
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Cover Photo */}
        <div className="relative h-44 w-full rounded-2xl overflow-hidden group border border-outline-variant/30 bg-surface-container shadow-inner">
          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-outline group-hover:text-primary transition-colors">
              <Camera className="w-8 h-8 mb-2 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Upload Cover Image
              </span>
            </div>
          )}
          {/* Cover Edit Overlay */}
          <label
            htmlFor="cover-upload"
            className="absolute inset-0 bg-on-background/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer text-white font-semibold text-sm transition-opacity duration-200">
            <Camera className="w-5 h-5 mr-2" />
            Change Cover Photo
          </label>
          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />
        </div>

        {/* Profile Picture */}
        <div className="absolute -bottom-10 left-8 w-28 h-28 rounded-full bg-surface-container-lowest p-1 shadow-md border border-outline-variant/20 z-10 group/profile">
          <div className="relative w-full h-full rounded-full overflow-hidden bg-surface-container flex items-center justify-center">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile"
                className="w-full h-full object-cover group-hover/profile:scale-105 transition-transform duration-500"
              />
            ) : (
              <User className="w-12 h-12 text-outline" />
            )}
            {/* Profile Edit Overlay */}
            <label
              htmlFor="profile-upload"
              className="absolute inset-0 bg-on-background/40 opacity-0 group-hover/profile:opacity-100 flex items-center justify-center cursor-pointer text-white transition-opacity duration-200">
              <Camera className="w-6 h-6" />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileChange}
            />
          </div>
        </div>
      </div>

      {/* Spacing for absolute elements */}
      <div className="h-10" />

      {/* Error messages */}
      <div className="flex flex-col gap-1.5 mt-2">
        {coverError && (
          <div className="flex items-center gap-1.5 text-error text-xs font-semibold bg-error/5 px-3 py-1.5 rounded-lg border border-error/20">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
            Cover Image: {coverError}
          </div>
        )}
        {profileError && (
          <div className="flex items-center gap-1.5 text-error text-xs font-semibold bg-error/5 px-3 py-1.5 rounded-lg border border-error/20">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
            Profile Picture: {profileError}
          </div>
        )}
      </div>
    </div>
  );
}
