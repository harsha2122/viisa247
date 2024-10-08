import {useEffect, useState, useRef, ChangeEvent} from 'react'
import {useNavigate} from 'react-router-dom'
import TravelerForm from './TravelerForm'
import Cookies from 'js-cookie'
import toast, {Toaster} from 'react-hot-toast'
import axiosInstance from '../../../helpers/axiosInstance'
import {CheckCircleOutline, CircleOutlined} from '@mui/icons-material'
import Loader from '../../../components/Loader'
import {Box, Step, StepLabel, Stepper, Theme, Typography} from '@mui/material'
import Confetti from 'react-confetti'
import {Modal, Button} from 'react-bootstrap'
import OrderSuccess from '../../../components/OrderSuccess'

interface VerticalProps {
  selectedEntry: any
  show: (value: boolean) => void
  visaList: boolean
  visaListLoader: (value: boolean) => void
  showfinalSubmitLoader: (value: boolean) => void
}

const Vertical: React.FC<VerticalProps> = ({
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
  const [groupId, setGroupId] = useState<string>('');
  const [confetti, setConfetti] = useState(false)
  // const [travelerForms, setTravelerForms] = useState([<TravelerForm key={0} onDataChange={handleTravelerDataChange} />]);
  const navigate = useNavigate()
  const [isFixed, setIsFixed] = useState(false)

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset
    setIsFixed(scrollY >= 180)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    fetchwallet()
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const newGroupId = generateGroupId();
    setGroupId(newGroupId);
  }, []);

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

  const [insuranceFormData, setInsuranceFormData] = useState<any | null>(null)
  const [isReviewModal, setIsReviewModal] = useState<boolean>(false)
  const handleShowReviewModal = () => setIsReviewModal(true)
  const handleCloseReviewModal = () => setIsReviewModal(false)

  const [insuranceResponse, setInsuranceResponse] = useState<any | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const handleShow = () => setModalShow(true);
  const handleClose = () => {
    setModalShow(false);
    navigate('/customer/dashboard');
  };

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

  const fetchwallet = async () => {
    try {
      const user_id = Cookies.get('user_id')
      const postData = {
        id: user_id,
      }
      const response = await axiosInstance.post('/backend/fetch_single_merchant_user', postData)
      if (response.status == 203) {
        toast.error('Please Logout And Login Again', {
          position: 'top-center',
        })
      }
      setCurrentWallet(response.data.data.wallet_balance)
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }
  const markup_percentage = localStorage.getItem('markup_percentage') ?? '1'

  const additionalFees =
    (selectedEntry.receipt['Visa Fees'] ? selectedEntry.receipt['Visa Fees'] : 0) *
      (parseFloat(markup_percentage) ? 1 + parseFloat(markup_percentage) / 100 : 1) +
    (selectedEntry.receipt['Service Fees'] ? selectedEntry.receipt['Service Fees'] : 0)
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
            !travelerForm.firstName ||
            !travelerForm.lastName ||
            !travelerForm.birthPlace ||
            !travelerForm.birthDetail ||
            !travelerForm.passportNumber ||
            !travelerForm.passportIssueDate ||
            !travelerForm.passPortExpiryDate ||
            !travelerForm.gender ||
            !travelerForm.maritalStatus ||
            !travelerForm.fatherName ||
            !travelerForm.passFrontPhoto ||
            !travelerForm.panNo ||
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
            entry_process: selectedEntry.value,
            nationality_code: selectedEntry.nationality_code,
            first_name: travelerForm.firstName,
            last_name: travelerForm.lastName,
            group_id: groupId,
            birth_place: travelerForm.birthPlace,
            birthday_date: formatDateWithTimezoneToYMD(travelerForm.birthDetail),
            nationality: selectedEntry.nationality_code,
            passport_number: travelerForm.passportNumber,
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
                (selectedEntry.receipt['Visa Fees'] ? selectedEntry.receipt['Visa Fees'] : 0) *
                  (parseFloat(markup_percentage) ? 1 + parseFloat(markup_percentage) / 100 : 1)
              ) +
              (selectedEntry.receipt['Service Fees'] ? selectedEntry.receipt['Service Fees'] : 0),
            visa_description: selectedEntry.description,
          }

          axiosInstance
            .post('/backend/create_user_application', postData)
            .then((response) => {
              const user_id = Cookies.get('user_id')
              const data = {
                merchant_id: user_id,
                application_id: response.data.data,
              }
              axiosInstance
                .patch('/backend/add_applicant', data)
                .then((response) => {
                  axiosInstance
                    .post('/backend/merchant/apply_visa', data)
                    .then((response) => {
                      if (response.status === 200) {
                        setIsReviewModal(false)
                        setConfetti(true);
                        setModalShow(true); 
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
                  console.error('Error adding applicant:', error)
                  setLoading(false)
                  toast.error('Error adding applicant', {
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
        amount={insuranceResponse ? Number(insuranceResponse.Math.ceil(
          selectedEntry.receipt['Visa Fees'] ? selectedEntry.receipt['Visa Fees'] : 0
        ) +
        (selectedEntry.receipt['Service Fees'] ? selectedEntry.receipt['Service Fees'] : 0),) * travelerForms.length : 0} 
      />
      <div className='d-flex' style={{justifyContent: 'space-between', width: '100%'}}>
      <div
          style={{
            width: '20%',
            padding: '16px',
            paddingLeft: '10px',
            position: "sticky",
            height: '100%',
            overflowY: 'auto',
            paddingTop: 20,
            top: '75px',
            left: "10px",
          }}
        >
           {travelerForms.map((form, index) => (
            <>
              <div onClick={() => {}} style={{ ...tabTextStyle }}>
                <CheckCircleOutline style={{ color: '#327113', marginRight: 8 }} />
                Traveller {index + 1}
              </div>
              <div style={{ marginLeft: 20 }}>
                <div onClick={() => {}} style={{ ...tabTextStyle }}>
                  {form.passFrontPhoto ? (
                    <CheckCircleOutline 
                      style={{ color: '#327113', marginRight: 10 }} 
                      onClick={() => handleFileDelete(index, 'passFrontPhoto')} 
                    />
                  ) : (
                    <CircleOutlined style={{ color: '#327113', marginRight: 10 }} />
                  )}
                  Passport Front
                </div>
                <div onClick={() => {}} style={{ ...tabTextStyle }}>
                  {form.passBackPhoto ? (
                    <CheckCircleOutline 
                      style={{ color: '#327113', marginRight: 10 }} 
                      onClick={() => handleFileDelete(index, 'passBackPhoto')} 
                    />
                  ) : (
                    <CircleOutlined style={{ color: '#327113', marginRight: 10 }} />
                  )}
                  Passport Back
                </div>
                <div onClick={() => {}} style={{ ...tabTextStyle }}>
                  {form.travelerPhoto ? (
                    <CheckCircleOutline 
                      style={{ color: '#327113', marginRight: 10 }} 
                      onClick={() => handleFileDelete(index, 'travelerPhoto')} 
                    />
                  ) : (
                    <CircleOutlined style={{ color: '#327113', marginRight: 10 }} />
                  )}
                  Traveller Photo
                </div>
              </div>
            </>
          ))}
          <div onClick={() => {}} style={{...tabTextStyle, color: '#696969'}}>
            <CircleOutlined style={{color: '#327113', marginRight: 10}} />
            Submit
          </div>
        </div>
        <div style={{width: '80%', paddingBottom: '5%', marginLeft: isFixed ? '20%' : '0%'}}>
        <div style={{margin:"0 auto", width:"80%"}} className="visa-card mb-12">
            <div className="entry-info">
                <h2>{selectedEntry?.day || '--'} Days</h2>
                <p>Single Entry</p>
            </div>
            <div className="left-section">
                <div className="visa-details">
                    <p>Visa Type: Tourist Visa</p>
                    <p>Price is inclusive of taxes.</p>
                    <p>{selectedEntry?.description}</p>
                </div>
                <div className="stay-validity">
                    <p><span>✔</span> Stay Period: <strong>{selectedEntry?.day || '--'} Days</strong></p>
                    <p><span>✔</span> Validity: <strong>58 Days</strong></p>
                </div>
            </div>
            <div className="right-section">
                <div className="amount">
                    <p>Amount</p>
                    <h2>₹{' '}
                    {  Math.ceil(selectedEntry?.receipt?.['Visa Fees'] ?? 0) +
                      (selectedEntry?.receipt?.['Service Fees'] ?? 0)}
                    </h2>
                </div>
            </div>
          </div>
          {travelerForms.map((_, index) => (
            <div key={index}>
              <TravelerForm
                ind={index}
                onDataChange={(newData) => handleTravelerDataChange(newData, index)}
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
          ))}
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
                marginLeft: 10,
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
                        (selectedEntry.receipt['Visa Fees']
                          ? selectedEntry.receipt['Visa Fees']
                          : 0) *
                          (parseFloat(markup_percentage)
                            ? 1 + parseFloat(markup_percentage) / 100
                            : 1) +
                        (selectedEntry.receipt['Service Fees']
                          ? selectedEntry.receipt['Service Fees']
                          : 0)
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
                  <p>Wallet</p>
                  <p>{currentWallet}/-</p>
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
                  margin: "0 auto",
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
    </div>
  )
}

export {Vertical}
