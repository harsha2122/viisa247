import React, { useState, useEffect, CSSProperties } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import VisaFields from '../../components/VisaFields';
import axiosInstance from '../../helpers/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import { KTIcon } from '../../../_metronic/helpers';
import { CloseOutlined } from '@mui/icons-material';
import EditVisa from './EditVisa';
import { IoArrowBackSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';

interface Visa {
  _id: string;
  visa_description: string;
  visa_actual_price: number;
  visa_provide: string;
  visa_processing_time: number;
  visa_duration: number;
}


const inputStyle = {
  border: '1px solid #d3d3d3', 
  borderRadius: '10px', 
  padding: '10px',
  paddingLeft: '20px', 
  width: '90%', 
  boxSizing: 'border-box',
};

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
  padding: '10px',
  borderRadius: '5px',
  width: '80%',
  height: '80%',
  overflowY: 'auto',
}

function AddCountryWrapper() {
  const [visaFields, setVisaFields] = useState(1);
  const [toggleVisible, setToggleVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [fromCountry, setFromCountry] = useState('IN');
  const [nationalityCode, setNationalityCode] = useState('');
  const [formVisasData, setFormVisasData] = useState<Visa[]>([]);
  const [formVisassData, setFormVisassData] = useState<Visa[]>([]);
  const [tableVisasData, setTableVisasData] = useState<Visa[]>([]);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Visa | null>(null);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  
  const handleAddAnotherVisa = () => {
    setVisaFields(visaFields + 1);
  };

  const handleRemoveVisa = (index: number) => {
    if (visaFields > 1) {
      setVisaFields(visaFields - 1);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const formData = {
        country_code: selectedCountry,
        nationality_code: fromCountry,
        visas: formVisassData
      };
      await axiosInstance.post('/backend/create_visa', formData);
      resetForm();
      setVisaFields(1);
      setFormVisassData([]);
      toast.success('Visa Created successfully!');
      setTimeout(() => {
        window.location.reload();
    }, 2500);
    } catch (error) {
      console.error('Error submitting visa data:', error);
      toast.error('Error submitting form. Please try again later.');
    }
  };
  

  useEffect(() => {
    if (selectedCountry) {
      setIsSectionVisible(true);
    } else {
      setIsSectionVisible(false);
    }
  }, [selectedCountry]);


  useEffect(() => {
    if (selectedCountry) { 
      const fetchCountrySettings = async () => {
        try {
          const response = await axiosInstance.get('/backend/fetch_setting');
          const data = response.data.data;
          if (data && data.country && data.country[selectedCountry] != null) {
            const fetchedToggleVisible = data.country[selectedCountry];
            setToggleVisible(fetchedToggleVisible);
          } else {
            console.error('Invalid data format or missing field for selected country:', selectedCountry);
          }
        } catch (error) {
          console.error('Error fetching country settings:', error);
        }
      };
      
      fetchCountrySettings(); 
    }
  }, [selectedCountry]);
  
  

  const handleToggleChange = async () => {
    try {
      const response = await axiosInstance.post('/backend/country_settings', {
        country_code: selectedCountry,
        status: !toggleVisible
      });
      setToggleVisible(!toggleVisible);
    } catch (error) {
      console.error('Error updating toggle state:', error);
    }
  };
  
  useEffect(() => {
    const fetchVisaData = async () => {
      try {
        const response = await axiosInstance.post('/backend/fetch_visa_data', {
          country_code: selectedCountry
        });
        const responseData = response.data.data[0]?.visas || [];
        setFormVisasData([]);
        setTableVisasData([]);
        if (responseData) {
          setFormVisasData(responseData);
          setTableVisasData(responseData);
        } else {
          console.error('Visa data not found.');
        }
      } catch (error) {
        console.error('Error fetching visa data:', error);
      }
    };
    if (selectedCountry) {
      fetchVisaData();
    }
  }, [selectedCountry]);
  

  const handleClickOpen = (item: Visa) => {
    setOpen(!open)
    setId(item._id)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleVisibilityClick = (item: Visa) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const handleCloseClick = () => {
    setSelectedItem(null)
    setVisible(false)
  }


  return (
    <div>
      <Toaster />
      <div className='w-full pb-10' style={{ backgroundColor: '#fff', marginTop: '-80px' }}>
        <div className='px-10 pt-10'>
        <Link to='/superadmin/all-visas'><span className='d-flex justify-content-start align-items-center my-4'><IoArrowBackSharp style={{color:"#327113"}} /> <h2 style={{color:"#327113"}} className='text-xl font-bold mx-2 mt-2'>Go Back</h2></span></Link><h1 className='text-xl font-bold my-5 mx-auto'>Add Visa</h1>

          <section style={{border:"1px solid #adc6a0", display: isSectionVisible ? 'block' : 'none'}} className='w-100 card my-5 '>
            <div style={{borderBottom:"1.5px solid #327113"}} className='card-header'>
              <h3 className='card-title align-content-start flex-row'>
                <span className='card-label text-gray-600 fw-bold fs-3'>Recently Added Visas for {selectedCountry}</span>
              </h3>
              <a
                href='#'
                title='Edit Visas'
                className='btn btn-bg-light pt-4 d-flex btn-active-color-primary btn-sm my-auto'
                onClick={() => handleVisibilityClick(tableVisasData[0])}
              >
                <KTIcon iconName='pencil' className='fs-3' /> <h5 className='mx-2'>Edit Visas</h5>
              </a>
            </div>
            <div className='card-body py-3'>
              <div className='table-responsive'>
                <table className='table table-row-bordered table-row-gray-300 align-middle gs-0 gy-3'>
                  <thead>
                    <tr className='fw-bold '>
                      <th className='fs-5 min-w-350px'>Visa Description</th>
                      <th className='fs-5 min-w-200px'>Price</th>
                      <th className='fs-5 min-w-200px'>Processing time</th>
                      <th style={{left:"-7px", position:"relative"}} className='fs-5 min-w-200px text-end'>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                  {tableVisasData.map(visa => (
                    <tr key={visa._id}>
                      <td>
                        <a href='#' className='text-gray-600 fw-bold text-hover-primary fs-6'>
                          {visa.visa_description}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-6'>
                          ₹ {new Intl.NumberFormat('en-IN').format(Number(visa.visa_actual_price))}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-6'>
                          {visa.visa_processing_time} days
                        </a>
                      </td>
                      <td style={{left:"-7px", position:"relative"}} className='text-muted text-end text-hover-primary fs-6'>
                        {visa.visa_duration} days
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          <div className="d-flex justify-content-center" >
          <Formik
            initialValues={{
              selectedCountry: selectedCountry,
              fromCountry: fromCountry,
              visasData: Array.from({ length: visaFields }).reduce((acc: Record<string, any>, _, index) => {
                acc[`visa_price_${index}`] = '';
                acc[`visa_provide_${index}`] = '';
                acc[`visa_processing_time_${index}`] = '';
                acc[`visa_duration_${index}`] = '';
                acc[`visa_description_${index}`] = '';
                return acc;
              }, {})
              
            }}            
            onSubmit={handleSubmit}
          >
              {() => (
                <Form style={{border:"1px solid #327113", borderRadius:"10px"}} className='py-5 mt-10 px-10 px-auto w-100  d-flex flex-row flex-wrap' noValidate id={`kt_create_account_form`}>
                  <div className='w-50 d-flex flex-column mb-5'>
                    <label className='form-label fs-5'>Select Country</label>
                    <Field
                      as='select'
                      name='selectedCountry'
                      className='form-select form-select-lg form-select-solid'
                      style={inputStyle}
                      onChange={(e) => setSelectedCountry(e.target.value)}
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
                      <ErrorMessage name='selectedCountry' />
                    </div>
                  </div>
                  <div className='w-50 d-flex flex-column mb-5'>
                    <label className='form-label fs-5'>Nationality</label>
                    <Field
                      as='select'
                      name='fromCountry'
                      className='form-select form-select-lg form-select-solid'
                      style={inputStyle}
                      onChange={(e) => setFromCountry(e.target.value)}
                      defaultValue='IN'
                    >
                      <option value='IN'>India</option>
                    </Field>
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='fromCountry' />
                    </div>
                  </div>
                  {selectedCountry && (
                    <>
                      <span className='my-auto form-label fs-5 mx-5'>Show manual visas - </span>
                      <label className='switch my-auto'>
                      <input
                          title='Manual Visa'
                          type='checkbox'
                          checked={toggleVisible}
                          onChange={handleToggleChange}
                        />
                        <span className='slider'></span>
                      </label>
                    </>
                  )}
                  
                  {[...Array(visaFields)].map((_, index) => (
                    <div key={index} className='w-100'>
                      <VisaFields
                        inputStyle={inputStyle}
                        onVisaFieldChange={(data) => {
                          const updatedVisasData = [...formVisassData];
                          updatedVisasData[index] = data;
                          setFormVisassData(updatedVisasData);
                        }}
                      />
                      {index > 0 && (
                        <button
                          type='button'
                          className='btn btn-danger'
                          onClick={() => handleRemoveVisa(index)}
                          style={{ background:"#ff0000" }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                  <div className='d-flex justify-content-end mb-4 w-100'>
                    <button
                      type='button'
                      className='btn'
                      onClick={handleAddAnotherVisa}
                      style={{ border:"1px solid #327113", right:"0px", position:"relative", color:"#327113"}}
                    >
                      + Add Another Visa
                    </button>
                  </div>
                  <div className='d-flex justify-content-center mt-8 w-100'>
                    <button
                      type='submit'
                      className='btn'
                      style={{ background:"#327113", marginLeft:"-40px", color:"#fff"}}
                    >
                      Submit and Add
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      {visible && (
        <div className='loader-overlay' style={{ ...overlayStyle, ...(visible && activeOverlayStyle) }}>
          <div style={contentStyle}>
            <div onClick={() => handleCloseClick()} style={{ backgroundColor: '#d3d3d3', padding: "9px", position: "absolute", top: "10%", left: "89.5%", transform: "translate(-35%, -40%)", borderRadius: 20, cursor: 'pointer' }}>
              <CloseOutlined />
            </div>
            <EditVisa visasData={formVisasData} fromCountry={fromCountry} selectedItem={selectedItem} selectedCountry={selectedCountry} onClose={handleCloseClick} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AddCountryWrapper;

