import React, { useEffect, useState } from 'react';
import { Button, Form, Offcanvas, Table, Spinner, Modal,Breadcrumb  } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { XCircleFill, CheckCircleFill } from 'react-bootstrap-icons';

const API_BASE = 'http://18.209.91.97:5010/api/location';

const Data = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [formData, setFormData] = useState({ location: '' });
  const [dataList, setDataList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getAllLocations`);
      setDataList(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching locations', err);
      toast.error('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleShow = () => {
    setFormData({ location: '' });
    setEditId(null);
    setShowCanvas(true);
  };

  const handleClose = () => {
    setShowCanvas(false);
    setFormData({ location: '' });
    setEditId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`${API_BASE}/changeStatus/${id}`);
      toast.success('Status updated successfully!');
      await fetchLocations();
    } catch (err) {
      console.error('Error toggling status', err);
      toast.error('Failed to update status');
    }
  };

  const handleAddOrUpdate = async () => {
    try {
      if (editId) {
        await axios.put(`${API_BASE}/updateLocation/${editId}`, formData);
        toast.success('Location updated successfully!');
      } else {
        await axios.post(`${API_BASE}/addLocation`, formData);
        toast.success('Location added successfully!');
      }
      await fetchLocations();
      handleClose();
    } catch (err) {
      console.error('Error saving location', err);
      toast.error(err.response?.data?.message || 'Failed to save location');
    }
  };

  const handleEdit = (item) => {
    setFormData({ location: item.location });
    setEditId(item._id);
    setShowCanvas(true);
  };

  const confirmDelete = (item) => {
    setItemToDelete(item._id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/deleteLocation/${itemToDelete}`);
      toast.success('Location deleted successfully!');
      await fetchLocations();
    } catch (err) {
      console.error('Error deleting location', err);
      toast.error('Failed to delete location');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>

       <div className="mb-4">
        <Breadcrumb style={{ 
          backgroundColor: 'var(--light)', 
          padding: '0.75rem 1rem',
          borderRadius: '0.375rem'
        }}>
          <Breadcrumb.Item 
            href="/dashboard" 
            style={{ 
              color: 'var(--secondary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <i className="fas fa-home me-2"></i> Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item 
            active 
            style={{ 
              color: 'var(--primary)',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <i className="fas fa-map-marker-alt me-2"></i> Location Management
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ color: 'var(--secondary)' }}>Location Management</h4>
        <div className="d-flex gap-2">
          <Button onClick={handleShow} style={{ background: 'var(--primary)', border: 'none' }}>
            Add Location
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <Table bordered hover responsive>
          <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
            <tr>
              <th>#</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.location}</td>
                <td>
                  <span className={`badge ${item.status === 'Blocked' ? 'bg-danger' : 'bg-success'}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2 align-items-center">
                    <Button 
                      size="sm" 
                      variant="info" 
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger" 
                      onClick={() => confirmDelete(item)}
                    >
                      Delete
                    </Button>
                    {item.status === 'Active' ? (
                      <XCircleFill
                        className="text-danger"
                        style={{ 
                          cursor: 'pointer', 
                          fontSize: '1.2rem',
                          marginLeft: '10px'
                        }}
                        onClick={() => handleToggleStatus(item._id)}
                        title="Block this location"
                      />
                    ) : (
                      <CheckCircleFill
                        className="text-success"
                        style={{ 
                          cursor: 'pointer', 
                          fontSize: '1.2rem',
                          marginLeft: '10px'
                        }}
                        onClick={() => handleToggleStatus(item._id)}
                        title="Activate this location"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Offcanvas show={showCanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton style={{ background: 'var(--secondary)', color: 'white' }}>
          <Offcanvas.Title>{editId ? 'Edit Location' : 'Add Location'}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ background: 'var(--accent)' }}>
          <div className="p-3 bg-white rounded shadow-sm">
            <Form>
              <Form.Group className="mb-4">
                <Form.Label>Location Name</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Enter location name"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  style={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAddOrUpdate}
                  style={{ 
                    flex: 1,
                    background: 'var(--primary)', 
                    border: 'none' 
                  }}
                >
                  {editId ? 'Update' : 'Save'}
                </Button>
              </div>
            </Form>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this location? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Data;