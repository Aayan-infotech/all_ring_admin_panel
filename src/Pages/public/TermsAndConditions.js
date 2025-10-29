import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import API_BASE_URL from '../../config/api';

const TermsAndConditions = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/static-content/get/termsAndConditions`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.data && result.data.content) {
        setContent(result.data.content);
      } else {
        setContent('Terms and Conditions content not available.');
      }
    } catch (error) {
      console.error('Error fetching terms and conditions:', error);
      setError('Failed to load Terms and Conditions. Please try again later.');
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
    <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', minHeight: '100vh' }}>
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>Terms & Conditions</h1>
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

export default TermsAndConditions;