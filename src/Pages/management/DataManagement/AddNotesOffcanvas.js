


// import React, { useEffect, useState } from 'react';
// import { Offcanvas, Form, Button, Spinner, Table } from 'react-bootstrap';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import API_BASE_URL from '../../../config/api';

// const AddNotesOffcanvas = ({ show, handleClose, classId }) => {
//   const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
//   const [notes, setNotes] = useState([]);
//   const [loadingNotes, setLoadingNotes] = useState(false);

//   const fetchNotes = async () => {
//     try {
//       setLoadingNotes(true);
//       const response = await axios.get(`${API_BASE_URL}/api/notes/getNoteById/${classId}`);
//       setNotes(response.data.data ? [response.data.data] : []);

//     } catch (error) {
//       console.error('Error fetching notes:', error);
//     } finally {
//       setLoadingNotes(false);
//     }
//   };

//   useEffect(() => {
//     if (show && classId) {
//       fetchNotes();
//     }
//   }, [show, classId]);

//   const onSubmit = async (data) => {
//     try {
//       const formData = new FormData();
//       formData.append('title', data.title);
//       formData.append('description', data.description);
//       if (data.file && data.file[0]) {
//         formData.append('uploadFile', data.file[0]);
//       }

//       const response = await axios.post(
//         `${API_BASE_URL}/api/notes/addNotes/${classId}`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           }
//         }
//       );

//       console.log('Notes added successfully:', response.data);
//       reset();
//       fetchNotes(); 
//     } catch (error) {
//       console.error('Error adding notes:', error);
//     }
//   };

//   return (
//     <Offcanvas show={show} onHide={handleClose} placement="end">
//       <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
//         <Offcanvas.Title>Add Notes / Instructions</Offcanvas.Title>
//       </Offcanvas.Header>
//       <Offcanvas.Body style={{ backgroundColor: 'var(--accent)', overflowY: 'auto' }}>
//         <Form onSubmit={handleSubmit(onSubmit)} className="p-3 rounded shadow-sm mb-4" style={{ backgroundColor: '#fff' }}>
//           <Form.Group className="mb-3">
//             <Form.Label>Title</Form.Label>
//             <Form.Control 
//               type="text"
//               {...register('title', { required: 'Title is required' })} 
//             />
//             {errors.title && <span className="text-danger small">{errors.title.message}</span>}
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Upload File (PDF / Image)</Form.Label>
//             <Form.Control 
//               type="file" 
//               accept="application/pdf,image/*" 
//               {...register('file')} 
//             />
//           </Form.Group>

//           <Form.Group className="mb-4">
//             <Form.Label>Description</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               {...register('description', { required: 'Description is required' })}
//             />
//             {errors.description && <span className="text-danger small">{errors.description.message}</span>}
//           </Form.Group>

//           <div className="d-grid">
//             <Button 
//               type="submit" 
//               disabled={isSubmitting} 
//               style={{ backgroundColor: 'var(--primary)', border: 'none' }}
//             >
//               {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Save Notes'}
//             </Button>
//           </div>
//         </Form>

