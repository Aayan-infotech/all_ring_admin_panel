import React, { useState } from 'react';
import { Offcanvas, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const AddMentorOffcanvas = ({ show, handleClose, onMentorAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    expertise: '',
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
      await axios.post('http://18.209.91.97:5010/api/admin/addMentor', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      onMentorAdded();
      handleClose();
    } catch (err) {
      alert('Error adding mentor: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
        <Offcanvas.Title>Add New Mentor</Offcanvas.Title>
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

          <Form.Group className="mb-4" controlId="expertise">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Expertise</Form.Label>
            <Form.Control
              type="text"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              required
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
              placeholder="Enter domain expertise (e.g., Data Science)"
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
              {loading ? <Spinner animation="border" size="sm" /> : 'Add Mentor'}
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddMentorOffcanvas;
