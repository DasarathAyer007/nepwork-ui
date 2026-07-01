import { Route, Routes } from 'react-router-dom';

import MainLayout from '../layouts/User/MainLayout';
import Home from '../pages/Home';
<<<<<<< Updated upstream
=======
import JobDetails from '../pages/JobDetails';
import JobApplication from '../pages/JobApplication.tsx';
>>>>>>> Stashed changes
import Jobs from '../pages/Jobs.tsx';
import LogIn from '../pages/LogIn';
import SignUp from '../pages/SignUp';
import JobDetails from '../pages/JobDetails';

function route() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetails />} />
<<<<<<< Updated upstream
=======
        <Route path="/jobs/:id/apply" element={<JobApplication />} />

        <Route path="/profile/:username" element={<Profile />} />
>>>>>>> Stashed changes
      </Route>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
    </Routes>
  );
}
  
export default route;
