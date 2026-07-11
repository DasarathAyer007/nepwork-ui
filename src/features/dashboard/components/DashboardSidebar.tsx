import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { DASHBOARD_NAV_ITEMS } from '../navItems';

type DashboardSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function DashboardSidebar({
  collapsed,
  onToggle,
}: DashboardSidebarProps) {
  return (
    <>
      {/* Mobile: horizontal scrollable nav, no collapse */}
      <nav className="md:hidden flex gap-1 overflow-x-auto no-scrollbar bg-surface-container-lowest border border-outline-variant rounded-2xl p-2 mt-4">
        {DASHBOARD_NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-primary/10 hover:text-primary'
              }`
            }>
            <Icon size={18} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Desktop: fixed, full-height, collapsible */}
      <aside
        className={`hidden md:flex md:flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 bg-surface-container-lowest border-r border-outline-variant transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}>
        <nav className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto no-scrollbar">
          {DASHBOARD_NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-primary/10 hover:text-primary'
                }`
              }>
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-outline-variant">
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all duration-150 ${
              collapsed ? 'justify-center' : ''
            }`}>
            {collapsed ? (
              <PanelLeftOpen size={18} className="shrink-0" />
            ) : (
              <PanelLeftClose size={18} className="shrink-0" />
            )}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
