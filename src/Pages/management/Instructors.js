import React, { useState } from 'react';
import { Table, Button, ButtonGroup, Badge, InputGroup, Form } from 'react-bootstrap';
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
  const [instructors, setInstructors] = useState([
    {
      id: 1,
      name: 'David Miller',
      email: 'david@example.com',
      courses: ['React', 'Node.js'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Emma Wilson',
      email: 'emma@example.com',
      courses: ['Python', 'Django'],
      status: 'active'
    },
    {
      id: 3,
      name: 'James Taylor',
      email: 'james@example.com',
      courses: ['Angular', 'TypeScript'],
      status: 'inactive'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const toggleStatus = (id) => {
    setInstructors(instructors.map(instructor => 
      instructor.id === id 
        ? { ...instructor, status: instructor.status === 'active' ? 'inactive' : 'active' } 
        : instructor
    ));
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)', fontWeight: '600' }}>Instructor Management</h2>
        <Button 
          variant="primary"
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
              <tr key={instructor.id}>
                <td>{index + 1}</td>
                <td>{instructor.name}</td>
                <td>{instructor.email}</td>
                <td>{instructor.courses.join(', ')}</td>
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
                      onClick={() => toggleStatus(instructor.id)}
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
    </div>
  );
};

export default Instructors;