import {useEffect, useState, useRef, ChangeEvent} from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import toast, {Toaster} from 'react-hot-toast'
import axiosInstance from '../../../helpers/axiosInstance'
import ClearIcon from '@mui/icons-material/Delete'
import {CheckCircleOutline, CircleOutlined} from '@mui/icons-material'
import Loader from '../../../components/Loader'
import {Box, Step, StepLabel, Stepper, Theme, Typography} from '@mui/material'
import TravelerForm2 from './TravelerForm1'
import qr from '../../../../_metronic/assets/card/qr.png'
import {Modal, Button} from 'react-bootstrap'
import Confetti from 'react-confetti'
import OrderSuccess from '../../../components/OrderSuccess'

interface VerticalProps {
  selectedEntry: any
  show: (value: boolean) => void
  visaList: boolean
  visaListLoader: (value: boolean) => void
  showfinalSubmitLoader: (value: boolean) => void
}

const Vertical3: React.FC<VerticalProps> = ({
  selectedEntry,
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
  const generateGroupId = () => {
    return Math.random().toString(36).substring(2, 12);
  };
  const [applicantForms, setApplicantForms] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [combinedData, setCombinedData] = useState<any>(null);
  const recieptFileInputRef = useRef<HTMLInputElement | null>(null)
  const [reciept, setReciept] = useState('')
  const maxSize = 1024 * 1024
  const [groupId, setGroupId] = useState<string>('');
  const [insuranceResponse, setInsuranceResponse] = useState<any | null>(null);
  const [confetti, setConfetti] = useState(false)
  const navigate = useNavigate()
  const [isSuccessModal, setIsSuccessModal] = useState<boolean>(false)
  const [modalShow, setModalShow] = useState(false);
  const handleShow = () => setModalShow(true);
  const handleClose = () => {
    setModalShow(false);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  const [isFixed, setIsFixed] = useState(false)

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset
    setIsFixed(scrollY >= 180)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const newGroupId = generateGroupId();
    setGroupId(newGroupId);
  }, []);

  const [travelerForms, setTravelerForms] = useState<any[]>([{ passport_front: '', passport_back: '', photo: '' }]);
  const [isFieldFilled, setIsFieldFilled] = useState({
    passport_front: false,
    passport_back: false,
    photo: false,
  });

  const handleTravelFieldChange = (index: number, fieldName: string, value: string) => {
    setTravelerForms((prevForms) => {
      const updatedForms = [...prevForms];
      updatedForms[index] = { ...updatedForms[index], [fieldName]: value };
      return updatedForms;
    });
    setIsFieldFilled((prevState) => ({
      ...prevState,
      [`${index}_${fieldName}`]: value.trim() !== '',
    }));
  };

  const handleFileDelete = (index: number, fieldName: string) => {
    setTravelerForms((prevForms) => {
      const updatedForms = [...prevForms];
      updatedForms[index][fieldName] = '';
      return updatedForms;
    });
    setIsFieldFilled((prevState) => ({
      ...prevState,
      [`${index}_${fieldName}`]: false,
    }));
  };

  const [insuranceFormData, setInsuranceFormData] = useState<any | null>(null)
  const [isReviewModal, setIsReviewModal] = useState<boolean>(false)
  const handleShowReviewModal = () => setIsReviewModal(true)
  const handleCloseReviewModal = () => setIsReviewModal(false)

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
      panNo: form.panNo,
    }))
    setInsuranceFormData(formData)
    handleShowReviewModal()
  }

  const handleFileUpload = async (file) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('file', file)
      const response = await axiosInstance.post('/backend/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const fileUrl = response.data.url
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
    Number(selectedEntry?.receipt['Service Fees'] ?? 0)
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

  const handleReviewAndSave = async () => {
    try {
      const totalPrice = parseFloat(totalAmount.toFixed(0))
      const walletBalance = parseFloat(currentWallet)
      if (totalPrice > walletBalance) {
        toast.error('Insufficient Balance!', {
          position: 'top-center',
        })
      } else {
        setLoading(true)
        for (const travelerForm of travelerForms) {
          if (
            !travelerForm.passportNumber ||
            !travelerForm.passportIssueDate ||
            !travelerForm.passPortExpiryDate ||
            !travelerForm.gender ||
            !travelerForm.maritalStatus ||
            !travelerForm.fatherName ||
            !travelerForm.passFrontPhoto ||
            !travelerForm.passBackPhoto
          ) {
            toast.error('All fields are required!', {
              position: 'top-center',
            })
            setLoading(false)
            return
          }
          const postData = {
            country_code: selectedEntry.country_code,
            entry_process: 'tourism',
            nationality_code: selectedEntry.nationality_code,
            first_name: travelerForm.firstName,
            last_name: travelerForm.lastName,
            birth_place: travelerForm.birthPlace,
            birthday_date: formatDateWithTimezoneToYMD(travelerForm.birthDetail),
            nationality: selectedEntry.nationality_code,
            passport_number: travelerForm.passportNumber,
            group_id: groupId,
            passport_issue_date: formatDateWithTimezoneToYMD(travelerForm.passportIssueDate),
            passport_expiry_date: formatDateWithTimezoneToYMD(travelerForm.passPortExpiryDate),
            gender: travelerForm.gender,
            marital_status: travelerForm.maritalStatus,
            application_arrival_date: formatDateWithTimezoneToYMD(
              selectedEntry.application_arrival_date
            ),
            application_departure_date: formatDateWithTimezoneToYMD(
              selectedEntry.application_departure_date
            ),
            application_destination: selectedEntry.country_code,
            fathers_name: travelerForm.fatherName,
            passport_front: travelerForm.passFrontPhoto,
            passport_back: travelerForm.passBackPhoto,
            pan_card: travelerForm.panPhoto,
            panNo: travelerForm.panNo,
            photo: travelerForm.travelerPhoto,
            itr: travelerForm.itr,
            visa_amount:
              Math.ceil(
                selectedEntry.receipt['Visa Fees'] ? selectedEntry.receipt['Visa Fees'] : 0
              ) +
              (selectedEntry.receipt['Service Fees'] ? selectedEntry.receipt['Service Fees'] : 0),
            markup_visa_amount:
            Math.ceil(
              selectedEntry.receipt['Visa Fees'] ? selectedEntry.receipt['Visa Fees'] : 0
            ) +
            (selectedEntry.receipt['Service Fees'] ? selectedEntry.receipt['Service Fees'] : 0),
            visa_description: selectedEntry.description,
            receipt_url: reciept,
            original_visa_amount: selectedEntry.visa_actual_price,
          }

          const allPostData = travelerForms.map((travelerForm) => ({
            country_code: selectedEntry.country_code,
            nationality_code: selectedEntry.nationality_code,
            first_name: travelerForm.firstName,
            last_name: travelerForm.lastName,
            birth_place: travelerForm.birthPlace,
            panNo: travelerForm.panNo,
            group_id: groupId,
            birthday_date: formatDateWithTimezoneToYMD(travelerForm.birthDetail),
            nationality: selectedEntry.nationality_code,
            passport_number: travelerForm.passportNumber,
            passport_issue_date: formatDateWithTimezoneToYMD(travelerForm.passportIssueDate),
            passport_expiry_date: formatDateWithTimezoneToYMD(travelerForm.passPortExpiryDate),
            gender: travelerForm.gender,
            marital_status: travelerForm.maritalStatus,
            application_arrival_date: formatDateWithTimezoneToYMD(selectedEntry.application_arrival_date),
            application_departure_date: formatDateWithTimezoneToYMD(selectedEntry.application_departure_date),
            application_destination: selectedEntry.country_code,
            fathers_name: travelerForm.fatherName,
            passport_front: travelerForm.passFrontPhoto,
          }));
          const combinedData = {
            selectedEntry,
            applications: allPostData
          };
  
          setCombinedData(combinedData);

          axiosInstance
            .post('/backend/create_manual_user_application', postData)
            .then((response) => {
              setInsuranceResponse(response.data.data);
              const user_id = Cookies.get('user_id')
              const data = {
                user_id: user_id,
                application_id: response.data.data,
              }
              axiosInstance
                .patch('/backend/add_user_applicant', data)
                .then((response) => {
                  if (response.status === 200) {
                    setIsReviewModal(false)
                    setConfetti(true)
                    setIsSuccessModal(true)
                  } else {
                    toast.error(response.data.msg, {
                      position: 'top-center',
                    })
                  }
                  setLoading(false)
                })
                .catch((error) => {
                  console.error('Error applying for visa:', error)
                  setLoading(false)
                  toast.error('Error applying for visa', {
                    position: 'top-center',
                  })
                })
            })
            .catch((error) => {
              console.error('Error creating user application:', error)
              setLoading(false)
              toast.error('Error creating user application', {
                position: 'top-center',
              })
            })
        }
      }
    } catch (error) {
      console.error('Error while making API calls:', error)
    }
  }

  const handleDeleteForm = (index) => {
    setTravelerForms((prevForms) => {
      const updatedData = [...prevForms]
      updatedData.splice(index, 1)
      return updatedData
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    let dayWithSuffix;
    if (day === 1 || day === 21 || day === 31) {
      dayWithSuffix = `${day}st`;
    } else if (day === 2 || day === 22) {
      dayWithSuffix = `${day}nd`;
    } else if (day === 3 || day === 23) {
      dayWithSuffix = `${day}rd`;
    } else {
      dayWithSuffix = `${day}th`;
    }
  
    return `${dayWithSuffix} ${month} ${year}`;
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

  const handleDashboardRedirect = () => {
    window.location.reload();
  };

  const handleDirectInsurance = () => {
    navigate('/customer/directinsurance', { state: { combinedData: combinedData } });
  };


  return (
    <div style={{backgroundColor: '#fff'}} className='w-full'>
      {confetti && <Confetti />}
      <Toaster />
      <OrderSuccess 
        show={modalShow} 
        handleClose={handleClose} 
        orderId={insuranceResponse ? insuranceResponse.insurance_plan_type : ''} 
        orderTime={insuranceResponse ? formatDate(insuranceResponse.created_at) : ''} 
        account={insuranceResponse ? insuranceResponse.insurance_id : ''} 
        name={`${insuranceResponse ? insuranceResponse.first_name : ''} ${insuranceResponse ? insuranceResponse.last_name : ''}`} 
        amount={insuranceResponse ? insuranceResponse.insurance_plan_type : ''} 
      />
      <div className='d-flex' style={{justifyContent: 'space-between', width: '100%'}}>
      <div
          style={{
            width: '25%',
            padding: '16px',
            paddingLeft: '10px',
            position: 'sticky',
            height: '100%',
            overflowY: 'auto',
            paddingTop: 10,
            top: '0px',
          }}
        >
           {travelerForms.map((form, index) => (
            <div
              style={{
                borderRadius: 15,
                borderColor: '#696969',
                padding: '10px',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
                marginBottom: '15px',
                marginTop: '5px',
              }}
            >
              <div onClick={() => {}} style={{...tabTextStyle}}>
                <CheckCircleOutline style={{color: '#327113', marginRight: 8}} />
                Traveller {index + 1}
              </div>
              <div style={{marginLeft: 20}}>
                <div onClick={() => {}} style={{...tabTextStyle}}>
                  {form.passFrontPhoto ? (
                    <CheckCircleOutline
                      style={{color: '#327113', marginRight: 10}}
                      onClick={() => handleFileDelete(index, 'passFrontPhoto')}
                    />
                  ) : (
                    <CircleOutlined style={{color: '#327113', marginRight: 10}} />
                  )}
                  Passport Front
                </div>
                <div onClick={() => {}} style={{...tabTextStyle}}>
                  {form.passBackPhoto ? (
                    <CheckCircleOutline
                      style={{color: '#327113', marginRight: 10}}
                      onClick={() => handleFileDelete(index, 'passBackPhoto')}
                    />
                  ) : (
                    <CircleOutlined style={{color: '#327113', marginRight: 10}} />
                  )}
                  Passport Back
                </div>
                <div onClick={() => {}} style={{...tabTextStyle}}>
                  {form.travelerPhoto ? (
                    <CheckCircleOutline
                      style={{color: '#327113', marginRight: 10}}
                      onClick={() => handleFileDelete(index, 'travelerPhoto')}
                    />
                  ) : (
                    <CircleOutlined style={{color: '#327113', marginRight: 10}} />
                  )}
                  Traveller Photo
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{width: '100%', paddingBottom: '5%', marginLeft: isFixed ? '20%' : '0%'}}>
          <div style={{margin: '0 auto', width: '100%'}} className='visa-card mb-12 mt-4'>
              <div className='entry-info'>
                <h2>{selectedEntry?.day || '--'} Days</h2>
                <p>Single Entry</p>
              </div>
              <div className='left-section'>
                <div className='visa-details'>
                  <p>Visa Type: Tourist Visa</p>
                  <p>Price is inclusive of taxes.</p>
                  <p>{selectedEntry?.description}</p>
                </div>
                <div className='stay-validity'>
                  <p>
                    <span>✔</span> Stay Period: <strong>{selectedEntry?.day || '--'} Days</strong>
                  </p>
                  <p>
                    <span>✔</span> Validity: <strong>58 Days</strong>
                  </p>
                </div>
              </div>
              <div className='right-section'>
                <div className='amount'>
                  <p>Amount</p>
                  <h2>
                    ₹{' '}
                    {(
                        Number(selectedEntry?.receipt?.['Visa Fees'] ?? 0) +
                        Number(selectedEntry?.receipt?.['Service Fees'] ?? 0)
                      ).toFixed(0)}
                  </h2>
                </div>
              </div>
            </div>
          {travelerForms.map((_, index) => (
            <>
              <div key={index}>
                <TravelerForm2
                  ind={index}
                  onDataChange={(newData) => handleTravelerDataChange(newData, index)}
                  selectedEntry={selectedEntry}
                  onFieldChange={handleTravelFieldChange}
                  onFileDelete={handleFileDelete}
                />
                {travelerForms.length > 1 && index !== 0 && (
                  <div className='d-flex justify-content-end w-100'>
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
                  </div>
                )}
              </div>
            </>
          ))}
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
            <div className='d-flex ' style={{width: '100%'}}>
              <div style={{width: '40%', marginLeft: '25px', marginTop: '30px'}}>
                <h6>Receipt</h6>
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
                      position: 'relative',
                    }}
                  >
                    <div
                      onClick={() => setReciept('')}
                      style={{
                        justifyContent: 'flex-end',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'white',
                        padding: 7,
                        borderRadius: '50%',
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
                        marginTop: '15px',
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
                    <h4 className='mx-10 mt-10'>Receipt Photo</h4>
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
              <div style={{width: '60%', marginTop: 25, alignItems: 'center'}}>
                <div className='d-flex flex-column align-items-center gap-4 w-100 '>
                  <h1>Upload Reciept</h1>
                  <img width='200px' src={qr} alt='qr-code' />
                </div>
              </div>
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
                backgroundColor: '#327113',
                cursor: 'pointer',
              }}
            >
              <h6 className='fs-4' style={{color: '#fff', paddingTop: 5, fontSize: 10}}>
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
                backgroundColor: 'white',
                width: '60%',
              }}
            >
              <div>
                <h2>Visa Information</h2>
                <p style={{paddingTop: 5, lineHeight: 2, paddingBottom: 5}}>
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
                marginLeft: '5%',
                backgroundColor: 'white',
                height: 'max-content',
                marginBottom: 20,
                width: '35%',
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
          {insuranceFormData &&
            insuranceFormData.map((data, index) => (
              <div key={index}>
                <hr className='ahr' />
                <p>
                  <strong>First Name:</strong> {data.firstName}
                </p>
                <p>
                  <strong>Last Name:</strong> {data.lastName}
                </p>
                <p>
                  <strong>Birth Place:</strong> {data.birthPlace}
                </p>
                <p>
                  <strong>Birth Detail:</strong> {data.birthDetail}
                </p>
                <p>
                  <strong>Passport Number:</strong> {data.passportNumber}
                </p>
                <p>
                  <strong>Passport Issue Date:</strong> {data.passportIssueDate}
                </p>
                <p>
                  <strong>Father's Name:</strong> {data.fatherName}
                </p>
                <p>
                  <strong>Mother's Name:</strong> {data.motherName}
                </p>
                <p>
                  <strong>Passport Expiry Date:</strong> {data.passPortExpiryDate}
                </p>
                <p>
                  <strong>Gender:</strong> {data.gender}
                </p>
                <p>
                  <strong>Marital Status:</strong> {data.maritalStatus}
                </p>
                <p>
                  <strong>Pan Number:</strong> {data.panNo}
                </p>
              </div>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setIsReviewModal(false)}>
            Close
          </Button>
          <Button variant='primary' onClick={handleReviewAndSave}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={isSuccessModal} onHide={handleClose} centered>
      <Modal.Body className="text-center px-8 py-16">
        <div className="checkmark">
            <svg className="star" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z" >
                </path>
            </svg>
            <svg className="star" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z" >
                </path>
            </svg>
            <svg className="star" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z" >
                </path>
            </svg>
            <svg className="star" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z" >
                </path>
            </svg>
            <svg className="star" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z" >
                </path>
            </svg>
            <svg className="star" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z" >
                </path>
            </svg>
            <svg className="checkmark__check" height="36" viewBox="0 0 48 36" width="48" xmlns="http://www.w3.org/2000/svg">
                <path d="M47.248 3.9L43.906.667a2.428 2.428 0 0 0-3.344 0l-23.63 23.09-9.554-9.338a2.432 2.432 0 0 0-3.345 0L.692 17.654a2.236 2.236 0 0 0 .002 3.233l14.567 14.175c.926.894 2.42.894 3.342.01L47.248 7.128c.922-.89.922-2.34 0-3.23">
                </path>
            </svg>
            <svg className="checkmark__background" height="115" viewBox="0 0 120 115" width="120" xmlns="http://www.w3.org/2000/svg">
                <path d="M107.332 72.938c-1.798 5.557 4.564 15.334 1.21 19.96-3.387 4.674-14.646 1.605-19.298 5.003-4.61 3.368-5.163 15.074-10.695 16.878-5.344 1.743-12.628-7.35-18.545-7.35-5.922 0-13.206 9.088-18.543 7.345-5.538-1.804-6.09-13.515-10.696-16.877-4.657-3.398-15.91-.334-19.297-5.002-3.356-4.627 3.006-14.404 1.208-19.962C10.93 67.576 0 63.442 0 57.5c0-5.943 10.93-10.076 12.668-15.438 1.798-5.557-4.564-15.334-1.21-19.96 3.387-4.674 14.646-1.605 19.298-5.003C35.366 13.73 35.92 2.025 41.45.22c5.344-1.743 12.628 7.35 18.545 7.35 5.922 0 13.206-9.088 18.543-7.345 5.538 1.804 6.09 13.515 10.696 16.877 4.657 3.398 15.91.334 19.297 5.002 3.356 4.627-3.006 14.404-1.208 19.962C109.07 47.424 120 51.562 120 57.5c0 5.943-10.93 10.076-12.668 15.438z" >
                </path>
            </svg>
        </div>
        <h4 className="font-weight-bold">Order Success!</h4>
        <p>Your order request has been successfully placed.</p>
        {/* <div className="withdrawal-amount display-4">₹ {amount.toLocaleString()}</div> */}
        <div className="mt-4 d-flex flex-column gap-3">
          <div className="d-flex justify-content-center mt-4">
            <div
              onClick={handleDirectInsurance}
              style={{
                width: "90%", 
                background: "#327113", 
                justifyContent: "center", 
                alignItems: "center", 
                color: "#fff", 
                borderRadius: "15px", 
                border: "none", 
                padding: "15px 10px",
                cursor: "pointer"
              }}
            >
              Apply For Insurance
            </div>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <div
              onClick={handleDashboardRedirect}
              style={{
                width: "90%", 
                background: "#327113", 
                justifyContent: "center", 
                alignItems: "center", 
                color: "#fff", 
                borderRadius: "15px", 
                border: "none", 
                padding: "15px 10px",
                cursor: "pointer"
              }}
            >
              Go To Dashboard
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
    </div>
  )
}

export {Vertical3}
