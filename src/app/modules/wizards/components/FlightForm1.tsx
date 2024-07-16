import { useState, useRef, ChangeEvent } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import ClearIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../../helpers/axiosInstance';
import * as Yup from 'yup';

function FlightForm1({ onDataChange, ind }) {
  const passportFrontFileInputRef = useRef<HTMLInputElement | null>(null);
  const [passportFrontImageURL, setPassportFrontImageURL] = useState('');
  const maxSize = 1024 * 1024;
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    travelerCount: Yup.number().required('Traveler Count is required').min(1, 'Must be at least 1'),
  });

  const [formData, setFormData] = useState({
    fullName: '',
    passport_front: '',
    age: '',
    gender: '',
  });

  const inputStyle = {
    border: '1.5px solid #d3d3d3',
    borderRadius: '15px',
    padding: '10px',
    paddingLeft: '20px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post('/backend/upload_image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const fileUrl = response.data.data;
      setLoading(false);
      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
      return '';
    }
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target) {
          setPassportFrontImageURL(e.target.result as string);
          try {
            const imageLink = await handleFileUpload(file);
            setFormData({ ...formData, passport_front: imageLink });
            onDataChange({ ...formData, passport_front: imageLink });
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (passportFrontFileInputRef.current) {
      passportFrontFileInputRef.current.click();
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
    onDataChange({ ...formData, [fieldName]: value });
  };

  return (
    <div
      className='py-10 px-20'
      style={{
        borderRadius: 20,
        borderColor: '#f2f2f2',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        marginLeft: 10,
        marginTop: 10,
        backgroundColor: 'white',
      }}
    >
      <Toaster />
      <h5 style={{ fontSize: 30, letterSpacing: 0.3 }}>Traveller {ind + 1}</h5>
      <hr style={{
        width: "100%",
        border: 0,
        height: "0.5px",
        backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0))"
      }} />
      <br />
      <h3 style={{ color: "red", margin: "20px 0px 20px 0px" }}>Note - All fields are mandatory.</h3>
      <h3>Upload Traveler's Front Passport Page</h3>
      <p>
        For dummy ticket will require Full and passport front image for application
      </p>
      <div className='d-flex flex-wrap'>
        <div style={{ flex: '1 1 30%', marginTop: 70 }}>
          <h6>Passport Front Page Image</h6>
          {loading ? (
            <div style={{ color: "#000" }}>Loading...</div>
          ) : (
            passportFrontImageURL ? (
              <div
                style={{
                  border: '4px dotted gray',
                  width: '100%',
                  height: 250,
                  borderRadius: '10px',
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginTop: 20,
                }}
              >
                <div
                  onClick={() => setPassportFrontImageURL('')}
                  style={{
                    justifyContent: 'flex-end',
                    position: 'relative',
                    backgroundColor: 'white',
                    padding: 7,
                    borderRadius: 50,
                    left: "10px",
                    width: "35px",
                    zIndex: "1",
                    cursor: 'pointer',
                  }}
                >
                  <ClearIcon style={{ color: 'red' }} />
                </div>
                <img
                  src={passportFrontImageURL}
                  alt='Uploaded Image'
                  style={{ maxWidth: '100%', maxHeight: '100%', position: "relative", marginTop: "-35px" }}
                />
              </div>
            ) : (
              <div
                style={{
                  border: '4px dotted gray',
                  width: '100%',
                  height: 250,
                  borderRadius: '10px',
                  justifyContent: 'center',
                  textAlign: 'center',
                  paddingTop: 25,
                  marginTop: 20,
                }}
              >
                <h4 className='mx-10 mt-10'>Passport Front Photo</h4>
                <button
                  type='button'
                  onClick={handleImageUpload}
                  className='btn btn-lg btn-success me-3 mt-7'
                  style={{ justifyContent: 'flex-end', backgroundColor: '#327113' }}
                >
                  <span className='indicator-label'>Select Files</span>
                </button>
                <p className='text-bold pt-5 fs-9' style={{ color: '#555555' }}>
                  Supports Image only.
                </p>
                <input
                  type='file'
                  ref={passportFrontFileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            )
          )}
        </div>

        <div style={{ flex: '1 1 70%', marginTop: 5 }}>
        <Formik
  initialValues={formData}
  onSubmit={() => {}}
  validationSchema={validationSchema}
>
  {({ handleChange }) => ( // Destructure handleChange
    <Form className='py-20 px-9' noValidate id='kt_create_account_form'>
      <div>
        <div className='d-flex flex-wrap' style={{ justifyContent: 'space-between' }}>
          <div className='fv-row mb-5' style={{ flex: '1 1 45%' }}>
            <label className='form-label mb-4 required'>Full Name</label>
            <Field
              name='fullName'
              type='text'
              style={inputStyle}
              className='form-control form-control-lg form-control-solid'
              onChange={(e) => {
                handleChange(e); // Call Formik's handleChange
                handleFieldChange('fullName', e.target.value);
              }}
            />
            <div className='text-danger mt-2'>
              <ErrorMessage name='fullName' />
            </div>
          </div>
        </div>
        <div className='d-flex flex-wrap' style={{ justifyContent: 'space-between' }}>
          <div className='fv-row mb-5' style={{ flex: '1 1 45%' }}>
            <label className='form-label mb-4 required'>Age</label>
            <Field
              type='number'
              name='age'
              style={inputStyle}
              className='form-control form-control-lg form-control-solid'
              onChange={(e) => {
                handleChange(e);
                handleFieldChange('age', e.target.value);
              }}
            />
            <div className='text-danger mt-2'>
              <ErrorMessage name='age' />
            </div>
          </div>
        </div>
        <div className='d-flex flex-wrap' style={{ justifyContent: 'space-between' }}>
          <div className='fv-row mb-5' style={{ flex: '1 1 45%' }}>
            <label className='form-label mb-4 required'>Gender</label>
            <Field
              as='select'
              name='gender'
              style={inputStyle}
              className='form-control form-control-lg form-control-solid'
              onChange={(e) => {
                handleChange(e);
                handleFieldChange('gender', e.target.value);
              }}
            >
              <option value=''>Select</option>
              <option value='M'>Male</option>
              <option value='F'>Female</option>
            </Field>
            <div className='text-danger mt-2'>
              <ErrorMessage name='gender' />
            </div>
          </div>
        </div>
      </div>
    </Form>
  )}
</Formik>

        </div>
      </div>
    </div>
  );
}

export default FlightForm1;
