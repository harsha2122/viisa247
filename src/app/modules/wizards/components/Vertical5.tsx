import {useEffect, useState, useRef, ChangeEvent} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import Cookies from 'js-cookie'
import toast, {Toaster} from 'react-hot-toast'
import { ErrorMessage, Field, Form, Formik, FormikValues } from 'formik'
import { ICreateAccount, inits } from './CreateAccountWizardHelper'
import * as Yup from 'yup';
import axiosInstance from '../../../helpers/axiosInstance'
import ClearIcon from '@mui/icons-material/Delete'
import {CheckCircleOutline, CircleOutlined} from '@mui/icons-material'
import Loader from '../../../components/Loader'
import {Box, Step, StepLabel, Stepper, Theme, Typography} from '@mui/material'
import TravelerForm2 from './TravelerForm2'
import qr from '../../../../_metronic/assets/card/qr.png'
import { Modal, Button } from 'react-bootstrap';
import Confetti from 'react-confetti'

const inputStyle = {
    border: '1.5px solid #d3d3d3', // Border width and color
    borderRadius: '15px', // Border radius
    padding: '10px',
    paddingLeft: '20px', // Padding
    width: '90%', // 100% width
    boxSizing: 'border-box', // Include padding and border in the width calculation
  }

interface VerticalProps {
  selectedEntry: any
  show: (value: boolean) => void
  visaList: boolean
  visaListLoader: (value: boolean) => void
  showfinalSubmitLoader: (value: boolean) => void
}

interface SelectedEntry {
    day: number;
    entryType: string;
    country: string;
    description: string;
    receipt: {
      'Service Fees': number;
      'Visa Fees': number;
    };
    value: string;
    country_code: string;
    nationality_code: string;
    application_arrival_date: string;
    application_departure_date: string;
  }
  

