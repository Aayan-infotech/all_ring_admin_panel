




import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  ButtonGroup,
  Badge,
  Form,
  Spinner,
  Row,
  Col,
  Modal,
} from 'react-bootstrap';
import {
  PencilSquare,
  Lock,
  CheckCircleFill,
  XCircleFill,
  PlusCircle,
  EyeFill
} from 'react-bootstrap-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddUserOffcanvas from './AddUserOffcanvas';
import { useForm } from 'react-hook-form';

const Users = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const [users, setUsers] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Helper function to get location string
  const getLocationString = (location) => {
    if (!location) return 'N/A';
    return typeof location === 'object' ? location.location : location;
  };

  const handleShowAddUser = () => setShowAddUser(true);
  const handleCloseAddUser = () => setShowAddUser(false);

  const handleShowResetModal = (userId) => {
    setSelectedUserId(userId);
    setShowResetModal(true);
  };

  const handleViewProfile = (user) => {
    setViewUser(user);
    setShowViewModal(true);
  };

  const handleResetPassword = async (formData) => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `http://18.209.91.97:5010/api/admin/changeUserPassword/${selectedUserId}`,
        {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Password updated successfully!');
      setShowResetModal(false);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while updating the password.');
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      setLoading(true);
      const res = await axios.get('http://18.209.91.97:5010/api/admin/getRegister/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://18.209.91.97:5010/api/location/getAllLocations');
      setLocations(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  const toggleStatus = async (user) => {
    if (user.user_status === 0) {
      toast.error("❌ User email is not verified. Please verify first!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const token = localStorage.getItem('adminToken');
    const newStatus = user.user_status === 1 ? 2 : 1;

    setUsers(prevUsers =>
      prevUsers.map(u => 
        u._id === user._id ? { ...u, user_status: newStatus } : u
      )
    );

    try {
      await axios.patch(
        `http://18.209.91.97:5010/api/admin/editUserStatus/${user._id}`,
        { user_status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`✅ User status updated to ${newStatus === 1 ? 'Active' : 'Inactive'}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("❌ Failed to update status!");
      setUsers(prevUsers =>
        prevUsers.map(u => 
          u._id === user._id ? { ...u, user_status: user.user_status } : u
        )
      );
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLocations();
  }, []);

  const filteredUsers = users.filter((user) => {
    const userLocation = getLocationString(user.location);
    
    if (filterLocation && userLocation !== filterLocation) return false;
    if (filterStatus === 'active' && user.user_status !== 1) return false;
    if (filterStatus === 'inactive' && user.user_status !== 2) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (
        !user.name?.toLowerCase().includes(term) &&
        !user.email?.toLowerCase().includes(term)
      )
        return false;
    }
    return true;
  });

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)' }}>User Management</h2>
        <Button
          variant="primary"
          onClick={handleShowAddUser}
          style={{
            backgroundColor: 'var(--primary)',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
          }}
        >
          <PlusCircle className="me-2" /> Add New User
        </Button>
      </div>

      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Control
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc.location}>
                {loc.location}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="management-table">
            <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
              <tr>
                <th>Sr No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{getLocationString(user.location)}</td>
                    <td>{user.number || 'N/A'}</td>
                    <td>
                      <Badge
                        pill
                        bg={
                          user.user_status === 1 ? 'success' : 
                          user.user_status === 2 ? 'danger' : 
                          'warning'
                        }
                        style={{
                          padding: '8px 12px',
                          fontWeight: '500',
                          backgroundColor:
                            user.user_status === 1 ? 'var(--success)' : 
                            user.user_status === 2 ? 'var(--danger)' :
                            'var(--warning)',
                        }}
                      >
                        {user.user_status === 1 ? 'Active' : 
                         user.user_status === 2 ? 'Inactive' : 
                         'Unverified'}
                      </Badge>
                    </td>
                    <td>
                      <ButtonGroup>
                        <Button
                          size="sm"
                          onClick={() => toggleStatus(user)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '0 5px',
                            color: 
                              user.user_status === 1 ? 'var(--danger)' : 
                              user.user_status === 2 ? 'var(--success)' : 
                              'var(--warning)',
                            cursor: user.user_status === 0 ? 'not-allowed' : 'pointer',
                            opacity: user.user_status === 0 ? 0.6 : 1
                          }}
                          disabled={user.user_status === 0}
                          title={user.user_status === 0 ? "Email not verified" : ""}
                        >
                          {user.user_status === 1 ? (
                            <XCircleFill size={20} />
                          ) : user.user_status === 2 ? (
                            <CheckCircleFill size={20} />
                          ) : (
                            <XCircleFill size={20} />
                          )}
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleShowResetModal(user._id)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '0 5px',
                            color: '#17a2b8'
                          }}
                        >
                          <Lock size={20} />
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingUser(user);
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
                          onClick={() => handleViewProfile(user)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '0 5px',
                            color: '#0d6efd'
                          }}
                        >
                          <EyeFill size={20} />
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}

      <AddUserOffcanvas
        show={showAddUser}
        handleClose={handleCloseAddUser}
        onUserAdded={() => {
          fetchUsers();
          toast.success('User added successfully!');
        }}
      />

      <Modal
        show={showResetModal}
        onHide={() => setShowResetModal(false)}
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
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
        className="view-profile-modal"
      >
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <Modal.Title>👤 User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
          {viewUser ? (
            <div>
              <Row className="mb-3">
                <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Name:</strong></Col>
                <Col md={8}>{viewUser.name}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Email:</strong></Col>
                <Col md={8}>{viewUser.email}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Phone:</strong></Col>
                <Col md={8}>{viewUser.number || 'N/A'}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Location:</strong></Col>
                <Col md={8}>{getLocationString(viewUser.location)}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Status:</strong></Col>
                <Col md={8}>
                  <Badge
                    bg={
                      viewUser.user_status === 1 ? 'success' : 
                      viewUser.user_status === 2 ? 'danger' : 
                      'warning'
                    }
                    style={{ 
                      backgroundColor: 
                        viewUser.user_status === 1 ? 'var(--success)' : 
                        viewUser.user_status === 2 ? 'var(--danger)' :
                        'var(--warning)'
                    }}
                  >
                    {viewUser.user_status === 1 ? 'Active' : 
                     viewUser.user_status === 2 ? 'Inactive' : 
                     'Unverified'}
                  </Badge>
                </Col>
              </Row>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'var(--accent)' }}>
          <Button variant="secondary" onClick={() => setShowViewModal(false)} style={{ borderRadius: '6px' }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        className="edit-profile-modal"
      >
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <Modal.Title>Edit User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
          {editingUser ? (
            <Form
              onSubmit={handleSubmit(async (data) => {
                try {
                  const token = localStorage.getItem('adminToken');
                  await axios.put(
                    `http://18.209.91.97:5010/api/admin/updateUser/${editingUser._id}`,
                    data,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  toast.success("User updated successfully!");
                  fetchUsers();
                  setShowEditModal(false);
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to update user.");
                }
              })}
            >
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  defaultValue={editingUser.name}
                  {...register('name', { required: true })}
                  placeholder="Enter name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  defaultValue={editingUser.email}
                  {...register('email', { required: true })}
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  defaultValue={editingUser.number}
                  {...register('number')}
                  placeholder="Enter phone number"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Select
                  defaultValue={getLocationString(editingUser.location)}
                  {...register('location')}
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc._id} value={loc.location}>
                      {loc.location}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" onClick={() => setShowEditModal(false)} className="me-2">
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </Form>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Users;