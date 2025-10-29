import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import API_BASE_URL from '../../config/api';

const PrivacyPolicy = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/static-content/get/privacyPolicy`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.data && result.data.content) {
        setContent(result.data.content);
      } else {
        setContent('Privacy Policy content not available.');
      }
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
      setError('Failed to load Privacy Policy. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', minHeight: '100vh' }}>
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>Privacy Policy</h1>
          <div style={{ height: '4px', width: '100px', background: 'white', margin: '20px auto', borderRadius: '2px' }}></div>
        </div>
        
        <div 
          className="p-5 rounded shadow"
          style={{ 
            backgroundColor: 'white',
            minHeight: '400px',
            lineHeight: '1.8',
            fontSize: '1.1rem'
          }}
        >
          <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;