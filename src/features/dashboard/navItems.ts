import {
  Briefcase,
  ClipboardList,
  FileText,
  Inbox,
  LayoutDashboard,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type DashboardNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
};

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'My Jobs', to: '/dashboard/jobs', icon: Briefcase },
  {
    label: 'My Applications',
    to: '/dashboard/my-applications',
    icon: FileText,
  },
  { label: 'My Services', to: '/dashboard/services', icon: Wrench },
  {
    label: 'Requests Received',
    to: '/dashboard/requests-received',
    icon: Inbox,
  },
  { label: 'My Requests', to: '/dashboard/my-requests', icon: ClipboardList },
];
