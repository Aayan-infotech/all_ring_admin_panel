import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ThreadView = () => {
  const { ticketId } = useParams();
  const [thread, setThread] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5010/api/support/thread/${ticketId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.thread)) {
          setThread(data.thread);
        } else {
          setThread([]);
        }
        setLoading(false);
      });
  }, [ticketId]);

  return (
    <div style={{
      width: 500,
      height: 700,
      margin: '0 auto',
      background: '#ece5dd',
      borderRadius: 10,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        background: '#075e54',
        color: 'white',
        padding: '16px',
        fontWeight: 'bold',
        fontSize: '18px'
      }}>
        Ticket Chat
      </div>
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          thread.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.sender.role === 'admin' ? 'flex-end' : 'flex-start',
                background: msg.sender.role === 'admin' ? '#dcf8c6' : 'white',
                color: '#222',
                borderRadius: '8px',
                padding: '10px 14px',
                maxWidth: '70%',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{msg.sender.name}</div>
              <div>{msg.message}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ThreadView;
