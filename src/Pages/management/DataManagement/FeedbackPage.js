

// import React, { useEffect, useState } from 'react';
// import { Table, Spinner, Alert, Card, Accordion, Badge } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import API_BASE_URL from '../../../config/api';

// const FeedbackPage = () => {
//   const { classId } = useParams();
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [questionnaires, setQuestionnaires] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [qnaLoading, setQnaLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [qnaError, setQnaError] = useState('');

//   const fetchFeedbacks = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/feedback/getAllFeedbacks/${classId}`);
//       setFeedbacks(res.data.data || []);
//     } catch (err) {
//       setError('Failed to load feedbacks');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchQuestionnaires = async () => {
//     try {
//       setQnaLoading(true);
//       // First get all feedbacks to extract user IDs
//       const feedbacksRes = await axios.get(`${API_BASE_URL}/api/feedback/getAllFeedbacks/${classId}`);
//       const userIds = [...new Set(feedbacksRes.data.data.map(fb => fb.user?._id).filter(id => id))];
      
//       // Fetch questionnaire data for each user
//       const questionnairePromises = userIds.map(userId => 
//         axios.get(`${API_BASE_URL}/api/questionaire/getUserQuestionnaireWithAnswers/${classId}/${userId}`)
//       );
      
//       const questionnaireResults = await Promise.allSettled(questionnairePromises);
      
//       // Process the results according to the actual API response structure
//       const validQuestionnaires = questionnaireResults
//         .filter(result => result.status === 'fulfilled' && result.value.data.success)
//         .map(result => {
//           const data = result.value.data.data;
//           return {
//             userId: data.userId,
//             classId: data.classId,
//             questions: data.questions || [],
//             userName: feedbacksRes.data.data.find(fb => fb.user?._id === data.userId)?.user?.name || 'Unknown User'
//           };
//         });
      
//       setQuestionnaires(validQuestionnaires);
//     } catch (err) {
//       setQnaError('Failed to load questions and answers');
//       console.error(err);
//     } finally {
//       setQnaLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFeedbacks();
//     fetchQuestionnaires();
//   }, [classId]);

//   return (
//     <div className="p-4" style={{ background: '#f9f9f9', minHeight: '100vh' }}>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 style={{ fontWeight: '600', color: 'var(--secondary)' }}>Class Feedback</h3>
//       </div>
      
//       {loading ? (
//         <div className="text-center mt-4"><Spinner animation="border" /></div>
//       ) : error ? (
//         <Alert variant="danger">{error}</Alert>
//       ) : (
//         <>
//           <Table bordered hover className="align-middle mb-4">
//             <thead className="text-white" style={{ backgroundColor: '#003865' }}>
//               <tr>
//                 <th>#</th>
//                 <th>User</th>
//                 <th>Comment</th>
//                 <th>Rating</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {feedbacks.length > 0 ? feedbacks.map((fb, idx) => (
//                 <tr key={fb._id || idx}>
//                   <td>{idx + 1}</td>
//                   <td>{fb.user?.name || 'N/A'}</td>
//                   <td>{fb.feedback || 'No comment'}</td>
//                   <td>
//                     {fb.rating ? (
//                       <Badge bg="primary">{fb.rating}/5</Badge>
//                     ) : (
//                       'N/A'
//                     )}
//                   </td>
//                   <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               )) : (
//                 <tr>
//                   <td colSpan="5" className="text-center">No feedbacks found.</td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>

//           {/* Questions and Answers Section */}
//           <Card className="mb-4">
//             <Card.Header style={{ backgroundColor: '#003865', color: 'white' }}>
//               <h5 className="mb-0">Questions and Answers</h5>
//             </Card.Header>
//             <Card.Body>
//               {qnaLoading ? (
//                 <div className="text-center"><Spinner animation="border" /></div>
//               ) : qnaError ? (
//                 <Alert variant="warning">{qnaError}</Alert>
//               ) : questionnaires.length === 0 ? (
//                 <p className="text-center text-muted">No questions and answers available.</p>
//               ) : (
//                 <Accordion>
//                   {questionnaires.map((qna, idx) => (
//                     <Accordion.Item key={idx} eventKey={idx.toString()}>
//                       <Accordion.Header>
//                         {qna.userName} - {qna.questions.length} Questions
//                       </Accordion.Header>
//                       <Accordion.Body>
//                         {qna.questions.length > 0 ? (
//                           qna.questions.map((question, qIdx) => (
//                             <div key={qIdx} className="mb-3">
//                               <h6 className="text-primary">Q: {question.questionText}</h6>
//                               <p className="ms-3">
//                                 <strong>A:</strong> {question.answerText || 'No answer provided'}
//                               </p>
//                             </div>
//                           ))
//                         ) : (
//                           <p className="text-muted">No questions answered by this user.</p>
//                         )}
//                       </Accordion.Body>
//                     </Accordion.Item>
//                   ))}
//                 </Accordion>
//               )}
//             </Card.Body>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// };

// export default FeedbackPage;


import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Card, Accordion, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../../config/api';

const FeedbackPage = () => {
  const { classId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qnaLoading, setQnaLoading] = useState(true);
  const [incidentLoading, setIncidentLoading] = useState(true);
  const [error, setError] = useState('');
  const [qnaError, setQnaError] = useState('');
  const [incidentError, setIncidentError] = useState('');

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/feedback/getAllFeedbacks/${classId}`);
      setFeedbacks(res.data.data || []);
    } catch (err) {
      setError('Failed to load feedbacks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionnaires = async () => {
    try {
      setQnaLoading(true);
      // First get all feedbacks to extract user IDs
      const feedbacksRes = await axios.get(`${API_BASE_URL}/api/feedback/getAllFeedbacks/${classId}`);
      const userIds = [...new Set(feedbacksRes.data.data.map(fb => fb.user?._id).filter(id => id))];
      
      // Fetch questionnaire data for each user
      const questionnairePromises = userIds.map(userId => 
        axios.get(`${API_BASE_URL}/api/questionaire/getUserQuestionnaireWithAnswers/${classId}/${userId}`)
      );
      
      const questionnaireResults = await Promise.allSettled(questionnairePromises);
      
      // Process the results according to the actual API response structure
      const validQuestionnaires = questionnaireResults
        .filter(result => result.status === 'fulfilled' && result.value.data.success)
        .map(result => {
          const data = result.value.data.data;
          return {
            userId: data.userId,
            classId: data.classId,
            questions: data.questions || [],
            userName: feedbacksRes.data.data.find(fb => fb.user?._id === data.userId)?.user?.name || 'Unknown User'
          };
        });
      
      setQuestionnaires(validQuestionnaires);
    } catch (err) {
      setQnaError('Failed to load questions and answers');
      console.error(err);
    } finally {
      setQnaLoading(false);
    }
  };

  const fetchIncidents = async () => {
    try {
      setIncidentLoading(true);
      const res = await axios.get(`http://34.206.193.218:5010/api/incident/getIncidentBySession/${classId}`);
      setIncidents(res.data.data || []);
    } catch (err) {
      setIncidentError('Failed to load incidents');
      console.error(err);
    } finally {
      setIncidentLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchQuestionnaires();
    fetchIncidents();
  }, [classId]);

  return (
    <div className="p-4" style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ fontWeight: '600', color: 'var(--secondary)' }}>Class Feedback</h3>
      </div>
      
      {loading ? (
        <div className="text-center mt-4"><Spinner animation="border" /></div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Table bordered hover className="align-middle mb-4">
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
                  <td>
                    {fb.rating ? (
                      <Badge bg="primary">{fb.rating}/5</Badge>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center">No feedbacks found.</td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Questions and Answers Section */}
          <Card className="mb-4">
            <Card.Header style={{ backgroundColor: '#003865', color: 'white' }}>
              <h5 className="mb-0">Questions and Answers</h5>
            </Card.Header>
            <Card.Body>
              {qnaLoading ? (
                <div className="text-center"><Spinner animation="border" /></div>
              ) : qnaError ? (
                <Alert variant="warning">{qnaError}</Alert>
              ) : questionnaires.length === 0 ? (
                <p className="text-center text-muted">No questions and answers available.</p>
              ) : (
                <Accordion>
                  {questionnaires.map((qna, idx) => (
                    <Accordion.Item key={idx} eventKey={idx.toString()}>
                      <Accordion.Header>
                        {qna.userName} - {qna.questions.length} Questions
                      </Accordion.Header>
                      <Accordion.Body>
                        {qna.questions.length > 0 ? (
                          qna.questions.map((question, qIdx) => (
                            <div key={qIdx} className="mb-3">
                              <h6 className="text-primary">Q: {question.questionText}</h6>
                              <p className="ms-3">
                                <strong>A:</strong> {question.answerText || 'No answer provided'}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">No questions answered by this user.</p>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card.Body>
          </Card>

          {/* Incidents Table Section */}
          <Card className="mb-4">
            <Card.Header style={{ backgroundColor: '#003865', color: 'white' }}>
              <h5 className="mb-0">Incidents</h5>
            </Card.Header>
            <Card.Body>
              {incidentLoading ? (
                <div className="text-center"><Spinner animation="border" /></div>
              ) : incidentError ? (
                <Alert variant="warning">{incidentError}</Alert>
              ) : incidents.length === 0 ? (
                <p className="text-center text-muted">No incidents recorded.</p>
              ) : (
                <Table bordered hover className="align-middle">
                  <thead className="text-white" style={{ backgroundColor: '#003865' }}>
                    <tr>
                      <th>#</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Severity</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map((incident, idx) => (
                      <tr key={incident._id || idx}>
                        <td>{idx + 1}</td>
                        <td>{incident.type || 'N/A'}</td>
                        <td>{incident.description || 'No description'}</td>
                        <td>
                          {incident.severity ? (
                            <Badge bg={
                              incident.severity === 'high' ? 'danger' : 
                              incident.severity === 'medium' ? 'warning' : 'info'
                            }>
                              {incident.severity}
                            </Badge>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>{incident.timestamp ? new Date(incident.timestamp).toLocaleString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default FeedbackPage;