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
import logo from '../../assets/namebacklogo.png';
import './SideBar.css';

const SideBar = ({ isMobileOpen = false, onMobileClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/Admin/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/Admin/analytics' },
    { id: 'users', label: 'Users', icon: Users, path: '/Admin/users' },
    { id: 'documents', label: 'Documents', icon: FileText, path: '/Admin/documents' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/Admin/calendar' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/Admin/notifications' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/Admin/settings' },
  ];

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
      
      // Close mobile menu when switching to desktop
      if (!mobile && isMobileOpen && onMobileClose) {
        onMobileClose();
      }
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen, onMobileClose]);

  // Internal toggle management (for desktop)
  const handleToggle = () => {
    if (isMobile) {
      // On mobile, use close prop
      if (onMobileClose) {
        onMobileClose();
      }
    } else {
      // On desktop, toggle collapse
      setIsCollapsed(!isCollapsed);
    }
  };

  // Navigate to corresponding page
  const handleMenuClick = (item) => {
    navigate(item.path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  // Conditional classes
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

        {/* User Profile */}
        {(!isCollapsed || isMobile) && (
          <div className="sb__usr">
            <div className="sb__usr-prf">
              <div className="sb__avt">
                <span>JD</span>
              </div>
              <div className="sb__usr-info">
                <p className="sb__usr-name">John Doe</p>
                <p className="sb__usr-email">john.doe@example.com</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed User Profile */}
        {isCollapsed && !isMobile && (
          <div className="sb__usr sb__usr--col">
            <div className="sb__avt sb__avt--sm">
              <span>JD</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SideBar;