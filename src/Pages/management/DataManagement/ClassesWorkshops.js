


import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  InputGroup,
  Form,
  Spinner,
  Badge,
  Row,       
  Col,      
  Modal,
  ListGroup
} from 'react-bootstrap';
import {
  PencilSquare,
  PlusCircle,
  XCircleFill,
  CheckCircleFill,
  Film,

  InfoCircle,
  FileEarmarkText,
  Trash,
  QuestionCircle
} from 'react-bootstrap-icons';
import axios from 'axios';
import AddClassOffcanvas from './AddClassOffcanvas';
import AddMediaOffcanvas from './AddMediaOffcanvas';
import AddNotesOffcanvas from './AddNotesOffcanvas';
import { toast } from 'react-toastify';

const ClassesWorkshops = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [allLocations, setAllLocations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showViewQuestionsModal, setShowViewQuestionsModal] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
const [instructors, setInstructors] = useState([]);

// 2. Add a function to fetch instructors
const fetchInstructors = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    const res = await axios.get('http://18.209.91.97:5010/api/admin/getRegister/instructor', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setInstructors(res.data?.users || []);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    setInstructors([]);
  }
};
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://18.209.91.97:5010/api/AdminClasses/getAllClasses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const apiData = Array.isArray(res.data?.data) ? res.data.data : res.data;
      setClasses(apiData || []);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };
