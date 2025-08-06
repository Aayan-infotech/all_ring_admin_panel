import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { Eye, Search, Filter, ChevronDown } from 'react-bootstrap-icons';

const ParticipantsJournals = () => {
  // Sample data - replace with actual API calls
  const [journals, setJournals] = useState([
    {
      id: 1,
      className: 'Math 101',
      location: 'Building A, Room 203',
      user: 'John Doe',
      instructor: 'Prof. Smith',
      sharedWith: ['Classmates', 'TA'],
      status: 'active'
    },
    {
      id: 2,
      className: 'Science 202',
      location: 'Building B, Room 105',
      user: 'Jane Smith',
      instructor: 'Dr. Johnson',
      sharedWith: ['Instructor only'],
      status: 'active'
    },
    {
      id: 3,
      className: 'History 150',
      location: 'Online',
      user: 'Mike Brown',
      instructor: 'Prof. Williams',
      sharedWith: ['Study Group'],
      status: 'archived'
    },
    {
      id: 4,
      className: 'Literature 210',
      location: 'Building C, Room 301',
      user: 'Sarah Johnson',
      instructor: 'Dr. Anderson',
      sharedWith: ['Public'],
      status: 'active'
    },
  ]);

  const [filteredJournals, setFilteredJournals] = useState(journals);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');

  // Get unique class names for filter dropdown
  const uniqueClasses = [...new Set(journals.map(journal => journal.className))];

  // Apply filters
  useEffect(() => {
    let result = journals;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(journal =>
        journal.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(journal => journal.status === statusFilter);
    }
    
    // Apply class filter
    if (classFilter !== 'all') {
      result = result.filter(journal => journal.className === classFilter);
    }
    
    setFilteredJournals(result);
  }, [searchTerm, statusFilter, classFilter, journals]);

  const handleView = (id) => {
    // Handle view action - navigate to journal detail or open modal
    console.log(`View journal with id: ${id}`);
  };

  return (
    <div className="participants-journals" style={{ padding: '20px' }}>
      <h2 style={{ color: 'var(--secondary)', marginBottom: '20px' }}>Participants Journals</h2>
      
      {/* Filters and Search */}
      <div className="filters mb-4" style={{ backgroundColor: 'var(--accent)', padding: '15px', borderRadius: '8px' }}>
        <Form>
          <div className="d-flex flex-wrap align-items-center gap-3">
            {/* Search */}
            <InputGroup style={{ width: '300px' }}>
              <InputGroup.Text style={{ backgroundColor: 'white' }}>
                <Search />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by user, class or instructor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            {/* Status Filter */}
            <Dropdown>
              <Dropdown.Toggle variant="light" id="status-filter">
                <Filter /> Status: {statusFilter === 'all' ? 'All' : statusFilter} <ChevronDown />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setStatusFilter('all')}>All</Dropdown.Item>
                <Dropdown.Item onClick={() => setStatusFilter('active')}>Active</Dropdown.Item>
                <Dropdown.Item onClick={() => setStatusFilter('archived')}>Archived</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Class Filter */}
            <Dropdown>
              <Dropdown.Toggle variant="light" id="class-filter">
                <Filter /> Class: {classFilter === 'all' ? 'All' : classFilter} <ChevronDown />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setClassFilter('all')}>All Classes</Dropdown.Item>
                {uniqueClasses.map(className => (
                  <Dropdown.Item key={className} onClick={() => setClassFilter(className)}>
                    {className}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Form>
      </div>

      {/* Journals Table */}
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
            <tr>
              <th>Sr. No</th>
              <th>Class</th>
              <th>Location</th>
              <th>User</th>
              <th>Instructor</th>
              <th>Shared With</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredJournals.length > 0 ? (
              filteredJournals.map((journal, index) => (
                <tr key={journal.id}>
                  <td>{index + 1}</td>
                  <td>{journal.className}</td>
                  <td>{journal.location}</td>
                  <td>{journal.user}</td>
                  <td>{journal.instructor}</td>
                  <td>
                    {journal.sharedWith.map((item, i) => (
                      <React.Fragment key={i}>
                        <Badge bg="info" className="me-1">{item}</Badge>
                        {i < journal.sharedWith.length - 1 && ' '}
                      </React.Fragment>
                    ))}
                  </td>
                  <td>
                    <Badge bg={journal.status === 'active' ? 'success' : 'warning'}>
                      {journal.status}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleView(journal.id)}
                      style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                    >
                      <Eye /> View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No journals found matching your criteria</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination would go here */}
    </div>
  );
};

export default ParticipantsJournals;