import React, { useEffect, useState } from 'react';
import { Table, Button, ButtonGroup, InputGroup, Form, Spinner, Badge } from 'react-bootstrap';
import { PencilSquare, PlusCircle, XCircleFill, CheckCircleFill, Film, FileEarmarkText, Trash } from 'react-bootstrap-icons';
import axios from 'axios';
import AddClassOffcanvas from './AddClassOffcanvas';
import AddMediaOffcanvas from './AddMediaOffcanvas';
import AddNotesOffcanvas from './AddNotesOffcanvas';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';



const ClassesWorkshops = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);




  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://18.209.91.97:5010/api/AdminClasses/getAllClasses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Assuming the data is inside res.data or res.data.data
      const apiData = Array.isArray(res.data?.data) ? res.data.data : res.data;
      setClasses(apiData || []);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setClasses([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  };





  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`http://18.209.91.97:5010/api/AdminClasses/blockClass/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ Instead of refetching, update state locally
      setClasses(prev =>
        prev.map(cls =>
          cls._id === id
            ? { ...cls, status: cls.status === 'active' ? 'inactive' : 'active' }
            : cls
        )
      );
    } catch (err) {
      console.error('Status toggle failed:', err);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://18.209.91.97:5010/api/AdminClasses/deleteClass/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ Update the state to remove the deleted class
      setClasses(prev => prev.filter(cls => cls._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };


  useEffect(() => {
    fetchClasses();
  }, []);

  const filtered = classes.filter(cls =>
    cls.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)', fontWeight: 600 }}>Classes & Workshops</h2>
        <Button onClick={() => setShowAddForm(true)} style={{ backgroundColor: 'var(--primary)', border: 'none' }}>
          <PlusCircle className="me-2" /> Add New
        </Button>
      </div>

      <InputGroup className="mb-4" style={{ maxWidth: 400 }}>
        <Form.Control placeholder="Search by title..." value={search} onChange={e => setSearch(e.target.value)} />
      </InputGroup>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted fw-bold mt-5">No classes or workshops found.</div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover>
            <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Theme</th>
                <th>Type</th>
                {/* <th>Date</th>
                <th>Time</th> */}
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item._id}>
                  <td>{idx + 1}</td>
                  <td> <img
                    src={item.Image || 'https://via.placeholder.com/40'}
                    alt="img"
                    width="40"
                    height="40"
                    style={{ borderRadius: '4px' }}
                  /></td>
                  <td>{item.title}</td>
                  <td>{item.theme}</td>
                  <td>{item.Type}</td>
                  {/* <td>{item.date}</td>
                  <td>{item.time}</td> */}
                  {/* <td>{item.location}</td> */}
                  <td>{item.location?.location || 'N/A'}</td>

                  <td>
                    <Badge bg={item.status === 'active' ? 'success' : 'danger'}>{item.status}</Badge>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      {/* Toggle Status */}
                      <Button
                        variant={item.status === 'active' ? 'light' : 'light'}
                        className={`icon-btn border-0 ${item.status === 'active' ? 'bg-light border-danger text-danger' : 'bg-light border-success text-success'}`}
                        size="sm"
                        title={item.status === 'active' ? 'Block' : 'Unblock'}
                        onClick={() => toggleStatus(item._id)}
                      >
                        {item.status === 'active' ? <XCircleFill size={16} /> : <CheckCircleFill size={16} />}
                      </Button>
                      <Button
                        variant="light"
                        className="icon-btn border-warning text-warning"
                        size="sm"
                        title="Edit"
                        onClick={() => {
                          setSelectedClass(item);
                          setShowEditModal(true); // <-- open modal
                        }}
                      >
                        <PencilSquare size={16} />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="light"
                        className="icon-btn border-danger text-danger"
                        size="sm"
                        title="Delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash size={16} />
                      </Button>

                      {/* Media */}
                      <Button
                        variant="light"
                        className="icon-btn border-info text-info"
                        size="sm"
                        title="Add Media"
                        onClick={() => {
                          setSelectedClass(item);
                          setShowMediaForm(true);
                        }}
                      >
                        <Film size={16} />
                      </Button>

                      {/* Notes */}
                      <Button
                        variant="light"
                        className="icon-btn border-dark text-dark"
                        size="sm"
                        title="Add Notes"
                        onClick={() => {
                          setSelectedClass(item);
                          setShowNotesForm(true);
                        }}
                      >
                        <FileEarmarkText size={16} />
                      </Button>
                    </div>
                  </td>



                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}




      {/* Offcanvas Modals */}
      <AddClassOffcanvas show={showAddForm} handleClose={() => { setShowAddForm(false); setSelectedClass(null); }} onSaved={fetchClasses} selected={selectedClass} />
      <AddMediaOffcanvas show={showMediaForm} handleClose={() => setShowMediaForm(false)} classId={selectedClass?._id} />
      <AddNotesOffcanvas show={showNotesForm} handleClose={() => setShowNotesForm(false)} classId={selectedClass?._id} />

      {/* ✅ Add Edit Modal HERE */}
      <Modal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setSelectedClass(null);
        }}
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <Modal.Title>Edit Class</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
          {selectedClass ? (
            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const formData = {
                  title: form.title.value,
                  theme: form.theme.value,
                  Type: form.Type.value,
                  location: form.location.value
                };
                try {
                  const token = localStorage.getItem('adminToken');
                  await axios.put(
                    `http://18.209.91.97:5010/api/AdminClasses/updateClass/${selectedClass._id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  toast.success('Class updated successfully!');
                  setShowEditModal(false);
                  fetchClasses();
                } catch (err) {
                  console.error(err);
                  // toast.error('Failed to update class');
                }
              }}
            >
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" defaultValue={selectedClass.title} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Theme</Form.Label>
                <Form.Control name="theme" defaultValue={selectedClass.theme} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select name="Type" defaultValue={selectedClass.Type} required>
                  <option value="">-- Select Type --</option>
                  <option value="Regular Class">Regular Class</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Special Event">Special Event</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control name="location" defaultValue={selectedClass.location} required />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={() => setShowEditModal(false)} className="me-2">Cancel</Button>
                <Button type="submit" variant="primary">Save Changes</Button>
              </div>
            </Form>
          ) : (
            <div className="text-center">Loading...</div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClassesWorkshops;

