import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, Button, ButtonGroup, Badge, Modal, Form, InputGroup, Spinner, Row, Col
} from 'react-bootstrap';
import {
  PencilSquare, EyeFill, LockFill, CheckCircleFill, XCircleFill
} from 'react-bootstrap-icons';

import AddPrisonerOffcanvas from './AddPrisonerOffcanvas';

import AddInstructorOffcanvas from './AddInstructorOffcanvas';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InstructorManagement = () => {
  const [instructors, setInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [uniqueLocations, setUniqueLocations] = useState([]);
const [showAddCanvas, setShowAddCanvas] = useState(false);
const [showPrisonerCanvas, setShowPrisonerCanvas] = useState(false);
const [selectedInstructorId, setSelectedInstructorId] = useState('');
const [locationObjects, setLocationObjects] = useState([]); // for _id and name

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
    const res = await axios.get('http://18.209.91.97:5010/api/admin/getRegister/instructor', {
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
    const res = await axios.get('http://18.209.91.97:5010/api/location/getAllLocations');
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
const toggleStatus = async (instructor) => {

  if (instructor.user_status === 0) {
    toast.error("❌ User email is not verified!", {
      position: "top-right",
      autoClose: 3000,
    });
    return; 
  }

  const token = localStorage.getItem('adminToken');
  const newStatus = instructor.user_status === 1 ? 2 : 1;

  try {
    await axios.patch(
      `http://18.209.91.97:5010/api/admin/editUserStatus/${instructor._id}`,
      { user_status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update UI optimistically
    setInstructors(prev => 
      prev.map(i => 
        i._id === instructor._id ? { ...i, user_status: newStatus } : i
      )
    );
    toast.success(`Status updated to ${newStatus === 1 ? 'Active' : 'Inactive'}`);
  } catch (err) {
    toast.error("Failed to update status!");
    console.error(err);
  }
};

  const updatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://18.209.91.97:5010/api/admin/changeUserPassword/${selectedInstructor._id}`, passwords, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Password updated successfully');
      setResetModal(false);
    } catch (err) {
      toast.error('Failed to reset password');
    }
  };

  

  return (
    <div className="p-4">
      <ToastContainer />
    <div className="mb-3">
  <h3>Instructor Management</h3>
</div>

<div className="d-flex justify-content-end mb-3">
  <Button
  onClick={() => window.location.href = "/prisoners"}
  style={{
    backgroundColor: 'var(--info)',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    marginRight: '10px',
  }}
>
  👁 View Prisoners
</Button>

  <Button
    onClick={() => setShowAddCanvas(true)}
    style={{
      backgroundColor: 'var(--primary)',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
    }}
  >
    + Add Instructor
  </Button>
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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstructors.map((instructor, index) => (
              <tr key={instructor._id}>
                <td>{index + 1}</td>
                <td>{instructor.name}</td>
                <td>{instructor.email}</td>
                {/* <td>{instructor.location}</td> */}
                <td>{getLocationString(instructor.location)}</td>
                <td>
                  <Badge bg={instructor.status === 'active' ? 'success' : 'danger'}>
                    {instructor.status}
                  </Badge>
                </td>
             
              <td>
  <ButtonGroup>
    <Button variant="info" onClick={() => { setSelectedInstructor(instructor); setViewModal(true); }}><EyeFill /></Button>
    <Button variant="warning" onClick={() => { setSelectedInstructor(instructor); setEditForm(instructor); setEditModal(true); }}><PencilSquare /></Button>
    <Button variant="secondary" onClick={() => { setSelectedInstructor(instructor); setResetModal(true); }}><LockFill /></Button>
   

<Button
  size="sm"
  onClick={() => toggleStatus(instructor)}
  style={{
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0 5px',
    color: instructor.user_status === 0 ? 'gray' : 
           instructor.user_status === 1 ? 'var(--danger)' : 'var(--success)',
    cursor: 'pointer', // Always clickable
  }}
  title={instructor.user_status === 0 ? "Not verified" : "Toggle status"}
>
  {instructor.user_status === 0 ? (
    <XCircleFill size={20} /> // ❌ 
  ) : instructor.user_status === 1 ? (
    <CheckCircleFill size={20} /> // ✅ 
  ) : (
    <XCircleFill size={20} /> // ❌ 
  )}
</Button>
      
    <Button
      variant="dark"
      onClick={() => {
        setSelectedInstructorId(instructor._id);
        setShowPrisonerCanvas(true);
      }}
    >
      + Prisoner
    </Button>
  </ButtonGroup>
</td>

              </tr>
            ))}
          </tbody>
        </Table>
      )}



<AddInstructorOffcanvas
  show={showAddCanvas}
  handleClose={() => setShowAddCanvas(false)}
  onInstructorAdded={fetchInstructors}
/>

<AddPrisonerOffcanvas
  show={showPrisonerCanvas}
  handleClose={() => setShowPrisonerCanvas(false)}
  instructorId={selectedInstructorId}
  locations={locationObjects}
/>


      {/* View Modal */}
      <Modal show={viewModal} onHide={() => setViewModal(false)} centered className="custom-modal">
        <Modal.Header closeButton><Modal.Title>Instructor Profile</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedInstructor && (
            <div>
              <p><strong>Name:</strong> {selectedInstructor.name}</p>
              <p><strong>Email:</strong> {selectedInstructor.email}</p>
              <p><strong>Phone:</strong> {selectedInstructor.number}</p>
              {/* <p><strong>Location:</strong> {selectedInstructor.location}</p> */}
              <p><strong>Location:</strong> {getLocationString(selectedInstructor.location)}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal show={editModal} onHide={() => setEditModal(false)} centered className="custom-modal">
        <Modal.Header closeButton><Modal.Title>Edit Instructor</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
            </Form.Group>
            {/* <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control value={editForm.location || ''} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
            </Form.Group> */}
            <Form.Group className="mb-3">
  <Form.Label>Location</Form.Label>
  {/* <Form.Select 
    value={editForm.location || ''} 
    onChange={e => setEditForm({ ...editForm, location: e.target.value })}
  >
    <option value="">Select a location</option>
    {locationList.map((location, index) => (
      <option key={index} value={location}>
        {location}
      </option>
    ))}
  </Form.Select> */}
  <Form.Select 
  value={getLocationString(editForm.location) || ''} 
  onChange={e => setEditForm({ ...editForm, location: e.target.value })}
>
  <option value="">Select a location</option>
  {locationList.map((location, index) => (
    <option key={index} value={location}>
      {location}
    </option>
  ))}
</Form.Select>
</Form.Group>
            <Button variant="primary" onClick={() => setEditModal(false)}>Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Reset Password Modal */}
      <Modal show={resetModal} onHide={() => setResetModal(false)} centered className="custom-modal">
        <Modal.Header closeButton><Modal.Title>Reset Password</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" value={passwords.confirmPassword} onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setResetModal(false)} className="me-2">Cancel</Button>
              <Button variant="danger" onClick={updatePassword}>Update Password</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InstructorManagement;
