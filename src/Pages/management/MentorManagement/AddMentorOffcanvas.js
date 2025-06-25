

import { useForm } from 'react-hook-form';
import { Offcanvas, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';

const AddMentorOffcanvas = ({ show, handleClose, onMentorAdded }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();
  const [locations, setLocations] = useState([]);



  useEffect(() => {
  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://18.209.91.97:5010/api/location/getAllLocations');
      setLocations(response.data?.data || []); // ✅ fix: use response.data.data instead of response.data.locations
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
    }
  };

  fetchLocations();
}, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('number', data.number);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('dateofbirth', data.dateofbirth);
    formData.append('location', data.location);
    formData.append('expertise', data.expertise);
    formData.append('files', data.files[0]);

    try {
      await axios.post(
        'http://18.209.91.97:5010/api/auth/adminRegister/mentor',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Mentor registered successfully!');
      onMentorAdded();
      reset();
      handleClose();
    } catch (err) {
      toast.error(`Failed: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
        <Offcanvas.Title>Add New Mentor</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ backgroundColor: 'var(--accent)' }}>
        <Form onSubmit={handleSubmit(onSubmit)} className="p-3 rounded shadow-sm" style={{ backgroundColor: '#fff' }}>
          
          {/* Name */}
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span className="text-danger small">{errors.name.message}</span>}
          </Form.Group>

          {/* Phone Number */}
          <Form.Group className="mb-3" controlId="number">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              {...register('number', { required: 'Phone number is required' })}
            />
            {errors.number && <span className="text-danger small">{errors.number.message}</span>}
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <span className="text-danger small">{errors.email.message}</span>}
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <span className="text-danger small">{errors.password.message}</span>}
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter password"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (val) => val === watch('password') || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && <span className="text-danger small">{errors.confirmPassword.message}</span>}
          </Form.Group>

         <Form.Group className="mb-3" controlId="dateofbirth">
  <Form.Label>Date of Birth (DD-MM-YYYY or DD/MM/YYYY)</Form.Label>
  <Form.Control
    type="text"
    placeholder="e.g. 25-12-1995 or 25/12/1995"
    {...register('dateofbirth', {
      required: 'Date of Birth is required',
      pattern: {
        value: /^(0?[1-9]|[12][0-9]|3[01])[-\/](0?[1-9]|1[012])[-\/]\d{4}$/,
        message: 'Use format DD-MM-YYYY or DD/MM/YYYY'
      }
    })}
  />
  {errors.dateofbirth && <span className="text-danger small">{errors.dateofbirth.message}</span>}
</Form.Group>


          {/* <Form.Group className="mb-3" controlId="location">
           
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

          <Form.Group className="mb-3" controlId="location">
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


          {/* Expertise */}
          <Form.Group className="mb-3" controlId="expertise">
            <Form.Label>Expertise</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Data Science"
              {...register('expertise', { required: 'Expertise is required' })}
            />
            {errors.expertise && <span className="text-danger small">{errors.expertise.message}</span>}
          </Form.Group>

          {/* Image Upload */}
          <Form.Group className="mb-4" controlId="files">
            <Form.Label>Upload Profile Image</Form.Label>
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
              {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Register Mentor'}
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddMentorOffcanvas;

