



import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Badge,
  ButtonGroup,
  InputGroup,
  FormControl,
  Spinner,
  Modal
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

  const [showDetailsModal, setShowDetailsModal] = useState(false);
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
      } catch (err) {
        console.error('Error fetching class data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleShowDetails = (cls) => {
    setSelectedClass(cls);
    setShowDetailsModal(true);
  };

  // const handleShowAttendance = async (cls) => {
  //   try {
  //     setSelectedClass(cls);
  //     setShowAttendanceModal(true);
  //     setAttLoading(true);
  //     const res = await axios.get(
  //       `http://18.209.91.97:5010/api/register/getRegistredUserWithAttendence/${cls._id}`
  //     );
  //     const result = res.data?.data;
  //     setAttendanceData(Array.isArray(result) ? result : []);
  //   } catch (err) {
  //     console.error('Attendance fetch failed:', err);
  //     setAttendanceData([]);
  //   } finally {
  //     setAttLoading(false);
  //   }
  // };
const handleShowAttendance = async (cls) => {
  try {
    setSelectedClass(cls);
    setShowAttendanceModal(true);
    setAttLoading(true);

    const res = await axios.get(
      `http://18.209.91.97:5010/api/register/getRegistredUserWithAttendence/${cls._id}`
    );

    const users = res.data?.data?.users;

    if (Array.isArray(users)) {
      setAttendanceData(users);
    } else {
      setAttendanceData([]);
      console.warn("No user attendance array found");
    }
  } catch (err) {
    console.error("Error fetching attendance:", err);
    setAttendanceData([]);
  } finally {
    setAttLoading(false);
  }
};

  const filteredData = data.filter((cls) =>
    cls.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4" style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ fontWeight: '600', color: 'var(--secondary)' }}>Class Attendance</h3>
      </div>

      <InputGroup className="mb-3 w-50">
        <FormControl
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ borderColor: 'var(--secondary)' }}
        />
      </InputGroup>

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
                    <td>
                      <Link
                        to={`/feedback/${cls._id}`}
                        style={{
                          color: 'var(--primary)',
                          textDecoration: 'underline',
                          fontWeight: '500'
                        }}
                      >
                        {cls.title}
                      </Link>
                    </td>
                    <td>{cls.location?.location || 'N/A'}</td>
                    <td>{cls.Instructor?.name || 'N/A'}</td>
                    <td>
                      <Badge bg={badgeColor}>{rawStatus.toUpperCase()}</Badge>
                    </td>
                    <td>
                   
<ButtonGroup>
  <Button
    size="sm"
    className="me-2"
    onClick={() => handleShowDetails(cls)}
    style={{
      backgroundColor: '#dc3545',
      borderColor: '#dc3545',
      color: '#ffffff'
    }}
  >
    Details
  </Button>

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

      {/* DETAILS MODAL */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton style={{ background: 'var(--secondary)', color: '#fff' }}>
          <Modal.Title>Class Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedClass ? (
            <>
              <p><strong>Title:</strong> {selectedClass.title}</p>
              <p><strong>Location:</strong> {selectedClass.location?.location || 'N/A'}</p>
              <p><strong>Instructor:</strong> {selectedClass.Instructor?.name || 'N/A'}</p>
              <p><strong>Status:</strong> {selectedClass.classStatus}</p>
            </>
          ) : (
            <p>No data available</p>
          )}
        </Modal.Body>
      </Modal>

      {/* ATTENDANCE MODAL */}
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
                  <th>Enrollment</th>
                  <th>Status</th>
                </tr>
              </thead>
<tbody>
  {attendanceData.map((user, index) => (
    <tr key={user.userId || index}>
      <td>{index + 1}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <Badge bg={user.attendance === 'Present' ? 'success' : 'danger'}>
          {user.attendance}
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


