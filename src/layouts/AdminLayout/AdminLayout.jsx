import React from "react";
import SideBar from "../../components/SideBar/SideBar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar gauche */}
      <SideBar />

      {/* Contenu principal */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
