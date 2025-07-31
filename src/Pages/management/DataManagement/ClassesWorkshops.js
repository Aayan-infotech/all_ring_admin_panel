
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
  ListGroup,
Alert,
  Pagination
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
import { useForm } from 'react-hook-form';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showViewQuestionsModal, setShowViewQuestionsModal] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const [sessionPage, setSessionPage] = useState(1);
const [sessionsPerPage] = useState(5); // You can adjust this number

  const [editModalInstructors, setEditModalInstructors] = useState([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [noInstructorsAvailable, setNoInstructorsAvailable] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm();
  // 2. Add a function to fetch instructors
  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://54.205.149.77:5010/api/admin/getRegister/instructor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInstructors(res.data?.users || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setInstructors([]);
    }
  };



  useEffect(() => {
    const fetchInstructorsByLocation = async () => {
      if (!selectedClass?.location?._id) {
        setEditModalInstructors([]);
        setNoInstructorsAvailable(false);
        return;
      }

      setLoadingInstructors(true);
      setNoInstructorsAvailable(false);

      try {
        const token = localStorage.getItem('adminToken');

        // Try the location-specific endpoint first
        try {
          const response = await axios.get(
            `http://54.205.149.77:5010/api/instructor/getByLocation/${selectedClass.location._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data?.data?.length > 0) {
            setEditModalInstructors(response.data.data);
            return;
          }
        } catch (apiError) {
          console.log('Location-specific API failed, trying fallback');
        }

        // Fallback: get all instructors and filter
        const allInstructorsRes = await axios.get(
          'http://54.205.149.77:5010/api/admin/getRegister/instructor',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const filtered = allInstructorsRes.data?.users?.filter(inst =>
          inst.location && inst.location._id === selectedClass.location._id
        ) || [];

        if (filtered.length > 0) {
          setEditModalInstructors(filtered);
        } else {
          setNoInstructorsAvailable(true);
          setEditModalInstructors([]);
        }

      } catch (error) {
        console.error('Error fetching instructors:', error);
        toast.error('Failed to load instructors');
        setEditModalInstructors([]);
      } finally {
        setLoadingInstructors(false);
      }
    };

    if (selectedClass?.location?._id) {
      fetchInstructorsByLocation();
    }
  }, [selectedClass?.location?._id]);
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filterLocation && { filterLocation: filterLocation }),
        ...(filterStatus && { status: filterStatus }),
        ...(search && { search })
      };

      const res = await axios.get('http://54.205.149.77:5010/api/AdminClasses/getAllClasses', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      setClasses(res.data?.data || []);
      setPagination(prev => ({
        ...prev,
        total: res.data?.total || 0,
        page: res.data?.page || 1,
        limit: res.data?.limit || 10
      }));
    } catch (err) {
      console.error('Error fetching classes:', err);
      setClasses([]);
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateClass = async () => {
    const form = document.getElementById('editClassForm');
    const formData = new FormData();

    // Get time values from react-hook-form
    const startTimeHour = form.startTimeHour.value;
    const startTimeMinute = form.startTimeMinute.value;
    const startTimeAmPm = form.startTimeAmPm.value;

    const endTimeHour = form.endTimeHour.value;
    const endTimeMinute = form.endTimeMinute.value;
    const endTimeAmPm = form.endTimeAmPm.value;

    // Format times
    const formatTime = (hour, minute, ampm) => {
      if (!hour || !minute || !ampm) return '';
      return `${hour}:${minute} ${ampm}`;
    };

    const startTime = formatTime(startTimeHour, startTimeMinute, startTimeAmPm);
    const endTime = formatTime(endTimeHour, endTimeMinute, endTimeAmPm);

    // Convert to 24-hour format for API
    const convertTo24HourFormat = (time12h) => {
      if (!time12h) return '';
      const [timePart, modifier] = time12h.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      const hh = String(hours).padStart(2, '0');
      const mm = String(minutes).padStart(2, '0');
      return `${hh}:${mm}`;
    };

    // Append all fields
    formData.append('title', form.title.value);
    formData.append('theme', form.theme.value);
    formData.append('tags', JSON.stringify([]));
    formData.append('startDate', form.startDate.value || new Date().toISOString().split('T')[0]);
    formData.append('endDate', form.endDate.value || new Date().toISOString().split('T')[0]);
    formData.append('sessionType', form.sessionType.value || 'weekly');
    formData.append('startTime', convertTo24HourFormat(startTime));
    formData.append('endTime', convertTo24HourFormat(endTime));
    formData.append('location', form.location.value);
    formData.append('Instructor', form.instructor.value);
    formData.append('Type', form.Type.value);

    // Handle image upload
    if (form.image.files[0]) {
      formData.append('Image', form.image.files[0]);
    } else if (selectedClass.Image) {
      formData.append('Image', selectedClass.Image);
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `http://54.205.149.77:5010/api/AdminClasses/updateClass/${selectedClass._id}`,
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
      const response = await axios.get('http://54.205.149.77:5010/api/location/getAllLocations');

      // Filter to only include active locations
      const activeLocations = (response.data?.data || [])
        .filter(location => location.status === 'Active');

      setAllLocations(activeLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
    }
  };

  // const fetchLocations = async () => {
  //   try {
  //     const res = await axios.get('http://54.205.149.77:5010/api/location/getAllLocations');
  //     setAllLocations(res.data?.data || []);
  //   } catch (err) {
  //     console.error('Error fetching locations:', err);
  //   }
  // };

  const fetchQuestions = async (classId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(
        `http://54.205.149.77:5010/api/questionaire/getQuestions/${classId}`,
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
    fetchInstructors();
  }, [pagination.page, pagination.limit, filterLocation, filterStatus, search]);
  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.patch(
        `http://54.205.149.77:5010/api/AdminClasses/blockClass/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Status toggle response:', response.data);

      setClasses(prev =>
        prev.map(cls =>
          cls._id === id ? {
            ...cls,
            status: response.data.data.status // Use the status from response
          } : cls
        )
      );

      toast.success(`Status changed to ${response.data.data.status}`);
    } catch (err) {
      console.error('Status toggle failed:', err);
      toast.error('Failed to update status');
    }
  };
  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://54.205.149.77:5010/api/AdminClasses/deleteClass/${itemToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClasses(prev => prev.filter(cls => cls._id !== itemToDelete));
      setShowDeleteModal(false);
      toast.success('Class deleted successfully!');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete class');
    }
  };



  const handleAddQuestion = async (classId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `http://54.205.149.77:5010/api/questionaire/addQuestions/${classId}`,
        { questionText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Question added successfully!');
      setQuestionText('');
      // setShowAddQuestionModal(false);
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
        `http://54.205.149.77:5010/api/questionaire/editQuestion/${classId}/${questionId}`,
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
    // Compare location _id instead of location name
    const matchesLocation = filterLocation ? cls.location?._id === filterLocation : true;
    const matchesStatus = filterStatus ? cls.status?.toLowerCase() === filterStatus.toLowerCase() : true;
    return matchesTitle && matchesLocation && matchesStatus;
  });
  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return '';
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };


  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)', fontWeight: 600 }}>Classes and Workshop</h2>
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
          >
            <option value="">All Locations</option>
            {allLocations.map(loc => (
              <option key={loc._id} value={loc._id}>  {/* This is correct */}
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
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
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
                    <Badge
                      bg={item.status === 'Active' ? 'success' : 'danger'}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">

                      <Button
                        variant="light"
                        className={`icon-btn border-0 ${item.status === 'Active' ? 'bg-light border-danger text-danger' : 'bg-light border-success text-success'}`}
                        size="sm"
                        onClick={() => toggleStatus(item._id)}
                        title={item.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {item.status === 'Active' ? <XCircleFill size={16} /> : <CheckCircleFill size={16} />}
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
                        onClick={() => handleDeleteClick(item._id)}
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

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} entries
        </div>

        <Pagination>
          <Pagination.Prev
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
            disabled={pagination.page === 1}
          />

          {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === pagination.page}
              onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
            >
              {i + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, Math.ceil(pagination.total / pagination.limit)) }))}
            disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
          />
        </Pagination>
      </div>



      {/* Delete Confirmation Modal */}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>

        <Modal.Header closeButton>

          <Modal.Title>Confirm Delete</Modal.Title>

        </Modal.Header>

        <Modal.Body>

          Are you sure you want to delete this location? This action cannot be undone.

        </Modal.Body>

        <Modal.Footer>

          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>

            Cancel

          </Button>

          <Button variant="danger" onClick={handleDelete}>

            Delete

          </Button>

        </Modal.Footer>

      </Modal>
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
                  
                  </div>

                <div className="mb-2 d-flex flex-wrap gap-2">
  <span className="badge bg-primary" style={{ fontSize: '0.75rem' }}>
    {selectedClass.Type}
  </span>
  <span className="badge bg-info text-dark" style={{ fontSize: '0.75rem' }}>
    {selectedClass.sessionType}
  </span>
  <span className="badge bg-danger text-white" style={{ fontSize: '0.75rem' }}>
    {selectedClass.status}
  </span>
</div>


<div className="small mb-2">
  {/* Location */}
  <div className="d-flex align-items-center mb-2">
    <i className="bi bi-geo-alt-fill text-danger me-2 fs-5"></i>
    <span className="text-muted">{selectedClass.location?.location || 'N/A'}</span>
  </div>

  {/* Instructor */}
  <div className="d-flex align-items-center">
    <i className="bi bi-person-fill text-primary me-2 fs-5"></i>
    <span className="text-muted">{selectedClass.Instructor?.name || 'N/A'}</span>
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

              {/* Main Details Section */}Edit Class

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
                  {/* {selectedClass.sessions?.length > 0 && (
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
                               
                                   <Badge bg={session.sessionStatus === 'live' ? 'success' : 'warning'} className="text-capitalize">
                      {session.sessionStatus || 'N/A'}
                    </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {filtered.length > 0 && (
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                              {pagination.total} entries
                            </div>
                            <div>
                              <Button
                                variant="outline-secondary"
                                disabled={pagination.page === 1}
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                className="me-2"
                              >
                                Previous
                              </Button>
                              <Button
                                variant="outline-secondary"
                                disabled={pagination.page * pagination.limit >= pagination.total}
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )} */}
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
          {selectedClass.sessions
            .slice(
              (sessionPage - 1) * sessionsPerPage,
              sessionPage * sessionsPerPage
            )
            .map((session, index) => (
              <tr key={index}>
                <td>{new Date(session.date).toLocaleDateString()}</td>
                <td>{session.startTime}</td>
                <td>{session.endTime}</td>
                <td>
                  <Badge 
                    bg={session.sessionStatus === 'live' ? 'success' : 'warning'} 
                    className="text-capitalize"
                  >
                    {session.sessionStatus || 'N/A'}
                  </Badge>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      
      {/* Pagination controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted small">
          Showing {Math.min(
            (sessionPage - 1) * sessionsPerPage + 1, 
            selectedClass.sessions.length
          )} to {Math.min(
            sessionPage * sessionsPerPage, 
            selectedClass.sessions.length
          )} of {selectedClass.sessions.length} sessions
        </div>
        
        <div>
          <Pagination size="sm">
            <Pagination.Prev 
              onClick={() => setSessionPage(prev => Math.max(prev - 1, 1))}
              disabled={sessionPage === 1}
            />
            
            {Array.from(
              { length: Math.ceil(selectedClass.sessions.length / sessionsPerPage) }, 
              (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === sessionPage}
                  onClick={() => setSessionPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              )
            )}
            
            <Pagination.Next
              onClick={() => setSessionPage(prev => 
                Math.min(prev + 1, Math.ceil(selectedClass.sessions.length / sessionsPerPage))
              )}
              disabled={sessionPage >= Math.ceil(selectedClass.sessions.length / sessionsPerPage)}
            />
          </Pagination>
        </div>
      </div>
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


              <Form.Group className="mb-3">
                <Form.Label>Theme</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}  // Adjust number of visible rows
                  name="theme"
                  defaultValue={selectedClass.theme}
                  required
                  style={{
                    minHeight: '100px',  // Minimum height
                    resize: 'vertical'   // Allow vertical resizing
                  }}
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

            
              <Row className="mb-3">
                {/* START TIME */}
                <Form.Group as={Col} md={6} controlId="startTime">
                  <Form.Label>Start Time <span className="text-danger">*</span></Form.Label>
                  <div className="d-flex gap-2 align-items-start">
                    <div>
                      <Form.Label className="small">Hour</Form.Label>
                      <Form.Select
                        {...register('startTimeHour', { required: 'Start hour is required' })}
                        isInvalid={!!errors.startTimeHour}
                      >
                        <option value="">Hour</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                          <option key={`start-hour-${hour}`} value={hour}>{hour}</option>
                        ))}
                      </Form.Select>
                    </div>

                    <div>
                      <Form.Label className="small">Minute</Form.Label>
                      <Form.Select
                        {...register('startTimeMinute', { required: 'Start minute is required' })}
                        isInvalid={!!errors.startTimeMinute}
                      >
                        <option value="">Min</option>
                        {Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')).map(min => (
                          <option key={`start-min-${min}`} value={min}>{min}</option>
                        ))}
                      </Form.Select>
                    </div>

                    <div>
                      <Form.Label className="small">AM/PM</Form.Label>
                      <Form.Select
                        {...register('startTimeAmPm', { required: 'Start AM/PM is required' })}
                        isInvalid={!!errors.startTimeAmPm}
                      >
                        <option value="">AM/PM</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </Form.Select>
                    </div>
                  </div>

                  {(errors.startTimeHour || errors.startTimeMinute || errors.startTimeAmPm) && (
                    <div className="text-danger small mt-1">Start time is required</div>
                  )}

                  {/* 🟢 Start Time Preview */}
                  <div className="mt-2 small text-muted">
                    Selected: {watch('startTimeHour') || '--'}:
                    {watch('startTimeMinute') || '--'} {watch('startTimeAmPm') || '--'}
                  </div>
                </Form.Group>

                {/* END TIME */}
                <Form.Group as={Col} md={6} controlId="endTime">
                  <Form.Label>End Time <span className="text-danger">*</span></Form.Label>
                  <div className="d-flex gap-2 align-items-start">
                    <div>
                      <Form.Label className="small">Hour</Form.Label>
                      <Form.Select
                        {...register('endTimeHour', { required: 'End hour is required' })}
                        isInvalid={!!errors.endTimeHour}
                      >
                        <option value="">Hour</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                          <option key={`end-hour-${hour}`} value={hour}>{hour}</option>
                        ))}
                      </Form.Select>
                    </div>

                    <div>
                      <Form.Label className="small">Minute</Form.Label>
                      <Form.Select
                        {...register('endTimeMinute', { required: 'End minute is required' })}
                        isInvalid={!!errors.endTimeMinute}
                      >
                        <option value="">Min</option>
                        {Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')).map(min => (
                          <option key={`end-min-${min}`} value={min}>{min}</option>
                        ))}
                      </Form.Select>
                    </div>

                    <div>
                      <Form.Label className="small">AM/PM</Form.Label>
                      <Form.Select
                        {...register('endTimeAmPm', { required: 'End AM/PM is required' })}
                        isInvalid={!!errors.endTimeAmPm}
                      >
                        <option value="">AM/PM</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </Form.Select>
                    </div>
                  </div>

                  {(errors.endTimeHour || errors.endTimeMinute || errors.endTimeAmPm) && (
                    <div className="text-danger small mt-1">End time is required</div>
                  )}

                  {/* 🟢 End Time Preview */}
                  <div className="mt-2 small text-muted">
                    Selected: {watch('endTimeHour') || '--'}:
                    {watch('endTimeMinute') || '--'} {watch('endTimeAmPm') || '--'}
                  </div>
                </Form.Group>
              </Row>

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
  {loadingInstructors ? (
    <div className="d-flex align-items-center">
      <Spinner animation="border" size="sm" className="me-2" />
      <span>Loading instructors...</span>
    </div>
  ) : noInstructorsAvailable ? (
    <Alert variant="warning" className="py-2 mb-0">
      No instructors available for this location
    </Alert>
  ) : (
    <Form.Select 
      name="instructor" 
      defaultValue={selectedClass.Instructor?._id} 
      required
    >
      <option value="">Select an instructor</option>
      {editModalInstructors.map((instructor) => (
        <option key={instructor._id} value={instructor._id}>
          {instructor.name}
        </option>
      ))}
    </Form.Select>
  )}
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
