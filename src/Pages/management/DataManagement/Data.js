import React, { useEffect, useState } from 'react';
import { Button, Form, Offcanvas, Table, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = 'http://18.209.91.97:5010/api/location';

const Data = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [formData, setFormData] = useState({ location: '' });
  const [dataList, setDataList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getAllLocations`);
      setDataList(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching locations', err);
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


//   const handleToggleStatus = async (id) => {
//   try {
//     await axios.patch(`${API_BASE}/changeStatus/${id}`);
//     await fetchLocations();
//   } catch (err) {
//     console.error('Error toggling status', err);
//   }
// };

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
      } else {
        await axios.post(`${API_BASE}/addLocation`, formData);
      }
      await fetchLocations();
      handleClose();
    } catch (err) {
      console.error('Error saving location', err);
    }
  };

  const handleEdit = (item) => {
    setFormData({ location: item.location });
    setEditId(item._id);
    setShowCanvas(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/deleteLocation/${id}`);
      await fetchLocations();
    } catch (err) {
      console.error('Error deleting location', err);
    }
  };

  return (
    <div className="p-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ color: 'var(--secondary)' }}>Location Management</h4>
        <div className="d-flex gap-2">
          {/* <Form.Control type="text" placeholder="Search by location..." /> */}
          <Button onClick={handleShow} style={{ background: 'var(--primary)', border: 'none' }}>
            Add
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <Table bordered hover responsive>
          <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
  <tr>
    <th>#</th>
    <th>Location</th>
    <th>Status</th>
    <th>Action</th>
  </tr>
</thead>

          {/* <tbody>
            {dataList.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.location}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="info" onClick={() => handleEdit(item)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody> */}
          <tbody>
  {dataList.map((item, index) => (
    <tr key={item._id}>
      <td>{index + 1}</td>
      <td>{item.location}</td>
      <td>
        <span
          className={`badge ${item.status === 'Blocked' ? 'bg-danger' : 'bg-success'}`}
          style={{ cursor: 'pointer' }}
          onClick={() => handleToggleStatus(item._id)}
        >
          {item.status === 'Blocked' ? 'Blocked' : 'Active'}
        </span>
      </td>
      <td>
        <div className="d-flex gap-2">
          <Button size="sm" variant="info" onClick={() => handleEdit(item)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

        </Table>
      )}

      {/* Offcanvas Form */}
      <Offcanvas show={showCanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton style={{ background: 'var(--secondary)', color: 'white' }}>
          <Offcanvas.Title>{editId ? 'Edit Location' : 'Add Location'}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ background: 'var(--accent)' }}>
          <div className="p-3 bg-white rounded shadow-sm">
            <Form>
              <Form.Group className="mb-4">
                <Form.Label style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  Location
                </Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button
                type="button"
                onClick={handleAddOrUpdate}
                className="w-100"
                style={{ background: 'var(--primary)', border: 'none' }}
              >
                {editId ? 'Update' : 'Add'}
              </Button>
            </Form>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Data;


