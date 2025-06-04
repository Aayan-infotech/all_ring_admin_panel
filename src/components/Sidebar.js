
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  PeopleFill, 
  PersonCheckFill, 
  PersonLinesFill, 
  DatabaseFill,
  HouseFill
} from 'react-bootstrap-icons';

const Sidebar = ({ collapsed }) => {
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

  const handleModuleClick = (module) => {
    setActiveModule(module);
    // Redirect to first route of that module (optional)
    if (subMenus[module]?.length) {
      navigate(subMenus[module][0].path);
    }
  };

  const menuItems = [
    ...baseMenu,
    ...(activeModule !== 'dashboard' ? subMenus[activeModule] || [] : [])
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


// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { 
//   PeopleFill, 
//   PersonCheckFill, 
//   PersonLinesFill, 
//   DatabaseFill,
//   HouseFill
// } from 'react-bootstrap-icons';

// const Sidebar = ({ collapsed }) => {
//   const location = useLocation();

//   const menuItems = [
//     {
//       path: "/dashboard",
//       icon: <HouseFill />,
//       label: "Dashboard"
//     },
//     {
//       path: "/users",
//       icon: <PeopleFill />,
//       label: "User Management"
//     },
//     {
//       path: "/mentors",
//       icon: <PersonCheckFill />,
//       label: "Mentor Management"
//     },
//     {
//       path: "/instructors",
//       icon: <PersonLinesFill />,
//       label: "Instructor Management"
//     },
//     {
//       path: "/data",
//       icon: <DatabaseFill />,
//       label: "Data Management"
//     }
//   ];

//   return (
//     <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
//       <div className="sidebar-logo">
//         {collapsed ? (
//           <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>AB</span>
//         ) : (
//           <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Admin Panel</span>
//         )}
//       </div>
//       <div className="sidebar-menu">
//         {menuItems.map((item) => (
//           <Link
//             key={item.path}
//             to={item.path}
//             className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
//           >
//             <span className="menu-icon">{item.icon}</span>
//             <span className="menu-text">{item.label}</span>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;