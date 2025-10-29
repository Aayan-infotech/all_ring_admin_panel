




import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Row, 
  Col, 
  ButtonGroup, 
  Badge, 
  InputGroup, 
  Form, 
  Spinner, 
  Modal, 
  Breadcrumb, 
  OverlayTrigger, 
  Tooltip, 
  Pagination 
} from 'react-bootstrap';
import {
  PencilSquare,
  CheckCircleFill,
  XCircleFill,
  PlusCircle,
  LockFill,
  EyeFill,
} from 'react-bootstrap-icons';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AddMentorOffcanvas from './AddMentorOffcanvas';
import API_BASE_URL from '../../../config/api';

const Mentors = () => {
  const { register, handleSubmit, reset, watch,formState: { errors } } = useForm();

  const [showAddMentor, setShowAddMentor] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [locationList, setLocationList] = useState([]);
  
  // Pagination and filtering state
  const [totalMentors, setTotalMentors] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    status: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    expertise: '',
    locationId: ''
  });

  // Helper function to get location string
  const getLocationString = (location) => {
    if (!location) return '-';
    return typeof location === 'object' ? location.location : location;
  };

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Convert status filter to match backend expectations
      let statusFilter = '';
      if (filters.status === 'active') {
        statusFilter = '1';
      } else if (filters.status === 'inactive') {
        statusFilter = '2';
      } else if (filters.status === 'not verified') {
        statusFilter = '0';
      }

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search,
        filterLocation: filters.location,
        status: statusFilter
      };

      const res = await axios.get(`${API_BASE_URL}/api/admin/getRegister/mentor`, {
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
      toast.error('Failed to fetch mentors');
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/api/location/getAllLocations`, {
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const toggleStatus = async (mentor) => {
    if (mentor.user_status === 0) {
      toast.error("❌ User email is not verified!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const newStatus = mentor.user_status === 1 ? 2 : 1;

      await axios.patch(
        `${API_BASE_URL}/api/admin/editUserStatus/${mentor._id}`,
        { user_status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchMentors(); // Refresh the list
      toast.success(`Status updated to ${newStatus === 1 ? 'Active' : 'Inactive'}`);
    } catch (err) {
      console.error('Error toggling status:', err);
      toast.error('Failed to update status');
    }
  };

  const handleResetPassword = async (formData) => {
    if (!selectedUser || !selectedUser._id) {
      console.error('No user selected for password reset.');
      return;
    }

    const { newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');

      await axios.put(
        `${API_BASE_URL}/api/admin/changeUserPassword/${selectedUser._id}`,
        { newPassword, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Password updated successfully!');
      reset();
      setShowResetModal(false);
    } catch (err) {
      console.error('Password reset failed:', err.response?.data || err.message);
      toast.error('Password reset failed!');
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedUser || !selectedUser._id) {
      toast.error("No user selected");
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('expertise', formData.expertise);
      formDataToSend.append('location', formData.locationId);

      const response = await axios.put(
        `${API_BASE_URL}/api/auth/update-user/${selectedUser._id}`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success("Profile updated successfully!");
      setShowEditModal(false);
      fetchMentors();
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    }
  };

  useEffect(() => {
    fetchMentors();
    fetchLocations();
  }, [currentPage, itemsPerPage, filters]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || '',
        expertise: selectedUser.expertise || '',
        locationId: selectedUser.location?._id || ''
      });
    }
  }, [selectedUser]);

  const totalPages = Math.ceil(totalMentors / itemsPerPage);

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="mb-4">
        <Breadcrumb style={{ backgroundColor: 'var(--light)', padding: '10px', borderRadius: '5px' }}>
          <Breadcrumb.Item 
            href="/dashboard" 
            style={{ 
              color: 'var(--secondary)', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <i className="fas fa-home me-2"></i> Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item 
            active 
            style={{ 
              color: 'var(--primary)', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <i className="fas fa-chalkboard-teacher me-2"></i> Mentor Management
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)', fontWeight: '600' }}>Mentor Management</h2>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Create a new mentor account</Tooltip>}
        >
          <Button
            variant="primary"
            onClick={() => setShowAddMentor(true)}
            style={{
              backgroundColor: 'var(--primary)',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
            }}
          >
            <PlusCircle className="me-2" />
            Add New Mentor
          </Button>
        </OverlayTrigger>
      </div>

      {/* Filter Controls */}
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
        <Col md={3}>
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
        <Col md={3}>
          <Form.Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="not verified">Not Verified</option>
          </Form.Select>
        </Col>
        {/* <Col md={2}>
          <Form.Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </Form.Select>
        </Col> */}
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover>
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
                {mentors.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No mentors found
                    </td>
                  </tr>
                ) : (
                  mentors.map((mentor, index) => (
                    <tr key={mentor._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        <img
                          src={mentor.profilePicture || 'https://via.placeholder.com/40'}
                          alt="Profile"
                          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        />
                      </td>
                      <td>{mentor.name || '-'}</td>
                      <td>{mentor.email || '-'}</td>
                      <td>{getLocationString(mentor.location)}</td>
                      <td>{mentor.expertise || '-'}</td>
                      <td>
                        <Badge
                          pill
                          bg={
                            mentor.user_status === 0 
                              ? 'warning' 
                              : mentor.user_status === 1
                                ? 'success' 
                                : 'danger'
                          }
                          style={{
                            padding: '8px 12px',
                            fontWeight: '500',
                          }}
                        >
                          {mentor.user_status === 0 
                            ? 'Unverified' 
                            : mentor.user_status === 1
                              ? 'Active' 
                              : 'Inactive'
                          }
                        </Badge>
                      </td>
                      <td>
                        <ButtonGroup>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>
                                {mentor.user_status === 0 
                                  ? "Email not verified" 
                                  : mentor.user_status === 1
                                    ? "Deactivate mentor" 
                                    : "Activate mentor"}
                              </Tooltip>
                            }
                          >
                            <Button
                              size="sm"
                              onClick={() => toggleStatus(mentor)}
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: '0 5px',
                                color: mentor.user_status === 0 ? 'gray' : 
                                      mentor.user_status === 1 ? 'var(--danger)' : 'var(--success)',
                                cursor: 'pointer',
                              }}
                            >
                              {mentor.user_status === 0 ? (
                                <XCircleFill size={20} />
                              ) : mentor.user_status === 1 ? (
                                <XCircleFill size={20} />
                              ) : (
                                <CheckCircleFill size={20} />
                              )}
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Edit mentor</Tooltip>}
                          >
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedUser(mentor);
                                setShowEditModal(true);
                              }}
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: '0 5px',
                                color: 'var(--warning)'
                              }}
                            >
                              <PencilSquare size={20} />
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>View profile</Tooltip>}
                          >
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedUser(mentor);
                                setShowProfileModal(true);
                              }}
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: '0 5px',
                                color: '#0d6efd'
                              }}
                            >
                              <EyeFill size={20} />
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Reset password</Tooltip>}
                          >
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedUser(mentor);
                                setShowResetModal(true);
                              }}
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: '0 5px',
                                color: '#17a2b8'
                              }}
                            >
                              <LockFill size={20} />
                            </Button>
                          </OverlayTrigger>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
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
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
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
                  disabled={currentPage === totalPages} 
                />
                <Pagination.Last 
                  onClick={() => handlePageChange(totalPages)} 
                  disabled={currentPage === totalPages} 
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      <AddMentorOffcanvas 
        show={showAddMentor} 
        handleClose={() => setShowAddMentor(false)} 
        onMentorAdded={fetchMentors} 
      />

      <Modal
        show={showResetModal}
        onHide={() => {
          setShowResetModal(false);
          reset();
        }}
        centered
        className="reset-password-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(handleResetPassword)}>
            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                {...register("newPassword", { required: true })}
                placeholder="Enter new password"
              />
              {errors.newPassword && (
                <small className="text-danger">New password is required</small>
              )}
            </Form.Group>
            <Form.Group controlId="confirmPassword" className="mt-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <small className="text-danger">
                  {errors.confirmPassword.message || "Confirm password is required"}
                </small>
              )}
            </Form.Group>
            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" onClick={() => setShowResetModal(false)} className="me-2">
                Cancel
              </Button>
              <Button type="submit" variant="danger">
                Update Password
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        centered
        className="mentor-profile-modal"
      >
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <Modal.Title>👨‍🏫 Mentor Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
          {selectedUser ? (
            <div>
              <div className="text-center mb-4">
                <img
                  src={selectedUser.profilePicture || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="img-thumbnail"
                  style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>

              <Row className="mb-2">
                <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Name:</strong></Col>
                <Col md={8}>{selectedUser.name}</Col>
              </Row>

              <Row className="mb-2">
                <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Email:</strong></Col>
                <Col md={8}>{selectedUser.email}</Col>
              </Row>

              <Row className="mb-2">
                <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Phone:</strong></Col>
                <Col md={8}>{selectedUser.number || 'N/A'}</Col>
              </Row>

              <Row className="mb-2">
                <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Expertise:</strong></Col>
                <Col md={8}>{selectedUser.expertise || 'N/A'}</Col>
              </Row>

              <Row className="mb-2">
                <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Location:</strong></Col>
                <Col md={8}>{selectedUser.location?.location || 'N/A'}</Col>
              </Row>

              <Row className="mb-2">
                <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Date of Birth:</strong></Col>
                <Col md={8}>{selectedUser.dateofbirth || 'N/A'}</Col>
              </Row>

              <Row className="mb-2">
                <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Status:</strong></Col>
                <Col md={8}>
                  <Badge
                    style={{
                      backgroundColor:
                        selectedUser.user_status === 1
                          ? 'var(--success)'
                          : selectedUser.user_status === 2
                          ? 'var(--danger)'
                          : 'var(--warning)',
                    }}
                  >
                    {selectedUser.user_status === 1
                      ? 'Active'
                      : selectedUser.user_status === 2
                      ? 'Inactive'
                      : 'Unverified'}
                  </Badge>
                </Col>
              </Row>

              {selectedUser.tags && selectedUser.tags.length > 0 && (
                <Row className="mb-2">
                  <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Tags:</strong></Col>
                  <Col md={8}>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedUser.tags.map((tag, index) => (
                        <Badge key={index} bg="info">{tag}</Badge>
                      ))}
                    </div>
                  </Col>
                </Row>
              )}
            </div>
          ) : (
            <p>Loading mentor data...</p>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}>
          <Modal.Title>Edit Mentor Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
          {selectedUser && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Expertise</Form.Label>
                <Form.Control 
                  value={formData.expertise}
                  onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Select 
                  value={formData.locationId}  
                  onChange={(e) => setFormData({...formData, locationId: e.target.value})}
                >
                  <option value="">Select a location</option>
                  {locationList.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button 
                variant="primary"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Mentors;