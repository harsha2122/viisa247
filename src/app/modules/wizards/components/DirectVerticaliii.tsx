import {useEffect, useState, useRef, ChangeEvent} from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import toast, {Toaster} from 'react-hot-toast'
import axiosInstance from '../../../helpers/axiosInstance'
import {CheckCircleOutline, CircleOutlined} from '@mui/icons-material'
import Loader from '../../../components/Loader'
import {Box, Step, StepLabel, Stepper, Theme, Typography} from '@mui/material'
import InsuranceForm from './InsuranceForm'
import Confetti from 'react-confetti';
import ClearIcon from '@mui/icons-material/Delete';
import { Modal, Button } from 'react-bootstrap';
import OrderSuccess from '../../../components/OrderSuccess'
import DirectInsurance from './DirectInsurance'
import qr from '../../../../_metronic/assets/card/qr.png'

interface VerticalProps {
  selectedEntry: any
  show: (value: boolean) => void
  visaList: boolean
  visaListLoader: (value: boolean) => void
  showfinalSubmitLoader: (value: boolean) => void
  combinedData: any; 
}

const DirectVerticaliii: React.FC<VerticalProps> = ({
  selectedEntry,
  showfinalSubmitLoader,
  visaList,
  visaListLoader,
  show,
  combinedData, 
}) => {
  

  const generateGroupId = () => {
    return Math.random().toString(36).substring(2, 12)
  }
  
  const [applicantForms, setApplicantForms] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [groupId, setGroupId] = useState<string>('')
  const [insuranceResponse, setInsuranceResponse] = useState<any | null>(null);
  const [travelerAge, setTravelerAge] = useState<number[]>([]);
  const recieptFileInputRef = useRef<HTMLInputElement | null>(null);
  const [recieptUrl, setRecieptUrl] = useState('');
  const maxSize = 1024 * 1024;
  const [travelerForms, setTravelerForms] = useState(combinedData.applications.map(() => ({})));;
  const navigate = useNavigate()
  const [confetti, setConfetti] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const handleShow = () => setModalShow(true);
  const handleClose = () => {
    setModalShow(false);
    window.location.href = '/customer/dashboard';
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

  useEffect(() => {
    setTravelerForms(combinedData.applications.map(() => ({})));
  }, [combinedData.applications]);
  
  const [insuranceFormData, setInsuranceFormData] = useState<any | null>(null);
  const [isReviewModal, setIsReviewModal] = useState<boolean>(false);  
  const handleShowReviewModal = () => setIsReviewModal(true);
  const handleCloseReviewModal = () => setIsReviewModal(false);

  const [isFixed, setIsFixed] = useState(false)

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset
    setIsFixed(scrollY >= 180)
  }

  const [isFieldFilled, setIsFieldFilled] = useState({
    passport_front: false,
    passport_back: false,
    photo: false,
  });

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalAmounta, setTotalAmounta] = useState<number>(0);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    const dayDiff = today.getDate() - birth.getDate();
    if (dayDiff < 0) {
      return ageInMonths - 1;
    }
    return ageInMonths;
  };
  
  const getMerchantInsuranceAmount = (ageInMonths: number, ageGroups: any[]) => {
    const ageGroup = ageGroups.find(group => {
      const [minAge, maxAge] = group.age_group.split('–').map(ageRange => {
        const ageRangeParts = ageRange.split(' ');
        
        if (ageRangeParts[1] === 'mths') {
          return parseInt(ageRangeParts[0], 10);
        } else {
          return parseInt(ageRangeParts[0], 10) * 12;
        }
      });
      return ageInMonths >= minAge && ageInMonths <= maxAge;
    });
  
    return ageGroup ? ageGroup.merchant_insurance_amount : 0;
  };
  
  useEffect(() => {
    const calculateTotalAmount = () => {
      let totalAmount = 0;
      combinedData.applications.forEach(form => {
        if (form.birthday_date) {
          const ageInMonths = calculateAge(form.birthday_date);
          const amount = getMerchantInsuranceAmount(ageInMonths, selectedEntry.age_groups);
          totalAmount += amount;
        }
      });
      setTotalAmounta(totalAmount);
    };
  
    calculateTotalAmount();
  }, [combinedData.applications, selectedEntry.age_groups]);
  
  const handleTravelerDataChange = (newData, index) => {
    setTravelerForms(prevForms => {
      const updatedForms = [...prevForms];
      if (newData.birthday_date) {
        const ageInMonths = calculateAge(newData.birthday_date);
        updatedForms[index] = { ...updatedForms[index], ...newData, age: ageInMonths };
      } else {
        updatedForms[index] = { ...updatedForms[index], ...newData };
      }
      return updatedForms;
    });
  };
  
  const getInsuranceAmountForAge = (ageInMonths: number, ageGroups: any[]) => {
    const ageGroup = ageGroups.find(group => {
      const [minAge, maxAge] = group.age_group.split('–').map(ageRange => {
        const ageRangeParts = ageRange.split(' ');
  
        if (ageRangeParts[1] === 'mths') {
          return parseInt(ageRangeParts[0], 10);
        } else {
          return parseInt(ageRangeParts[0], 10) * 12;
        }
      });
      return ageInMonths >= minAge && ageInMonths <= maxAge;
    });
  
    return ageGroup ? ageGroup.merchant_insurance_amount : 0;
  };
  
  const getInsuranceAmounts = (ageInMonths: number, ageGroups: any[]) => {
    const ageGroup = ageGroups.find(group => {
      const [minAge, maxAge] = group.age_group.split('–').map(ageRange => {
        const ageRangeParts = ageRange.split(' ');
  
        if (ageRangeParts[1] === 'mths') {
          return parseInt(ageRangeParts[0], 10);
        } else {
          return parseInt(ageRangeParts[0], 10) * 12; // Convert years to months
        }
      });
      return ageInMonths >= minAge && ageInMonths <= maxAge;
    });
  
    if (ageGroup) {
      return {
        insurance_amount: ageGroup.insurance_amount,
        insurance_original_amount: ageGroup.insurance_original_amount,
        merchant_insurance_amount: ageGroup.merchant_insurance_amount,
      };
    }
  
    return {
      insurance_amount: 0,
      insurance_original_amount: 0,
      merchant_insurance_amount: 0,
    };
  };
  
  

  useEffect(() => {
    const totalAmount = combinedData.applications.reduce((acc, form) => {
      const age = calculateAge(form.birthday_date);
      const amount = getInsuranceAmountForAge(age, selectedEntry.age_groups);
      return acc + amount;
    }, 0);
  
    setTotalAmount(totalAmount);
  }, [combinedData.applications, selectedEntry.age_groups]);
  

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
            setRecieptUrl(imageLink);
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
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])


  const addTravelerForm = () => {
    setTravelerForms((prevForms) => [...prevForms, {}])
  }

  useEffect(() => {
    const newGroupId = generateGroupId()
    setGroupId(newGroupId)
  }, [])

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

  const handleReviewAndSave = async () => {
    try {
        setLoading(true); // Loading ko true set karo jab API calls start ho
        let allFieldsFilled = true; // Isse track karne ke liye ke sare fields filled hain ya nahi
  
        // Travelers ke data ke liye loop
        for (const [index, application] of combinedData.applications.entries()) {
            const missingFields: string[] = [];
            
            // Field validation
            if (!application.first_name) missingFields.push('First Name');
            if (!application.last_name) missingFields.push('Last Name');
            if (!application.birth_place) missingFields.push('Birth Place');
            if (!application.birthday_date) missingFields.push('Birth Detail');
            if (!application.passport_number) missingFields.push('Passport Number');
            if (!application.passport_issue_date) missingFields.push('Passport Issue Date');
            if (!application.passport_expiry_date) missingFields.push('Passport Expiry Date');
            if (!application.gender) missingFields.push('Gender');
            if (!application.marital_status) missingFields.push('Marital Status');
            if (!application.passport_front) missingFields.push('Passport Front');
  
            if (missingFields.length > 0) {
                toast.error(`Missing fields: ${missingFields.join(', ')}`, {
                    position: 'top-center',
                });
                setLoading(false);
                allFieldsFilled = false;
                break;
            }
  
            // Age calculate kar rahe hain traveler ka
            const age = calculateAge(application.birthday_date);
            const { insurance_amount, insurance_original_amount, merchant_insurance_amount } = getInsuranceAmounts(age, selectedEntry.age_groups);
  
            // API call ke liye postData prepare karna
            const postData = {
                country_code: selectedEntry.country_code,
                nationality_code: selectedEntry.nationality_code,
                first_name: application.first_name,
                last_name: application.last_name,
                birth_place: application.birth_place,
                birthday_date: formatDateWithTimezoneToYMD(application.birthday_date),
                nationality: selectedEntry.nationality_code,
                passport_number: application.passport_number,
                passport_issue_date: formatDateWithTimezoneToYMD(application.passport_issue_date),
                passport_expiry_date: formatDateWithTimezoneToYMD(application.passport_expiry_date),
                gender: application.gender,
                group_id: groupId,
                marital_status: application.marital_status,
                passport_front: application.passport_front,
                insurance_id: selectedEntry.id,
                insurance_amount: insurance_amount,
                insurance_original_amount: insurance_original_amount,
                insurance_benefit: selectedEntry.benefits,
                insurance_plan_type: selectedEntry.description,
                insurance_age_group: selectedEntry.age_group,
                merchant_insurance_amount: merchant_insurance_amount,
                receipt_url: recieptUrl,
            };
  
            try {
                // Insurance application create karna
                const createApplicationResponse = await axiosInstance.post('/backend/create_insurance_application', postData);
                setInsuranceResponse(createApplicationResponse.data.data);
  
                const user_id = Cookies.get('user_id');
                const data = {
                    user_id: user_id,
                    insurance_application_id: createApplicationResponse.data.data._id,
                };
  
                // Insurance applicant add karna
                const addApplicantResponse = await axiosInstance.post('/backend/add_user_insurance_applicant', data);
  
                if (addApplicantResponse.status === 200) {
                    setIsReviewModal(false);
                    setConfetti(true);
                    setModalShow(true);
                } else {
                    toast.error(addApplicantResponse.data.msg, {
                        position: 'top-center',
                    });
                }
            } catch (error) {
                console.error('Error while processing form:', error);
                toast.error('Error while processing form', {
                    position: 'top-center',
                });
                setLoading(false);
                return;
            }

            // Agar last traveler form process ho raha hai, toh final API call karein
            if (index === combinedData.applications.length - 1) {
                try {
                    const finalData = {
                        group_id: groupId,
                    };
                    await axiosInstance.post('/backend/insurance_apply', finalData);
                    toast.success('Final insurance application submitted!', {
                        position: 'top-center',
                    });
                } catch (finalError) {
                    console.error('Error while making final API call:', finalError);
                    toast.error('Error while submitting final application', {
                        position: 'top-center',
                    });
                }
            }
        }

        setLoading(false); // Sab kaam ho jaye toh loading false
    } catch (error) {
        console.error('Error while making API calls:', error);
        setLoading(false);
    }
};

  

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

      <div className='d-flex' style={{justifyContent: 'center', width: '100%'}}>
        <div style={{width: '80%', paddingBottom: '5%', marginLeft: isFixed ? '20%' : '0%'}}>
        {combinedData.applications.map((application, index) => (
          <div key={index}>
            <DirectInsurance
              ind={index}
              onDataChange={(newData) => handleTravelerDataChange(newData, index)}
              onFieldChange={handleTravelFieldChange}
              onFileDelete={(fileKey) => handleFileDelete(index, fileKey)}
              combinedData={application}
            />
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
                ) : recieptUrl ? (
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
                      onClick={() => setRecieptUrl('')}
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
                      src={recieptUrl}
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
          <div className='d-flex mt-12'>
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
                {combinedData.applications.map((traveler, index) => (
                  <div
                    key={index}
                    className='d-flex'
                    style={{ justifyContent: 'space-between', width: '100%' }}
                  >
                    <h5>Traveler {index + 1}:</h5>
                    <h5>{getMerchantInsuranceAmount(calculateAge(traveler.birthday_date), selectedEntry.age_groups)}/-</h5>
                  </div>
                ))}

                <div className='d-flex' style={{ justifyContent: 'space-between', width: '100%' }}>
                  <h5>Total: </h5>
                  <h5>{totalAmounta}/-</h5>
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
                  Submit Application
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
          <p>Are you sure you want to proceed with the application?</p>
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

export {DirectVerticaliii}
