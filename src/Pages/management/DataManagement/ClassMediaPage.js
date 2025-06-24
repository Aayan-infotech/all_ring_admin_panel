
import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  ButtonGroup,
  Badge,
  Spinner,
  Modal,
  Form,
  Row,
  Col
} from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons'; // Removed PencilSquare import
import axios from 'axios';
import AddMediaOffcanvas from './AddMediaOffcanvas';
import { toast } from 'react-toastify';

const ClassMediaPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [classMedia, setClassMedia] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://18.209.91.97:5010/api/AdminClasses/getAllClasses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClasses(res.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch class data');
    } finally {
      setLoading(false);
    }
  };

  const fetchClassMedia = async (classId) => {
    setMediaLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`http://18.209.91.97:5010/api/mediaAdmin/getAllMedia/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClassMedia(res.data.data || []);
      setShowMediaModal(true);
    } catch (error) {
      toast.error('Failed to fetch media data');
    } finally {
      setMediaLoading(false);
    }
  };

  const handleAddMedia = (classId) => {
    setSelectedClassId(classId);
    setShowMediaForm(true);
  };

  const handleMediaCountClick = (classId) => {
    setSelectedClassId(classId);
    fetchClassMedia(classId);
  };

  const handleDeleteMedia = async (classId, mediaId) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://18.209.91.97:5010/api/mediaAdmin/deleteMedia/${classId}/${mediaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Media deleted successfully");
      fetchClassMedia(classId);
    } catch (error) {
      toast.error("Failed to delete media");
    }
  };

  // Filter classes based on search and filter criteria
  const filteredClasses = classes.filter(cls => {
    const matchesTitle = cls.title?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType ? cls.Type?.toLowerCase() === filterType.toLowerCase() : true;
    const matchesStatus = filterStatus ? cls.status?.toLowerCase() === filterStatus.toLowerCase() : true;
    return matchesTitle && matchesType && matchesStatus;
  });

  // Get unique class types for filter dropdown
  const classTypes = [...new Set(classes.map(cls => cls.Type))].filter(Boolean);

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="p-3" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h4 style={{ color: 'var(--secondary)' }}>Class Media Management</h4>

      {/* Filter Controls */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          />
        </Col>

        <Col md={4}>
          <Form.Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          >
            <option value="">All Types</option>
            {classTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover className="management-table mt-3">
          <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
            <tr>
              <th>Sr No</th>
              <th>Title</th>
              <th>Theme</th>
              <th>Type</th>
              <th>Date</th>
              <th>Start-End</th>
              <th>Media Count</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">No Classes Found</td>
              </tr>
            ) : (
              filteredClasses.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.theme || 'N/A'}</td>
                  <td>{item.Type || 'N/A'}</td>
                  <td>{item.Date ? new Date(item.Date).toLocaleDateString() : 'N/A'}</td>
                  <td>{item.startTime || 'N/A'} - {item.endTime || 'N/A'}</td>
                  <td>
                    <Badge 
                      bg="info" 
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleMediaCountClick(item._id)}
                    >
                      {item.mediaCount || 0}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      bg={item.status === 'Active' ? 'success' : 'danger'}
                      style={{
                        padding: '8px 12px',
                        fontWeight: '500',
                        backgroundColor:
                          item.status === 'Active' ? 'var(--success)' : 'var(--danger)',
                      }}
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => handleAddMedia(item._id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: '0 5px',
                        color: '#28a745',
                      }}
                    >
                      <PlusCircle size={20} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <AddMediaOffcanvas
        show={showMediaForm}
        handleClose={() => setShowMediaForm(false)}
        classId={selectedClassId}
      />

      {/* Media Details Modal */}
      <Modal show={showMediaModal} onHide={() => setShowMediaModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <Modal.Title>Class Media Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mediaLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {classMedia.length === 0 ? (
                <div className="text-center py-4" style={{ color: 'var(--text-primary)' }}>
                  No media found for this class
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead style={{ backgroundColor: 'var(--accent)' }}>
                    <tr>
                      <th style={{ color: 'var(--secondary)' }}>#</th>
                      <th style={{ color: 'var(--secondary)' }}>Title</th>
                      <th style={{ color: 'var(--secondary)' }}>Description</th>
                      <th style={{ color: 'var(--secondary)' }}>Video</th>
                      <th style={{ color: 'var(--secondary)' }}>Status</th>
                      <th style={{ color: 'var(--secondary)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classMedia.map((media, index) => (
                      <tr key={media._id}>
                        <td>{index + 1}</td>
                        <td>{media.title}</td>
                        <td>{media.Description || 'N/A'}</td>
                        <td>
                          {media.uploadVideo ? (
                            <a href={media.uploadVideo} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                              <i className="bi bi-play-circle-fill" style={{ marginRight: '5px' }}></i> Watch Video
                            </a>
                          ) : 'No video'}
                        </td>
                        <td>
                          <Badge 
                            pill
                            style={{ 
                              backgroundColor: media.status === 'active' ? 'var(--success)' : 'var(--danger)',
                              padding: '6px 12px',
                              fontSize: '13px'
                            }}
                          >
                            {media.status}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteMedia(selectedClassId, media._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'var(--accent)' }}>
          <Button
            variant="primary"
            onClick={() => setShowMediaModal(false)}
            style={{
              padding: '8px 25px',
              backgroundColor: 'var(--primary)',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClassMediaPage;