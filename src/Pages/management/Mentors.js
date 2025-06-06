import React, { useState } from 'react';
import { Table, Button, ButtonGroup, Badge, InputGroup, Form } from 'react-bootstrap';
import { 
  PencilSquare, 
  PersonCheckFill,
  CheckCircleFill, 
  XCircleFill,
  Search,
  PlusCircle,
  StarFill
} from 'react-bootstrap-icons';
import AddMentorOffcanvas from '../AddMentorOffcanvas'

const Mentors = () => {
  const [showAddMentor, setShowAddMentor] = useState(false);

  const [mentors, setMentors] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      specialization: 'Web Development',
      rating: 4.8,
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      specialization: 'Data Science',
      rating: 4.5,
      status: 'active'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@example.com',
      specialization: 'Mobile App',
      rating: 4.2,
      status: 'inactive'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const toggleStatus = (id) => {
    setMentors(mentors.map(mentor => 
      mentor.id === id 
        ? { ...mentor, status: mentor.status === 'active' ? 'inactive' : 'active' } 
        : mentor
    ));
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)', fontWeight: '600' }}>Mentor Management</h2>
        <Button 
          variant="primary"
          onClick={() => setShowAddMentor(true)}
          style={{
            backgroundColor: 'var(--primary)',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px'
          }}
          
        >
          <PlusCircle className="me-2" />
          Add New Mentor
        </Button>
      </div>
      
      <div className="mb-4">
        <InputGroup style={{ maxWidth: '400px' }}>
          <Form.Control 
            placeholder="Search mentors..." 
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
              <th>Specialization</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMentors.map((mentor, index) => (
              <tr key={mentor.id}>
                <td>{index + 1}</td>
                <td>{mentor.name}</td>
                <td>{mentor.email}</td>
                <td>{mentor.specialization}</td>
                <td>
                  <StarFill color="gold" className="me-1" />
                  {mentor.rating}
                </td>
                <td>
                  <Badge 
                    pill 
                    style={{ 
                      padding: '8px 12px',
                      fontWeight: '500',
                      backgroundColor: mentor.status === 'active' ? 'var(--success)' : 'var(--danger)'
                    }}
                  >
                    {mentor.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td>
                  <ButtonGroup>
                    <Button 
                      variant={mentor.status === 'active' ? 'danger' : 'success'} 
                      size="sm"
                      onClick={() => toggleStatus(mentor.id)}
                      className="me-2"
                      style={{
                        backgroundColor: mentor.status === 'active' ? 'var(--danger)' : 'var(--success)',
                        border: 'none'
                      }}
                    >
                      {mentor.status === 'active' ? <XCircleFill className="me-1" /> : <CheckCircleFill className="me-1" />}
                      {mentor.status === 'active' ? 'Deactivate' : 'Activate'}
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
                      <PersonCheckFill className="me-1" /> Profile
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <AddMentorOffcanvas
  show={showAddMentor}
  handleClose={() => setShowAddMentor(false)}
  // onMentorAdded={fetchMentors}
/>
    </div>
  );
};

export default Mentors;