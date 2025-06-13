
import React, { useEffect, useState } from 'react';
import { Offcanvas, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddClassOffcanvas = ({ show, handleClose, onSaved }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [instructors, setInstructors] = useState([]);
  const [locations, setLocations] = useState([]);

  // Fetch instructors & locations
  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    axios.get('http://18.209.91.97:5010/api/admin/getRegister/instructor', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setInstructors(res.data?.users || []));

    axios.get('http://18.209.91.97:5010/api/location/getAllLocations')
      .then(res => setLocations(res.data?.data || []));
  }, []);

  // Submit handler
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('theme', data.theme);
    formData.append('Date', data.date);
    formData.append('startTime', data.time);
    formData.append('endTime', data.endtime);
    formData.append('location', data.location);
    formData.append('Instructor', data.instructor);
    formData.append('Type', data.type);
    formData.append('Image', data.image[0]);

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
      onSaved();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add class');
    }
  };

  return (
    <Offcanvas show={show} onHide={() => { handleClose(); reset(); }} placement="end">
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
        <Offcanvas.Title>Add New Class / Workshop</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ backgroundColor: 'var(--accent)' }}>
        <Form onSubmit={handleSubmit(onSubmit)} className="p-3 rounded shadow-sm" style={{ backgroundColor: '#fff' }}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control {...register('title', { required: 'Title is required' })} />
            {errors.title && <span className="text-danger small">{errors.title.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control 
              type="file" 
              accept="image/*" 
              {...register('image', { required: 'Image is required' })} 
            />
            {errors.image && <span className="text-danger small">{errors.image.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description / Theme</Form.Label>
            <Form.Control {...register('theme', { required: 'Theme is required' })} />
            {errors.theme && <span className="text-danger small">{errors.theme.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" {...register('date', { required: 'Date is required' })} />
            {errors.date && <span className="text-danger small">{errors.date.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control type="time" {...register('time', { required: 'Start time is required' })} />
            {errors.time && <span className="text-danger small">{errors.time.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control type="time" {...register('endtime', { required: 'End time is required' })} />
            {errors.endtime && <span className="text-danger small">{errors.endtime.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Instructor</Form.Label>
            <Form.Select {...register('instructor', { required: 'Instructor is required' })}>
              <option value="">-- Select Instructor --</option>
              {instructors.map(inst => (
                <option key={inst._id} value={inst._id}>{inst.name}</option>
              ))}
            </Form.Select>
            {errors.instructor && <span className="text-danger small">{errors.instructor.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select {...register('type', { required: 'Type is required' })}>
              <option value="">-- Select Type --</option>
              <option value="Regular Class">Regular Class</option>
              <option value="Workshop">Workshop</option>
              <option value="Special Event">Special Event</option>
            </Form.Select>
            {errors.type && <span className="text-danger small">{errors.type.message}</span>}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Location</Form.Label>
            <Form.Select {...register('location', { required: 'Location is required' })}>
              <option value="">-- Select Location --</option>
              {locations.map(loc => (
                <option key={loc._id} value={loc._id}>{loc.location}</option>
              ))}
            </Form.Select>
            {errors.location && <span className="text-danger small">{errors.location.message}</span>}
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" disabled={isSubmitting} style={{ backgroundColor: 'var(--primary)', border: 'none' }}>
              {isSubmitting ? <Spinner size="sm" animation="border" /> : 'Save'}
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddClassOffcanvas;