import React from 'react';
import NavBar from './components/Navbar/NavBar.jsx';
import './App.css'; // Assuming you have a CSS file for styling
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';

const App = () => {
  return (
    <div className='app'>
      <NavBar></NavBar>
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
      
    </div>
  );
};

export default App;
