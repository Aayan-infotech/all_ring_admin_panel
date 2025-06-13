


// import React, { useState } from 'react';
// import { Table, Button, Badge, ButtonGroup, Offcanvas, Form } from 'react-bootstrap';
// import { PlusCircle, InfoCircle, ClipboardCheck } from 'react-bootstrap-icons';

// const sampleData = [
//   { 
//     id: 1, 
//     title: 'Yoga Basics', 
//     date: '2023-06-15', 
//     time: '09:00 AM',
//     location: 'Hall A', 
//     instructor: 'John Doe', 
//     status: 'upcoming' 
//   },
//   { 
//     id: 2, 
//     title: 'Mindfulness 101', 
//     date: '2023-06-16', 
//     time: '02:30 PM',
//     location: 'Room 3', 
//     instructor: 'Jane Smith', 
//     status: 'live' 
//   },
//   { 
//     id: 3, 
//     title: 'Fitness Flow', 
//     date: '2023-06-10', 
//     time: '07:00 AM',
//     location: 'Gym', 
//     instructor: 'Ravi Kumar', 
//     status: 'past' 
//   },
// ];

// const statusVariant = {
//   upcoming: 'warning',
//   live: 'success',
//   past: 'secondary',
// };

// const ClassAttendance = () => {
//   const [data, setData] = useState(sampleData);
//   const [showForm, setShowForm] = useState(false);
//   const [newEntry, setNewEntry] = useState({
//     title: '', 
//     date: '',
//     time: '',
//     location: '', 
//     instructor: '', 
//     status: 'upcoming'
//   });

//   const handleAdd = (e) => {
//     e.preventDefault();
//     setData(prev => [...prev, { ...newEntry, id: prev.length + 1 }]);
//     setShowForm(false);
//     setNewEntry({ 
//       title: '', 
//       date: '',
//       time: '',
//       location: '', 
//       instructor: '', 
//       status: 'upcoming' 
//     });
//   };

//   return (
//     <div className="p-4" style={{ background: '#f9f9f9' }}>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 style={{ fontWeight: 600 }}>Class Attendance</h3>
//         <Button variant="primary" onClick={() => setShowForm(true)}>
//           <PlusCircle className="me-2" /> Add
//         </Button>
//       </div>

//       <div className="table-responsive">
//         <Table bordered hover>
//           <thead style={{ background: 'var(--secondary)', color: 'white' }}>
//             <tr>
//               <th>#</th>
//               <th>Title</th>
//               <th>Location</th>
//               <th>Instructor</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((cls, idx) => (
//               <tr key={cls.id}>
//                 <td>{idx + 1}</td>
//                 <td>
//                   <div className="fw-bold">{cls.title}</div>
//                   <div className="text-muted small">
//                     {cls.date} • {cls.time}
//                   </div>
//                 </td>
//                 <td>{cls.location}</td>
//                 <td>{cls.instructor}</td>
//                 <td><Badge bg={statusVariant[cls.status]}>{cls.status}</Badge></td>
//                 <td>
//                   <ButtonGroup size="sm">
//                     <Button variant="light"><InfoCircle /></Button>
//                     <Button variant="light"><ClipboardCheck /></Button>
//                   </ButtonGroup>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//       <Offcanvas show={showForm} onHide={() => setShowForm(false)} placement="end">
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title>Add Class Attendance</Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           <Form onSubmit={handleAdd}>
//             <Form.Group className="mb-3">
//               <Form.Label>Title</Form.Label>
//               <Form.Control required value={newEntry.title} onChange={e => setNewEntry({ ...newEntry, title: e.target.value })} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Date</Form.Label>
//               <Form.Control 
//                 type="date" 
//                 required 
//                 value={newEntry.date} 
//                 onChange={e => setNewEntry({ ...newEntry, date: e.target.value })} 
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Time</Form.Label>
//               <Form.Control 
//                 type="time" 
//                 required 
//                 value={newEntry.time} 
//                 onChange={e => setNewEntry({ ...newEntry, time: e.target.value })} 
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Location</Form.Label>
//               <Form.Control required value={newEntry.location} onChange={e => setNewEntry({ ...newEntry, location: e.target.value })} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Instructor</Form.Label>
//               <Form.Control required value={newEntry.instructor} onChange={e => setNewEntry({ ...newEntry, instructor: e.target.value })} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Status</Form.Label>
//               <Form.Select value={newEntry.status} onChange={e => setNewEntry({ ...newEntry, status: e.target.value })}>
//                 <option value="upcoming">Upcoming</option>
//                 <option value="live">Live</option>
//                 <option value="past">Past</option>
//               </Form.Select>
//             </Form.Group>
//             <Button type="submit" variant="success" className="w-100">Add Entry</Button>
//           </Form>
//         </Offcanvas.Body>
//       </Offcanvas>
//     </div>
//   );
// };

