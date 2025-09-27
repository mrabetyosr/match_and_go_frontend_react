import React, { useState, useEffect } from 'react';
import './UserDashboard.css';
import StatsCardsUserDash from '../StatsCardsUserDash/StatsCardsUserDash.jsx';
import UsersTableUserDash from '../UsersTableUserDash/UsersTableUserDash.jsx';
import RecentActivityUserDash from '../RecentActivityUserDash/RecentActivityUserDash.jsx';
import DashboardControlsUserDash from '../DashboardControlsUserDash/DashboardControlsUserDash.jsx';
import UserDetailsModalUserDash from '../UserDetailsModalUserDash/UserDetailsModalUserDash.jsx';

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUserStats();
    fetchUsers();
    fetchRecentActivity();
  }, [currentPage, filters]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7001/api/users/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams({
      page: currentPage,
      limit: 2, // ← Changez de 10 à 2
      role: filters.role !== 'all' ? filters.role : '',
      status: filters.status !== 'all' ? filters.status : '',
      search: filters.search
    });

    const response = await fetch(`http://localhost:7001/api/users/all?${queryParams}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setUsers(data.users || []);
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    setLoading(false);
  }
};

  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7001/api/users/activity', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRecentActivity(data.activities || []);
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:7001/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: newStatus })
      });
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:7001/api/users/bulk-actions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          action: action
        })
      });
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const getUserDetails = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7001/api/users/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSelectedUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'candidate': return '#3B82F6';
      case 'company': return '#10B981';
      case 'admin': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? '#10B981' : '#EF4444';
  };

  return (
    <div className="user-dashboard">
      {/* Header Stats Cards */}
      <StatsCardsUserDash stats={stats} />

      {/* Filters and Actions */}
      <DashboardControlsUserDash 
        filters={filters}
        setFilters={setFilters}
        fetchUsers={fetchUsers}
        selectedUsers={selectedUsers}
        handleBulkAction={handleBulkAction}
      />

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Users Table */}
        <UsersTableUserDash
          users={users}
          loading={loading}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          formatDate={formatDate}
          getRoleColor={getRoleColor}
          getStatusColor={getStatusColor}
          getUserDetails={getUserDetails}
          updateUserStatus={updateUserStatus}
        />

        {/* Recent Activity Sidebar */}
        <RecentActivityUserDash 
          recentActivity={recentActivity}
          formatDate={formatDate}
        />
      </div>

      {/* User Details Modal */}
      <UserDetailsModalUserDash
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        formatDate={formatDate}
        getRoleColor={getRoleColor}
        getStatusColor={getStatusColor}
        updateUserStatus={updateUserStatus}
      />
    </div>
  );
};

export default UserDashboard;