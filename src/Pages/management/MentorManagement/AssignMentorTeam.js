



import React, { useState, useEffect } from 'react';
import { 
  Table, Button, ButtonGroup, Badge, InputGroup, Form, 
  Spinner, Modal, Card, ListGroup, Alert, Row, Col,
  Pagination 
} from 'react-bootstrap';
import {
  Search,
  PersonPlus,
  PersonCheck,
  PeopleFill,
  InfoCircle,
  CheckCircle,
  XCircle
} from 'react-bootstrap-icons';
import axios from 'axios';
import { toast } from 'react-toastify';

// Helper: Find and return array of items with assigned status
const getPreselected = (items) =>
  items.filter(item => item.status === 'Assigned');

const AssignMentorTeam = () => {
  // State variables
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [locationList, setLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAssignment, setLoadingAssignment] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalMentors, setTotalMentors] = useState(0);

  const getLocationString = (location) => {
    if (!location) return '-';
    return typeof location === 'object' ? location.location : location;
  };

  // Fetch mentors data with pagination and filters
  const fetchMentors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      let statusFilter = '';
      if (filters.status === 'active') statusFilter = '1';
      else if (filters.status === 'blocked') statusFilter = '2';
      else if (filters.status === 'not verified') statusFilter = '0';
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search,
        filterLocation: filters.location,
        status: statusFilter
      };
      const res = await axios.get('http://localhost:5010/api/admin/getRegister/mentor', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params
      });
      setMentors(res.data.users || []);
      setTotalMentors(res.data.total || 0);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      toast.error('Failed to load mentors');
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://localhost:5010/api/location/getAllLocations', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
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

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  useEffect(() => {
    fetchMentors();
  }, [currentPage, itemsPerPage, filters]);

  useEffect(() => {
    fetchMentors();
    fetchLocations();
  }, []);

  // --- Modal fetch and selection logic ---

  // Fetch instructors by mentor/location, mark assigned as selected
  const fetchInstructorsByLocation = async (mentorId) => {
    try {
      setLoadingInstructors(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(
        `http://localhost:5010/api/assignInstructor/getInstructorByLocation/${mentorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInstructors(res.data.instructors || []);
      // Preselect instructors with status 'Assigned'
      setSelectedInstructors(getPreselected(res.data.instructors || []));
      setLoadingInstructors(false);
    } catch (err) {
      console.error('Error fetching instructors:', err);
      toast.error('Failed to load instructors');
      setInstructors([]);
      setSelectedInstructors([]);
      setLoadingInstructors(false);
    }
  };

  // Fetch users by selected instructor(s), and mark assigned as selected
  const fetchUsersByInstructors = async (instructorIds) => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem('adminToken');
      const usersPromises = instructorIds.map(async (instructorId) => {
        const res = await axios.get(
          `http://localhost:5010/api/assignInstructor/getUsersByInstructor/${instructorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return res.data.users || [];
      });
      const usersArrays = await Promise.all(usersPromises);
      const combinedUsers = usersArrays.flat();
      // Only unique users by _id
      const uniqueUsers = combinedUsers.filter(
        (user, index, self) => index === self.findIndex(u => u._id === user._id)
      );

      setUsers(uniqueUsers);
      // Preselect users with status 'Assigned'
      setSelectedUsers(getPreselected(uniqueUsers));
      setLoadingUsers(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
      setSelectedUsers([]);
      setLoadingUsers(false);
      toast.error('Failed to load users');
    }
  };

  // When selectedInstructors change, refetch their users and preselect
  useEffect(() => {
    if (selectedInstructors.length > 0) {
      fetchUsersByInstructors(selectedInstructors.map(i => i._id));
    } else {
      setUsers([]);
      setSelectedUsers([]);
    }
  }, [selectedInstructors]);

  // Filter users based on search term
  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(user =>
        user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [users, userSearchTerm]);

  const clearSelections = () => {
    setSelectedInstructors([]);
    setSelectedUsers([]);
  };

  // Modal open will preselect based on data from backend
  const openAssignModal = (mentor) => {
    setSelectedUser(mentor);
    setUserSearchTerm('');
    setUsers([]);
    setSelectedUsers([]);
    setInstructors([]);
    setSelectedInstructors([]);
    fetchInstructorsByLocation(mentor._id);
    setShowAssignModal(true);
  };

  // Assign Team logic -- always send selected, even if empty for unassignment
  const handleAssignTeam = async () => {
    try {
      setLoadingAssignment(true);
      const token = localStorage.getItem('adminToken');
      const payload = {
        instructors: selectedInstructors.map(instructor => ({
          instructorId: instructor._id,
          userIds: selectedUsers.map(user => user._id)
        }))
      };
      await axios.post(
        `http://localhost:5010/api/assignInstructor/assignInstructorAndUsers/${selectedUser._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Team assigned successfully!');
      setShowAssignModal(false);
      clearSelections();
      setLoadingAssignment(false);
    } catch (err) {
      console.error('Error assigning team:', err);
      toast.error(err.response?.data?.message || 'Failed to assign team');
      setLoadingAssignment(false);
    }
  };

  // Individual instructor selection toggle
  const toggleInstructorSelection = (instructor) => {
    setSelectedInstructors(prev => {
      const isSelected = prev.some(i => i._id === instructor._id);
      if (isSelected) {
        // Also remove from selected users users of this instructor
        return prev.filter(i => i._id !== instructor._id);
      } else {
        return [...prev, instructor];
      }
    });
  };

  // Individual user selection toggle
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

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)', fontWeight: '600' }}>Mentor Team Management</h2>
      </div>

      {/* Filters Section */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search by name or email..."
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          >
            <option value="">All Locations</option>
            {locationList.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="not verified">Not Verified</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Mentors Table */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
        <div className="table-responsive mb-3">
        <Table striped bordered hover style={{ borderRadius: '10px', overflow: 'hidden' }}>
          <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
            <tr>
              <th>#</th>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map((mentor, index) => (
              <tr key={mentor._id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
                <td>
                  <Badge 
                    pill 
                    bg={
                      mentor.accountStatus === 'active' ? 'success' : 
                      mentor.accountStatus === 'blocked' ? 'danger' : 
                      'warning'
                    }
                  >
                    {mentor.accountStatus === 'active' ? 'Active' : 
                    mentor.accountStatus === 'blocked' ? 'Blocked' : 
                    mentor.accountStatus === 'not verified' ? 'Not Verified' : 
                    mentor.accountStatus}
                  </Badge>
                </td>
                <td>
                  <ButtonGroup>
                    <Button 
                      variant="outline-success" 
                      size="sm" 
                      onClick={() => openAssignModal(mentor)}
                      title="Assign Team"
                      style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                    >
                      <PersonPlus />
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
        {/* Pagination */}
        {totalMentors > itemsPerPage && (
        <div className="d-flex justify-content-between align-items-center">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, totalMentors)} of {totalMentors} mentors
          </div>
          <Pagination>
            <Pagination.First 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1} 
            />
            <Pagination.Prev 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1} 
            />
            {Array.from({ length: Math.min(5, Math.ceil(totalMentors / itemsPerPage)) }, (_, i) => {
              let pageNum;
              const totalPages = Math.ceil(totalMentors / itemsPerPage);
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}
            <Pagination.Next 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === Math.ceil(totalMentors / itemsPerPage)} 
            />
            <Pagination.Last 
              onClick={() => handlePageChange(Math.ceil(totalMentors / itemsPerPage))} 
              disabled={currentPage === Math.ceil(totalMentors / itemsPerPage)} 
            />
          </Pagination>
        </div>
        )}
        </>
      )}

      {/* Assign Team Modal */}
      <Modal 
        show={showAssignModal} 
        onHide={() => {
          setShowAssignModal(false);
          clearSelections();
        }}
        size="xl"
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <Modal.Title className="d-flex align-items-center">
            <PeopleFill className="me-2" size={24} />
            <div>
              <h5 className="mb-0">Assign Team to {selectedUser?.name || 'Mentor'}</h5>
              <small className="text-white-50">Select instructors and their users</small>
            </div>
          </Modal.Title>
          <Button 
            variant="light"
            className="ms-3"
            onClick={clearSelections}
            size="sm"
            style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
          >
            Clear Selection
          </Button>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
          <Row>
            {/* Instructors Column */}
            <Col md={5} className="pe-2">
              <Card className="h-100 shadow-sm" style={{ borderColor: 'var(--secondary)' }}>
                <Card.Header
                  className="d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: 'var(--secondary)', color: 'white' }}
                >
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
                          active={selectedInstructors.some(i => i._id === instructor._id)}
                          onClick={() => toggleInstructorSelection(instructor)}
                          className="py-3"
                          style={{
                            backgroundColor:
                              instructor.status === 'Assigned'
                                ? 'rgba(25, 135, 84, 0.1)'
                                : selectedInstructors.some(i => i._id === instructor._id)
                                ? 'rgba(13, 110, 253, 0.1)' : 'white',
                            borderLeft:
                              instructor.status === 'Assigned'
                                ? '4px solid var(--success)'
                                : selectedInstructors.some(i => i._id === instructor._id)
                                ? '4px solid var(--primary)'
                                : 'none',
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <div className="position-relative me-3">
                              <img
                                src={
                                  instructor.profilePicture ||
                                  'https://via.placeholder.com/50'
                                }
                                alt="Profile"
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '2px solid var(--accent)',
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
                                <h6 className="mb-0" style={{ color: 'var(--secondary)' }}>
                                  {instructor.name}
                                </h6>
                                <Badge
                                  pill
                                  bg={instructor.status === 'Assigned' ? 'success' : 'light'}
                                  text={instructor.status === 'Assigned' ? 'white' : 'dark'}
                                >
                                  {instructor.status || 'Unassigned'}
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
                      {selectedInstructors.length > 0 
                        ? `${selectedInstructors.length} Selected Instructor${selectedInstructors.length !== 1 ? 's' : ''}'s Users` 
                        : 'Select Instructor(s)'}
                    </h5>
                    {selectedInstructors.length > 0 && (
                      <small>
                        Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                      </small>
                    )}
                  </div>
                  {loadingUsers && <Spinner animation="border" size="sm" variant="light" />}
                </Card.Header>
                <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {selectedInstructors.length > 0 ? (
                    <>
                      <div className="mb-3">
                        <InputGroup>
                          <InputGroup.Text>
                            <Search />
                          </InputGroup.Text>
                          <Form.Control
                            placeholder="Search users..."
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                          />
                        </InputGroup>
                      </div>
                      {filteredUsers.length > 0 ? (
                        <ListGroup variant="flush">
                          {filteredUsers.map(user => (
                            <ListGroup.Item
                              key={user._id}
                              action
                              active={selectedUsers.some(u => u._id === user._id)}
                              onClick={() => toggleUserSelection(user)}
                              className="py-3"
                              style={{
                                backgroundColor:
                                  user.status === 'Assigned'
                                    ? 'rgba(25, 135, 84, 0.1)'
                                    : selectedUsers.some(u => u._id === user._id)
                                    ? 'rgba(13, 110, 253, 0.1)'
                                    : 'white',
                                borderLeft:
                                  user.status === 'Assigned'
                                    ? '4px solid var(--success)'
                                    : selectedUsers.some(u => u._id === user._id)
                                    ? '4px solid var(--primary)'
                                    : 'none',
                              }}
                            >
                              <div className="d-flex align-items-center">
                                <div className="position-relative me-3">
                                  <img
                                    src={user.profilePicture || 'https://via.placeholder.com/50'}
                                    alt="Profile"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '50%',
                                      objectFit: 'cover',
                                      border: '2px solid var(--accent)'
                                    }}
                                  />
                                  <Badge
                                    bg={user.status === 'Assigned' ? 'success' : 'secondary'}
                                    className="position-absolute top-0 start-100 translate-middle"
                                    pill
                                  >
                                    {user.status === 'Assigned' ? (
                                      <CheckCircle size={12} />
                                    ) : (
                                      <XCircle size={12} />
                                    )}
                                  </Badge>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0" style={{ color: 'var(--secondary)' }}>
                                      {user.name}
                                    </h6>
                                    <Badge 
                                      pill 
                                      bg={user.status === 'Assigned' ? 'success' : 'light'} 
                                      text={user.status === 'Assigned' ? 'white' : 'dark'}
                                    >
                                      {user.status || 'Unassigned'}
                                    </Badge>
                                  </div>
                                  <small className="text-muted d-block">{user.email}</small>
                                  <small className="text-muted">{user.number}</small>
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <Alert variant="info" className="text-center">
                          {loadingUsers ? 'Loading users...' : 'No users found matching your search'}
                        </Alert>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-5">
                      <PeopleFill size={48} className="mb-3" style={{ color: 'var(--secondary)' }} />
                      <h5 style={{ color: 'var(--secondary)' }}>Select Instructor(s)</h5>
                      <p className="text-muted">Choose one or more instructors to view their users</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Selected Summary Section */}
          <div className="mt-3">
            {/* Selected Instructors */}
            {selectedInstructors.length > 0 && (
              <Card className="mb-3" style={{ borderColor: 'var(--primary)' }}>
                <Card.Header style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                  <strong>Selected Instructors ({selectedInstructors.length})</strong>
                </Card.Header>
                <Card.Body className="p-3">
                  <div className="d-flex flex-wrap gap-2">
                    {selectedInstructors.map(instructor => (
                      <Badge 
                        key={instructor._id} 
                        pill
                        className="d-flex align-items-center p-2"
                        style={{ 
                          backgroundColor: 'var(--primary)',
                          borderRadius: '20px'
                        }}
                      >
                        <img
                          src={instructor.profilePicture || 'https://via.placeholder.com/30'}
                          alt="Profile"
                          style={{ 
                            width: '20px', 
                            height: '20px', 
                            borderRadius: '50%',
                            marginRight: '8px'
                          }}
                        />
                        {instructor.name}
                        <button 
                          type="button" 
                          className="btn-close btn-close-white ms-2" 
                          style={{ fontSize: '0.5rem' }} 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleInstructorSelection(instructor);
                          }}
                          aria-label="Remove"
                        />
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <Card style={{ borderColor: 'var(--success)' }}>
                <Card.Header style={{ backgroundColor: 'var(--success)', color: 'white' }}>
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
                          backgroundColor: 'var(--success)',
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
          </div>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'var(--accent)' }}>
          <Button 
            variant="outline-secondary" 
            onClick={() => {
              setShowAssignModal(false);
              clearSelections();
            }}
            style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAssignTeam}
            disabled={loadingAssignment}
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