// export default ClassAttendance;



import React, { useState } from 'react';
import { Table, Button, Badge, ButtonGroup, Offcanvas, Form } from 'react-bootstrap';
import { PlusCircle, InfoCircle, ClipboardCheck } from 'react-bootstrap-icons';

const sampleData = [
  { 
    id: 1, 
    title: 'Yoga Basics', 
    date: '2023-06-15', 
    time: '09:00 AM',
    location: 'Hall A', 
    instructor: 'John Doe', 
    status: 'upcoming' 
  },
  { 
    id: 2, 
    title: 'Mindfulness 101', 
    date: '2023-06-16', 
    time: '02:30 PM',
    location: 'Room 3', 
    instructor: 'Jane Smith', 
    status: 'live' 
  },
  { 
    id: 3, 
    title: 'Fitness Flow', 
    date: '2023-06-10', 
    time: '07:00 AM',
    location: 'Gym', 
    instructor: 'Ravi Kumar', 
    status: 'past' 
  },
];

const statusVariant = {
  upcoming: 'warning',
  live: 'success',
  past: 'secondary',
};

const ClassAttendance = () => {
  const [data, setData] = useState(sampleData);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '', 
    date: '',
    time: '',
    location: '', 
    instructor: '', 
    status: 'upcoming'
  });

  // const handleAdd = (e) => {
  //   e.preventDefault();
  //   setData(prev => [...prev, { ...newEntry, id: prev.length + 1 }]);
  //   setShowForm(false);
  //   setNewEntry({ 
  //     title: '', 
  //     date: '',
  //     time: '',
  //     location: '', 
  //     instructor: '', 
  //     status: 'upcoming' 
  //   });
  // };


  return (
    <div className="p-4" style={{ background: '#f9f9f9' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ fontWeight: 600 }}>Class Attendance</h3>
        {/* <Button variant="primary" onClick={() => setShowForm(true)}>
          <PlusCircle className="me-2" /> Add
        </Button> */}
      </div>

      <div className="table-responsive">
        <Table bordered hover>
          <thead style={{ background: 'var(--secondary)', color: 'white' }}>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Location</th>
              <th>Instructor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((cls, idx) => (
              <tr key={cls.id}>
                <td>{idx + 1}</td>
                <td>
                  <div className="fw-bold">{cls.title}</div>
                  <div className="text-muted small">
                    {cls.date} • {cls.time}
                  </div>
                </td>
                <td>{cls.location}</td>
                <td>{cls.instructor}</td>
                <td><Badge bg={statusVariant[cls.status]}>{cls.status}</Badge></td>
                <td>
                  <ButtonGroup size="sm">
                    <Button variant="light"><InfoCircle /></Button>
                    <Button variant="light"><ClipboardCheck /></Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* <Offcanvas show={showForm} onHide={() => setShowForm(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add Class Attendance</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleAdd}>
         

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control required value={newEntry.title} onChange={e => setNewEntry({ ...newEntry, title: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control 
                type="date" 
                required 
                value={newEntry.date} 
                onChange={e => setNewEntry({ ...newEntry, date: e.target.value })} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control 
                type="time" 
                required 
                value={newEntry.time} 
                onChange={e => setNewEntry({ ...newEntry, time: e.target.value })} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control required value={newEntry.location} onChange={e => setNewEntry({ ...newEntry, location: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Instructor</Form.Label>
              <Form.Control required value={newEntry.instructor} onChange={e => setNewEntry({ ...newEntry, instructor: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={newEntry.status} onChange={e => setNewEntry({ ...newEntry, status: e.target.value })}>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="past">Past</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="success" className="w-100">Add Entry</Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas> */}
    </div>
  );
};

export default ClassAttendance;



