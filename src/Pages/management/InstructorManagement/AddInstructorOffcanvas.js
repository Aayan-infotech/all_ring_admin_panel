
import React, { useEffect, useState } from 'react';
import { Offcanvas, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddInstructorOffcanvas = ({ show, handleClose, onInstructorAdded }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();
  const [locations, setLocations] = useState([]);
 // Fetch locations from API
// useEffect(() => {
//   const fetchLocations = async () => {
//     try {
//       const response = await axios.get('http://18.209.91.97:5010/api/location/getAllLocations');
//       setLocations(response.data?.data || []); // ✅ fix: use response.data.data instead of response.data.locations
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//       toast.error('Failed to load locations');
//     }
//   };

//   fetchLocations();
// }, []);
useEffect(() => {
  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://18.209.91.97:5010/api/location/getAllLocations');
      
      // Filter to only include active locations
      const activeLocations = (response.data?.data || [])
        .filter(location => location.status === 'Active');
      
      setLocations(activeLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
    }
  };

  fetchLocations();
}, []);
  const onSubmit = async (data) => {
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('location', data.location);
    formData.append('files', data.files[0]); // single file
      formData.append('prisonerid', '123456789');


    try {
      await axios.post('http://18.209.91.97:5010/api/auth/adminRegister/instructor', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Instructor added successfully!');
      onInstructorAdded();
      handleClose();
      reset();
    } catch (err) {
      toast.error('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const password = watch('password');

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
        <Offcanvas.Title>Add New Instructor</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ backgroundColor: 'var(--accent)' }}>
        <Form onSubmit={handleSubmit(onSubmit)} className="p-3 rounded shadow-sm" style={{ backgroundColor: '#fff' }}>
          
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              {...register('name', { required: 'Name is required' })}
              placeholder="Enter full name"
            />
            {errors.name && <span className="text-danger small">{errors.name.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="Enter email"
            />
            {errors.email && <span className="text-danger small">{errors.email.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              placeholder="Enter password"
            />
            {errors.password && <span className="text-danger small">{errors.password.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: (value) => value === password || 'Passwords do not match'
              })}
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && <span className="text-danger small">{errors.confirmPassword.message}</span>}
          </Form.Group>

          {/* <Form.Group className="mb-3">
           
            <Form.Select
  {...register('location', { required: 'Location is required' })}
  isInvalid={!!errors.location}
  style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
>
  <option value="">Select location</option>
  {locations.map((loc) => (
    <option key={loc._id} value={loc.location}>
      {loc.location}
    </option>
  ))}
</Form.Select>

          </Form.Group> */}
<Form.Group className="mb-3">
  <Form.Label>Location</Form.Label>
  <Form.Select
    {...register('location', { required: 'Location is required' })}
    isInvalid={!!errors.location}
    style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
  >
    <option value="">Select location</option>
    {locations.map((loc) => (
      <option key={loc._id} value={loc._id}>
        {loc.location}
      </option>
    ))}
  </Form.Select>
  {errors.location && <span className="text-danger small">{errors.location.message}</span>}
</Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              {...register('files', { required: 'Image is required' })}
            />
            {errors.files && <span className="text-danger small">{errors.files.message}</span>}
          </Form.Group>

          <div className="d-grid">
            <Button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: 'var(--primary)',
                border: 'none',
                padding: '10px',
                borderRadius: '10px',
                fontWeight: 'bold'
              }}
            >
              {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Add Instructor'}
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddInstructorOffcanvas;
