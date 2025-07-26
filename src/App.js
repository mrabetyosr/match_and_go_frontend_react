import React from 'react';
import NavBar from './components/Navbar/NavBar.jsx';
import './App.css'; // Assuming you have a CSS file for styling
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Footer from './components/Footer/Footer.jsx';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton.jsx';
import { useState } from 'react';


const App = () => {
      const [showSignIn, setShowSignIn] = useState(false);
  return (
    <div className='app'>
<NavBar showSignIn={showSignIn} setShowSignIn={setShowSignIn} />      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
      <Footer></Footer>
      <ScrollToTopButton disabled={showSignIn} />
      
    </div>
  );
};

export default App;
