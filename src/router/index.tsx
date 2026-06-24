import { Route, Routes } from 'react-router-dom';

import MainLayout from '../layouts/User/MainLayout';
import Home from '../pages/Home';
import Jobs from '../pages/Jobs.tsx';
import LogIn from '../pages/LogIn';
import Onboarding from '../pages/Onboarding';
import SignUp from '../pages/SignUp';
import JobDetails from '../pages/JobDetails';

function route() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetails />} />
      </Route>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
    </Routes>
  );
}
  
export default route;