const Vertical5: React.FC<VerticalProps> = ({
  showfinalSubmitLoader,
  visaList,
  visaListLoader,
  show,
}) => {
  const handleTravelerDataChange = (data, travelerIndex) => {
    setTravelerForms((prevForms) => {
      const updatedData = [...prevForms]
      updatedData[travelerIndex] = data
      return updatedData
    })
  }
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleFieldChange = (fieldName, value) => {
    setFormValues({ ...formValues, [fieldName]: value })
  }
  const [applicantForms, setApplicantForms] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [initValues] = useState<ICreateAccount>(inits)
  // const [travelerForms, setTravelerForms] = useState([<TravelerForm key={0} onDataChange={handleTravelerDataChange} />]);
  const recieptFileInputRef = useRef<HTMLInputElement | null>(null)
  const [reciept, setReciept] = useState('')
  const maxSize = 1024 * 1024
  const [confetti, setConfetti] = useState(false)
  const navigate = useNavigate()
  const [selectedEntry, setSelectedEntry] = useState<SelectedEntry | null>(null);
  const [travelerForms, setTravelerForms] = useState<any[]>([{}])
  const [isFixed, setIsFixed] = useState(false)

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset
    setIsFixed(scrollY >= 180)
  }

  const location = useLocation()
  useEffect(() => {
    // Check if location.state has data and update selectedEntry state
    if (location.state) {
      setSelectedEntry(location.state as SelectedEntry);
    }
  }, [location.state]);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleReviewModal = () => {
    const formData = travelerForms.map((form) => ({
      firstName: form.firstName,
      lastName: form.lastName,
      birthPlace: form.birthPlace,
      birthDetail: form.birthDetail,
      passportNumber: form.passportNumber,
      passportIssueDate: form.passportIssueDate,
      passPortExpiryDate: form.passPortExpiryDate,
      fatherName: form.fatherName,
      motherName: form.motherName,
      gender: form.gender,
      maritalStatus: form.maritalStatus,
      passportFront: form.passport_front,
      panCard: form.pan_card,
      passBackPhoto: form.passport_back,
      photo: form.photo,
      panNo: form.panNo
    }));
    setInsuranceFormData(formData);
    handleShowReviewModal();
  };
  
  
  const [insuranceFormData, setInsuranceFormData] = useState<any | null>(null);
  const [isReviewModal, setIsReviewModal] = useState<boolean>(false);  
  const handleShowReviewModal = () => setIsReviewModal(true);
  const handleCloseReviewModal = () => setIsReviewModal(false);

  const handleFileUpload = async (file) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('file', file)
      const response = await axiosInstance.post('/backend/upload_image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const fileUrl = response.data.data
      setLoading(false)
      return fileUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      setLoading(false)
      return ''
    }
  }

  const handleRecieptSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        })
        return
      }
      const reader = new FileReader()
      reader.onload = async (e) => {
        if (e.target) {
          try {
            const imageLink = await handleFileUpload(file)
            setReciept(imageLink)
          } catch (error) {
            console.error('Error uploading image:', error)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRecieptUpload = () => {
    if (recieptFileInputRef.current) {
      recieptFileInputRef.current.click()
    }
  }

  const markup_percentage = localStorage.getItem('markup_percentage') ?? '1'

  const additionalFees =
  Number(selectedEntry?.receipt['Visa Fees'] ?? 0) +
  Number(selectedEntry?.receipt['Service Fees'] ?? 0);


  const totalAmount = travelerForms.length * additionalFees

  const addTravelerForm = () => {
    setTravelerForms((prevForms) => [...prevForms, {}])
  }

  const [currentWallet, setCurrentWallet] = useState('')
  function formatDateWithTimezoneToYMD(dateString) {
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    return null
  }
  const formatDate1 = (dateString) => {
    const date = new Date(dateString)
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const month = monthNames[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  const handleReviewAndSave = async (values) => {
    try {
      setLoading(true);

      for (const travelerForm of travelerForms) {
        if (!travelerForm.firstName || !travelerForm.lastName || !travelerForm.birthPlace ||
          !travelerForm.birthDetail || !travelerForm.passportNumber ||
          !travelerForm.passportIssueDate || !travelerForm.passPortExpiryDate ||
          !travelerForm.gender || !travelerForm.maritalStatus || !travelerForm.fatherName ||
          !travelerForm.passFrontPhoto || !travelerForm.panNo || !travelerForm.passBackPhoto) {
          toast.error('All fields are required!', { position: 'top-center' });
          setLoading(false);
          return;
        }
        const registerResponse = await axiosInstance.post('/backend/create_normal_user', {
            user_name: formValues.name,
            user_email_id: formValues.email,
            user_phone_number: formValues.phone,
            user_profile_photo: travelerForm.travelerPhoto
          });
          
          let userId = registerResponse.data.data._id;

        const postData = {
          country_code: selectedEntry?.country_code ?? '',
          entry_process: selectedEntry?.value ?? '',
          nationality_code: selectedEntry?.nationality_code ?? '',
          first_name: travelerForm.firstName,
          last_name: travelerForm.lastName,
          birth_place: travelerForm.birthPlace,
          birthday_date: formatDateWithTimezoneToYMD(travelerForm.birthDetail),
          nationality: selectedEntry?.nationality_code ?? '',
          passport_number: travelerForm.passportNumber,
          passport_issue_date: formatDateWithTimezoneToYMD(travelerForm.passportIssueDate),
          passport_expiry_date: formatDateWithTimezoneToYMD(travelerForm.passPortExpiryDate),
          gender: travelerForm.gender,
          marital_status: travelerForm.maritalStatus,
          application_arrival_date: formatDateWithTimezoneToYMD(selectedEntry?.application_arrival_date ?? ''),
          application_departure_date: formatDateWithTimezoneToYMD(selectedEntry?.application_departure_date ?? ''),
          application_destination: selectedEntry?.country_code ?? '',
          fathers_name: travelerForm.fatherName,
          mothers_name: travelerForm.motherName,
          passport_front: travelerForm.passFrontPhoto,
          passport_back: travelerForm.passBackPhoto,
          pan_card: travelerForm.panPhoto,
          panNo: travelerForm.panNo,
          photo: travelerForm.travelerPhoto,
          itr: travelerForm.itr,
          visa_amount: Math.ceil(selectedEntry?.receipt?.['Visa Fees'] ?? 0) + (selectedEntry?.receipt?.['Service Fees'] ?? 0),
          markup_visa_amount: Math.ceil((selectedEntry?.receipt?.['Visa Fees'] ?? 0) * (parseFloat(markup_percentage) ? 1 + parseFloat(markup_percentage) / 100 : 1)) + (selectedEntry?.receipt?.['Service Fees'] ?? 0),
          visa_description: selectedEntry?.description ?? '',
          receipt_url: reciept,
        };

        const response = await axiosInstance.post('/backend/create_user_application', postData);

        if (response.status === 200) {
          const data = {
            user_id: userId,
            application_id: response.data.data,
          };

          const patchResponse = await axiosInstance.patch('/backend/add_user_applicant', data);

          if (patchResponse.status === 200) {
            toast.success('Visa Applied Succesfully')
            setConfetti(true);
            setTimeout(() => {
              setConfetti(false);
              window.location.href = '/';
            }, 4000);
          } else {
            toast.error(patchResponse.data.msg, { position: 'top-center' });
          }
        } else {
          toast.error(response.data.msg, { position: 'top-center' });
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error while making API calls:', error);
      toast.error('Error while making API calls', { position: 'top-center' });
      setLoading(false);
    }
  };

  const handleDeleteForm = (index) => {
    setTravelerForms((prevForms) => {
      const updatedData = [...prevForms]
      updatedData.splice(index, 1)
      return updatedData
    })
  }

  const toggleMenu = () => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
      mobileMenu.classList.toggle('hamburger-open');
    }
  };

  const handleLoginClick = () => {
    navigate('/customer/login')
  };

  const stepsContent = [
    {
      title: 'Auto-validation upon submission',
      description:
        'Visa 247 performs automated validation after submission. We will let you know if there are any problems with the application.',
    },
    {
      title: 'Visa processed within 30 seconds',
      description: 'Visa 247 automatically processes your visa.',
    },
    {
      title: 'Non-refundable after you pay',
      description: 'If canceled after payment, you will not be refunded.',
    },
  ]

  const tabTextStyle = {
    color: '#000',
    cursor: 'pointer',
    padding: '8px',
    fontSize: 16,
    fontWeight: 'bold',
  }

  return (
    <div style={{backgroundColor: '#fff'}} className='w-full'>
      {confetti && <Confetti />}
      <Toaster />
      <div id="nav1">
        <a href='/' className="part11">
            <img className="logo" src="./media/logos/logo.png" alt="logo" />
        </a>

        <div className="part21">
          <button className="button2" onClick={handleLoginClick}>
            Login
          </button>
        </div>

        <i className="ri-menu-3-fill hamburger" onClick={toggleMenu}></i>
        <div id="mobile-menu">
            <a href="#">Home</a>
            <a href="#">Sign up</a>
            <a href="#">Login</a>
        </div>
        </div>
      <div className='d-flex' style={{justifyContent: 'space-between', width: '95%'}}>
        <div
          style={{
            width: '20%',
            padding: '16px',
            paddingLeft: '10px',
            position: isFixed ? 'fixed' : 'static',
            height: '100%',
            overflowY: 'auto',
            paddingTop: 20,
            top: isFixed ? 80 : 'auto',
          }}
        >
          {travelerForms.map((_, index) => (
            <>
              <div onClick={() => {}} style={{...tabTextStyle}}>
                <CheckCircleOutline style={{color: '#327113', marginRight: 8}} />
                Traveller {index + 1}
              </div>
              <div style={{marginLeft: 20}}>
                <div onClick={() => {}} style={{...tabTextStyle}}>
                  <CheckCircleOutline style={{color: '#327113', marginRight: 10}} />
                  Passport
                </div>
                <div onClick={() => {}} style={{...tabTextStyle}}>
                  <CheckCircleOutline style={{color: '#327113', marginRight: 10}} />
                  Passport Back
                </div>
                <div onClick={() => {}} style={{...tabTextStyle}}>
                  <CheckCircleOutline style={{color: '#327113', marginRight: 10}} />
                  Indian PAN Card
                </div>
                <div onClick={() => {}} style={{...tabTextStyle}}>
                  <CheckCircleOutline style={{color: '#327113', marginRight: 10}} />
                  Traveller Photo
                </div>
              </div>
            </>
          ))}
          <div onClick={() => {}} style={{...tabTextStyle}}>
            <CheckCircleOutline style={{color: '#327113', marginRight: 10}} />
            Review
          </div>
          <div onClick={() => {}} style={{...tabTextStyle, color: '#696969'}}>
            <CircleOutlined style={{color: '#327113', marginRight: 10}} />
            Submit
          </div>
        </div>

        <div style={{width: '80%', paddingBottom: '5%', marginLeft: isFixed ? '20%' : '0%'}}>
        <Formik initialValues={initValues} onSubmit={() => { }}
          >
            <Form className='py-10 px-20' style={{ borderRadius: 20, borderColor: '#f2f2f2', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', marginLeft: 10, marginTop: 10, backgroundColor: 'white' }}>
                <div className='w-100 mb-12'>
                <h1>Please Fill the form below to apply for visa</h1>
                </div>
                <div className='d-flex w-100'>
                <div className='fv-row mb-5 w-50'>
                    <label className='form-label required'>Name</label>
                    <Field onChange={(e) => handleFieldChange('name', e.target.value)} name='name' style={inputStyle} className='form-control form-control-lg form-control-solid' />
                    <div className='text-danger mt-2'>
                    <ErrorMessage name='name' />
                    </div>
                </div>
                <div className='fv-row mb-5 w-50'>
                    <label className='form-label required'>Email</label>
                    <Field onChange={(e) => handleFieldChange('email', e.target.value)} name='email' style={inputStyle} className='form-control form-control-lg form-control-solid' />
                    <div className='text-danger mt-2'>
                    <ErrorMessage name='email' />
                    </div>
                </div>
                </div>
                <div className='d-flex w-100'>
                <div className='fv-row mb-5 w-50'>
                    <label className='form-label required'>Phone</label>
                    <Field onChange={(e) => handleFieldChange('phone', e.target.value)} type="number" maxLength={10} name='phone' style={inputStyle} className='form-control form-control-lg form-control-solid' />
                    <div className='text-danger mt-2'>
                    <ErrorMessage name='phone' />
                    </div>
                </div>
                </div>
            </Form>
            </Formik>

          {travelerForms.map((_, index) => (
            <>
              <div key={index}>
                <TravelerForm2
                  ind={index}
                  onDataChange={(newData) => handleTravelerDataChange(newData, index)}
                />
                {travelerForms.length > 1 && index !== 0 && (
                  <button
                    onClick={() => handleDeleteForm(index)}
                    style={{
                      color: '#ffffff',
                      padding: '7px 10px',
                      border: 'none',
                      backgroundColor: 'red',
                      width: '100px',
                      borderRadius: '5px',
                      marginLeft: '20px',
                      marginTop: '20px',
                      fontSize: '16px',
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          ))}
          <div
            style={{alignItems: 'center'}}
            className='d-flex flex-column w-50 my-8 justify-content-start'
          >
            <h1>Upload Reciept</h1>
            <div className='d-flex flex-column align-items-center gap-4 w-100 '>
              <img width='200px' src={qr} alt='qr-code' />
            </div>
            <div style={{width: '60%', marginLeft: '25px', marginTop: '30px'}}>
              <h6>Reciept</h6>
              {loading ? (
                <div style={{color: '#000'}}>Loading...</div>
              ) : reciept ? (
                <div
                  style={{
                    border: '4px dotted gray',
                    width: '100%',
                    height: 200,
                    borderRadius: '10px',
                    justifyContent: 'center',
                    textAlign: 'center',
                    marginTop: 20,
                  }}
                >
                  <div
                    onClick={() => setReciept('')}
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
                    src={reciept}
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
                    border: '4px dotted gray',
                    width: '100%',
                    height: 200,
                    borderRadius: '10px',
                    justifyContent: 'center',
                    textAlign: 'center',
                    marginTop: 20,
                  }}
                >
                  <h4 className='mx-10 mt-10'>Reciept Photo</h4>
                  <button
                    type='button'
                    onClick={handleRecieptUpload}
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
                    ref={recieptFileInputRef}
                    style={{display: 'none'}}
                    accept='image/*'
                    onChange={handleRecieptSelect}
                  />
                </div>
              )}
            </div>
          </div>
          <div className='d-flex my-10' style={{justifyContent: 'flex-end', display: 'flex'}}>
            <div
              onClick={addTravelerForm}
              style={{
                height: 40,
                paddingLeft: 15,
                paddingRight: 15,
                border: '1px solid',
                borderColor: '#696969',
                borderRadius: 10,
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#fff',
                cursor: 'pointer',
              }}
            >
              <h6 className='fs-4' style={{color: '#327113', paddingTop: 5, fontSize: 10}}>
                + Add Another Traveller
              </h6>
            </div>
          </div>

          <div className='d-flex'>
            <div
              className='py-10 px-20'
              style={{
                borderRadius: 15,
                borderColor: '#696969',
                boxShadow: '4px 4px 15px rgba(0, 0, 0, 0.1)',
                marginLeft: 10,
                backgroundColor: 'white',
                width: '60%',
              }}
            >
              <div>
                <h2>Visa Information</h2>
                <p style={{ paddingTop: 5, lineHeight: 2, paddingBottom: 5 }}>
                {selectedEntry && (
                    <>
                    {selectedEntry.country_code} - {selectedEntry.description}
                    <br />
                    Travelers: {travelerForms.length}
                    <br />
                    {selectedEntry.application_arrival_date &&
                    selectedEntry.application_departure_date &&
                    typeof selectedEntry.application_arrival_date === 'string' &&
                    typeof selectedEntry.application_departure_date === 'string' ? (
                        <>
                        Travel Dates: {formatDate1(selectedEntry.application_arrival_date)} -{' '}
                        {formatDate1(selectedEntry.application_departure_date)}
                        </>
                    ) : (
                        'Travel Dates: N/A'
                    )}
                    </>
                )}
                </p>

              </div>

              <hr
                style={{
                  width: '100%',
                  border: 0,
                  height: '1px',
                  backgroundImage:
                    'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))',
                }}
              />

              <div style={{paddingTop: 10, paddingBottom: 1}}>
                <h2>Expected Visa Approval</h2>
                <p>30days if submitted now!</p>
              </div>
              <hr
                style={{
                  width: '100%',
                  border: 0,
                  height: '1px',
                  backgroundImage:
                    'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))',
                }}
              />
              <div>
                <h2 style={{paddingTop: 10, paddingBottom: 1}}>Application Details</h2>
                <br />
                <Stepper orientation='vertical'>
                  {stepsContent.map((step, index) => (
                    <Step key={index}>
                      <StepLabel>
                        <Box display='flex' flexDirection='column' alignItems='flex-start'>
                          <Typography variant='h6'>{step.title}</Typography>
                          <Typography>{step.description}</Typography>
                        </Box>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
            </div>
            <div
              className='py-5 px-5'
              style={{
                borderRadius: 10,
                borderColor: '#f5f5f5',
                boxShadow: '4px 4px 15px rgba(0, 0, 0, 0.1)',
                marginLeft: '10%',
                backgroundColor: 'white',
                height: 'max-content',
                marginBottom: 20,
                width: '30%',
              }}
            >
              <h2 style={{fontSize: 20, marginBottom: 20}}>Price Details</h2>
              <div
                style={{
                  padding: 20,
                  backgroundColor: 'rgb(50 113 19 / 22%)',
                  borderRadius: 10,
                  paddingTop: 30,
                }}
              >
                {travelerForms.map((traveler, index) => (
                  <div
                    key={index}
                    className='d-flex'
                    style={{justifyContent: 'space-between', width: '100%'}}
                    >
                      <h5>Traveler {index + 1}:</h5>
                      <h5>
                        {(
                          Number(selectedEntry?.receipt?.['Visa Fees'] ?? 0) +
                          Number(selectedEntry?.receipt?.['Service Fees'] ?? 0)
                        ).toFixed(0)}
                        /-
                      </h5>


                  </div>
                ))}

                <div className='d-flex' style={{justifyContent: 'space-between', width: '100%'}}>
                  <h5>Total: </h5>
                  <h5>{totalAmount.toFixed(0)}/-</h5>
                </div>
                <hr
                  style={{
                    width: '100%',
                    border: 0,
                    height: '1px',
                    margin: '18px 0',
                    backgroundImage:
                      'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))',
                  }}
                />
                <div className='d-flex' style={{justifyContent: 'space-between', width: '100%'}}>
                  <p>
                    Amount Will be paid via QR Code and Reciept Screenshot will be uploaded by
                    customer
                  </p>
                </div>
              </div>
              <div
                onClick={handleReviewModal}
                className='mt-10'
                style={{
                  height: 40,
                  width: 190,
                  marginBottom: 20,
                  border: '1px solid',
                  margin: '0 auto',
                  borderColor: '#696969',
                  borderRadius: 10,
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor: '#327113',
                  cursor: 'pointer',
                }}
              >
                <h6 className='fs-4' style={{color: 'white', paddingTop: 7}}>
                  Review and Save
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className='loader-overlay'>
          <Loader loading={loading} />
        </div>
      )}
      <Modal show={isReviewModal} onHide={() => setIsReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Review Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {insuranceFormData && insuranceFormData.map((data, index) => (
            <div key={index}>
              <hr className='ahr'/>
              <p><strong>First Name:</strong> {data.firstName}</p>
              <p><strong>Last Name:</strong> {data.lastName}</p>
              <p><strong>Birth Place:</strong> {data.birthPlace}</p>
              <p><strong>Birth Detail:</strong> {data.birthDetail}</p>
              <p><strong>Passport Number:</strong> {data.passportNumber}</p>
              <p><strong>Passport Issue Date:</strong> {data.passportIssueDate}</p>
              <p><strong>Father's Name:</strong> {data.fatherName}</p>
              <p><strong>Mother's Name:</strong> {data.motherName}</p>
              <p><strong>Passport Expiry Date:</strong> {data.passPortExpiryDate}</p>
              <p><strong>Gender:</strong> {data.gender}</p>
              <p><strong>Marital Status:</strong> {data.maritalStatus}</p>
              <p><strong>Pan Number:</strong> {data.panNo}</p>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsReviewModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReviewAndSave}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export {Vertical5}
