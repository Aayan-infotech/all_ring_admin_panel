
import React, { useState } from 'react';
import { Offcanvas, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const AddUserOffcanvas = ({ show, handleClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: ''
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
      await axios.post('http://18.209.91.97:5010/api/admin/addUser', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      onUserAdded();
      handleClose();
    } catch (err) {
      alert('Error adding user: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
        <Offcanvas.Title>Add New User</Offcanvas.Title>
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

          <Form.Group className="mb-4" controlId="location">
            <Form.Label style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
              placeholder="Enter city or location"
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
              {loading ? <Spinner animation="border" size="sm" /> : 'Add User'}
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddUserOffcanvas;
