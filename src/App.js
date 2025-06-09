


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Pages/auth/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './Pages/management/Dashboard';
import Users from './Pages/management/Users';
import Mentors from './Pages/management/Mentors';
import Instructors from './Pages/management/Instructors';
import Data from './Pages/management/Data';
import Layout from './components/Layout';

import NotFound from './Pages/NotFound';
import AddUserOffcanvas from './Pages/AddUserOffcanvas';
import AddMentorOffcanvas from './Pages/AddMentorOffcanvas';
import AddInstructorOffcanvas from './Pages/AddInstructorOffcanvas';
function App() {
  return (
    <Router>
      <ToastContainer/>
      <Routes>
        <Route path="/login" element={<Login />} />
        
      
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/data" element={<Data />} />
          <Route path="*" element={<NotFound />} />

              <Route path="/adduser" element={<AddUserOffcanvas />} />
                 <Route path="/addmentor" element={<AddMentorOffcanvas />} />
                   <Route path="/addinstructor" element={<AddInstructorOffcanvas/  >} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
