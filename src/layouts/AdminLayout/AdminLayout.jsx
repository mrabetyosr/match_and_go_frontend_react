import React from "react";


const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar gauche */}
      

      {/* Contenu principal */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
