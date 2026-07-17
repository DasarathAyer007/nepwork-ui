// import ChatWindow from '@/pages/ChatWindow.tsx';
import UserDashboard from '@/layouts/UserDashboard.tsx';
import CreateJob from '@/pages/CreateJob.tsx';
import CreateService from '@/pages/CreateService.tsx';
import JobApplicationPage from '@/pages/JobApplicationPage.tsx';
import MessagePage from '@/pages/MessagePage.tsx';
import SavedJobs from '@/pages/SavedJobs.tsx';
import ServiceApplyPage from '@/pages/ServiceApplyPage';
import ServiceDetailsPage from '@/pages/ServiceDetailsPage.tsx';
import Services from '@/pages/Services.tsx';
import JobApplicationsList from '@/pages/dashboard/JobApplicationsList.tsx';
import ManageApplicationDetails from '@/pages/dashboard/ManageApplicationDetails.tsx';
import ManageJobApplicationDetails from '@/pages/dashboard/ManageJobApplicationDetails.tsx';
import ManageJobDetails from '@/pages/dashboard/ManageJobDetails.tsx';
import ManageMyRequestDetails from '@/pages/dashboard/ManageMyRequestDetails.tsx';
import ManageRequestReceivedDetails from '@/pages/dashboard/ManageRequestReceivedDetails.tsx';
import ManageServiceDetails from '@/pages/dashboard/ManageServiceDetails.tsx';
import DashboardMyApplications from '@/pages/dashboard/MyApplications.tsx';
import DashboardMyJobs from '@/pages/dashboard/MyJobs.tsx';
import DashboardMyRequests from '@/pages/dashboard/MyRequests.tsx';
import DashboardMyServices from '@/pages/dashboard/MyServices.tsx';
import DashboardOverview from '@/pages/dashboard/Overview.tsx';
import DashboardRequestsReceived from '@/pages/dashboard/RequestsReceived.tsx';
import ServiceRequestsList from '@/pages/dashboard/ServiceRequestsList.tsx';
import { Route, Routes } from 'react-router-dom';

import MainLayout from '../layouts/User/MainLayout';
import CreatePostType from '../pages/ChoosePostType';
import Home from '../pages/Home';
import JobDetailsPage from '../pages/JobDetailsPage.tsx';
import Jobs from '../pages/Jobs.tsx';
import LogIn from '../pages/LogIn';
import NotFoundPage from '../pages/NotFoundPage.tsx';
import Onboarding from '../pages/Onboarding';
import Profile from '../pages/Profile';
import SignUp from '../pages/SignUp';
import SignUpOTP from '../pages/SignUpOTP';

function route() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetailsPage />} />
        <Route path="jobs/:id/apply" element={<JobApplicationPage />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/messages" element={<MessagePage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/create" element={<CreatePostType />} />
        <Route path="/create/job" element={<CreateJob />} />
        <Route path="/create/service" element={<CreateService />} />
        <Route path="/services/create" element={<CreateService />} />
        <Route path="/services/:id" element={<ServiceDetailsPage />} />
        <Route path="/services/:id/apply" element={<ServiceApplyPage />} />
      </Route>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-otp" element={<SignUpOTP />} />
      <Route path="/login" element={<LogIn />} />

      <Route path="/dashboard" element={<UserDashboard />}>
        <Route index element={<DashboardOverview />} />
        <Route path="jobs" element={<DashboardMyJobs />} />
        <Route path="jobs/:id" element={<ManageJobDetails />} />
        <Route path="jobs/:id/applications" element={<JobApplicationsList />} />
        <Route
          path="jobs/:id/applications/:applicationId"
          element={<ManageJobApplicationDetails />}
        />
        <Route path="my-applications" element={<DashboardMyApplications />} />
        <Route
          path="my-applications/:id"
          element={<ManageApplicationDetails />}
        />
        <Route path="services" element={<DashboardMyServices />} />
        <Route path="services/:id" element={<ManageServiceDetails />} />
        <Route path="services/:id/requests" element={<ServiceRequestsList />} />
        <Route
          path="requests-received"
          element={<DashboardRequestsReceived />}
        />
        <Route
          path="requests-received/:id"
          element={<ManageRequestReceivedDetails />}
        />
        <Route path="my-requests" element={<DashboardMyRequests />} />
        <Route path="my-requests/:id" element={<ManageMyRequestDetails />} />
      </Route>
      {/* <Route path="/chat/:currentUserId" element={<ChatWindow />} /> */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default route;