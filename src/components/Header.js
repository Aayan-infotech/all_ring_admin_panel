
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/auth';
import { PersonCircle } from 'react-bootstrap-icons';

const Header = ({ toggleSidebar, sidebarCollapsed }) => {
  const navigate = useNavigate();
  const userEmail = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-header">
      <button className="menu-toggle" onClick={toggleSidebar}>
        {sidebarCollapsed ? '☰' : '✕'}
      </button>
      <div style={{ flex: 1 }}></div>
      <div className="user-profile">
        <PersonCircle size={24} color="var(--primary)" />
        <span>{userEmail}</span>
        <button 
          onClick={handleLogout}
          style={{
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
            marginLeft: '10px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;



