
import React, { useState, useEffect } from 'react';
import { 
  Table, Button, ButtonGroup, Badge, InputGroup, Form, 
  Spinner, Modal, Card, ListGroup, Alert, Row, Col 
} from 'react-bootstrap';
import {
  PencilSquare,
  Search,
  PersonPlus,
  PersonCheck,
  PeopleFill,
  InfoCircle,
  CheckCircle,
  XCircle,
  PlusCircle,
  EyeFill,
  LockFill
} from 'react-bootstrap-icons';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AddMentorOffcanvas from './AddMentorOffcanvas';

const AssignMentorTeam = () => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  // State variables
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [locationList, setLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    expertise: '',
    locationId: ''
  });
  const [instructors, setInstructors] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAssignment, setLoadingAssignment] = useState(false);

  // Helper function to get location string
  const getLocationString = (location) => {
    if (!location) return '-';
    return typeof location === 'object' ? location.location : location;
  };

  // Fetch mentors data
  const fetchMentors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://18.209.91.97:5010/api/admin/getRegister/mentor', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMentors(res.data.users || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setLoading(false);
    }
  };

  // Fetch locations data
  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://18.209.91.97:5010/api/location/getAllLocations');
      const locations = res.data?.data || [];
      const activeLocations = locations
        .filter(loc => loc.status === 'Active')
        .map(loc => ({
          id: loc._id,
          name: loc.location
        }));
      setLocationList(activeLocations);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
      toast.error("Failed to load locations");
    }
  };

  // Fetch instructors by location
  const fetchInstructorsByLocation = async (mentorId) => {
    try {
      setLoadingInstructors(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(
        `http://18.209.91.97:5010/api/assignInstructor/getInstructorByLocation/${mentorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInstructors(res.data.Instructors || []);
      setLoadingInstructors(false);
    } catch (err) {
      console.error('Error fetching instructors:', err);
      toast.error('Failed to load instructors');
      setLoadingInstructors(false);
    }
  };

  // Fetch users by instructor
  const fetchUsersByInstructor = async (instructorId) => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(
        `http://18.209.91.97:5010/api/assignInstructor/getUsersByInstructor/${instructorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(res.data.users || []);
      setLoadingUsers(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
      setLoadingUsers(false);
    }
  };

  // Handle team assignment
  const handleAssignTeam = async () => {
    if (!selectedUser || !selectedInstructor || selectedUsers.length === 0) {
      toast.error('Please select an instructor and at least one user');
      return;
    }

    try {
      setLoadingAssignment(true);
      const token = localStorage.getItem('adminToken');
      const payload = {
        instructorId: selectedInstructor._id,
        userIds: selectedUsers.map(user => user._id)
      };

      await axios.post(
        `http://18.209.91.97:5010/api/assignInstructor/assignInstructorAndUsers/${selectedUser._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Team assigned successfully!');
      setShowAssignModal(false);
      setSelectedInstructor(null);
      setSelectedUsers([]);
      setLoadingAssignment(false);
    } catch (err) {
      console.error('Error assigning team:', err);
      toast.error('Failed to assign team');
      setLoadingAssignment(false);
    }
  };

  // Toggle user selection
  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u._id === user._id);
      if (isSelected) {
        return prev.filter(u => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

  // Open assign modal
  const openAssignModal = (mentor) => {
    setSelectedUser(mentor);
    fetchInstructorsByLocation(mentor._id);
    setShowAssignModal(true);
  };


  // Filter mentors based on search and filters
  const filteredMentors = mentors.filter((mentor) => {
    const nameMatch =
      mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const locationMatch = selectedLocation 
      ? mentor.location?._id === selectedLocation 
      : true;

    const statusMatch = selectedStatus 
      ? mentor.accountStatus === selectedStatus 
      : true;

    return nameMatch && locationMatch && statusMatch;
  });

  // Initial data fetch
  useEffect(() => {
    fetchMentors();
    fetchLocations();
  }, []);

  // Update form data when selected user changes
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || '',
        expertise: selectedUser.expertise || '',
        locationId: selectedUser.location?._id || ''
      });
    }
  }, [selectedUser]);

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)', fontWeight: '600' }}>Mentor Team Management</h2>
       
      </div>

      {/* Filters Section */}
      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <InputGroup>
            <InputGroup.Text style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' }}>
              <Search style={{ color: 'var(--primary)' }} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                border: '1px solid var(--accent)',
                borderRadius: '0 8px 8px 0',
                backgroundColor: 'var(--accent)'
              }}
            />
          </InputGroup>
        </div>

        <div className="col-md-4 mb-2">
          <Form.Select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{ 
              borderRadius: '8px',
              border: '1px solid var(--accent)',
              backgroundColor: 'var(--accent)'
            }}
          >
            <option value="">Filter by Location</option>
            {locationList.map((loc, idx) => (
              <option key={idx} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col-md-4 mb-2">
          <Form.Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ 
              borderRadius: '8px',
              border: '1px solid var(--accent)',
              backgroundColor: 'var(--accent)'
            }}
          >
            <option value="">Filter by Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>
        </div>
      </div>

      {/* Mentors Table */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" style={{ color: 'var(--primary)' }} />
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover style={{ borderRadius: '10px', overflow: 'hidden' }}>
            <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
              <tr>
                <th>#</th>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Expertise</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentors.map((mentor, index) => (
                <tr key={mentor._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={mentor.profilePicture || 'https://via.placeholder.com/40'}
                      alt="Profile"
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                        border: '2px solid var(--accent)'
                      }}
                    />
                  </td>
                  <td>{mentor.name || '-'}</td>
                  <td>{mentor.email || '-'}</td>
                  <td>{getLocationString(mentor.location)}</td>
                  <td>{mentor.expertise || '-'}</td>
                  <td>
                    <Badge 
                      bg={mentor.accountStatus === 'active' ? 'success' : 'danger'}
                      style={{ 
                        backgroundColor: mentor.accountStatus === 'active' ? 'var(--success)' : 'var(--danger)'
                      }}
                    >
                      {mentor.accountStatus || 'inactive'}
                    </Badge>
                  </td>
                  <td>
                    <ButtonGroup>
                      {/* <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => {
                          setSelectedUser(mentor);
                          setShowProfileModal(true);
                        }}
                        title="View Profile"
                        style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
                      >
                        <EyeFill />
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={() => {
                          setSelectedUser(mentor);
                          setShowEditModal(true);
                        }}
                        title="Edit"
                        style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
                      >
                        <PencilSquare />
                      </Button> */}
                      <Button 
                        variant="outline-success" 
                        size="sm" 
                        onClick={() => openAssignModal(mentor)}
                        title="Assign Team"
                        style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                      >
                        <PersonPlus />
                      </Button>
                      {/* <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => {
                          setSelectedUser(mentor);
                          setShowResetModal(true);
                        }}
                        title="Reset Password"
                        style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                      >
                        <LockFill />
                      </Button> */}
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Assign Team Modal */}
      <Modal 
        show={showAssignModal} 
        onHide={() => {
          setShowAssignModal(false);
          setSelectedInstructor(null);
          setSelectedUsers([]);
        }}
        size="xl"
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <Modal.Title className="d-flex align-items-center">
            <PeopleFill className="me-2" size={24} />
            <div>
              <h5 className="mb-0">Assign Team to {selectedUser?.name || 'Mentor'}</h5>
              <small className="text-white-50">Select an instructor and their users</small>
            </div>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
          <Row>
            {/* Instructors Column */}
            <Col md={5} className="pe-2">
              <Card className="h-100 shadow-sm" style={{ borderColor: 'var(--secondary)' }}>
                <Card.Header className="d-flex justify-content-between align-items-center" 
                  style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 me-2">Available Instructors</h5>
                    <InfoCircle />
                  </div>
                  {loadingInstructors && <Spinner animation="border" size="sm" variant="light" />}
                </Card.Header>
                
                <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {instructors.length > 0 ? (
                    <ListGroup variant="flush">
                      {instructors.map(instructor => (
                        <ListGroup.Item 
                          key={instructor._id}
                          action
                          active={selectedInstructor?._id === instructor._id}
                          onClick={() => {
                            setSelectedInstructor(instructor);
                            fetchUsersByInstructor(instructor._id);
                          }}
                          className="py-3"
                          style={{ 
                            backgroundColor: selectedInstructor?._id === instructor._id ? 'var(--accent)' : 'white',
                            borderLeft: selectedInstructor?._id === instructor._id ? '4px solid var(--primary)' : 'none'
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <div className="position-relative me-3">
                              <img
                                src={instructor.profilePicture || 'https://via.placeholder.com/50'}
                                alt="Profile"
                                style={{ 
                                  width: '50px', 
                                  height: '50px', 
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '2px solid var(--accent)'
                                }}
                              />
                              <Badge 
                                bg={instructor.status === 'Assigned' ? 'success' : 'secondary'}
                                className="position-absolute top-0 start-100 translate-middle"
                                pill
                              >
                                {instructor.status === 'Assigned' ? (
                                  <CheckCircle size={12} />
                                ) : (
                                  <XCircle size={12} />
                                )}
                              </Badge>
                            </div>
                            
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0" style={{ color: 'var(--secondary)' }}>{instructor.name}</h6>
                                <Badge 
                                  pill 
                                  bg={instructor.status === 'Assigned' ? 'success' : 'light'} 
                                  text={instructor.status === 'Assigned' ? 'white' : 'dark'}
                                >
                                  {instructor.status}
                                </Badge>
                              </div>
                              <small className="text-muted d-block">{instructor.email}</small>
                              <small className="text-muted">{instructor.number}</small>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <Alert variant="info" className="text-center">
                      {loadingInstructors ? 'Loading instructors...' : 'No instructors available at this location'}
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            {/* Users Column */}
            <Col md={7} className="ps-2">
              <Card className="h-100 shadow-sm" style={{ borderColor: 'var(--secondary)' }}>
                <Card.Header className="d-flex justify-content-between align-items-center" 
                  style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
                  <div>
                    <h5 className="mb-0">
                      {selectedInstructor ? `${selectedInstructor.name}'s Users` : 'Select an Instructor'}
                    </h5>
                    {selectedInstructor && (
                      <small>
                        {users.length} user{users.length !== 1 ? 's' : ''} available
                      </small>
                    )}
                  </div>
                  {loadingUsers && <Spinner animation="border" size="sm" variant="light" />}
                </Card.Header>
                
                <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {selectedInstructor ? (
                    users.length > 0 ? (
                      <>
                        <ListGroup variant="flush">
                          {users.map(user => (
                            <ListGroup.Item 
                              key={user._id}
                              action
                              active={selectedUsers.some(u => u._id === user._id)}
                              onClick={() => toggleUserSelection(user)}
                              className="py-3"
                              style={{ 
                                backgroundColor: selectedUsers.some(u => u._id === user._id) ? 'var(--accent)' : 'white',
                                borderLeft: selectedUsers.some(u => u._id === user._id) ? '4px solid var(--primary)' : 'none'
                              }}
                            >
                              <div className="d-flex align-items-center">
                                <div className="position-relative me-3">
                                  <img
                                    src={user.profilePicture || 'https://via.placeholder.com/50'}
                                    alt="Profile"
                                    style={{ 
                                      width: '50px', 
                                      height: '50px', 
                                      borderRadius: '50%',
                                      objectFit: 'cover',
                                      border: '2px solid var(--accent)'
                                    }}
                                  />
                                  {selectedUsers.some(u => u._id === user._id) && (
                                    <Badge 
                                      bg="primary"
                                      className="position-absolute top-0 start-100 translate-middle"
                                      pill
                                      style={{ backgroundColor: 'var(--primary)' }}
                                    >
                                      <CheckCircle size={12} />
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex-grow-1">
                                  <h6 className="mb-0" style={{ color: 'var(--secondary)' }}>{user.name}</h6>
                                  <small className="text-muted d-block">{user.email}</small>
                                  <small className="text-muted">{user.number}</small>
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </>
                    ) : (
                      <Alert variant="info" className="text-center">
                        {loadingUsers ? 'Loading users...' : 'No users assigned to this instructor'}
                      </Alert>
                    )
                  ) : (
                    <div className="text-center py-5">
                      <PeopleFill size={48} className="mb-3" style={{ color: 'var(--secondary)' }} />
                      <h5 style={{ color: 'var(--secondary)' }}>Please select an instructor</h5>
                      <p className="text-muted">Users will appear here once you select an instructor</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Selected Users Summary */}
          {selectedUsers.length > 0 && (
            <Card className="mt-3" style={{ borderColor: 'var(--primary)' }}>
              <Card.Header style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                <strong>Selected Users ({selectedUsers.length})</strong>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="d-flex flex-wrap gap-2">
                  {selectedUsers.map(user => (
                    <Badge 
                      key={user._id} 
                      pill
                      className="d-flex align-items-center p-2"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        borderRadius: '20px'
                      }}
                    >
                      <img
                        src={user.profilePicture || 'https://via.placeholder.com/30'}
                        alt="Profile"
                        style={{ 
                          width: '20px', 
                          height: '20px', 
                          borderRadius: '50%',
                          marginRight: '8px'
                        }}
                      />
                      {user.name}
                      <button 
                        type="button" 
                        className="btn-close btn-close-white ms-2" 
                        style={{ fontSize: '0.5rem' }} 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleUserSelection(user);
                        }}
                        aria-label="Remove"
                      />
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        
        <Modal.Footer style={{ backgroundColor: 'var(--accent)' }}>
          <Button 
            variant="outline-secondary" 
            onClick={() => {
              setShowAssignModal(false);
              setSelectedInstructor(null);
              setSelectedUsers([]);
            }}
            style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAssignTeam}
            disabled={!selectedInstructor || selectedUsers.length === 0 || loadingAssignment}
            className="d-flex align-items-center"
            style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}
          >
            {loadingAssignment ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Assigning Team...
              </>
            ) : (
              <>
                <PersonCheck className="me-2" />
                Assign Selected Team
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

   


    </div>
  );
};

export default AssignMentorTeam;