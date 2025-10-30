import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tab, Nav, Breadcrumb, Alert, Spinner, Form } from 'react-bootstrap';
import { Save, Eye } from 'react-bootstrap-icons';
import API_BASE_URL from '../../../config/api';

const StaticContent = () => {
  const [activeTab, setActiveTab] = useState('aboutUs');
  const [content, setContent] = useState({
    aboutUs: '',
    termsAndConditions: '',
    privacyPolicy: '',
    deleteAccount: ''
  });
  const [originalContent, setOriginalContent] = useState({
    aboutUs: '',
    termsAndConditions: '',
    privacyPolicy: '',
    deleteAccount: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewContent, setPreviewContent] = useState({ show: false, title: '', content: '' });

  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab]);

  const fetchContent = async (section) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      console.log('Fetching content for section:', section);
      
      const response = await fetch(`${API_BASE_URL}/api/static-content/get/${section}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (result.data) {
        const contentValue = result.data.content || '';
        
        setContent(prev => ({
          ...prev,
          [section]: contentValue
        }));
        setOriginalContent(prev => ({
          ...prev,
          [section]: contentValue
        }));
        
        if (contentValue) {
          setMessage({ type: 'success', text: `${getSectionTitle(section)} content loaded successfully` });
        } else {
          setMessage({ type: 'info', text: `No content found for ${getSectionTitle(section)}. You can create new content.` });
        }
      } else {
        setContent(prev => ({
          ...prev,
          [section]: ''
        }));
        setOriginalContent(prev => ({
          ...prev,
          [section]: ''
        }));
        
        setMessage({ type: 'info', text: `No existing content found for ${getSectionTitle(section)}. You can create new content.` });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      let errorMessage = 'Error fetching content';
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Cannot connect to server. Please check your connection and API URL.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = `Server error: ${error.message}`;
      }
      
      setMessage({ type: 'danger', text: errorMessage });
      
      setContent(prev => ({
        ...prev,
        [activeTab]: ''
      }));
      setOriginalContent(prev => ({
        ...prev,
        [activeTab]: ''
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content[activeTab].trim()) {
      setMessage({ type: 'warning', text: 'Content cannot be empty' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/static-content/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: activeTab,
          content: content[activeTab]
        }),
      });

      console.log('Save response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Save response:', result);

      if (result.success) {
        setMessage({ type: 'success', text: `${getSectionTitle(activeTab)} saved successfully!` });
        setOriginalContent(prev => ({
          ...prev,
          [activeTab]: content[activeTab]
        }));
      } else {
        setMessage({ type: 'danger', text: result.message || 'Failed to save content' });
      }
    } catch (error) {
      console.error('Error saving content:', error);
      let errorMessage = 'Error saving content';
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Cannot connect to server. Please check your connection.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = `Server error: ${error.message}`;
      }
      
      setMessage({ type: 'danger', text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    const titles = {
      aboutUs: 'About Us',
      termsAndConditions: 'Terms and Conditions',
      privacyPolicy: 'Privacy Policy',
      deleteAccount: 'Delete Account'
    };

    setPreviewContent({
      show: true,
      title: titles[activeTab],
      content: content[activeTab]
    });
  };

  const hasChanges = () => {
    return content[activeTab] !== originalContent[activeTab];
  };

  const getSectionTitle = (section) => {
    const titles = {
      aboutUs: 'About Us',
      termsAndConditions: 'Terms & Conditions',
      privacyPolicy: 'Privacy Policy',
      deleteAccount: 'Delete Account'
    };
    return titles[section];
  };

  // Simple textarea version that works without external dependencies
  const renderEditor = (section) => {
    return (
      <Form.Control
        as="textarea"
        rows={15}
        value={content[section]}
        onChange={(e) => setContent(prev => ({ ...prev, [section]: e.target.value }))}
        placeholder={`Enter ${getSectionTitle(section)} content here...`}
        style={{ 
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          lineHeight: '1.5'
        }}
      />
    );
  };

  return (
    <div className="static-content">
      <div className="mb-4">
        <Breadcrumb style={{ backgroundColor: 'var(--light)', padding: '10px', borderRadius: '5px' }}>
          <Breadcrumb.Item
            href="/dashboard"
            style={{
              color: 'var(--secondary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <i className="fas fa-home me-2"></i> Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item
            active
            style={{
              color: 'var(--primary)',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <i className="fas fa-file-alt me-2"></i> Static Content Management
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Container fluid>
        <Row>
          <Col>
            <Card>
              <Card.Header style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
                <h4 className="mb-0">
                  <i className="fas fa-cogs me-2"></i>
                  Static Content Management
                </h4>
              </Card.Header>
              <Card.Body>
                {message.text && (
                  <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
                    {message.text}
                  </Alert>
                )}

                <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                  <Row>
                    <Col md={3}>
                      <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                          <Nav.Link eventKey="aboutUs" className="d-flex align-items-center">
                            <i className="fas fa-info-circle me-2"></i>
                            About Us
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="termsAndConditions" className="d-flex align-items-center">
                            <i className="fas fa-file-contract me-2"></i>
                            Terms & Conditions
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="privacyPolicy" className="d-flex align-items-center">
                            <i className="fas fa-shield-alt me-2"></i>
                            Privacy Policy
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="deleteAccount" className="d-flex align-items-center">
                            <i className="fas fa-trash-alt me-2"></i>
                            Delete Account
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Col>
                    
                    <Col md={9}>
                      <Tab.Content>
                        {['aboutUs', 'termsAndConditions', 'privacyPolicy', 'deleteAccount'].map(section => (
                          <Tab.Pane key={section} eventKey={section}>
                            <Card>
                              <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                  <i className="fas fa-edit me-2"></i>
                                  Edit {getSectionTitle(section)}
                                </h5>
                                <div>
                                  {hasChanges() && (
                                    <span className="badge bg-warning me-2">Unsaved Changes</span>
                                  )}
                                  <Button
                                    variant="outline-info"
                                    size="sm"
                                    className="me-2"
                                    onClick={handlePreview}
                                    disabled={loading || !content[activeTab]}
                                  >
                                    <Eye className="me-1" />
                                    Preview
                                  </Button>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={loading || saving || !hasChanges()}
                                  >
                                    {saving ? (
                                      <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Saving...
                                      </>
                                    ) : (
                                      <>
                                        <Save className="me-1" />
                                        Save Changes
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </Card.Header>
                              <Card.Body>
                                {loading ? (
                                  <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-2">Loading content...</p>
                                  </div>
                                ) : (
                                  renderEditor(section)
                                )}
                              </Card.Body>
                            </Card>
                          </Tab.Pane>
                        ))}
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Preview Modal */}
      {previewContent.show && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
                <h5 className="modal-title">
                  <i className="fas fa-eye me-2"></i>
                  Preview: {previewContent.title}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setPreviewContent({ show: false, title: '', content: '' })}
                ></button>
              </div>
              <div className="modal-body">
                <div 
                  className="preview-content"
                  style={{ 
                    maxHeight: '60vh', 
                    overflowY: 'auto',
                    padding: '20px',
                    border: '1px solid #dee2e6',
                    borderRadius: '5px',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Arial, sans-serif',
                    lineHeight: '1.6'
                  }}
                >
                  {previewContent.content}
                </div>
              </div>
              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setPreviewContent({ show: false, title: '', content: '' })}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaticContent;