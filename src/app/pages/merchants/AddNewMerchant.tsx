import React, { ChangeEvent, useRef, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik, FormikValues } from 'formik'
import { Delete } from '@mui/icons-material';
import { ICreateAccount, inits } from '../../modules/wizards/components/CreateAccountWizardHelper';
import axiosInstance from '../../helpers/axiosInstance'
import toast, { Toaster } from 'react-hot-toast';
import BackIcon from '@mui/icons-material/ArrowBackOutlined'

const inputStyle1 = {
  border: '1px solid #d3d3d3', // Border width and color
  borderRadius: '10px', // Border radius
  padding: '10px',
  paddingLeft: '20px', // Padding
  width: '95%', // 100% width
  boxSizing: 'border-box', // Include padding and border in the width calculation
}

const inputStyle = {
  border: '1px solid #d3d3d3', // Border width and color
  borderRadius: '10px', // Border radius
  padding: '10px',
  paddingLeft: '20px', // Padding
  width: '90%', // 100% width
  boxSizing: 'border-box', // Include padding and border in the width calculation
}
function AddNewMerchant() {

  const navigate = useNavigate();

  const [formChange, setformChange] = useState(false)
  const [formData, setFormData] = useState({
    merchant_name: '',
    merchant_company_name: '',
    merchant_email_id: '',
    merchant_phone_number: '',
    merchant_profile_photo: '',
    merchant_gst_no: '',
    merchant_pan_no: '',
    merchant_country: '',
    merchant_state: '',
    merchant_zip_code: '',
    merchant_address_one_line: '',
    merchant_address_second_line: '',
    merchant_pan_photo: '',
    wallet_balance: '0'
  })


  const [initValues] = useState<ICreateAccount>(inits)
  const [aadharFrontUrl, setAadharFrontUrl] = useState('');
  const [aadharBackUrl, setAadharBackUrl] = useState('');
  const [panPhotoUrl, setPanPhotoUrl] = useState('');
  const maxSize = 1024 * 1024;
  const [isSuccess, setIsSuccess] = useState(false); // State to track success
  const [photo, setPhoto] = useState('')
  const photoFileInputRef = useRef<HTMLInputElement | null>(null)
  const panFileInputRef = useRef<HTMLInputElement | null>(null)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });

      if (name === 'aadharFront') {
        setAadharFrontUrl('');
      } else if (name === 'aadharBack') {
        setAadharBackUrl('');
      } else if (name === 'panPhoto') {
        setPanPhotoUrl('');
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });

      if (name === 'aadharFrontUrl') {
        setAadharFrontUrl(value);
      } else if (name === 'aadharBackUrl') {
        setAadharBackUrl(value);
      } else if (name === 'panPhotoUrl') {
        setPanPhotoUrl(value);
      }

    }
  };

  const [loading, setLoading] = useState(false);

  const handleSaveClick = async () => {
    setLoading(true);
  
    try {
      const response = await axiosInstance.post('/backend/create_merchant_user', formData);
  
      if (response.status === 200) {
        toast.success(response.data.msg, {
          position: 'top-center',
        });
        navigate('/superadmin/merchants');
      } else {
        toast.error(response.data.msg, {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('API error:', error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };


  const handleFileSelectBack = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
      const reader = new FileReader()

      reader.onload = async (e) => {
        // Update the state variable with the image data (base64-encoded)
        if (e.target) {
          setPanPhotoUrl(e.target.result as string)
          try {
            // Assuming handleFileUpload is an asynchronous function that returns a promise
            const imageLink = await handleFileUpload(file)

            // Update the form data with the image link
            setFormData({ ...formData, merchant_pan_photo: imageLink })
          } catch (error) {
            console.error('Error uploading image:', error)
          }
        }
      }

      reader.readAsDataURL(file)
    }
  }
  const handleImageUploadBack = () => {
    // Trigger the hidden file input
    if (panFileInputRef.current) {
      panFileInputRef.current.click()
    }
  }



  const handlePhotoUpload = () => {
    // Trigger the hidden file input
    if (photoFileInputRef.current) {
      photoFileInputRef.current.click()
    }
  }

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
      const reader = new FileReader()
      reader.onload = async (e) => {
        if (e.target) {
          setPhoto(e.target.result as string)

          try {
            // Assuming handleFileUpload is an asynchronous function that returns a promise
            const imageLink = await handleFileUpload(file)
            setFormData({ ...formData, merchant_profile_photo: imageLink })

            // Update the form data with the image link
          } catch (error) {
            console.error('Error uploading image:', error)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }
  const handleFieldChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value })
  }

  const handleFileUpload = async (file) => {
    try {
      setLoading(true); // Set loader to true before making the upload request

      const formData = new FormData();
      formData.append('file', file);

      // Make a POST request to your server to upload the file
      const response = await axiosInstance.post('/backend/upload_image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming your server responds with the file URL
      const fileUrl = response.data.data;

      return fileUrl; // Return the file URL
    } catch (error) {
      console.error('Error uploading file:', error);
      return ''; // Return an empty string in case of an error
    } finally {
      setLoading(false); // Set loader to false regardless of success or failure
    }
  };



  return (
    <div className='w-full' style={{ backgroundColor: 'white' }}>
      <Toaster />
      <div className='container' style={{ marginTop: -35 }}>
        <div className='d-flex align-items-center pt-3'>
          <Link to='/superadmin/merchants' >
            <BackIcon style={{ color: '#332786', width: 30, height: 45, cursor: 'pointer',marginTop:"-8px" }} />
          </Link>
          <h5 style={{ fontSize: 26, alignSelf: 'center', marginLeft: 10, display: 'flex', letterSpacing: 0.3, marginBottom:10 }}>Onboard new Merchant</h5>
        </div>
        <hr style={{
        width:"95%",
        border: 0,
        height: "1px",
        backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0))"
      }} />
        <br />
        <div className='d-flex ' style={{ width: '100%' }}>
          <div style={{ width: '40%', marginTop: 60 }}>
            <h6>Merchant Photo</h6>
            {photo ? (
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
                <div
                  onClick={() => setPhoto('')}
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
                  <Delete style={{ color: 'red' }} />
                </div>
                {loading ? (
                  <div className='spinner-border text-primary' role='status'>
                    <span className='sr-only'>Loading...</span>
                  </div>
                ) : (
                  <img
                    src={photo}
                    alt='Uploaded Image'
                    style={{ maxWidth: '100%', maxHeight: '100%', position: 'relative', marginTop: '-35px' }}
                  />
                )}
              </div>
            ) : (
              <div
                style={{
                  border: '4px dotted gray',
                  width: '100%',
                  height: 300,
                  borderRadius: '10px',
                  justifyContent: 'center',
                  textAlign: 'center',
                  paddingTop: 40,
                  marginTop: 20,
                }}
              >
                <h4 className='mx-10 mt-10'>Merchant Photo</h4>
                <button
                  type='button'
                  onClick={handlePhotoUpload}
                  className='btn btn-lg btn-success me-3 mt-3'
                  style={{ justifyContent: 'flex-end', backgroundColor: '#327113' }}
                >
                  <span className='indicator-label'>Select Files</span>
                </button>
                <p className='text-bold pt-5 fs-9' style={{ color: '#555555' }}>
                  Supports JPEG, JPG, PNG.
                </p>
                <input
                  type='file'
                  ref={photoFileInputRef}
                  style={{ display: 'none' }}
                  accept='.jpeg, .jpg, .pdf, .png'
                  onChange={handleFileSelect}
                />
              </div>
            )}
          </div>

          <div
            className='d-flex flex-row-fluid flex-center bg-body rounded'
            style={{ width: '70%', }}
          >

            <Formik initialValues={initValues} onSubmit={() => { }}>
              {() => (
                <Form className='py-20 px-9' noValidate id='kt_create_account_form'>
                  <div>
                    <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                      <div className='fv-row mb-5'>
                        <label className='form-label required mx-5'>Merchant Name</label>

                        <Field
                          name='merchantName'
                          placeholder="Merchant Name"
                          value={formData.merchant_name}
                          onChange={(e) => handleFieldChange('merchant_name', e.target.value)}
                          style={inputStyle}
                          className='form-control form-control-lg form-control-solid'
                        />
                        <div className='text-danger mt-2'>
                          <ErrorMessage name='merchant_name' />
                        </div>
                      </div>
                      <div className='fv-row mb-5'>
                        <label className='d-flex align-items-center form-label mx-5'>
                          <span className='required'>Company Name</span>
                        </label>

                        <Field
                          style={inputStyle}
                          placeholder="Company Name"
                          name='merchant_company_name'
                          value={formData.merchant_company_name}
                          onChange={(e) => handleFieldChange('merchant_company_name', e.target.value)}
                          className='form-control form-control-lg form-control-solid'
                        />
                        <div className='text-danger mt-2'>
                          <ErrorMessage name='merchant_company_name' />
                        </div>
                      </div>
                    </div>
                    <div className='fv-row mb-10 w-100'>

                      <label className='form-label fs-4 mx-5'>Country</label>
                      <Field
                        as="select"
                        style={inputStyle1}
                        name='merchant_country'
                        value={formData.merchant_country}
                        onChange={(e) => handleFieldChange('merchant_country', e.target.value)}
                        className='form-control form-control-lg form-control-solid'
                      >
                        <option value=''>Select a Country...</option>
                        <option value='AF'>Afghanistan</option>
                        <option value='AX'>Aland Islands</option>
                        <option value='AL'>Albania</option>
                        <option value='DZ'>Algeria</option>
                        <option value='AS'>American Samoa</option>
                        <option value='AD'>Andorra</option>
                        <option value='AO'>Angola</option>
                        <option value='AI'>Anguilla</option>
                        <option value='AQ'>Antarctica</option>
                        <option value='AG'>Antigua and Barbuda</option>
                        <option value='AR'>Argentina</option>
                        <option value='AM'>Armenia</option>
                        <option value='AW'>Aruba</option>
                        <option value='AU'>Australia</option>
                        <option value='AT'>Austria</option>
                        <option value='AZ'>Azerbaijan</option>
                        <option value='BS'>Bahamas</option>
                        <option value='BH'>Bahrain</option>
                        <option value='BD'>Bangladesh</option>
                        <option value='BB'>Barbados</option>
                        <option value='BY'>Belarus</option>
                        <option value='BE'>Belgium</option>
                        <option value='BZ'>Belize</option>
                        <option value='BJ'>Benin</option>
                        <option value='BM'>Bermuda</option>
                        <option value='BT'>Bhutan</option>
                        <option value='BO'>Bolivia, Plurinational State of</option>
                        <option value='BQ'>Bonaire, Sint Eustatius and Saba</option>
                        <option value='BA'>Bosnia and Herzegovina</option>
                        <option value='BW'>Botswana</option>
                        <option value='BV'>Bouvet Island</option>
                        <option value='BR'>Brazil</option>
                        <option value='IO'>British Indian Ocean Territory</option>
                        <option value='BN'>Brunei Darussalam</option>
                        <option value='BG'>Bulgaria</option>
                        <option value='BF'>Burkina Faso</option>
                        <option value='BI'>Burundi</option>
                        <option value='KH'>Cambodia</option>
                        <option value='CM'>Cameroon</option>
                        <option value='CA'>Canada</option>
                        <option value='CV'>Cape Verde</option>
                        <option value='KY'>Cayman Islands</option>
                        <option value='CF'>Central African Republic</option>
                        <option value='TD'>Chad</option>
                        <option value='CL'>Chile</option>
                        <option value='CN'>China</option>
                        <option value='CX'>Christmas Island</option>
                        <option value='CC'>Cocos (Keeling) Islands</option>
                        <option value='CO'>Colombia</option>
                        <option value='KM'>Comoros</option>
                        <option value='CG'>Congo</option>
                        <option value='CD'>Congo, the Democratic Republic of the</option>
                        <option value='CK'>Cook Islands</option>
                        <option value='CR'>Costa Rica</option>
                        <option value='CI'>Côte d'Ivoire</option>
                        <option value='HR'>Croatia</option>
                        <option value='CU'>Cuba</option>
                        <option value='CW'>Curaçao</option>
                        <option value='CY'>Cyprus</option>
                        <option value='CZ'>Czech Republic</option>
                        <option value='DK'>Denmark</option>
                        <option value='DJ'>Djibouti</option>
                        <option value='DM'>Dominica</option>
                        <option value='DO'>Dominican Republic</option>
                        <option value='EC'>Ecuador</option>
                        <option value='EG'>Egypt</option>
                        <option value='SV'>El Salvador</option>
                        <option value='GQ'>Equatorial Guinea</option>
                        <option value='ER'>Eritrea</option>
                        <option value='EE'>Estonia</option>
                        <option value='ET'>Ethiopia</option>
                        <option value='FK'>Falkland Islands (Malvinas)</option>
                        <option value='FO'>Faroe Islands</option>
                        <option value='FJ'>Fiji</option>
                        <option value='FI'>Finland</option>
                        <option value='FR'>France</option>
                        <option value='GF'>French Guiana</option>
                        <option value='PF'>French Polynesia</option>
                        <option value='TF'>French Southern Territories</option>
                        <option value='GA'>Gabon</option>
                        <option value='GM'>Gambia</option>
                        <option value='GE'>Georgia</option>
                        <option value='DE'>Germany</option>
                        <option value='GH'>Ghana</option>
                        <option value='GI'>Gibraltar</option>
                        <option value='GR'>Greece</option>
                        <option value='GL'>Greenland</option>
                        <option value='GD'>Grenada</option>
                        <option value='GP'>Guadeloupe</option>
                        <option value='GU'>Guam</option>
                        <option value='GT'>Guatemala</option>
                        <option value='GG'>Guernsey</option>
                        <option value='GN'>Guinea</option>
                        <option value='GW'>Guinea-Bissau</option>
                        <option value='GY'>Guyana</option>
                        <option value='HT'>Haiti</option>
                        <option value='HM'>Heard Island and McDonald Islands</option>
                        <option value='VA'>Holy See (Vatican City State)</option>
                        <option value='HN'>Honduras</option>
                        <option value='HK'>Hong Kong</option>
                        <option value='HU'>Hungary</option>
                        <option value='IS'>Iceland</option>
                        <option value='IN'>India</option>
                        <option value='ID'>Indonesia</option>
                        <option value='IR'>Iran, Islamic Republic of</option>
                        <option value='IQ'>Iraq</option>
                        <option value='IE'>Ireland</option>
                        <option value='IM'>Isle of Man</option>
                        <option value='IL'>Israel</option>
                        <option value='IT'>Italy</option>
                        <option value='JM'>Jamaica</option>
                        <option value='JP'>Japan</option>
                        <option value='JE'>Jersey</option>
                        <option value='JO'>Jordan</option>
                        <option value='KZ'>Kazakhstan</option>
                        <option value='KE'>Kenya</option>
                        <option value='KI'>Kiribati</option>
                        <option value='KP'>Korea, Democratic People's Republic of</option>
                        <option value='KW'>Kuwait</option>
                        <option value='KG'>Kyrgyzstan</option>
                        <option value='LA'>Lao People's Democratic Republic</option>
                        <option value='LV'>Latvia</option>
                        <option value='LB'>Lebanon</option>
                        <option value='LS'>Lesotho</option>
                        <option value='LR'>Liberia</option>
                        <option value='LY'>Libya</option>
                        <option value='LI'>Liechtenstein</option>
                        <option value='LT'>Lithuania</option>
                        <option value='LU'>Luxembourg</option>
                        <option value='MO'>Macao</option>
                        <option value='MK'>Macedonia, the former Yugoslav Republic of</option>
                        <option value='MG'>Madagascar</option>
                        <option value='MW'>Malawi</option>
                        <option value='MY'>Malaysia</option>
                        <option value='MV'>Maldives</option>
                        <option value='ML'>Mali</option>
                        <option value='MT'>Malta</option>
                        <option value='MH'>Marshall Islands</option>
                        <option value='MQ'>Martinique</option>
                        <option value='MR'>Mauritania</option>
                        <option value='MU'>Mauritius</option>
                        <option value='YT'>Mayotte</option>
                        <option value='MX'>Mexico</option>
                        <option value='FM'>Micronesia, Federated States of</option>
                        <option value='MD'>Moldova, Republic of</option>
                        <option value='MC'>Monaco</option>
                        <option value='MN'>Mongolia</option>
                        <option value='ME'>Montenegro</option>
                        <option value='MS'>Montserrat</option>
                        <option value='MA'>Morocco</option>
                        <option value='MZ'>Mozambique</option>
                        <option value='MM'>Myanmar</option>
                        <option value='NA'>Namibia</option>
                        <option value='NR'>Nauru</option>
                        <option value='NP'>Nepal</option>
                        <option value='NL'>Netherlands</option>
                        <option value='NC'>New Caledonia</option>
                        <option value='NZ'>New Zealand</option>
                        <option value='NI'>Nicaragua</option>
                        <option value='NE'>Niger</option>
                        <option value='NG'>Nigeria</option>
                        <option value='NU'>Niue</option>
                        <option value='NF'>Norfolk Island</option>
                        <option value='MP'>Northern Mariana Islands</option>
                        <option value='NO'>Norway</option>
                        <option value='OM'>Oman</option>
                        <option value='PK'>Pakistan</option>
                        <option value='PW'>Palau</option>
                        <option value='PS'>Palestinian Territory, Occupied</option>
                        <option value='PA'>Panama</option>
                        <option value='PG'>Papua New Guinea</option>
                        <option value='PY'>Paraguay</option>
                        <option value='PE'>Peru</option>
                        <option value='PH'>Philippines</option>
                        <option value='PN'>Pitcairn</option>
                        <option value='PL'>Poland</option>
                        <option value='PT'>Portugal</option>
                        <option value='PR'>Puerto Rico</option>
                        <option value='QA'>Qatar</option>
                        <option value='RE'>Réunion</option>
                        <option value='RO'>Romania</option>
                        <option value='RU'>Russian Federation</option>
                        <option value='RW'>Rwanda</option>
                        <option value='BL'>Saint Barthélemy</option>
                        <option value='SH'>Saint Helena, Ascension and Tristan da Cunha</option>
                        <option value='KN'>Saint Kitts and Nevis</option>
                        <option value='LC'>Saint Lucia</option>
                        <option value='MF'>Saint Martin (French part)</option>
                        <option value='PM'>Saint Pierre and Miquelon</option>
                        <option value='VC'>Saint Vincent and the Grenadines</option>
                        <option value='WS'>Samoa</option>
                        <option value='SM'>San Marino</option>
                        <option value='ST'>Sao Tome and Principe</option>
                        <option value='SA'>Saudi Arabia</option>
                        <option value='SN'>Senegal</option>
                        <option value='RS'>Serbia</option>
                        <option value='SC'>Seychelles</option>
                        <option value='SL'>Sierra Leone</option>
                        <option value='SG'>Singapore</option>
                        <option value='SX'>Sint Maarten (Dutch part)</option>
                        <option value='SK'>Slovakia</option>
                        <option value='SI'>Slovenia</option>
                        <option value='SB'>Solomon Islands</option>
                        <option value='SO'>Somalia</option>
                        <option value='ZA'>South Africa</option>
                        <option value='GS'>South Georgia and the South Sandwich Islands</option>
                        <option value='KR'>South Korea</option>
                        <option value='SS'>South Sudan</option>
                        <option value='ES'>Spain</option>
                        <option value='LK'>Sri Lanka</option>
                        <option value='SD'>Sudan</option>
                        <option value='SR'>Suriname</option>
                        <option value='SJ'>Svalbard and Jan Mayen</option>
                        <option value='SZ'>Swaziland</option>
                        <option value='SE'>Sweden</option>
                        <option value='CH'>Switzerland</option>
                        <option value='SY'>Syrian Arab Republic</option>
                        <option value='TW'>Taiwan, Province of China</option>
                        <option value='TJ'>Tajikistan</option>
                        <option value='TZ'>Tanzania, United Republic of</option>
                        <option value='TH'>Thailand</option>
                        <option value='TL'>Timor-Leste</option>
                        <option value='TG'>Togo</option>
                        <option value='TK'>Tokelau</option>
                        <option value='TO'>Tonga</option>
                        <option value='TT'>Trinidad and Tobago</option>
                        <option value='TN'>Tunisia</option>
                        <option value='TR'>Turkey</option>
                        <option value='TM'>Turkmenistan</option>
                        <option value='TC'>Turks and Caicos Islands</option>
                        <option value='TV'>Tuvalu</option>
                        <option value='UG'>Uganda</option>
                        <option value='UA'>Ukraine</option>
                        <option value='AE'>United Arab Emirates</option>
                        <option value='GB'>United Kingdom</option>
                        <option value='US'>United States</option>
                        <option value='UY'>Uruguay</option>
                        <option value='UZ'>Uzbekistan</option>
                        <option value='VU'>Vanuatu</option>
                        <option value='VE'>Venezuela, Bolivarian Republic of</option>
                        <option value='VN'>Vietnam</option>
                        <option value='VI'>Virgin Islands</option>
                        <option value='WF'>Wallis and Futuna</option>
                        <option value='EH'>Western Sahara</option>
                        <option value='YE'>Yemen</option>
                        <option value='ZM'>Zambia</option>
                        <option value='ZW'>Zimbabwe</option>
                      </Field>
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='merchant_country' />
                      </div>
                    </div>
                    <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                      <div className='fv-row mb-5'>
                        <label className='d-flex align-items-center form-label mx-5'>
                          <span className='required'>Email</span>
                        </label>

                        <Field
                          style={inputStyle}
                          placeholder="Email"
                          value={formData.merchant_email_id}
                          onChange={(e) => handleFieldChange('merchant_email_id', e.target.value)}
                          name='merchant_email_id'
                          className='form-control form-control-lg form-control-solid'
                        />
                        <div className='text-danger mt-2'>
                          <ErrorMessage name='merchant_email_id' />
                        </div>
                      </div>
                      <div className='fv-row mb-5'>
                        <label className='d-flex align-items-center form-label mx-5'>
                          <span className='required'>Contact Number</span>
                        </label>

                        <Field
                          style={inputStyle}
                          placeholder="Contact Number"
                          value={formData.merchant_phone_number}
                          onChange={(e) => handleFieldChange('merchant_phone_number', e.target.value)}
                          name='merchant_phone_number'
                          className='form-control form-control-lg form-control-solid'
                        />
                        <div className='text-danger mt-2'>
                          <ErrorMessage name='merchant_phone_number' />
                        </div>
                      </div>
                    </div>

                    <div className='fv-row mb-10'>
                      <label className='d-flex align-items-center form-label mx-5'>
                        <span className='required'>Address first line</span>
                      </label>

                      <Field
                        style={{ ...inputStyle, width: '95%' }}
                        name='merchant_address_one_line'
                        placeholder="Address first line"
                        value={formData.merchant_address_one_line}
                        onChange={(e) => handleFieldChange('merchant_address_one_line', e.target.value)}
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='merchant_address_one_line' />
                      </div>
                    </div>

                    <div className='fv-row mb-10'>
                      <label className='d-flex align-items-center form-label mx-5'>
                        <span className='required'>Address second line</span>
                      </label>

                      <Field
                        style={{ ...inputStyle, width: '95%' }}
                        name='merchant_address_second_line'
                        placeholder="Address second line"
                        value={formData.merchant_address_second_line}
                        onChange={(e) => handleFieldChange('merchant_address_second_line', e.target.value)}
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='merchant_address_second_line' />
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <div className='d-flex ' style={{ width: '100%' }}>
          <div style={{ width: '40%', marginTop: 60 }}>
            <h6>PAN card Photo</h6>
            {panPhotoUrl ? (
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
                <div
                  onClick={() => setPanPhotoUrl('')}
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
                  <Delete style={{ color: 'red' }} />
                </div>
                {loading ? (
                  <div className='spinner-border text-primary' role='status'>
                    <span className='sr-only'>Loading...</span>
                  </div>
                ) : (
                  <img
                    src={panPhotoUrl}
                    alt='Uploaded Image'
                    style={{ maxWidth: '100%', maxHeight: '100%', position: 'relative', marginTop: '-35px' }}
                  />
                )}
              </div>
            ) : (
              <div
                style={{
                  border: '4px dotted gray',
                  width: '100%',
                  height: 300,
                  borderRadius: '10px',
                  justifyContent: 'center',
                  textAlign: 'center',
                  paddingTop: 40,
                  marginTop: 20,
                }}
              >
                <h4 className='mx-10 mt-10'>PAN Card Photo</h4>
                <button
                  type='button'
                  onClick={handleImageUploadBack}
                  className='btn btn-lg btn-success me-3 mt-3'
                  style={{ justifyContent: 'flex-end', backgroundColor: '#327113' }}
                >
                  <span className='indicator-label'>Select Files</span>
                </button>
                <p className='text-bold pt-5 fs-9' style={{ color: '#555555' }}>
                  Supports JPEG, JPG, PNG.
                </p>
                <input
                  type='file'
                  ref={panFileInputRef}
                  style={{ display: 'none' }}
                  accept='.jpeg, .jpg, .pdf, .png'
                  onChange={handleFileSelectBack}
                />
              </div>
            )}
          </div>

          <div
            className='d-flex flex-row-fluid flex-center bg-body rounded'
            style={{ width: '70%', }}
          >
            <Formik initialValues={initValues} onSubmit={() => { }}>
              {() => (
                <Form className='py-20 px-9' noValidate id='kt_create_account_form'>

                  <div className='fv-row mb-10'>
                    <label className='d-flex align-items-center form-label mx-5'>
                      <span className='required'>PAN Number</span>
                    </label>

                    <Field
                      style={{ ...inputStyle, width: '95%' }}
                      name='merchant_pan_no'
                      placeholder="PAN Number"
                      value={formData.merchant_pan_no}
                      onChange={(e) => handleFieldChange('merchant_pan_no', e.target.value)}
                      className='form-control form-control-lg form-control-solid'
                    />
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='merchant_pan_no' />
                    </div>
                  </div>

                  <div className='fv-row mb-10'>
                    <label className='d-flex align-items-center form-label mx-5'>
                      <span className=''>GST</span>
                    </label>

                    <Field
                      style={{ ...inputStyle, width: '95%' }}
                      name='merchant_gst_no'
                      placeholder="GST"
                      value={formData.merchant_gst_no}
                      onChange={(e) => handleFieldChange('merchant_gst_no', e.target.value)}
                      className='form-control form-control-lg form-control-solid'
                    />
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='merchant_gst_no' />
                    </div>
                  </div>

                  <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label mx-5'>
                        <span className='required'>State</span>
                      </label>

                      <Field
                        style={inputStyle}
                        placeholder="State"
                        value={formData.merchant_state}
                        onChange={(e) => handleFieldChange('merchant_state', e.target.value)}
                        name='merchant_state'
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='merchant_state' />
                      </div>
                    </div>
                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label mx-5'>
                        <span className='required'>Zip code</span>
                      </label>

                      <Field
                        style={inputStyle}
                        placeholder="Zip code"
                        value={formData.merchant_zip_code}
                        onChange={(e) => handleFieldChange('merchant_zip_code', e.target.value)}
                        name='merchant_zip_code'
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='merchant_zip_code' />
                      </div>
                    </div>
                  </div>
                  <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label mx-5'>
                        <span className='required'>Wallet</span>
                      </label>

                      <Field
                        style={inputStyle}
                        value={formData.wallet_balance}
                        placeholder="Wallet"
                        onChange={(e) => handleFieldChange('wallet_balance', e.target.value)}
                        name='wallet_balance'
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='wallet_balance' />
                      </div>
                    </div>
                  </div>

                  <div
                    className='mt-10'
                    onClick={handleSaveClick}
                    style={{
                      height: 40,
                      width: 150,
                      border: '1px solid',
                      marginLeft: "30%",
                      borderColor: '#696969',
                      borderRadius: 10,
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: '#327113',
                      cursor: 'pointer',
                    }}
                  >
                    {!loading && <h6 className='fs-4' style={{ color: 'white', paddingTop: 7 }}>Submit</h6>}
      {loading && (
        <span className='indicator-progress' style={{ display: 'flex', alignItems: 'center', color:"#fff" }}>
          Please wait...
          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
        </span>
      )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AddNewMerchant
