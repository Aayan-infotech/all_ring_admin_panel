import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Row, Col, ButtonGroup, Badge, InputGroup, 
  Form, Spinner, Modal, Breadcrumb, Pagination 
} from 'react-bootstrap';
import {
  PencilSquare, CheckCircleFill, XCircleFill, PlusCircle, 
  LockFill, EyeFill
} from 'react-bootstrap-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddInstructorOffcanvas from './AddInstructorOffcanvas';
import AddPrisonerOffcanvas from './AddPrisonerOffcanvas';
const InstructorManagement = () => {
  const [instructors, setInstructors] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [showAddInstructor, setShowAddInstructor] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [locationList, setLocationList] = useState([]);
  // const [showAddPrisonerOffcanvas, setShowAddPrisonerOffcanvas] = useState(false);
const [selectedInstructorId, setSelectedInstructorId] = useState('');
 const [selectedInstructorLocation, setSelectedInstructorLocation] = useState('');
 const [locationObjects, setLocationObjects] = useState([]); // for _id and name
const [showAddPrisonerOffcanvas, setShowAddPrisonerOffcanvas] = useState(false);

  // Pagination and filtering state
  const [totalInstructors, setTotalInstructors] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    status: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    locationId: ''
  });

  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Helper function to get location string
  const getLocationString = (location) => {
    if (!location) return '-';
    return typeof location === 'object' ? location.location : location;
  };

  const fetchInstructors = async () => {
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

      const res = await axios.get('http://91.189.120.112:5010/api/admin/getRegister/instructor', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params
      });

      setInstructors(res.data.users || []);
      setTotalInstructors(res.data.total || 0);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching instructors:', err);
      toast.error('Failed to fetch instructors');
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://91.189.120.112:5010/api/location/getAllLocations', {
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

  const toggleStatus = async (instructor) => {
    if (instructor.user_status === 0) {
      toast.error("❌ User email is not verified!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const newStatus = instructor.user_status === 1 ? 2 : 1;

      await axios.patch(
        `http://91.189.120.112:5010/api/admin/editUserStatus/${instructor._id}`,
        { user_status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchInstructors(); // Refresh the list
      toast.success(`Status updated to ${newStatus === 1 ? 'Active' : 'Inactive'}`);
    } catch (err) {
      console.error('Error toggling status:', err);
      toast.error('Failed to update status');
    }
  };

  // const handleResetPassword = async () => {
  //   if (!selectedInstructor || !selectedInstructor._id) {
  //     console.error('No instructor selected for password reset.');
  //     return;
  //   }

  //   if (passwords.newPassword !== passwords.confirmPassword) {
  //     toast.error('Passwords do not match');
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem('adminToken');

  //     await axios.put(
  //       `http://91.189.120.112:5010/api/admin/changeUserPassword/${selectedInstructor._id}`,
  //       passwords,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     toast.success('Password updated successfully!');
  //     setPasswords({ newPassword: '', confirmPassword: '' });
  //     setShowResetModal(false);
  //   } catch (err) {
  //     console.error('Password reset failed:', err.response?.data || err.message);
  //     toast.error('Password reset failed!');
  //   }
  // };
const handleResetPassword = async () => {
  if (!selectedInstructor || !selectedInstructor._id) {
    console.error('No instructor selected for password reset.');
    return;
  }

  if (passwords.newPassword !== passwords.confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }

  try {
    const token = localStorage.getItem('adminToken');

    const response = await axios.put(
      `http://91.189.120.112:5010/api/admin/changeUserPassword/${selectedInstructor._id}`,
      passwords,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Use backend success message
    toast.success(response.data.message || 'Password updated successfully!');
    setPasswords({ newPassword: '', confirmPassword: '' });
    setShowResetModal(false);
  } catch (err) {
    console.error('Password reset failed:', err.response?.data || err.message);
    
    // Use backend error message instead of generic frontend message
    const errorMessage = err.response?.data?.message || 'Password reset failed!';
    toast.error(errorMessage);
  }
};
  const handleSaveChanges = async () => {
    if (!selectedInstructor || !selectedInstructor._id) {
      toast.error("No instructor selected");
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('location', formData.locationId);

      await axios.put(
        `http://91.189.120.112:5010/api/auth/update-user/${selectedInstructor._id}`,
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
      fetchInstructors();
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    }
  };

  useEffect(() => {
    fetchInstructors();
    fetchLocations();
  }, [currentPage, itemsPerPage, filters]);

  useEffect(() => {
    if (selectedInstructor) {
      setFormData({
        name: selectedInstructor.name || '',
        locationId: selectedInstructor.location?._id || ''
      });
    }
  }, [selectedInstructor]);

  const totalPages = Math.ceil(totalInstructors / itemsPerPage);

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <ToastContainer />
      
      <div className="mb-4">
        <Breadcrumb style={{ backgroundColor: 'var(--light)', padding: '10px', borderRadius: '5px' }}>
          <Breadcrumb.Item href="/dashboard">
            <i className="fas fa-home me-2"></i> Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            <i className="fas fa-chalkboard-teacher me-2"></i> Instructor Management
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

    
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
  <h2 style={{ color: 'var(--secondary)', fontWeight: '600', margin: 0 }}>
    Instructor Management
  </h2>

  <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
    <Button
      variant="info"
      onClick={() => window.location.href = '/prisoners'}
      style={{
        backgroundColor: 'var(--info)',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
      }}
    >
      <EyeFill className="me-2" />
      View Prisoners
    </Button>

    <Button
      variant="primary"
      onClick={() => setShowAddInstructor(true)}
      style={{
        backgroundColor: 'var(--primary)',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
      }}
    >
      <PlusCircle className="me-2" />
      Add New Instructor
    </Button>
  </div>
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
        <Col md={2}>
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
        </Col>
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
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructors.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No instructors found
                    </td>
                  </tr>
                ) : (
                  instructors.map((instructor, index) => (
                    <tr key={instructor._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        <img
                          src={instructor.profilePicture || 'https://via.placeholder.com/40'}
                          alt="Profile"
                          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        />
                      </td>
                      <td>{instructor.name || '-'}</td>
                      <td>{instructor.email || '-'}</td>
                      <td>{getLocationString(instructor.location)}</td>
                      <td>
                        <Badge
                          pill
                          bg={
                            instructor.user_status === 0 
                              ? 'warning' 
                              : instructor.user_status === 1
                                ? 'success' 
                                : 'danger'
                          }
                          style={{
                            padding: '8px 12px',
                            fontWeight: '500',
                          }}
                        >
                          {instructor.user_status === 0 
                            ? 'Unverified' 
                            : instructor.user_status === 1
                              ? 'Active' 
                              : 'Inactive'
                          }
                        </Badge>
                      </td>
                      <td>
                        <ButtonGroup>
                          <Button
                            size="sm"
                            onClick={() => toggleStatus(instructor)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              padding: '0 5px',
                              color: instructor.user_status === 0 ? 'gray' : 
                                    instructor.user_status === 1 ? 'var(--danger)' : 'var(--success)',
                              cursor: 'pointer',
                            }}
                            disabled={instructor.user_status === 0}
                          >
                            {instructor.user_status === 0 ? (
                              <XCircleFill size={20} />
                            ) : instructor.user_status === 1 ? (
                              <XCircleFill size={20} />
                            ) : (
                              <CheckCircleFill size={20} />
                            )}
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedInstructor(instructor);
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

                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedInstructor(instructor);
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

                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedInstructor(instructor);
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


                          {/* New + Prisoner button */}
    <Button
      size="sm"
      // In your button onClick:
onClick={() => {
  setSelectedInstructor(instructor);
  setShowAddPrisonerOffcanvas(true);
}}
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        padding: '0 5px',
        color: 'var(--success)'
      }}
      title="Add Prisoner"
    >
      <PlusCircle size={20} />
    </Button>
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
                {Math.min(currentPage * itemsPerPage, totalInstructors)} of {totalInstructors} instructors
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

      <AddInstructorOffcanvas 
        show={showAddInstructor} 
        handleClose={() => setShowAddInstructor(false)} 
        onInstructorAdded={fetchInstructors} 
      />




<AddPrisonerOffcanvas
  show={showAddPrisonerOffcanvas} 
  handleClose={() => {
    setShowAddPrisonerOffcanvas(false);
    setSelectedInstructor(null);
  }}
  instructorId={selectedInstructor?._id || ''}
  locations={locationList}
  preSelectedLocation={selectedInstructor?.location?._id || selectedInstructor?.location || ''}
/>

      {/* Reset Password Modal */}
      <Modal
        show={showResetModal}
        onHide={() => {
          setShowResetModal(false);
          setPasswords({ newPassword: '', confirmPassword: '' });
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                placeholder="Enter new password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" onClick={() => setShowResetModal(false)} className="me-2">
                Cancel
              </Button>
              <Button variant="danger" onClick={handleResetPassword}>
                Update Password
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Profile View Modal */}
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <Modal.Title>Instructor Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInstructor ? (
            <div>
              <div className="text-center mb-4">
                <img
                  src={selectedInstructor.profilePicture || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="img-thumbnail"
                  style={{ width: '120px', height: '120px', borderRadius: '50%' }}
                />
              </div>

              <Row className="mb-2">
                <Col md={4}><strong>Name:</strong></Col>
                <Col md={8}>{selectedInstructor.name}</Col>
              </Row>

              <Row className="mb-2">
                <Col md={4}><strong>Email:</strong></Col>
                <Col md={8}>{selectedInstructor.email}</Col>
              </Row>

              {/* <Row className="mb-2">
                <Col md={4}><strong>Phone:</strong></Col>
                <Col md={8}>{selectedInstructor.number || 'N/A'}</Col>
              </Row> */}

              <Row className="mb-2">
                <Col md={4}><strong>Location:</strong></Col>
                <Col md={8}>{getLocationString(selectedInstructor.location)}</Col>
              </Row>

              <Row className="mb-2">
                <Col md={4}><strong>Status:</strong></Col>
                <Col md={8}>
                  <Badge
                    bg={
                      selectedInstructor.user_status === 0 
                        ? 'warning' 
                        : selectedInstructor.user_status === 1 
                          ? 'success' 
                          : 'danger'
                    }
                  >
                    {selectedInstructor.user_status === 0 
                      ? 'Unverified' 
                      : selectedInstructor.user_status === 1 
                        ? 'Active' 
                        : 'Inactive'
                    }
                  </Badge>
                </Col>
              </Row>
            </div>
          ) : (
            <p>Loading instructor data...</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}>
          <Modal.Title>Edit Instructor Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInstructor && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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

export default InstructorManagement;









