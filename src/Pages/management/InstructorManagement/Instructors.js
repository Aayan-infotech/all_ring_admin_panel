import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, Button, ButtonGroup, Badge, Modal, Form, InputGroup, Spinner, Row, Col,Breadcrumb ,Tooltip,OverlayTrigger
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
const [selectedInstructorLocation, setSelectedInstructorLocation] = useState('');
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


  const actionTooltips = {
    view: (props) => (
      <Tooltip id="view-tooltip" {...props}>
        View Instructor Details
      </Tooltip>
    ),
    edit: (props) => (
      <Tooltip id="edit-tooltip" {...props}>
        Edit Instructor
      </Tooltip>
    ),
    reset: (props) => (
      <Tooltip id="reset-tooltip" {...props}>
        Reset Password
      </Tooltip>
    ),
    toggle: (instructor) => (props) => (
      <Tooltip id="toggle-tooltip" {...props}>
        {instructor.user_status === 0 
          ? "Email not verified" 
          : instructor.user_status === 1 
            ? "Deactivate Instructor" 
            : "Activate Instructor"}
      </Tooltip>
    ),
    addPrisoner: (props) => (
      <Tooltip id="add-prisoner-tooltip" {...props}>
        Add Prisoner for this Instructor
      </Tooltip>
    ),
    viewPrisoners: (props) => (
      <Tooltip id="view-prisoners-tooltip" {...props}>
        View All Prisoners
      </Tooltip>
    ),
    addInstructor: (props) => (
      <Tooltip id="add-instructor-tooltip" {...props}>
        Add New Instructor
      </Tooltip>
    )
  };
































































































const getLocationString = (location) => {
  if (!location) return '-';
  return typeof location === 'object' ? location.location : location;
};

