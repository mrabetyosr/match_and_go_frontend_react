import React from 'react';
import NavBar from './components/Navbar/NavBar.jsx';
import './App.css'; // Assuming you have a CSS file for styling
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Footer from './components/Footer/Footer.jsx';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton.jsx';
import FindJob from './pages/FindJob/FindJob.jsx';
import JobDetails from './components/JobDetails/JobDetails.jsx';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Application from './pages/Application/Application.jsx';








const App = () => {
      const [showSignIn, setShowSignIn] = useState(false);
  return (
    <div className='app'>
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
<NavBar showSignIn={showSignIn} setShowSignIn={setShowSignIn} />     
 <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/find-job' element={<FindJob />}/>
        <Route path="/find-job/details/:id" element={<JobDetails />} />
        <Route path="/applications" element={<Application />} />
          
          
        


      </Routes>
      <Footer></Footer>
      <ScrollToTopButton disabled={showSignIn} />
      
    </div>
  );
};

export default App;
