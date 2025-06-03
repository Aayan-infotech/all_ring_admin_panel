import React, { useEffect, useState } from 'react';
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
  const [activeModule, setActiveModule] = useState('dashboard');

  useEffect(() => {
    const savedModule = localStorage.getItem('activeModule');
    if (savedModule) setActiveModule(savedModule);
  }, [location.pathname]); // update on route change

  const baseMenu = [
    {
      path: "/dashboard",
      icon: <HouseFill />,
      label: "Dashboard"
    }
  ];

  const subMenus = {
    users: [
      { path: "/users", icon: <PeopleFill />, label: "All Users" },
      { path: "/users/add", icon: <PeopleFill />, label: "Add User" },
    ],
    mentors: [
      { path: "/mentors", icon: <PersonCheckFill />, label: "All Mentors" },
      { path: "/mentors/add", icon: <PersonCheckFill />, label: "Add Mentor" },
    ],
    instructors: [
      { path: "/instructors", icon: <PersonLinesFill />, label: "All Instructors" },
      { path: "/instructors/add", icon: <PersonLinesFill />, label: "Add Instructor" },
    ],
    data: [
      { path: "/data", icon: <DatabaseFill />, label: "All Data" },
      { path: "/data/upload", icon: <DatabaseFill />, label: "Upload Data" },
    ]
  };

  const menuItems = [
    ...baseMenu,
    ...(subMenus[activeModule] || [])
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
