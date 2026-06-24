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
    return () => {
      if (profileUrlRef.current) {
        URL.revokeObjectURL(profileUrlRef.current);
      }
      if (coverUrlRef.current) {
        URL.revokeObjectURL(coverUrlRef.current);
      }
    };
  }, []);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue(resolvedProfileField, file as TFieldValues[Path<TFieldValues>], {
      shouldValidate: true,
    });
    // Preview will be updated by the effect watching profilePicFile
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue(resolvedCoverField, file as TFieldValues[Path<TFieldValues>], {
      shouldValidate: true,
    });
    // Preview will be updated by the effect watching coverPicFile
  };

  return (
    <div className="relative mb-12">
      {/* Cover Photo */}
      <label
        htmlFor="cover-upload"
        className="w-full h-40 bg-surface-container rounded-md border-2 border-dashed border-outline-variant flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors group overflow-hidden">
        {coverPreview ? (
          <img
            src={coverPreview}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Camera className="text-3xl text-outline group-hover:text-primary" />
            <span className="text-xs font-semibold text-on-surface-variant">
              Upload Cover Photo
            </span>
          </div>
        )}
        <input
          id="cover-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />
      </label>

      {/* Profile Picture */}
      <div className="absolute -bottom-8 left-6 w-24 h-24 bg-surface-container-lowest rounded-full p-1 shadow-sm">
        <label
          htmlFor="profile-upload"
          className="w-full h-full bg-surface-container rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors group overflow-hidden">
          {profilePreview ? (
            <img
              src={profilePreview}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User className="text-2xl text-outline group-hover:text-primary" />
          )}
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfileChange}
          />
        </label>
      </div>
    </div>
  );
}
