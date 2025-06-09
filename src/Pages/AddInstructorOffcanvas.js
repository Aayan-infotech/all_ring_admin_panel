// import React, { useState } from 'react';
// import { Offcanvas, Form, Button, Spinner } from 'react-bootstrap';
// import axios from 'axios';

// const AddInstructorOffcanvas = ({ show, handleClose, onInstructorAdded }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     phone: ''
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const token = localStorage.getItem('adminToken');
//     try {
//       await axios.post('http://18.209.91.97:5010/api/admin/addInstructor', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       });
//       onInstructorAdded();
//       handleClose();
//     } catch (err) {
//       alert('Error adding instructor: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Offcanvas show={show} onHide={handleClose} placement="end">
//       <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
//         <Offcanvas.Title>Add New Instructor</Offcanvas.Title>
//       </Offcanvas.Header>
//       <Offcanvas.Body style={{ backgroundColor: 'var(--accent)' }}>
//         <Form onSubmit={handleSubmit} className="p-3 rounded shadow-sm" style={{ backgroundColor: '#fff' }}>
//           <Form.Group className="mb-4" controlId="name">
//             <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Name</Form.Label>
//             <Form.Control
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
//               placeholder="Enter full name"
//             />
//           </Form.Group>

//           <Form.Group className="mb-4" controlId="email">
//             <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Email</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
//               placeholder="Enter email address"
//             />
//           </Form.Group>

//           <Form.Group className="mb-4" controlId="subject">
//             <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Subject</Form.Label>
//             <Form.Control
//               type="text"
//               name="subject"
//               value={formData.subject}
//               onChange={handleChange}
//               required
//               style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
//               placeholder="Enter subject (e.g., Maths, English)"
//             />
//           </Form.Group>

//           <Form.Group className="mb-4" controlId="phone">
//             <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Phone</Form.Label>
//             <Form.Control
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
//               placeholder="Enter phone number"
//             />
//           </Form.Group>

//           <div className="d-grid">
//             <Button
//               type="submit"
//               variant="primary"
//               disabled={loading}
//               style={{
//                 backgroundColor: 'var(--primary)',
//                 border: 'none',
//                 padding: '10px',
//                 borderRadius: '10px',
//                 fontWeight: 'bold'
//               }}
//             >
//               {loading ? <Spinner animation="border" size="sm" /> : 'Add Instructor'}
//             </Button>
//           </div>
//         </Form>
//       </Offcanvas.Body>
//     </Offcanvas>
//   );
// };

// export default AddInstructorOffcanvas;
import React from 'react';
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
      await axios.post('http://18.209.91.97:5010/api/auth/register/instructor', formData, {
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

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              {...register('location', { required: 'Location is required' })}
              placeholder="Enter location"
            />
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
