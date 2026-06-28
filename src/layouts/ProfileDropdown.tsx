import { useRef } from 'react';

import type { LoginUser } from '@/features/auth/types';
import {
  Bell,
  Bookmark,
  Briefcase,
  FileText,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { MenuItem } from '@/components/ui/MenuItem';

import { useClickOutside } from '@/hooks/useClickOutSide';

type ProfileDropdownProps = {
  user: LoginUser;
  onLogout: () => void;
  onClose: () => void;
};

export default function ProfileDropdown({
  user,
  onLogout,
  onClose,
}: ProfileDropdownProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, onClose);

  const primaryLinks = [
    {
      icon: <User size={16} />,
      label: 'View Profile',
      description: 'See your public profile',
      to: `/profile/${user.username}`,
    },
    {
      icon: <Briefcase size={16} />,
      label: 'My Applications',
      description: 'Track your job applications',
      badge: 3,
      to: '/applications',
    },
    {
      icon: <Bookmark size={16} />,
      label: 'Saved Jobs',
      description: 'Jobs you bookmarked',
      to: '/saved-jobs',
    },
    {
      icon: <FileText size={16} />,
      label: 'My Resume',
      description: 'Manage your resume & CV',
      to: '/resume',
    },
  ];

  const secondaryLinks = [
    {
      icon: <Bell size={16} />,
      label: 'Notifications',
      description: 'Job alerts & updates',
      badge: 5,
      to: '/notifications',
    },
    {
      icon: <Settings size={16} />,
      label: 'Settings',
      description: 'Account & privacy',
      to: '/settings',
    },
    {
      icon: <Shield size={16} />,
      label: 'Privacy & Security',
      description: 'Manage your data',
      to: '/settings/privacy',
    },
    {
      icon: <HelpCircle size={16} />,
      label: 'Help & Support',
      to: '/support',
    },
  ];

  return (
    <div
      ref={modalRef}
      className="
        absolute right-0 top-14 w-80
        bg-card border border-border
        rounded-2xl shadow-form
        overflow-hidden z-50
        animate-in fade-in slide-in-from-top-2 duration-200
      ">
      {/*  User Header  */}
      <div className="p-4 bg-linear-to-br from-primary/5 to-transparent border-b border-border">
        <Link
          to={`/profile/${user.username}`}
          onClick={onClose}
          className="flex items-center gap-3 group">
          <div className="relative shrink-0">
            <img
              src={user.profile_picture || '/default-avatar.png'}
              className="size-12 rounded-full object-cover ring-2 ring-border group-hover:ring-primary/40 transition-all"
              alt={user.full_name || 'Profile'}
            />
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 size-3 bg-success rounded-full ring-2 ring-card" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-text leading-tight truncate">
              {user.full_name || 'Guest User'}
            </p>
            <p className="text-xs text-muted truncate mt-0.5">
              @{user.username}
            </p>
          </div>
        </Link>
      </div>

      {/* Main Menu  */}
      <div className="p-2 space-y-0.5">
        {primaryLinks.map((link, index) => (
          <MenuItem
            key={index}
            icon={link.icon}
            label={link.label}
            description={link.description}
            badge={link.badge}
            to={link.to}
            onClick={onClose}
          />
        ))}
      </div>

      <div className="mx-3 border-t border-border" />

      {/* Secondary Menu  */}
      <div className="p-2 space-y-0.5">
        {secondaryLinks.map((link, index) => (
          <MenuItem
            key={index}
            icon={link.icon}
            label={link.label}
            description={link.description}
            badge={link.badge}
            to={link.to}
            onClick={onClose}
          />
        ))}
      </div>

      <div className="mx-3 border-t border-border" />

      {/* Logout  */}
      <div className="p-2">
        <MenuItem
          icon={<LogOut size={16} />}
          label="Log out"
          onClick={onLogout}
          variant="danger"
        />
      </div>
    </div>
  );
}
