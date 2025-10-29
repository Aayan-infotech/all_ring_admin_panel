import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
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
} from "react-bootstrap-icons";

const drawerWidth = 260;

const Sidebar = ({ collapsed, mobileVisible, onMobileClose, setSidebarCollapsed }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState("");

  const toggleDropdown = (module) => {
    setOpenDropdown((prev) => (prev === module ? "" : module));
  };

  const menuStructure = [
    { label: "Dashboard", path: "/dashboard", icon: <HouseFill /> },
    {
      label: "User Management",
      icon: <PeopleFill />,
      module: "users",
      children: [{ label: "All Users", path: "/users", icon: <PeopleFill /> }],
    },
    {
      label: "Instructor Management",
      icon: <PersonLinesFill />,
      module: "instructors",
      children: [
        { label: "All Instructors", path: "/instructors", icon: <PersonLinesFill /> },
        { label: "Assign Team", path: "/assignteam", icon: <PersonLinesFill /> },
      ],
    },
    {
      label: "Mentor Management",
      icon: <PersonCheckFill />,
      module: "mentors",
      children: [
        { label: "All Mentors", path: "/mentors", icon: <PersonCheckFill /> },
        { label: "Assign Team", path: "/assignmentorteam", icon: <PersonCheckFill /> },
      ],
    },
    {
      label: "Data Management",
      icon: <DatabaseFill />,
      module: "data",
      children: [
        { label: "Location", path: "/data", icon: <DatabaseFill /> },
        { label: "Classes & Workshops", path: "/data/classses", icon: <JournalBookmarkFill /> },
        { label: "Class Attendance", path: "/data/attendance", icon: <ClipboardCheckFill /> },
        { label: "Class Media", path: "/data/media", icon: <FileEarmarkPlayFill /> },
        { label: "Participants Journals", path: "/data/pariticipantsjournal", icon: <FileEarmarkPlayFill /> },
      ],
    },
    {
      label: "Reminders",
      icon: <BellFill />,
      module: "reminders",
      children: [{ label: "All Reminders", path: "/reminders", icon: <BellFill /> }],
    },
    {
      label: "Help and Support",
      icon: <QuestionCircleFill />,
      module: "support",
      children: [{ label: "Support Tickets", path: "/support/tickets", icon: <TicketFill /> }],
    },
    {
      label: "Static Content",
      icon: <QuestionCircleFill />,
      module: "staticContent",
      children: [{ label: "Static Content Data", path: "/static-content/data", icon: <TicketFill /> }],
    },
  ];

  // Auto-open dropdown when visiting a child route

  useEffect(() => {
    let foundMatch = false;
    menuStructure.forEach((item) => {
      if (item.children?.some((sub) => location.pathname.startsWith(sub.path))) {
        setOpenDropdown(item.module);
        foundMatch = true;
      }
    });
    // If the route doesn't belong to any submenu, close all dropdowns
    if (!foundMatch) {
      setOpenDropdown("");
    }
  }, [location.pathname]);


  return (
 <Drawer
  variant={mobileVisible ? "temporary" : "permanent"}
  open={mobileVisible || !collapsed}
  onClose={onMobileClose}
  sx={{
    "& .MuiDrawer-paper": {
      width: collapsed ? 80 : drawerWidth,
      background: "linear-gradient(180deg, #1a237e, #0d47a1)",
      color: "white",
      borderRight: "none",
      transition: "width 0.3s ease",
      zIndex: 100, // Lower than modal
    },
  }}
>
      {/* Logo */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent={collapsed ? "center" : "space-between"}
        p={2}
        sx={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {collapsed ? "AP" : "Admin Panel"}
        </Typography>
        <IconButton onClick={() => setSidebarCollapsed(!collapsed)} sx={{ color: "white" }}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Menu */}
      <List sx={{ mt: 1 }}>
        {menuStructure.map((item) => {
          const isDirectlyActive = item.path && location.pathname === item.path;

          return (
            <React.Fragment key={item.label}>
              {!item.children ? (
                <Tooltip title={collapsed ? item.label : ""} placement="right">
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      backgroundColor: isDirectlyActive ? "rgba(255,255,255,0.15)" : "transparent",
                      borderLeft: isDirectlyActive ? "4px solid #ffeb3b" : "4px solid transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.25)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                    {!collapsed && <ListItemText primary={item.label} />}
                  </ListItemButton>
                </Tooltip>
              ) : (
                <>
                  {/* Parent item (never highlighted, only clickable to expand) */}
                  <ListItemButton
                    onClick={() => toggleDropdown(item.module)}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.25)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                    {!collapsed && (
                      <>
                        <ListItemText primary={item.label} />
                        {openDropdown === item.module ? <ChevronUp /> : <ChevronDown />}
                      </>
                    )}
                  </ListItemButton>

                  {/* Submenu */}
                  <Collapse in={openDropdown === item.module && !collapsed} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((sub) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <ListItemButton
                            key={sub.path}
                            component={Link}
                            to={sub.path}
                            sx={{
                              pl: 6,
                              py: 0.8,
                              backgroundColor: isSubActive ? "rgba(255,255,255,0.2)" : "transparent",
                              borderLeft: isSubActive ? "4px solid #ffeb3b" : "4px solid transparent",
                              "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                            }}
                          >
                            <ListItemIcon sx={{ color: "white", minWidth: 36 }}>{sub.icon}</ListItemIcon>
                            <ListItemText primary={sub.label} />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                </>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
