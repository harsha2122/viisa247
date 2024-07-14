import { useEffect, useState, useRef, ChangeEvent } from 'react'
import { KTIcon } from '../../../../_metronic/helpers'
import { ErrorMessage, Field, Form, Formik, FormikValues } from 'formik'
import { ICreateAccount, inits } from './CreateAccountWizardHelper'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import ClearIcon from '@mui/icons-material/Delete'
import axiosInstance from '../../../helpers/axiosInstance'
import { DatePicker } from 'antd'
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css'
function InsuranceForm({ onDataChange, ind }) {
  const [initValues] = useState<ICreateAccount>(inits)
  const passportFrontFileInputRef = useRef<HTMLInputElement | null>(null)
  const [passportFrontImageURL, setPassportFrontImageURL] = useState('')
  const maxSize = 1024 * 1024; 
  const [loading, setLoading] = useState(false); 

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    birthDetail: Yup.string().required('Date of Birth is required'),
    passportIssueDate: Yup.string().required('Passport Issue Date is required'),
    passPortExpiryDate: Yup.string().required('Passport Expiry Date is required'),
    gender: Yup.string().required('Gender is required'),
    maritalStatus: Yup.string().required('Marital Status is required'),
    panNo: Yup.string().required('PAN number is required')
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthPlace: '',
    birthday_date: '',
    gender: '',
    maritalStatus: '',
    passportNumber: '',
    passportIssueDate: '',
    passPortExpiryDate: '',
    passport_front: '',
  })

  const inputStyle = {
    border: '1.5px solid #d3d3d3', // Border width and color
    borderRadius: '15px', // Border radius
    padding: '10px',
    paddingLeft: '20px', // Padding
    width: '100%', // 100% width
    boxSizing: 'border-box', // Include padding and border in the width calculation
  }
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

    // Function to handle file selection
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
                // Assuming handleFileUpload is an asynchronous function that returns a promise
                const imageLink = await handleFileUpload(file);
    
                // Update the form data with the image link
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
        // Trigger the hidden file input
        if (passportFrontFileInputRef.current) {
          passportFrontFileInputRef.current.click()
        }
      }

  const handleFieldChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value })
    onDataChange({ ...formData, [fieldName]: value })

    if (fieldName == 'birthDetail') {
      setDob(value)
    }
    if (fieldName == 'passportIssueDate') {
      setIssueDate(value)
    }
    if (fieldName == 'passPortExpiryDate') {
      setExpiryDate(value)
    }
  }

  const [issueDate, setIssueDate] = useState<string | undefined>('');
  const [expiryDate, setExpiryDate] =useState<string | undefined>('');
  const [dob, setDob] = useState<string | undefined>('');

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
      <h5 style={{ fontSize: 30, letterSpacing: 0.3 }}>Traveller {ind + 1} </h5>
      <hr style={{
        width:"100%",
        border: 0,
        height: "0.5px",
        backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0))"
      }} />
      <br />
      <h3 style={{color:"red", margin:"20px 0px 20px 0px"}}>Note - All fields are mandatory.</h3>
      <h3>Upload Traveler's Front Passport Page</h3>
      <p>
      The destination country requires a scan of the traveler's passport. Upload a clear passport
        image and Visa 247 will scan and enter all the details directly from the file.
      </p>
      <div className='d-flex ' style={{ width: '100%' }}>
      <div style={{ width: '40%', marginTop: 70 }}>
        <h6>Passport Front Page Image</h6>
        {loading ? (
          <div style={{color:"#000"}}>Loading...</div>
        ) : (
          passportFrontImageURL ? (
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
              <div
                onClick={() => setPassportFrontImageURL('')}
                style={{
                  justifyContent: 'flex-end',
                  position: 'relative',
                  backgroundColor: 'white',
                  padding: 7,
                  borderRadius: 50,
                  left: "10px",
                  width:"35px",
                  zIndex:"1",
                  cursor: 'pointer',
                }}
              >
                <ClearIcon style={{ color: 'red' }} />
              </div>
              <img
                src={passportFrontImageURL}
                alt='Uploaded Image'
                style={{ maxWidth: '100%', maxHeight: '100%', position:"relative", marginTop:"-35px" }}
              />
            </div>
          ) : (
            <div
              style={{
                border: '4px dotted gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: 40,
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
        <div
          className='d-flex flex-row-fluid flex-center bg-body rounded'
          style={{ width: '70%', backgroundColor: 'blue' }}
        >
          <Formik initialValues={initValues} onSubmit={() => { }} validationSchema={validationSchema}>
            {() => (
              <Form className='py-20 px-9' noValidate id='kt_create_account_form'>
                <div>
                  <div className='fv-row mb-5'>
                    <label className='d-flex align-items-center form-label'>
                      <span className='required'>Passport Number</span>
                    </label>

                    <Field
                      style={{ ...inputStyle, width: '500px' }}
                      name='passportNumber'
                      className='form-control form-control-lg form-control-solid'
                      onChange={(e) => handleFieldChange('passportNumber', e.target.value)}
                    />
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='passportNumber' />
                    </div>
                  </div>
                  <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-5'>
                      <label className='form-label required'>First Name</label>

                      <Field
                        name='firstName'
                        style={inputStyle}
                        className='form-control form-control-lg form-control-solid'
                        onChange={(e) => handleFieldChange('firstName', e.target.value)}
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='businessName' />
                      </div>
                    </div>
                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Last Name</span>
                      </label>

                      <Field
                        style={inputStyle}
                        name='lastName'
                        className='form-control form-control-lg form-control-solid'
                        onChange={(e) => handleFieldChange('lastName', e.target.value)}
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='businessDescriptor' />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Birth Place</span>
                      </label>

                      <Field
                        style={inputStyle}
                        name='birthPlace'
                        className='form-control form-control-lg form-control-solid'
                        onChange={(e) => handleFieldChange('birthPlace', e.target.value)}
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='birthPlace' />
                      </div>
                    </div>
                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Date of Birth</span>
                      </label>

                      <DatePicker
                        style={{ backgroundClip: '#fff', width: 230, marginTop: 2, border: '1.5px solid #d3d3d3', borderRadius: 15, padding: 10 }}
                        onChange={(value) => {
                          if (value) {
                            handleFieldChange('birthDetail', value.format('YYYY-MM-DD'))
                          }
                        }
                        }
                      />

                      <div className='text-danger mt-2'>
                        <ErrorMessage name='birthDetail' />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Passport Issue Date</span>
                      </label>
                      <DatePicker
                        style={{ backgroundClip: '#fff', width: 230, marginTop: 2, border: '1.5px solid #d3d3d3', borderRadius: 15, padding: 10 }}
                        onChange={(value) => {
                          if (value) {
                            handleFieldChange('passportIssueDate', value.format('YYYY-MM-DD'))
                          }
                        }
                        }
                      />

                      <div className='text-danger mt-2'>
                        <ErrorMessage name='passportIssueDate' />
                      </div>
                    </div>

                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Passport Expiry Date</span>
                      </label>
                      <DatePicker
                        style={{ backgroundClip: '#fff', width: 230, marginTop: 2, border: '1.5px solid #d3d3d3', borderRadius: 15, padding: 10 }}
                        onChange={(value) => {
                          if (value) {
                            handleFieldChange('passPortExpiryDate', value.format('YYYY-MM-DD'))
                          }
                        }
                        }
                      />

                      <div className='text-danger mt-2'>
                        <ErrorMessage name='passPortExpiryDate' />
                      </div>
                    </div>
                  </div>
                  <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-10'>
                      <label className='form-label required'>Gender</label>

                      <Field
                        as='select'
                        name='gender'
                        style={{ ...inputStyle, width: '230px', backgroundColor: 'white' }}
                        className='form-select form-select-lg form-select-solid'
                        onChange={(e) => handleFieldChange('gender', e.target.value)}
                      >
                        <option></option>
                        <option value='M'>Male</option>
                        <option value='F'>Female</option>
                      </Field>
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='businessType' />
                      </div>
                    </div>
                    <div className='fv-row mb-10'>
                      <label className='form-label required'>Marital Status</label>

                      <Field
                        as='select'
                        style={{ ...inputStyle, width: '230px', backgroundColor: 'white' }}
                        name='maritalStatus'
                        className='form-select form-select-lg form-select-solid'
                        onChange={(e) => handleFieldChange('maritalStatus', e.target.value)}
                      >
                        <option></option>
                        <option value='Single'>Single</option>
                        <option value='Married'>Married</option>
                        <option value='Separated'>Separated</option>
                        <option value='Divorced'>Divorced</option>
                        <option value='Widowed'>Widowed</option>
                        <option value='Civil partnership'>Civil partnership</option>
                      </Field>
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='businessType' />
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
  )
}

export default InsuranceForm
