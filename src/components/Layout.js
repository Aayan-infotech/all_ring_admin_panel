import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';


const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarVisible(!mobileSidebarVisible);
  };

  return (
    <div className="admin-container">
      {mobileSidebarVisible && (
        <div 
          className="mobile-sidebar-overlay"
          onClick={toggleMobileSidebar}
        />
      )}
      
      <Sidebar 
        collapsed={sidebarCollapsed} 
        mobileVisible={mobileSidebarVisible}
        onMobileClose={toggleMobileSidebar}
        setSidebarCollapsed={setSidebarCollapsed} 
      />
      
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header 
          toggleSidebar={toggleSidebar} 
          sidebarCollapsed={sidebarCollapsed}
          toggleMobileSidebar={toggleMobileSidebar}
        />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;