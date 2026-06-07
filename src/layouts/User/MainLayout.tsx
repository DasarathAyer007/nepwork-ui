import { Outlet } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';

function MainLayout() {
  return (
    <>
      <div className="bg-background text-on-background antialiased overflow-x-hidden">
        <Header />

        <main className="min-h-screen">
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default MainLayout;
