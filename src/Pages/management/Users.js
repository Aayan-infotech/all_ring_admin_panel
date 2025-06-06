


// import React, { useEffect, useState } from 'react';
// import { Table, Button, ButtonGroup, Badge, InputGroup, Form, Spinner } from 'react-bootstrap';
// import {
//   PencilSquare,
//   Lock,
//   CheckCircleFill,
//   XCircleFill,
//   Search,
//   PlusCircle
// } from 'react-bootstrap-icons';
// import axios from 'axios';

// import AddUserOffcanvas from  '../AddUserOffcanvas'
// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

// const [showAddUser, setShowAddUser] = useState(false);

// const handleShowAddUser = () => setShowAddUser(true);
// const handleCloseAddUser = () => setShowAddUser(false);


// const fetchUsers = async () => {
//   const token = localStorage.getItem('adminToken'); 
//   try {
//     setLoading(true);
//     const response = await axios.get('http://18.209.91.97:5010/api/admin/getRegister/user', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     setUsers(response.data.users); 
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     setUsers([]); 
//   } finally {
//     setLoading(false);
//   }
// };
// const toggleStatus = async (user) => {
//   const token = localStorage.getItem('adminToken');
//   const newStatus = user.user_status === 1 ? 2 : 1;
  
  
//   setUsers(prevUsers => 
//     prevUsers.map(u => 
//       u._id === user._id ? {...u, user_status: newStatus} : u
//     )
//   );

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
  
//   } catch (error) {
//     console.error('Failed to update user status:', error);
   
//     setUsers(prevUsers => 
//       prevUsers.map(u => 
//         u._id === user._id ? {...u, user_status: user.user_status} : u
//       )
//     );
//     alert('Failed to toggle status: ' + (error.response?.data?.message || error.message));
//   }
// };


//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 style={{ color: 'var(--secondary)' }}>User Management</h2>
       
//         <Button
//   variant="primary"
//   onClick={handleShowAddUser}
//   style={{
//     backgroundColor: 'var(--primary)',
//     border: 'none',
//     padding: '10px 20px',
//     borderRadius: '8px'
//   }}
// >
//   <PlusCircle className="me-2" />
//   Add New User
// </Button>

//       </div>

//       <div className="mb-4">
//         <InputGroup style={{ maxWidth: '400px' }}>
//           <Form.Control
//             placeholder="Search users..."
//             style={{
//               border: '2px solid var(--accent)',
//               borderRadius: '8px 0 0 8px'
//             }}
//           />
//           <Button
//             variant="primary"
//             style={{
//               backgroundColor: 'var(--primary)',
//               border: 'none',
//               borderRadius: '0 8px 8px 0'
//             }}
//           >
//             <Search />
//           </Button>
//         </InputGroup>
//       </div>

//       {loading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : (
//         <div className="table-responsive">
//           <Table striped bordered hover className="management-table">
//             <thead
//               style={{
//                 backgroundColor: 'var(--secondary)',
//                 color: 'white'
//               }}
//             >
//               <tr>
//                 <th>Sr No</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Location</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user, index) => (
//                 <tr key={user._id}>
//                   <td>{index + 1}</td>
//                   <td>{user.name}</td>
//                   <td>{user.email}</td>
//                   <td>{user.location || 'N/A'}</td>
//                   <td>
//                     <Badge
//                       pill
//                       bg={user.user_status === 1 ? 'success' : 'danger'}
//                       style={{
//                         padding: '8px 12px',
//                         fontWeight: '500',
//                         backgroundColor: user.user_status === 1 ? 'var(--success)' : 'var(--danger)'
//                       }}
//                     >
//                       {user.user_status === 1 ? 'Active' : 'Inactive'}
//                     </Badge>
//                   </td>
//                   <td>
//                     <ButtonGroup>
//                       <Button
//                         variant={user.user_status === 1 ? 'danger' : 'success'}
//                         size="sm"
//                         onClick={() => toggleStatus(user)}
//                         className="d-flex align-items-center me-2"
//                         style={{
//                           backgroundColor: user.user_status === 1 ? 'var(--danger)' : 'var(--success)',
//                           border: 'none',
//                           borderRadius: '6px',
//                           padding: '6px 12px'
//                         }}
//                       >
//                         {user.user_status === 1 ? <XCircleFill className="me-1" /> : <CheckCircleFill className="me-1" />}
//                         {user.user_status === 1 ? 'Block' : 'Activate'}
//                       </Button>
//                       {/* <Button
//                         variant="warning"
//                         size="sm"
//                         className="d-flex align-items-center me-2"
//                         style={{
//                           backgroundColor: '#ffc107',
//                           border: 'none',
//                           borderRadius: '6px',
//                           padding: '6px 12px',
//                           color: 'var(--text-primary)'
//                         }}
//                       >
//                         <PencilSquare className="me-1" /> Edit */}
//                       {/* </Button> */}
//                       <Button
//                         variant="info"
//                         size="sm"
//                         className="d-flex align-items-center"
//                         style={{
//                           backgroundColor: '#17a2b8',
//                           border: 'none',
//                           borderRadius: '6px',
//                           padding: '6px 12px',
//                           color: 'white'
//                         }}
//                       >
//                         <Lock className="me-1" /> Reset
//                       </Button>
//                     </ButtonGroup>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       )}
//       <AddUserOffcanvas
//   show={showAddUser}
//   handleClose={handleCloseAddUser}
//   onUserAdded={fetchUsers}
// />

