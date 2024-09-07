import {useState, CSSProperties} from 'react'
import BackIcon from '@mui/icons-material/ArrowBackOutlined'
import ApplicationFormView from './ApplicationFormView'
import {Box, Step, StepLabel, Stepper} from '@mui/material'
import jsPDF from 'jspdf'
import html2pdf from 'html2pdf.js'
import {toAbsoluteUrl} from '../../_metronic/helpers'
import image from '../../_metronic/assets/card/nodata.jpg'
import imag from '../../../public/media/logos/logo.png'
import {Form, Button, Row, Col, Container} from 'react-bootstrap'
import Loader from '../components/Loader'
import axiosInstance from '../helpers/axiosInstance'
import {CloseOutlined} from '@mui/icons-material'
import TravelerForm1 from '../modules/wizards/components/TravelerForm1'
import TraverlerReForm from './TraverlerReForm'
import toast, {Toaster} from 'react-hot-toast'
import InsuranceReForm from './InsuranceReForm'
import HotelReForm from './HotelReForm'
import FlightReForm from './FlightReForm'


interface ApplicantData {
  _id: string
  first_name: string
  age: string
  gender: string
  receipt_url: string
  passport_front: string
}

type Applicationss = {
  _id: string
  country_code: string
  nationality_code: string
  passport_number: string
  first_name: string
  last_name: string
  birth_place: string
  birthday_date: string
  nationality: string
  passport_issue_date: string
  passport_expiry_date: string
  gender: string
  marital_status: string
  passport_front: string
  insurance_status: string
  insurance_pdf: string
  insurance_remark: string
  insurance_id: string
  insurance_amount: string
  receipt_url: string
  created_at: string
  updated_at: string
  insurance_plan_type: string
  insurance_age_group: string
}

type HotelData = {
  _id: string
  country_code: string
  nationality_code: string
  first_name: string
  traveller: string
  hotel_status: string
  hotel_pdf: string | null
  hotel_remark: string | null
  hotel_id: string
  hotel_amount: string
  hotel_original_amount: string
  merchant_hotel_amount: string
  receipt_url: string
  created_at: string
  updated_at: string
  __v: number
}

type Application = {
  _id: string
  country_code: string
  nationality_code: string
  first_name: string
  passport_front: string | null
  age: string
  gender: string
  flight_status: string
  flight_pdf: string | null
  flight_remark: string | null
  flight_id: string
  group_id: string
  flight_amount: string
  flight_original_amount: string
  merchant_flight_amount: string
  receipt_url: string | null
  created_at: string
  updated_at: string
  __v: number
}

type Applications = {
country_code: string
nationality_code: string
entry_process: string
application_id: string
customer_id: string
first_name: string
last_name: string
birth_place: string
birthday_date: string
nationality: string
passport_number: string
passport_issue_date: string
passport_expiry_date: string
gender: string
marital_status: string
passport_front: string
application_arrival_date: string
application_departure_date: string
application_destination: string
photo: string
fathers_name: string
passport_back: string
pan_card: string
visa_status: string
visa_amount: string
visa_provider: string
created_at: string
updated_at: string
visa_description: string
visa_pdf: string
visa_remark: string
}

type FlightData = {
  group_id: string
  applications: Application[]
}

type VisaData = {
  group_id: string
  applications: Applications[]
}

type InsuranceData = {
  group_id: string
  applications: Applicationss[]
}

type Props = {
  visaData: VisaData[] | null
  insuranceData: InsuranceData[] | null
  hotelData: HotelData[] | null
  flightData: FlightData[] | null
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 0.3s, visibility 0.3s',
}

const activeOverlayStyle: CSSProperties = {
  opacity: 1,
  visibility: 'visible',
}

const contentStyle: CSSProperties = {
  backgroundColor: '#fff',
  padding: '15px',
  borderRadius: '5px',
  width: '70%',
  height: '70%',
  overflowY: 'auto',
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  const formattedDate = date.toLocaleDateString('en-US', options)
  return formattedDate
}

const formatDate1 = (dateString) => {
  // Create a Date object from the input date string
  const date = new Date(dateString)

  // Get the month name as a three-letter abbreviation (e.g., "Oct")
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

  // Get the day and year
  const day = date.getDate()
  const year = date.getFullYear()

  // Format the date string
  return `${month} ${day}, ${year}`
}
const getCountryNameByCode = (countryCode) => {
  const countryCodes = {
    AE: 'United Arab Emirates',
  }

  // Use the provided countryCode to look up the country name
  return countryCodes[countryCode] || 'Unknown' // Default to "Unknown" if the code is not found
}

