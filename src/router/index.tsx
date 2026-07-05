// import ChatWindow from '@/pages/ChatWindow.tsx';
import CreateJob from '@/pages/CreateJob.tsx';
import CreateService from '@/pages/CreateService.tsx';
import MessagePage from '@/pages/MessagePage.tsx';
import Services from '@/pages/Services.tsx';
import { Route, Routes } from 'react-router-dom';

import MainLayout from '../layouts/User/MainLayout';
import CreatePostType from '../pages/ChoosePostType';
import Home from '../pages/Home';
import JobDetails from '../pages/JobDetails';
import Jobs from '../pages/Jobs.tsx';
import LogIn from '../pages/LogIn';
import Onboarding from '../pages/Onboarding';
import Profile from '../pages/Profile';
import SignUp from '../pages/SignUp';

function route() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/messages" element={<MessagePage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/create" element={<CreatePostType />} />
        <Route path="/create/job" element={<CreateJob />} />
        <Route path="/create/service" element={<CreateService />} />
      </Route>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
      {/* <Route path="/chat/:currentUserId" element={<ChatWindow />} /> */}
    </Routes>
  );
}

export default route;
