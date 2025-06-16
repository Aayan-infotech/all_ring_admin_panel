

// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   Button,
//   Badge,
//   ButtonGroup,
//   InputGroup,
//   FormControl,
//   Spinner
// } from 'react-bootstrap';
// import {
//   PlusCircle,
//   InfoCircle,
//   ClipboardCheck,
//   Pencil,
//   Trash,
//   Files,
//   Film
// } from 'react-bootstrap-icons';
// import axios from 'axios';

// const statusVariant = {
//   upcoming: 'warning',
//   live: 'success',
//   past: 'secondary',
// };

// const ClassAttendance = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState('');

//   const fetchClasses = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get('http://18.209.91.97:5010/api/AdminClasses/getAllClasses');
//       setData(res.data.data || []);
//     } catch (err) {
//       console.error('Error fetching class data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   const filteredData = data.filter(cls =>
//     cls.title?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-4" style={{ background: '#f9f9f9' }}>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 style={{ fontWeight: '600', color: 'var(--secondary)' }}>Class Attendance</h3>
     
//       </div>

//       <InputGroup className="mb-3 w-50">
//         <FormControl
//           placeholder="Search by title..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </InputGroup>

//       {loading ? (
//         <div className="text-center mt-5">
//           <Spinner animation="border" />
//         </div>
//       ) : (
//         <div className="table-responsive">
//           <Table bordered hover className="align-middle">
//             <thead className="text-white" style={{ backgroundColor: '#003865' }}>
//               <tr>
//                 <th>#</th>
             
//                 <th>Title</th>
//                 <th>Location</th>
//                  <th>Instructors</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((cls, idx) => (
//                 <tr key={cls._id || idx}>
//                   <td>{idx + 1}</td>
//                   <td>{cls.title}</td>
                 
//                   <td>{cls.location?.location || 'N/A'}</td>
//                    <td>{cls.Instructor}</td>
//                   <td>
//                     <Badge bg={cls.status === 'Active' ? 'danger' : 'secondary'}>
//                       {cls.status}
//                     </Badge>
//                   </td>
//                   <td>
//                     <ButtonGroup>
//                       <Button variant="success" size="sm">
//                         ✓
//                       </Button>
//                       <Button variant="warning" size="sm">
//                         <Pencil />
//                       </Button>
//                       <Button variant="danger" size="sm">
//                         <Trash />
//                       </Button>
                     
//                     </ButtonGroup>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClassAttendance;


import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Badge,
  ButtonGroup,
  InputGroup,
  FormControl,
  Spinner
} from 'react-bootstrap';
import axios from 'axios';

const statusVariant = {
  upcoming: 'warning',
  live: 'success',
  passed: 'secondary',
};

const ClassAttendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://18.209.91.97:5010/api/AdminClasses/getAllClasses');
      setData(res.data.data || []);
    } catch (err) {
      console.error('Error fetching class data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredData = data.filter(cls =>
    cls.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4" style={{ background: '#f9f9f9' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ fontWeight: '600', color: 'var(--secondary)' }}>Class Attdddendance</h3>
      </div>

      <InputGroup className="mb-3 w-50">
        <FormControl
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover className="align-middle">
            <thead className="text-white" style={{ backgroundColor: '#003865' }}>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Location</th>
                <th>Instructors</th>
                <th>Status</th>
                <th>More</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((cls, idx) => {
                // Convert your custom logic for status display if needed
                const rawStatus = cls.status?.toLowerCase() || 'upcoming';
                const badgeColor = statusVariant[rawStatus] || 'dark';

                return (
                  <tr key={cls._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{cls.title}</td>
                    <td>{cls.location?.location || 'N/A'}</td>
                    <td>{cls.Instructor || ''}</td>
                    <td>
                      <Badge bg={badgeColor}>
                        {rawStatus.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <ButtonGroup>
                        <Button variant="outline-danger" size="sm" className="me-2">
                          Details
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          Attendance
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ClassAttendance;

