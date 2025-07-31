import React, { useEffect, useState } from 'react';
import { Offcanvas, Form, Button, Spinner, Row, Col,Alert  } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddClassOffcanvas = ({ show, handleClose, onSaved }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm();

  const [instructors, setInstructors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [noInstructorsAvailable, setNoInstructorsAvailable] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const startDate = watch('startDate');
  const selectedLocation = watch('location');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      setIsLoading(true);
      try {
        const locationsRes = await axios.get('http://54.205.149.77:5010/api/location/getAllLocations');
        
        const activeLocations = (locationsRes.data?.data || [])
          .filter(location => location.status === 'Active');

        setLocations(activeLocations);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load locations');
      } finally {
        setIsLoading(false);
      }
    };

    if (show) fetchData();
  }, [show]);

 useEffect(() => {
    const fetchInstructorsByLocation = async () => {
      if (!selectedLocation) {
        setInstructors([]);
        setNoInstructorsAvailable(false); // Reset this state
        return;
      }

      setIsLoading(true);
      setNoInstructorsAvailable(false); // Reset before new fetch
      
      try {
        const token = localStorage.getItem('adminToken');
        
        // Try the location-specific endpoint first
        try {
          const response = await axios.get(
            `http://54.205.149.77:5010/api/instructor/getByLocation/${selectedLocation}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (response.data?.data?.length > 0) {
            setInstructors(response.data.data);
            setNoInstructorsAvailable(false);
          } else {
            setNoInstructorsAvailable(true);
            setInstructors([]);
          }
          return;
        } catch (apiError) {
          console.log('Location-specific API failed, trying fallback');
        }
        
        // Fallback: get all instructors and filter
        const allInstructorsRes = await axios.get(
          'http://54.205.149.77:5010/api/admin/getRegister/instructor',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const filtered = allInstructorsRes.data?.users?.filter(inst => 
          inst.location && inst.location._id === selectedLocation
        ) || [];
        
        if (filtered.length > 0) {
          setInstructors(filtered);
          setNoInstructorsAvailable(false);
        } else {
          setNoInstructorsAvailable(true);
          setInstructors([]);
        }
        
      } catch (error) {
        console.error('Error fetching instructors:', error);
        toast.error('Failed to load instructors');
        setInstructors([]);
        setNoInstructorsAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchInstructorsByLocation();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedLocation]);

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

  const convertTo24HourFormat = (time12h) => {
    if (!time12h) return '';
    const [timePart, modifier] = time12h.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    const startTime = `${data.startTimeHour}:${data.startTimeMinute} ${data.startTimeAmPm}`;
    const endTime = `${data.endTimeHour}:${data.endTimeMinute} ${data.endTimeAmPm}`;
    
    const start = new Date(`01/01/2000 ${startTime}`);
    const end = new Date(`01/01/2000 ${endTime}`);
    if (end <= start) {
      toast.error('End time must be after start time');
      return;
    }
    
    formData.append('title', data.title);
    formData.append('theme', data.theme);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    formData.append('sessionType', data.sessionType);
    formData.append('startTime', convertTo24HourFormat(startTime));
    formData.append('endTime', convertTo24HourFormat(endTime));
    formData.append('location', data.location);
    formData.append('Instructor', data.instructor);
    formData.append('Type', data.type);
    
    if (data.image?.[0]) {
      formData.append('Image', data.image[0]);
    }
    
    tags.forEach(tag => formData.append('tags', tag));

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('http://54.205.149.77:5010/api/AdminClasses/addClass', formData, {
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
                  min={today}
                  onKeyDown={(e) => e.preventDefault()}
                  {...register('startDate', { 
                    required: 'Start date is required',
                    validate: value => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selectedDate >= today || "Start date cannot be in the past";
                    }
                  })}
                  isInvalid={!!errors.startDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.startDate?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="endDate">
                <Form.Label>End Date <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="date"
                  min={startDate || today}
                  onKeyDown={(e) => e.preventDefault()}
                  {...register('endDate', { 
                    required: 'End date is required',
                    validate: value => {
                      if (!startDate) return true;
                      return new Date(value) >= new Date(startDate) || "End date cannot be before start date";
                    }
                  })}
                  isInvalid={!!errors.endDate}
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
                >
                  <option value="">Select Session Type</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.sessionType?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

       
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

            <Row className="mb-3">
              <Form.Group as={Col} md={12} controlId="type">
                <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  {...register('type', { required: 'Type is required' })}
                  isInvalid={!!errors.type}
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
                  {...register('location', { 
                    required: 'Location is required',
                    onChange: (e) => {
                      // Reset instructor when location changes
                      setValue('instructor', '');
                      setNoInstructorsAvailable(false);
                    }
                  })}
                  isInvalid={!!errors.location}
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

            <Row className="mb-3">
              <Form.Group as={Col} md={12} controlId="instructor">
                <Form.Label>Instructor <span className="text-danger">*</span></Form.Label>
                {isLoading && selectedLocation ? (
                  <div className="d-flex align-items-center">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span>Loading instructors...</span>
                  </div>
                ) : noInstructorsAvailable ? (
                  <Alert variant="warning" className="py-2">
                    No instructors available for this location
                  </Alert>
                ) : (
                  <Form.Select
                    {...register('instructor', { required: 'Instructor is required' })}
                    isInvalid={!!errors.instructor}
                    disabled={!selectedLocation || instructors.length === 0}
                  >
                    <option value="">{selectedLocation ? 'Select Instructor' : 'Select a location first'}</option>
                    {instructors.map(inst => (
                      <option key={inst._id} value={inst._id}>{inst.name}</option>
                    ))}
                  </Form.Select>
                )}
                <Form.Control.Feedback type="invalid">
                  {errors.instructor?.message}
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