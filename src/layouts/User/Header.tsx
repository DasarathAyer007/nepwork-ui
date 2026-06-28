import { useState } from 'react';

import {
  Bell,
  CircleUserRound,
  MapPin,
  Menu,
  MessageCircle,
  X,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  selectIsAuthenticated,
  selectUser,
} from '../../features/auth/authSelectors';
import ProfileDropdown from '../ProfileDropdown';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const isLogin = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const notificationCount = 0;

  const navLinks = [
    { name: 'Find Jobs', to: '/jobs' },
    { name: 'Service Marketplace', to: '/services' },
    { name: 'Messages', to: '/messages' },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/10 shadow-sm">
      <div className="flex items-center justify-between w-full px-4 md:px-8 py-2 max-w-8xl mx-auto">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="flex items-center gap-2" aria-label="Home">
            <img alt="NepWork Logo" className="h-10 w-auto" src="favicon.svg" />
            <span className="text-headline-md font-bold text-primary hidden sm:block">
              NepWork
            </span>
          </Link>

          <nav className="hidden p-2  md:flex items-center gap-6 font-headline text-body-lg font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-on-surface-variant text-md hover:text-primary transition-colors duration-100 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          {isLogin ? (
            <>
              <button
                className="relative p-2 text-on-surface-variant hover:text-primary transition-all duration-200 hover:scale-110"
                aria-label="Location">
                <MapPin size={25} />
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
              </button>

              <button
                className="relative p-2 text-on-surface-variant hover:text-primary transition-all duration-200 hover:scale-110"
                aria-label="Messages">
                <MessageCircle size={25} />
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
              </button>

              <button
                className="relative p-2 text-on-surface-variant hover:text-primary transition-all duration-200 hover:scale-110"
                aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} new)` : ''}`}>
                <Bell size={25} />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-4.5 h-4.5 text-[10px] font-bold text-white bg-error rounded-full px-1">
                    {notificationCount}
                  </span>
                )}
              </button>

              <div className="relative group:">
                <button
                  onClick={() => setShowProfile((prev) => !prev)}
                  className="p-1 text-on-surface-variant hover:scale-105 transition">
                  <img
                    className="size-10 rounded-full object-cover border border-border"
                    src={user?.profile_picture ?? ''}
                    alt=""
                  />
                </button>

                {showProfile && user && (
                  <ProfileDropdown
                    user={user}
                    onLogout={() => {
                      // Handle logout logic here
                      console.log('User logged out');
                      setShowProfile(false);
                    }}
                    onClose={() => setShowProfile(false)}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/login">
                <button className="px-4 py-2 text-md sm:text-base text-primary font-medium border border-outline-variant/50 rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 active:scale-95">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-5 py-2 text-md sm:text-base bg-primary text-on-primary rounded-lg font-medium shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-200 active:scale-95">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/10 px-4 py-4 space-y-3 animate-fade-in">
          <Link
            to="/jobs"
            className="block py-2 px-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}>
            Find Jobs
          </Link>
          <Link
            to="/services"
            className="block py-2 px-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}>
            Service Marketplace
          </Link>
          <Link
            to="/messages"
            className="block py-2 px-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}>
            Messages
          </Link>
          {/* Mobile auth buttons when not logged in */}
          {!isLogin && (
            <div className="flex gap-3 pt-2">
              <Link to="/login">
                <button className="flex-1 py-2 text-primary font-medium border border-outline-variant/50 rounded-lg hover:bg-primary/5 transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="flex-1 py-2 bg-primary text-on-primary rounded-lg font-medium shadow-md transition-colors">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
