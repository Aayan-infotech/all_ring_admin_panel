import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/auth';
import { PersonCircle, List } from 'react-bootstrap-icons';

const Header = ({ toggleSidebar, sidebarCollapsed, toggleMobileSidebar }) => {
  const navigate = useNavigate();
  const userEmail = getCurrentUser();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const openConfirm = () => setShowLogoutConfirm(true);
  const closeConfirm = () => setShowLogoutConfirm(false);

  const handleLogout = () => {
    localStorage.clear();     
    logout();                 
    navigate('/login');        
  };

  return (
    <>
      <header className="admin-header">
       
        <button onClick={toggleSidebar} className="desktop-toggle" aria-label="Toggle menu">
          <List size={20} />
        </button>

        {/* Mobile toggle button */}
        <button onClick={toggleMobileSidebar} className="mobile-toggle" aria-label="Open menu">
          <List size={20} />
        </button>

        <div className="header-spacer" />

        <div className="user-profile">
          <PersonCircle size={28} className="user-icon" />
          <span className="user-email">{userEmail}</span>
          <button onClick={openConfirm} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      {showLogoutConfirm && (
        <div className="modal-backdrop">
          <div className="modal-box ">
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button onClick={closeConfirm} className="cancel-button">Cancel</button>
              <button onClick={handleLogout} className="confirm-button">Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
