


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Pages/auth/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './Pages/management/Dashboard';

import Users from './Pages/management/UserManagement/Users';
import Mentors from './Pages/management/MentorManagement/Mentors';
import Instructors from './Pages/management/InstructorManagement/Instructors';
import Data from './Pages/management/DataManagement/Data';
import Layout from './components/Layout';

import NotFound from './Pages/NotFound';

import AddUserOffcanvas from './Pages/management/UserManagement/AddUserOffcanvas';
import AddMentorOffcanvas from './Pages/management/MentorManagement/AddMentorOffcanvas';
import AddInstructorOffcanvas from './Pages/management/InstructorManagement/AddInstructorOffcanvas';
import ClassesWorkshops from './Pages/management/DataManagement/ClassesWorkshops';
import ClassAttendance from './Pages/management/DataManagement/ClassAttendance';
import PrisonerList from './Pages/management/InstructorManagement/PrisonerList';
import ClassMediaPage from './Pages/management/DataManagement/ClassMediaPage';
function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />


        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/data" element={<Data />} />
          <Route path="data/classses" element={<ClassesWorkshops />} />
          <Route path="data/attendance" element={<ClassAttendance />} />
             <Route path="data/media" element={<ClassMediaPage />} />
          <Route path="*" element={<NotFound />} />
<Route path="/prisoners" element={<PrisonerList />} />

          <Route path="/adduser" element={<AddUserOffcanvas />} />
          <Route path="/addmentor" element={<AddMentorOffcanvas />} />
          <Route path="/addinstructor" element={<AddInstructorOffcanvas />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
