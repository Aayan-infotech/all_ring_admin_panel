

import React from 'react';
import { Offcanvas, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AddUserOffcanvas = ({ show, handleClose, onUserAdded }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: 'user',
      name: '',
      email: '',
      location: '',
      expertise: '',
      qualification: '',
      number: '',
      password: '',
      confirmPassword: '',
      dateofbirth: '',
     
      files: null,
    },
  });

  const selectedRole = watch('role');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };



  const onSubmit = async (data) => {
  const token = localStorage.getItem('adminToken');
  const formData = new FormData();

  // Append common field(s)
  formData.append('name', data.name);
  if (data.location) formData.append('location', data.location);

  // Role-specific appending
  if (selectedRole === 'user') {
    formData.append('number', data.number);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('dateofbirth', formatDate(data.dateofbirth));
    if (data.files?.[0]) formData.append('files', data.files[0]);
  } else if (selectedRole === 'mentor') {
    formData.append('number', data.number);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('dateofbirth', formatDate(data.dateofbirth));
    formData.append('expertise', data.expertise);
    if (data.files?.[0]) formData.append('files', data.files[0]);
  } else if (selectedRole === 'instructor') {
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
      formData.append('prisonerid', '123456789');

    if (data.files?.[0]) formData.append('files', data.files[0]);
  } else if (selectedRole === 'prisoner') {
    // const prisonerId = (data.prisonerid || '').replace(/[^a-zA-Z]/g, '').substring(0, 50);
 
  formData.append('name', data.name);
  formData.append('prisonerid', data.prisonerid);
  formData.append('location', data.location);

  }

  try {
    await axios.post(
      `http://18.209.91.97:5010/api/auth/register/${selectedRole}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    onUserAdded();
    handleClose();
    reset();
  } catch (err) {
    alert('Error adding user: ' + (err.response?.data?.message || err.message));
  }
};

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
        <Offcanvas.Title>Add New User</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ backgroundColor: 'var(--accent)' }}>
        <Form onSubmit={handleSubmit(onSubmit)} className="p-3 rounded shadow-sm" style={{ backgroundColor: '#fff' }}>
          {/* Role Select - Fixed typo in 'prisoner' */}
          <Form.Group className="mb-4" controlId="role">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Role</Form.Label>
            <Form.Select
              {...register('role')}
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
            >
              <option value="user">User</option>
              <option value="mentor">Mentor</option>
              <option value="instructor">Instructor</option>
              <option value="prisoner">Prisoner</option>
            </Form.Select>
          </Form.Group>

          {/* Common Fields */}
          <Form.Group className="mb-4" controlId="name">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Name</Form.Label>
            <Form.Control
              type="text"
              {...register('name', { required: 'Name is required' })}
              isInvalid={!!errors.name}
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
              placeholder="Enter full name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Fields that appear for multiple roles */}
          {(selectedRole === 'user' || selectedRole === 'mentor' || selectedRole === 'instructor') && (
            <>
              <Form.Group className="mb-4" controlId="email">
                <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  isInvalid={!!errors.email}
                  style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
                  placeholder="Enter email address"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="location">
                <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Location</Form.Label>
                <Form.Control
                  type="text"
                  {...register('location', { required: 'Location is required' })}
                  isInvalid={!!errors.location}
                  style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
                  placeholder="Enter city or location"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.location?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}

          {/* User/Mentor specific fields */}
          {(selectedRole === 'user' || selectedRole === 'mentor') && (
            <>
              <Form.Group className="mb-4" controlId="number">
                <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  {...register('number', { required: 'Phone number is required' })}
                  isInvalid={!!errors.number}
                  style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
                  placeholder="Enter phone number"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.number?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  isInvalid={!!errors.password}
                  style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
                  placeholder="Enter password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => 
                      value === watch('password') || 'Passwords do not match'
                  })}
                  isInvalid={!!errors.confirmPassword}
                  style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
                  placeholder="Confirm password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="dateofbirth">
                <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  {...register('dateofbirth', { required: 'Date of birth is required' })}
                  isInvalid={!!errors.dateofbirth}
                  style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dateofbirth?.message}
                </Form.Control.Feedback>
                <Form.Text muted>
                  Will be converted to DD-MM-YYYY format
                </Form.Text>
              </Form.Group>
            </>
          )}

          {/* Mentor specific fields */}
          {selectedRole === 'mentor' && (
            <Form.Group className="mb-4" controlId="expertise">
              <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Expertise</Form.Label>
              <Form.Control
                type="text"
                {...register('expertise', { required: 'Expertise is required' })}
                isInvalid={!!errors.expertise}
                style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
                placeholder="Enter mentor expertise"
              />
              <Form.Control.Feedback type="invalid">
                {errors.expertise?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          {/* Instructor specific fields */}
          {selectedRole === 'instructor' && (
            <>
              <Form.Group className="mb-4" controlId="password">
                <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  isInvalid={!!errors.password}
                  style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
                  placeholder="Enter password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => 
                      value === watch('password') || 'Passwords do not match'
                  })}
                  isInvalid={!!errors.confirmPassword}
                  style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
                  placeholder="Confirm password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="qualification">
                <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Qualification</Form.Label>
                <Form.Control
                  type="text"
                  {...register('qualification', { required: 'Qualification is required' })}
                  isInvalid={!!errors.qualification}
                  style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
                  placeholder="Enter instructor qualification"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.qualification?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}

          {/* Prisoner specific fields */}
          {selectedRole === 'prisoner' && (
            <Form.Group className="mb-4" controlId="prisonerid">
              <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Prisoner ID</Form.Label>
              {/* <Form.Control
                type="text"
                {...register('prisonerid', { 
                  required: 'Prisoner ID is required',
                  // pattern: {
                  //   value: /^[a-zA-Z]+$/,
                  //   message: 'Prisoner ID must contain only alphabets'
                  // },
                  // maxLength: {
                  //   value: 50,
                  //   message: 'Prisoner ID must be max 50 characters'
                  // }
                })}
                isInvalid={!!errors.prisonerid}
                style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
                placeholder="Enter prisoner ID (letters only)"
              /> */}
              <Form.Control
  type="text"
  {...register('prisonerid', { 
    required: 'Prisoner ID is required',
  })}
  isInvalid={!!errors.prisonerid}
  style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
  placeholder="Enter prisoner ID"
/>

              <Form.Control.Feedback type="invalid">
                {errors.prisonerid?.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          {/* File upload for roles that need it */}
          {(selectedRole === 'user' || selectedRole === 'mentor' || selectedRole === 'instructor') && (
            <Form.Group className="mb-4" controlId="files">
              <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>
                {selectedRole === 'instructor' ? 'Profile Image' : 'Image'}
              </Form.Label>
              <Form.Control
                type="file"
                {...register('files', { 
                  required: selectedRole === 'instructor' ? 'Profile image is required' : false
                })}
                accept="image/*"
                isInvalid={!!errors.files}
                style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
              />
              {errors.files && (
                <Form.Control.Feedback type="invalid">
                  {errors.files.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}

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
                fontWeight: 'bold'
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