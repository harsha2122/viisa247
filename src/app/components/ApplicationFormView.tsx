import {useEffect, useState, useRef, ChangeEvent} from 'react'
import {ErrorMessage, Field, Form, Formik, FormikValues} from 'formik'
import {useNavigate} from 'react-router-dom'
import axiosInstance from '../helpers/axiosInstance'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {ICreateAccount, inits} from '../modules/wizards/components/CreateAccountWizardHelper'
function ApplicationFormView({viewApplication}) {
  const [initValues] = useState<ICreateAccount>(inits)

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
  })

  const inputStyle = {
    border: '1.5px solid #d3d3d3',
    borderRadius: '10px', 
    padding: '10px',
    paddingLeft: '20px', 
    width: '90%', 
    boxSizing: 'border-box', 
  }

  const [issueDate, setIssueDate] = useState(null)
  const [expiryDate, setExpiryDate] = useState(null)
  const [dob, setDob] = useState(null)

  const handleDownload1 = () => {
    const imageUrl = viewApplication.passport_front || '';
    const link = document.createElement('a');
    link.href = imageUrl;
    const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
const handleDownload2 = () => {
  const imageUrl = viewApplication.itr || '';
  const link = document.createElement('a');
  link.href = imageUrl;
  const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const handleDownload3 = () => {
  const imageUrl = viewApplication.photo || '';
  const link = document.createElement('a');
  link.href = imageUrl;
  const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const handleDownload4 = () => {
  const imageUrl = viewApplication.pan_card || '';
  const link = document.createElement('a');
  link.href = imageUrl;
  const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const handleDownload5 = () => {
  const imageUrl = viewApplication.passport_back || '';
  const link = document.createElement('a');
  link.href = imageUrl;
  const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const handleDownload6 = () => {
  const imageUrl = viewApplication.letter || '';
  const link = document.createElement('a');
  link.href = imageUrl;
  const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const handleDownload7 = () => {
  const imageUrl = viewApplication.tickets || '';
  const link = document.createElement('a');
  link.href = imageUrl;
  const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div
      className='py-10 px-20'
    >
      <h5 className='mx-auto' style={{fontSize: 30, letterSpacing: 0.3}}>Traveller 1 </h5>
      <hr style={{
        width:"70%",
        border: 0,
        height: "1px",
        backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))"
      }} />
      <br />
      <h3>Upload Traveler's Front Passport Page</h3>
      <p>
      </p>
      
      <div className='d-flex ' style={{width: '100%'}}>
        <div style={{width: '40%', marginTop: 70}}>
          <h6>Passport Front Page Image</h6>
          <div
            style={{
              border: '4px dotted gray',
              width: '100%',
              height: 300,
              borderRadius: '10px',
              justifyContent: 'center',
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            <img
              src={viewApplication.passport_front}
              alt='Uploaded Image'
              style={{maxWidth: '100%', maxHeight: '100%',}}
            />
          </div>
          <button
          onClick={handleDownload1}
          style={{
              position: 'relative',
              color: '#fff',
              border: 'none',
              backgroundColor: '#327113',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginTop:"20px"
          }}
      >
          Download Passport Front
      </button>
        </div>

        <div
          className='d-flex flex-row-fluid flex-center bg-body rounded'
          style={{width: '70%', backgroundColor: 'blue'}}
        >
          <Formik initialValues={viewApplication} onSubmit={() => {}}>
            {() => (
              <Form className='py-20 px-9' noValidate id='kt_create_account_form'>
                <div>
                  <div className='fv-row mb-5'>
                    <label style={{marginLeft:"5px"}} className='d-flex align-items-center form-label'>
                      <span className='required'>Passport Number</span>
                    </label>

                    <Field
                      style={{...inputStyle, width: '95%'}}
                      name='passportNumber'
                      readOnly
                      value={viewApplication.passport_number}
                      className='form-control form-control-lg form-control-solid'
                    />
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='passportNumber' />
                    </div>
                  </div>
                  <div className='d-flex' style={{justifyContent: 'space-between'}}>
                    <div className='fv-row mb-5'>
                      <label style={{marginLeft:"5px"}} className='form-label required'>First Name</label>

                      <Field
                        name='firstName'
                        readOnly
                        value={viewApplication.first_name}
                        style={inputStyle}
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='businessName' />
                      </div>
                    </div>
                    <div className='fv-row mb-5'>
                      <label style={{marginLeft:"5px"}} className='d-flex align-items-center form-label'>
                        <span className='required'>Last Name</span>
                      </label>

                      <Field
                        style={inputStyle}
                        name='lastName'
                        readOnly
                        value={viewApplication.last_name}
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='businessDescriptor' />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex' style={{justifyContent: 'space-between'}}>
                    <div className='fv-row mb-5'>
                      <label style={{marginLeft:"5px"}} className='d-flex align-items-center form-label'>
                        <span className='required'>Birth Place</span>
                      </label>

                      <Field
                        style={inputStyle}
                        readOnly
                        value={viewApplication.birth_place}
                        name='birthPlace'
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='birthPlace' />
                      </div>
                    </div>
                    <div className='fv-row mb-5'>
                      <label style={{marginLeft:"5px"}} className='d-flex align-items-center form-label'>
                        <span className='required'>Date of Birth</span>
                      </label>

                      <DatePicker
                        name='birthDetail'
                        readOnly
                        value={viewApplication.birthday_date}
                        className='form-control form-control-lg form-control-solid'
                        dateFormat='MM/dd/yyyy'
                        placeholderText='Select DOB'
                        style={inputStyle}
                      />

                      <div className='text-danger mt-2'>
                        <ErrorMessage name='birthDetail' />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex' style={{justifyContent: 'space-between', gap:"20px"}}>
                    <div className='fv-row mb-5'>
                      <label style={{marginLeft:"5px"}} className='d-flex align-items-center form-label'>
                        <span className='required'>Passport Issue Date</span>
                      </label>

                      <DatePicker
                        name='passportIssueDate'
                        readOnly
                        value={viewApplication.passport_issue_date}
                        className='form-control form-control-lg form-control-solid'
                        dateFormat='MM/dd/yyyy'
                        placeholderText='Select Issue Date'
                      />

                      <div className='text-danger mt-2'>
                        <ErrorMessage name='passportIssueDate' />
                      </div>
                    </div>

                    <div className='fv-row mb-5'>
                      <label style={{marginLeft:"5px"}} className='d-flex align-items-center form-label'>
                        <span className='required'>Passport Expiry Date</span>
                      </label>

                      <DatePicker
                        name='passPortExpiryDate'
                        readOnly
                        value={viewApplication.passport_expiry_date}
                        className='form-control form-control-lg form-control-solid'
                        dateFormat='MM/dd/yyyy'
                        placeholderText='Select Expiry Date'
                      />

                      <div className='text-danger mt-2'>
                        <ErrorMessage name='passPortExpiryDate' />
                      </div>
                    </div>
                  </div>
                  <div className='d-flex' style={{justifyContent: 'space-between'}}>
                    <div className='fv-row mb-10'>
                      <label style={{marginLeft:"5px"}} className='form-label required'>Gender</label>

                      <Field
                        name='gender'
                        readOnly
                        value={viewApplication.gender}
                        style={{...inputStyle, width: '215px', backgroundColor: 'white'}}
                        className='form-select form-select-lg form-select-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='businessType' />
                      </div>
                    </div>
                    <div className='fv-row mb-10'>
                      <label style={{marginLeft:"-10px"}} className='form-label required'>Marital Status</label>

                      <Field
                        readOnly
                        value={viewApplication.marital_status}
                        style={{...inputStyle, width: '210px', backgroundColor: 'white', position:"relative", left:"-25px"}}
                        name='maritalStatus'
                        className='form-select form-select-lg form-select-solid'
                      />
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

      <h3>Upload Traveler's Back Passport Page</h3>
      <p>
      </p>
      <div className='d-flex ' style={{width: '100%'}}>
        <div style={{width: '40%', marginTop: 50}}>
          <h6>Passport Back Page Image</h6>
          <div
            style={{
              border: '4px dotted gray',
              width: '100%',
              height: 300,
              borderRadius: '10px',
              justifyContent: 'center',
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            <img
              src={viewApplication.passport_back}
              alt='Uploaded Image'
              style={{maxWidth: '100%', maxHeight: '100%',}}
            />
          </div>
          <button
          onClick={handleDownload5}
          style={{
              position: 'relative',
              color: '#fff',
              border: 'none',
              backgroundColor: '#327113',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginTop:"20px"
          }}
      >
          Download Passport Back
      </button>
        </div>

        <div
          className='d-flex flex-row-fluid flex-center bg-body rounded'
          style={{width: '70%', backgroundColor: 'blue'}}
        >
          <Formik initialValues={initValues} onSubmit={() => {}}>
            {() => (
              <Form className='py-20 px-9' noValidate id='kt_create_account_form'>
                <div className='fv-row mb-10'>
                  <label style={{marginLeft:"5px"}} className='d-flex align-items-center form-label'>
                    <span className='required'>Father's Name</span>
                  </label>

                  <Field
                    style={{...inputStyle, width: '450px'}}
                    readOnly
                    value={viewApplication.fathers_name}
                    name='fatherName'
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='fatherName' />
                  </div>
                </div>

                <div className='fv-row mb-10'>
                  <label style={{marginLeft:"5px"}} className='d-flex align-items-center form-label'>
                    <span className='required'>Mother's Name</span>
                  </label>

                  <Field
                    style={{...inputStyle, width: '450px'}}
                    name='motherName'
                    readOnly
                    value={viewApplication.fathers_name}
                    className='form-control form-control-lg form-control-solid'
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

    {viewApplication.pan_card && (
    <>
      <h3 className='mt-20'>Uploaded PAN Card Photo</h3>
      <div className='d-flex ' style={{width: '100%'}}>
        <div style={{width: '40%', marginTop: 50}}>
          <h6>Pan Card Photo</h6>
          <div
            style={{
              border: '4px dotted gray',
              width: '100%',
              height: 300,
              borderRadius: '10px',
              justifyContent: 'center',
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            <img
              src={viewApplication.pan_card}
              alt='Uploaded Image'
              style={{maxWidth: '100%', maxHeight: '100%',}}
            />
          </div>
          <button
          onClick={handleDownload4}
          style={{
              position: 'relative',
              color: '#fff',
              border: 'none',
              backgroundColor: '#327113',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginTop:"20px"
          }}
      >
          Download Pan Card
      </button>
        </div>
      </div>
      </>
    )}

      <h3 className='mt-20'>Uploaded Traveler Photo</h3>
      <div className='d-flex ' style={{width: '100%'}}>
        <div style={{width: '40%', marginTop: 50}}>
          <h6>Photo</h6>
          <div
            style={{
              border: '4px dotted gray',
              width: '100%',
              height: 300,
              borderRadius: '10px',
              justifyContent: 'center',
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            <img
              src={viewApplication.photo}
              alt='Uploaded Image'
              style={{maxWidth: '100%', maxHeight: '100%', }}
            />
          </div>
          <button
          onClick={handleDownload3}
          style={{
              position: 'relative',
              color: '#fff',
              border: 'none',
              backgroundColor: '#327113',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginTop:"20px"
          }}
      >
          Download Photo
      </button>
        </div>
      </div>

      {viewApplication.itr && (
      <>
        <h3 className='mt-20'>Income Tax Return</h3>
        <p>
        This destination mandates the submission of Income Tax Returns (ITR). It signifies that individuals traveling to this locale must provide documented proof of their income tax filings as part of the regulatory requirements or visa application process. Compliance with this regulation ensures adherence to the taxation laws of the respective destination and facilitates smooth entry or residency procedures for travelers.
        </p>
        <div className='d-flex ' style={{width: '100%'}}>
          <div style={{width: '40%', marginTop: 50}}>
            <h6>ITR</h6>
            <div
              style={{
                border: '4px dotted gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <img
                src={viewApplication.itr}
                alt='Uploaded Image'
                style={{maxWidth: '100%', maxHeight: '100%', }}
              />
            </div>
            <button
            onClick={handleDownload2}
            style={{
                position: 'relative',
                color: '#fff',
                border: 'none',
                backgroundColor: '#327113',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                marginTop:"20px"
            }}
        >
            Download ITR
        </button>
          </div>
        </div>
      </>
      )}

    {viewApplication.letter && (
      <>
        <h3 className='mt-20'>Letter</h3>
        <div className='d-flex ' style={{width: '100%'}}>
          <div style={{width: '40%', marginTop: 50}}>
            <h6>Letter</h6>
            <div
              style={{
                border: '4px dotted gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <img
                src={viewApplication.letter}
                alt='Uploaded Image'
                style={{maxWidth: '100%', maxHeight: '100%', }}
              />
            </div>
            <button
            onClick={handleDownload6}
            style={{
                position: 'relative',
                color: '#fff',
                border: 'none',
                backgroundColor: '#327113',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                marginTop:"20px"
            }}
        >
            Download Letter
        </button>
          </div>
        </div>
      </>
    )}


    {viewApplication.tickets && (
      <>
        <h3 className='mt-20'>Tickets</h3>
        <div className='d-flex ' style={{width: '100%'}}>
          <div style={{width: '40%', marginTop: 50}}>
            <h6>Tickets</h6>
            <div
              style={{
                border: '4px dotted gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <img
                src={viewApplication.tickets}
                alt='Uploaded Image'
                style={{maxWidth: '100%', maxHeight: '100%', }}
              />
            </div>
            <button
            onClick={handleDownload7}
            style={{
                position: 'relative',
                color: '#fff',
                border: 'none',
                backgroundColor: '#327113',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                marginTop:"20px"
            }}
        >
            Download Tickets
        </button>
          </div>
        </div>
        </>
          )}
      </div>

  )
}

export default ApplicationFormView
