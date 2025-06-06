import React, { useState } from 'react';
import { Button, Form, Offcanvas, Table, Badge } from 'react-bootstrap';

const Data = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [formData, setFormData] = useState({ name: '', status: 'Active' });
  const [dataList, setDataList] = useState([
    { id: 1, name: 'Ankit Sharma', status: 'Active' },
  ]);

  const handleShow = () => setShowCanvas(true);
  const handleClose = () => {
    setShowCanvas(false);
    setFormData({ name: '', status: 'Active' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddData = () => {
    const newData = {
      id: dataList.length + 1,
      ...formData,
    };
    setDataList([...dataList, newData]);
    handleClose();
  };

  const toggleStatus = (id) => {
    const updated = dataList.map((item) =>
      item.id === id ? { ...item, status: item.status === 'Active' ? 'Blocked' : 'Active' } : item
    );
    setDataList(updated);
  };

  return (
    <div className="p-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header & Add */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ color: 'var(--secondary)' }}>Data Management</h4>
        <div className="d-flex gap-2">
          <Form.Control type="text" placeholder="Search by name..." />
          <Button onClick={handleShow} style={{ background: 'var(--primary)', border: 'none' }}>
            Add
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table bordered hover responsive>
        <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>
                <Badge bg={item.status === 'Active' ? 'success' : 'danger'}>{item.status}</Badge>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant={item.status === 'Active' ? 'danger' : 'success'}
                    onClick={() => toggleStatus(item.id)}
                  >
                    {item.status === 'Active' ? 'Block' : 'Activate'}
                  </Button>
                  <Button size="sm" variant="info">Edit</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Offcanvas Form */}
      <Offcanvas show={showCanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton style={{ background: 'var(--secondary)', color: 'white' }}>
          <Offcanvas.Title>Add New User</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ background: 'var(--accent)' }}>
          <div className="p-3 bg-white rounded shadow-sm">
            <Form>
              <Form.Group className="mb-4">
                <Form.Label style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button
                type="button"
                onClick={handleAddData}
                className="w-100"
                style={{ background: 'var(--primary)', border: 'none' }}
              >
                Add User
              </Button>
            </Form>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Data;
