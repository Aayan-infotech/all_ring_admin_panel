import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
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

const Dashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participationData, setParticipationData] = useState([]);
  const [participationLoading, setParticipationLoading] = useState(true);
  const [dashboardCounts, setDashboardCounts] = useState(null);
  const [trendingInstructors, setTrendingInstructors] = useState([]);
  const [instructorsLoading, setInstructorsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

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
          "http://3.228.185.94:5010/api/admin/stats/overview",
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
          "http://3.228.185.94:5010/api/register/getParticipationOverview"
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
          "http://3.228.185.94:5010/api/register/dashboardCounts"
        );
        if (res.data.success) setDashboardCounts(res.data.data);
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      }
    };

    const fetchTrendingInstructors = async () => {
      try {
        const res = await axios.get(
          "http://3.228.185.94:5010/api/instructor/getTrendingInstructors",
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
      },
      {
        title: "Active Mentors",
        value: statsData.activeMentors,
        color: "linear-gradient(135deg, #66bb6a, #388e3c)",
        icon: <PersonCheckFill size={28} />,
      },
      {
        title: "Instructors",
        value: statsData.activeInstructors,
        color: "linear-gradient(135deg, #ffb74d, #f57c00)",
        icon: <PersonLinesFill size={28} />,
      },
      {
        title: "Total Classes",
        value: statsData.activeClasses,
        color: "linear-gradient(135deg, #ab47bc, #8e24aa)",
        icon: <DatabaseFill size={28} />,
      },
    ]
    : [];

  const dashboardStats = dashboardCounts
    ? [
      { title: "Upcoming Sessions", icon: <JournalBookmarkFill size={24} />, value: dashboardCounts.upcomingCount },
      { title: "Live Sessions", icon: <FileEarmarkPlayFill size={24} />, value: dashboardCounts.liveCount },
      { title: "Total Prisoners", icon: <PeopleFill size={24} />, value: dashboardCounts.totalPrisoners },
      { title: "Total Locations", icon: <GeoAltFill size={24} />, value: dashboardCounts.totalLocations }
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
          <h5 className="fw-bold mb-3">🔥 Trending Instructors & Locations</h5>
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
                    <th>Sessions</th>
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
                      <td className="fw-semibold">{item.totalSessions || 0}</td>
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
      </Card>
    </div>
  );
};

export default Dashboard;
