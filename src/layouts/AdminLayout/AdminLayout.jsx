// AdminLayout.jsx
import React, { useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SideBar from "../../components/SideBar/SideBar";
import NavBarAdmin from "../../components/NavBarAdmin/NavBarAdmin";
import UserDashboard from "../../components/UserDashboard/UserDashboard"; // <-- ta page


import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const handleSidebarToggle = useCallback(() => {
    setSidebarMobileOpen(prev => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarMobileOpen(false);
  }, []);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-layout__sidebar">
        <SideBar 
          isMobileOpen={sidebarMobileOpen}
          onMobileClose={handleSidebarClose}
        />
      </div>

      {/* Main content */}
      <div className="admin-layout__main">
        <div className="admin-layout__navbar">
          <NavBarAdmin 
            title="Dashboard" 
            userName="John Doe"
            onSidebarToggle={handleSidebarToggle}
          />
        </div>

        <main className="admin-layout__content">
          <Routes>
            {/* Redirection si on va sur /admin */}
            <Route path="/" element={<Navigate to="dashboard" />} />
            
            {/* Routes internes */}
            <Route path="dashboard" element={<UserDashboard />} />
         
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
