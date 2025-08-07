


import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PeopleFill,
  PersonCheckFill,
  PersonLinesFill,
  DatabaseFill,
  ClipboardCheckFill,
  JournalBookmarkFill,
  HouseFill,
  ChevronLeft,
  ChevronRight,
  FileEarmarkPlayFill,
  ChevronDown,
  ChevronUp,
  QuestionCircleFill,
  TicketFill,
  BellFill,
} from 'react-bootstrap-icons';

const Sidebar = ({ collapsed, mobileVisible, onMobileClose, setSidebarCollapsed }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState('');

  const toggleDropdown = (module) => {
    setOpenDropdown(prev => (prev === module ? '' : module));
  };

  const menuStructure = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <HouseFill />,
    },
    {
      label: 'User Management',
      icon: <PeopleFill />,
      module: 'users',
      children: [
        { label: 'All Users', path: '/users', icon: <PeopleFill /> },
        // { label: 'Add User', path: '/users/add', icon: <PeopleFill /> },
      ],
    },

{
      label: 'Help and Support',
      icon: <QuestionCircleFill />, // Add this import at the top: import { QuestionCircleFill } from 'react-bootstrap-icons';
      module: 'support',
      children: [
        { label: 'Support Tickets', path: '/support/tickets', icon: <TicketFill /> }, // Add TicketFill to imports
      ],
    },


    {
      label: 'Mentor Management',
      icon: <PersonCheckFill />,
      module: 'mentors',
      children: [
        { label: 'All Mentors', path: '/mentors', icon: <PersonCheckFill /> },
        { label: 'Assign Team', path: '/assignmentorteam', icon: <PersonCheckFill /> },
      ],
    },
    {
      label: 'Instructor Management',
      icon: <PersonLinesFill />,
      module: 'instructors',
      children: [
        { label: 'All Instructors', path: '/instructors', icon: <PersonLinesFill /> },
        { label: 'Assign Team', path: '/assignteam', icon: <PersonLinesFill /> },
      ],
    },
    {
      label: 'Data Management',
      icon: <DatabaseFill />,
      module: 'data',
      children: [
        { label: 'Location', path: '/data', icon: <DatabaseFill /> },
        { label: 'Classes & Workshops', path: '/data/classses', icon: <JournalBookmarkFill /> },
        { label: 'Class Attendance', path: '/data/attendance', icon: <ClipboardCheckFill /> },
        { label: 'Class Media', path: '/data/media', icon: <FileEarmarkPlayFill /> },
        { label: 'Participants Journals', path: 'data/pariticipantsjournal', icon: <FileEarmarkPlayFill /> },
      ],
    },
    {
      label: 'Reminders',
      icon: <BellFill />,
      module: 'reminders',
      children: [
        { label: 'All Reminders', path: '/reminders', icon: <BellFill /> },
        // { label: 'Create Reminder', path: '/reminders/create', icon: <BellFill /> },
      ],
    },
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
      {/* Logo Section */}
      <div className="sidebar-logo">
        {collapsed ? <span className="logo-collapsed">AP</span> : <span className="logo-expanded">Admin Panel</span>}
        {!collapsed ? (
          <button className="sidebar-collapse-btn" onClick={() => setSidebarCollapsed(true)}>
            <ChevronLeft />
          </button>
        ) : (
          <button className="sidebar-expand-btn" onClick={() => setSidebarCollapsed(false)}>
            <ChevronRight />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <div className="sidebar-menu">
        {menuStructure.map((item) => (
          <div key={item.label} className="menu-group">
            {/* Main Item */}
            {!item.children ? (
              <Link
                to={item.path}
                className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.label}</span>
              </Link>
            ) : (
              <>
                <div
                  className="menu-item"
                  onClick={() => toggleDropdown(item.module)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-text">{item.label}</span>
                  <span className="dropdown-icon">
                    {openDropdown === item.module ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </div>

                {/* Dropdown Submenu */}
                {openDropdown === item.module && (
                  <div className="submenu-list">
                    {item.children.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className={`submenu-item ${location.pathname === sub.path ? 'active' : ''}`}
                        onClick={onMobileClose}
                      >
                        <span className="submenu-icon">{sub.icon}</span>
                        <span className="submenu-text">{sub.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;