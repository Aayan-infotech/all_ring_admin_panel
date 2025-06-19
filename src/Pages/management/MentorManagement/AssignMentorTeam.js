



import React, { useState, useEffect } from 'react';
import { 
  Table, Button, ButtonGroup, Badge, InputGroup, Form, 
  Spinner, Modal, Card, ListGroup, Alert, Row, Col 
} from 'react-bootstrap';
import {
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
      setInstructors(res.data.instructors || []);
      setLoadingInstructors(false);
    } catch (err) {
      console.error('Error fetching instructors:', err);
      toast.error('Failed to load instructors');
      setLoadingInstructors(false);
    }
  };

  // Fetch users by instructors
  const fetchUsersByInstructors = async (instructorIds) => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem('adminToken');
      
      // Fetch users for each instructor and combine
      const usersPromises = instructorIds.map(async (instructorId) => {
        const res = await axios.get(
          `http://18.209.91.97:5010/api/assignInstructor/getUsersByInstructor/${instructorId}`,
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
      
      // Remove duplicates
      const uniqueUsers = combinedUsers.filter(
        (user, index, self) => index === self.findIndex(u => u._id === user._id)
      );
      
      setUsers(uniqueUsers);
      setLoadingUsers(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
      setLoadingUsers(false);
    }
  };


const handleAssignTeam = async () => {
    if (selectedInstructors.length === 0 || selectedUsers.length === 0) {
      toast.error('Please select at least one instructor and one user');
      return;
    }

    try {
      setLoadingAssignment(true);
      const token = localStorage.getItem('adminToken');
      
      // Create payload in the required format
      const payload = {
        instructors: selectedInstructors.map(instructor => ({
          instructorId: instructor._id,
          userIds: selectedUsers.map(user => user._id)
        }))
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
      setSelectedInstructors([]);
      setSelectedUsers([]);
      setLoadingAssignment(false);
    } catch (err) {
      console.error('Error assigning team:', err);
      toast.error(err.response?.data?.message || 'Failed to assign team');
      setLoadingAssignment(false);
    }
  };
  // Toggle instructor selection
  const toggleInstructorSelection = (instructor) => {
    setSelectedInstructors(prev => {
      const isSelected = prev.some(i => i._id === instructor._id);
      if (isSelected) {
        return prev.filter(i => i._id !== instructor._id);
      } else {
        return [...prev, instructor];
      }
    });
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
    setSelectedInstructors([]);
    setSelectedUsers([]);
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

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // Initial data fetch
  useEffect(() => {
    fetchMentors();
    fetchLocations();
  }, []);

  // Fetch users when selected instructors change
  useEffect(() => {
    if (selectedInstructors.length > 0) {
      fetchUsersByInstructors(selectedInstructors.map(i => i._id));
    } else {
      setUsers([]);
    }
  }, [selectedInstructors]);

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
                {/* <th>Status</th> */}
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
                  {/* <td>
                    <Badge 
                      bg={mentor.accountStatus === 'active' ? 'success' : 'danger'}
                      style={{ 
                        backgroundColor: mentor.accountStatus === 'active' ? 'var(--success)' : 'var(--danger)'
                      }}
                    >
                      {mentor.accountStatus || 'inactive'}
                    </Badge>
                  </td> */}
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
      )}

      {/* Assign Team Modal */}
      <Modal 
        show={showAssignModal} 
        onHide={() => {
          setShowAssignModal(false);
          setSelectedInstructors([]);
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
              <small className="text-white-50">Select instructors and their users</small>
            </div>
          </Modal.Title>
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
                              selectedInstructors.some(i => i._id === instructor._id) 
                                ? 'rgba(13, 110, 253, 0.1)' 
                                : 'white',
                            borderLeft:
                              selectedInstructors.some(i => i._id === instructor._id)
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
                        // <ListGroup variant="flush">
                        //   {filteredUsers.map(user => (
                        //     <ListGroup.Item 
                        //       key={user._id}
                        //       action
                        //       active={selectedUsers.some(u => u._id === user._id)}
                        //       onClick={() => toggleUserSelection(user)}
                        //       className="py-3"
                        //       style={{ 
                        //         backgroundColor: selectedUsers.some(u => u._id === user._id) 
                        //           ? 'rgba(13, 110, 253, 0.1)' 
                        //           : 'white',
                        //         borderLeft: selectedUsers.some(u => u._id === user._id) 
                        //           ? '4px solid var(--primary)' 
                        //           : 'none'
                        //       }}
                        //     >
                        //       <div className="d-flex align-items-center">
                        //         <div className="position-relative me-3">
                        //           <img
                        //             src={user.profilePicture || 'https://via.placeholder.com/50'}
                        //             alt="Profile"
                        //             style={{ 
                        //               width: '40px', 
                        //               height: '40px', 
                        //               borderRadius: '50%',
                        //               objectFit: 'cover',
                        //               border: '2px solid var(--accent)'
                        //             }}
                        //           />
                        //           {selectedUsers.some(u => u._id === user._id) && (
                        //             <Badge 
                        //               bg="primary"
                        //               className="position-absolute top-0 start-100 translate-middle"
                        //               pill
                        //               style={{ backgroundColor: 'var(--primary)' }}
                        //             >
                        //               <CheckCircle size={12} />
                        //             </Badge>
                        //           )}
                        //         </div>
                                
                        //         <div className="flex-grow-1">
                        //           <div className="d-flex justify-content-between align-items-center">
                        //             <h6 className="mb-0" style={{ color: 'var(--secondary)' }}>
                        //               {user.name}
                        //             </h6>
                        //             <Badge 
                        //               pill 
                        //               bg={user.status === 'Assigned' ? 'success' : 'light'} 
                        //               text={user.status === 'Assigned' ? 'white' : 'dark'}
                        //             >
                        //               {user.status || 'Unassigned'}
                        //             </Badge>
                        //           </div>
                        //           <small className="text-muted d-block">{user.email}</small>
                        //           <small className="text-muted">{user.number}</small>
                        //         </div>
                        //       </div>
                        //     </ListGroup.Item>
                        //   ))}
                        // </ListGroup>

                        <ListGroup variant="flush">
  {filteredUsers.map(user => (
    <ListGroup.Item 
      key={user._id}
      action
      active={selectedUsers.some(u => u._id === user._id)}
      onClick={() => toggleUserSelection(user)}
      className="py-3"
      style={{ 
        backgroundColor: selectedUsers.some(u => u._id === user._id) 
          ? 'rgba(13, 110, 253, 0.1)' 
          : 'white',
        borderLeft: selectedUsers.some(u => u._id === user._id) 
          ? '4px solid var(--primary)' 
          : 'none'
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
              setSelectedInstructors([]);
              setSelectedUsers([]);
            }}
            style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAssignTeam}
            disabled={selectedInstructors.length === 0 || selectedUsers.length === 0 || loadingAssignment}
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