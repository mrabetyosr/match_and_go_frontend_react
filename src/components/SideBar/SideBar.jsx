import React, { useState } from 'react';
import './SideBar.css';
import { assets } from '../../assets/assets';

const SideBar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', badge: null },
    { id: 'analytics', icon: '📈', label: 'Analytics', badge: null },
    { id: 'projects', icon: '📁', label: 'Projects', badge: '12' },
    { id: 'tasks', icon: '✓', label: 'Tasks', badge: '5' },
    { id: 'team', icon: '👥', label: 'Team', badge: null },
    { id: 'calendar', icon: '📅', label: 'Calendar', badge: null },
    { id: 'messages', icon: '💬', label: 'Messages', badge: '3' },
    { id: 'documents', icon: '📄', label: 'Documents', badge: null },
    { id: 'reports', icon: '📋', label: 'Reports', badge: null },
  ];

  const bottomMenuItems = [
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'help', icon: '❓', label: 'Help & Support' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={assets.namelogo} alt="Logo" className="logo" />
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search..." />
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          {!isCollapsed && <h3 className="section-title">Main Menu</h3>}
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => setActiveItem(item.id)}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        {!isCollapsed && <div className="divider"></div>}
        <ul className="bottom-nav">
          {bottomMenuItems.map((item) => (
            <li key={item.id}>
              <button
                className="nav-item"
                title={isCollapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
        
        {/* User Profile */}
        {!isCollapsed && (
          <div className="user-profile">
            <div className="user-avatar">
              <img src="/api/placeholder/40/40" alt="User" />
            </div>
            <div className="user-info">
              <div className="user-name">John Doe</div>
              <div className="user-role">Administrator</div>
            </div>
            <button className="logout-btn">⏻</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;