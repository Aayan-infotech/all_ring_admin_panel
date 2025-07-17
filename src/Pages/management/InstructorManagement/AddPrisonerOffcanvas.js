

import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button, Spinner, Table, Badge } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddPrisonerOffcanvas = ({ show, handleClose, instructorId, locations, preSelectedLocation }) => {
  const [prisonerName, setPrisonerName] = useState('');
  const [location, setLocation] = useState(preSelectedLocation || ''); // Initialize with preSelectedLocation
  const [locationList, setLocationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prisoners, setPrisoners] = useState([]);
  const [prisonerId, setPrisonerId] = useState('');

  const handleSubmit = async () => {
    try {
      const payload = {
        instructorId,
        prisonerId,
        prisonerName,
        location,
      };

      await axios.post('http://98.82.228.18:5010/api/prisoner/addPrisoner', payload);
      toast.success('Prisoner added successfully');

      // Reset the form fields
      setPrisonerName('');
      setPrisonerId('');
      setLocation(preSelectedLocation || ''); // Reset to instructor's location

      handleClose(); // Close the offcanvas
    } catch (err) {
      toast.error('Failed to add prisoner');
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://98.82.228.18:5010/api/location/getAllLocations');
      const locations = res.data?.data || [];
      const activeLocations = locations.filter(loc => loc.status === 'Active');
      setLocationList(activeLocations);
      
      // If we have a pre-selected location but it's not in the list yet, set it
      if (preSelectedLocation && !activeLocations.some(loc => loc._id === preSelectedLocation)) {
        const preSelectedLoc = locations.find(loc => loc._id === preSelectedLocation);
        if (preSelectedLoc) {
          setLocationList([preSelectedLoc, ...activeLocations]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch locations:", err);
      toast.error("Failed to load locations");
    }
  };

  const fetchPrisoners = async () => {
    if (!instructorId) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://98.82.228.18:5010/api/prisoner/prisonersByInstructor/${instructorId}`);
      setPrisoners(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch prisoners:", err);
      toast.error("No prisoners load ");
      setPrisoners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchLocations();
      fetchPrisoners();
      // Reset form but keep the pre-selected location
      setPrisonerName('');
      setPrisonerId('');
      setLocation(preSelectedLocation || '');
    }
  }, [show, instructorId, preSelectedLocation]);

  const getLocationName = (locationObj) => {
    if (!locationObj) return 'Not assigned';
    return typeof locationObj === 'string' ? locationObj : locationObj.location;
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '400px' }}>
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}>
        <Offcanvas.Title style={{ fontWeight: 'bold' }}>Add Prisoner</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ backgroundColor: 'var(--accent)' }}>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
              Prisoner ID
            </Form.Label>
            <Form.Control
              value={prisonerId}
              onChange={(e) => setPrisonerId(e.target.value)}
              placeholder="Enter Prisoner ID"
              style={{
                borderRadius: '8px',
                border: '1px solid #ccc',
                padding: '10px',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Prisoner Name</Form.Label>
            <Form.Control
              value={prisonerName}
              onChange={(e) => setPrisonerName(e.target.value)}
              placeholder="Enter name"
              style={{
                borderRadius: '8px',
                border: '1px solid #ccc',
                padding: '10px',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Location</Form.Label>
            <Form.Select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                borderRadius: '8px',
                border: '1px solid #ccc',
                padding: '10px',
              }}
            >
              <option value="">Select Location</option>
              {locationList.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.location}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              onClick={handleClose}
              style={{
                backgroundColor: 'var(--secondary)',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                padding: '8px 16px',
                marginRight: '10px',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              style={{
                backgroundColor: 'var(--primary)',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                padding: '8px 16px',
              }}
            >
              Add Prisoner
            </Button>
          </div>

          <div className="mt-4 p-3" style={{ backgroundColor: '#fff', borderRadius: '8px' }}>
            <h5>Existing Prisoners ({prisoners.length})</h5>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading prisoners...</p>
              </div>
            ) : prisoners.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prisoners.map((prisoner, index) => (
                    <tr key={prisoner._id}>
                      <td>{index + 1}</td>
                      <td>{prisoner.prisonerName}</td>
                      <td>{getLocationName(prisoner.location)}</td>
                      <td>
                        <Badge bg={prisoner.status === 'Active' ? 'success' : 'danger'}>
                          {prisoner.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-4">
                <p>No prisoners found for this instructor</p>
              </div>
            )}
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddPrisonerOffcanvas;