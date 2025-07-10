import { Offcanvas, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import 'react-phone-input-2/lib/bootstrap.css';
import PhoneInput from 'react-phone-input-2';

const AddUserOffcanvas = ({ show, handleClose, onUserAdded , editingUser }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
      clearErrors,  // Add this
  setError,     // Add this
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      location: '',
      number: '',
      password: '',
      confirmPassword: '',
      dateofbirth: '',
      files: null,
    },
  });
    const [locations, setLocations] = useState([]);
useEffect(() => {
  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://18.209.91.97:5010/api/location/getAllLocations');
      // Filter only active locations
      const activeLocations = (response.data?.data || []).filter(loc => loc.status === 'Active');
      setLocations(activeLocations); 
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
    }
  };

  fetchLocations();
}, []);




  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('location', data.location);
    formData.append('number', data.number);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('dateofbirth', formatDate(data.dateofbirth));
    if (data.files?.[0]) formData.append('files', data.files[0]);

    try {
      await axios.post(
        `http://18.209.91.97:5010/api/auth/adminRegister/user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('User added successfully!', { autoClose: 3000 });
      onUserAdded();
      handleClose();
      reset();
    } catch (err) {
      toast.error('Failed to add user: ' + (err.response?.data?.message || err.message), {
        autoClose: 4000,
      });
    }
  };


  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
        <Offcanvas.Title>Add New User</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ backgroundColor: 'var(--accent)' }}>
        <Form onSubmit={handleSubmit(onSubmit)} className="p-3 rounded shadow-sm" style={{ backgroundColor: '#fff' }}>
          <Form.Group className="mb-4" controlId="name">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Name</Form.Label>
            <Form.Control
              type="text"
              {...register('name', { required: 'Name is required' })}
              isInvalid={!!errors.name}
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
              placeholder="Enter full name"
            />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="email">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Email</Form.Label>
            <Form.Control
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              isInvalid={!!errors.email}
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
              placeholder="Enter email address"
            />
            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>

         

          <Form.Group className="mb-4" controlId="location">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Location</Form.Label>
     



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

            <Form.Control.Feedback type="invalid">{errors.location?.message}</Form.Control.Feedback>
          </Form.Group>

{/* <Form.Group className="mb-4" controlId="number">
  <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Phone Number</Form.Label>
  <PhoneInput
    country={'in'}
    enableSearch={true}
    inputStyle={{
      width: '100%',
      border: '2px solid var(--accent)',
      borderRadius: '8px',
    }}
    specialLabel=""
    value={watch('number')}
    onChange={(phone) => {
      // Set value manually because react-hook-form doesn't bind this component directly
      setValue('number', phone);
    }}
    isValid={(value) => {
      if (!value || value.length < 6) return 'Invalid number';
      return true;
    }}
  />
  {errors.number && (
    <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
      {errors.number.message}
    </div>
  )}
</Form.Group> */}

<Form.Group className="mb-4" controlId="number">
  <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Phone Number</Form.Label>
  <PhoneInput
    country={'in'}
    enableSearch={true}
    inputStyle={{
      width: '100%',
      border: '2px solid var(--accent)',
      borderRadius: '8px',
    }}
    specialLabel=""
    value={watch('number')}
    onChange={(phone) => {
      setValue('number', phone);
      // Clear error when user starts typing
      if (errors.number) {
        clearErrors('number');
      }
    }}
  />
  {errors.number && (
    <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
      {errors.number.message}
    </div>
  )}
</Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Password</Form.Label>
            <Form.Control
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              isInvalid={!!errors.password}
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
              placeholder="Enter password"
            />
            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm password',
                validate: value => value === watch('password') || 'Passwords do not match',
              })}
              isInvalid={!!errors.confirmPassword}
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
              placeholder="Confirm password"
            />
            <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
          </Form.Group>
<Form.Group className="mb-4" controlId="dateofbirth">
  <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Date of Birth</Form.Label>
  <Form.Control
    type="date"
    {...register('dateofbirth', { 
      required: 'Date of birth is required',
      validate: {
        notFuture: value => {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Remove time part
          return selectedDate <= today || "Date cannot be in the future";
        }
      }
    })}
    isInvalid={!!errors.dateofbirth}
    style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
    max={new Date().toISOString().split('T')[0]} // Disable future dates
    onKeyDown={(e) => e.preventDefault()} // Prevent manual typing
    onPaste={(e) => e.preventDefault()} // Prevent pasting
  />
  <Form.Control.Feedback type="invalid">
    {errors.dateofbirth?.message}
  </Form.Control.Feedback>
  <Form.Text muted>Will be converted to DD-MM-YYYY format</Form.Text>
</Form.Group>
          {/* <Form.Group className="mb-4" controlId="dateofbirth">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              {...register('dateofbirth', { required: 'Date of birth is required' })}
              isInvalid={!!errors.dateofbirth}
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
            />
            <Form.Control.Feedback type="invalid">{errors.dateofbirth?.message}</Form.Control.Feedback>
            <Form.Text muted>Will be converted to DD-MM-YYYY format</Form.Text>
          </Form.Group> */}

          <Form.Group className="mb-4" controlId="files">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Profile Image</Form.Label>
            <Form.Control
              type="file"
              {...register('files')}
              accept="image/*"
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
            />
          </Form.Group>

          <div className="d-grid">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              style={{
                backgroundColor: 'var(--primary)',
                border: 'none',
                padding: '10px',
                borderRadius: '10px',
                fontWeight: 'bold',
              }}
            >
              {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Add User'}
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddUserOffcanvas;

