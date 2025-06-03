


import React, { useEffect, useState } from 'react';
import { Table, Button, ButtonGroup, Badge, InputGroup, Form, Spinner } from 'react-bootstrap';
import {
  PencilSquare,
  Lock,
  CheckCircleFill,
  XCircleFill,
  Search,
  PlusCircle
} from 'react-bootstrap-icons';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);



const fetchUsers = async () => {
  const token = localStorage.getItem('adminToken'); 
  try {
    setLoading(true);
    const response = await axios.get('http://18.209.91.97:5010/api/admin/getRegister/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data.users); 
  } catch (error) {
    console.error('Error fetching users:', error);
    setUsers([]); 
  } finally {
    setLoading(false);
  }
};
const toggleStatus = async (user) => {
  const token = localStorage.getItem('adminToken');
  const newStatus = user.user_status === 1 ? 2 : 1;
  
  // Optimistic update
  setUsers(prevUsers => 
    prevUsers.map(u => 
      u._id === user._id ? {...u, user_status: newStatus} : u
    )
  );

  try {
    await axios.patch(
      `http://18.209.91.97:5010/api/admin/editUserStatus/${user._id}`,
      { user_status: newStatus },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    // Optional: fetchUsers() to ensure sync with server
  } catch (error) {
    console.error('Failed to update user status:', error);
    // Revert on error
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u._id === user._id ? {...u, user_status: user.user_status} : u
      )
    );
    alert('Failed to toggle status: ' + (error.response?.data?.message || error.message));
  }
};


//   const toggleStatus = async (user) => {
//   const token = localStorage.getItem('adminToken'); 
//   const newStatus = user.user_status === 1 ? 2 : 1;

//   try {
//     await axios.patch(
//       `http://18.209.91.97:5010/api/admin/editUserStatus/${user._id}`,
//       { user_status: newStatus },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`, 
//         },
//       }
//     );
//     fetchUsers(); 
//   } catch (error) {
//     console.error('Failed to update user status:', error.response?.data || error.message);
//     alert('Failed to toggle status: ' + (error.response?.data?.message || error.message));
//   }
// };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)' }}>User Management</h2>
        <Button
          variant="primary"
          style={{
            backgroundColor: 'var(--primary)',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px'
          }}
        >
          <PlusCircle className="me-2" />
          Add New User
        </Button>
      </div>

      <div className="mb-4">
        <InputGroup style={{ maxWidth: '400px' }}>
          <Form.Control
            placeholder="Search users..."
            style={{
              border: '2px solid var(--accent)',
              borderRadius: '8px 0 0 8px'
            }}
          />
          <Button
            variant="primary"
            style={{
              backgroundColor: 'var(--primary)',
              border: 'none',
              borderRadius: '0 8px 8px 0'
            }}
          >
            <Search />
          </Button>
        </InputGroup>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="management-table">
            <thead
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'white'
              }}
            >
              <tr>
                <th>Sr No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.location || 'N/A'}</td>
                  <td>
                    <Badge
                      pill
                      bg={user.user_status === 1 ? 'success' : 'danger'}
                      style={{
                        padding: '8px 12px',
                        fontWeight: '500',
                        backgroundColor: user.user_status === 1 ? 'var(--success)' : 'var(--danger)'
                      }}
                    >
                      {user.user_status === 1 ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <ButtonGroup>
                      <Button
                        variant={user.user_status === 1 ? 'danger' : 'success'}
                        size="sm"
                        onClick={() => toggleStatus(user)}
                        className="d-flex align-items-center me-2"
                        style={{
                          backgroundColor: user.user_status === 1 ? 'var(--danger)' : 'var(--success)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px'
                        }}
                      >
                        {user.user_status === 1 ? <XCircleFill className="me-1" /> : <CheckCircleFill className="me-1" />}
                        {user.user_status === 1 ? 'Block' : 'Activate'}
                      </Button>
                      {/* <Button
                        variant="warning"
                        size="sm"
                        className="d-flex align-items-center me-2"
                        style={{
                          backgroundColor: '#ffc107',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <PencilSquare className="me-1" /> Edit */}
                      {/* </Button> */}
                      <Button
                        variant="info"
                        size="sm"
                        className="d-flex align-items-center"
                        style={{
                          backgroundColor: '#17a2b8',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          color: 'white'
                        }}
                      >
                        <Lock className="me-1" /> Reset
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Users;