const fetchInstructors = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const res = await axios.get('http://98.82.228.18::5010/api/admin/getRegister/instructor', {
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
    const res = await axios.get('http://98.82.228.18::5010/api/location/getAllLocations');
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


const handleSaveChanges = async () => {
  if (!selectedInstructor || !selectedInstructor._id) {
    toast.error("No instructor selected");
    return;
  }

  try {
    const token = localStorage.getItem('adminToken');
    const formDataToSend = new FormData();
    
    // Append all fields to the FormData object
    formDataToSend.append('name', editForm.name);
    // formDataToSend.append('email', editForm.email);
    formDataToSend.append('location', editForm.location); // This should be the location ID

    const response = await axios.put(
      `http://98.82.228.18::5010/api/auth/update-user/${selectedInstructor._id}`,
      formDataToSend,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    toast.success("Instructor updated successfully!");
    setEditModal(false);
    fetchInstructors(); // Refresh the list
  } catch (err) {
    console.error('Error updating instructor:', err);
    toast.error('Failed to update instructor');
  }
};
const filteredInstructors = instructors.filter(i => {
  const nameMatch = i.name?.toLowerCase().includes(searchTerm.toLowerCase());
  const statusMatch = selectedStatus ? i.status === selectedStatus : true;
  const locationMatch = selectedLocation 
    ? (i.location?._id === selectedLocation || i.location === selectedLocation)
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
      `http://98.82.228.18::5010/api/admin/editUserStatus/${instructor._id}`,
      { user_status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setInstructors(prev => 
      prev.map(i => 
        i._id === instructor._id ? { 
          ...i, 
          user_status: newStatus,
          status: newStatus === 1 ? 'active' : 'inactive'
        } : i
      )
    );
    
    toast.success(`Status updated to ${newStatus === 1 ? 'Active' : 'Inactive'}`);
  } catch (err) {
    toast.error("Failed to update status!");
    console.error(err);
  }
};

// const toggleStatus = async (instructor) => {
//   if (instructor.user_status === 0) {
//     toast.error("❌ User email is not verified!", {
//       position: "top-right",
//       autoClose: 3000,
//     });
//     return;
//   }

//   const token = localStorage.getItem('adminToken');
//   const newStatus = instructor.user_status === 1 ? 2 : 1;

//   try {
//     await axios.patch(
//       `http://98.82.228.18::5010/api/admin/editUserStatus/${instructor._id}`,
//       { user_status: newStatus },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     // Update UI optimistically - this is the key fix
//     setInstructors(prev => 
//       prev.map(i => 
//         i._id === instructor._id ? { 
//           ...i, 
//           user_status: newStatus,
//           status: newStatus === 1 ? 'active' : 'inactive' // Also update the derived status field
//         } : i
//       )
//     );
    
//     toast.success(`Status updated to ${newStatus === 1 ? 'Active' : 'Inactive'}`);
//   } catch (err) {
//     toast.error("Failed to update status!");
//     console.error(err);
//   }
// };


  const updatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://98.82.228.18::5010/api/admin/changeUserPassword/${selectedInstructor._id}`, passwords, {
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
        <Breadcrumb style={{ 
          backgroundColor: 'var(--light)', 
          padding: '0.75rem 1rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem'
        }}>
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
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <i className="fas fa-chalkboard-teacher me-2"></i> Instructor Management
          </Breadcrumb.Item>
        </Breadcrumb>
     
      </div>
    <div className="mb-3">
  <h3>Instructor Management</h3>
</div>

{/* <div className="d-flex justify-content-end mb-3">
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
</div> */}
 <div className="d-flex justify-content-end mb-3">
        <OverlayTrigger placement="top" overlay={actionTooltips.viewPrisoners}>
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
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={actionTooltips.addInstructor}>
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
        </OverlayTrigger>
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
    <option key={idx} value={loc.id}>
      {loc.name}
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
                {/* <td>
                
                  <Badge bg={instructor.user_status === 1 ? 'success' : 'danger'}>
  {instructor.user_status === 1 ? 'active' : 'inactive'}
</Badge>
                </td> */}
                <td>
  <Badge 
    bg={
      instructor.user_status === 0 
        ? 'warning' 
        : instructor.user_status === 1 
          ? 'success' 
          : 'danger'
    }
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
          <OverlayTrigger placement="top" overlay={actionTooltips.view}>
            <Button variant="info" onClick={() => { setSelectedInstructor(instructor); setViewModal(true); }}>
              <EyeFill />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={actionTooltips.edit}>
            <Button 
              variant="warning" 
              onClick={() => { 
                setSelectedInstructor(instructor); 
                setEditForm({
                  name: instructor.name,
                  email: instructor.email,
                  location: instructor.location?._id || instructor.location || ''
                }); 
                setEditModal(true); 
              }}
            >
              <PencilSquare />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={actionTooltips.reset}>
            <Button variant="secondary" onClick={() => { setSelectedInstructor(instructor); setResetModal(true); }}>
              <LockFill />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={actionTooltips.toggle(instructor)}>
            <Button
              size="sm"
              onClick={() => toggleStatus(instructor)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: '0 5px',
                color: instructor.user_status === 0 
                  ? 'gray' 
                  : instructor.user_status === 1 
                    ? 'var(--danger)' 
                    : 'var(--success)',
                cursor: instructor.user_status === 0 ? 'not-allowed' : 'pointer',
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
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={actionTooltips.addPrisoner}>
            <Button
              variant="dark"
              onClick={() => {
                setSelectedInstructorId(instructor._id);
                setSelectedInstructorLocation(instructor.location?._id || instructor.location || '');
                setShowPrisonerCanvas(true);
              }}
            >
              + Prisoner
            </Button>
          </OverlayTrigger>
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
    preSelectedLocation={selectedInstructorLocation}

/>


      {/* View Modal */}
<Modal
  show={viewModal}
  onHide={() => setViewModal(false)}
  centered
  className="instructor-profile-modal"
  size="lg"
>
  <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
    <Modal.Title>👨‍🏫 Instructor Profile</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
    {selectedInstructor ? (
      <div>
        <div className="text-center mb-4">
          <img
            src={selectedInstructor.profilePicture || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="img-thumbnail"
            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%' }}
          />
          <div className="mt-2">
          
          </div>
        </div>

        <Row className="mb-2">
          <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Name:</strong></Col>
          <Col md={8}>{selectedInstructor.name}</Col>
        </Row>

        <Row className="mb-2">
          <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Email:</strong></Col>
          <Col md={8}>{selectedInstructor.email}</Col>
        </Row>

        <Row className="mb-2">
          <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Phone:</strong></Col>
          <Col md={8}>{selectedInstructor.number || 'N/A'}</Col>
        </Row>


        <Row className="mb-2">
          <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Location:</strong></Col>
          <Col md={8}>{getLocationString(selectedInstructor.location) || 'N/A'}</Col>
        </Row>

        <Row className="mb-2">
          <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Registered On:</strong></Col>
          <Col md={8}>{new Date(selectedInstructor.createdAt).toLocaleString()}</Col>
        </Row>

        <Row className="mb-2">
          <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Last Updated:</strong></Col>
          <Col md={8}>{new Date(selectedInstructor.updatedAt).toLocaleString()}</Col>
        </Row>
<Row className="mb-2">
  <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Status:</strong></Col>
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
        {/* <Row className="mb-2">
          <Col md={4}><strong style={{ color: 'var(--secondary)' }}>Status:</strong></Col>
          <Col md={8}>
            <Badge
              style={{
                backgroundColor:
                  selectedInstructor.user_status === 1
                    ? 'var(--success)'
                    : selectedInstructor.user_status === 2
                    ? 'var(--danger)'
                    : 'var(--warning)',
              }}
            >
              {selectedInstructor.user_status === 1
                ? 'Active'
                : selectedInstructor.user_status === 2
                ? 'Inactive'
                : 'Unverified'}
            </Badge>
          </Col>
        </Row> */}
      </div>
    ) : (
      <p>Loading instructor data...</p>
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
        <Form.Control 
          value={editForm.name || ''} 
          onChange={e => setEditForm({...editForm, name: e.target.value})}
        />
      </Form.Group>
      {/* <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control 
          value={editForm.email || ''} 
          onChange={e => setEditForm({...editForm, email: e.target.value})}
        />
      </Form.Group> */}
      <Form.Group className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Select 
          value={editForm.location || ''}
          onChange={e => setEditForm({...editForm, location: e.target.value})}
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
