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

import { ImageCropDialog } from '@/components/ui/ImageCropDialog';

interface ProfileImageFormProps<TFieldValues extends FieldValues> {
  setValue: UseFormSetValue<TFieldValues>;
  watch: UseFormWatch<TFieldValues>;
  profileFieldName?: Path<TFieldValues>;
  coverFieldName?: Path<TFieldValues>;
}

interface PendingImage {
  src: string;
  name: string;
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

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [pendingProfileImage, setPendingProfileImage] =
    useState<PendingImage | null>(null);
  const [pendingCoverImage, setPendingCoverImage] =
    useState<PendingImage | null>(null);

  const {
    formState: { errors },
  } = useFormContext();

  const profileError = errors[resolvedProfileField]?.message as
    string | undefined;
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
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingProfileImage({ src: URL.createObjectURL(file), name: file.name });
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingCoverImage({ src: URL.createObjectURL(file), name: file.name });
  };

  const closeProfileCropDialog = () => {
    if (pendingProfileImage) URL.revokeObjectURL(pendingProfileImage.src);
    setPendingProfileImage(null);
    if (profileInputRef.current) profileInputRef.current.value = '';
  };

  const closeCoverCropDialog = () => {
    if (pendingCoverImage) URL.revokeObjectURL(pendingCoverImage.src);
    setPendingCoverImage(null);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const handleProfileCropSave = (file: File) => {
    setValue(resolvedProfileField, file as TFieldValues[Path<TFieldValues>], {
      shouldValidate: true,
    });
    closeProfileCropDialog();
  };

  const handleCoverCropSave = (file: File) => {
    setValue(resolvedCoverField, file as TFieldValues[Path<TFieldValues>], {
      shouldValidate: true,
    });
    closeCoverCropDialog();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md overflow-hidden border border-outline-variant bg-surface-container-lowest shadow-sm">
        {/* Cover Photo (3:1) */}
        <div className="relative h-40 md:h-52 w-full bg-surface-container-high group">
          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-outline group-hover:text-primary transition-colors">
              <Camera className="w-8 h-8 mb-2" />
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
            ref={coverInputRef}
            id="cover-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />
        </div>

        {/* Profile Picture (1:1) */}
        <div className="px-6 pb-6">
          <div className="relative -mt-14 md:-mt-16 inline-block w-28 h-28 md:w-32 md:h-32 rounded-xl border-4 border-surface-container-lowest bg-surface-container-high overflow-hidden shadow-md group/profile">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-10 h-10 text-outline" />
              </div>
            )}
            {/* Profile Edit Overlay */}
            <label
              htmlFor="profile-upload"
              className="absolute inset-0 bg-on-background/40 opacity-0 group-hover/profile:opacity-100 flex items-center justify-center cursor-pointer text-white transition-opacity duration-200">
              <Camera className="w-6 h-6" />
            </label>
            <input
              ref={profileInputRef}
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileChange}
            />
          </div>
        </div>
      </div>

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

      {pendingCoverImage && (
        <ImageCropDialog
          open
          imageSrc={pendingCoverImage.src}
          fileName={pendingCoverImage.name}
          aspect={3 / 1}
          outputWidth={1800}
          outputHeight={600}
          onCancel={closeCoverCropDialog}
          onSave={handleCoverCropSave}
        />
      )}

      {pendingProfileImage && (
        <ImageCropDialog
          open
          imageSrc={pendingProfileImage.src}
          fileName={pendingProfileImage.name}
          aspect={1}
          outputWidth={800}
          outputHeight={800}
          onCancel={closeProfileCropDialog}
          onSave={handleProfileCropSave}
        />
      )}
    </div>
  );
}
