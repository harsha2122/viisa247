import React, { useState, useEffect, CSSProperties } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import axiosInstance from '../../app/helpers/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
const inputStyle: CSSProperties = {
  border: '1.5px solid #d3d3d3',
  borderRadius: '10px',
  padding: '10px',
  paddingLeft: '20px',
  width: '90%',
  boxSizing: 'border-box',
};


const FlightReForm = ({ ind, onDataChange, selectedEntry }) => {
  const [formData, setFormData] = useState({ ...selectedEntry });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({ ...selectedEntry });
  }, [selectedEntry]);

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post('/backend/upload_image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      return response.data.data; // New image URL
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
      return '';
    }
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const uploadedFileUrl = await handleFileUpload(files[0]);
      console.log('Uploaded File URL:', uploadedFileUrl);
      setFormData((prevData) => ({
        ...prevData,
        [name]: uploadedFileUrl,
      }));
      onDataChange({
        ...formData,
        [name]: uploadedFileUrl,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    onDataChange({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedData = {
      _id: selectedEntry._id,
      first_name: formData.first_name,
      age: formData.age,
      gender: formData.gender,
      receipt_url: formData.receipt_url,
      passport_front: formData.passport_front,
    };
  
    try {
      const response = await axiosInstance.post('/backend/update_flight_application', updatedData);
  
      if (response.data.success === 1) {
        toast.success('Data updated successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      } else {
        toast.error('Error updating data: ' + response.data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating user application:', error);
      toast.error('Error updating data: ');
    }
  };

  return (
    <Container>
    <Toaster />
      <Form onSubmit={handleSubmit}>
       

        <Row>
            <Col md={6}>
              <Form.Group controlId="first_name" className="mb-3">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  style={{ ...inputStyle, width: '95%' }}
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="age" className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="text"
                  style={{ ...inputStyle, width: '95%' }}
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
        </Row>

        <Row>
            <Col md={6}>
              <Form.Group controlId="gender" className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  style={{ ...inputStyle, width: '95%' }}
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>
            </Col>
        </Row>

        <Row>
            <Col md={6}>
              <Form.Group controlId="passport_front" className="mb-3">
                <Form.Label>Passport Front</Form.Label>
                <Form.Control
                  type="file"
                  style={{ ...inputStyle, width: '95%' }}
                  name="passport_front"
                  onChange={handleFileChange}
                />
                {formData.passport_front && (
                  <img src={formData.passport_front} alt="Passport Front Preview" style={{ width: '100px', height: '100px' }} />
                )}
              </Form.Group>
            </Col>
        </Row>

        <Button variant="primary" type="submit" className="mt-3">Submit</Button>
      </Form>
    </Container>
  );
};

export default FlightReForm;
