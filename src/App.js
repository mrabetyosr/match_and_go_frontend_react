import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLayout from './layouts/UserLayout/UserLayout';
import AdminLayout from './layouts/AdminLayout/AdminLayout'; // import AdminLayout
import './App.css';

const App = () => {
  return (
    <Routes>
      {/* Routes utilisateur */}
      <Route path="/*" element={<UserLayout />} />

      {/* Routes admin */}
      <Route path="/admin/*" element={<AdminLayout />} />
    </Routes>
  );
};

export default App;
