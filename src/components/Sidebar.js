import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  PeopleFill, 
  PersonCheckFill, 
  PersonLinesFill, 
  DatabaseFill,
  ClipboardCheckFill ,
  JournalBookmarkFill ,
  HouseFill,
  ChevronLeft,
  FileEarmarkPlayFill,
  ChevronRight
} from 'react-bootstrap-icons';

const Sidebar = ({ collapsed, mobileVisible, onMobileClose,setSidebarCollapsed  }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('');

  // On route change, auto-detect module
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/users')) {
      setActiveModule('users');
    } else if (path.startsWith('/mentors')) {
      setActiveModule('mentors');
    } else if (path.startsWith('/instructors')) {
      setActiveModule('instructors');
    } else if (path.startsWith('/data')) {
      setActiveModule('data');
    } else if (path === '/dashboard') {
      setActiveModule('dashboard');
    }
  }, [location.pathname]);

  const baseMenu = [
    {
      path: "/dashboard",
      icon: <HouseFill />,
      label: "Dashboard"
    }
  ];

  const moduleCards = [
    { module: 'users', icon: <PeopleFill />, label: 'User Management' },
    { module: 'mentors', icon: <PersonCheckFill />, label: 'Mentor Management' },
    { module: 'instructors', icon: <PersonLinesFill />, label: 'Instructor Management' },
    { module: 'data', icon: <DatabaseFill />, label: 'Data Management' },
  ];

  const subMenus = {
    users: [
      { path: "/users", icon: <PeopleFill />, label: "All Users" },
      // { path: "/users/add", icon: <PeopleFill />, label: "Add User" },
    ],
    mentors: [
      { path: "/mentors", icon: <PersonCheckFill />, label: "All Mentors" },
      { path: "/assignmentorteam", icon: <PersonCheckFill />, label: "Assign Team" },
    ],
    instructors: [
      { path: "/instructors", icon: <PersonLinesFill />, label: "All Instructors" },
      { path: "/assignteam", icon: <PersonLinesFill />, label: "Assign Team" },
    ],
    data: [
      { path: "/data", icon: <DatabaseFill />, label: "Location" },
      { path: "/data/classses", icon: <JournalBookmarkFill  />, label: "Classes & Workshops" },
       { path: "/data/attendance", icon: <ClipboardCheckFill />, label: "Class Attendance" },
           { path: "/data/media", icon: <FileEarmarkPlayFill  />, label: "Class Media" }

    ]
  };

  const handleModuleClick = (module) => {
    setActiveModule(module);
    if (subMenus[module]?.length) {
      navigate(subMenus[module][0].path);
    }
    onMobileClose(); // Close mobile sidebar when module is selected
  };

  const menuItems = [
    ...baseMenu,
    ...(activeModule !== 'dashboard' ? subMenus[activeModule] || [] : [])
  ];

  return (
  <div 
      className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileVisible ? 'mobile-visible' : ''}`}
      onClick={(e) => {
        if (mobileVisible && e.target.closest('.menu-item')) {
          onMobileClose();
        }
      }}
    >
      <div className="sidebar-logo">
        {collapsed ? (
          <span className="logo-collapsed">AB</span>
        ) : (
          <span className="logo-expanded">Admin Panel</span>
        )}
        {!collapsed && (
          <button 
            className="sidebar-collapse-btn"
            onClick={() => {
              setSidebarCollapsed(true);
              onMobileClose();
            }}
          >
            <ChevronLeft />
          </button>
        )}
        {collapsed && (
          <button 
            className="sidebar-expand-btn"
            onClick={() => {
              setSidebarCollapsed(false);
              onMobileClose();
            }}
          >
            <ChevronRight />
          </button>
        )}
      </div>

      <div className="sidebar-menu">
        {/* Base Dashboard link */}
        {baseMenu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.label}</span>
          </Link>
        ))}

        {/* If on Dashboard, show the 4 module cards */}
        {activeModule === 'dashboard' &&
          moduleCards.map((item) => (
            <div
              key={item.module}
              className="menu-item"
              onClick={() => handleModuleClick(item.module)}
              style={{ cursor: 'pointer' }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.label}</span>
            </div>
          ))}

        {/* If in a module, show its submenu */}
        {activeModule !== 'dashboard' &&
          subMenus[activeModule]?.map((item) => (
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
