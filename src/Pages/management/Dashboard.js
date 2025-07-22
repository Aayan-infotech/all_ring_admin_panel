
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { LinearProgress, Box, Typography } from '@mui/material';
import axios from 'axios';
import {
  PeopleFill,
  PersonCheckFill,
  PersonLinesFill,
  FileEarmarkPlayFill,
  DatabaseFill,
  CalendarCheck,
  JournalBookmarkFill,
} from 'react-bootstrap-icons';

const Dashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participationData, setParticipationData] = useState([]);
  const [participationLoading, setParticipationLoading] = useState(true);
const [dashboardCounts, setDashboardCounts] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get('http://98.85.246.54:5010/api/admin/stats/overview', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setStatsData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

const fetchParticipationData = async () => {
  try {
    const res = await axios.get('http://98.85.246.54:5010/api/register/getParticipationOverview');
    if (res.data.success) {
      const data = res.data.data;
      
      setParticipationData([
        { 
          label: 'Total Classes', 
          value: data.totalClasses > 0 ? 100 : 0, 
          color: '#1976d2',
          displayValue: data.totalClasses
        },
        { 
          label: 'Registration Percentage', 
          value: parseFloat(data.registrationPercentage),
          color: '#f9a825',
          displayValue: data.registrationPercentage
        },
        { 
          label: 'Attendance Percentage', 
          value: parseFloat(data.attendancePercentage), 
          color: '#43a047',
          displayValue: data.attendancePercentage
        },
      ]);
    }
  } catch (error) {
    console.error('Error fetching participation overview:', error);
  } finally {
    setParticipationLoading(false);
  }
};

 const fetchDashboardCounts = async () => {
    try {
      const res = await axios.get('http://98.85.246.54:5010/api/register/dashboardCounts');
      if (res.data.success) {
        setDashboardCounts(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard counts:', error);
    }
  };

  fetchStats();
  fetchParticipationData();
  fetchDashboardCounts();
  }, []);

  const stats = statsData
    ? [
      {
    title: 'Total Users',
    value: statsData.activeUsers,
    color: 'var(--primary)',
    icon: <PeopleFill size={24} />,
    route: '/users'
  },
  {
    title: 'Active Mentors',
    value: statsData.activeMentors,
    color: 'var(--secondary)',
    icon: <PersonCheckFill size={24} />,
    route: '/mentors'
  },
  {
    title: 'Instructors',
    value: statsData.activeInstructors,
    color: 'var(--primary)',
    icon: <PersonLinesFill size={24} />,
    route: '/instructors'
  },
  {
    title: 'Total Classes',
    value: statsData.activeClasses,
    color: 'var(--secondary)',
    icon: <DatabaseFill size={24} />,
    route: '/data/classses'
  }
      ]
    : [];


const dashboardStats = dashboardCounts ? [
  {
    title: 'Upcoming Sessions',
    icon: <JournalBookmarkFill size={24} />,
    value: dashboardCounts.upcomingCount
  },
  {
    title: 'Live Sessions',
    icon: <FileEarmarkPlayFill size={24} />,
    value: dashboardCounts.liveCount
  },
  {
    title: 'Total Prisoners',
    icon: <PeopleFill size={24} />,
    value: dashboardCounts.totalPrisoners
  },
  {
    title: 'Total Locations',
    icon: <DatabaseFill size={24} />,
    value: dashboardCounts.totalLocations
  }
] : [];


  const trendingInstructors = [
    { name: 'Anjali Mehta', location: 'Delhi', sessions: 25 },
    { name: 'Rajiv Kumar', location: 'Mumbai', sessions: 22 },
    { name: 'Pooja Sharma', location: 'Bangalore', sessions: 18 },
    { name: 'Amit Singh', location: 'Hyderabad', sessions: 16 },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard Overview </h2>
        <div className="dashboard-date">
          <span>Today: {new Date().toLocaleDateString()}</span>
          <CalendarCheck size={20} className="calendar-icon" />
        </div>
      </div>

    

      <Row className="stats-row">
        {loading ? (
          <Col className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </Col>
        ) : (
  stats.map((item, idx) => (
    <Col key={idx} xs={6} sm={6} md={3}>
      <Card
        onClick={() => {
          if (item.route) window.location.href = item.route;
        }}
        className="module-card"
        style={{ cursor: 'pointer' }}
      >
        <Card.Body className="text-center">
          <div className="module-icon-container mb-2" style={{ color: item.color }}>
            {item.icon}
          </div>
          <h6 className="mb-1">{item.title}</h6>
          <h4 style={{ fontWeight: 'bold', color: item.color }}>{item.value}</h4>
        </Card.Body>
      </Card>
    </Col>
  ))
        )}
</Row>


<Row className="modules-row">
  {dashboardStats.map((item, idx) => (
    <Col key={idx} xs={6} sm={6} md={3}>
      <Card className="module-card">
        <Card.Body className="text-center">
          <div className="module-icon-container mb-2">{item.icon}</div>
          <h6 className="mb-1">{item.title}</h6>
          <h5 style={{ fontWeight: 'bold' }}>{item.value}</h5>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>


    
      <Row className="widgets-row">
 
  <Col xs={12}>
    <Card className="participation-card mb-4">
      <Card.Body>
        <h5 className="widget-title">Participation Overview</h5>

        {participationLoading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          participationData.map((item, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {item.label}: {item.displayValue}
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
          ))
        )}
      </Card.Body>
    </Card>
  </Col>


  <Col xs={12}>
    <Card className="instructors-card">
      <Card.Body>
        <h5 className="widget-title">Trending Instructors & Locations</h5>
        <div className="table-responsive">
          <table className="instructors-table table">
            <thead>
              <tr>
                <th>#</th>
                <th>Instructors</th>
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