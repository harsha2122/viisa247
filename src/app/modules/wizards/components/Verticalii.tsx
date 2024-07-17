import {useEffect, useState, useRef, ChangeEvent} from 'react'
import {useNavigate} from 'react-router-dom'
import TravelerForm from './TravelerForm'
import Cookies from 'js-cookie'
import toast, {Toaster} from 'react-hot-toast'
import axiosInstance from '../../../helpers/axiosInstance'
import {CheckCircleOutline, CircleOutlined} from '@mui/icons-material'
import Loader from '../../../components/Loader'
import {Box, Step, StepLabel, Stepper, Theme, Typography} from '@mui/material'
import InsuranceForm from './InsuranceForm'
import Confetti from 'react-confetti';
import { Modal, Button } from 'react-bootstrap';
import OrderSuccess from '../../../components/OrderSuccess'

interface VerticalProps {
  selectedEntry: any
  show: (value: boolean) => void
  visaList: boolean
  visaListLoader: (value: boolean) => void
  showfinalSubmitLoader: (value: boolean) => void
}

const Verticalii: React.FC<VerticalProps> = ({
  selectedEntry,
  showfinalSubmitLoader,
  visaList,
  visaListLoader,
  show,
}) => {
  const handleTravelerDataChange = (newData, index) => {
    setTravelerForms(prevForms => {
      const updatedForms = [...prevForms];
      updatedForms[index] = { ...updatedForms[index], ...newData };
      return updatedForms;
    });
  };
  
  const [applicantForms, setApplicantForms] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [insuranceResponse, setInsuranceResponse] = useState<any | null>(null);
  const recieptFileInputRef = useRef<HTMLInputElement | null>(null);
  const [reciept, setReciept] = useState('');
  const maxSize = 1024 * 1024;
  // const [travelerForms, setTravelerForms] = useState([<TravelerForm key={0} onDataChange={handleTravelerDataChange} />]);
  const navigate = useNavigate()
  const [confetti, setConfetti] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const handleShow = () => setModalShow(true);
  const handleClose = () => {
    setModalShow(false);
    navigate('/merchant/dashboard');
  };
  const handleReviewModal = () => {
    const formData = travelerForms.map((form) => ({
      firstName: form.firstName,
      lastName: form.lastName,
      birthPlace: form.birthPlace,
      birthDetail: form.birthDetail,
      passportNumber: form.passportNumber,
      passportIssueDate: form.passportIssueDate,
      passPortExpiryDate: form.passPortExpiryDate,
      gender: form.gender,
      maritalStatus: form.maritalStatus,
      passportFront: form.passport_front,
    }));
    setInsuranceFormData(formData);
    handleShowReviewModal();
  };
  
  
  const [insuranceFormData, setInsuranceFormData] = useState<any | null>(null);
  const [isReviewModal, setIsReviewModal] = useState<boolean>(false);  
  const handleShowReviewModal = () => setIsReviewModal(true);
  const handleCloseReviewModal = () => setIsReviewModal(false);

  
  const [travelerForms, setTravelerForms] = useState<any[]>([{}])
  const [isFixed, setIsFixed] = useState(false)

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset
    setIsFixed(scrollY >= 180)
  }

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
      const fileUrl = response.data.data;
      setLoading(false);
      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
      return '';
    }
  }

  

  const handleRecieptSelect = (event: ChangeEvent<HTMLInputElement>) => {
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
          try {
            const imageLink = await handleFileUpload(file);
            setReciept(imageLink);
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      }
      reader.readAsDataURL(file);
    }
  };

  const handleRecieptUpload = () => {
    if (recieptFileInputRef.current) {
      recieptFileInputRef.current.click();
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    fetchwallet();
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const totalAmount = travelerForms.length * selectedEntry.merchant_insurance_amount
  const totalAmounta = selectedEntry.merchant_insurance_amount

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

  const fetchwallet = async () => {
    try {
      const user_id = Cookies.get('user_id');
      const postData = {
        id: user_id
      }
      const response = await axiosInstance.post("/backend/fetch_single_merchant_user", postData);
      if (response.status == 203) {
        toast.error("Please Logout And Login Again", {
          position: 'top-center'
        });
      }
      setCurrentWallet(response.data.data.wallet_balance);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
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
            !travelerForm.passport_front
          ) {
            toast.error('All fields are required!', {
              position: 'top-center',
            })
            setLoading(false)
            return
          }
          const postData = {
            country_code: selectedEntry.country_code,
            nationality_code: selectedEntry.nationality_code,
            first_name: travelerForm.firstName,
            last_name: travelerForm.lastName,
            birth_place: travelerForm.birthPlace,
            birthday_date: formatDateWithTimezoneToYMD(travelerForm.birthDetail),
            nationality: selectedEntry.nationality_code,
            passport_number: travelerForm.passportNumber,
            passport_issue_date: formatDateWithTimezoneToYMD(travelerForm.passportIssueDate),
            passport_expiry_date: formatDateWithTimezoneToYMD(travelerForm.passPortExpiryDate),
            gender: travelerForm.gender,
            marital_status: travelerForm.maritalStatus,
            passport_front: travelerForm.passport_front,
            insurance_id: selectedEntry.id,
            insurance_amount: selectedEntry.totalAmount,
            insurance_original_amount: selectedEntry.insurance_original_amount,
            insurance_benefit: selectedEntry.benefits,
            insurance_plan_type: selectedEntry.description,
            insurance_age_group: selectedEntry.age_group,
            merchant_insurance_amount: selectedEntry.merchant_insurance_amount
          }

          axiosInstance
            .post('/backend/create_insurance_application', postData)
            .then((response) => {
              setInsuranceResponse(response.data.data);
              const user_id = Cookies.get('user_id')
              const data = {
                merchant_id: user_id,
                insurance_application_id: response.data.data._id,
              }
              axiosInstance
                .post('/backend/add_insurance_applicant', data)

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
      title: 'Claims',
      description:
        'Quick and easy claims on insurance provider website',
    },
    {
      title: 'About Settlement',
      description: '98% settlement ratio.',
    },
  ]

  const tabTextStyle = {
    color: '#000',
    cursor: 'pointer',
    padding: '8px',
    fontSize: 16,
    fontWeight: 'bold',
  }
console.log("sadf", selectedEntry)
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
        amount={insuranceResponse ? Number(insuranceResponse.merchant_insurance_amount) * travelerForms.length : 0} 
      />

      <div className='d-flex' style={{justifyContent: 'space-between', width: '100%'}}>
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
              Applicant {index + 1}
            </div>
            <div style={{marginLeft: 20}}>
              <div onClick={() => {}} style={{...tabTextStyle}}>
                <CheckCircleOutline style={{color: '#327113', marginRight: 10}} />
                Passport Front
              </div>
              <div onClick={() => {}} style={{...tabTextStyle}}>
                <CheckCircleOutline style={{color: '#327113', marginRight: 10}} />
                Applicant Details
              </div>
              <div onClick={() => {}} style={{...tabTextStyle}}>
                <CheckCircleOutline style={{color: '#327113', marginRight: 10}} />
                Payment Reciept
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
          {travelerForms.map((_, index) => (
            <div key={index}>
              <InsuranceForm
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
                backgroundColor: '#fff',
                cursor: 'pointer',
              }}
            >
              <h6 className='fs-4' style={{color: '#327113', paddingTop: 5, fontSize: 10}}>
                + Add Another Applicant
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
                <h2>Insurance Information</h2>
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
                <h2 style={{margin: "10px 0px"}}>Know before you pay</h2>
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
                      {totalAmounta.toFixed(0)}
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
          <Modal.Title>Review Insurance Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {insuranceFormData && insuranceFormData.map((data, index) => (
            <div key={index}>
              <hr className='ahr' />
              <p><strong>First Name:</strong> {data.firstName}</p>
              <p><strong>Last Name:</strong> {data.lastName}</p>
              <p><strong>Birth Place:</strong> {data.birthPlace}</p>
              <p><strong>Birth Detail:</strong> {data.birthDetail}</p>
              <p><strong>Passport Number:</strong> {data.passportNumber}</p>
              <p><strong>Passport Issue Date:</strong> {data.passportIssueDate}</p>
              <p><strong>Passport Expiry Date:</strong> {data.passPortExpiryDate}</p>
              <p><strong>Gender:</strong> {data.gender}</p>
              <p><strong>Marital Status:</strong> {data.maritalStatus}</p>
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

export {Verticalii}
