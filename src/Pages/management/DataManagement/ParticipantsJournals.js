



import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Badge, Dropdown, Form, InputGroup, 
  Card, Row, Col, Spinner, Alert, Modal 
} from 'react-bootstrap';
import { Eye, Search, ChevronDown, X } from 'react-bootstrap-icons';
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
            name: "Prof. Smith",
            email: "prof.smith@example.com"
          },
          status: "Active"
        },
        userId: {
          name: "John Doe",
          email: "john.doe@example.com"
        },
        shareWith: ["Classmates", "TA"],
        title1: "Math Challenge",
        description1: "Struggling with calculus concepts",
        title2: "Today's Feelings",
        description2: "Confused but motivated",
        createdAt: new Date().toISOString()
      },
      // ... other static journal entries
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
  const [showModal, setShowModal] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);

  // Fetch journals from API
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await axios.get('http://54.205.149.77:5010/api/journel/getJournalForAdmin');
        setApiResponse(response.data);
        setFilteredJournals(response.data.data);
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

  const handleView = (journal) => {
    setSelectedJournal(journal);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJournal(null);
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
                            onClick={() => handleView(journal)}
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

      {/* Journal Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton style={{ backgroundColor: 'var(--accent)' }}>
          <Modal.Title>Journal Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedJournal && (
            <div>
              <div className="mb-4">
                <h5 className="text-muted">Class Information</h5>
                <Row className="mb-2">
                  <Col md={6}>
                    <p><strong>Class:</strong> {selectedJournal.classId?.title || 'N/A'}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Instructor:</strong> {selectedJournal.classId?.Instructor?.name || 'N/A'}</p>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <p><strong>Location:</strong> {selectedJournal.classId?.location?.location || 'N/A'}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Status:</strong> 
                      <Badge bg={selectedJournal.classId?.status === 'Active' ? 'success' : 'warning'} className="ms-2">
                        {selectedJournal.classId?.status || 'N/A'}
                      </Badge>
                    </p>
                  </Col>
                </Row>
              </div>

              <div className="mb-4">
                <h5 className="text-muted">Participant Information</h5>
                <Row>
                  <Col md={6}>
                    <p><strong>Name:</strong> {selectedJournal.userId?.name || 'N/A'}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Email:</strong> {selectedJournal.userId?.email || 'N/A'}</p>
                  </Col>
                </Row>
              </div>

              <div className="mb-4">
                <h5 className="text-muted">Journal Content</h5>
                <Card className="mb-3">
                  <Card.Header>{selectedJournal.title1 || 'Journal Entry 1'}</Card.Header>
                  <Card.Body>
                    <p>{selectedJournal.description1 || 'No content available'}</p>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Header>{selectedJournal.title2 || 'Journal Entry 2'}</Card.Header>
                  <Card.Body>
                    <p>{selectedJournal.description2 || 'No content available'}</p>
                  </Card.Body>
                </Card>
              </div>

              <div>
                <h5 className="text-muted">Sharing Information</h5>
                <p><strong>Shared with:</strong></p>
                <div className="d-flex flex-wrap gap-1 mb-2">
                  {Array.isArray(selectedJournal.shareWith) ? (
                    selectedJournal.shareWith.map((item, i) => (
                      <Badge key={i} bg="info">{item}</Badge>
                    ))
                  ) : (
                    <Badge bg="secondary">Not shared</Badge>
                  )}
                </div>
                <p className="text-muted"><small>Created on: {new Date(selectedJournal.createdAt).toLocaleString()}</small></p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ParticipantsJournals;