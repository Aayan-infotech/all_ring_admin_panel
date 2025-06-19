

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Row,
  Col
} from 'react-bootstrap';
import {
  PencilSquare,
  Trash,
  CheckCircleFill,
  XCircleFill
} from 'react-bootstrap-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrisonerList = () => {
  const [prisoners, setPrisoners] = useState([]);
  const [filteredPrisoners, setFilteredPrisoners] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [selectedPrisoner, setSelectedPrisoner] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [locations, setLocations] = useState([]);

  const fetchPrisoners = async () => {
    try {
      const res = await axios.get('http://18.209.91.97:5010/api/prisoner/getPrisoners');
      setPrisoners(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch prisoners");
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://18.209.91.97:5010/api/location/getAllLocations');
      setLocations(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch locations");
    }
  };

  const deletePrisoner = async () => {
    try {
      await axios.delete(`http://18.209.91.97:5010/api/prisoner/deletePrisoner/${confirmDelete.id}`);
      toast.success("Deleted successfully");
      setConfirmDelete({ show: false, id: null });
      fetchPrisoners();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (prisoner) => {
    const newStatus = prisoner.status === 1 ? 2 : 1;
    try {
      await axios.patch(`http://18.209.91.97:5010/api/prisoner/editPrisonerStatus/${prisoner._id}`, {
        status: newStatus
      });
      toast.success(`Status changed`);
      fetchPrisoners();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://18.209.91.97:5010/api/prisoner/updatePrisoner/${selectedPrisoner._id}`,
        selectedPrisoner
      );
      toast.success("Updated successfully");
      setEditModal(false);
      fetchPrisoners();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchPrisoners();
    fetchLocations();
  }, []);

  useEffect(() => {
    let filtered = prisoners;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.prisonerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterLocation) {
      filtered = filtered.filter(p => p.location?._id === filterLocation);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p =>
        filterStatus === 'active' ? p.status === 1 : p.status === 2
      );
    }

    setFilteredPrisoners(filtered);
  }, [searchTerm, filterLocation, filterStatus, prisoners]);

  return (
    <div className="p-4">
      <ToastContainer />
      <h3 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Prisoner Management</h3>
      
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Control
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc._id} value={loc._id}>{loc.location}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>
        </Col>
      </Row>

      <Table bordered hover responsive className="mt-3">
        <thead style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}>
          <tr>
            <th>#</th>
                        <th>Prisoner Id</th>

            <th>Prisoner Name</th>
            <th>Location</th>
            <th>Instructor</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrisoners.map((p, idx) => (
            <tr key={p._id}>
              <td>{idx + 1}</td>
              <td>{p.prisonerId}</td>
              <td>{p.prisonerName}</td>
              <td>{p.location?.location || 'N/A'}</td>
              <td>{p.instructorId?.name || 'N/A'}</td>
              <td>
                <Badge
                  pill
                  bg={p.status === 1 ? 'success' : 'danger'}
                  style={{
                    padding: '8px 12px',
                    fontWeight: '500',
                    backgroundColor:
                      p.status === 1 ? 'var(--success)' : 'var(--danger)',
                  }}
                >
                  {p.status === 1 ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <Button
                  size="sm"
                  style={{ backgroundColor: 'var(--warning)', border: 'none', marginRight: '5px' }}
                  onClick={() => {
                    setSelectedPrisoner(p);
                    setEditModal(true);
                  }}
                >
                  <PencilSquare color="black" />
                </Button>

                <Button
                  size="sm"
                  onClick={() => toggleStatus(p)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '0 5px',
                    color: p.status === 1 ? 'var(--danger)' : 'var(--success)',
                    cursor: 'pointer',
                  }}
                >
                  {p.status === 1 ? <XCircleFill size={20} /> : <CheckCircleFill size={20} />}
                </Button>

                <Button
                  size="sm"
                  style={{ backgroundColor: 'var(--danger)', border: 'none' }}
                  onClick={() => setConfirmDelete({ show: true, id: p._id })}
                >
                  <Trash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={editModal} onHide={() => setEditModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#003865', color: 'white' }}>
          <Modal.Title>Edit Prisoner Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#ffe5e9' }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Prisoner Name</Form.Label>
              <Form.Control
                value={selectedPrisoner?.prisonerName || ''}
                onChange={(e) =>
                  setSelectedPrisoner({ ...selectedPrisoner, prisonerName: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Select
                value={selectedPrisoner?.location?._id || ''}
                onChange={(e) => {
                  const loc = locations.find(l => l._id === e.target.value);
                  setSelectedPrisoner({
                    ...selectedPrisoner,
                    location: loc || { location: '' }
                  });
                }}
              >
                <option value="">Select Location</option>
                {locations.map(loc => (
                  <option key={loc._id} value={loc._id}>
                    {loc.location}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="outline-secondary" onClick={() => setEditModal(false)} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdate}>
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal show={confirmDelete.show} onHide={() => setConfirmDelete({ show: false, id: null })} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this prisoner?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete({ show: false, id: null })}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deletePrisoner}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrisonerList;

