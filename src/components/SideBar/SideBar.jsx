import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Calendar,
  Bell,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';
import { LiaAddressCardSolid } from "react-icons/lia";
import logo from '../../assets/namebacklogo.png';
import './SideBar.css';

const SideBar = ({ isMobileOpen = false, onMobileClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/Admin/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/Admin/analytics' },
    { id: 'users', label: 'Users', icon: Users, path: '/Admin/users' },
    { id: 'details', label: 'Details', icon: LiaAddressCardSolid , path: '/Admin/details' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/Admin/calendar' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/Admin/notifications' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/Admin/settings' },
  ];

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await fetch("http://localhost:7001/api/users/me", { 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Get user initials
  const getUserInitials = (username) => {
    if (!username) return 'U';
    const names = username.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  // Detect active element based on URL
  const getActiveItem = () => {
    const currentPath = location.pathname;
    const activeMenuItem = menuItems.find(item => item.path === currentPath);
    return activeMenuItem ? activeMenuItem.id : 'dashboard';
  };

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (!mobile && isMobileOpen && onMobileClose) {
        onMobileClose();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen, onMobileClose]);

  const handleToggle = () => {
    if (isMobile) {
      if (onMobileClose) {
        onMobileClose();
      }
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleMenuClick = (item) => {
    navigate(item.path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const sidebarClasses = [
    'sb',
    isCollapsed && !isMobile ? 'sb--col' : '',
    isMobileOpen ? 'sb--mob-open' : ''
  ].filter(Boolean).join(' ');

  const activeItem = getActiveItem();

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="sb__overlay sb__overlay--visible"
          onClick={onMobileClose}
        />
      )}
      
      <div className={sidebarClasses}>
        {/* Header */}
        <div className="sb__hdr">
          <div className="sb__hdr-cnt">
            {(!isCollapsed || isMobile) && (
              <div className="sb__logo">
                <img src={logo} alt="App Logo" className="sb__logo-img" />
              </div>
            )}
            <button
              onClick={handleToggle}
              className="sb__tgl"
              aria-label={isMobile ? 
                "Close menu" : 
                (isCollapsed ? "Expand sidebar" : "Collapse sidebar")
              }
            >
              {isMobile ? 
                <X size={20} /> :
                (isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />)
              }
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sb__nav">
          <ul className="sb__menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id} className="sb__mi">
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`sb__btn ${isActive ? 'sb__btn--act' : ''}`}
                    aria-label={item.label}
                  >
                    <Icon
                      size={20}
                      className={`sb__ico ${isCollapsed && !isMobile ? 'sb__ico--ctr' : ''}`}
                    />
                    {(!isCollapsed || isMobile) && (
                      <span className="sb__lbl">
                        {item.label}
                      </span>
                    )}
                    {(!isCollapsed || isMobile) && isActive && (
                      <div className="sb__ind"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile - Expanded */}
        {(!isCollapsed || isMobile) && !loading && currentUser && (
          <div className="sb__usr">
            <div className="sb__usr-prf">
              <div className="sb__avt">
                {currentUser.image_User ? (
                  <img 
                    src={currentUser.image_User} 
                    alt={currentUser.username}
                    className="sb__avt-img"
                  />
                ) : (
                  <span>{getUserInitials(currentUser.username)}</span>
                )}
              </div>
              <div className="sb__usr-info">
                <p className="sb__usr-name">{currentUser.username}</p>
                <p className="sb__usr-email">{currentUser.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* User Profile - Collapsed */}
        {isCollapsed && !isMobile && !loading && currentUser && (
          <div className="sb__usr sb__usr--col">
            <div className="sb__avt sb__avt--sm">
              {currentUser.image_User ? (
                <img 
                  src={currentUser.image_User} 
                  alt={currentUser.username}
                  className="sb__avt-img"
                />
              ) : (
                <span>{getUserInitials(currentUser.username)}</span>
              )}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (!isCollapsed || isMobile) && (
          <div className="sb__usr">
            <div className="sb__usr-prf">
              <div className="sb__avt sb__avt--loading"></div>
              <div className="sb__usr-info">
                <p className="sb__usr-name">Loading...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SideBar;