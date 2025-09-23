import React, { useState, useEffect } from 'react';
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
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  // Détection de la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Ferme le menu mobile si on passe en desktop
      if (!mobile && isMobileOpen && onMobileClose) {
        onMobileClose();
      }
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen, onMobileClose]);

  // Gestion du toggle interne (pour desktop)
  const handleToggle = () => {
    if (isMobile) {
      // Sur mobile, utilise la prop de fermeture
      if (onMobileClose) {
        onMobileClose();
      }
    } else {
      // Sur desktop, toggle collapse
      setIsCollapsed(!isCollapsed);
    }
  };

  // Fermeture au clic sur un élément du menu (mobile)
  const handleMenuClick = (itemId) => {
    setActiveItem(itemId);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  // Classes conditionnelles
  const sidebarClasses = [
    'sb',
    isCollapsed && !isMobile ? 'sb--col' : '',
    isMobileOpen ? 'sb--mob-open' : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Overlay pour mobile */}
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
                "Fermer le menu" : 
                (isCollapsed ? "Étendre la sidebar" : "Réduire la sidebar")
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
                    onClick={() => handleMenuClick(item.id)}
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

