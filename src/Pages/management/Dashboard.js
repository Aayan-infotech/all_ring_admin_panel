


// import React from 'react';
// import { Card, Row, Col } from 'react-bootstrap';
// import {
//   PeopleFill,
//   PersonCheckFill,
//   PersonLinesFill,
//   DatabaseFill,
//   CalendarCheck,
//   ClockHistory,
// } from 'react-bootstrap-icons';

// const Dashboard = () => {
//   const stats = [
//     {
//       title: 'Total Users',
//       value: '1,234',
//       color: 'var(--primary)',
//       icon: <PeopleFill size={24} />,
//     },
//     {
//       title: 'Active Mentors',
//       value: '56',
//       color: 'var(--secondary)',
//       icon: <PersonCheckFill size={24} />,
//     },
//     {
//       title: 'Instructors',
//       value: '24',
//       color: 'var(--primary)',
//       icon: <PersonLinesFill size={24} />,
//     },
//     {
//       title: 'Data Entries',
//       value: '5,678',
//       color: 'var(--secondary)',
//       icon: <DatabaseFill size={24} />,
//     },
//   ];

//   const modules = [
//     { title: 'User Management', icon: <PeopleFill size={24} />, route: '/users', id: 'users' },
//     { title: 'Mentor Management', icon: <PersonCheckFill size={24} />, route: '/mentors', id: 'mentors' },
//     { title: 'Instructor Management', icon: <PersonLinesFill size={24} />, route: '/instructors', id: 'instructors' },
//     { title: 'Data Management', icon: <DatabaseFill size={24} />, route: '/data', id: 'data' },
//   ];

//   return (
//     <div className="dashboard-container p-4" style={{ background: '#f1f5f9', minHeight: '100vh' }}>
    
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 style={{ color: 'var(--secondary)' }}>Dashboard Overview</h2>
//         <div className="d-flex align-items-center">
//           <span className="me-3">Today: {new Date().toLocaleDateString()}</span>
//           <CalendarCheck size={20} color="var(--primary)" />
//         </div>
//       </div>

//       {/* Stats */}
//       <Row className="g-4 mb-4">
//         {stats.map((stat, idx) => (
//           <Col key={idx} xs={12} sm={6} md={3}>
//             <Card className="shadow-sm border-0 rounded-3 hover-scale h-100">
//               <Card.Body>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <h6 className="text-muted mb-1">{stat.title}</h6>
//                     <h3 style={{ color: stat.color }}>{stat.value}</h3>
//                   </div>
//                   <div
//                     style={{
//                       width: '48px',
//                       height: '48px',
//                       borderRadius: '12px',
//                       backgroundColor: `${stat.color}20`,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                     }}
//                   >
//                     {stat.icon}
//                   </div>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       {/* Module Navigation Cards */}
//       <Row className="g-4 mb-4">
//         {modules.map((module, idx) => (
//           <Col key={idx} xs={12} sm={6} md={3}>
//             <Card
//               onClick={() => {
//                 localStorage.setItem('activeModule', module.id);
//                 window.location.href = module.route;
//               }}
//               className="shadow-sm border-0 rounded-3 hover-scale text-center h-100"
//               style={{ cursor: 'pointer' }}
//             >
//               <Card.Body>
//                 <div
//                   style={{
//                     width: '48px',
//                     height: '48px',
//                     borderRadius: '12px',
//                     backgroundColor: 'var(--primary)20',
//                     margin: '0 auto 10px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                   }}
//                 >
//                   {module.icon}
//                 </div>
//                 <h6 style={{ color: 'var(--secondary)' }}>{module.title}</h6>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       {/* Bottom Widgets */}
//       <Row className="g-4 mt-4">
//         <Col md={6}>
//           <Card className="shadow-sm border-0 rounded-3 h-100">
//             <Card.Body>
//               <h5 style={{ color: 'var(--secondary)' }} className="mb-3">
//                 User Distribution
//               </h5>
//               <div
//                 style={{
//                   height: '200px',
//                   background: '#f8f9fa',
//                   borderRadius: '8px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}
//               >
//                 <p className="text-muted">[User distribution chart here]</p>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6}>
//           <Card className="shadow-sm border-0 rounded-3 h-100">
//             <Card.Body>
//               <h5 style={{ color: 'var(--secondary)' }} className="mb-3">
//                 Upcoming Events
//               </h5>
//               {[
//                 {
//                   title: 'Monthly Review Meeting',
//                   time: 'Tomorrow, 10:00 AM',
//                 },
//                 {
//                   title: 'New Feature Launch',
//                   time: 'In 3 days, 2:00 PM',
//                 },
//               ].map((event, index) => (
//                 <div key={index} className="d-flex align-items-center mb-3">
//                   <div
//                     style={{
//                       width: '40px',
//                       height: '40px',
//                       borderRadius: '8px',
//                       backgroundColor: 'var(--accent)',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       marginRight: '15px',
//                     }}
//                   >
//                     <CalendarCheck color="var(--primary)" />
//                   </div>
//                   <div>
//                     <strong>{event.title}</strong>
//                     <div className="text-muted small">{event.time}</div>
//                   </div>
//                 </div>
//               ))}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Dashboard;