//     </div>
//   );
// };

// export default Users;


import React, { useEffect, useState } from 'react';
import { Table, Button, ButtonGroup, Badge, InputGroup, Form, Spinner, Row, Col } from 'react-bootstrap';
import {
  PencilSquare,
  Lock,
  CheckCircleFill,
  XCircleFill,
  Search,
  PlusCircle
} from 'react-bootstrap-icons';
import axios from 'axios';

import AddUserOffcanvas from  '../AddUserOffcanvas'

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New filter states
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive
  const [filterRole, setFilterRole] = useState('all'); // all, user, mentor, instructor

  const handleShowAddUser = () => setShowAddUser(true);
  const handleCloseAddUser = () => setShowAddUser(false);

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
    
    } catch (error) {
      console.error('Failed to update user status:', error);
     
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u._id === user._id ? {...u, user_status: user.user_status} : u
        )
      );
      alert('Failed to toggle status: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter logic
  const filteredUsers = users.filter(user => {
    // Filter by Location
    if (filterLocation && !user.location?.toLowerCase().includes(filterLocation.toLowerCase())) {
      return false;
    }

    // Filter by Status
    if (filterStatus !== 'all') {
      if (filterStatus === 'active' && user.user_status !== 1) return false;
      if (filterStatus === 'inactive' && user.user_status !== 2) return false;
    }

    // Filter by Role
    // Assuming user.role is a string like 'user', 'mentor', 'instructor'
    // Adjust if your actual data structure is different
    if (filterRole !== 'all') {
      if (!user.role || user.role.toLowerCase() !== filterRole) {
        return false;
      }
    }

    // Optional: You can keep searchTerm filter here as well on name or email
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (
        !user.name?.toLowerCase().includes(term) && 
        !user.email?.toLowerCase().includes(term)
      ) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--secondary)' }}>User Management</h2>
       
        <Button
          variant="primary"
          onClick={handleShowAddUser}
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

      {/* Filters row */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Control
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              border: '2px solid var(--accent)',
              borderRadius: '8px'
            }}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            placeholder="Filter by Location"
            value={filterLocation}
            onChange={e => setFilterLocation(e.target.value)}
            style={{
              border: '2px solid var(--accent)',
              borderRadius: '8px'
            }}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              border: '2px solid var(--accent)',
              borderRadius: '8px'
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            style={{
              border: '2px solid var(--accent)',
              borderRadius: '8px'
            }}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="mentor">Mentor</option>
            <option value="instructor">Instructor</option>
          </Form.Select>
        </Col>
      </Row>

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
                <th>Role</th> {/* Added Role column */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.location || 'N/A'}</td>
                    <td>{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}</td>
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
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
      <AddUserOffcanvas
        show={showAddUser}
        handleClose={handleCloseAddUser}
        onUserAdded={fetchUsers}
      />
    </div>
  );
};

export default Users;
