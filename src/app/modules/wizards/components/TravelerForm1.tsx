import { useEffect, useState, useRef, ChangeEvent } from 'react'
import { KTIcon } from '../../../../_metronic/helpers'
import { ErrorMessage, Field, Form, Formik, FormikValues } from 'formik'
import { ICreateAccount, inits } from './CreateAccountWizardHelper'
import { useNavigate } from 'react-router-dom'
import ClearIcon from '@mui/icons-material/Delete'
import axiosInstance from '../../../helpers/axiosInstance'
import { DatePicker } from 'antd'
import moment from 'moment';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css'
import toast, { Toaster } from 'react-hot-toast'
function TravelerForm1({ onDataChange, ind, selectedEntry, onFieldChange, onFileDelete }) {
  const [initValues] = useState<ICreateAccount>(inits)
  const passportFrontFileInputRef = useRef<HTMLInputElement | null>(null)
  const passportBackFileInputRef = useRef<HTMLInputElement | null>(null)
  const photoFileInputRef = useRef<HTMLInputElement | null>(null)
  const panFileInputRef = useRef<HTMLInputElement | null>(null)
  const itrFileInputRef = useRef<HTMLInputElement | null>(null)
  const letterFileInputRef = useRef<HTMLInputElement | null>(null)
  const ticketsFileInputRef = useRef<HTMLInputElement | null>(null)
  const [passportFrontImageURL, setPassportFrontImageURL] = useState('')
  const [passportBackImageURL, setPassportBackImageURL] = useState('')
  const [photo, setPhoto] = useState('')
  const [pan, setPan] = useState('')
  const [itr, setItr] = useState('')
  const [letter, setLetter] = useState('')
  const [tickets, setTickets] = useState('')
  const [loading, setLoading] = useState(false); // Add loading state
  const maxSize = 1024 * 1024;

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    birthDetail: Yup.string().required('Date of Birth is required'),
    passportIssueDate: Yup.string().required('Passport Issue Date is required'),
    passPortExpiryDate: Yup.string().required('Passport Expiry Date is required'),
    gender: Yup.string().required('Gender is required'),
    maritalStatus: Yup.string().required('Marital Status is required'),
    panNo: Yup.string().required('PAN number is required'),
  });


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthPlace: '',
    birthDetail: '',
    gender: '',
    maritalStatus: '',
    fatherName: '',
    motherName: '',
    panNumber: '',
    passportNumber: '',
    passportIssueDate: '',
    passPortExpiryDate: '',
    passFrontPhoto: '',
    passBackPhoto: '',
    travelerPhoto: '',
    panNo: '',
    panPhoto: '',
    itr: '',
    letter: '',
    tickets: '',
  })

  const inputStyle = {
    border: '1.5px solid #d3d3d3', // Border width and color
    borderRadius: '15px', // Border radius
    padding: '10px',
    paddingLeft: '20px', // Padding
    width: '100%', // 100% width
    boxSizing: 'border-box', // Include padding and border in the width calculation
  }
  const handleFileUpload = async (file) => {
    try {
      setLoading(true);

      const formData = new FormData()
      formData.append('file', file)
      const response = await axiosInstance.post('/backend/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const fileUrl = response.data.url

      setLoading(false);

      return fileUrl 
    } catch (error) {
      console.error('Error uploading file:', error)
      setLoading(false);
      return ''
    }
  }
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
            const imageLink = await handleFileUpload(file);
  
            setFormData((prevFormData) => {
              const updatedFormData = { ...prevFormData, passFrontPhoto: imageLink };
              onDataChange(updatedFormData);
              onFieldChange(ind, 'passport_front', imageLink);
              return updatedFormData;
            });
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleFileDelete = (field: string) => {
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [field]: '' };
      onDataChange(updatedFormData);
      onFieldChange(ind, field, '');
      onFileDelete(ind, field);
      return updatedFormData;
    });
  };
  
  const handleImageUpload = () => {
    // Trigger the hidden file input
    if (passportFrontFileInputRef.current) {
      passportFrontFileInputRef.current.click()
    }
  }
  const handleFileSelectBack = (event: ChangeEvent<HTMLInputElement>) => {
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
          setPassportBackImageURL(e.target.result as string);
          try {
            const imageLink = await handleFileUpload(file);
  
            setFormData((prevFormData) => {
              const updatedFormData = { ...prevFormData, passBackPhoto: imageLink };
              onDataChange(updatedFormData);
              onFieldChange(ind, 'passport_back', imageLink);
              return updatedFormData;
            });
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      };
  
      reader.readAsDataURL(file);
    }
  };
  const handleImageUploadBack = () => {
    // Trigger the hidden file input
    if (passportBackFileInputRef.current) {
      passportBackFileInputRef.current.click()
    }
  }

  const handlePhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
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
          setPhoto(e.target.result as string);
          try {
            const imageLink = await handleFileUpload(file);
  
            setFormData((prevFormData) => {
              const updatedFormData = { ...prevFormData, travelerPhoto: imageLink };
              onDataChange(updatedFormData);
              onFieldChange(ind, 'photo', imageLink);
              return updatedFormData;
            });
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      };
  
      reader.readAsDataURL(file);
    }
  };
  const handlePhotoUpload = () => {
    // Trigger the hidden file input
    if (photoFileInputRef.current) {
      photoFileInputRef.current.click()
    }
  }


  const handleItrSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
      const reader = new FileReader()

      reader.onload = async (e) => {
        // Update the state variable with the image data (base64-encoded)
        if (e.target) {
          setItr(e.target.result as string)
          try {
            // Assuming handleFileUpload is an asynchronous function that returns a promise
            const imageLink = await handleFileUpload(file)

            // Update the form data with the image link
            setFormData({ ...formData, itr: imageLink })
            onDataChange({ ...formData, itr: imageLink })
          } catch (error) {
            console.error('Error uploading image:', error)
          }
        }
      }

      reader.readAsDataURL(file)
    }
  }
  const handleItrUpload = () => {
    // Trigger the hidden file input
    if (itrFileInputRef.current) {
      itrFileInputRef.current.click()
    }
  }

  const handleLetterSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
      const reader = new FileReader()

      reader.onload = async (e) => {
        // Update the state variable with the image data (base64-encoded)
        if (e.target) {
          setLetter(e.target.result as string)
          try {
            // Assuming handleFileUpload is an asynchronous function that returns a promise
            const imageLink = await handleFileUpload(file)

            // Update the form data with the image link
            setFormData({ ...formData, letter: imageLink })
            onDataChange({ ...formData, letter: imageLink })
          } catch (error) {
            console.error('Error uploading image:', error)
          }
        }
      }

      reader.readAsDataURL(file)
    }
  }
  const handleLetterUpload = () => {
    // Trigger the hidden file input
    if (letterFileInputRef.current) {
      letterFileInputRef.current.click()
    }
  }

  const handleTicketsSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
      const reader = new FileReader()

      reader.onload = async (e) => {
        // Update the state variable with the image data (base64-encoded)
        if (e.target) {
          setTickets(e.target.result as string)
          try {
            // Assuming handleFileUpload is an asynchronous function that returns a promise
            const imageLink = await handleFileUpload(file)

            // Update the form data with the image link
            setFormData({ ...formData, tickets: imageLink })
            onDataChange({ ...formData, tickets: imageLink })
          } catch (error) {
            console.error('Error uploading image:', error)
          }
        }
      }

      reader.readAsDataURL(file)
    }
  }
  const handleTicketsUpload = () => {
    // Trigger the hidden file input
    if (ticketsFileInputRef.current) {
      ticketsFileInputRef.current.click()
    }
  }

  // Function to handle file selection
  const handlePanSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
      const reader = new FileReader()
      reader.onload = async (e) => {
        if (e.target) {
          setPan(e.target.result as string)

          try {
            // Assuming handleFileUpload is an asynchronous function that returns a promise
            const imageLink = await handleFileUpload(file)

            // Update the form data with the image link
            setFormData({ ...formData, panPhoto: imageLink })
            onDataChange({ ...formData, panPhoto: imageLink })
          } catch (error) {
            console.error('Error uploading image:', error)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePanUpload = () => {
    // Trigger the hidden file input
    if (panFileInputRef.current) {
      panFileInputRef.current.click()
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

  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  const disabledDates = (current) => {
    return current && current < moment().endOf('day');
  };


  return (
    <div
      className='py-10 px-20'
      style={{
        borderRadius: 20,
        borderColor: '#f2f2f2',
        width: "100%",
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        margin: "0 auto",
        marginTop: 50,
        backgroundColor: 'white',
      }}
    >
      <Toaster />
      <h5 style={{fontSize: 30, letterSpacing: 0.3}}>Traveller {ind + 1} </h5>
      <hr
        style={{
          width: '100%',
          border: 0,
          height: '1px',
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0))',
        }}
      />
      <br />
      <div className='d-flex w-100 flex-column'>
        <div style={{width: '100%'}}>
          <h6>Passport Front Page Image</h6>
          {loading ? (
            <div style={{color: '#000'}}>Loading...</div>
          ) : passportFrontImageURL ? (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <div
                  onClick={() => {
                    setPassportFrontImageURL('');
                    handleFileDelete('passFrontPhoto');
                  }}
                style={{
                  justifyContent: 'flex-end',
                  position: 'relative',
                  backgroundColor: 'white',
                  padding: 7,
                  borderRadius: 50,
                  left: '10px',
                  width: '35px',
                  zIndex: '1',
                  cursor: 'pointer',
                }}
              >
                <ClearIcon style={{color: 'red'}} />
              </div>
              <img
                src={passportFrontImageURL}
                alt='Uploaded Image'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  position: 'relative',
                  marginTop: '-35px',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                border: '2px dashed gray',
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
                style={{justifyContent: 'flex-end', backgroundColor: '#327113'}}
              >
                <span className='indicator-label'>Select Files</span>
              </button>
              <p className='text-bold pt-5 fs-9' style={{color: '#555555'}}>
                Supports Image only.
              </p>
              <input
                type='file'
                ref={passportFrontFileInputRef}
                style={{display: 'none'}}
                accept='image/*'
                onChange={handleFileSelect}
              />
            </div>
          )}
        </div>

        <div
          className='d-flex flex-row-fluid flex-center bg-body rounded'
          style={{width: '100%', backgroundColor: 'blue'}}
        >
          <Formik
            initialValues={initValues}
            onSubmit={() => {}}
            validationSchema={validationSchema}
          >
            {() => (
              <Form className='py-20 px-9 w-100' noValidate id='kt_create_account_form'>
                <div>
                  <div className='fv-row gap-8 w-100 mb-5'>
                    <label className='d-flex align-items-center form-label'>
                      <span className='required'>Passport Number</span>
                    </label>

                    <Field
                      style={{...inputStyle}}
                      name='passportNumber'
                      className='form-control form-control-lg form-control-solid'
                      onChange={(e) => handleFieldChange('passportNumber', e.target.value)}
                    />
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='passportNumber' />
                    </div>
                  </div>
                  <div className='d-flex gap-8'>
                    <div className='fv-row gap-8 w-100 mb-5'>
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
                    <div className='fv-row gap-8 w-100 mb-5'>
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

                  <div className='d-flex gap-8'>
                    <div className='fv-row gap-8 w-100 mb-5'>
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
                    <div className='fv-row gap-8 w-100 mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Date of Birth</span>
                      </label>

                      <DatePicker
                        style={{
                          backgroundClip: '#fff',
                          width: "100%",
                          marginTop: 2,
                          border: '1.5px solid #d3d3d3',
                          borderRadius: 10,
                          padding: 10,
                        }}
                        disabledDate={disabledDate}
                        onChange={(value) => {
                          if (value) {
                            handleFieldChange('birthDetail', value.format('YYYY-MM-DD'))
                          }
                        }}
                      />

                      <div className='text-danger mt-2'>
                        <ErrorMessage name='birthDetail' />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex gap-8'>
                    <div className='fv-row gap-8 w-100 mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Passport Issue Date</span>
                      </label>
                      <DatePicker
                        style={{
                          backgroundClip: '#fff',
                          width: "100%",
                          marginTop: 2,
                          border: '1.5px solid #d3d3d3',
                          borderRadius: 10,
                          padding: 10,
                        }}
                        disabledDate={disabledDate}
                        onChange={(value) => {
                          if (value) {
                            handleFieldChange('passportIssueDate', value.format('YYYY-MM-DD'))
                          }
                        }}
                      />

                      <div className='text-danger mt-2'>
                        <ErrorMessage name='passportIssueDate' />
                      </div>
                    </div>

                    <div className='fv-row gap-8 w-100 mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Passport Expiry Date</span>
                      </label>
                      <DatePicker
                        style={{
                          backgroundClip: '#fff',
                          width: "100%",
                          marginTop: 2,
                          border: '1.5px solid #d3d3d3',
                          borderRadius: 10,
                          padding: 10,
                        }}
                        disabledDate={disabledDates}
                        onChange={(value) => {
                          if (value) {
                            handleFieldChange('passPortExpiryDate', value.format('YYYY-MM-DD'))
                          }
                        }}
                      />

                      <div className='text-danger mt-2'>
                        <ErrorMessage name='passPortExpiryDate' />
                      </div>
                    </div>
                  </div>
                  <div className='d-flex gap-8'>
                    <div className='fv-row gap-8 w-100 mb-10'>
                      <label className='form-label required'>Gender</label>

                      <Field
                        as='select'
                        name='gender'
                        style={{...inputStyle, width: '100%', backgroundColor: 'white'}}
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
                    <div className='fv-row gap-8 w-100 mb-10'>
                      <label className='form-label required'>Marital Status</label>

                      <Field
                        as='select'
                        style={{...inputStyle, width: '100%', backgroundColor: 'white'}}
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


      <div className='d-flex flex-column w-100'>
        <div style={{width: '100%', marginTop: 20}}>
          <h6>Passport Back Page Image</h6>

          {loading ? (
            <div style={{color: '000'}}>Loading...</div>
          ) : passportBackImageURL ? (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <div
                onClick={() => {
                  setPassportBackImageURL('');
                  handleFileDelete('passBackPhoto');
                }}
                style={{
                  justifyContent: 'flex-end',
                  position: 'relative',
                  backgroundColor: 'white',
                  padding: 7,
                  borderRadius: 50,
                  left: '10px',
                  width: '35px',
                  zIndex: '1',
                  cursor: 'pointer',
                }}
              >
                <ClearIcon style={{color: 'red'}} />
              </div>

              <img
                src={passportBackImageURL}
                alt='Uploaded Image'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  position: 'relative',
                  marginTop: '-35px',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: 40,
                marginTop: 20,
              }}
            >
              <h4 className='mx-10 mt-10'>Passport Back Photo</h4>
              <button
                type='button'
                onClick={handleImageUploadBack}
                className='btn btn-lg btn-success me-3 mt-7'
                style={{justifyContent: 'flex-end', backgroundColor: '#327113'}}
              >
                <span className='indicator-label'>Select Files</span>
              </button>
              <p className='text-bold pt-5 fs-9' style={{color: '#555555'}}>
                Supports Image Only.
              </p>
              <input
                type='file'
                ref={passportBackFileInputRef}
                style={{display: 'none'}}
                accept='image/*'
                onChange={handleFileSelectBack}
              />
            </div>
          )}
        </div>

        <div
          className='d-flex flex-row-fluid flex-center bg-body rounded'
          style={{width: '100%', backgroundColor: 'blue'}}
        >
          <Formik
            initialValues={initValues}
            onSubmit={() => {}}
            validationSchema={validationSchema}
          >
            {() => (
              <Form className='py-20 px-9 w-100' noValidate id='kt_create_account_form'>
                <div className='fv-row gap-8 w-100 mb-10'>
                  <label className='d-flex align-items-center form-label'>
                    <span className='required'>Father's Name</span>
                  </label>

                  <Field
                    style={{...inputStyle}}
                    name='fatherName'
                    className='form-control form-control-lg form-control-solid'
                    onChange={(e) => handleFieldChange('fatherName', e.target.value)}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='fatherName' />
                  </div>
                </div>

                <div className='fv-row gap-8 w-100 mb-10'>
                  <label className='d-flex align-items-center form-label'>
                    <span className='required'>Mother's Name</span>
                  </label>

                  <Field
                    style={{...inputStyle}}
                    name='motherName'
                    className='form-control form-control-lg form-control-solid'
                    onChange={(e) => handleFieldChange('motherName', e.target.value)}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='motherName' />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <div className='d-flex w-100 flex-column'>
        <div style={{width: '100%', marginTop: 20}}>
          <h6>Pan Card Photo</h6>
          {loading ? (
            <div style={{color: '000'}}>Loading...</div>
          ) : pan ? (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <div
                onClick={() => setPan('')}
                style={{
                  justifyContent: 'flex-end',
                  position: 'relative',
                  backgroundColor: 'white',
                  padding: 7,
                  borderRadius: 50,
                  left: '10px',
                  width: '35px',
                  zIndex: '1',
                  cursor: 'pointer',
                }}
              >
                <ClearIcon style={{color: 'red'}} />
              </div>
              <img
                src={pan}
                alt='Uploaded Image'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  position: 'relative',
                  marginTop: '-35px',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: 40,
                marginTop: 20,
              }}
            >
              <h4 className='mx-10 mt-10'>PAN Card Photo</h4>
              <button
                type='button'
                onClick={handlePanUpload}
                className='btn btn-lg btn-success me-3 mt-7'
                style={{justifyContent: 'flex-end', backgroundColor: '#327113'}}
              >
                <span className='indicator-label'>Select Files</span>
              </button>
              <p className='text-bold pt-5 fs-9' style={{color: '#555555'}}>
                Supports Image Only.
              </p>
              <input
                type='file'
                ref={panFileInputRef}
                style={{display: 'none'}}
                accept='image/*'
                onChange={handlePanSelect}
              />
            </div>
          )}
        </div>
        <div>
          <Formik
            initialValues={initValues}
            onSubmit={() => {}}
            validationSchema={validationSchema}
          >
            {() => (
              <Form className='py-20 px-9 w-100' noValidate id='kt_create_account_form'>
                <div className='fv-row gap-8 w-100 mb-10'>
                  <label className='d-flex align-items-center form-label'>
                    <span className='required'>PAN Number</span>
                  </label>

                  <Field
                    style={{...inputStyle}}
                    name='panNo'
                    className='form-control form-control-lg form-control-solid'
                    onChange={(e) => handleFieldChange('panNo', e.target.value)}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='businessDescriptor' />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <div className='d-flex w-100 mb-10 flex-column'>
        <div style={{width: '100%', marginTop: 20}}>
          <h6>Photo</h6>
          {loading ? (
            <div style={{color: '000'}}>Loading...</div>
          ) : photo ? (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <div
                onClick={() => {
                  setPhoto('');
                  handleFileDelete('travelerPhoto');
                }}
                style={{
                  justifyContent: 'flex-end',
                  position: 'relative',
                  backgroundColor: 'white',
                  padding: 7,
                  borderRadius: 50,
                  left: '10px',
                  width: '35px',
                  zIndex: '1',
                  cursor: 'pointer',
                }}
              >
                <ClearIcon style={{color: 'red'}} />
              </div>

              <img
                src={photo}
                alt='Uploaded Image'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  position: 'relative',
                  marginTop: '-35px',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: 40,
                marginTop: 20,
              }}
            >
              <h4 className='mx-10 mt-10'>Traveller Photo</h4>
              <button
                type='button'
                onClick={handlePhotoUpload}
                className='btn btn-lg btn-success me-3 mt-7'
                style={{justifyContent: 'flex-end', backgroundColor: '#327113'}}
              >
                <span className='indicator-label'>Select Files</span>
              </button>
              <p className='text-bold pt-5 fs-9' style={{color: '#555555'}}>
                Supports Image Only.
              </p>
              <input
                type='file'
                ref={photoFileInputRef}
                style={{display: 'none'}}
                accept='image/*'
                onChange={handlePhotoSelect}
              />
            </div>
          )}
        </div>
      </div>

      {selectedEntry.itr_doc && (
        <>
        <div className='d-flex w-100 mb-10 flex-column'>
        <div style={{width: '100%', marginTop: 20}}>
          <h6>ITR Document</h6>
          {loading ? (
            <div style={{color: '000'}}>Loading...</div>
          ) : itr ? (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <div
                onClick={() => {
                  setItr('');
                  handleFileDelete('itr');
                }}
                style={{
                  justifyContent: 'flex-end',
                  position: 'relative',
                  backgroundColor: 'white',
                  padding: 7,
                  borderRadius: 50,
                  left: '10px',
                  width: '35px',
                  zIndex: '1',
                  cursor: 'pointer',
                }}
              >
                <ClearIcon style={{color: 'red'}} />
              </div>

              <img
                src={itr}
                alt='Uploaded Image'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  position: 'relative',
                  marginTop: '-35px',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: 40,
                marginTop: 20,
              }}
            >
              <h4 className='mx-10 mt-10'>Traveller Photo</h4>
              <button
                  type='button'
                  onClick={handleItrUpload}
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
                  ref={itrFileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleItrSelect}
                />
            </div>
          )}
        </div>
      </div>
        </>
      )} 

    {selectedEntry.letter_doc && (
        <>
        <div className='d-flex w-100 mb-10 flex-column'>
        <div style={{width: '100%', marginTop: 20}}>
          <h6>Letter Document</h6>
          {loading ? (
            <div style={{color: '000'}}>Loading...</div>
          ) : letter ? (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <div
                onClick={() => {
                  setLetter('');
                  handleFileDelete('letter');
                }}
                style={{
                  justifyContent: 'flex-end',
                  position: 'relative',
                  backgroundColor: 'white',
                  padding: 7,
                  borderRadius: 50,
                  left: '10px',
                  width: '35px',
                  zIndex: '1',
                  cursor: 'pointer',
                }}
              >
                <ClearIcon style={{color: 'red'}} />
              </div>

              <img
                src={itr}
                alt='Uploaded Image'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  position: 'relative',
                  marginTop: '-35px',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: 40,
                marginTop: 20,
              }}
            >
              <h4 className='mx-10 mt-10'>Traveller Photo</h4>
              <button
                  type='button'
                  onClick={handleLetterUpload}
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
                  ref={letterFileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleLetterSelect}
                />
            </div>
          )}
        </div>
      </div>
        </>
      )} 

      {selectedEntry.ticket_doc && (
        <>
        <div className='d-flex w-100 mb-10 flex-column'>
        <div style={{width: '100%', marginTop: 20}}>
          <h6>Ticket Document</h6>
          {loading ? (
            <div style={{color: '000'}}>Loading...</div>
          ) : tickets ? (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <div
                onClick={() => {
                  setTickets('');
                  handleFileDelete('ticket');
                }}
                style={{
                  justifyContent: 'flex-end',
                  position: 'relative',
                  backgroundColor: 'white',
                  padding: 7,
                  borderRadius: 50,
                  left: '10px',
                  width: '35px',
                  zIndex: '1',
                  cursor: 'pointer',
                }}
              >
                <ClearIcon style={{color: 'red'}} />
              </div>

              <img
                src={tickets}
                alt='Uploaded Image'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  position: 'relative',
                  marginTop: '-35px',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: 40,
                marginTop: 20,
              }}
            >
              <h4 className='mx-10 mt-10'>Tickets</h4>
              <button
                  type='button'
                  onClick={handleTicketsUpload}
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
                  ref={ticketsFileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleTicketsSelect}
                />
            </div>
          )}
        </div>
      </div>
        </>
      )} 
    </div>
  )
}

export default TravelerForm1
