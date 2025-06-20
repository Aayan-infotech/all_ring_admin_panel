


import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { LinearProgress, Box, Typography } from '@mui/material';
import axios from 'axios';
import {
  PeopleFill,
  PersonCheckFill,
  PersonLinesFill,
  DatabaseFill,
  CalendarCheck,
} from 'react-bootstrap-icons';

const Dashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
const [participationData, setParticipationData] = useState([]);
const [participationLoading, setParticipationLoading] = useState(true);





    useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get('http://18.209.91.97:5010/api/admin/stats/overview', {
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
        const res = await axios.get('http://18.209.91.97:5010/api/register/getParticipationOverview');
        if (res.data.success) {
          // Assuming API returns: { success: true, data: { totalClasses: 100, totalRegistered: 80, totalPresent: 60 } }
          const data = res.data.data;
          setParticipationData([
            { label: 'Total Classes', value: data.totalActiveClasses || 0, color: '#1976d2' },
            { label: 'Total Registered', value: data.totalRegistered || 0, color: '#f9a825' },
            { label: 'Total Present', value: data.totalPresent || 0, color: '#43a047' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching participation overview:', error);
      } finally {
        setParticipationLoading(false);
      }
    };

    fetchStats();
    fetchParticipationData();
  }, [])
  const stats = statsData
    ? [
        {
          title: 'Total Users',
          value: statsData.activeUsers,
          color: 'var(--primary)',
          icon: <PeopleFill size={24} />,
        },
        {
          title: 'Active Mentors',
          value: statsData.activeMentors,
          color: 'var(--secondary)',
          icon: <PersonCheckFill size={24} />,
        },
        {
          title: 'Instructors',
          value: statsData.activeInstructors,
          color: 'var(--primary)',
          icon: <PersonLinesFill size={24} />,
        },
        {
          title: 'Total Classes',
          value: statsData.activeClasses,
          color: 'var(--secondary)',
          icon: <DatabaseFill size={24} />,
        },
      ]
    : [];

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

 

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <div className="dashboard-date">
          <span>Today: {new Date().toLocaleDateString()}</span>
          <CalendarCheck size={20} className="calendar-icon" />
        </div>
      </div>

      {/* Stats */}
      <Row className="stats-row">
        {loading ? (
          <Col className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </Col>
        ) : (
          stats.map((stat, idx) => (
            <Col key={idx} xs={6} sm={6} md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-content">
                    <div>
                      <h6>{stat.title}</h6>
                      <h3 style={{ color: stat.color }}>{stat.value}</h3>
                    </div>
                    <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
                      {stat.icon}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Module Cards */}
      <Row className="modules-row">
        {modules.map((module, idx) => (
          <Col key={idx} xs={6} sm={6} md={3}>
            <Card
              onClick={() => {
                localStorage.setItem('activeModule', module.id);
                window.location.href = module.route;
              }}
              className="module-card"
            >
              <Card.Body>
                <div className="module-icon-container">{module.icon}</div>
                <h6>{module.title}</h6>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Widgets */}
      <Row className="widgets-row">
        <Col xs={12} md={6}>
          <Card className="participation-card">
            <Card.Body>
              <h5 className="widget-title">Participation Overview</h5>

              {participationLoading ? (
  <Spinner animation="border" variant="primary" />
) : (
  participationData.map((item, idx) => (
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
  ))
)}

            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="instructors-card">
            <Card.Body>
              <h5 className="widget-title">Trending Instructors & Locations</h5>
              <div className="table-responsive">
                <table className="instructors-table">
                  <thead>
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
