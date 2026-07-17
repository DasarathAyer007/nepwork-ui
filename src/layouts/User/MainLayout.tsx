import { Outlet, useLocation } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';

function MainLayout() {
  const { pathname } = useLocation();
  // The messages page is a full-height app view (like WhatsApp) — it manages
  // its own internal scrolling (sidebar/chat panes), so the outer page must
  // not scroll and the marketing footer doesn't belong here.
  const isFullHeightPage = pathname.startsWith('/messages');

  if (isFullHeightPage) {
    return (
      <div className="flex h-dvh flex-col bg-background text-on-background antialiased">
        <Header />
        <main className="min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background antialiased ">
      <Header />
      <main className=" min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
