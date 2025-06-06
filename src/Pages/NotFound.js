
import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <Container style={styles.card}>
        <h1 style={styles.heading}>404</h1>
        <h3 style={styles.subheading}>Oops! Page Not Found</h3>
        <p style={styles.text}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button style={styles.button} onClick={() => navigate('/')}>
          <FaArrowLeft className="me-2" />
          Go Back to Dashboard
        </Button>
      </Container>
    </div>
  );
};

const styles = {
  wrapper: {
   
  
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '60px',
    textAlign: 'center',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '600px',
  },
  heading: {
    fontSize: '6rem',
    color: '#F8576F', 
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: '1.75rem',
    color: '#000000',
    marginBottom: '10px',
  },
  text: {
    fontSize: '1rem',
    color: '#444',
    marginBottom: '30px',
  },
  button: {
    backgroundColor: '#F8576F',
    borderColor: '#F8576F',
    padding: '10px 24px',
    fontSize: '1rem',
    borderRadius: '8px',
    color: '#fff',
  },
};

export default NotFound;
