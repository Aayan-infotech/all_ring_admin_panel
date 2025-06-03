// import React, { useState } from 'react';
// import { Modal, Button, Form, Spinner } from 'react-bootstrap';
// import axios from 'axios';

// const AddUserModal = ({ show, handleClose, onUserAdded }) => {
//   const [formData, setFormData] = useState({ name: '', email: '', location: '' });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('adminToken');

//     try {
//       setLoading(true);
//       await axios.post('http://18.209.91.97:5010/api/admin/registerUser', formData, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         }
//       });

//       onUserAdded();
//       handleClose();
//     } catch (error) {
//       alert('Failed to add user: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={handleClose} centered>
//       <Modal.Header
//         closeButton
//         style={{
//           backgroundColor: 'var(--primary-blue)',
//           color: 'white',
//           borderBottom: 'none',
//         }}
//       >
//         <Modal.Title style={{ fontWeight: '600' }}>➕ Add New User</Modal.Title>
//       </Modal.Header>

//       <Form onSubmit={handleSubmit}>
//         <Modal.Body
//           style={{
//             backgroundColor: 'var(--light-bg)',
//             padding: '30px',
//             boxShadow: 'inset 0 0 8px rgba(0,0,0,0.05)',
//           }}
//         >
//           <p className="mb-4" style={{ color: 'gray', fontSize: '14px' }}>
//             Please fill in the user details below:
//           </p>

//           {['name', 'email', 'location'].map((field, index) => (
//             <Form.Group key={field} className="mb-4">
//               <Form.Label style={{ color: 'var(--dark-text)', fontWeight: '600' }}>
//                 {field.charAt(0).toUpperCase() + field.slice(1)}
//               </Form.Label>
//               <Form.Control
//                 name={field}
//                 type={field === 'email' ? 'email' : 'text'}
//                 value={formData[field]}
//                 onChange={handleChange}
//                 placeholder={`Enter ${field}`}
//                 required={field !== 'location'}
//                 style={{
//                   borderRadius: '10px',
//                   padding: '12px',
//                   border: '1px solid var(--soft-gray)',
//                   transition: '0.2s ease-in-out',
//                   boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
//                 }}
//                 onFocus={(e) => e.target.style.border = '1px solid var(--primary-blue)'}
//                 onBlur={(e) => e.target.style.border = '1px solid var(--soft-gray)'}
//               />
//             </Form.Group>
//           ))}
//         </Modal.Body>

//         <Modal.Footer style={{ backgroundColor: 'var(--soft-gray)', borderTop: 'none' }}>
//           <Button
//             variant="secondary"
//             onClick={handleClose}
//             style={{
//               borderRadius: '8px',
//               padding: '10px 20px',
//               fontWeight: 500,
//               backgroundColor: '#adb5bd',
//               border: 'none',
//               transition: '0.2s ease-in-out',
//             }}
//           >
//             Cancel
//           </Button>

//           <Button
//             type="submit"
//             disabled={loading}
//             style={{
//               backgroundColor: 'var(--primary-blue)',
//               border: 'none',
//               borderRadius: '8px',
//               padding: '10px 25px',
//               fontWeight: '600',
//               color: 'white',
//               boxShadow: '0 4px 10px rgba(0, 81, 255, 0.2)',
//               transition: 'background-color 0.3s ease',
//             }}
//             onMouseEnter={(e) => e.target.style.backgroundColor = '#003dd6'}
//             onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-blue)'}
//           >
//             {loading ? <Spinner animation="border" size="sm" /> : 'Add User'}
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// };

// export default AddUserModal;