const handleUpdateClass = async () => {
  const form = document.getElementById('editClassForm');
  const formData = new FormData();

  // Append all fields exactly as in the curl example
  formData.append('title', form.title.value);
  formData.append('theme', form.theme.value);
  
  // Handle tags - you'll need to add tags input to your form
  // For now, I'll add empty tags array since your form doesn't have tags input
  formData.append('tags', JSON.stringify([]));
  
  // Date fields - you'll need to add these to your form
  formData.append('startDate', form.startDate.value || new Date().toISOString().split('T')[0]);
  formData.append('endDate', form.endDate.value || new Date().toISOString().split('T')[0]);
  
  // Session type - you'll need to add this to your form
  formData.append('sessionType', form.sessionType.value || 'weekly');
  
  // Time fields - format them as "HH:MM AM/PM"
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hourInt = parseInt(hours, 10);
    const period = hourInt >= 12 ? 'PM' : 'AM';
    const displayHour = hourInt % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };
  
  formData.append('startTime', formatTime(form.time.value || '12:00'));
  formData.append('endTime', formatTime(form.endTime.value || '13:00')); // You'll need to add endTime field
  
  formData.append('location', form.location.value);
  formData.append('Instructor', form.instructor.value);
  formData.append('Type', form.Type.value); // You'll need to add Type field
  
  // Handle image upload
  if (form.image.files[0]) {
    formData.append('Image', form.image.files[0]);
  } else if (selectedClass.Image) {
    // If no new image, include the existing image URL
    formData.append('Image', selectedClass.Image);
  }

  // Debug: Log form data before sending
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    const token = localStorage.getItem('adminToken');
    const response = await axios.put(
      `http://18.209.91.97:5010/api/AdminClasses/updateClass/${selectedClass._id}`,
      formData,
      {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    toast.success('Class updated successfully!');
    setShowEditModal(false);
    fetchClasses();
  } catch (err) {
    console.error('Update error:', err);
    toast.error(err.response?.data?.message || 'Failed to update class');
  }
};



  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://18.209.91.97:5010/api/location/getAllLocations');
      setAllLocations(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

const fetchQuestions = async (classId) => {
  try {
    const token = localStorage.getItem('adminToken');
    const res = await axios.get(
      `http://18.209.91.97:5010/api/questionaire/getQuestions/${classId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (res.data.success && res.data.questions) {
      setQuestions(res.data.questions);
    } else {
      setQuestions([]);
      toast.warning('No questions found for this class');
    }
  } catch (err) {
    console.error('Error fetching questions:', err);
    toast.error('Failed to fetch questions');
    setQuestions([]);
  }
};
  useEffect(() => {
    fetchClasses();
    fetchLocations();
      fetchInstructors(); // Add this line

  }, []);

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`http://18.209.91.97:5010/api/AdminClasses/blockClass/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClasses(prev =>
        prev.map(cls =>
          cls._id === id ? { ...cls, status: cls.status === 'active' ? 'inactive' : 'active' } : cls
        )
      );
    } catch (err) {
      console.error('Status toggle failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://18.209.91.97:5010/api/AdminClasses/deleteClass/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClasses(prev => prev.filter(cls => cls._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleAddQuestion = async (classId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `http://18.209.91.97:5010/api/questionaire/addQuestions/${classId}`,
        { questionText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Question added successfully!');
      setQuestionText('');
      setShowAddQuestionModal(false);
      fetchQuestions(classId);
    } catch (err) {
      console.error('Error adding question:', err);
      toast.error('Failed to add question');
    }
  };

  const handleEditQuestion = async (classId, questionId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `http://18.209.91.97:5010/api/questionaire/editQuestion/${classId}/${questionId}`,
        { questionText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Question updated successfully!');
      setQuestionText('');
      setEditingQuestion(null);
      fetchQuestions(classId);
    } catch (err) {
      console.error('Error editing question:', err);
      toast.error('Failed to update question');
    }
  };

  const filtered = classes.filter(cls => {
    const matchesTitle = cls.title?.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = filterLocation ? cls.location?.location === filterLocation : true;
    const matchesStatus = filterStatus ? cls.status?.toLowerCase() === filterStatus.toLowerCase() : true;
    return matchesTitle && matchesLocation && matchesStatus;
  });

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)', fontWeight: 600 }}>Classes & Workshops</h2>
        <div>
          <Button 
            onClick={() => setShowAddForm(true)} 
            style={{ backgroundColor: 'var(--primary)', border: 'none', marginRight: '10px' }}
          >
            <PlusCircle className="me-2" /> Add New
          </Button>
        </div>
      </div>

      <Row className="mb-4 g-3">
  <Col md={4}>
    <Form.Control
      placeholder="Search by title"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
    />
  </Col>

  <Col md={4}>
    <Form.Select
      value={filterLocation}
      onChange={(e) => setFilterLocation(e.target.value)}
      style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
    >
      <option value="">All Locations</option>
      {allLocations.map(loc => (
        <option key={loc._id} value={loc.location}>
          {loc.location}
        </option>
      ))}
    </Form.Select>
  </Col>

  <Col md={4}>
    <Form.Select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
    >
      <option value="">All Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </Form.Select>
  </Col>
</Row>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted fw-bold mt-5">No classes or workshops found.</div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover>
            <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Theme</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item._id}>
                  <td>{idx + 1}</td>
                  <td><img src={item.Image || 'https://via.placeholder.com/40'} width="40" height="40" alt="img" style={{ borderRadius: '4px' }} /></td>
                  <td>{item.title}</td>
                  <td>{item.theme}</td>
                  <td>{item.Type}</td>
                  <td>{item.location?.location || 'N/A'}</td>
                  <td>
                    <Badge bg={item.status === 'active' ? 'success' : 'danger'}>{item.status}</Badge>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      <Button
                        variant="light"
                        className={`icon-btn border-0 ${item.status === 'active' ? 'bg-light border-danger text-danger' : 'bg-light border-success text-success'}`}
                        size="sm"
                        onClick={() => toggleStatus(item._id)}
                      >
                        {item.status === 'active' ? <XCircleFill size={16} /> : <CheckCircleFill size={16} />}
                      </Button>
                      <Button
                        variant="light"
                        className="icon-btn border-warning text-warning"
                        size="sm"
                        onClick={() => {
                          setSelectedClass(item);
                          setShowEditModal(true);
                        }}
                      >
                        <PencilSquare size={16} />
                      </Button>
                      <Button
                        variant="light"
                        className="icon-btn border-danger text-danger"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash size={16} />
                      </Button>
                      <Button
                        variant="light"
                        className="icon-btn border-dark text-dark"
                        size="sm"
                        onClick={() => {
                          setSelectedClass(item);
                          setShowNotesForm(true);
                        }}
                      >
                        <FileEarmarkText size={16} />
                      </Button>
                      <Button
                        variant="light"
                        className="icon-btn border-primary text-primary"
                        size="sm"
                        onClick={() => {
                          setSelectedClass(item);
                          setShowAddQuestionModal(true);
                          setQuestionText('');
                        }}
                      >
                        <PlusCircle size={16} />
                      </Button>
                          <Button
        variant="light"
        className="icon-btn border-info text-info"
        size="sm"
        onClick={() => {
          setSelectedClass(item);
          setShowDetailsModal(true);
        }}
      >
        <InfoCircle size={16} />
      </Button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      
      <AddClassOffcanvas show={showAddForm} handleClose={() => { setShowAddForm(false); setSelectedClass(null); }} onSaved={fetchClasses} selected={selectedClass} />
      <AddMediaOffcanvas show={showMediaForm} handleClose={() => setShowMediaForm(false)} classId={selectedClass?._id} />
      <AddNotesOffcanvas show={showNotesForm} handleClose={() => setShowNotesForm(false)} classId={selectedClass?._id} />
<Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
  <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '1rem' }}>
    <Modal.Title style={{ fontSize: '1.25rem' }}>Class Details</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ padding: '1.5rem' }}>
    {selectedClass && (
      <div className="row g-3">
        {/* Header Section with Image and Basic Info */}
        <div className="col-md-4">
          {selectedClass.Image && (
            <div className="text-center mb-3">
              <img 
                src={selectedClass.Image} 
                alt="Class" 
                style={{ 
                  width: '100%',
                  maxHeight: '200px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '1px solid #eee'
                }} 
              />
            </div>
          )}
          
          <div className="card p-3" style={{ backgroundColor: 'var(--accent)' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '600' }}>{selectedClass.title}</h5>
              <Badge 
                bg={selectedClass.status === 'active' ? 'success' : 'danger'} 
                pill
                style={{ fontSize: '0.75rem' }}
              >
                {selectedClass.status}
              </Badge>
            </div>
            
            <div className="mb-2">
              <span className="badge bg-primary me-2" style={{ fontSize: '0.75rem' }}>
                {selectedClass.Type}
              </span>
              <span className="badge bg-info text-dark" style={{ fontSize: '0.75rem' }}>
                {selectedClass.sessionType}
              </span>
            </div>
            
            <div className="small mb-2">
              <div className="d-flex align-items-center mb-1">
                <i className="bi bi-geo-alt me-2"></i>
                <span>{selectedClass.location?.location || 'N/A'}</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-person me-2"></i>
                <span>{selectedClass.Instructor?.name || 'N/A'}</span>
              </div>
            </div>
            
            {selectedClass.tags?.length > 0 && (
              <div className="mt-2">
                <div className="text-muted small mb-1">Tags:</div>
                <div className="d-flex flex-wrap gap-1">
                  {selectedClass.tags.map(tag => (
                    <span key={tag} className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Main Details Section */}
        <div className="col-md-8">
          <div className="card p-3 h-100">
            {/* Theme and Description */}
            <div className="mb-3">
              <h6 className="text-muted mb-2">Theme</h6>
              <p style={{ fontSize: '0.95rem' }}>{selectedClass.theme || '-'}</p>
            </div>
            
            {/* Date and Time Information */}
            <div className="row mb-3">
              <div className="col-md-6">
                <h6 className="text-muted mb-2">Start Date</h6>
                <p>{new Date(selectedClass.startDate || selectedClass.Date).toLocaleDateString()}</p>
              </div>
              <div className="col-md-6">
                <h6 className="text-muted mb-2">End Date</h6>
                <p>{new Date(selectedClass.endDate || selectedClass.Date).toLocaleDateString()}</p>
              </div>
            </div>
            
            {/* Class Status */}
            <div className="mb-3">
              <h6 className="text-muted mb-2">Class Status</h6>
              <Badge bg={selectedClass.classStatus === 'Live' ? 'success' : 'warning'} className="text-capitalize">
                {selectedClass.classStatus || 'N/A'}
              </Badge>
            </div>
            
            {/* Sessions Section */}
            {selectedClass.sessions?.length > 0 && (
              <div className="mb-3">
                <h6 className="text-muted mb-2">Sessions</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedClass.sessions.map((session, index) => (
                        <tr key={index}>
                          <td>{new Date(session.date).toLocaleDateString()}</td>
                          <td>{session.startTime}</td>
                          <td>{session.endTime}</td>
                          <td>
                            <Badge bg={session.status === 'Active' ? 'success' : 'secondary'} pill>
                              {session.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Additional Information */}
            <div className="row">
              <div className="col-md-6">
                <h6 className="text-muted mb-2">Created</h6>
                <p>{new Date(selectedClass.createdAt).toLocaleString()}</p>
              </div>
              <div className="col-md-6">
                <h6 className="text-muted mb-2">Last Updated</h6>
                <p>{new Date(selectedClass.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </Modal.Body>
  <Modal.Footer style={{ padding: '1rem', justifyContent: 'flex-end' }}>
    <Button 
      variant="outline-secondary" 
      onClick={() => setShowDetailsModal(false)}
      style={{ padding: '0.375rem 0.75rem' }}
    >
      Close
    </Button>
  </Modal.Footer>
</Modal>
<Modal show={showEditModal} onHide={() => { setShowEditModal(false); setSelectedClass(null); }} centered>
  <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
    <Modal.Title>Edit Class</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
    {selectedClass ? (
      <Form id="editClassForm">
        <Form.Group className="mb-3">
    <Form.Label>Title</Form.Label>
    <Form.Control 
      name="title" 
      defaultValue={selectedClass.title} 
      required 
    />
  </Form.Group>

  {/* Theme Field */}
  <Form.Group className="mb-3">
    <Form.Label>Theme</Form.Label>
    <Form.Control 
      name="theme" 
      defaultValue={selectedClass.theme} 
      required 
    />
  </Form.Group>

   <Form.Group className="mb-3">
    <Form.Label>Start Date</Form.Label>
    <Form.Control
      type="date"
      name="startDate"
      defaultValue={selectedClass.startDate ? selectedClass.startDate.split('T')[0] : ''}
      required
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>End Date</Form.Label>
    <Form.Control
      type="date"
      name="endDate"
      defaultValue={selectedClass.endDate ? selectedClass.endDate.split('T')[0] : ''}
      required
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Session Type</Form.Label>
    <Form.Select 
      name="sessionType" 
      defaultValue={selectedClass.sessionType || 'weekly'}
      required
    >
      <option value="weekly">Weekly</option>
      <option value="daily">Daily</option>
      <option value="monthly">Monthly</option>
    </Form.Select>
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>End Time</Form.Label>
    <Form.Control
      type="time"
      name="endTime"
      defaultValue={selectedClass.endTime || ''}
      required
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Type</Form.Label>
    <Form.Select 
      name="Type" 
      defaultValue={selectedClass.Type || 'Workshop'}
      required
    >
      <option value="Regular Class">Regular Class</option>
      <option value="Workshop">Workshop</option>
      <option value="Special Event">Special Event</option>
    </Form.Select>
  </Form.Group>

  {/* Time Field */}
  <Form.Group className="mb-3">
    <Form.Label>Time</Form.Label>
    <Form.Control
      type="time"
      name="time"
      defaultValue={selectedClass.time}
      required
    />
  </Form.Group>

  {/* Location Field */}
  <Form.Group className="mb-3">
    <Form.Label>Location</Form.Label>
    <Form.Select 
      name="location" 
      defaultValue={selectedClass.location?._id} 
      required
    >
      <option value="">Select a location</option>
      {allLocations.map((location) => (
        <option key={location._id} value={location._id}>
          {location.location}
        </option>
      ))}
    </Form.Select>
  </Form.Group>

  {/* Instructor Field */}
  <Form.Group className="mb-3">
    <Form.Label>Instructor</Form.Label>
    <Form.Select 
      name="instructor" 
      defaultValue={selectedClass.Instructor?._id} 
      required
    >
      <option value="">Select an instructor</option>
      {instructors.map((instructor) => (
        <option key={instructor._id} value={instructor._id}>
          {instructor.name}
        </option>
      ))}
    </Form.Select>
  </Form.Group>

  {/* Image Field */}
  <Form.Group className="mb-3">
    <Form.Label>Image</Form.Label>
    <Form.Control 
      type="file" 
      name="image" 
      accept="image/*" 
    />
    {selectedClass.Image && (
      <div className="mt-2">
        <small>Current Image:</small>
        <img 
          src={selectedClass.Image} 
          alt="Current class" 
          style={{ 
            maxWidth: '100px',
            maxHeight: '100px',
            display: 'block',
            marginTop: '5px'
          }} 
        />
      </div>
    )}
  </Form.Group>

        <div className="d-flex justify-content-end">
          <Button 
            variant="secondary" 
            onClick={() => setShowEditModal(false)} 
            className="me-2"
          >
            Cancel
          </Button>
     <Button
  type="button"
  variant="primary"
  onClick={handleUpdateClass}
  style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}
>
  Save Changes
</Button>
        </div>
      </Form>
    ) : (
      <div className="text-center">Loading...</div>
    )}
  </Modal.Body>
</Modal>



 <Modal show={showAddQuestionModal} onHide={() => { setShowAddQuestionModal(false); setQuestionText(''); setEditingQuestion(null); }} centered size="lg">
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <Modal.Title>
            {editingQuestion ? 'Edit Question' : `Add Questions for ${selectedClass?.title}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
          <Form onSubmit={(e) => {
            e.preventDefault();
            if (editingQuestion) {
              handleEditQuestion(selectedClass._id, editingQuestion._id);
            } else {
              handleAddQuestion(selectedClass._id);
            }
          }}>
            <Form.Group className="mb-3">
              <Form.Label>Question Text</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={questionText} 
                onChange={(e) => setQuestionText(e.target.value)} 
                required 
              />
            </Form.Group>
            <div className="d-flex justify-content-end mb-3">
              <Button variant="secondary" onClick={() => { 
                setQuestionText(''); 
                setEditingQuestion(null); 
              }} className="me-2">
                Clear
              </Button>
              <Button type="submit" variant="primary">
                {editingQuestion ? 'Update Question' : 'Add Question'}
              </Button>
            </div>
          </Form>

          <hr />

          <h5>Existing Questions</h5>
          {questions.length === 0 ? (
            <div className="text-center text-muted">No questions added yet.</div>
          ) : (
            <ListGroup>
              {questions.map((q, index) => (
                <ListGroup.Item key={q._id} className="d-flex justify-content-between align-items-center">
                  <div style={{ flex: 1 }}>
                    <strong>{index + 1}.</strong> {q.questionText}
                  </div>
                  <div>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setEditingQuestion(q);
                        setQuestionText(q.questionText);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'var(--accent)' }}>
          <Button variant="secondary" onClick={() => setShowAddQuestionModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

   

      {/* View Questions Modal */}
<Modal show={showViewQuestionsModal} onHide={() => setShowViewQuestionsModal(false)} centered size="lg">
  <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
    <Modal.Title>Questions for {selectedClass?.title}</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
    {questions.length === 0 ? (
      <div className="text-center text-muted">No questions added yet.</div>
    ) : (
      <ListGroup>
        {questions.map((q, index) => (
          <ListGroup.Item key={q._id} className="d-flex justify-content-between align-items-center">
            <div style={{ flex: 1 }}>
              <strong>{index + 1}.</strong> {q.questionText}
            </div>
            <div>
              <Button
                variant="outline-warning"
                size="sm"
                className="me-2"
                onClick={() => {
                  setEditingQuestion(q);
                  setQuestionText(q.questionText);
                  setShowViewQuestionsModal(false);
                  setShowAddQuestionModal(true);
                }}
              >
                Edit
              </Button>
        
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    )}
  </Modal.Body>
  <Modal.Footer style={{ backgroundColor: 'var(--accent)' }}>
    <Button variant="secondary" onClick={() => setShowViewQuestionsModal(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={() => {
      setQuestionText('');
      setEditingQuestion(null);
      setShowViewQuestionsModal(false);
      setShowAddQuestionModal(true);
    }}>
      Add New Question
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default ClassesWorkshops;
