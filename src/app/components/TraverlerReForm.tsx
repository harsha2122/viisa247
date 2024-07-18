import React, { useState, useEffect, CSSProperties } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axiosInstance from '../../app/helpers/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';

const inputStyle: CSSProperties = {
  border: '1.5px solid #d3d3d3',
  borderRadius: '10px',
  padding: '10px',
  paddingLeft: '20px',
  width: '90%',
  boxSizing: 'border-box',
};

const TraverlerReForm = ({ ind, onDataChange, selectedEntry }) => {
  const [formData, setFormData] = useState({ ...selectedEntry });
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    setFormData({ ...selectedEntry });
  }, [selectedEntry]);

  console.log("sc", selectedEntry)

  useEffect(() => {
    const userTypeFromCookies = Cookies.get('userType');
    setUserType(userTypeFromCookies || '');
  }, []);

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
      passport_front: formData.passport_front,
      passport_back: formData.passport_back,
      photo: formData.photo,
      pan_card: formData.pan_card,
      tickets: formData.tickets,
      receipt_url: formData.receipt_url,
      application_destination: formData.application_destination,
      application_id: formData.application_id,
      birth_place: formData.birth_place,
      country_code: formData.country_code,
      fathers_name: formData.fathers_name,
      first_name: formData.first_name,
      gender: formData.gender,
      last_name: formData.last_name,
      passport_number: formData.passport_number,
      visa_amount: formData.visa_amount,
      visa_description: formData.visa_description,
      marital_status: formData.marital_status,
    };

    try {
      const response = await axiosInstance.post('/backend/update_user_application', updatedData);

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
      <div className="p-4 my-4 bg-white">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="first_name" className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="last_name" className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleChange}
                  style={inputStyle}
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
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="marital_status" className="mb-3">
                <Form.Label>Marital Status</Form.Label>
                <Form.Control
                  as="select"
                  name="marital_status"
                  value={formData.marital_status || ''}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="birth_place" className="mb-3">
                <Form.Label>Birth Place</Form.Label>
                <Form.Control
                  type="text"
                  name="birth_place"
                  value={formData.birth_place || ''}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="passport_number" className="mb-3">
                <Form.Label>Passport Number</Form.Label>
                <Form.Control
                  type="text"
                  name="passport_number"
                  value={formData.passport_number || ''}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
          {formData.passport_front && (
            <Col md={6}>
              <h3 className='mt-20'>Passport Front</h3>
              <div className='d-flex' style={{ width: '100%' }}>
                <div style={{ width: '100%', marginTop: 10 }}>
                  <h6>Passport Front</h6>
                  <div
                    style={{
                      border: '4px dotted gray',
                      width: '100%',
                      height: 300,
                      borderRadius: '10px',
                      justifyContent: 'center',
                      textAlign: 'center',
                      marginTop: 20,
                    }}
                  >
                    <img
                      src={formData.passport_front}
                      alt='Uploaded Image'
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                  <Form.Group controlId="passport_front" className="mt-3">
                    <Form.Control
                      type="file"
                      name="passport_front"
                      onChange={handleFileChange}
                      style={inputStyle}
                    />
                  </Form.Group>
                </div>
              </div>
            </Col>
          )}

          {formData.passport_back && (
            <Col md={6}>
              <h3 className='mt-20'>Passport Back</h3>
              <div className='d-flex' style={{ width: '100%' }}>
                <div style={{ width: '100%', marginTop: 10 }}>
                  <h6>Passport Back</h6>
                  <div
                    style={{
                      border: '4px dotted gray',
                      width: '100%',
                      height: 300,
                      borderRadius: '10px',
                      justifyContent: 'center',
                      textAlign: 'center',
                      marginTop: 20,
                    }}
                  >
                    <img
                      src={formData.passport_back}
                      alt='Uploaded Image'
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                  <Form.Group controlId="passport_back" className="mt-3">
                    <Form.Control
                      type="file"
                      name="passport_back"
                      onChange={handleFileChange}
                      style={inputStyle}
                    />
                  </Form.Group>
                </div>
              </div>
            </Col>
          )}

          {formData.photo && (
            <Col md={6}>
              <h3 className='mt-20'>Photo</h3>
              <div className='d-flex' style={{ width: '100%' }}>
                <div style={{ width: '100%', marginTop: 10 }}>
                  <h6>Photo</h6>
                  <div
                    style={{
                      border: '4px dotted gray',
                      width: '100%',
                      height: 300,
                      borderRadius: '10px',
                      justifyContent: 'center',
                      textAlign: 'center',
                      marginTop: 20,
                    }}
                  >
                    <img
                      src={formData.photo}
                      alt='Uploaded Image'
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                  <Form.Group controlId="photo" className="mt-3">
                    <Form.Control
                      type="file"
                      name="photo"
                      onChange={handleFileChange}
                      style={inputStyle}
                    />
                  </Form.Group>
                </div>
              </div>
            </Col>
          )}

          {formData.pan_card && (
            <Col md={6}>
              <h3 className='mt-20'>PAN Card</h3>
              <div className='d-flex' style={{ width: '100%' }}>
                <div style={{ width: '100%', marginTop: 10 }}>
                  <h6>PAN Card</h6>
                  <div
                    style={{
                      border: '4px dotted gray',
                      width: '100%',
                      height: 300,
                      borderRadius: '10px',
                      justifyContent: 'center',
                      textAlign: 'center',
                      marginTop: 20,
                    }}
                  >
                    <img
                      src={formData.pan_card}
                      alt='Uploaded Image'
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                  <Form.Group controlId="pan_card" className="mt-3">
                    <Form.Control
                      type="file"
                      name="pan_card"
                      onChange={handleFileChange}
                      style={inputStyle}
                    />
                  </Form.Group>
                </div>
              </div>
            </Col>
          )}

          {formData.tickets && (
            <Col md={6}>
              <h3 className='mt-20'>Tickets</h3>
              <div className='d-flex' style={{ width: '100%' }}>
                <div style={{ width: '100%', marginTop: 10 }}>
                  <h6>Tickets</h6>
                  <div
                    style={{
                      border: '4px dotted gray',
                      width: '100%',
                      height: 300,
                      borderRadius: '10px',
                      justifyContent: 'center',
                      textAlign: 'center',
                      marginTop: 20,
                    }}
                  >
                    <img
                      src={formData.tickets}
                      alt='Uploaded Image'
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                  <Form.Group controlId="tickets" className="mt-3">
                    <Form.Control
                      type="file"
                      name="tickets"
                      onChange={handleFileChange}
                      style={inputStyle}
                    />
                  </Form.Group>
                </div>
              </div>
            </Col>
          )}

          {userType === 'customer' && formData.receipt_url && (
            <Col md={6}>
              <h3 className='mt-20'>Receipt</h3>
              <div className='d-flex' style={{ width: '100%' }}>
                <div style={{ width: '100%', marginTop: 10 }}>
                  <h6>Receipt</h6>
                  <div
                    style={{
                      border: '4px dotted gray',
                      width: '100%',
                      height: 300,
                      borderRadius: '10px',
                      justifyContent: 'center',
                      textAlign: 'center',
                      marginTop: 20,
                    }}
                  >
                    <img
                      src={formData.receipt_url}
                      alt='Uploaded Image'
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                  <Form.Group controlId="receipt_url" className="mt-3">
                    <Form.Control
                      type="file"
                      name="receipt_url"
                      onChange={handleFileChange}
                      style={inputStyle}
                    />
                  </Form.Group>
                </div>
              </div>
            </Col>
          )}
        </Row>


          <Button variant="primary" type="submit" className="mt-3">
            Submit
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default TraverlerReForm;
