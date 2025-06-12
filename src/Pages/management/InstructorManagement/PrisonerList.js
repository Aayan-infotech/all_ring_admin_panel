
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const PrisonerList = () => {
  const [prisoners, setPrisoners] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [selectedPrisoner, setSelectedPrisoner] = useState(null);

  const fetchPrisoners = async () => {
    try {
      const res = await axios.get('http://18.209.91.97:5010/api/prisoner/getPrisoners');
      setPrisoners(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch prisoners");
    }
  };

  const deletePrisoner = async (id) => {
    try {
      await axios.delete(`http://18.209.91.97:5010/api/prisoner/deletePrisoner/${id}`);
      toast.success("Deleted successfully");
      fetchPrisoners();
    } catch (err) {
      toast.error("Delete failed");
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
  }, []);

  // Extract unique locations from prisoners data
  const uniqueLocations = Array.from(
    new Map(
      prisoners
        .filter(p => p.location && p.location._id)
        .map(p => [p.location._id, p.location])
    ).values()
  );

  return (
    <div className="p-4">
      <ToastContainer />
      <h3 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Prisoner Management</h3>

      <Table bordered hover responsive className="mt-3">
        <thead style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}>
          <tr>
            <th>#</th>
            <th>Prisoner Name</th>
            <th>Location</th>
            <th>Instructor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {prisoners.map((p, idx) => (
            <tr key={p._id}>
              <td>{idx + 1}</td>
              <td>{p.prisonerName}</td>
              <td>{p.location?.location || 'N/A'}</td>
              <td>{p.instructorId?.name || 'N/A'}</td>
              <td>
                <Button
                  size="sm"
                  style={{
                    backgroundColor: 'var(--warning)',
                    border: 'none',
                    marginRight: '5px',
                  }}
                  onClick={() => {
                    setSelectedPrisoner(p);
                    setEditModal(true);
                  }}
                >
                  <PencilSquare color="black" />
                </Button>
                <Button
                  size="sm"
                  style={{
                    backgroundColor: 'var(--danger)',
                    border: 'none',
                  }}
                  onClick={() => deletePrisoner(p._id)}
                >
                  <Trash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={editModal} onHide={() => setEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Prisoner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                  const loc = uniqueLocations.find(l => l._id === e.target.value);
                  setSelectedPrisoner({
                    ...selectedPrisoner,
                    location: loc || { location: '' }
                  });
                }}
              >
                <option value="">Select Location</option>
                {uniqueLocations.map(loc => (
                  <option key={loc._id} value={loc._id}>
                    {loc.location}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="outline-secondary"
                onClick={() => setEditModal(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdate}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PrisonerList;
