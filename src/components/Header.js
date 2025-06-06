
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { logout, getCurrentUser } from '../services/auth';
// import { PersonCircle } from 'react-bootstrap-icons';

// const Header = ({ toggleSidebar, sidebarCollapsed }) => {
//   const navigate = useNavigate();
//   const userEmail = getCurrentUser();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div className="admin-header">
//       <button className="menu-toggle" onClick={toggleSidebar}>
//         {sidebarCollapsed ? '☰' : '✕'}
//       </button>
//       <div style={{ flex: 1 }}></div>
//       <div className="user-profile">
//         <PersonCircle size={24} color="var(--primary)" />
//         <span>{userEmail}</span>
//         <button 
//           onClick={handleLogout}
//           style={{
//             background: 'var(--primary)',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             padding: '5px 10px',
//             marginLeft: '10px',
//             cursor: 'pointer'
//           }}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Header;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/auth';
import { PersonCircle } from 'react-bootstrap-icons';

const Header = ({ toggleSidebar, sidebarCollapsed }) => {
  const navigate = useNavigate();
  const userEmail = getCurrentUser();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const openConfirm = () => setShowLogoutConfirm(true);
  const closeConfirm = () => setShowLogoutConfirm(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header style={styles.header}>
        <button onClick={toggleSidebar} style={styles.menuButton} aria-label="Toggle menu">
          {sidebarCollapsed ? '☰' : '✕'}
        </button>

        <div style={{ flex: 1 }} />

        <div style={styles.userProfile}>
          <PersonCircle size={28} color='var(--primary)' />
          <span style={styles.email}>{userEmail}</span>
          <button
            onClick={openConfirm}
            style={styles.logoutButton}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </header>

      {showLogoutConfirm && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <p style={{ fontSize: 18, marginBottom: 20 }}>
              Are you sure you want to logout?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={closeConfirm} style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleLogout} style={styles.confirmButton}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  menuButton: {
    fontSize: 24,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#0d6efd',
    padding: '6px 12px',
    borderRadius: 6,
    transition: 'background-color 0.3s ease',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  email: {
    fontWeight: 600,
    color: '#212529',
    fontSize: 16,
    maxWidth: 200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutButton: {
      background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
            marginLeft: '10px',
            cursor: 'pointer'
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1500,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    maxWidth: 400,
    width: '90%',
  },
  cancelButton: {
    padding: '8px 16px',
    borderRadius: 6,
    border: '1px solid #6c757d',
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  confirmButton: {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Header;

