

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddInstructorOffcanvas from '../AddInstructorOffcanvas';
import { Table, Button, ButtonGroup, Badge, InputGroup, Form, Spinner } from 'react-bootstrap';
import { 
  PencilSquare, 
  PersonLinesFill,
  CheckCircleFill, 
  XCircleFill,
  Search,
  PlusCircle,
  CalendarCheck
} from 'react-bootstrap-icons';

const Instructors = () => {
  const [showAddInstructor, setShowAddInstructor] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    fetchInstructors();
  }, []);


  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://18.209.91.97:5010/api/admin/getRegister/instructor', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setInstructors(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch instructors:', err);
    } finally {
      setLoading(false);
    }
  };

  
  const toggleStatus = (id) => {
    setInstructors(instructors.map(instructor =>
      instructor._id === id
        ? { ...instructor, status: instructor.status === 'active' ? 'inactive' : 'active' }
        : instructor
    ));
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(instructor.course)
      ? instructor.course.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()))
      : instructor.course?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)', fontWeight: '600' }}>Instructor Management</h2>
        <Button 
          variant="primary"
          onClick={() => setShowAddInstructor(true)}
          style={{
            backgroundColor: 'var(--primary)',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px'
          }}
        >
          <PlusCircle className="me-2" />
          Add New Instructor
        </Button>
      </div>

      <div className="mb-4">
        <InputGroup style={{ maxWidth: '400px' }}>
          <Form.Control 
            placeholder="Search instructors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: '2px solid var(--accent)',
              borderRadius: '8px 0 0 8px'
            }}
          />
          <Button 
            variant="primary"
            style={{
              backgroundColor: 'var(--primary)',
              border: 'none',
              borderRadius: '0 8px 8px 0'
            }}
          >
            <Search />
          </Button>
        </InputGroup>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Courses</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstructors.map((instructor, index) => (
                <tr key={instructor._id}>
                  <td>{index + 1}</td>
                  <td>{instructor.name}</td>
                  <td>{instructor.email}</td>
                  <td>
                    {Array.isArray(instructor.course)
                      ? instructor.course.join(', ')
                      : instructor.course}
                  </td>
                  <td>
                    <Badge 
                      pill 
                      style={{ 
                        padding: '8px 12px',
                        fontWeight: '500',
                        backgroundColor: instructor.status === 'active' ? 'var(--success)' : 'var(--danger)'
                      }}
                    >
                      {instructor.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <ButtonGroup>
                      <Button 
                        variant={instructor.status === 'active' ? 'danger' : 'success'} 
                        size="sm"
                        onClick={() => toggleStatus(instructor._id)}
                        className="me-2"
                        style={{
                          backgroundColor: instructor.status === 'active' ? 'var(--danger)' : 'var(--success)',
                          border: 'none'
                        }}
                      >
                        {instructor.status === 'active' ? <XCircleFill className="me-1" /> : <CheckCircleFill className="me-1" />}
                        {instructor.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        variant="warning" 
                        size="sm" 
                        className="me-2"
                        style={{
                          backgroundColor: '#ffc107',
                          border: 'none'
                        }}
                      >
                        <PencilSquare className="me-1" /> Edit
                      </Button>
                      <Button 
                        variant="info" 
                        size="sm"
                        style={{
                          backgroundColor: '#17a2b8',
                          border: 'none'
                        }}
                      >
                        <CalendarCheck className="me-1" /> Schedule
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <AddInstructorOffcanvas
        show={showAddInstructor}
        handleClose={() => setShowAddInstructor(false)}
        onInstructorAdded={fetchInstructors}
      />
    </div>
  );
};

export default Instructors;
