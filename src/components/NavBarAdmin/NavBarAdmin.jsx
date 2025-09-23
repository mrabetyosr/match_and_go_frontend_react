import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  ChevronDown,
  Mail,
  LogOut,
  UserCircle,
  Menu
} from 'lucide-react';
import './NavBarAdmin.css';

const NavBarAdmin = ({ title = "Dashboard", userName = "John Doe", onSidebarToggle }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const notifications = [
    { id: 1, text: "Nouveau utilisateur inscrit", time: "Il y a 5 min", unread: true },
    { id: 2, text: "Rapport mensuel disponible", time: "Il y a 1h", unread: true },
    { id: 3, text: "Mise à jour système", time: "Il y a 2h", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Détection de la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fermeture des dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileOpen(false);
      setIsNotificationOpen(false);
    };

    if (isProfileOpen || isNotificationOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isProfileOpen, isNotificationOpen]);

  return (
    <>
      {/* Overlay pour mobile */}
      {isMobile && (isProfileOpen || isNotificationOpen) && (
        <div 
          className="hdr-db__overlay"
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
      
      <header className="hdr-db">
        <div className="hdr-db__cnt">
          {/* Left Section - Title avec bouton sidebar mobile */}
          <div className="hdr-db__left">
            <div className="hdr-db__left-content">
              {/* Bouton sidebar pour mobile */}
              {isMobile && (
                <button
                  className="hdr-db__sb-btn"
                  onClick={onSidebarToggle}
                  aria-label="Ouvrir le menu"
                >
                  <Menu size={20} />
                </button>
              )}
              
              <div className="hdr-db__ttl-wrp">
                <h1 className="hdr-db__ttl">{title}</h1>
                <p className="hdr-db__sub">
                  Bienvenue sur votre tableau de bord
                </p>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hdr-db__ctr">
            <div className="hdr-db__srch">
              <Search className="hdr-db__srch-ico" size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                className="hdr-db__srch-inp"
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="hdr-db__rgt">
            {/* Notifications */}
            <div className="hdr-db__ntf-wrp">
              <button
                className="hdr-db__ico-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsProfileOpen(false);
                }}
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="hdr-db__bdg">{unreadCount}</span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="hdr-db__drp hdr-db__ntfs" onClick={(e) => e.stopPropagation()}>
                  <div className="hdr-db__drp-hdr">
                    <h3>Notifications</h3>
                    <span className="hdr-db__bdg-sm">{unreadCount}</span>
                  </div>
                  <div className="hdr-db__ntf-lst">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`hdr-db__ntf-itm ${
                          notification.unread ? 'hdr-db__ntf-itm--unr' : ''
                        }`}
                      >
                        <p className="hdr-db__ntf-txt">
                          {notification.text}
                        </p>
                        <span className="hdr-db__ntf-tm">
                          {notification.time}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="hdr-db__drp-ftr">
                    <button className="hdr-db__vw-all">
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button className="hdr-db__ico-btn" aria-label="Paramètres">
              <Settings size={20} />
            </button>

            {/* User Profile */}
            <div className="hdr-db__prf-wrp">
              <button
                className="hdr-db__prf-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationOpen(false);
                }}
                aria-label="Profil utilisateur"
              >
                <div className="hdr-db__prf-avt">
                  <span>JD</span>
                </div>
                <div className="hdr-db__prf-info">
                  <span className="hdr-db__prf-name">{userName}</span>
                  <span className="hdr-db__prf-role">Admin</span>
                </div>
                <ChevronDown size={16} className="hdr-db__prf-arr" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="hdr-db__drp hdr-db__prf-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="hdr-db__prf-hdr">
                    <div className="hdr-db__prf-avt-lg">
                      <span>JD</span>
                    </div>
                    <div>
                      <p className="hdr-db__prf-name-lg">{userName}</p>
                      <p className="hdr-db__prf-email">john.doe@example.com</p>
                    </div>
                  </div>
                  <div className="hdr-db__prf-menu-itms">
                    <button className="hdr-db__menu-itm">
                      <UserCircle size={16} />
                      <span>Mon profil</span>
                    </button>
                    <button className="hdr-db__menu-itm">
                      <Mail size={16} />
                      <span>Messages</span>
                    </button>
                    <button className="hdr-db__menu-itm">
                      <Settings size={16} />
                      <span>Paramètres</span>
                    </button>
                    <hr className="hdr-db__menu-div" />
                    <button className="hdr-db__menu-itm hdr-db__menu-itm--dgr">
                      <LogOut size={16} />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavBarAdmin;

