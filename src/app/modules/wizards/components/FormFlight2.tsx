import {useEffect, useState, useRef, ChangeEvent} from 'react'
import {useNavigate} from 'react-router-dom'
import TravelerForm from './TravelerForm'
import Cookies from 'js-cookie'
import toast, {Toaster} from 'react-hot-toast'
import axiosInstance from '../../../helpers/axiosInstance'
import {CheckCircleOutline, CircleOutlined} from '@mui/icons-material'
import Loader from '../../../components/Loader'
import {Box, Step, StepLabel, Stepper, Theme, Typography} from '@mui/material'
import Confetti from 'react-confetti';
import OrderSuccess from '../../../components/OrderSuccess'
import FlightForm1 from './FlightForm1'

interface VerticalProps {
  selectedEntry: any
  show: (value: boolean) => void
  visaList: boolean
  visaListLoader: (value: boolean) => void
  showfinalSubmitLoader: (value: boolean) => void
}

const FormFlight2: React.FC<VerticalProps> = ({
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

  const generateGroupId = () => {
    return Math.random().toString(36).substring(2, 12);
  };
  
  const [applicantForms, setApplicantForms] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [groupId, setGroupId] = useState<string>('');
  const [loading, setLoading] = useState(false)
  const [insuranceResponse, setInsuranceResponse] = useState<any | null>(null);
  const recieptFileInputRef = useRef<HTMLInputElement | null>(null);
  const [reciept, setReciept] = useState('');
  const maxSize = 1024 * 1024;
  const navigate = useNavigate()
  const [confetti, setConfetti] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const handleClose = () => {
    setModalShow(false);
    navigate('/merchant/dashboard');
  };

  const [travelerForms, setTravelerForms] = useState<any[]>([{ passport_front: ''}]);
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
  
  
  const [insuranceFormData, setInsuranceFormData] = useState<any | null>(null);
  const [isReviewModal, setIsReviewModal] = useState<boolean>(false);  
  const handleShowReviewModal = () => setIsReviewModal(true);
  const handleCloseReviewModal = () => setIsReviewModal(false);
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
      const response = await axiosInstance.post('/backend/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const fileUrl = response.data.url;
      setLoading(false);
      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
      return '';
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    fetchwallet();
    return () => {
      window.removeEventListener('scroll', handleScroll)
    } 
  }, [])

  useEffect(() => {
    const newGroupId = generateGroupId();
    setGroupId(newGroupId);
  }, []);

  const totalAmount = travelerForms.length * selectedEntry.merchant_flight_amount
  const totalAmounta = selectedEntry.merchant_flight_amount

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
      const totalPrice = parseFloat(totalAmount.toFixed(0));
      const walletBalance = parseFloat(currentWallet);
  
      if (totalPrice > walletBalance) {
        toast.error('Insufficient Balance!', {
          position: 'top-center',
        });
        return;
      }
  
      setLoading(true);
  
      for (const travelerForm of travelerForms) {
        const postData = {
          country_code: selectedEntry.country_code,
          nationality_code: selectedEntry.nationality_code,
          first_name: travelerForm.fullName,
          gender: travelerForm.gender,
          age: travelerForm.age,
          group_id: groupId,
          passport_front: travelerForm.passport_front,
          flight_id: selectedEntry.id,
          flight_amount: selectedEntry.totalAmount,
          flight_original_amount: selectedEntry.flight_original_amount,
          merchant_flight_amount: selectedEntry.merchant_flight_amount,
        };
  
        try {
          const response = await axiosInstance.post('/backend/create_flight_application', postData);
          setInsuranceResponse(response.data.data);
  
          const user_id = Cookies.get('user_id');
          const data = {
            merchant_id: user_id,
            flight_application_id: response.data.data._id,
          };
  
          const applicantResponse = await axiosInstance.post('/backend/add_flight_applicant', data);
  
          if (applicantResponse.status === 200) {
            toast.success('Applied successfully!');
            setConfetti(true);
            setModalShow(true);
          } else {
            toast.error(applicantResponse.data.msg, {
              position: 'top-center',
            });
          }
        } catch (error) {
          console.error('Error creating or applying for flight application:', error);
          toast.error('Error creating or applying for flight application', {
            position: 'top-center',
          });
        }
      }
  
      setLoading(false);
    } catch (error) {
      console.error('Error while making API calls:', error);
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
      title: 'Quick and Easy',
      description:
        'Enter your details and generate dummy tickets for immigration purpose',
    },
    {
      title: 'Easy Immigration',
      description: 'You can show this ticket to immigration officer for easy immigrations',
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
        amount={insuranceResponse ? Number(insuranceResponse.merchant_flight_amount) * travelerForms.length : 0} 
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
            <div style={{
              borderRadius: 15,
              borderColor: '#696969',
              padding: '10px',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white',
              marginBottom: '15px',
              marginTop: '5px',
            }}>
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
              </div>
            </div>
          ))}
        </div>
        <div style={{width: '80%', paddingBottom: '5%', marginLeft: isFixed ? '20%' : '0%'}}>
          {travelerForms.map((_, index) => (
            <div key={index}>
              <FlightForm1
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
                <h2>Information</h2>
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
                onClick={handleReviewAndSave}
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
                  Submit
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
    </div>
  )
}

export {FormFlight2}
