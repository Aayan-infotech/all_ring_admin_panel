import React, { useState } from 'react';
import { Offcanvas, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const AddInstructorOffcanvas = ({ show, handleClose, onInstructorAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      await axios.post('http://18.209.91.97:5010/api/admin/addInstructor', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      onInstructorAdded();
      handleClose();
    } catch (err) {
      alert('Error adding instructor: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
        <Offcanvas.Title>Add New Instructor</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ backgroundColor: 'var(--accent)' }}>
        <Form onSubmit={handleSubmit} className="p-3 rounded shadow-sm" style={{ backgroundColor: '#fff' }}>
          <Form.Group className="mb-4" controlId="name">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
              placeholder="Enter full name"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="email">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
              placeholder="Enter email address"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="subject">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Subject</Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
              placeholder="Enter subject (e.g., Maths, English)"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="phone">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
              placeholder="Enter phone number"
            />
          </Form.Group>

          <div className="d-grid">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              style={{
                backgroundColor: 'var(--primary)',
                border: 'none',
                padding: '10px',
                borderRadius: '10px',
                fontWeight: 'bold'
              }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Add Instructor'}
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddInstructorOffcanvas;