import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { LinearProgress, Box, Typography } from '@mui/material';

import {
  PeopleFill,
  PersonCheckFill,
  PersonLinesFill,
  DatabaseFill,
  CalendarCheck,
} from 'react-bootstrap-icons';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      color: 'var(--primary)',
      icon: <PeopleFill size={24} />,
    },
    {
      title: 'Active Mentors',
      value: '56',
      color: 'var(--secondary)',
      icon: <PersonCheckFill size={24} />,
    },
    {
      title: 'Instructors',
      value: '24',
      color: 'var(--primary)',
      icon: <PersonLinesFill size={24} />,
    },
    {
      title: 'Data Entries',
      value: '5,678',
      color: 'var(--secondary)',
      icon: <DatabaseFill size={24} />,
    },
  ];

  const modules = [
    { title: 'User Management', icon: <PeopleFill size={24} />, route: '/users', id: 'users' },
    { title: 'Mentor Management', icon: <PersonCheckFill size={24} />, route: '/mentors', id: 'mentors' },
    { title: 'Instructor Management', icon: <PersonLinesFill size={24} />, route: '/instructors', id: 'instructors' },
    { title: 'Data Management', icon: <DatabaseFill size={24} />, route: '/data', id: 'data' },
  ];

  const trendingInstructors = [
    { name: 'Anjali Mehta', location: 'Delhi', sessions: 25 },
    { name: 'Rajiv Kumar', location: 'Mumbai', sessions: 22 },
    { name: 'Pooja Sharma', location: 'Bangalore', sessions: 18 },
    { name: 'Amit Singh', location: 'Hyderabad', sessions: 16 },
  ];

  const participationData = [
    { label: 'Total Classes', value: 100, color: '#1976d2' },
    { label: 'Total Registered', value: 80, color: '#f9a825' },
    { label: 'Total Present', value: 60, color: '#43a047' },
  ];

  return (
    <div className="dashboard-container p-4" style={{ background: '#f1f5f9', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)' }}>Dashboard Overview</h2>
        <div className="d-flex align-items-center">
          <span className="me-3">Today: {new Date().toLocaleDateString()}</span>
          <CalendarCheck size={20} color="var(--primary)" />
        </div>
      </div>

      {/* Stats */}
      <Row className="g-4 mb-4">
        {stats.map((stat, idx) => (
          <Col key={idx} xs={12} sm={6} md={3}>
            <Card className="shadow-sm border-0 rounded-3 hover-scale h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">{stat.title}</h6>
                    <h3 style={{ color: stat.color }}>{stat.value}</h3>
                  </div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: `${stat.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Module Cards */}
      <Row className="g-4 mb-4">
        {modules.map((module, idx) => (
          <Col key={idx} xs={12} sm={6} md={3}>
            <Card
              onClick={() => {
                localStorage.setItem('activeModule', module.id);
                window.location.href = module.route;
              }}
              className="shadow-sm border-0 rounded-3 hover-scale text-center h-100"
              style={{ cursor: 'pointer' }}
            >
              <Card.Body>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary)20',
                    margin: '0 auto 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {module.icon}
                </div>
                <h6 style={{ color: 'var(--secondary)' }}>{module.title}</h6>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Widgets */}
      <Row className="g-4 mt-4">
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-3 h-100">
            <Card.Body>
              <h5 style={{ color: 'var(--secondary)' }} className="mb-3">
                Participation Overview
              </h5>
              {participationData.map((item, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {item.label}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={item.value}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: item.color,
                      },
                      backgroundColor: '#e0e0e0',
                    }}
                  />
                </Box>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-3 h-100">
            <Card.Body>
              <h5 style={{ color: 'var(--secondary)' }} className="mb-3">
                Trending Instructors & Locations
              </h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
                    <tr>
                      <th>#</th>
                      <th>Instructor</th>
                      <th>Location</th>
                      <th>Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendingInstructors.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.location}</td>
                        <td>{item.sessions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
