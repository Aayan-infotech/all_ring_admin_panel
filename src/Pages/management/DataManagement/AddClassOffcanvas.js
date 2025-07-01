



import React, { useEffect, useState } from 'react';
import { Offcanvas, Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddClassOffcanvas = ({ show, handleClose, onSaved }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [instructors, setInstructors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const token = localStorage.getItem('adminToken');
  //     if (!token) return;

  //     setIsLoading(true);
  //     try {
  //       const [instructorsRes, locationsRes] = await Promise.all([
  //         axios.get('http://18.209.91.97:5010/api/admin/getRegister/instructor', {
  //           headers: { Authorization: `Bearer ${token}` }
  //         }),
  //         axios.get('http://18.209.91.97:5010/api/location/getAllLocations')
  //       ]);
  //       setInstructors(instructorsRes.data?.users || []);
  //       setLocations(locationsRes.data?.data || []);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       toast.error('Failed to load form data');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (show) fetchData();
  // }, [show]);




  useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setIsLoading(true);
    try {
      const [instructorsRes, locationsRes] = await Promise.all([
        axios.get('http://18.209.91.97:5010/api/admin/getRegister/instructor', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://18.209.91.97:5010/api/location/getAllLocations')
      ]);

      // Filter active locations (status is 'Active')
      const activeLocations = (locationsRes.data?.data || [])
        .filter(location => location.status === 'Active');

      setInstructors(instructorsRes.data?.users || []);
      setLocations(activeLocations); // only active locations
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load form data');
    } finally {
      setIsLoading(false);
    }
  };

  if (show) fetchData();
}, [show]);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

const onSubmit = async (data) => {
  const formData = new FormData();
  
  // Append fields exactly as in the curl request
  formData.append('title', data.title);
  formData.append('theme', data.theme);
  formData.append('startDate', data.startDate);
  formData.append('endDate', data.endDate);
  formData.append('sessionType', data.sessionType);
  formData.append('startTime', data.startTime);
  formData.append('endTime', data.endTime);
  formData.append('location', data.location);
  formData.append('Instructor', data.instructor); // Note capital 'I'
  formData.append('Type', data.type); // Note capital 'T'
  
  // Append image file
  if (data.image && data.image[0]) {
    formData.append('Image', data.image[0]); // Note capital 'I'
  }
  
  // Append tags as separate fields (tags[] format)
  tags.forEach(tag => {
    formData.append('tags', tag);
  });

  try {
    const token = localStorage.getItem('adminToken');
    await axios.post('http://18.209.91.97:5010/api/AdminClasses/addClass', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    toast.success('Class added successfully');
    handleClose();
    reset();
    setTags([]);
    onSaved();
  } catch (err) {
    console.error('Error adding class:', err);
    toast.error(err.response?.data?.message || 'Failed to add class');
  }
};

  const handleCloseOffcanvas = () => {
    reset();
    setTags([]);
    handleClose();
  };

  return (
    <Offcanvas 
      show={show} 
      onHide={handleCloseOffcanvas} 
      placement="end" 
      backdrop="static"
      style={{ backgroundColor: 'var(--accent)' }}
    >
      <Offcanvas.Header 
        closeButton 
        style={{ 
          backgroundColor: 'var(--secondary)', 
          color: 'white',
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <Offcanvas.Title className="fw-bold">Add New Class/Workshop</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="p-4" style={{ backgroundColor: 'var(--accent)' }}>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-3">
              <Form.Group as={Col} md={12} controlId="title">
                <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  isInvalid={!!errors.title}
                  placeholder="Enter class title"
                  // style={{ borderColor: 'var(--secondary)' }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={12} controlId="image">
                <Form.Label>Image <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  {...register('image', { required: 'Image is required' })}
                  isInvalid={!!errors.image}
                  // style={{ borderColor: 'var(--secondary)' }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.image?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={12} controlId="theme">
                <Form.Label>Description/Theme <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  {...register('theme', { required: 'Theme is required' })}
                  isInvalid={!!errors.theme}
                  placeholder="Enter class description"
                  // style={{ borderColor: 'var(--secondary)' }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.theme?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={6} controlId="startDate">
                <Form.Label>Start Date <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="date"
                  {...register('startDate', { required: 'Start date is required' })}
                  isInvalid={!!errors.startDate}
                  // style={{ borderColor: 'var(--secondary)' }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.startDate?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="endDate">
                <Form.Label>End Date <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="date"
                  {...register('endDate', { required: 'End date is required' })}
                  isInvalid={!!errors.endDate}
                  // style={{ borderColor: 'var(--secondary)' }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.endDate?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={12} controlId="sessionType">
                <Form.Label>Session Type <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  {...register('sessionType', { required: 'Session type is required' })}
                  isInvalid={!!errors.sessionType}
                  // style={{ borderColor: 'var(--secondary)' }}
                >
                  <option value="">Select Session Type</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="one-time">One-time</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.sessionType?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={6} controlId="startTime">
                <Form.Label>Start Time <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="time"
                  {...register('startTime', { required: 'Start time is required' })}
                  isInvalid={!!errors.startTime}
                  // style={{ borderColor: 'var(--secondary)' }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.startTime?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="endTime">
                <Form.Label>End Time <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="time"
                  {...register('endTime', { required: 'End time is required' })}
                  isInvalid={!!errors.endTime}
                  // style={{ borderColor: 'var(--secondary)' }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.endTime?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={12} controlId="instructor">
                <Form.Label>Instructor <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  {...register('instructor', { required: 'Instructor is required' })}
                  isInvalid={!!errors.instructor}
                  // style={{ borderColor: 'var(--secondary)' }}
                >
                  <option value="">Select Instructor</option>
                  {instructors.map(inst => (
                    <option key={inst._id} value={inst._id}>{inst.name}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.instructor?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={12} controlId="type">
                <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  {...register('type', { required: 'Type is required' })}
                  isInvalid={!!errors.type}
                  // style={{ borderColor: 'var(--secondary)' }}
                >
                  <option value="">Select Type</option>
                  <option value="Regular Class">Regular Class</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Special Event">Special Event</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.type?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={12} controlId="location">
                <Form.Label>Location <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  {...register('location', { required: 'Location is required' })}
                  isInvalid={!!errors.location}
                  // style={{ borderColor: 'var(--secondary)' }}
                >
                  <option value="">Select Location</option>
                  {locations.map(loc => (
                    <option key={loc._id} value={loc._id}>{loc.location}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.location?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-4">
              <Form.Group as={Col} md={12} controlId="tags">
                <Form.Label>Tags</Form.Label>
                <div className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                    // style={{ borderColor: 'var(--secondary)' }}
                  />
                  <Button 
                    variant="primary" 
                    className="ms-2"
                    onClick={handleAddTag}
                    style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}
                  >
                    Add
                  </Button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span key={tag} className="badge d-flex align-items-center" 
                      style={{ backgroundColor: 'var(--primary)' }}>
                      {tag}
                      <button 
                        type="button" 
                        className="btn-close btn-close-white ms-2" 
                        style={{ fontSize: '0.5rem' }} 
                        onClick={() => handleRemoveTag(tag)}
                        aria-label="Remove"
                      />
                    </span>
                  ))}
                </div>
              </Form.Group>
            </Row>

            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  borderColor: 'var(--primary)',
                  fontWeight: 'bold'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : 'Save Class'}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={handleCloseOffcanvas}
                size="lg"
                style={{ 
                  borderColor: 'var(--secondary)',
                  color: 'var(--secondary)',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddClassOffcanvas;