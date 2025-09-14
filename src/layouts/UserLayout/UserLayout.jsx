import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

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

import Settings from '../../pages/settings/settings.jsx';
import UpdateSettings from '../../components/updatesettings/updatesettings.jsx';
import FullApplication from '../../pages/FullApplication/FullApplication.jsx';
import ApplicationsSubmissions from '../../components/ApplicationsSubmissions/ApplicationsSubmissions.jsx';

import RatingApp from "../../components/RatingApp/RatingApp.jsx"; // ✅ import ton rating
import './UserLayout.css';

const UserLayout = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const token = localStorage.getItem("token");

  // Charger user depuis ton backend
  useEffect(() => {
    if (token) {
      axios.get("http://localhost:7001/api/users/getuserrate", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setUserInfo(res.data))
        .catch(err => console.error(err));
    }
  }, [token]);

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
          <Route path="company" element={<ApplicationCompany />} />
          <Route path="user" element={<ApplicationUser />}>
            <Route index element={<ViewCandidateApplication />} />
            <Route path="applications" element={<ViewCandidateApplication />} />
            <Route path="posts" element={<ViewCandidatePosts />} />
            <Route path="notifications" element={<ViewCandidateNotification />} />
          </Route>
        </Route>

        {/* Candidatures pour une offre */}
        <Route path="offer/:offerId/applications" element={<ApplicationsSubmissions />} />
      </Routes>

      {/* Footer */}
      <Footer />

      {/* Scroll-to-top */}
      <ScrollToTopButton disabled={showSignIn} />

      {/* Inside your UserLayout return */}
      {userInfo && !userInfo.hasRatedApp && userInfo.loginCount >= 5 && (
        <RatingApp userInfo={userInfo} setUserInfo={setUserInfo} />
      )}
    </div>
  );
};

export default UserLayout;
