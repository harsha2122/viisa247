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
import ClearIcon from '@mui/icons-material/Delete'
import qr from '../../../../_metronic/assets/card/qr.png'
import HotelForm1 from './HotelForm1'

interface VerticalProps {
  selectedEntry: any
  show: (value: boolean) => void
  visaList: boolean
  visaListLoader: (value: boolean) => void
  showfinalSubmitLoader: (value: boolean) => void
}

const FormHotel1: React.FC<VerticalProps> = ({
  selectedEntry,
  showfinalSubmitLoader,
  visaList,
  visaListLoader,
  show,
}) => {
  const handleTravelerDataChange = (newData, index) => {
    setTravelerForms((prevForms) => {
      const updatedForms = [...prevForms]
      updatedForms[index] = {...updatedForms[index], ...newData}
      return updatedForms
    })
  }

  const [applicantForms, setApplicantForms] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [insuranceResponse, setInsuranceResponse] = useState<any | null>(null)
  const recieptFileInputRef = useRef<HTMLInputElement | null>(null)
  const [reciept, setReciept] = useState('')
  const maxSize = 1024 * 1024
  // const [travelerForms, setTravelerForms] = useState([<TravelerForm key={0} onDataChange={handleTravelerDataChange} />]);
  const navigate = useNavigate()
  const [confetti, setConfetti] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const handleShow = () => setModalShow(true)
  const handleClose = () => {
    setModalShow(false)
    navigate('/customer/dashboard')
  }
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
    }))
    setInsuranceFormData(formData)
    handleShowReviewModal()
  }

  const [insuranceFormData, setInsuranceFormData] = useState<any | null>(null)
  const [isReviewModal, setIsReviewModal] = useState<boolean>(false)
  const handleShowReviewModal = () => setIsReviewModal(true)
  const handleCloseReviewModal = () => setIsReviewModal(false)

  const [travelerForms, setTravelerForms] = useState<any[]>([{}])
  const [isFixed, setIsFixed] = useState(false)

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset
    setIsFixed(scrollY >= 180)
  }

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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const totalAmount = travelerForms.length * selectedEntry.totalAmount
  const totalAmounta = selectedEntry.totalAmount

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
        return
      }

      setLoading(true)

      for (const travelerForm of travelerForms) {
        const postData = {
          country_code: selectedEntry.country_code,
          nationality_code: selectedEntry.nationality_code,
          first_name: travelerForm.fullName,
          traveller: travelerForm.traveller,
          hotel_id: selectedEntry.id,
          hotel_amount: selectedEntry.totalAmount,
          hotel_original_amount: selectedEntry.hotel_original_amount,
          receipt_url: reciept,
          merchant_hotel_amount: selectedEntry.merchant_hotel_amount,
        }

        try {
          const response = await axiosInstance.post('/backend/create_hotel_application', postData)
          setInsuranceResponse(response.data.data)

          const user_id = Cookies.get('user_id')
          const data = {
            user_id: user_id,
            hotel_application_id: response.data.data._id,
          }

          const applicantResponse = await axiosInstance.post(
            '/backend/add_user_hotel_applicant',
            data
          )

          if (applicantResponse.status === 200) {
            toast.success('Applied successfully!')
            setConfetti(true)
            setModalShow(true)
          } else {
            toast.error(applicantResponse.data.msg, {
              position: 'top-center',
            })
          }
        } catch (error) {
          console.error('Error creating or applying for hotel application:', error)
          toast.error('Error creating or applying for hotel application', {
            position: 'top-center',
          })
        }
      }

      setLoading(false)
    } catch (error) {
      console.error('Error while making API calls:', error)
      setLoading(false)
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
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('default', {month: 'short'})
    const year = date.getFullYear()

    let dayWithSuffix
    if (day === 1 || day === 21 || day === 31) {
      dayWithSuffix = `${day}st`
    } else if (day === 2 || day === 22) {
      dayWithSuffix = `${day}nd`
    } else if (day === 3 || day === 23) {
      dayWithSuffix = `${day}rd`
    } else {
      dayWithSuffix = `${day}th`
    }

    return `${dayWithSuffix} ${month} ${year}`
  }

  const stepsContent = [
    {
      title: 'Quick and Easy',
      description: 'Enter your details and generate dummy hotel for immigration purpose',
    },
    {
      title: 'Easy Immigration',
      description: 'You can show this hotel to immigration officer for easy immigrations',
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
        name={`${insuranceResponse ? insuranceResponse.first_name : ''} ${
          insuranceResponse ? insuranceResponse.last_name : ''
        }`}
        amount={
          insuranceResponse
            ? Number(insuranceResponse.merchant_hotel_amount) * travelerForms.length
            : 0
        }
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
          {travelerForms.map((_, index) => (
          <>
            <div onClick={() => {}} style={{...tabTextStyle}}>
              <CheckCircleOutline style={{color: '#327113', marginRight: 8}} />
              Applicant {index + 1}
            </div>
            <div style={{marginLeft: 20}}>
              <div onClick={() => {}} style={{...tabTextStyle}}>
                <CircleOutlined style={{color: '#327113', marginRight: 10}} />
                Applicant Details
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
          {travelerForms.map((_, index) => (
            <div key={index}>
              <HotelForm1
                ind={index}
                onDataChange={(newData) => handleTravelerDataChange(newData, index)}
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
          <div className='d-flex my-10' style={{justifyContent: 'flex-end', display: 'flex'}}></div>
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
                <h2 style={{margin: '10px 0px'}}>Know before you pay</h2>
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
                  <p>
                    Pay Amount via QR then on verification your application will be processed
                    further
                  </p>
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

export {FormHotel1}
