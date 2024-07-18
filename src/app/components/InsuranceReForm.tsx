import React, { useState, useEffect, CSSProperties } from 'react';
import { Form, Button } from 'react-bootstrap';
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

const InsuranceReForm = ({ ind, onDataChange, selectedEntry }) => {
  const [formData, setFormData] = useState({ ...selectedEntry });
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    setFormData({ ...selectedEntry });
  }, [selectedEntry]);

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
      last_name: formData.last_name,
      birth_place: formData.birth_place,
      birthday_date: formData.birthday_date, // Make sure this is included in your formData
      nationality: formData.nationality, // Make sure this is included in your formData
      passport_number: formData.passport_number,
      passport_issue_date: formData.passport_issue_date, // Make sure this is included in your formData
      passport_expiry_date: formData.passport_expiry_date, // Make sure this is included in your formData
      gender: formData.gender,
      marital_status: formData.marital_status, // Make sure this is included in your formData
      passport_front: formData.passport_front,
      receipt_url: formData.receipt_url,
    };

    try {
      const response = await axiosInstance.post('/backend/update_insurance_application', updatedData);

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
    <div className=' px-20'>
      <Toaster />
      <div className='d-flex ' style={{ width: '100%' }}>
        <div style={{ width: '40%', marginTop: 10 }}>
          <h6>Passport Front Page Image</h6>
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
              src={selectedEntry.passport_front}
              alt='Uploaded Image'
              style={{ maxWidth: '100%', maxHeight: '100%', }}
            />
          </div>
          <Form.Group controlId="passport_front" className="mt-3">
            <Form.Control
              type="file"
              name="passport_front"
              onChange={handleFileChange}
            />
          </Form.Group>
        </div>

        <div
          className='d-flex flex-row-fluid flex-center bg-body rounded'
          style={{ width: '70%', backgroundColor: 'blue' }}
        >
          <Form onSubmit={handleSubmit} className='py-4 px-9'>
            <div>
              <div className='fv-row mb-5'>
                <label style={{ marginLeft: "5px" }} className='d-flex align-items-center form-label'>
                  <span className='required'>Passport Number</span>
                </label>

                <Form.Control
                  style={{ ...inputStyle, width: '95%' }}
                  name='passport_number'
                  value={formData.passport_number || ''}
                  onChange={handleChange}
                  className='form-control form-control-lg form-control-solid'
                />
              </div>

              <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                <div className='fv-row mb-5'>
                  <label style={{ marginLeft: "5px" }} className='form-label required'>First Name</label>

                  <Form.Control
                    name='first_name'
                    value={formData.first_name || ''}
                    onChange={handleChange}
                    style={inputStyle}

                    className='form-control form-control-lg form-control-solid'
                  />
                </div>
                <div className='fv-row mb-5'>
                  <label style={{ marginLeft: "5px" }} className='d-flex align-items-center form-label'>
                    <span className='required'>Last Name</span>
                  </label>

                  <Form.Control
                    style={inputStyle}
                    name='last_name'
                    value={formData.last_name || ''}
                    onChange={handleChange}

                    className='form-control form-control-lg form-control-solid'
                  />
                </div>
              </div>

              <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                <div className='fv-row mb-5'>
                  <label style={{ marginLeft: "5px" }} className='d-flex align-items-center form-label'>
                    <span className='required'>Birth Place</span>
                  </label>

                  <Form.Control
                    style={inputStyle}
                    name='birth_place'
                    value={formData.birth_place || ''}
                    onChange={handleChange}

                    className='form-control form-control-lg form-control-solid'
                  />
                </div>
              </div>

              {userType === 'customer' && (
                <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                  <div className='fv-row mb-10'>
                    <label style={{ marginLeft: "-10px" }} className='form-label required'>Receipt</label>
                    <div className='form-group'>
                      <Form.Control
                        type="file"
                        name="receipt_url"
                        onChange={handleFileChange}
                      />
                      {formData.receipt_url && (
                        <img src={formData.receipt_url} alt="Receipt Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button variant="primary" type="submit" className="mt-3">Submit</Button>
          </Form>
        </div>
      </div>

      {userType === 'customer' && formData.receipt_url && (
        <div className='d-flex ' style={{ width: '100%' }}>
          <div style={{ width: '40%', marginTop: 70 }}>
            <h6>Receipt Image</h6>
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
                style={{ maxWidth: '100%', maxHeight: '100%', }}
              />
            </div>
            <Form.Group controlId="receipt_url" className="mt-3">
              <Form.Control
                type="file"
                name="receipt_url"
                onChange={handleFileChange}
              />
            </Form.Group>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceReForm;
