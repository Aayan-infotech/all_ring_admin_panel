


import React, { useState, useEffect } from 'react';
import { Table, Button, ButtonGroup, Badge, InputGroup, Form, Spinner } from 'react-bootstrap';
import { 
  PencilSquare, 
  PersonCheckFill,
  CheckCircleFill, 
  XCircleFill,
  Search,
  PlusCircle,
  StarFill
} from 'react-bootstrap-icons';
import axios from 'axios';
import AddMentorOffcanvas from '../AddMentorOffcanvas';

const Mentors = () => {
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch mentors from API
 const fetchMentors = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('adminToken'); // Get token from localStorage

    const res = await axios.get('http://18.209.91.97:5010/api/admin/getRegister/mentor', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setMentors(res.data.data || []);
    setLoading(false);
  } catch (err) {
    console.error('Error fetching mentors:', err);
    setLoading(false);
  }
};


  useEffect(() => {
    fetchMentors();
  }, []);

  // Toggle active/inactive status (local only)
  const toggleStatus = (id) => {
    setMentors(mentors.map(mentor =>
      mentor._id === id
        ? { ...mentor, status: mentor.status === 'active' ? 'inactive' : 'active' }
        : mentor
    ));
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
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
                <th>Specialization</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentors.map((mentor, index) => (
                <tr key={mentor._id}>
                  <td>{index + 1}</td>
                  <td>{mentor.name || '-'}</td>
                  <td>{mentor.email || '-'}</td>
                  <td>{mentor.specialization || '-'}</td>
                  <td>
                    <StarFill color="gold" className="me-1" />
                    {mentor.rating || '4.5'}
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
                        onClick={() => toggleStatus(mentor._id)}
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
      )}

      <AddMentorOffcanvas
        show={showAddMentor}
        handleClose={() => setShowAddMentor(false)}
        onMentorAdded={fetchMentors} // Optional: Refresh after adding
      />
    </div>
  );
};

export default Mentors;
