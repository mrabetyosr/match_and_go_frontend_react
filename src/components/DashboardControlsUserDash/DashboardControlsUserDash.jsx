import React from 'react';
import './DashboardControlsUserDash.css';

const DashboardControlsUserDash = ({ filters, setFilters, fetchUsers, selectedUsers, handleBulkAction }) => {
  return (
    <div className="dashboard-controls-userdash">
      <div className="filters-section-userdash">
        <div className="search-box-userdash">
          <input
            type="text"
            placeholder="Search by name, email..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
          <button onClick={fetchUsers}>🔍</button>
        </div>

        <select 
          value={filters.role} 
          onChange={(e) => setFilters({...filters, role: e.target.value})}
        >
          <option value="all">All Roles</option>
          <option value="candidate">Candidates</option>
          <option value="company">Companies</option>
          <option value="admin">Admins</option>
        </select>

        <select 
          value={filters.status} 
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {selectedUsers.length > 0 && (
        <div className="bulk-actions-userdash">
          <span>{selectedUsers.length} user(s) selected</span>
          <button onClick={() => handleBulkAction('activate')} className="btn-activate-userdash">
            Activate
          </button>
          <button onClick={() => handleBulkAction('deactivate')} className="btn-deactivate-userdash">
            Deactivate
          </button>
          <button onClick={() => handleBulkAction('delete')} className="btn-delete-userdash">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardControlsUserDash;