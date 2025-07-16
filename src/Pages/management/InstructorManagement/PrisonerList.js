

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Row,
  Col,
  Breadcrumb,
  OverlayTrigger,
  Tooltip,
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
      const res = await axios.get('http://52.20.55.193:5010/api/prisoner/getPrisoners');
      setPrisoners(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch prisoners");
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://52.20.55.193:5010/api/location/getAllLocations');
      const activeLocations = (response.data?.data || []).filter(loc => loc.status === 'Active');
      setLocations(activeLocations);
    } catch (err) {
      toast.error("Failed to fetch locations");
    }
  };

  const deletePrisoner = async () => {
    try {
      await axios.delete(`http://52.20.55.193:5010/api/prisoner/deletePrisoner/${confirmDelete.id}`);
      toast.success("Deleted successfully");
      setConfirmDelete({ show: false, id: null });
      fetchPrisoners();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (prisoner) => {
    const newStatus = prisoner.status === 'Active' ? 'Blocked' : 'Active';
    try {
      await axios.patch(`http://52.20.55.193:5010/api/prisoner/changePrisonerStatus/${prisoner._id}`, {
        status: newStatus
      });

      setPrisoners(prev =>
        prev.map(p =>
          p._id === prisoner._id ? { ...p, status: newStatus } : p
        )
      );

      toast.success(`Status changed to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://52.20.55.193:5010/api/prisoner/updatePrisoner/${selectedPrisoner._id}`,
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
        filterStatus === 'active' ? p.status === 'Active' : p.status === 'Blocked'
      );
    }

    setFilteredPrisoners(filtered);
  }, [searchTerm, filterLocation, filterStatus, prisoners]);

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="mb-3">
        <Breadcrumb style={{
          backgroundColor: 'var(--light)',
          padding: '0.75rem 1rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem'
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
            <i className="fas fa-chalkboard-teacher me-2"></i> Prisoner Management
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

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
    <tr key={p._id} style={{ verticalAlign: 'middle' }}>
      <td>{idx + 1}</td>
      <td>{p.prisonerId}</td>
      <td>{p.prisonerName}</td>
      <td>{p.location?.location || 'N/A'}</td>
      <td>{p.instructorId?.name || 'N/A'}</td>
      <td>
        <Badge
          pill
          bg={p.status === 'Active' ? 'success' : 'danger'}
          style={{
            padding: '8px 12px',
            fontWeight: '500',
            textTransform: 'capitalize',
            fontSize: '0.85rem'
          }}
        >
          {p.status}
        </Badge>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Button size="sm" style={{ height: '32px', width: '32px', backgroundColor: 'var(--warning)', border: 'none' }}
              onClick={() => {
                setSelectedPrisoner(p);
                setEditModal(true);
              }}
            >
              <PencilSquare color="black" size={16} />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{p.status === 'Active' ? 'Deactivate' : 'Activate'}</Tooltip>}
          >
            <Button
              size="sm"
              onClick={() => toggleStatus(p)}
              style={{
                height: '32px',
                width: '32px',
                backgroundColor: 'transparent',
                border: 'none',
                padding: 0,
                color: p.status === 'Active' ? 'var(--danger)' : 'var(--success)',
              }}
            >
              {p.status === 'Active' ? <XCircleFill size={20} /> : <CheckCircleFill size={20} />}
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button
              size="sm"
              style={{ height: '32px', width: '32px', backgroundColor: 'var(--danger)', border: 'none' }}
              onClick={() => setConfirmDelete({ show: true, id: p._id })}
            >
              <Trash size={16} />
            </Button>
          </OverlayTrigger>
        </div>
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
