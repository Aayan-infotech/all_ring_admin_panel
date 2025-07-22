
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, Button, ButtonGroup, Badge, Modal, Form, InputGroup, Spinner, Row, Col
} from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignTeam = () => {
  const [instructors, setInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [showAddCanvas, setShowAddCanvas] = useState(false);
  const [showPrisonerCanvas, setShowPrisonerCanvas] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState('');
  const [locationObjects, setLocationObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationList, setLocationList] = useState([]);
  
  // New states for assign users functionality
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    fetchInstructors();
    fetchLocations();
  }, []);

  const getLocationString = (location) => {
    if (!location) return '-';
    return typeof location === 'object' ? location.location : location;
  };

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://98.85.246.54:5010/api/admin/getRegister/instructor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allUsers = (res.data.users || []).map(user => ({
        ...user,
        status: user.user_status === 1 ? 'active' : 'inactive'
      }));
      setInstructors(allUsers);

      const locations = [...new Set(allUsers.map(user => user.location).filter(Boolean))];
      
    } catch (err) {
      console.error('Failed to fetch instructors:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://98.85.246.54:5010/api/location/getAllLocations');
      const locations = res.data?.data || [];
      const activeLocationNames = locations
        .filter(loc => loc.status === 'Active') 
        .map(loc => loc.location);            
      setLocationList(activeLocationNames);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
      toast.error("Failed to load locations");
    }
  };

  const filteredInstructors = instructors.filter(i => {
    const nameMatch = i.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = selectedStatus ? i.status === selectedStatus : true;
    const locationMatch = selectedLocation 
      ? getLocationString(i.location) === selectedLocation 
      : true;
    return nameMatch && statusMatch && locationMatch;
  });






const handleAssignClick = async (instructorId) => {
  setSelectedInstructorId(instructorId);
  try {
    setAssignLoading(true);
    const token = localStorage.getItem('adminToken');
    const response = await axios.get(
      `http://98.85.246.54:5010/api/assignUsers/getUsersByLocation/${instructorId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const users = response.data.users || [];

    // Set available users
    setAvailableUsers(users);

    // Pre-select users that are already assigned
    const preSelected = users
      .filter(user => user.status === 'Assigned')
      .map(user => user._id);

    setSelectedUsers(preSelected);

    setShowAssignModal(true);
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error('Failed to fetch users');
  } finally {
    setAssignLoading(false);
  }
};


  const handleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const assignUsersToInstructor = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    try {
      setAssignLoading(true);
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `http://98.85.246.54:5010/api/assignUsers/assignToInstructor/${selectedInstructorId}`,
        { userIds: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Users assigned successfully');
      setShowAssignModal(false);
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error assigning users:', error);
      toast.error('Failed to assign users');
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="mb-3">
        <h3>Assign Team</h3>
      </div>

      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              placeholder="Search by name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Filter by Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Filter by Location</option>
            {locationList.map((loc, idx) => (
              <option key={idx} value={loc}>
                {loc}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              {/* <th>Status</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstructors.map((instructor, index) => (
              <tr key={instructor._id}>
                <td>{index + 1}</td>
                <td>{instructor.name}</td>
                <td>{instructor.email}</td>
                <td>{getLocationString(instructor.location)}</td>
                {/* <td>
                  <Badge bg={instructor.user_status === 1 ? 'success' : 'danger'}>
                    {instructor.user_status === 1 ? 'Active' : 'Inactive'}
                  </Badge>
                </td> */}
                <td>
                  <ButtonGroup>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleAssignClick(instructor._id)}
                    >
                      Assign Users
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Assign Users Modal */}
      {/* <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Assign Users to Instructor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {assignLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {availableUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleUserSelection(user._id)}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{getLocationString(user.location)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={assignUsersToInstructor}
            disabled={assignLoading || selectedUsers.length === 0}
          >
            {assignLoading ? 'Assigning...' : 'Assign Selected Users'}
          </Button>
        </Modal.Footer>
      </Modal> */}

      {/* Assign Users Modal */}
<Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} size="lg">
  <Modal.Header 
    closeButton 
    style={{
      backgroundColor: 'var(--secondary)',
      color: 'white',
      borderBottom: '2px solid var(--primary)'
    }}
  >
    <Modal.Title style={{ fontWeight: '600' }}>
      Assign Users to Instructor
    </Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
    {assignLoading ? (
      <div className="text-center py-4">
        <Spinner 
          animation="border" 
          style={{ color: 'var(--primary)' }} 
        />
        <p className="mt-2" style={{ color: 'var(--secondary)' }}>
          Loading available users...
        </p>
      </div>
    ) : (
      <>
        {availableUsers.length === 0 ? (
          <div className="text-center py-4">
            <i 
              className="bi bi-people-fill" 
              style={{ fontSize: '2rem', color: 'var(--secondary)' }}
            ></i>
            <p className="mt-2" style={{ color: 'var(--secondary)' }}>
              No users available at this location
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table bordered hover style={{ borderColor: 'var(--secondary)' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
                  <th style={{ width: '50px' }}>Select</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {availableUsers.map((user) => (
                  <tr 
                    key={user._id} 
                    style={{ 
                      backgroundColor: selectedUsers.includes(user._id) 
                        ? 'rgba(232, 53, 97, 0.1)' 
                        : 'white'
                    }}
                  >
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleUserSelection(user._id)}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{getLocationString(user.location)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </>
    )}
  </Modal.Body>
  <Modal.Footer style={{ 
    backgroundColor: 'var(--accent)',
    borderTop: '2px solid var(--primary)'
  }}>
    <Button 
      variant="outline-secondary" 
      onClick={() => {
        setShowAssignModal(false);
        setSelectedUsers([]);
      }}
      style={{ 
        borderColor: 'var(--secondary)',
        color: 'var(--secondary)'
      }}
    >
      Cancel
    </Button>
    <Button 
      variant="primary" 
      onClick={assignUsersToInstructor}
      disabled={assignLoading || selectedUsers.length === 0}
      style={{ 
        backgroundColor: selectedUsers.length === 0 
          ? 'var(--secondary)' 
          : 'var(--primary)',
        borderColor: 'var(--primary)',
        opacity: selectedUsers.length === 0 ? 0.6 : 1
      }}
    >
      {assignLoading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            style={{ marginRight: '5px' }}
          />
          Assigning...
        </>
      ) : (
        `Assign ${selectedUsers.length} User${selectedUsers.length !== 1 ? 's' : ''}`
      )}
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default AssignTeam;