//         <div className="mt-4">
//           <h5 className="mb-3">Existing Notes</h5>
//           {loadingNotes ? (
//             <Spinner animation="border" size="sm" />
//           ) : notes.length > 0 ? (
//             <Table striped bordered hover size="sm" responsive>
//               <thead style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}>
//                 <tr>
//                   <th>#</th>
//                   <th>Title</th>
//                   <th>Description</th>
//                   <th>File</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {notes.map((note, index) => (
//                   <tr key={note._id || index}>
//                     <td>{index + 1}</td>
//                     <td>{note.title}</td>
//                     <td>{note.description}</td>
//                     <td>
//                       {note.uploadFile ? (
//                         <a href={note.uploadFile} target="_blank" rel="noopener noreferrer">
//                           View File
//                         </a>
//                       ) : (
//                         'N/A'
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           ) : (
//             <p className="text-muted">No notes available.</p>
//           )}
//         </div>
//       </Offcanvas.Body>
//     </Offcanvas>
//   );
// };

// export default AddNotesOffcanvas;
import React, { useEffect, useState } from 'react';
import { Offcanvas, Form, Button, Spinner, Table, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import API_BASE_URL from '../../../config/api';

const AddNotesOffcanvas = ({ show, handleClose, classId }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [error, setError] = useState('');

  const fetchNotes = async () => {
    if (!classId) return;
    
    try {
      setLoadingNotes(true);
      setError('');
      
      // First try the specific endpoint
      try {
        const response = await axios.get(`${API_BASE_URL}/api/notes/getNoteById/${classId}`);
        
        // Handle different response structures
        if (response.data.success) {
          setNotes(response.data.data ? [response.data.data] : []);
        } else if (response.data.data) {
          setNotes([response.data.data]);
        } else {
          setNotes([]);
        }
        
        return;
      } catch (apiError) {
        console.log('Specific endpoint failed, trying fallback');
      }
      
      // Fallback: get all notes and filter by classId
      const allNotesResponse = await axios.get(`${API_BASE_URL}/api/notes/getAllNotes`);
      
      if (allNotesResponse.data.success) {
        // Filter notes by classId (handle both string and object formats)
        const classNotes = allNotesResponse.data.data.filter(note => {
          return note.classId === classId || 
                 note.classId?._id === classId || 
                 note.classDetails?._id === classId;
        });
        setNotes(classNotes);
      } else {
        setNotes([]);
        setError('No notes found for this class');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to load notes');
      setNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    if (show && classId) {
      fetchNotes();
      reset();
    } else {
      setNotes([]);
      setError('');
    }
  }, [show, classId]);

  const onSubmit = async (data) => {
    if (!classId) {
      setError('No class selected');
      return;
    }
    
    try {
      setError('');
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('classId', classId); // Explicitly add classId to form data
      
      if (data.file && data.file[0]) {
        formData.append('uploadFile', data.file[0]);
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/notes/addNotes/${classId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data.success) {
        console.log('Notes added successfully:', response.data);
        reset();
        fetchNotes();
      } else {
        setError('Failed to add notes: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding notes:', error);
      setError('Failed to add notes. Please try again.');
    }
  };

  // const handleDeleteNote = async (noteId) => {
  //   if (!window.confirm('Are you sure you want to delete this note?')) return;
    
  //   try {
  //     await axios.delete(`${API_BASE_URL}/api/notes/deleteNote/${noteId}`);
  //     fetchNotes(); // Refresh the notes list after deletion
  //   } catch (error) {
  //     console.error('Error deleting note:', error);
  //     setError('Failed to delete note');
  //   }
  // };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" size="lg">
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
        <Offcanvas.Title>Add Notes / Instructions</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ backgroundColor: 'var(--accent)', overflowY: 'auto' }}>
        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        
        <Form onSubmit={handleSubmit(onSubmit)} className="p-3 rounded shadow-sm mb-4" style={{ backgroundColor: '#fff' }}>
          <Form.Group className="mb-3">
            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
            <Form.Control 
              type="text"
              {...register('title', { required: 'Title is required' })} 
            />
            {errors.title && <span className="text-danger small">{errors.title.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload File (PDF / Image)</Form.Label>
            <Form.Control 
              type="file" 
              accept="application/pdf,image/*" 
              {...register('file')} 
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <span className="text-danger small">{errors.description.message}</span>}
          </Form.Group>

          <div className="d-grid">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              style={{ backgroundColor: 'var(--primary)', border: 'none' }}
            >
              {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Save Notes'}
            </Button>
          </div>
        </Form>

        <div className="mt-4">
          <h5 className="mb-3">Existing Notes for This Class</h5>
          {loadingNotes ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p className="mt-2">Loading notes...</p>
            </div>
          ) : notes.length > 0 ? (
            <Table striped bordered hover size="sm" responsive>
              <thead style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>File</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {notes.map((note, index) => (
                  <tr key={note._id || index}>
                    <td>{index + 1}</td>
                    <td>{note.title}</td>
                    <td>{note.description}</td>
                    <td>
                      {note.uploadFile ? (
                        <a 
                          href={note.uploadFile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          View File
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    {/* <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteNote(note._id)}
                      >
                        Delete
                      </Button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted text-center">No notes available for this class.</p>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddNotesOffcanvas;