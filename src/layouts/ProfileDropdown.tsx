import { useRef } from 'react';

import { Bookmark, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useClickOutside } from '@/hooks/useClickOutSide';

type ProfileDropdownProps = {
  user: {
    id?: string;
    full_name?: string;
    email?: string;
    profile_picture?: string;
  };
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
  return (
    <div
      ref={modalRef}
      className="
        absolute right-0 top-14 w-72
        bg-card border border-border
        rounded-3xl shadow-form
        overflow-hidden z-50
      ">
      {/* User Info */}
      <div className="p-5 border-b border-border">
        <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <img
              src={user.profile_picture || '/default-avatar.png'}
              className="size-14 rounded-full object-cover"
              alt=""
            />

            <div>
              <h3 className="font-semibold text-text">
                {user.full_name || 'Guest User'}
              </h3>

              <p className="text-sm text-muted">{user.email}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <div className="p-2">
        <button className="menu-item">
          <Bookmark size={18} />
          <span>Saved Jobs</span>
        </button>

        <button className="menu-item">
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <div className="my-2 border-t border-border" />

        <button
          onClick={onLogout}
          className="menu-item text-error hover:bg-error/10">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
