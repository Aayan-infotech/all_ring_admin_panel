


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
import { toast } from 'react-toastify';
import AddMentorOffcanvas from './AddMentorOffcanvas';

const AssignMentorTeam = () => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  const [showAddMentor, setShowAddMentor] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [locationList, setLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    expertise: '',
  locationId: ''  // Change from location to locationId
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
      const newStatus = mentor.accountStatus === 'active' ? 'inactive' : 'active';
      const user_status = newStatus === 'active' ? 1 : 2;

      await axios.patch(
        `http://18.209.91.97:5010/api/admin/editUserStatus/${mentor._id}`,
        { user_status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMentors((prevMentors) =>
        prevMentors.map((m) =>
          m._id === mentor._id
            ? { ...m, accountStatus: newStatus }
            : m
        )
      );
      toast.success(`Status updated to ${newStatus}`);
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
    
    // Append all fields to the FormData object
    formDataToSend.append('name', formData.name);
    formDataToSend.append('expertise', formData.expertise);
    formDataToSend.append('location', formData.locationId);  // Send the ID

    const response = await axios.put(
      `http://18.209.91.97:5010/api/auth/update-user/${selectedUser._id}`,
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
    fetchMentors(); // Refresh the list
  } catch (err) {
    console.error('Error updating profile:', err);
    toast.error('Failed to update profile');
  }
};

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
  useEffect(() => {
    fetchMentors();
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || '',
        expertise: selectedUser.expertise || '',
      locationId: selectedUser.location?._id || ''  // Use the location ID
      });
    }
  }, [selectedUser]);

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)', fontWeight: '600' }}>Assign Team</h2>
     
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
          </InputGroup>
        </div>

        <div className="col-md-4 mb-2">
         
<Form.Select
  value={selectedLocation}
  onChange={(e) => setSelectedLocation(e.target.value)}
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
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                  </td>
                  <td>{mentor.name || '-'}</td>
                  <td>{mentor.email || '-'}</td>
                  <td>{getLocationString(mentor.location)}</td>
                  <td>{mentor.expertise || '-'}</td>
                
                  <td>
               
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
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
              <p><strong>Location:</strong> {getLocationString(selectedUser.location)}</p>
            </div>
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
  {locationList.map((location, index) => (
    <option key={index} value={location.id}>
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

export default AssignMentorTeam;