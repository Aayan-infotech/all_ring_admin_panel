import React from 'react';
import { Offcanvas, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const AddNotesOffcanvas = ({ show, handleClose, onSave }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = (data) => {
    onSave(data);
    reset();
    handleClose();
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
        <Offcanvas.Title>Add Notes / Instructions</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ backgroundColor: 'var(--accent)' }}>
        <Form onSubmit={handleSubmit(onSubmit)} className="p-3 rounded shadow-sm" style={{ backgroundColor: '#fff' }}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control {...register('title', { required: 'Title is required' })} />
            {errors.title && <span className="text-danger small">{errors.title.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload File (PDF / Image)</Form.Label>
            <Form.Control type="file" accept="application/pdf,image/*" {...register('file')} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Description (Rich Text)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <span className="text-danger small">{errors.description.message}</span>}
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" disabled={isSubmitting} style={{ backgroundColor: 'var(--primary)', border: 'none' }}>
              {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Save Notes'}
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddNotesOffcanvas;
