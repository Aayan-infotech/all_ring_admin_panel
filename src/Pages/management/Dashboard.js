import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";


import { useNavigate } from 'react-router-dom';



import {
  LinearProgress,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import {
  PeopleFill,
  PersonCheckFill,
  PersonLinesFill,
  FileEarmarkPlayFill,
  DatabaseFill,
  CalendarCheck,
  JournalBookmarkFill,
  GeoAltFill
} from "react-bootstrap-icons";


import API_BASE_URL from "../../config/api";

const Dashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participationData, setParticipationData] = useState([]);
    const navigate = useNavigate();

  const [participationLoading, setParticipationLoading] = useState(true);
  const [dashboardCounts, setDashboardCounts] = useState(null);
  const [trendingInstructors, setTrendingInstructors] = useState([]);
  const [instructorsLoading, setInstructorsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  // Clock updater
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date & time
  const formattedDateTime = currentTime.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/admin/stats/overview`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) setStatsData(res.data.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchParticipationData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/register/getParticipationOverview`
        );
        if (res.data.success) {
          const data = res.data.data;
          setParticipationData([
            {
              label: "Total Classes",
              value: data.totalClasses > 0 ? 100 : 0,
              color: "#00bcd4",
              displayValue: data.totalClasses,
            },
            {
              label: "Registration %",
              value: parseFloat(data.registrationPercentage),
              color: "#ff9800",
              displayValue: `${data.registrationPercentage}`,
            },
            {
              label: "Attendance %",
              value: parseFloat(data.attendancePercentage),
              color: "#4caf50",
              displayValue: `${data.attendancePercentage}`,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching participation overview:", error);
      } finally {
        setParticipationLoading(false);
      }
    };

    const fetchDashboardCounts = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/register/dashboardCounts`
        );
        if (res.data.success) setDashboardCounts(res.data.data);
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      }
    };

    const fetchTrendingInstructors = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/instructor/getTrendingInstructors`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTrendingInstructors(res.data.success ? res.data.data || [] : []);
      } catch (error) {
        console.error("Error fetching trending instructors:", error);
        setTrendingInstructors([]);
      } finally {
        setInstructorsLoading(false);
      }
    };

    fetchStats();
    fetchParticipationData();
    fetchDashboardCounts();
    fetchTrendingInstructors();
  }, []);

   const stats = statsData
    ? [
      {
        title: "Total Users",
        value: statsData.activeUsers,
        color: "linear-gradient(135deg, #42a5f5, #478ed1)",
        icon: <PeopleFill size={28} />,
        path: "/users" // Add path for navigation
      },
      {
        title: "Active Mentors",
        value: statsData.activeMentors,
        color: "linear-gradient(135deg, #66bb6a, #388e3c)",
        icon: <PersonCheckFill size={28} />,
        path: "/mentors"
      },
      {
        title: "Instructors",
        value: statsData.activeInstructors,
        color: "linear-gradient(135deg, #ffb74d, #f57c00)",
        icon: <PersonLinesFill size={28} />,
        path: "/instructors"
      },
      {
        title: "Total Classes",
        value: statsData.activeClasses,
        color: "linear-gradient(135deg, #ab47bc, #8e24aa)",
        icon: <DatabaseFill size={28} />,
        path: "/data/classses"
    
      },
    ]
    : [];

  const dashboardStats = dashboardCounts
    ? [
      { 
        title: "Upcoming Sessions", 
        icon: <JournalBookmarkFill size={24} />, 
        value: dashboardCounts.upcomingCount,
        path: "/data/classses"
      },
      { 
        title: "Live Sessions", 
        icon: <FileEarmarkPlayFill size={24} />, 
        value: dashboardCounts.liveCount,
        path: "/data/classses"
      },
      { 
        title: "Total Prisoners", 
        icon: <PeopleFill size={24} />, 
        value: dashboardCounts.totalPrisoners,
        path: "/prisoners"
      },
      { 
        title: "Total Locations", 
        icon: <GeoAltFill size={24} />, 
        value: dashboardCounts.totalLocations,
        path: "/data"
      }
    ]
    : [];
  return (
    <div
      className="dashboard-container p-4"
      style={{
        background: "linear-gradient(to bottom right, #f5f7fa, #e6ecf3)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: "#2c3e50" }}>
          📊 Dashboard Overview
        </h2>
        <div className="text-muted d-flex align-items-center gap-2">
          <CalendarCheck size={20} />
          <span style={{ fontWeight: "bold" }}>{formattedDateTime}</span>
        </div>
      </div>

      {/* Top Stats */}
      {/* <Row className="g-3 mb-4">
        {loading ? (
          <Col className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </Col>
        ) : (
          stats.map((item, idx) => (
            <Col key={idx} xs={12} sm={6} lg={3}>
              <Card
                className="h-100 shadow-sm border-0"
                style={{
                  background: item.color,
                  color: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 25px rgba(0,0,0,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(0,0,0,0.15)";
                }}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{item.title}</h6>
                    <h3 className="fw-bold">{item.value}</h3>
                  </div>
                  {item.icon}
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row> */}
          {/* Modified Top Stats with navigation */}
      <Row className="g-3 mb-4">
        {loading ? (
          <Col className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </Col>
        ) : (
          stats.map((item, idx) => (
            <Col key={idx} xs={12} sm={6} lg={3}>
              <Card
                className="h-100 shadow-sm border-0"
                style={{
                  background: item.color,
                  color: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  cursor: "pointer" // Add cursor pointer to indicate clickable
                }}
                onClick={() => navigate(item.path)} // Add click handler
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 25px rgba(0,0,0,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(0,0,0,0.15)";
                }}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{item.title}</h6>
                    <h3 className="fw-bold">{item.value}</h3>
                  </div>
                  {item.icon}
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Middle Stats */}
        <Row className="g-3 mb-4">
        {dashboardStats.map((item, idx) => (
          <Col key={idx} xs={12} sm={6} lg={3}>
            <Card
              className="shadow-sm border-0 h-100"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(6px)",
                borderRadius: "14px",
                cursor: "pointer",
                transition: "transform 0.2s ease"
              }}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Card.Body className="text-center">
                <div className="mb-2 text-primary">{item.icon}</div>
                <h6 className="fw-semibold">{item.title}</h6>
                <h5 className="fw-bold">{item.value}</h5>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Participation Overview */}
      <Card
        className="shadow-sm border-0 mb-4"
        style={{
          background: "rgba(255,255,255,0.8)",
          borderRadius: "14px",
          backdropFilter: "blur(8px)",
        }}
      >
        <Card.Body>
          <h5 className="fw-bold mb-3">📈 Participation Overview</h5>
          {participationLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Row>
              {participationData.map((item, idx) => (
                <Col key={idx} xs={12} md={4} className="text-center">
                  <CircularProgress
                    variant="determinate"
                    value={item.value}
                    size={90}
                    thickness={5}
                    sx={{ color: item.color }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h6">{item.displayValue}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={item.value}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      mt: 1,
                      "& .MuiLinearProgress-bar": { backgroundColor: item.color },
                    }}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Trending Instructors */}
      <Card
        className="shadow-sm border-0"
        style={{
          background: "rgba(255,255,255,0.85)",
          borderRadius: "14px",
          backdropFilter: "blur(6px)",
        }}
      >
        <Card.Body>
          <h5 className="fw-bold mb-3">🔥 Trending Instructors & User Engagements</h5>
          <div className="table-responsive">
            {instructorsLoading ? (
              <div className="text-center py-3">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : trendingInstructors.length > 0 ? (
              <table className="table table-hover align-middle">
                <thead
                  style={{
                    background: "linear-gradient(90deg, #42a5f5, #478ed1)",
                    color: "#fff",
                  }}
                >
                  <tr>
                    <th>#</th>
                    <th>Instructor</th>
                    <th>Location</th>
                    <th>Classes</th>
                    <th>Sessions</th>
                    <th>Registrations</th>
                  </tr>
                </thead>
                <tbody>
                  {trendingInstructors.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.profileImage || "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"}
                            alt="Instructor"
                            className="rounded-circle me-2"
                            width="40"
                            height="40"
                          />
                          {item.name || "N/A"}
                        </div>
                      </td>
                      <td>{item.location || "N/A"}</td>
                      <td className="fw-semibold">{item.numClasses || 0}</td>
                      <td className="fw-semibold">{item.totalSessions || 0}</td>
                      <td className="fw-semibold">{item.registrations || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-3">
                <p className="text-muted">No data available</p>
              </div>
            )}
          </div>
        </Card.Body>
      
        <Card.Body>
          <h5 className="fw-bold mb-3">🔥 Trending Instructors & Classes-Sessions</h5>
          {instructorsLoading ? (
            <div className="text-center py-3">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : trendingInstructors.length > 0 ? (
            <Line
              data={{
                labels: ["Classes", "Sessions", "Registrations"], // X-axis categories
                datasets: trendingInstructors.map((instr, idx) => ({
                  label: instr.name || "N/A",
                  data: [
                    instr.numClasses || 0,
                    instr.totalSessions || 0,
                    instr.registrations || 0
                  ],
                  borderColor: `hsl(${idx * 50}, 70%, 50%)`,
                  backgroundColor: `hsla(${idx * 50}, 70%, 50%, 0.2)`,
                  tension: 0.4,
                  fill: true,
                  pointRadius: 6,
                  pointHoverRadius: 10,
                  pointBorderColor: "#fff",
                  pointBorderWidth: 2,
                }))
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      font: { size: 14, weight: "bold" },
                      usePointStyle: true,
                    },
                  },
                  tooltip: {
                    usePointStyle: true,
                    callbacks: {
                      label: (context) => {
                        const instr = trendingInstructors[context.datasetIndex];
                        const metric = context.label;
                        return `${metric}: ${context.formattedValue} (${instr.location || "N/A"})`;
                      },
                      afterLabel: (context) => {
                        const instr = trendingInstructors[context.datasetIndex];
                        return `Instructor: ${instr.name}`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Metrics",
                      font: { weight: "bold", size: 14 },
                    },
                    grid: {
                      drawOnChartArea: false,
                    }
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Count",
                      font: { weight: "bold", size: 14 },
                    },
                    ticks: {
                      precision: 0,
                    }
                  }
                }
              }}
            />

          ) : (
            <div className="text-center py-3">
              <p className="text-muted">No data available</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
