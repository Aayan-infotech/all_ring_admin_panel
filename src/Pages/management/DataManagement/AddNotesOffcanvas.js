


import React, { useEffect, useState } from 'react';
import { Offcanvas, Form, Button, Spinner, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AddNotesOffcanvas = ({ show, handleClose, classId }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      const response = await axios.get(`http://18.209.91.97:5010/api/notes/getNoteById/${classId}`);
      setNotes(response.data.data ? [response.data.data] : []);

    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    if (show && classId) {
      fetchNotes();
    }
  }, [show, classId]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      if (data.file && data.file[0]) {
        formData.append('uploadFile', data.file[0]);
      }

      const response = await axios.post(
        `http://18.209.91.97:5010/api/notes/addNotes/${classId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      console.log('Notes added successfully:', response.data);
      reset();
      fetchNotes(); // refresh notes table
    } catch (error) {
      console.error('Error adding notes:', error);
    }
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
        <Offcanvas.Title>Add Notes / Instructions</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ backgroundColor: 'var(--accent)', overflowY: 'auto' }}>
        <Form onSubmit={handleSubmit(onSubmit)} className="p-3 rounded shadow-sm mb-4" style={{ backgroundColor: '#fff' }}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
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
            <Form.Label>Description</Form.Label>
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
          <h5 className="mb-3">Existing Notes</h5>
          {loadingNotes ? (
            <Spinner animation="border" size="sm" />
          ) : notes.length > 0 ? (
            <Table striped bordered hover size="sm" responsive>
              <thead style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>File</th>
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
                        <a href={note.uploadFile} target="_blank" rel="noopener noreferrer">
                          View File
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">No notes available.</p>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddNotesOffcanvas;
