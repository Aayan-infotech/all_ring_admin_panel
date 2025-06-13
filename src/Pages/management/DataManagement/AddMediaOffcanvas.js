

import React from 'react';
import { Offcanvas, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddMediaOffcanvas = ({ show, handleClose, classId }) => {
  const { 
    register, 
    handleSubmit, 
    watch, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm();

 const onSubmit = async (data) => {
  try {
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
        formData.append('title', data.title);
    formData.append('Description', data.description); // Note capital D
    
    if (data.uploadVideo?.[0]) {
      formData.append('uploadVideo', data.uploadVideo[0]);
    }
    if (data.uploadLink) {
      formData.append('uploadLink', data.uploadLink);
    }

    const response = await axios.post(
      `http://18.209.91.97:5010/api/mediaAdmin/addMedia/${classId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    toast.success('Media added successfully!');
    reset();
    handleClose();
  } catch (error) {
    console.error('Error adding media:', error);
    toast.error(error.response?.data?.message || 'Failed to add media');
  }
};
  const validateMediaSource = () => {
    const videoFile = watch('uploadVideo')?.[0];
    const youtubeLink = watch('uploadLink');
    return !!videoFile || !!youtubeLink || 'Either video file or YouTube link is required';
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
        <Offcanvas.Title>Add Media</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ backgroundColor: 'var(--accent)' }}>
        <Form onSubmit={handleSubmit(onSubmit)} className="p-3 rounded shadow-sm" style={{ backgroundColor: '#fff' }}>
          {/* Title Field - Required */}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control 
              {...register('title', { required: 'Title is required' })} 
            />
            {errors.title && <span className="text-danger small">{errors.title.message}</span>}
          </Form.Group>

          {/* Description Field - Required */}
          <Form.Group className="mb-3">
            <Form.Label>Description (Max 100 chars)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              maxLength={100}
              {...register('Description', { 
                required: 'Description is required',
                maxLength: {
                  value: 100,
                  message: 'Description cannot exceed 100 characters'
                }
              })}
            />
            {errors.description && <span className="text-danger small">{errors.description.message}</span>}
          </Form.Group>

          {/* Video Upload Field */}
          <Form.Group className="mb-3">
            <Form.Label>Upload Video (Max 2 minutes)</Form.Label>
            <Form.Control 
              type="file" 
              accept="video/*" 
              {...register('uploadVideo', {
                validate: validateMediaSource
              })} 
            />
          </Form.Group>

          {/* YouTube Link Field */}
          <Form.Group className="mb-4">
            <Form.Label>OR YouTube Video Link</Form.Label>
            <Form.Control 
              type="url" 
              placeholder="YouTube Link" 
              {...register('uploadLink', {
                validate: validateMediaSource
              })} 
            />
            {(errors.uploadVideo || errors.uploadLink) && (
              <span className="text-danger small">
                {errors.uploadVideo?.message || errors.uploadLink?.message}
              </span>
            )}
            <Form.Text className="text-muted">
              Please provide either a video file or YouTube link
            </Form.Text>
          </Form.Group>

          <div className="d-grid">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              style={{ backgroundColor: 'var(--primary)', border: 'none' }}
            >
              {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Save Media'}
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddMediaOffcanvas;