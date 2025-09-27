import React from 'react';
import './UsersTableUserDash.css';
const UsersTableUserDash = ({
  users,
  loading,
  selectedUsers,
  setSelectedUsers,
  currentPage,
  setCurrentPage,
  formatDate,
  getRoleColor,
  getStatusColor,
  getUserDetails,
  updateUserStatus
}) => {
  return (
    <div className="users-section">
      <div className="section-header">
        <h2>User Management</h2>
        <div className="header-actions">
          <button className="export-btn">📊 Export</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="users-table-container">
          {users.length === 0 ? (
            <div className="no-users-message">
              <p>No users found</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(users.map(u => u._id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserTableRowUserDash
                    key={user._id}
                    user={user}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    formatDate={formatDate}
                    getRoleColor={getRoleColor}
                    getStatusColor={getStatusColor}
                    getUserDetails={getUserDetails}
                    updateUserStatus={updateUserStatus}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <PaginationUserDash currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

const UserTableRowUserDash = ({
  user,
  selectedUsers,
  setSelectedUsers,
  formatDate,
  getRoleColor,
  getStatusColor,
  getUserDetails,
  updateUserStatus
}) => {
  return (
    <tr key={user._id}>
      <td>
        <input 
          type="checkbox" 
          checked={selectedUsers.includes(user._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers([...selectedUsers, user._id]);
            } else {
              setSelectedUsers(selectedUsers.filter(id => id !== user._id));
            }
          }}
        />
      </td>
      <td>
        <div className="user-info">
          <img 
            src={`http://localhost:7001/images/${user.image_User}`} 
            alt={user.username}
            className="user-avatar"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/40x40?text=U';
            }}
          />
          <div>
            <div className="user-name">{user.username}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </div>
      </td>
      <td>
        <span 
          className="role-badge" 
          style={{ backgroundColor: getRoleColor(user.role) }}
        >
          {user.role}
        </span>
      </td>
      <td>
        <span 
          className="status-badge" 
          style={{ color: getStatusColor(user.isActive) }}
        >
          {user.isActive ? '✅ Active' : '❌ Inactive'}
        </span>
      </td>
      <td>{formatDate(user.createdAt)}</td>
      
      <td>
        <div className="action-buttons">
          <button 
            onClick={() => getUserDetails(user._id)}
            className="btn-view"
            title="View details"
          >
            👁️
          </button>
          <button 
            onClick={() => updateUserStatus(user._id, !user.isActive)}
            className={user.isActive ? 'btn-deactivate' : 'btn-activate'}
            title={user.isActive ? 'Deactivate' : 'Activate'}
          >
            {user.isActive ? '🚫' : '✅'}
          </button>
        </div>
      </td>
    </tr>
  );
};

const PaginationUserDash = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="pagination">
      <button 
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        Previous
      </button>
      <span className="page-info">Page {currentPage}</span>
      <button 
        onClick={() => setCurrentPage(prev => prev + 1)}
        className="pagination-btn"
      >
        Next
      </button>
    </div>
  );
};

export default UsersTableUserDash;