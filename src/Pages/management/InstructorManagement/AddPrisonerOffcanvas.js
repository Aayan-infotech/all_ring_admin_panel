// import React, { useState, useEffect } from 'react';
// import { Offcanvas, Form, Button } from 'react-bootstrap';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const AddPrisonerOffcanvas = ({ show, handleClose, instructorId }) => {
//   const [prisonerName, setPrisonerName] = useState('');
//   const [location, setLocation] = useState('');
//   const [locationList, setLocationList] = useState([]);

//   const handleSubmit = async () => {
//     try {
//       const payload = {
//         instructorId,
//         prisonerName,
//         location,
//       };
//       await axios.post('http://18.209.91.97:5010/api/prisoner/addPrisoner', payload);
//       toast.success('Prisoner added successfully');
//       handleClose();
//       setPrisonerName('');
//       setLocation('');
//     } catch (err) {
//       toast.error('Failed to add prisoner');
//     }
//   };

//   const fetchLocations = async () => {
//     try {
//       const res = await axios.get('http://18.209.91.97:5010/api/location/getAllLocations');
//       const locations = res.data?.data || [];
//       const activeLocations = locations.filter(loc => loc.status === 'Active');
//       setLocationList(activeLocations);
//     } catch (err) {
//       console.error("Failed to fetch locations:", err);
//       toast.error("Failed to load locations");
//     }
//   };

//   useEffect(() => {
//     if (show) {
//       fetchLocations();
//     }
//   }, [show]);

//   return (
//     <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '400px' }}>
//       <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}>
//         <Offcanvas.Title style={{ fontWeight: 'bold' }}>Add Prisoner</Offcanvas.Title>
//       </Offcanvas.Header>
//       <Offcanvas.Body style={{ backgroundColor: 'var(--accent)' }}>
//         <Form>
//           <Form.Group className="mb-4">
//             <Form.Label style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Prisoner Name</Form.Label>
//             <Form.Control
//               value={prisonerName}
//               onChange={(e) => setPrisonerName(e.target.value)}
//               placeholder="Enter name"
//               style={{
//                 borderRadius: '8px',
//                 border: '1px solid #ccc',
//                 padding: '10px',
//               }}
//             />
//           </Form.Group>
//           <Form.Group className="mb-4">
//             <Form.Label style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Location</Form.Label>
//             <Form.Select
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               style={{
//                 borderRadius: '8px',
//                 border: '1px solid #ccc',
//                 padding: '10px',
//               }}
//             >
//               <option value="">Select Location</option>
//               {locationList.map((loc) => (
//                 <option key={loc._id} value={loc._id}>
//                   {loc.location}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//           <div className="d-flex justify-content-end">
//             <Button
//               onClick={handleClose}
//               style={{
//                 backgroundColor: 'var(--secondary)',
//                 border: 'none',
//                 borderRadius: '8px',
//                 fontWeight: 'bold',
//                 padding: '8px 16px',
//                 marginRight: '10px',
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSubmit}
//               style={{
//                 backgroundColor: 'var(--primary)',
//                 border: 'none',
//                 borderRadius: '8px',
//                 fontWeight: 'bold',
//                 padding: '8px 16px',
//               }}
//             >
//               Add Prisoner
//             </Button>
//           </div>
//         </Form>
//       </Offcanvas.Body>
//     </Offcanvas>
//   );
// };

// export default AddPrisonerOffcanvas;

import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button, Table, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddPrisonerOffcanvas = ({ show, handleClose, instructorId }) => {
  const [prisonerName, setPrisonerName] = useState('');
  const [location, setLocation] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [prisoners, setPrisoners] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prisonerName.trim()) {
      toast.error('Please enter prisoner name');
      return;
    }
    if (!location) {
      toast.error('Please select location');
      return;
    }

    try {
      const selectedLocation = locationList.find(loc => loc._id === location);
      const payload = {
        instructorId,
        prisonerName,
        location: selectedLocation._id
      };
      await axios.post('http://18.209.91.97:5010/api/prisoner/addPrisoner', payload);
      toast.success('Prisoner added successfully');
      fetchPrisoners(); // Refresh the prisoner list
      setPrisonerName('');
      setLocation('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add prisoner');
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://18.209.91.97:5010/api/location/getAllLocations');
      const locations = res.data?.data || [];
      const activeLocations = locations.filter(loc => loc.status === 'Active');
      setLocationList(activeLocations);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
      toast.error("Failed to load locations");
    }
  };

  const fetchPrisoners = async () => {
    if (!instructorId) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://18.209.91.97:5010/api/prisoner/prisonersByInstructor/${instructorId}`);
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
    }
  }, [show, instructorId]);

  const getLocationName = (locationObj) => {
    if (!locationObj) return 'Not assigned';
    return typeof locationObj === 'string' ? locationObj : locationObj.location;
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '600px' }}>
      <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--secondary)', color: '#fff' }}>
        <Offcanvas.Title style={{ fontWeight: 'bold' }}>Manage Prisoners</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ backgroundColor: 'var(--accent)' }}>
        <div className="mb-4 p-3" style={{ backgroundColor: '#fff', borderRadius: '8px' }}>
          <h5>Add New Prisoner</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600' }}>Prisoner Name</Form.Label>
              <Form.Control
                value={prisonerName}
                onChange={(e) => setPrisonerName(e.target.value)}
                placeholder="Enter prisoner name"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  padding: '10px',
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600' }}>Location</Form.Label>
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
                variant="secondary"
                style={{
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
                variant="primary"
                style={{
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  padding: '8px 16px',
                }}
              >
                Add Prisoner
              </Button>
            </div>
          </Form>
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
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddPrisonerOffcanvas;