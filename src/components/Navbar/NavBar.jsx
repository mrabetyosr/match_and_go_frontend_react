import React, { useState, useEffect } from 'react';
import './NavBar.css';
import SignIn from '../SignIn/SignIn.jsx';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { Settings, LogOut, User } from "lucide-react";
import 'react-toastify/dist/ReactToastify.css';

const NavBar = ({ showSignIn, setShowSignIn }) => {
  const [menu, setMenu] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ nouvel état

  // Vérifier le token et récupérer l'utilisateur
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:7001/api/users/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setUser(data);
          setIsLoggedIn(true);
        })
        .catch(err => {
          console.error("Erreur fetch user:", err);
          setIsLoggedIn(false);
          setUser(null);
        })
        .finally(() => setLoading(false)); // ✅ fin du chargement
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setLoading(false); // ✅ pas de token = pas de chargement
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = showSignIn ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSignIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
  };

  const handleProtectedClick = (e, path, menuName) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowSignIn(true);
    } else {
      setMenu(menuName);
    }
  };

  return (
    <>
      <div className='navbar'>
        <img src={assets.namelogo} alt="Logo" className="logo" />
        <ul className='navbar-menu'>
          <Link to="/">
            <li
              onClick={() => setMenu("home")}
              className={menu === "home" ? "active" : ""}
            >
              Home
            </li>
          </Link>

          <Link to="/find-job">
            <li
              onClick={() => setMenu("find-a-job")}
              className={menu === "find-a-job" ? "active" : ""}
            >
              Find a job
            </li>
          </Link>

          <Link to="/forum" onClick={(e) => handleProtectedClick(e, "/forum", "forum")}>
            <li className={menu === "forum" ? "active" : ""}>
              Forum
            </li>
          </Link>
        </ul>

        <div className="navbar-right">
          <ul className='navbar-right-menu'>
            <Link to="/applications" onClick={(e) => handleProtectedClick(e, "/applications", "applications")}>
              <li className={menu === "applications" ? "active" : ""}>
                Applications
              </li>
            </Link>

            <li className="user-dropdown">
              {loading ? ( // ✅ pendant le chargement
                <span className="loading-text">Loading...</span>
              ) : isLoggedIn && user ? ( // ✅ une fois chargé
                <div className="dropdown">
                  <button
                    className="dropdown-btn"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <User size={16} /> {user.username}
                  </button>
                  {dropdownOpen && (
                    <ul className="dropdown-menu">
                      <li onClick={() => setDropdownOpen(false)}>
                        <Link to="/settings" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <Settings size={16} /> Profile
                        </Link>
                      </li>
                      <li onClick={handleLogout}>
                        <LogOut size={16} /> Logout
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <button className="signin-btn" onClick={() => setShowSignIn(true)}>Sign in</button>
              )}
            </li>
          </ul>
        </div>
      </div>

      {showSignIn && (
        <div className="modal-overlay" onClick={() => setShowSignIn(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <SignIn
              onClose={async (loggedIn) => {
                setShowSignIn(false);
                if (loggedIn) {
                  setIsLoggedIn(true);
                  const token = localStorage.getItem("token");
                  if (token) {
                    try {
                      const res = await fetch("http://localhost:7001/api/users/me", {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      const data = await res.json();
                      setUser(data); // ✅ met à jour immédiatement le user
                    } catch (err) {
                      console.error("Erreur lors du fetch après login:", err);
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}

    </>
  );
};

export default NavBar;