const getStepStatuses = (visa_status) => {
  const defaultStepStatuses = [
    {label: 'Application Complete', done: false},
    {label: 'Visa Waiting', done: false},
    {label: 'Visa In-Process', done: false},
    {label: 'Visa Approved', done: false},
    {label: 'Visa Rejected', done: false},
  ]

  switch (visa_status) {
    case 'Applied':
    case 'Not Issued':
      return defaultStepStatuses.map((step, index) => (index <= 1 ? {...step, done: true} : step))
    case 'Processed':
    case 'Issue':
      return defaultStepStatuses.map((step, index) => (index === 3 ? {...step, done: true} : step))
    case 'Reject':
      return defaultStepStatuses.map((step, index) => (index === 4 ? {...step, done: true} : step))
    case 'Waiting':
      return defaultStepStatuses.map((step, index) => (index <= 2 ? {...step, done: true} : step))
    default:
      return defaultStepStatuses
  }
}

const VisaDetailCard = ({visaData, insuranceData, hotelData, flightData}: Props) => {
  
  function generateDynamicInvoice(data) {
    // Extract the first application data
    const firstEntry = data.applications[0];

    // Calculate total markup_visa_amount from all applications
    const totalVisaAmount = data.applications.reduce((total, app) => total + parseFloat(app.markup_visa_amount), 0);

    // Count number of applications
    const totalApplicants = data.applications.length;

    return `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <title>Visa247</title>
        
                <style>
                  @page {
                    size: A4;
                    margin: 10;
                  }
        
                  body {
                    margin: 10;
                    padding: 10;
                  }
                    .invoice-box {
                        max-width: 800px;
                        margin: auto;
                        padding: 30px;
                        border: 1px solid #eee;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                        font-size: 16px;
                        line-height: 24px;
                        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                        color: #555;
                    }
        
                    .invoice-box table {
                        width: 100%;
                        line-height: inherit;
                        text-align: left;
                    }
        
                    .invoice-box table td {
                        padding: 5px;
                        vertical-align: top;
                    }
        
                    .invoice-box table tr td:nth-child(2) {
                        text-align: right;
                    }
        
                    .invoice-box table tr.top table td {
                        padding-bottom: 20px;
                    }
        
                    .invoice-box table tr.top table td.title {
                        font-size: 45px;
                        line-height: 45px;
                        color: #333;
                    }
        
                    .invoice-box table tr.information table td {
                        padding-bottom: 40px;
                    }
        
                    .invoice-box table tr.heading td {
                        background: #eee;
                        border-bottom: 1px solid #ddd;
                        font-weight: bold;
                    }
        
                    .invoice-box table tr.details td {
                        padding-bottom: 20px;
                    }
        
                    .invoice-box table tr.item td {
                        border-bottom: none;
                    }
        
                    .invoice-box table tr.item.last td {
                        border-bottom: none;
                    }
        
                    .invoice-box table tr.total td:nth-child(2) {
                        border-top: 2px solid #eee;
                        font-weight: bold;
                    }
        
                    @media only screen and (max-width: 600px) {
                        .invoice-box table tr.top table td {
                            width: 100%;
                            display: block;
                            text-align: center;
                        }
        
                        .invoice-box table tr.information table td {
                            width: 100%;
                            display: block;
                            text-align: center;
                        }
                    }
        
                    /** RTL **/
                    .invoice-box.rtl {
                        direction: rtl;
                        font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                    }
        
                    .invoice-box.rtl table {
                        text-align: right;
                    }
        
                    .invoice-box.rtl table tr td:nth-child(2) {
                        text-align: left;
                    }
                </style>
            </head>
        
            <body>
                <div class="invoice-box">
                    <table cellpadding="0" cellspacing="0">
                        <tr class="top">
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td class="title">
                                            <img
                                                src="https://visa24-7.blr1.digitaloceanspaces.com/logo%20(1).png"
                                                style="width: 100%; max-width: 200px"
                                            />
                                        </td>
        
                                        <td>
                                            Invoice #: #${firstEntry._id}<br />
                                            Issue: ${formatDate(firstEntry.created_at)}<br />
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
        
                        <tr class="information">
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td>
                                            Anantnag<br />
                                            Jammu & Kashmir<br />
                                            India
                                        </td>
        
                                        <td>
                                            ${firstEntry.first_name} ${firstEntry.last_name}.<br />
                                            ${firstEntry.passport_number}<br />
                                            ${firstEntry.birth_place}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
        
                        <tr class="heading">
                            <td>Payment Method</td>
        
                            <td>Wallet</td>
                        </tr>
        
                        <tr class="details">
                            <td></td>
        
                            <td></td>
                        </tr>
        
                        <tr class="heading">
                            <td>Visa Type</td>
        
                            <td>Price</td>
                        </tr>
        
                        <tr class="item">
                            <td>${firstEntry.visa_description}</td>
                            
                            <td>₹ ${firstEntry.markup_visa_amount - 50} x ${totalApplicants} applicants</td> <!-- Showing price per applicant and number of applicants -->
                        </tr>
                        <tr class="item">
                            <td>Service fee</td>
        
                            <td>₹ 50 x ${totalApplicants}</td>
                        </tr>
        
                        <tr class="total">
                            <td></td>
        
                            <td>Total: ₹${totalVisaAmount}</td> <!-- Total from all applications -->
                        </tr>
                        <tr class="item">
                            <td></td>
                            <td>inclusive of all taxes</td>
                        </tr>
                    </table>
                </div>
            </body>
        </html>
        `;
  }

  const generateAndDownloadPDF = (data) => {
    // Generate dynamic invoice content using data (similar to the earlier example)
    const dynamicInvoiceContent = generateDynamicInvoice(data)

    const contentDiv = document.createElement('div')
    contentDiv.innerHTML = dynamicInvoiceContent
    // Create new jsPDF instance
    const pdf = new jsPDF()

    // Set up the PDF content from the HTML string
    const options = {
      margin: 10,
      filename: `visa_${data._id}.pdf`,
      image: {type: 'jpeg', quality: 0.98},
      html2canvas: {scale: 2},
      jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
    }

    // Generate PDF from HTML content
    html2pdf().from(contentDiv).set(options).save()
  }

  const [Detail, seeDetail] = useState(false)
  const [selectedVisa, setSelectedVisa] = useState<VisaData | null>(null)
  const [loading, setLoading] = useState(false)
  const [viewApplication, setViewApplication] = useState<VisaData | null>(null)
  const [activeTab, setActiveTab] = useState('visa')
  const [visible, setVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [visible3, setVisible3] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ApplicantData[]>([])
  const [formData, setFormData] = useState<any[]>([]);

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }
  const handleViewDetailsClick = (entry: VisaData) => {
    setSelectedVisa(entry)
  }

  const handleViewApplicationClick = (entry: VisaData) => {
    setSelectedVisa(null)
    setViewApplication(entry)
  }

  const handleGoBackClick = () => {
    setSelectedVisa(null)
    setViewApplication(null)
  }

  console.log("visa", visaData)
  console.log("hotel", insuranceData)
  console.log("insurance", hotelData)
  console.log("flight", flightData)

  if (visaData === null || visaData.length === 0) {
    return (
      <div className='  d-flex align-items-center justify-content-center'>
        <div className='d-flex flex-column align-items-center justify-content-center'>
          <img className='fade-in-out' style={{width: '300px', height: '300px'}} src={image} />
          <h1>No Visa Data Available</h1>
        </div>
      </div>
    )
  }

  const checkVisaStatus = async (selectedVisa) => {
    try {
      const response = await axiosInstance.post('/backend/check_visa_status', {
        application_id: selectedVisa.application_id,
      })
    } catch (error) {
      console.error('There was a problem with your axios operation:', error)
    }
  }

  if (selectedVisa) {
    const stepStatusesForVisa = getStepStatuses(selectedVisa.applications[0]?.visa_status);

    return (
      <div style={{marginTop: '30px'}}>
        <div
          onClick={handleGoBackClick}
          style={{cursor: 'pointer'}}
          className='d-flex items-center'
        >
          <BackIcon style={{color: '#327113'}} />
          <h6 style={{color: '#327113', marginLeft: 10}}>Go Back to main Dashboard</h6>
        </div>
        <div className='p-10'>
          <h2>
            {selectedVisa.applications[0]?.first_name} {selectedVisa.applications[0]?.last_name} - {selectedVisa.applications[0]?.passport_number} -{' '}
            {formatDate1(selectedVisa.applications[0]?.application_arrival_date)}
          </h2>
          <br />
          <div className='d-flex'>
            <h6>
              Created On
              <p className='pt-2 fs-8'>{formatDate1(selectedVisa.applications[0]?.created_at)}</p>
            </h6>
            <h6 className='px-20'>
              Applicants
              <p className='pt-2 fs-8'>{selectedVisa.applications.length}</p>
            </h6>
          </div>
        </div>
        <div className='card-body'>
          <div
            className='w-full'
            style={{
              borderRadius: 20,
              borderColor: '#DFDFDF',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              marginLeft: 10,
            }}
          >
            <div
              style={{
                backgroundColor: '#327113',
                width: '100%',
                height: 50,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                paddingLeft: 20,
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <h2 style={{color: 'white', paddingTop: 7}}>VISA {selectedVisa.applications[0]?.visa_status}</h2>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginLeft: 15,
                marginTop: 15,
              }}
            >
              <div style={{flex: '1', borderRight: '1px solid #DFDFDF'}} className='p-10'>
                <h2>
                  {selectedVisa.applications[0]?.first_name} {selectedVisa.applications[0]?.last_name}
                </h2>
                <br />
                <h6>
                  Submitted On:
                  {formatDate(selectedVisa.applications[0]?.created_at)}
                  <br />
                  <br />
                  Passport Number: {selectedVisa.applications[0]?.passport_number}
                </h6>
                <br />

                <h5>{getCountryNameByCode(selectedVisa.applications[0]?.country_code)}</h5>
                <p>
                  {selectedVisa.applications[0]?.visa_description}
                  <br />
                  Travel: {formatDate1(selectedVisa.applications[0]?.application_arrival_date)} -{' '}
                  {formatDate1(selectedVisa.applications[0]?.application_departure_date)}
                </p>
              </div>
              <div style={{flex: '1', borderRight: '1px solid #DFDFDF'}} className='p-10'>
                <h2>Application Details :</h2>
                <br />

                <div style={{flex: '1', padding: '20px', paddingTop: 0, marginLeft: 20}}>
                  <Stepper orientation='vertical'>
                    {stepStatusesForVisa.map((step, index) => (
                      <Step style={{color: '#327113'}} key={step.label} completed={step.done}>
                        <StepLabel style={{padding: 0, paddingLeft: 0}}>
                          <Box display='flex' flexDirection='column' alignItems='flex-start'>
                            <span style={{fontSize: 14, marginLeft: 5}}>{step.label}</span>
                          </Box>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </div>
              </div>

              <div style={{flex: '1', borderRight: '1px solid #DFDFDF'}} className='p-10 '>
                <div
                  onClick={() => handleViewApplicationClick(selectedVisa)}
                  className='mb-10 mx-10 mt-20 px-10 py-5'
                  style={{
                    border: '2px solid #327113',
                    cursor: 'pointer',
                    borderRadius: 10,
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: '#327113',
                  }}
                >
                  <h6 className='fs-4' style={{color: '#fff', paddingTop: 7}}>
                    View Application
                  </h6>
                </div>
                {/* {selectedVisa.visa_status === 'Proccesed' && (
                  <button
                    className='mb-10 mx-10 px-20 py-5'
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: 10,
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: '#327113',
                      color: '#fff',
                      fontSize: '17px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Download
                  </button>
                )}
                {selectedVisa.visa_status === 'Not issued' && (
                  <button
                    className='mb-10 mx-10 px-20 py-5'
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: 10,
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: '#327113',
                      color: '#fff',
                      fontSize: '17px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Issue Visa
                  </button>
                )}
                {selectedVisa.visa_status === 'In process' ||
                  (selectedVisa.visa_status === 'Applied' && (
                    <button
                      onClick={() => checkVisaStatus(selectedVisa)}
                      className='mb-10 mx-10 px-20 py-5'
                      style={{
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 10,
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: '#327113',
                        color: '#fff',
                        fontSize: '17px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Check Status
                    </button>
                  ))} */}
              </div>
            </div>
          </div>
          {/* end::Table container */}
        </div>
      </div>
    )
  }
  if (viewApplication) {
    return (
      <div style={{marginTop: '30px'}}>
        <div
          onClick={handleGoBackClick}
          style={{cursor: 'pointer'}}
          className='d-flex items-center'
        >
          <BackIcon style={{color: '#327113'}} />
          <h6 style={{color: '#327113', marginLeft: 10}}>Go Back to main Dashboard</h6>
        </div>
        <ApplicationFormView viewApplication={viewApplication} />
      </div>
    )
  }
  const downloadVisa = (entry) => {
    const pdfUrl = entry.visa_pdf
    window.open(pdfUrl, '_blank')
  }

  const downloadreciept = (entry) => {
    const pdfUrl = entry.reciept_url
    window.open(pdfUrl, '_blank')
  }

  const downloadInsurance = (entry) => {
    const pdfUrl = entry.insurance_pdf
    window.open(pdfUrl, '_blank')
  }

  const downloadFlightPDF = (entry) => {
    const pdfUrl = entry.flight_pdf
    window.open(pdfUrl, '_blank')
  }

  const downloadHotelPDF = (entry) => {
    const pdfUrl = entry.hotel_pdf
    window.open(pdfUrl, '_blank')
  }

  const handleVisibilityClick = (selectedEntry) => {
    const reSubmitApplicants = selectedEntry.applications.filter(
      (app) => app.visa_status === 'Re-Submit'
    )
    setVisible(true)
    setSelectedItem(reSubmitApplicants)
  }

  const handleVisibilityClick1 = (entry) => {
    setSelectedItem(entry)
    setVisible1(true)
  }

  const handleVisibilityClick2 = (entry) => {
    setSelectedItem(entry)
    setVisible2(true)
  }

  const handleVisibilityClick3 = (selectedEntry) => {
    const reSubmitApplicants = selectedEntry.applications.filter(
      (app) => app.flight_status === 'Re-Submit'
    )
    setVisible3(true)
    setSelectedItem(reSubmitApplicants)
  }

  const handleCloseClick1 = () => {
    setVisible1(false)
  }

  const handleCloseClick = () => {
    setVisible(false)
  }

  const handleCloseClick2 = () => {
    setVisible2(false)
  }

  const handleCloseClick3 = () => {
    setVisible3(false)
  }

  const handleTravelerDataChange = (newData, index) => {
    setSelectedItem(newData)
  }

  const handleDataChange = (index: number, updatedData: ApplicantData) => {
    const updatedItems = [...selectedItem]
    updatedItems[index] = updatedData
    setSelectedItem(updatedItems)
  }

  const handleTravelerDataChangee = (updatedData: any, index: number) => {
    const newFormData = [...formData];
    newFormData[index] = updatedData; // Update data at the specific index
    setFormData(newFormData);
  };

  const handleSubmitVisa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const responses = await Promise.all(
        formData.map((data) =>
          axiosInstance.post('/backend/update_user_application', data)
        )
      );

      const success = responses.every((response) => response.data.success === 1);
      if (success) {
        toast.success('All data updated successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      } else {
        toast.error('Error updating some data');
      }
    } catch (error) {
      console.error('Error updating user applications:', error);
      toast.error('Error updating data');
    }
  };


  const handleSubmitAll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const allData = selectedItem.map((data) => ({
      _id: data._id,
      first_name: data.first_name,
      age: data.age,
      gender: data.gender,
      receipt_url: data.receipt_url,
      passport_front: data.passport_front,
    }))

    try {
      const response = await axiosInstance.post('/backend/update_flight_application', allData)

      if (response.data.success === 1) {
        toast.success('All data updated successfully!')
      } else {
        toast.error('Error updating data: ' + response.data.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Error updating data:', error)
      toast.error('Error updating data: ')
    }
  }

  return (
    <div>
      <Toaster />
      <div className='d-flex justify-content-center best-tab my-8 gap-4'>
        <button
          className={`age-group-tab capitalize ${activeTab === 'visa' ? 'active' : ''}`}
          onClick={() => handleTabChange('visa')}
          style={{
            backgroundColor: activeTab === 'visa' ? '#327113' : 'inherit',
            color: activeTab === 'visa' ? '#fff' : '#327113',
          }}
        >
          Visa
        </button>
        <button
          className={`age-group-tab capitalize ${activeTab === 'insurance' ? 'active' : ''}`}
          onClick={() => handleTabChange('insurance')}
          style={{
            backgroundColor: activeTab === 'insurance' ? '#327113' : 'inherit',
            color: activeTab === 'insurance' ? '#fff' : '#327113',
          }}
        >
          Insurance
        </button>
        <button
          className={`age-group-tab capitalize ${activeTab === 'hotel' ? 'active' : ''}`}
          onClick={() => handleTabChange('hotel')}
          style={{
            backgroundColor: activeTab === 'hotel' ? '#327113' : 'inherit',
            color: activeTab === 'hotel' ? '#fff' : '#327113',
          }}
        >
          Hotel
        </button>
        <button
          className={`age-group-tab capitalize ${activeTab === 'flight' ? 'active' : ''}`}
          onClick={() => handleTabChange('flight')}
          style={{
            backgroundColor: activeTab === 'flight' ? '#327113' : 'inherit',
            color: activeTab === 'flight' ? '#fff' : '#327113',
          }}
        >
          Flight
        </button>
      </div>
      <div>
      {activeTab === 'visa' && (
        visaData && visaData.length > 0 ? (
        visaData?.map((entry, index) => {
            const hasReSubmit = entry.applications?.some((app) => app.visa_status === 'Re-Submit');

            return (
              <div
                className='w-full mt-5'
                key={index}
                style={{
                  display: 'flex',
                  backgroundColor: '#fff',
                  justifyContent: 'space-between',
                  borderRadius: 25,
                  border: '1px solid #DFDFDF',
                  width: '100%',
                }}
              >
                <div style={{flex: '1', borderRight: '1px solid #DFDFDF'}} className='p-10'>
                  <h3 style={{textTransform: 'capitalize'}}>
                    {entry.applications[0]?.first_name} {entry.applications[0]?.last_name} - {entry.applications[0]?.passport_number}
                  </h3>
                  <p>Created: {formatDate(entry.applications[0]?.created_at)}</p>

                  <h5 style={{marginTop: 20}}>{entry.applications[0]?.country_code}</h5>
                  <p>
                    {entry.applications[0]?.visa_description} {entry.applications[0]?.entry_process}:{' '}
                    {formatDate1(entry.applications[0]?.application_arrival_date)} -{' '}
                    {formatDate1(entry.applications[0]?.application_departure_date)}
                  </p>
                </div>
                <div style={{flex: '1', borderRight: '1px solid #DFDFDF'}} className='p-10'>
                  <h2>Applicants: {entry.applications.length}</h2>
                  <br />
                  <h6 style={{color: 'red'}}>
                    Status: {hasReSubmit ? 'Re-Submit' : entry.applications[0]?.visa_status}
                  </h6>
                  <br />
                  {entry.applications[0]?.visa_remark && (
                    <h6>
                      Remarks -{' '}
                      <span style={{color: 'red'}}>{entry.applications[0]?.visa_remark}</span>
                    </h6>
                  )}
                </div>
                <div
                  style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {/* <button
                    type='submit'
                    id='kt_sign_in_submit'
                    className='btn btn-success'
                    onClick={() => handleViewDetailsClick(entry)}
                    style={{backgroundColor: '#327113'}}
                  >
                    Track Application
                  </button> */}
                  <button
                    type='submit'
                    id='kt_sign_in_submit'
                    className='btn btn-success'
                    onClick={() => generateAndDownloadPDF(entry)}
                    style={{backgroundColor: '#327113', marginTop: 20}}
                  >
                    Download Invoice
                  </button>
                  {hasReSubmit && (
                    <button
                      type='submit'
                      id='kt_sign_in_submit'
                      className='btn btn-success'
                      onClick={() => handleVisibilityClick(entry)}
                      style={{backgroundColor: '#327113', marginTop: 20}}
                    >
                      Re - Submit Form
                    </button>
                  )}
                  {entry.applications[0]?.visa_pdf && (
                    <button
                      type='submit'
                      id='kt_sign_in_submit'
                      className='btn btn-success'
                      onClick={() => downloadVisa(entry.applications[0])}
                      style={{
                        backgroundColor: '#327113',
                        marginTop: 20,
                      }}
                    >
                      Download Visa
                    </button>
                  )}
                </div>
              </div>
              );
              })
              ) : (
              <p>No data available</p>
              )
              )}

        {activeTab === 'insurance' &&
          insuranceData?.map((entry, index) => {
            const hasReSubmit = entry.applications.some((app) => app.insurance_status === 'Re-Submit');

            return (
              <div
                className='w-full mt-5'
                key={index}
                style={{
                  display: 'flex',
                  backgroundColor: '#fff',
                  justifyContent: 'space-between',
                  borderRadius: 25,
                  border: '1px solid #DFDFDF',
                  width: '100%',
                }}
              >
                <div style={{flex: '1', borderRight: '1px solid #DFDFDF'}} className='p-10'>
                  <h3 style={{textTransform: 'capitalize'}}>
                    {entry.applications[0]?.first_name} {entry.applications[0]?.last_name} - {entry.applications[0]?.passport_number}
                  </h3>
                  <p>Created: {formatDate(entry.applications[0]?.created_at)}</p>

                  <h5 style={{marginTop: 20}}>Passport Details</h5>
                  <p>
                    Validity: {formatDate1(entry.applications[0]?.passport_issue_date)} -{' '}
                    {formatDate1(entry.applications[0]?.passport_expiry_date)}
                  </p>
                </div>
                <div style={{flex: '1', borderRight: '1px solid #DFDFDF'}} className='p-10'>
                  <h2>Applicants: {entry.applications.length}</h2>
                  <br />
                  <h6 style={{color: 'red'}}>{entry.applications[0]?.insurance_status}</h6>
                  <br />
                  {entry.applications[0]?.insurance_remark && (
                    <h6>
                      Remarks -{' '}
                      <span style={{color: 'red'}}>
                        {entry.applications[0]?.insurance_remark || ''}
                      </span>
                    </h6>
                  )}
                </div>
                <div
                  style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                  }}
                >
                  {entry.applications[0]?.insurance_pdf ? (
                    <button
                      type='submit'
                      id='kt_sign_in_submit'
                      className='btn btn-success'
                      onClick={() => downloadInsurance(entry.applications[0])}
                      style={{
                        backgroundColor: '#327113',
                        marginTop: 20,
                      }}
                    >
                      Download Insurance
                    </button>
                  ) : (
                    <p style={{color: 'red', marginTop: 20}}>
                      Once available your insurance pdf will be shown here and you can download it
                      from here only
                    </p>
                  )}
                  {hasReSubmit && (
                    <button
                      type='submit'
                      id='kt_sign_in_submit'
                      className='btn btn-success'
                      onClick={() => handleVisibilityClick(entry)}
                      style={{backgroundColor: '#327113', marginTop: 20}}
                    >
                      Re - Submit Form
                    </button>
                  )}
                </div>
              </div>
            );
          })}


        {activeTab === 'hotel' &&
          hotelData?.map((entry, index) => (
            <div
              className='w-full mt-5'
              key={index}
              style={{
                display: 'flex',
                backgroundColor: '#fff',
                justifyContent: 'space-between',
                borderRadius: 25,
                border: '1px solid #DFDFDF',
                width: '100%',
              }}
            >
              <div style={{flex: '1', borderRight: '1px solid #DFDFDF'}} className='p-10'>
                <h3 style={{textTransform: 'capitalize'}}>
                  {entry.first_name} - {entry.country_code} - {entry.nationality_code}
                </h3>
                <p>Created: {formatDate(entry.created_at)}</p>
                <h5 style={{marginTop: 20}}>{entry.country_code}</h5>
                <p>
                  <strong>Hotel ID: &nbsp;&nbsp;&nbsp;</strong>
                  {entry.hotel_id}
                  <br />
                  <strong>Total Amount:</strong> &nbsp;&nbsp;₹{entry.merchant_hotel_amount}
                </p>
              </div>
              <div style={{flex: '1', borderRight: '1px solid #DFDFDF'}} className='p-10'>
                <h2>Applicants: {entry.traveller}</h2>
                <br />
                <h6 style={{color: 'red'}}>Status: {entry.hotel_status}</h6>
                <br />
                {entry.hotel_remark && (
                  <h6>
                    Remarks -{' '}
                    <span style={{color: 'red'}}>
                      {entry.hotel_remark ? entry.hotel_remark : ''}
                    </span>
                  </h6>
                )}
              </div>
              <div
                style={{
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '10px',
                }}
              >
                {entry.hotel_pdf ? (
                  <button
                    type='submit'
                    id='kt_sign_in_submit'
                    className='btn btn-success'
                    onClick={() => downloadHotelPDF(entry)}
                    style={{
                      backgroundColor: '#327113',
                      marginTop: 20,
                    }}
                  >
                    Download Hotel
                  </button>
                ) : (
                  <p style={{color: 'red', marginTop: 20}}>
                    Once available your hotel pdf will be shown here and you can download it from
                    here only
                  </p>
                )}
                {entry.hotel_status === 'Re-Submit' && (
                  <button
                    type='submit'
                    id='kt_sign_in_submit'
                    className='btn btn-success'
                    onClick={() => handleVisibilityClick2(entry)}
                    style={{backgroundColor: '#327113', marginTop: 20}}
                  >
                    Re - Submit Form
                  </button>
                )}
              </div>
            </div>
          ))}

        {activeTab === 'flight' &&
          flightData?.map((entry, index) => {
            const hasReSubmit = entry.applications.some((app) => app.flight_status === 'Re-Submit')

            return (
              <div
                className='w-full mt-5'
                key={index}
                style={{
                  display: 'flex',
                  backgroundColor: '#fff',
                  justifyContent: 'space-between',
                  borderRadius: 25,
                  border: '1px solid #DFDFDF',
                  width: '100%',
                }}
              >
                <div style={{flex: '1', borderRight: '1px solid #DFDFDF'}} className='p-10'>
                  <h3 style={{textTransform: 'capitalize'}}>
                    {entry.applications[0]?.first_name} - {entry.applications[0]?.country_code} -{' '}
                    {entry.applications[0]?.nationality_code}
                  </h3>
                  <p>Created: {formatDate(entry.applications[0]?.created_at)}</p>
                  <p className='mt-8'>
                    <strong>Group ID: &nbsp;&nbsp;&nbsp;</strong>
                    {entry.group_id}
                    <br />
                    <strong>Total Amount:</strong> &nbsp;&nbsp;₹
                    {entry.applications[0]?.merchant_flight_amount}
                  </p>
                </div>
                <div style={{flex: '1', borderRight: '1px solid #DFDFDF'}} className='p-10'>
                  <h2>Applicants: {entry.applications.length}</h2>
                  <br />
                  <h6 style={{color: 'red'}}>
                    Status: {hasReSubmit ? 'Re-Submit' : entry.applications[0]?.flight_status}
                  </h6>
                  <br />
                  {entry.applications[0]?.flight_remark && (
                    <h6>
                      Remarks -{' '}
                      <span style={{color: 'red'}}>
                        {entry.applications[0]?.flight_remark
                          ? entry.applications[0]?.flight_remark
                          : ''}
                      </span>
                    </h6>
                  )}
                </div>
                <div
                  style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                  }}
                >
                  {entry.applications[0]?.flight_pdf ? (
                    <button
                      type='submit'
                      id='kt_sign_in_submit'
                      className='btn btn-success'
                      onClick={() => downloadFlightPDF(entry.applications[0])}
                      style={{
                        backgroundColor: '#327113',
                        marginTop: 20,
                      }}
                    >
                      Download Flight
                    </button>
                  ) : (
                    <p style={{color: 'red', marginTop: 20}}>
                      Once available your flight pdf will be shown here and you can download it from
                      here only
                    </p>
                  )}
                  {hasReSubmit && (
                    <button
                      type='submit'
                      id='kt_sign_in_submit'
                      className='btn btn-success'
                      onClick={() => handleVisibilityClick3(entry)}
                      style={{backgroundColor: '#327113', marginTop: 20}}
                    >
                      Re - Submit Form
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {visible && (
            <div
              className='loader-overlay'
              style={{...overlayStyle, ...(visible && activeOverlayStyle)}}
            >
              <div style={contentStyle}>
                <div
                  onClick={() => handleCloseClick()}
                  style={{
                    backgroundColor: '#d3d3d3',
                    padding: '9px',
                    position: 'absolute',
                    top: '15%',
                    left: '84.5%',
                    transform: 'translate(-35%, -40%)',
                    borderRadius: 20,
                    cursor: 'pointer',
                  }}
                >
                  <CloseOutlined />
                </div>
                <h1>Edit Application</h1>
                <hr className='ahr' />
                <form onSubmit={handleSubmitVisa}>
                  {Array.isArray(selectedItem) &&
                    selectedItem.map((applicant, idx) => (
                      <TraverlerReForm
                        key={idx}
                        ind={idx}
                        onDataChange={(data) => handleTravelerDataChangee(data, idx)}
                        selectedEntry={applicant}
                      />
                    ))}
                  <Button variant='primary' type='submit' className='mt-3'>
                    Submit
                  </Button>
                </form>
              </div>
            </div>
          )}

        {visible1 && (
          <div
            className='loader-overlay'
            style={{...overlayStyle, ...(visible1 && activeOverlayStyle)}}
          >
            <div style={contentStyle}>
              <div
                onClick={() => handleCloseClick1()}
                style={{
                  backgroundColor: '#d3d3d3',
                  padding: '9px',
                  position: 'absolute',
                  top: '15%',
                  left: '84.5%',
                  transform: 'translate(-35%, -40%)',
                  borderRadius: 20,
                  cursor: 'pointer',
                }}
              >
                <CloseOutlined />
              </div>
              <h1>Edit Application</h1>
              <hr className='ahr' />
              <InsuranceReForm
                ind={0}
                onDataChange={handleTravelerDataChange}
                selectedEntry={selectedItem}
              />
            </div>
          </div>
        )}
        {visible2 && (
          <div
            className='loader-overlay'
            style={{...overlayStyle, ...(visible2 && activeOverlayStyle)}}
          >
            <div style={contentStyle}>
              <div
                onClick={() => handleCloseClick2()}
                style={{
                  backgroundColor: '#d3d3d3',
                  padding: '9px',
                  position: 'absolute',
                  top: '15%',
                  left: '84.5%',
                  transform: 'translate(-35%, -40%)',
                  borderRadius: 20,
                  cursor: 'pointer',
                }}
              >
                <CloseOutlined />
              </div>
              <h1>Edit Application</h1>
              <hr className='ahr' />
              <HotelReForm
                ind={0}
                onDataChange={handleTravelerDataChange}
                selectedEntry={selectedItem}
              />
            </div>
          </div>
        )}
        {visible3 && (
          <div
            className='loader-overlay'
            style={{...overlayStyle, ...(visible3 && activeOverlayStyle)}}
          >
            <div style={contentStyle}>
              <div
                onClick={() => handleCloseClick3()}
                style={{
                  backgroundColor: '#d3d3d3',
                  padding: '9px',
                  position: 'absolute',
                  top: '15%',
                  left: '84.5%',
                  transform: 'translate(-35%, -40%)',
                  borderRadius: 20,
                  cursor: 'pointer',
                }}
              >
                <CloseOutlined />
              </div>
              <h1>Edit Application</h1>
              <hr className='ahr' />
              <form onSubmit={handleSubmitAll}>
                {Array.isArray(selectedItem) &&
                  selectedItem.map((applicant, idx) => (
                    <FlightReForm
                      key={idx}
                      ind={idx}
                      onDataChange={handleDataChange}
                      selectedEntry={applicant}
                    />
                  ))}
                <Button variant='primary' type='submit' className='mt-3'>
                  Submit
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export {VisaDetailCard}
