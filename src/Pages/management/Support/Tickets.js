import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import { ReplyFill, XCircleFill } from 'react-bootstrap-icons';
import API_BASE_URL from '../../../config/api';

const Tickets = () => {
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [tickets, setTickets] = useState([]);
  const [thread, setThread] = useState([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const conversationRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const prevThreadLength = useRef(0);
  const [showNewMsgTooltip, setShowNewMsgTooltip] = useState(false);
  const [newMsgIndex, setNewMsgIndex] = useState(null);
  const [lastThreadLength, setLastThreadLength] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/support/tickets`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          // Map API data to UI format
          setTickets(
            data.data.map((ticket, idx) => ({
              id: idx + 1,
              ticketId: ticket.ticketId, // <-- add ticketId from API
              subject: ticket.subject,
              name: ticket.user?.name || '',
              email: ticket.user?.email || '',
              userType: ticket.user?.role || '',
              location: ticket.user?.location || '',
              status: ticket.status,
              profilePicture: ticket.user?.profilePicture || `https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg`,
              messages: ticket.messages || []
            }))
          );
        }
      });
  }, []);

  // Detect user scroll
  useEffect(() => {
    const ref = conversationRef.current;
    if (!ref) return;
    const handleScroll = () => {
      // If user is not at the bottom, set isUserScrolling truewwwwww
      if (ref.scrollHeight - ref.scrollTop - ref.clientHeight > 10) {
        setIsUserScrolling(true);
      } else {
        setIsUserScrolling(false);
      }
    };
    ref.addEventListener('scroll', handleScroll);
    return () => ref.removeEventListener('scroll', handleScroll);
  }, [activeTicket]);

  // Poll for new messages
  useEffect(() => {
    let interval;
    if (activeTicket) {
      interval = setInterval(() => {
        fetch(`${API_BASE_URL}/api/support/thread/${activeTicket.ticketId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && Array.isArray(data.thread)) {
              setThread(data.thread);
            }
          });
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTicket]);

  // Helper to check if user is at bottom
  const isAtBottom = () => {
    const ref = conversationRef.current;
    if (!ref) return false;
    return ref.scrollHeight - ref.scrollTop - ref.clientHeight <= 10;
  };

  // Always scroll to bottom when modal opens (activeTicket changes)
  useEffect(() => {
    if (conversationRef.current && activeTicket) {
      setTimeout(() => {
        conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
      }, 0);
    }
  }, [activeTicket]);

  // Scroll to bottom only if new message comes and user is not scrolling
  useEffect(() => {
    if (
      conversationRef.current &&
      thread.length > prevThreadLength.current
    ) {
      const lastMsg = thread[thread.length - 1];
      const isAdminMsg = lastMsg && lastMsg.sender && lastMsg.sender.role === 'admin';

      if (isAtBottom() || isAdminMsg) {
        // If already at bottom or admin sent message, scroll and do not show tooltip
        conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
        setShowNewMsgTooltip(false);
        setNewMsgIndex(null);
      } else {
        // Only show tooltip if last message is from user
        setShowNewMsgTooltip(lastMsg && lastMsg.sender && lastMsg.sender.role !== 'admin');
        setNewMsgIndex(thread.length - 1);
      }
    }
    prevThreadLength.current = thread.length;
    setLastThreadLength(thread.length);
  }, [thread, activeTicket]);

  // Hide tooltip if user scrolls to bottom
  useEffect(() => {
    if (isAtBottom()) {
      setShowNewMsgTooltip(false);
      setNewMsgIndex(null);
    }
  }, [isUserScrolling, thread]);

  const handleReply = async (ticketId) => {
    if (!replyText.trim()) return;

    const formData = new FormData();
    formData.append('ticketId', activeTicket.ticketId);
    formData.append('message', replyText);
    formData.append('isAdmin', true);

    await fetch(`${API_BASE_URL}/api/support/message/${activeTicket.name?._id || activeTicket.ticketId}`, {
      method: 'POST',
      body: formData,
    });

    setReplyText('');
    openTicketThread(activeTicket);
  };

  const closeTicket = (ticketId) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return { ...ticket, status: 'Closed' };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    setActiveTicket(null);
  };

  const openTicketThread = (ticket) => {
    setLoadingThread(true);
    fetch(`${API_BASE_URL}/api/support/thread/${ticket.ticketId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.thread)) {
          setThread(data.thread);
        } else {
          setThread([]);
        }
        setActiveTicket(ticket);
        setLoadingThread(false);
      })
      .catch(() => {
        setThread([]);
        setActiveTicket(ticket);
        setLoadingThread(false);
      });
  };

  const handleNewMsgClick = () => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
    setShowNewMsgTooltip(false);
    setNewMsgIndex(null);
  };

  return (
    <div className="support-tickets">
      <h2 style={{ color: 'var(--secondary)' }}>Support Tickets</h2>
      
      <Table striped bordered hover responsive>
        <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <tr>
            <th>Sr.no</th>
            <th>Profile Picture</th>
            <th>Subject</th>
            <th>Name</th>
            <th>User Role</th>
            <th>Location</th>
            <th>Status</th>
            <th>Action1</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr key={ticket.id}>
              <td>{index + 1}</td>
              <td style={{ width: '60px', textAlign: 'center' }}>
                <img
                  src={ticket.profilePicture}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg'; }}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-circle"
                  style={{ objectFit: 'cover' }}
                />
              </td>
              
              <td>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '2px'
                }}>
                  <span style={{
                    fontWeight: 600,
                    fontSize: '1.08em',
                    color: 'var(--secondary)'
                  }}>
                    {ticket.name}
                  </span>
                  <span style={{
                    fontSize: '0.95em',
                    color: '#555',
                    background: 'rgba(220,220,220,0.5)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    marginTop: '2px',
                    fontFamily: 'monospace'
                  }}>
                    {ticket.email}
                  </span>
                </div>
              </td>
              <td>{ticket.subject}</td>
              <td>{ticket.userType}</td>
              <td>{ticket.location}</td>
              <td>
                <Badge 
                  bg={ticket.status === 'Open' ? 'warning' : 'success'}
                  text={ticket.status === 'Open' ? 'dark' : 'white'}
                >
                  {ticket.status}
                </Badge>
              </td>
              <td>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => openTicketThread(ticket)}
                  style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}
                >
                  <ReplyFill /> Reply
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Ticket Conversation Modal */}
      <Modal 
        show={!!activeTicket} 
        onHide={() => { setActiveTicket(null); setThread([]); }}
        size="lg"
        style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Modal.Header 
          closeButton 
          style={{ backgroundColor: 'var(--secondary)', color: 'white', borderRadius: '12px 12px 0 0' }}
        >
          <Modal.Title style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            fontWeight: 600,
            fontSize: '1.25rem',
            letterSpacing: '0.5px',
            color: 'var(--secondary)'
          }}>
            <span>
              <span style={{
                background: 'linear-gradient(90deg, #ff6a88 0%, #ffb86c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                fontSize: '1.15em'
              }}>
                {activeTicket?.subject}
              </span>
              <span style={{
                marginLeft: 12,
                padding: '2px 10px',
                borderRadius: '8px',
                background: activeTicket?.status === 'Open'
                  ? 'linear-gradient(90deg, #ffe259 0%, #ffa751 100%)'
                  : 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                color: '#222',
                fontWeight: 500,
                fontSize: '0.95em',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}>
                {activeTicket?.status}
              </span>
            </span>
            
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{
          background: '#ffedf0',
          height: 'calc(80vh - 56px)',
          overflowY: 'auto',
          padding: '0',
          borderRadius: '0 0 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 24px rgba(44,62,80,0.10)'
        }}>
          <div
            className="ticket-conversation"
            ref={conversationRef}
            style={{
              flex: 1,
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            {loadingThread ? (
              <div>Loading...</div>
            ) : (
              thread.length > 0 ? (
                thread.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: msg.sender.role === 'admin' ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: '10px'
                    }}
                  >
                    <img
                      src={msg.sender.profilePicture || 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg'}
                      alt={msg.sender.name}
                      width={36}
                      height={36}
                      className="rounded-circle"
                      style={{ objectFit: 'cover', border: '2px solid #ddd' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg'; }}
                    />
                    <div
                      style={{
                        backgroundColor: msg.sender.role === 'admin' ? '#dcf8c6' : 'white',
                        color: '#222',
                        borderRadius: '12px',
                        padding: '10px 16px',
                        maxWidth: '70%',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: 2 }}>{msg.sender.name}</div>
                      <div>{msg.message}</div>
                      {msg.attachment && (
                        <div style={{ marginTop: 8 }}>
                          <a href={msg.attachment} target="_blank" rel="noopener noreferrer">
                            <img
                              src={msg.attachment}
                              alt="attachment"
                              style={{ maxWidth: '180px', maxHeight: '180px', borderRadius: '8px', marginTop: '4px' }}
                            />
                          </a>
                        </div>
                      )}
                      <div style={{
                        fontSize: 12,
                        opacity: 0.7,
                        marginTop: 6,
                        textAlign: 'right'
                      }}>
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No messages found.</div>
              )
            )}
            {showNewMsgTooltip && (
              <div
                style={{
                  position: 'fixed',
                  right: 32,
                  bottom: 32,
                  background: 'linear-gradient(90deg, #ff6a88 0%, #ffb86c 100%)',
                  color: '#fff',
                  padding: '8px 22px',
                  borderRadius: '20px',
                  fontWeight: 600,
                  fontSize: '1em',
                  boxShadow: '0 2px 8px rgba(255,106,136,0.10)',
                  zIndex: 9999,
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={handleNewMsgClick}
              >
                New Message
              </div>
            )}
          </div>
          <div style={{
            padding: '16px',
            background: 'rgba(255,255,255,0.95)',
            borderTop: '1px solid #ddd',
            minHeight: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {activeTicket?.status === 'Open' ? (
              <Form.Group className="mb-0" style={{ width: '100%' }}>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  style={{ borderColor: 'var(--primary)', resize: 'none' }}
                />
                <Button 
                  variant="primary" 
                  className="mt-2"
                  onClick={() => handleReply(activeTicket?.id)}
                  style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)', float: 'right' }}
                >
                  Send Reply
                </Button>
              </Form.Group>
            ) : (
              <div style={{
                width: '100%',
                textAlign: 'center',
                padding: '24px 0',
                background: 'linear-gradient(90deg, #1c4229ff 0%, #1a9982ff 100%)',
                borderRadius: '14px',
                boxShadow: '0 4px 16px rgba(44,62,80,0.10)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                  boxShadow: '0 2px 8px rgba(44,62,80,0.10)'
                }}>
                  <span style={{ fontSize: '2em', color: '#fff' }}>✔️</span>
                </div>
                <div style={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.15em',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 4px rgba(44,62,80,0.10)'
                }}>
                  Ticket has been closed successfully
                </div>
                <div style={{
                  color: '#e0f7fa',
                  fontWeight: 400,
                  fontSize: '1em',
                  marginTop: 2
                }}>
                  No further replies are allowed.
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Tickets;