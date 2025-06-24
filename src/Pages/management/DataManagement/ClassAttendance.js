


import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Badge,
  ButtonGroup,
  InputGroup,
  FormControl,
  Spinner,
  Modal,
  Row,
  Col,
  Form
} from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const statusVariant = {
  upcoming: 'warning',
  live: 'success',
  ended: 'secondary',
};

const ClassAttendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [allLocations, setAllLocations] = useState([]);

  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attLoading, setAttLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://18.209.91.97:5010/api/AdminClasses/getAllClasses');
        setData(res.data.data || []);
        
        const locations = [...new Set(res.data.data.map(cls => cls.location?.location).filter(Boolean))];
        setAllLocations(locations.map(location => ({ _id: location, location })));
      } catch (err) {
        console.error('Error fetching class data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);
const handleShowAttendance = async (cls) => {
  try {
    setSelectedClass(cls);
    setShowAttendanceModal(true);
    setAttLoading(true);

    const res = await axios.get(
      `http://18.209.91.97:5010/api/register/getRegistredUserWithAttendence/${cls._id}`
    );

    const users = res.data?.data?.users || [];

    // Transform attendance data if it's an object
    const transformedUsers = users.map(user => ({
      ...user,
      attendanceStatus: typeof user.attendance === 'object' 
        ? user.attendance.status 
        : user.attendance
    }));

    setAttendanceData(transformedUsers);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    setAttendanceData([]);
  } finally {
    setAttLoading(false);
  }
};
 

  const filteredData = data.filter((cls) => {
    const matchesTitle = cls.title?.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = !filterLocation || cls.location?.location === filterLocation;
    const matchesStatus = !filterStatus || cls.classStatus?.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesTitle && matchesLocation && matchesStatus;
  });

  return (
    <div className="p-4" style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ fontWeight: '600', color: 'var(--secondary)' }}>Class Attendance</h3>
      </div>

     
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          />
        </Col>

        <Col md={4}>
          <Form.Select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          >
            <option value="">All Locations</option>
            {allLocations.map(loc => (
              <option key={loc._id} value={loc.location}>
                {loc.location}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="ended">Ended</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="secondary" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover className="align-middle">
            <thead style={{ backgroundColor: 'var(--secondary)', color: 'white'}}>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Location</th>
                <th>Instructors</th>
                <th>Status</th>
                <th>More</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((cls, idx) => {
                const rawStatus = cls.classStatus?.toLowerCase() || 'upcoming';
                const badgeColor = statusVariant[rawStatus] || 'dark';

                return (
                  <tr key={cls._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{cls.title}</td>
                    <td>{cls.location?.location || 'N/A'}</td>
                    <td>{cls.Instructor?.name || 'N/A'}</td>
                    <td>
                      <Badge bg={badgeColor}>{rawStatus.toUpperCase()}</Badge>
                    </td>
                    <td>
                      <ButtonGroup>
                        <Button
                          size="sm"
                          onClick={() => handleShowAttendance(cls)}
                          style={{
                            backgroundColor: '#0dcaf0',
                            borderColor: '#0dcaf0',
                            color: '#ffffff'
                          }}
                        >
                          Attendance
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      <Modal
        show={showAttendanceModal}
        onHide={() => setShowAttendanceModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton style={{ background: 'var(--secondary)', color: '#fff' }}>
          <Modal.Title>Class Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {attLoading ? (
            <div className="text-center">
              <Spinner animation="border" variant="secondary" />
            </div>
          ) : attendanceData.length > 0 ? (
            
            <Table striped bordered hover>
  <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Email</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {attendanceData.map((user, index) => (
      <tr key={user.userId || index}>
        <td>{index + 1}</td>
        <td>
          <Link 
            to={`/feedback/${selectedClass?._id}?userId=${user.userId}`}
            style={{
              color: 'var(--primary)',
              textDecoration: 'underline',
              fontWeight: '500'
            }}
          >
            {user.name}
          </Link>
        </td>
        <td>{user.email}</td>
        <td>
          <Badge bg={user.attendanceStatus === 'Present' ? 'success' : 'danger'}>
            {user.attendanceStatus || 'Absent'}
          </Badge>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
          ) : (
            <p>No attendance data found.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClassAttendance;