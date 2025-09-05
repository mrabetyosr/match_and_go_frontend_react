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
import Application from '../../pages/application/Application.jsx';

import './UserLayout.css';
import  Settings  from '../../pages/settings/settings.jsx';
import UpdateSettings from '../../components/updatesettings/updatesettings.jsx';

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
        <Route path="/find-job" element={<FindJob />} />
        <Route path="/find-job/details/:id" element={<JobDetails />} />
        <Route path="/applications" element={<Application />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/update-profile" element={<UpdateSettings />} />


      </Routes>

      {/* Footer */}
      <Footer />

      {/* Scroll-to-top */}
      <ScrollToTopButton disabled={showSignIn} />
    </div>
  );
};

export default UserLayout;
