


import React, { useState } from 'react';
import { Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import { ReplyFill, XCircleFill } from 'react-bootstrap-icons';

const Tickets = () => {
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  // Sample data - replace with your actual data source
  const [tickets, setTickets] = useState([
    {
      id: 1,
      subject: 'Login issues',
      name: 'John Doe',
      userType: 'Participant',
      location: 'New York',
      status: 'Open',
      messages: [
        { sender: 'John Doe', text: 'I cannot login to my account', time: '2023-05-01 10:00' },
        { sender: 'Support', text: 'Have you tried resetting your password?', time: '2023-05-01 10:30' }
      ]
    },
    {
      id: 2,
      subject: 'Payment problem',
      name: 'Jane Smith',
      userType: 'Mentor',
      location: 'Chicago',
      status: 'Open',
      messages: [
        { sender: 'Jane Smith', text: 'My payment was not processed', time: '2023-05-02 09:00' }
      ]
    }
  ]);

  const handleReply = (ticketId) => {
    if (!replyText.trim()) return;
    
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          messages: [
            ...ticket.messages,
            { sender: 'Support', text: replyText, time: new Date().toISOString() }
          ]
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    setReplyText('');
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

  return (
    <div className="support-tickets">
      <h2 style={{ color: 'var(--secondary)' }}>Support Tickets</h2>
      
      <Table striped bordered hover responsive>
        <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <tr>
            <th>Sr.no</th>
            <th>Subject</th>
            <th>Name</th>
            <th>User Type</th>
            <th>Location</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr key={ticket.id}>
              <td>{index + 1}</td>
              <td>{ticket.subject}</td>
              <td>{ticket.name}</td>
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
                  onClick={() => setActiveTicket(ticket)}
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
        onHide={() => setActiveTicket(null)}
        size="lg"
      >
        <Modal.Header 
          closeButton 
          style={{ backgroundColor: 'var(--secondary)', color: 'white' }}
        >
          <Modal.Title>
            {activeTicket?.subject} - {activeTicket?.status}
            {activeTicket?.status === 'Open' && (
              <Button 
                variant="danger" 
                size="sm" 
                className="ms-2"
                onClick={() => closeTicket(activeTicket.id)}
                style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}
              >
                <XCircleFill /> Close Ticket
              </Button>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--accent)' }}>
          <div className="ticket-conversation">
            {activeTicket?.messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.sender === 'Support' ? 'support-message' : 'user-message'}`}
                style={{
                  backgroundColor: msg.sender === 'Support' ? 'var(--secondary)' : 'white',
                  color: msg.sender === 'Support' ? 'white' : 'var(--text-primary)'
                }}
              >
                <strong>{msg.sender}</strong>
                <small className="ms-2" style={{ opacity: 0.7 }}>
                  {new Date(msg.time).toLocaleString()}
                </small>
                <div>{msg.text}</div>
              </div>
            ))}
          </div>
          
          <Form.Group className="mt-3">
            <Form.Control
              as="textarea"
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              style={{ borderColor: 'var(--primary)' }}
            />
            <Button 
              variant="primary" 
              className="mt-2"
              onClick={() => handleReply(activeTicket?.id)}
              style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}
            >
              Send Reply
            </Button>
          </Form.Group>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Tickets;