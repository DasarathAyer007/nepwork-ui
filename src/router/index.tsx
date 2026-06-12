import { Route, Routes } from 'react-router-dom';

import MainLayout from '../layouts/User/MainLayout';
import Home from '../pages/Home';
import Jobs from '../pages/Jobs.tsx';
import LogIn from '../pages/LogIn';
import SignUp from '../pages/SignUp';

function route() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
      </Route>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
    </Routes>
  );
}
  
export default route;
