

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import Login from './Pages/auth/Login';
// import PrivateRoute from './components/PrivateRoute';
// import Dashboard from './Pages/management/Dashboard';
// import Users from './Pages/management/Users';
// import Mentors from './Pages/management/Mentors';
// import Instructors from './Pages/management/Instructors';
// import Data from './Pages/management/Data';
// // import NotFound from './pages/NotFound';
// import Layout from './components/Layout';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/users" element={<Users />} />
//           <Route path="/mentors" element={<Mentors />} />
//           <Route path="/instructors" element={<Instructors />} />
//           <Route path="/data" element={<Data />} />
       
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Pages/auth/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './Pages/management/Dashboard';
import Users from './Pages/management/Users';
import Mentors from './Pages/management/Mentors';
import Instructors from './Pages/management/Instructors';
import Data from './Pages/management/Data';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Redirect root "/" to "/dashboard" */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/data" element={<Data />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
