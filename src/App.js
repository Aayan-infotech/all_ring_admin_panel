import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Pages/auth/Login";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./Pages/management/Dashboard";

import Users from "./Pages/management/UserManagement/Users";
import Mentors from "./Pages/management/MentorManagement/Mentors";
import Instructors from "./Pages/management/InstructorManagement/Instructors";
import Data from "./Pages/management/DataManagement/Data";
import Layout from "./components/Layout";

import NotFound from "./Pages/NotFound";

import AddUserOffcanvas from "./Pages/management/UserManagement/AddUserOffcanvas";
import AddMentorOffcanvas from "./Pages/management/MentorManagement/AddMentorOffcanvas";
import AddInstructorOffcanvas from "./Pages/management/InstructorManagement/AddInstructorOffcanvas";
import ClassesWorkshops from "./Pages/management/DataManagement/ClassesWorkshops";
import ClassAttendance from "./Pages/management/DataManagement/ClassAttendance";
import PrisonerList from "./Pages/management/InstructorManagement/PrisonerList";
import ClassMediaPage from "./Pages/management/DataManagement/ClassMediaPage";
import FeedbackPage from "./Pages/management/DataManagement/FeedbackPage";
import AssignTeam from "./Pages/management/InstructorManagement/AssignTeam";
import AssignMentorTeam from "./Pages/management/MentorManagement/AssignMentorTeam";
import CreateNotification from "./Pages/management/Notification/CreateNotification";
import ParticipantsJournals from "./Pages/management/DataManagement/ParticipantsJournals";
import Tickets from "./Pages/management/Support/Tickets";
import StaticContent from "./Pages/management/staticContent/staticContent";

// Import public pages
import AboutUs from "./Pages/public/AboutUs";
import TermsAndConditions from "./Pages/public/TermsAndConditions";
import PrivacyPolicy from "./Pages/public/PrivacyPolicy";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public Routes - Accessible without authentication */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Routes - Require authentication */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/support/tickets" element={<Tickets />} />
          <Route path="/static-content/data" element={<StaticContent />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/assignteam" element={<AssignTeam />} />
          <Route path="/reminders" element={<CreateNotification />} />
          <Route path="/data" element={<Data />} />
          <Route path="/data/classses" element={<ClassesWorkshops />} />
          <Route path="/data/attendance" element={<ClassAttendance />} />
          <Route
            path="/data/pariticipantsjournal"
            element={<ParticipantsJournals />}
          />
          <Route path="/feedback/:classId" element={<FeedbackPage />} />
          <Route path="/data/media" element={<ClassMediaPage />} />
          <Route path="/prisoners" element={<PrisonerList />} />
          <Route path="/adduser" element={<AddUserOffcanvas />} />
          <Route path="/addmentor" element={<AddMentorOffcanvas />} />
          <Route path="/assignmentorteam" element={<AssignMentorTeam />} />
          <Route path="/addinstructor" element={<AddInstructorOffcanvas />} />
        </Route>

        {/* Catch all route - should be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;