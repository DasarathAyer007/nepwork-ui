import { useState } from 'react';
import { Globe} from 'lucide-react';

import EditableSection from '../EditableProfileSection';

import { Input } from '@/components/ui/forms/Input';
import { Label } from '@/components/ui/forms/Label';
import type { UserDetails } from '@/types/user.types';

import { useUpdateProfileMutation } from '../../../api/profileApi';

type Props = {
  profile: UserDetails;
  editable: boolean;
};

type SocialLinks = Record<string, string>;

const platforms = [
  {
    key: 'github',
    label: 'GitHub',
    placeholder: 'https://github.com/username',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/username',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    placeholder: 'https://facebook.com/username',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/username',
  },
  {
    key: 'website',
    label: 'Website',
    icon: Globe,
    placeholder: 'https://yourwebsite.com',
  },
];

export default function SocialLinksSection({
  profile,
  editable,
}: Props) {
  const [activeId, setActiveId] =
    useState<string | null>(null);

  const [updateProfile, { isLoading }] =
    useUpdateProfileMutation();

  async function saveLinks(
    links: SocialLinks
  ) {
    const cleaned = Object.fromEntries(
      Object.entries(links).filter(
        ([, value]) => value.trim() !== ''
      )
    );

    await updateProfile({
      social_links: cleaned,
    }).unwrap();

    setActiveId(null);
  }

  return (
    <EditableSection
      id="social-links"
      title="Social Links"
      editable={editable}
      subtitle="Add links to your social profiles."
      value={profile.social_links ?? {}}
      activeId={activeId}
      onActivate={setActiveId}
      onDeactivate={() => setActiveId(null)}
      isSaving={isLoading}
      onSave={saveLinks}
      renderDisplay={(links) =>
        Object.keys(links).length ? (
          <div className="space-y-3">
            {Object.entries(links).map(
              ([platform, url]) => (
                <div
                  key={platform}
                  className="flex items-center justify-between rounded-xl border border-outline-variant px-4 py-3"
                >
                  <span className="font-medium capitalize">
                    {platform}
                  </span>

                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline truncate max-w-[70%]"
                  >
                    {url}
                  </a>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-on-surface-variant">
            No social links added yet.
          </p>
        )
      }
      renderEditor={({ draft, setDraft }) => (
        <div className="space-y-5">
          {platforms.map((platform) => {

            return (
              <div key={platform.key}>
                <Label className="mb-2 flex items-center gap-2">
                <Globe size={16} />
                {platform.label}
                </Label>
                
                <Input
                  placeholder={platform.placeholder}
                  value={draft[platform.key] ?? ''}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      [platform.key]:
                        e.target.value,
                    })
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    />
  );
}