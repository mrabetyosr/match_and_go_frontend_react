import React, { useState, useCallback } from "react";
import SideBar from "../../components/SideBar/SideBar";
import NavBarAdmin from "../../components/NavBarAdmin/NavBarAdmin";

import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const handleSidebarToggle = useCallback(() => {
    setSidebarMobileOpen(prev => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarMobileOpen(false);
  }, []);

  return (
    <div className="admin-layout">
      <div className="admin-layout__sidebar">
        <SideBar 
          isMobileOpen={sidebarMobileOpen}
          onMobileClose={handleSidebarClose}
        />
      </div>
      <div className="admin-layout__main">
        <div className="admin-layout__navbar">
          <NavBarAdmin 
            title="Dashboard" 
            userName="John Doe"
            onSidebarToggle={handleSidebarToggle}
          />
        </div>
        <main className="admin-layout__content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;