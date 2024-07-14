import { useState } from 'react'
import BackIcon from '@mui/icons-material/ArrowBackOutlined'
import ApplicationFormView from './ApplicationFormView'
import { Box, Step, StepLabel, Stepper } from '@mui/material'
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import { toAbsoluteUrl } from '../../_metronic/helpers'
import image from '../../_metronic/assets/card/nodata.jpg'
import imag from '../../../public/media/logos/logo.png'
import axiosInstance from '../helpers/axiosInstance'

type VisaData = {
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
    // Add other properties as needed
}

type InsuranceData = {
    _id: string,
    country_code: string,
    nationality_code: string,
    passport_number: string,
    first_name: string,
    last_name: string,
    birth_place: string,
    birthday_date: string,
    nationality: string,
    passport_issue_date: string,
    passport_expiry_date: string,
    gender: string,
    marital_status: string,
    passport_front: string,
    insurance_status: string,
    insurance_pdf: string,
    insurance_remark: string,
    insurance_id: string,
    insurance_amount: string,
    receipt_url: string,
    created_at: string,
    updated_at: string,
    insurance_plan_type: string,
    insurance_age_group: string,

}

type Props = {
    visaData: VisaData[] | null
    insuranceData: InsuranceData[] | null
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
    // Define your default stepStatuses with 'done' set to false for all steps
    const defaultStepStatuses = [
        { label: 'Application Complete', done: false },
        { label: 'Visa Waiting', done: false },
        { label: 'Visa In-Process', done: false },
        { label: 'Visa Approved', done: false },
        { label: 'Visa Rejected', done: false },
    ];

    // Use a switch statement or if/else to customize stepStatuses based on visa_status
    switch (visa_status) {
        case 'Applied':
        case 'In process':
            // Set 'done' to true for steps up to 'Application Submitted'
            return defaultStepStatuses.map((step, index) =>
                index <= 1 ? { ...step, done: true } : step
            );
        case 'Processed':
        case 'Issue':
            // Set 'done' to true for steps up to 'Visa Approved'
            return defaultStepStatuses.map((step, index) =>
                index === 3 ? { ...step, done: true } : step
            );
        case 'Not Issued':
        case 'Reject':
            // Set 'done' to true for steps up to 'Visa Rejected'
            return defaultStepStatuses.map((step, index) =>
                index === 4 ? { ...step, done: true } : step
            );
        case 'Waiting':
            // Set 'done' to true for steps up to 'Visa In-Process'
            return defaultStepStatuses.map((step, index) =>
                index <= 2 ? { ...step, done: true } : step
            );
        default:
            return defaultStepStatuses;
    }
};

