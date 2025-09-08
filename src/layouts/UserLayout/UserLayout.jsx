import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NavBar from '../../components/Navbar/NavBar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import ScrollToTopButton from '../../components/ScrollToTopButton/ScrollToTopButton.jsx';

import Home from '../../pages/Home/Home.jsx';
import FindJob from '../../pages/FindJob/FindJob.jsx';
import JobDetails from '../../components/JobDetails/JobDetails.jsx';
import ApplicationCompany from '../../components/ApplicationCompany/ApplicationCompany.jsx';
import ApplicationUser from '../../components/ApplicationUser/ApplicationUser.jsx';
import Forum from '../../pages/Forum/Forum.jsx';
import ViewCandidateApplication from "../../components/ViewCandidateApplication/ViewCandidateApplication";
import ViewCandidatePosts from "../../components/ViewCandidatePosts/ViewCandidatePosts";
import ViewCandidateNotification from "../../components/ViewCandidateNotification/ViewCandidateNotification";

import './UserLayout.css';
import Settings from '../../pages/settings/settings.jsx';
import UpdateSettings from '../../components/updatesettings/updatesettings.jsx';
import FullApplication from '../../pages/FullApplication/FullApplication.jsx';

const UserLayout = () => {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="user-layout">
      {/* Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Navbar */}
      <NavBar showSignIn={showSignIn} setShowSignIn={setShowSignIn} />

      {/* Routes utilisateur */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="find-job" element={<FindJob />} />
        <Route path="find-job/details/:id" element={<JobDetails />} />
        <Route path="settings" element={<Settings />} />
        <Route path="update-profile" element={<UpdateSettings />} />
        <Route path="forum" element={<Forum />} />

        {/* Route parent */}
        <Route path="applications" element={<FullApplication />}>
          {/* Enfant 1 */}
          <Route path="company" element={<ApplicationCompany />} />

          {/* Enfant 2 avec sous-enfants */}
          <Route path="user" element={<ApplicationUser />}>
            {/* Route par défaut */}
            <Route index element={<ViewCandidateApplication />} />

            {/* Autres onglets */}
            <Route path="applications" element={<ViewCandidateApplication />} />
            <Route path="posts" element={<ViewCandidatePosts />} />
            <Route path="notifications" element={<ViewCandidateNotification />} />
          </Route>

        </Route>
      </Routes>


      {/* Footer */}
      <Footer />

      {/* Scroll-to-top */}
      <ScrollToTopButton disabled={showSignIn} />
    </div>
  );
};

export default UserLayout;
