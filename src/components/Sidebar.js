import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PeopleFill, 
  PersonCheckFill, 
  PersonLinesFill, 
  DatabaseFill,
  HouseFill
} from 'react-bootstrap-icons';

const Sidebar = ({ collapsed }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboard",
      icon: <HouseFill />,
      label: "Dashboard"
    },
    {
      path: "/users",
      icon: <PeopleFill />,
      label: "User Management"
    },
    {
      path: "/mentors",
      icon: <PersonCheckFill />,
      label: "Mentor Management"
    },
    {
      path: "/instructors",
      icon: <PersonLinesFill />,
      label: "Instructor Management"
    },
    {
      path: "/data",
      icon: <DatabaseFill />,
      label: "Data Management"
    }
  ];

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        {collapsed ? (
          <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>AB</span>
        ) : (
          <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Admin Panel</span>
        )}
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;