const VisaDetailCard = ({ visaData, insuranceData }: Props) => {
    function generateDynamicInvoice(data) {
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
                                            Invoice #: #${data._id}<br />
                                            Issue: ${formatDate(data.created_at)}<br />
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
                                            ${data.first_name} ${data.last_name}.<br />
                                            ${data.passport_number}<br />
                                            ${data.birth_place}
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
                            <td>${data.visa_description}</td>
                            
                            <td>₹ ${data.markup_visa_amount - 50}</td>
                        </tr>
                        <tr class="item">
                            <td>Service fee .</td>
        
                            <td>₹ 50</td>
                        </tr>
        
                        <tr class="total">
                            <td></td>
        
                            <td>Total: ₹${data.markup_visa_amount}</td>
                        </tr>
                                        <tr class="item">
                            <td></td>
        
                            <td>inclusive of all taxes</td>
                        </tr>
                    </table>
                </div>
            </body>
        </html>
        `
        
    }

    const generateAndDownloadPDF = (data) => {
        // Generate dynamic invoice content using data (similar to the earlier example)
        const dynamicInvoiceContent = generateDynamicInvoice(data);

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = dynamicInvoiceContent;
        // Create new jsPDF instance
        const pdf = new jsPDF();

        // Set up the PDF content from the HTML string
        const options = {
            margin: 10,
            filename: `visa_${data._id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generate PDF from HTML content
        html2pdf()
            .from(contentDiv)
            .set(options)
            .save();
    };

    const [Detail, seeDetail] = useState(false)
    const [selectedVisa, setSelectedVisa] = useState<VisaData | null>(null)
    const [viewApplication, setViewApplication] = useState<VisaData | null>(null)
    const [activeTab, setActiveTab] = useState('visa');
    const handleTabChange = (tab) => {
        setActiveTab(tab);
      };
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

    if (visaData === null || visaData.length === 0) {
        return (
        <div className='  d-flex align-items-center justify-content-center'>
            <div className='d-flex flex-column align-items-center justify-content-center'>
                <img className='fade-in-out' style={{width:"300px", height:"300px"}} src={image}/>
                <h1>No Visa Data Available</h1>
            </div>
        </div>
        )
    }

    const checkVisaStatus = async (selectedVisa) => {
        try {
            const response = await axiosInstance.post('/backend/check_visa_status', {
                application_id: selectedVisa.application_id
            });
        } catch (error) {
            console.error('There was a problem with your axios operation:', error);
        }
    };

    if (selectedVisa) {

        const stepStatusesForVisa = getStepStatuses(selectedVisa.visa_status);

        return (
            <div style={{marginTop:"30px"}}>
                <div
                    onClick={handleGoBackClick}
                    style={{ cursor: 'pointer' }}
                    className='d-flex items-center'
                >
                    <BackIcon style={{ color: '#327113' }} />
                    <h6 style={{ color: '#327113', marginLeft: 10 }}>Go Back to main Dashboard</h6>
                </div>
                <div className='p-10'>
                    <h2>
                        {selectedVisa.first_name} {selectedVisa.last_name} - {selectedVisa.passport_number} -{' '}
                        {formatDate1(selectedVisa.application_arrival_date)}
                    </h2>
                    <br />
                    <div className='d-flex'>
                        <h6>
                            Created On
                            <p className='pt-2 fs-8'>{formatDate1(selectedVisa.created_at)}</p>
                        </h6>
                        <h6 className='px-20'>
                            Applicants
                            <p className='pt-2 fs-8'>1</p>
                        </h6>
                    </div>
                </div>
                <div className='card-body'>
                    <div
                        className='w-full'
                        style={{
                            borderRadius: 20,
                            borderColor: '#f5f5f5',
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
                            <h2 style={{ color: 'white', paddingTop: 7 }}>VISA {selectedVisa.visa_status}</h2>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginLeft: 15,
                                marginTop: 15,
                            }}
                        >
                            <div style={{ flex: '1', borderRight: '1px solid #f5f5f5' }} className='p-10'>
                                <h2>
                                    {selectedVisa.first_name} {selectedVisa.last_name}
                                </h2>
                                <br />
                                <h6>
                                    Submitted On:
                                    {formatDate(selectedVisa.created_at)}
                                    <br />
                                    <br />
                                    Passport Number: {selectedVisa.passport_number}
                                </h6>
                                <br />

                                <h5>{getCountryNameByCode(selectedVisa.country_code)}</h5>
                                <p>
                                    {selectedVisa.visa_description}
                                    <br />
                                    Travel: {formatDate1(selectedVisa.application_arrival_date)} -{' '}
                                    {formatDate1(selectedVisa.application_departure_date)}
                                </p>
                            </div>
                            <div style={{ flex: '1', borderRight: '1px solid #f5f5f5' }} className='p-10'>
                                <h2>Application Details :</h2>
                                <br />

                                <div style={{ flex: '1', padding: '20px', paddingTop: 0, marginLeft: 20 }}>
                                    <Stepper orientation="vertical">
                                        {stepStatusesForVisa.map((step, index) => (
                                            <Step style={{color:"#327113"}} key={step.label} completed={step.done}>
                                                <StepLabel style={{ padding: 0, paddingLeft: 0 }}>
                                                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                                                        <span style={{ fontSize: 14, marginLeft: 5 }}>{step.label}</span>
                                                    </Box>
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </div>
                            </div>

                            <div style={{ flex: '1', borderRight: '1px solid #f5f5f5' }} className='p-10 '>
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
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    <h6 className='fs-4' style={{ color: '#327113', paddingTop: 7 }}>
                                        View Application
                                    </h6>

                                </div>
                                {selectedVisa.visa_status === 'Proccesed' &&
                                    <button className='mb-10 mx-10 px-20 py-5' style={{
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: 10,
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        backgroundColor: '#327113',
                                        color: '#fff',
                                        fontSize: "17px",
                                        whiteSpace: 'nowrap'

                                    }}>
                                        Download
                                    </button>
                                }
                                {selectedVisa.visa_status === 'Not issued' &&
                                    <button className='mb-10 mx-10 px-20 py-5' style={{
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: 10,
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        backgroundColor: '#327113',
                                        color: '#fff',
                                        fontSize: "17px",
                                        whiteSpace: 'nowrap'

                                    }}>
                                        Issue Visa
                                    </button>
                                }
                                {selectedVisa.visa_status === 'In process' || selectedVisa.visa_status === 'Applied' &&
                                    <button  onClick={() => checkVisaStatus(selectedVisa)} className='mb-10 mx-10 px-20 py-5' style={{
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: 10,
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        backgroundColor: '#327113',
                                        color: '#fff',
                                        fontSize: "17px",
                                        whiteSpace: 'nowrap'
                                    }}>
                                        Check Status
                                    </button>
                                }
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
            <div style={{marginTop:"30px"}}>
                <div
                    onClick={handleGoBackClick}
                    style={{ cursor: 'pointer' }}
                    className='d-flex items-center'
                >
                    <BackIcon style={{ color: '#327113' }} />
                    <h6 style={{ color: '#327113', marginLeft: 10 }}>Go Back to main Dashboard</h6>
                </div>
                <ApplicationFormView viewApplication={viewApplication} />
            </div>
        )
    }
    const downloadVisa = (entry) => {
        const pdfUrl = entry.visa_pdf;
        window.open(pdfUrl, '_blank'); 
    };

    const downloadreciept = (entry) => {
        const pdfUrl = entry.reciept_url;
        window.open(pdfUrl, '_blank'); 
    };

    const downloadInsurance = (entry) => {
        const pdfUrl = entry.insurance_pdf;
        window.open(pdfUrl, '_blank'); 
    };

    return (
        <div>
            <div className="d-flex justify-content-center best-tab my-8 gap-4">
                <button
                className={`age-group-tab capitalize ${activeTab === 'visa' ? 'active' : ''}`}
                onClick={() => handleTabChange('visa')}
                style={{ backgroundColor: activeTab === 'visa' ? '#327113' : 'inherit', color: activeTab === 'visa' ? '#fff' : '#327113' }}
                >
                Visa
                </button>
                <button
                className={`age-group-tab capitalize ${activeTab === 'insurance' ? 'active' : ''}`}
                onClick={() => handleTabChange('insurance')}
                style={{ backgroundColor: activeTab === 'insurance' ? '#327113' : 'inherit', color: activeTab === 'insurance' ? '#fff' : '#327113' }}
                >
                Insurance
                </button>
            </div>
            <div>
                {activeTab === 'visa' && visaData?.map((entry, index) => (
                <div
                    className='w-full mt-5'
                    key={index}
                    style={{
                    display: 'flex',
                    backgroundColor: '#fff',
                    justifyContent: 'space-between',
                    borderRadius: 25,
                    borderColor: '#f5f5f5',
                    boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    }}
                >
                    <div style={{ flex: '1', borderRight: '1px solid #f5f5f5' }} className='p-10'>
                    <h2 style={{ textTransform: 'capitalize' }}>
                        {entry.first_name} {entry.last_name} - {entry.passport_number} -{' '}
                        {formatDate1(entry.application_arrival_date)}
                    </h2>
                    <h6>Created: {formatDate(entry.created_at)}</h6>

                    <h5 style={{ marginTop: 20 }}>{getCountryNameByCode(entry.country_code)}</h5>
                    <p>
                        {entry.visa_description} {entry.entry_process}:{' '}
                        {formatDate1(entry.application_arrival_date)} -{' '}
                        {formatDate1(entry.application_departure_date)}
                    </p>
                    </div>
                    <div style={{ flex: '1', borderRight: '1px solid #f5f5f5' }} className='p-10'>
                    <h2>Applicants: 1</h2>
                    <br />
                    <h6>{entry.visa_status}</h6>
                    <br />
                    <h6>Remarks - <span style={{ color: "red" }}>{entry.visa_remark ? entry.visa_remark : ''}</span></h6>
                    </div>
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <button
                        type='submit'
                        id='kt_sign_in_submit'
                        className='btn btn-success'
                        onClick={() => handleViewDetailsClick(entry)}
                        style={{ backgroundColor: '#327113' }}
                    >
                        Track Application
                    </button>
                    <button
                        type='submit'
                        id='kt_sign_in_submit'
                        className='btn btn-success'
                        onClick={() => generateAndDownloadPDF(entry)}
                        style={{ backgroundColor: '#327113', marginTop: 20 }}
                    >
                        Download Invoice
                    </button>
                    {entry.visa_pdf && (
                        <button
                        type='submit'
                        id='kt_sign_in_submit'
                        className='btn btn-success'
                        onClick={() => downloadVisa(entry)}
                        style={{ backgroundColor: '#fff', marginTop: 20, color: "#327113", border: "1px solid #327113" }}
                        >
                        Download Visa
                        </button>
                    )}
                    </div>
                </div>
                ))}

                {activeTab === 'insurance' && insuranceData?.map((entry, index) => (
                <div
                    className='w-full mt-5'
                    key={index}
                    style={{
                    display: 'flex',
                    backgroundColor: '#fff',
                    justifyContent: 'space-between',
                    borderRadius: 25,
                    borderColor: '#f5f5f5',
                    boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    }}
                >
                    <div style={{ flex: '1', borderRight: '1px solid #f5f5f5' }} className='p-10'>
                    <h2 style={{ textTransform: 'capitalize' }}>
                        {entry.first_name} {entry.last_name} - {entry.passport_number} -{' '}
                        {formatDate1(entry.created_at)}
                    </h2>
                    <h6>Created: {formatDate(entry.created_at)}</h6>

                    <h5 style={{ marginTop: 20 }}>Passport Details</h5>
                    <p>
                        Validity :{' '}
                        {formatDate1(entry.passport_issue_date)} -{' '}
                        {formatDate1(entry.passport_expiry_date)}
                    </p>
                    </div>
                    <div style={{ flex: '1', borderRight: '1px solid #f5f5f5' }} className='p-10'>
                    <h2>{entry.insurance_plan_type}</h2>
                    <h6>{entry.insurance_age_group}</h6>
                    <br />
                    <h6>{entry.insurance_status}</h6>
                    <br />
                    <h6>Remarks - <span style={{ color: "red" }}>{entry.insurance_remark ? entry.insurance_remark : ''}</span></h6>
                    </div>
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <button
                        type='submit'
                        id='kt_sign_in_submit'
                        className='btn btn-success'
                        onClick={() => downloadreciept(entry)}
                        style={{ backgroundColor: '#327113', marginTop: 20 }}
                    >
                        Download Reciept
                    </button>
                    {entry.insurance_pdf && (
                        <button
                        type='submit'
                        id='kt_sign_in_submit'
                        className='btn btn-success'
                        onClick={() => downloadInsurance(entry)}
                        style={{ backgroundColor: '#fff', marginTop: 20, color: "#327113", border: "1px solid #327113" }}
                        >
                        Download Insurance
                        </button>
                    )}
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

export { VisaDetailCard }
