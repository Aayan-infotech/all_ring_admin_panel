


import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Badge,
  Spinner,
  Modal,
  Form,
  Row,
  Col,
  Pagination
} from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons'; 
import axios from 'axios';
import AddMediaOffcanvas from './AddMediaOffcanvas';
import { toast } from 'react-toastify';
import API_BASE_URL from '../../../config/api';

const ClassMediaPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [classMedia, setClassMedia] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
const [expandedRows, setExpandedRows] = useState([]);

  // Pagination and filtering state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: ''
  });



  const toggleRow = (id) => {
  if (expandedRows.includes(id)) {
    setExpandedRows(expandedRows.filter(rowId => rowId !== id));
  } else {
    setExpandedRows([...expandedRows, id]);
  }
};

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        type: filters.type,
        status: filters.status
      };

      const res = await axios.get(`${API_BASE_URL}/api/AdminClasses/getAllClasses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params
      });
      
      setClasses(res.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: res.data.total,
        page: res.data.page,
        limit: res.data.limit
      }));
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
      const res = await axios.get(`${API_BASE_URL}/api/mediaAdmin/getAllMedia/${classId}`, {
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
      await axios.delete(`${API_BASE_URL}/api/mediaAdmin/deleteMedia/${classId}/${mediaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setClassMedia(prev => prev.filter(media => media._id !== mediaId));
      
      setClasses(prev => prev.map(cls => {
        if (cls._id === classId) {
          return {
            ...cls,
            mediaCount: Math.max(0, (cls.mediaCount || 0) - 1)
          };
        }
        return cls;
      }));
      
      toast.success("Media deleted successfully");
    } catch (error) {
      toast.error("Failed to delete media");
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    fetchClasses();
  }, [pagination.page, filters, refreshTrigger]);

  // Get unique class types for filter dropdown
  const classTypes = [...new Set(classes.map(cls => cls.Type))].filter(Boolean);

  return (
    <div className="p-3" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h4 style={{ color: 'var(--secondary)' }}>Class Media Management</h4>

      <Row className="mb-4 g-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search by title"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          />
        </Col>

        <Col md={4}>
          <Form.Select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
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
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            style={{ border: '2px solid var(--accent)', borderRadius: '8px' }}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
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
              {classes.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">No Classes Found</td>
                </tr>
              ) : (
                classes.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                    {/* <td>{item.title}</td>
                    <td>{item.theme || 'N/A'}</td> */}
                    <td>
  {item.title.length > 30 ? (
    <>
      {expandedRows.includes(item._id + '_title') ? item.title : item.title.slice(0, 30) + '...'}
      <span
        style={{ color: 'var(--primary)', cursor: 'pointer', marginLeft: '5px' }}
        onClick={() => toggleRow(item._id + '_title')}
      >
        {expandedRows.includes(item._id + '_title') ? 'See less' : 'See more'}
      </span>
    </>
  ) : (
    item.title
  )}
</td>

<td>
  {item.theme && item.theme.length > 30 ? (
    <>
      {expandedRows.includes(item._id + '_theme') ? item.theme : item.theme.slice(0, 30) + '...'}
      <span
        style={{ color: 'var(--primary)', cursor: 'pointer', marginLeft: '5px' }}
        onClick={() => toggleRow(item._id + '_theme')}
      >
        {expandedRows.includes(item._id + '_theme') ? 'See less' : 'See more'}
      </span>
    </>
  ) : (
    item.theme || 'N/A'
  )}
</td>

                    <td>{item.Type || 'N/A'}</td>
                    <td>{item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{item.sessions?.[0]?.startTime || 'N/A'} - {item.sessions?.[0]?.endTime || 'N/A'}</td>
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

          {pagination.total > pagination.limit && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                <Pagination.Prev 
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                />
                
                {[...Array(Math.ceil(pagination.total / pagination.limit)).keys()].map(num => (
                  <Pagination.Item
                    key={num + 1}
                    active={num + 1 === pagination.page}
                    onClick={() => handlePageChange(num + 1)}
                  >
                    {num + 1}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next 
                  disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                  onClick={() => handlePageChange(pagination.page + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      <AddMediaOffcanvas
        show={showMediaForm}
        handleClose={() => setShowMediaForm(false)}
        classId={selectedClassId}
        onSuccess={() => {
          setRefreshTrigger(prev => !prev); 
          if (showMediaModal) {
            fetchClassMedia(selectedClassId); 
          }
        }}
      />

      <Modal show={showMediaModal} onHide={() => setShowMediaModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <Modal.Title>Class Media Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mediaLoading ? (
            <div className="text-center py-4">
              <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                <span className="ms-3">Loading media details...</span>
              </div>
            </div>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {classMedia.length === 0 ? (
                <div className="text-center py-4" style={{ color: 'var(--text-primary)' }}>
                  <i className="bi bi-folder-x" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
                  <p className="mt-2">No media found for this class</p>
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
                            <a 
                              href={media.uploadVideo} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ color: 'var(--primary)', textDecoration: 'none' }}
                              className="d-flex align-items-center"
                            >
                              <i className="bi bi-play-circle-fill me-2"></i> 
                              Watch Video
                            </a>
                          ) : (
                            <span className="text-muted">No video</span>
                          )}
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
                            <i className="bi bi-trash"></i> Delete
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