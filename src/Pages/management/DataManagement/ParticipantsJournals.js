



import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Dropdown, Form, InputGroup, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Eye, Search, ChevronDown } from 'react-bootstrap-icons';
import axios from 'axios';

const ParticipantsJournals = () => {
  // Fallback static data matching API structure
  const staticJournals = {
    success: true,
    count: 3,
    data: [
      {
        _id: "1",
        classId: {
          _id: "1",
          title: "Math 101",
          location: {
            location: "Building A, Room 203"
          },
          Instructor: {
            name: "Prof. Smith"
          },
          status: "Active"
        },
        userId: {
          name: "John Doe"
        },
        shareWith: ["Classmates", "TA"],
        createdAt: new Date().toISOString()
      },
      {
        _id: "2",
        classId: {
          _id: "2",
          title: "Science 202",
          location: {
            location: "Building B, Room 105"
          },
          Instructor: {
            name: "Dr. Johnson"
          },
          status: "Active"
        },
        userId: {
          name: "Jane Smith"
        },
        shareWith: ["Instructor only"],
        createdAt: new Date().toISOString()
      },
      {
        _id: "3",
        classId: {
          _id: "3",
          title: "History 150",
          location: {
            location: "Online"
          },
          Instructor: {
            name: "Prof. Williams"
          },
          status: "Archived"
        },
        userId: {
          name: "Mike Brown"
        },
        shareWith: ["Study Group"],
        createdAt: new Date().toISOString()
      }
    ]
  };

  const [apiResponse, setApiResponse] = useState(null);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  // Fetch journals from API
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await axios.get('http://54.205.149.77:5010/api/journel/getJournalForAdmin');
        setApiResponse(response.data);
        setFilteredJournals(response.data.data); // Use response.data.data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setUsingFallbackData(true);
        setApiResponse(staticJournals);
        setFilteredJournals(staticJournals.data);
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  // Get unique class names for filter dropdown
  const uniqueClasses = apiResponse ? [...new Set(apiResponse.data.map(journal => journal.classId.title))] : [];

  // Apply filters
  useEffect(() => {
    if (!apiResponse) return;
    
    let result = apiResponse.data;
    
    if (searchTerm) {
      result = result.filter(journal =>
        journal.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.classId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.classId.Instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(journal => journal.classId.status === statusFilter);
    }
    
    if (classFilter !== 'all') {
      result = result.filter(journal => journal.classId.title === classFilter);
    }
    
    setFilteredJournals(result);
  }, [searchTerm, statusFilter, classFilter, apiResponse]);

  const handleView = (id) => {
    console.log(`View journal with id: ${id}`);
    // Implement view functionality
  };

  return (
    <div className="participants-journals p-3">
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="m-0" style={{ color: 'var(--secondary)' }}>Participants Journals</h2>
            {usingFallbackData && (
              <Badge bg="warning" text="dark">
                Using fallback data
              </Badge>
            )}
          </div>
          
          {/* Show error message if API failed */}
          {error && (
            <Alert variant="warning" className="mb-4">
              <Alert.Heading>Connection Issue</Alert.Heading>
              <p>
                Could not connect to the server: {error}. Showing fallback data instead.
                <br />
                <small>Some features might be limited.</small>
              </p>
            </Alert>
          )}

          {/* Filters Section */}
          <Card className="mb-4 border-0" style={{ backgroundColor: 'var(--accent)' }}>
            <Card.Body>
              <h5 className="mb-3" style={{ color: 'var(--secondary)' }}>Filters</h5>
              <Row className="g-3">
                {/* Search Column */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Search</Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{ backgroundColor: 'white' }}>
                        <Search />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="User, class or instructor"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                
                {/* Status Filter Column */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle 
                        variant="light" 
                        id="status-filter"
                        className="w-100 d-flex justify-content-between align-items-center"
                        style={{ backgroundColor: 'white' }}
                      >
                        <span>{statusFilter === 'all' ? 'All Statuses' : statusFilter}</span>
                        <ChevronDown />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-100">
                        <Dropdown.Item onClick={() => setStatusFilter('all')}>All Statuses</Dropdown.Item>
                        <Dropdown.Item onClick={() => setStatusFilter('Active')}>Active</Dropdown.Item>
                        <Dropdown.Item onClick={() => setStatusFilter('Archived')}>Archived</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </Col>
                
                {/* Class Filter Column */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Class</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle 
                        variant="light" 
                        id="class-filter"
                        className="w-100 d-flex justify-content-between align-items-center"
                        style={{ backgroundColor: 'white' }}
                      >
                        <span>{classFilter === 'all' ? 'All Classes' : classFilter}</span>
                        <ChevronDown />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-100">
                        <Dropdown.Item onClick={() => setClassFilter('all')}>All Classes</Dropdown.Item>
                        {uniqueClasses.map(className => (
                          <Dropdown.Item key={className} onClick={() => setClassFilter(className)}>
                            {className}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Loading Spinner */}
          {loading && (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}

          {/* Journals Table */}
          {!loading && (
            <div className="table-responsive">
              <Table striped bordered hover className="m-0">
                <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
                  <tr>
                    <th>Sr. No</th>
                    <th>Class</th>
                    <th>Location</th>
                    <th>User</th>
                    <th>Instructor</th>
                    <th>Shared With</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJournals.length > 0 ? (
                    filteredJournals.map((journal, index) => (
                      <tr key={journal._id || index}>
                        <td>{index + 1}</td>
                        <td>{journal.classId?.title || 'N/A'}</td>
                        <td>{journal.classId?.location?.location || 'N/A'}</td>
                        <td>{journal.userId?.name || 'N/A'}</td>
                        <td>{journal.classId?.Instructor?.name || 'N/A'}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {Array.isArray(journal.shareWith) ? (
                              journal.shareWith.map((item, i) => (
                                <Badge key={i} bg="info">{item}</Badge>
                              ))
                            ) : (
                              <Badge bg="secondary">Not shared</Badge>
                            )}
                          </div>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleView(journal._id)}
                            className="d-flex align-items-center gap-1"
                          >
                            <Eye size={14} /> View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <div className="text-muted">No journals found matching your criteria</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ParticipantsJournals;