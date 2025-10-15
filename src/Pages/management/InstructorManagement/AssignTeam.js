import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, Button, Badge, Modal, Form, InputGroup, Spinner, Row, Col, Pagination
} from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from '../../../config/api';

const AssignTeam = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  
  // Pagination and filtering states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    filterLocation: ''
  });
  const [allLocations, setAllLocations] = useState([]);

  const getLocationString = (location) => {
    if (!location) return '-';
    return typeof location === 'object' ? location.location : location;
  };

  // Fetch all locations from the dedicated API
  const fetchAllLocations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/api/location/getAllLocations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllLocations(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      toast.error('Failed to load locations');
    }
  };

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      let url = `${API_BASE_URL}/api/admin/getRegister/instructor?page=${currentPage}&limit=${limit}`;
      
      // Add filters to URL if they exist
      if (filters.search) url += `&search=${filters.search}`;
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.filterLocation) url += `&filterLocation=${filters.filterLocation}`;
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const allUsers = (res.data.users || []).map(user => ({
        ...user,
        status: user.user_status === 1 ? 'active' : 'inactive'
      }));
      
      setInstructors(allUsers);
      setTotalItems(res.data.total || 0);
      setTotalPages(Math.ceil(res.data.total / limit) || 1);
      
    } catch (err) {
      console.error('Failed to fetch instructors:', err);
      toast.error('Failed to fetch instructors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLocations();
    fetchInstructors();
  }, []);

  useEffect(() => {
    fetchInstructors();
  }, [currentPage, limit, filters]);
const handleFilterChange = (e) => {
  const { name, value } = e.target;

  let processedValue = value;

  // Only clean up spaces for search input
  if (name === 'search') {
    // Remove leading/trailing spaces and replace multiple spaces with a single space
    processedValue = value.trim().replace(/\s+/g, ' ');
  }

  setFilters((prev) => ({
    ...prev,
    [name]: processedValue
  }));

  setCurrentPage(1); // Reset to first page when filters change
};

  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilters(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  //   setCurrentPage(1);
  // };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAssignClick = async (instructorId) => {
    setSelectedInstructorId(instructorId);
    try {
      setAssignLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${API_BASE_URL}/api/assignUsers/getUsersByLocation/${instructorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const users = response.data.users || [];
      setAvailableUsers(users);

      // Pre-select users that are already assigned
      const preSelected = users
        .filter(user => user.status === 'Assigned')
        .map(user => user._id);
      setSelectedUsers(preSelected);

      setShowAssignModal(true);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const assignUsersToInstructor = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    try {
      setAssignLoading(true);
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${API_BASE_URL}/api/assignUsers/assignToInstructor/${selectedInstructorId}`,
        { userIds: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Users assigned successfully');
      setShowAssignModal(false);
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error assigning users:', error);
      toast.error('Failed to assign users');
    } finally {
      setAssignLoading(false);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = currentPage - half;
      let end = currentPage + half;
      
      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      }
      
      if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisiblePages + 1;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="mb-3">
        <h3>Assign Team</h3>
       
      </div>

      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              placeholder="Search by name..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Filter by Status</option>
            <option value="1">Active</option>
            <option value="2">Inactive</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select
            name="filterLocation"
            value={filters.filterLocation}
            onChange={handleFilterChange}
          >
            <option value="">Filter by Location</option>
            {allLocations
              .filter(loc => loc.status === 'Active')
              .map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.location}
                </option>
              ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((instructor, index) => (
                  <tr key={instructor._id}>
                    <td>{(currentPage - 1) * limit + index + 1}</td>
                    <td>{instructor.name}</td>
                    <td>{instructor.email}</td>
                    <td>{getLocationString(instructor.location)}</td>
                    <td>
                      <Badge bg={instructor.user_status === 1 ? 'success' : 'danger'}>
                        {instructor.user_status === 1 ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleAssignClick(instructor._id)}
                      >
                        Assign Users
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

      {totalPages > 1 && (
  <div className="d-flex justify-content-between align-items-center mt-3">
    <div className="text-muted small">
      Showing {(currentPage - 1) * limit + 1} to{' '}
      {Math.min(currentPage * limit, totalItems)} of {totalItems} instructors
    </div>
    
    <Pagination className="mb-0">
      <Pagination.First 
        onClick={() => handlePageChange(1)} 
        disabled={currentPage === 1}
      />
      <Pagination.Prev 
        onClick={() => handlePageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      />
      
      {/* Always show first page if not in current range */}
      {currentPage > 3 && (
        <>
          <Pagination.Item onClick={() => handlePageChange(1)}>
            1
          </Pagination.Item>
          {currentPage > 4 && <Pagination.Ellipsis disabled />}
        </>
      )}
      
      {/* Show pages around current page */}
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        let pageNum;
        if (totalPages <= 5) {
          pageNum = i + 1;
        } else if (currentPage <= 3) {
          pageNum = i + 1;
        } else if (currentPage >= totalPages - 2) {
          pageNum = totalPages - 4 + i;
        } else {
          pageNum = currentPage - 2 + i;
        }
        
        return (
          <Pagination.Item
            key={pageNum}
            active={pageNum === currentPage}
            onClick={() => handlePageChange(pageNum)}
          >
            {pageNum}
          </Pagination.Item>
        );
      })}
      
      {/* Always show last page if not in current range */}
      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && <Pagination.Ellipsis disabled />}
          <Pagination.Item onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </Pagination.Item>
        </>
      )}
      
      <Pagination.Next 
        onClick={() => handlePageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      />
      <Pagination.Last 
        onClick={() => handlePageChange(totalPages)} 
        disabled={currentPage === totalPages}
      />
    </Pagination>
  </div>
)}
        </>
      )}

      {/* Assign Users Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Assign Users to Instructor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {assignLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading available users...</p>
            </div>
          ) : availableUsers.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-people-fill fs-1 text-muted"></i>
              <p className="mt-2 text-muted">No users available at this location</p>
            </div>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {availableUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleUserSelection(user._id)}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{getLocationString(user.location)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={assignUsersToInstructor}
            disabled={assignLoading || selectedUsers.length === 0}
          >
            {assignLoading ? 'Assigning...' : `Assign ${selectedUsers.length} User(s)`}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssignTeam;