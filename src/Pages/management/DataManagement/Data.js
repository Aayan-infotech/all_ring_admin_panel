


import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Button, Form, Offcanvas, Table, Spinner, Modal, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { XCircleFill, CheckCircleFill } from 'react-bootstrap-icons';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const API_BASE = 'http://18.209.91.97:5010/api/location';

// Map settings
const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 20.5937, // Default center at India
  lng: 78.9629
};

function loadGoogleMapsScript({ apiKey }) {
  if (window._mapsPromise) return window._mapsPromise;
  window._mapsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-google-maps]");
    if (existing) return resolve(window.google.maps);

    const script = document.createElement("script");
    script.setAttribute("data-google-maps", "true");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error("Google Maps load failed"));
    document.head.appendChild(script);
  });
  return window._mapsPromise;
}

const Data = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [formData, setFormData] = useState({ location: '', latitude: '', longitude: '' });
  const [dataList, setDataList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteService = useRef(null);
  const geocoderService = useRef(null);
  const inputRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAklz8Mhdgjy3jrxLjp6BJUZE83yYFR8PY" || '',
    libraries: ['places']
  });

  useEffect(() => {
    if (isLoaded) {
      loadGoogleMapsScript({ apiKey: "AIzaSyAklz8Mhdgjy3jrxLjp6BJUZE83yYFR8PY" }).then((maps) => {
        autocompleteService.current = new maps.places.AutocompleteService();
        geocoderService.current = new maps.Geocoder();
      });
    }
  }, [isLoaded]);

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getAllLocations`);
      setDataList(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching locations', err);
      toast.error('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleShow = () => {
    setFormData({ location: '', latitude: '', longitude: '' });
    setEditId(null);
    setShowCanvas(true);
    setSuggestions([]);
    setShowSuggestions(false);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const handleClose = () => {
    setShowCanvas(false);
    setFormData({ location: '', latitude: '', longitude: '' });
    setEditId(null);
    setSelectedLocation(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
    
    setSelectedLocation({
      lat: lat,
      lng: lng
    });
    
    // Reverse geocode to get address
    if (geocoderService.current) {
      geocoderService.current.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setFormData(prev => ({
            ...prev,
            location: results[0].formatted_address
          }));
        }
      });
    }
  }, []);

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, location: value }));
    
    if (!value || !autocompleteService.current) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    autocompleteService.current.getPlacePredictions(
      { input: value, types: ['geocode'] },
      (results, status) => {
        if (status === "OK") {
          setSuggestions(results || []);
          setShowSuggestions(results && results.length > 0);
        }
      }
    );
  };

  const handleSelectSuggestion = (place) => {
    geocoderService.current.geocode({ placeId: place.place_id }, (results, status) => {
      if (status === "OK" && results[0]?.geometry?.location) {
        const loc = results[0].geometry.location;
        const lat = loc.lat();
        const lng = loc.lng();
        
        setFormData({
          location: results[0].formatted_address,
          latitude: lat,
          longitude: lng
        });
        
        setSelectedLocation({ lat, lng });
        
        // Pan map to selected location
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
      }
    });
    
    setShowSuggestions(false);
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`${API_BASE}/changeStatus/${id}`);
      toast.success('Status updated successfully!');
      await fetchLocations();
    } catch (err) {
      console.error('Error toggling status', err);
      toast.error('Failed to update status');
    }
  };

  const handleAddOrUpdate = async () => {
    try {
      if (!formData.location) {
        return toast.error('Please enter a location');
      }

      if (editId) {
        await axios.put(`${API_BASE}/updateLocation/${editId}`, formData);
        toast.success('Location updated successfully!');
      } else {
        await axios.post(`${API_BASE}/addLocation`, formData);
        toast.success('Location added successfully!');
      }
      await fetchLocations();
      handleClose();
    } catch (err) {
      console.error('Error saving location', err);
      toast.error(err.response?.data?.message || 'Failed to save location');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      location: item.location,
      latitude: item.latitude || '',
      longitude: item.longitude || ''
    });
    setEditId(item._id);
    setSelectedLocation(item.latitude && item.longitude ? {
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude)
    } : null);
    setShowCanvas(true);
  };

  const confirmDelete = (item) => {
    setItemToDelete(item._id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/deleteLocation/${itemToDelete}`);
      toast.success('Location deleted successfully!');
      await fetchLocations();
    } catch (err) {
      console.error('Error deleting location', err);
      toast.error('Failed to delete location');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="mb-4">
        <Breadcrumb style={{ backgroundColor: 'var(--light)', padding: '0.75rem 1rem', borderRadius: '0.375rem' }}>
          <Breadcrumb.Item href="/dashboard" style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-home me-2"></i> Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item active style={{ color: 'var(--primary)', fontWeight: '500', display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-map-marker-alt me-2"></i> Location Management
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ color: 'var(--secondary)' }}>Location Management</h4>
        <Button onClick={handleShow} style={{ background: 'var(--primary)', border: 'none' }}>
          Add Location
        </Button>
      </div>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <>
      
          <Table bordered hover responsive>
            <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
              <tr>
                <th>#</th>
                <th>Location</th>
                {/* <th>Latitude</th>
                <th>Longitude</th> */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataList.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.location}</td>
                  {/* <td>{item.latitude || '-'}</td>
                  <td>{item.longitude || '-'}</td> */}
                  <td>
                    <span className={`badge ${item.status === 'Blocked' ? 'bg-danger' : 'bg-success'}`}>
                      {item.status}
                    </span>
                  </td>
                  {/* <td>
                    <div className="d-flex gap-2 align-items-center">
                      <Button size="sm" variant="info" onClick={() => handleEdit(item)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => confirmDelete(item)}>Delete</Button>
                      {item.status === 'Active' ? (
                        <XCircleFill
                          className="text-danger"
                          style={{ cursor: 'pointer', fontSize: '1.2rem', marginLeft: '10px' }}
                          onClick={() => handleToggleStatus(item._id)}
                          title="Block this location"
                        />
                      ) : (
                        <CheckCircleFill
                          className="text-success"
                          style={{ cursor: 'pointer', fontSize: '1.2rem', marginLeft: '10px' }}
                          onClick={() => handleToggleStatus(item._id)}
                          title="Activate this location"
                        />
                      )}
                    </div>
                  </td> */}
                  <td>
  <div className="d-flex gap-2 align-items-center">
    <OverlayTrigger placement="top" overlay={<Tooltip>Edit Location</Tooltip>}>
      <Button size="sm" variant="info" onClick={() => handleEdit(item)}>
        Edit
      </Button>
    </OverlayTrigger>

    <OverlayTrigger placement="top" overlay={<Tooltip>Delete Location</Tooltip>}>
      <Button size="sm" variant="danger" onClick={() => confirmDelete(item)}>
        Delete
      </Button>
    </OverlayTrigger>

    {item.status === 'Active' ? (
      <OverlayTrigger placement="top" overlay={<Tooltip>Block this location</Tooltip>}>
        <XCircleFill
          className="text-danger"
          style={{ cursor: 'pointer', fontSize: '1.2rem', marginLeft: '10px' }}
          onClick={() => handleToggleStatus(item._id)}
        />
      </OverlayTrigger>
    ) : (
      <OverlayTrigger placement="top" overlay={<Tooltip>Activate this location</Tooltip>}>
        <CheckCircleFill
          className="text-success"
          style={{ cursor: 'pointer', fontSize: '1.2rem', marginLeft: '10px' }}
          onClick={() => handleToggleStatus(item._id)}
        />
      </OverlayTrigger>
    )}
  </div>
</td>

                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* Offcanvas Form */}
      <Offcanvas show={showCanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton style={{ background: 'var(--secondary)', color: 'white' }}>
          <Offcanvas.Title>{editId ? 'Edit Location' : 'Add Location'}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ background: 'var(--accent)' }}>
          <div className="p-3 bg-white rounded shadow-sm">
            <Form>
              <Form.Group className="mb-4" style={{ position: 'relative' }}>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.location}
                  onChange={handleAddressChange}
                  placeholder="Search for a location"
                  ref={inputRef}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul style={{
                    position: 'absolute',
                    zIndex: 1000,
                    width: '100%',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    listStyle: 'none',
                    padding: 0,
                    marginTop: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {suggestions.map((place) => (
                      <li
                        key={place.place_id}
                        onClick={() => handleSelectSuggestion(place)}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                      >
                        {place.description}
                      </li>
                    ))}
                  </ul>
                )}
              </Form.Group>

           

           

              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={handleClose} style={{ flex: 1 }}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleAddOrUpdate} 
                  style={{ flex: 1, background: 'var(--primary)', border: 'none' }}
                  disabled={!formData.location || !formData.latitude || !formData.longitude}
                >
                  {editId ? 'Update' : 'Save'}
                </Button>
              </div>
            </Form>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this location? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Data;