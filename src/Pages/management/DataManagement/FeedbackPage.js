
import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FeedbackPage = () => {
  const { classId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeedbacks = async () => {
    try {
const res = await axios.get(`http://localhost:5010/api/feedback/getAllFeedbacks/${classId}`);
      setFeedbacks(res.data.data || []);
    } catch (err) {
      setError('Failed to load feedbacks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [classId]);

  return (
<div className="p-4" style={{ background: '#f9f9f9' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ fontWeight: '600', color: 'var(--secondary)' }}>Class Feedback</h3>
      </div>
      {loading ? (
        <div className="text-center mt-4"><Spinner animation="border" /></div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table bordered hover className="align-middle">
          <thead className="text-white" style={{ backgroundColor: '#003865' }}>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Comment</th>
              <th>Rating</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length > 0 ? feedbacks.map((fb, idx) => (
              <tr key={fb._id || idx}>
                <td>{idx + 1}</td>
                <td>{fb.user?.name || 'N/A'}</td>
                <td>{fb.feedback || 'No comment'}</td>
                <td>{fb.rating || 'N/A'}</td>
                <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center">No feedbacks found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default FeedbackPage;
