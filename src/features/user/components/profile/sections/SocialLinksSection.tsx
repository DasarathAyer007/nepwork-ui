import { useState } from 'react';
import {
  Globe,
  ExternalLink,
} from 'lucide-react';

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
    try {
      const cleaned = Object.fromEntries(
        Object.entries(links).filter(
          ([, value]) => value.trim() !== ''
        )
      );

      await updateProfile({
        social_links: cleaned,
      }).unwrap();

      setActiveId(null);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <EditableSection
      id="social-links"
      title="Social Links"
      subtitle="Connect your online profiles."
      editable={editable}
      value={profile.social_links ?? {}}
      activeId={activeId}
      onActivate={setActiveId}
      onDeactivate={() => setActiveId(null)}
      isSaving={isLoading}
      onSave={saveLinks}
      renderDisplay={(links) =>
        Object.keys(links).length ? (
          <div className="space-y-2">
            {Object.entries(links).map(
              ([platform, url]) => (
                <div
                  key={platform}
                  className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Globe
                        size={16}
                        className="text-primary"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium capitalize text-on-surface">
                        {platform}
                      </p>

                      <p className="text-xs text-on-surface-variant truncate max-w-55">
                        {url}
                      </p>
                    </div>
                  </div>

                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-outline-variant p-5 text-center text-sm text-on-surface-variant">
            No social links added yet.
          </div>
        )
      }
      renderEditor={({ draft, setDraft }) => (
        <div className="space-y-4">
          {platforms.map((platform) => (
            <div key={platform.key}>
              <Label className="mb-2 flex items-center gap-2">
                <Globe
                  size={15}
                  className="text-primary"
                />
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
          ))}
        </div>
      )}
    />
  );
}