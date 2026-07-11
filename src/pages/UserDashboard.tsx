import { useState } from 'react';

import { DashboardSidebar } from '@/features/dashboard';
import { Outlet } from 'react-router-dom';

export default function UserDashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-background min-h-screen pb-16">
      <div className="w-full px-4">
        <DashboardSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />

        <main
          className={`transition-all duration-300 mt-4 ${
            collapsed ? 'md:ml-22' : 'md:ml-68'
          }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
