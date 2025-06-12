

import React, { useState, useEffect } from 'react';
import { Table, Button, ButtonGroup, Badge, InputGroup, Form, Spinner, Modal } from 'react-bootstrap';
import {
  PencilSquare,
  CheckCircleFill,
  XCircleFill,
  Search,
  PlusCircle,
  LockFill,
  EyeFill,
} from 'react-bootstrap-icons';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import AddMentorOffcanvas from './AddMentorOffcanvas';
import { toast } from 'react-toastify';

const Mentors = () => {
const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  const [showAddMentor, setShowAddMentor] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
const [locationList, setLocationList] = useState([]);
const [selectedLocation, setSelectedLocation] = useState('');
const [selectedStatus, setSelectedStatus] = useState('');

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

  useEffect(() => {
    fetchMentors();
      fetchLocations();

  }, []);

const fetchLocations = async () => {
  try {
    const res = await axios.get('http://18.209.91.97:5010/api/location/getAllLocations');
    const locations = res.data?.data || [];
    const activeLocations = locations
      .filter(loc => loc.status === 'Active')
      .map(loc => loc.location);
    setLocationList(activeLocations);
  } catch (err) {
    console.error("Failed to fetch locations:", err);
    toast.error("Failed to load locations");
  }
};


const toggleStatus = async (id, status) => {
  try {
    const token = localStorage.getItem('adminToken');
    const user_status = status === 'active' ? 2 : 1;

    await axios.patch(
      `http://18.209.91.97:5010/api/admin/editUserStatus/${id}`,
      { user_status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

   
    setMentors((prevMentors) =>
      prevMentors.map((mentor) =>
        mentor._id === id
          ? { ...mentor, accountStatus: status === 'active' ? 'inactive' : 'active' }
          : mentor
      )
    );
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
      `http://18.209.91.97:5010/api/admin/changeUserPassword/${selectedUser._id}`,
      { newPassword, confirmPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success('Password updated successfully!');
    reset(); // <-- clear fields
    setShowResetModal(false);
  } catch (err) {
    console.error('Password reset failed:', err.response?.data || err.message);
    toast.error('Password reset failed!');
  }
};

const filteredMentors = mentors.filter((mentor) => {
  const nameMatch =
    mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email?.toLowerCase().includes(searchTerm.toLowerCase());

  const locationMatch = selectedLocation ? mentor.location === selectedLocation : true;

  const statusMatch = selectedStatus ? mentor.accountStatus === selectedStatus : true;

  return nameMatch && locationMatch && statusMatch;
});

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)', fontWeight: '600' }}>Mentor Management</h2>
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
      </div>
  <div className="row mb-4">
  <div className="col-md-4 mb-2">
    <InputGroup>
      <Form.Control
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ border: '2px solid var(--accent)', borderRadius: '8px 0 0 8px' }}
      />
      <Button
        variant="primary"
        style={{ backgroundColor: 'var(--primary)', border: 'none', borderRadius: '0 8px 8px 0' }}
      >
        <Search />
      </Button>
    </InputGroup>
  </div>

  <div className="col-md-4 mb-2">
    <Form.Select
      value={selectedLocation}
      onChange={(e) => setSelectedLocation(e.target.value)}
      style={{ borderRadius: '8px' }}
    >
      <option value="">Filter by Location</option>
      {locationList.map((loc, idx) => (
        <option key={idx} value={loc}>{loc}</option>
      ))}
    </Form.Select>
  </div>

  <div className="col-md-4 mb-2">
    <Form.Select
      value={selectedStatus}
      onChange={(e) => setSelectedStatus(e.target.value)}
      style={{ borderRadius: '8px' }}
    >
      <option value="">Filter by Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </Form.Select>
  </div>
</div>


      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
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
              {filteredMentors.map((mentor, index) => (
                <tr key={mentor._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={mentor.profilePicture || 'https://via.placeholder.com/40'}
                      alt="Profile"
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                  </td>
                  <td>{mentor.name || '-'}</td>
                  <td>{mentor.email || '-'}</td>
                  <td>{mentor.location || '-'}</td>
                  <td>{mentor.expertise || '-'}</td>
                  <td>
                    <Badge
                      pill
                      style={{
                        padding: '8px 12px',
                        fontWeight: '500',
                        backgroundColor: mentor.accountStatus === 'active' ? 'var(--success)' : 'var(--danger)',
                      }}
                    >
                      {mentor.accountStatus === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                 

                    <ButtonGroup>
  {/* Status Toggle Button */}
  <Button
    size="sm"
    onClick={() => toggleStatus(mentor._id, mentor.accountStatus)}
    style={{
      backgroundColor: 'transparent',
      border: 'none',
      padding: '0 5px',
      color: mentor.accountStatus === 'active' ? 'var(--danger)' : 'var(--success)'
    }}
    title={mentor.accountStatus === 'active' ? 'Block' : 'Activate'}
  >
    {mentor.accountStatus === 'active' ? <XCircleFill size={20} /> : <CheckCircleFill size={20} />}
  </Button>

  {/* Edit Button */}
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
    title="Edit"
  >
    <PencilSquare size={20} />
  </Button>

  {/* View Button */}
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
    title="View"
  >
    <EyeFill size={20} />
  </Button>

  {/* Reset Button */}
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
    title="Reset Password"
  >
    <LockFill size={20} />
  </Button>
</ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <AddMentorOffcanvas show={showAddMentor} handleClose={() => setShowAddMentor(false)} onMentorAdded={fetchMentors} />

      {/* Reset Password Modal */}
      <Modal
      show={showResetModal}
     onHide={() => {
  setShowResetModal(false);
  reset(); // <-- clears the form
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

      {/* View Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}>
          <Modal.Title>Mentor Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
          {selectedUser && (
            <div>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.number}</p>
              <p><strong>DOB:</strong> {selectedUser.dateofbirth}</p>
              <p><strong>Expertise:</strong> {selectedUser.expertise}</p>
              <p><strong>Location:</strong> {selectedUser.location}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}>
          <Modal.Title>Edit Mentor Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
          {selectedUser && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control defaultValue={selectedUser.name} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control defaultValue={selectedUser.email} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Expertise</Form.Label>
                <Form.Control defaultValue={selectedUser.expertise} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control defaultValue={selectedUser.location} />
              </Form.Group>
              <Button variant="primary">Save Changes</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Mentors;

