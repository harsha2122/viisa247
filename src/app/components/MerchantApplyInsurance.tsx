import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { ICreateAccount, inits } from '../modules/wizards/components/CreateAccountWizardHelper';
import RoomIcon from '@mui/icons-material/Room';
import FlightIcon from '@mui/icons-material/Flight';
import axiosInstance from '../helpers/axiosInstance';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'dayjs/locale/en';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import not from '../../_metronic/assets/card/3dnot.webp';

type Props = {
  show: (value: boolean) => void;
  visaList: boolean;
  visaListLoader: (value: boolean) => void;
  onApiDataReceived: (data: any) => void;
  manualValue: (data: any) => void;
};


const MerchantApplyInsurance: React.FC<Props> = ({ show, visaList, onApiDataReceived, manualValue, visaListLoader }) => {
  const [issueDate, setIssueDate] = useState<string | undefined>('');
  const [expiryDate, setExpiryDate] = useState<string | undefined>('');
  const [initValues] = useState<ICreateAccount>(inits);
  const user_type = Cookies.get('user_type');

  const validatePostData = (postData) => {
    for (const key in postData) {
      if (!postData[key]) {
        return false;
      }
    }
    return true;
  };

  const onSubmit = (values: any) => {
    visaListLoader(true);
    setSelectedFromCountry(values.fromCountry);
    setSelectedToCountry(values.toCountry);
  
    const postData = {
      country_code: values.toCountry,
      nationality_code: "IN",
      issue_date: issueDate, 
      expiry_date: expiryDate,
    };

    if (!validatePostData(postData)) {
      toast.error('All fields are required.');
      visaListLoader(false);
      return;
    }
  
    axiosInstance
      .post('/backend/fetch_merchant_insurance', postData)
      .then((response) => {
        if (!response.data.data || response.data.data.length === 0) {
          toast.error('Oops !!\nInsurance for this country is not available.', {
            style: {
              background: '#fff',
              color: '#ff4444',
            },
            icon: <img src={not} alt="Not Found" style={{ width: '70px', height: '70px' }} />,
          });
          visaListLoader(false);
          return;
        }
        const responseData = {
          issue_date: issueDate,
          expiry_date: expiryDate,
          insuranceData: response.data.data,
        };
        onApiDataReceived(responseData);
        visaListLoader(false);
      })
      .catch((error) => {
        console.error('Error fetching Atlys data:', error);
        visaListLoader(false);
        toast.error('Some error occurred while fetching visa data.\nPlease try after some time', {
          style: {
            background: '#fff',
            color: '#ff4444',
          },
          icon: <img src={not} alt="Not Found" style={{ width: '70px', height: '70px' }} />,
        });
      });
  };

  const [selectedFromCountry, setSelectedFromCountry] = useState('');
  const [selectedToCountry, setSelectedToCountry] = useState('');
  const [issueDay, setIssueDay] = useState('');
  const [expiryDay, setExpiryDay] = useState('');
  const currentDate = new Date()

  const handleDateChange = (date, setDate, setDay) => {
    if (date) {
      const formattedDate = date.toDate();
      const dayOfWeek = moment(formattedDate).format('ddd');
      setDate(moment(formattedDate).format('YYYY-MM-DD'));
      setDay(dayOfWeek);
    } else {
      setDate('');
      setDay('');
    }
  };


  const disabledDate = (current) => {
    return current && current < currentDate;
  };


  return (
    <>
      <Toaster />
      <div className='d-flex flex-column justify-content-center gap-8'>
        <Formik validationSchema={null} initialValues={initValues} onSubmit={onSubmit}>
          {({handleSubmit}) => (
            <div className='d-flex flex-column justify-content-center gap-8'>
            
            <Form className='w-100' noValidate id='kt_create_account_form' onSubmit={handleSubmit}>
              <div
                className='d-flex flex-column align-items-center'
                style={{
                  background: '#fff',
                  padding: '50px 20px',
                  borderRadius: '15px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  border: '0.5px solid #e5e5e5',
                  maxWidth: '1200px',
                  width: '100%',
                }}
              >
                <h1 style={{fontSize:"30px"}} className='mb-20'>Get a Travel Insurance</h1>
                {/* From Country */}
                <div className='d-flex flex-row w-100 align-items-center'>
                <div
                  className='d-flex flex-column position-relative'
                  style={{
                    flex: '1 1 18%',
                    paddingRight: '10px',
                    borderRight: '0.5px solid #E5E5E5',
                    minWidth: '150px',
                  }}
                >
                  <label
                    className='position-absolute'
                    style={{
                      top: '-10px',
                      left: '40px',
                      background: '#fff',
                      padding: '0 5px',
                      fontSize: '12px',
                      color: '#327113',
                      zIndex: '1',
                      fontWeight: '600',
                    }}
                  >
                    FROM
                  </label>
                  <div className='d-flex align-items-center w-100'>
                    <RoomIcon style={{marginRight: '10px', color: '#327113'}} />
                    <Field
                      as='select'
                      name='fromCountry'
                      defaultValue={selectedFromCountry}
                      className='form-select border border-1 rounded'
                      style={{
                        background: '#fff',
                        color: '#000',
                        width: '100%',
                        padding: '10px 15px',
                        fontSize: '16px',
                      }}
                    >
                      <option value='IN'>India</option>
                    </Field>
                  </div>
                </div>

                {/* To Country */}
                <div
                  className='d-flex flex-column position-relative'
                  style={{
                    flex: '1 1 22%',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    borderRight: '0.5px solid #E5E5E5',
                    minWidth: '150px',
                  }}
                >
                  <label
                    className='position-absolute'
                    style={{
                      top: '-10px',
                      left: '50px',
                      background: '#fff',
                      padding: '0 5px',
                      fontSize: '12px',
                      color: '#327113',
                      zIndex: '1',
                      fontWeight: '600',
                    }}
                  >
                    TO
                  </label>
                  <div className='d-flex align-items-center w-100'>
                    <FlightIcon style={{marginRight: '10px', color: '#327113'}} />
                    <Field
                      as='select'
                      name='toCountry'
                      defaultValue={selectedToCountry}
                      className='form-select border border-1 rounded'
                      style={{
                        background: '#fff',
                        color: '#000',
                        width: '100%',
                        padding: '10px 15px',
                        fontSize: '14px',
                      }}
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
                  </div>
                </div>

                {/* Start Date */}
                <div
                  className='d-flex flex-column position-relative'
                  style={{
                    flex: '1 1 22%',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    borderRight: '0.5px solid #E5E5E5',
                    minWidth: '200px',
                  }}
                >
                  <label
                    className='position-absolute'
                    style={{
                      top: '-10px',
                      left: '20px',
                      background: '#fff',
                      padding: '0 5px',
                      fontSize: '12px',
                      color: '#327113',
                      zIndex: '1',
                      fontWeight: '600',
                    }}
                  >
                    START DATE
                  </label>
                  <div className='d-flex align-items-center w-100'>
                    <DatePicker
                      style={{
                        background: '#fff',
                        color: '#686868',
                        border: '1px solid #e5e5e5',
                        borderRadius: '5px',
                        width: '100%',
                        padding: '10px 15px',
                        fontSize: '16px',
                      }}
                      disabledDate={disabledDate}
                      onChange={(date) => handleDateChange(date, setIssueDate, setIssueDay)}
                    />
                    <span style={{color: '#686868', marginLeft: '10px'}}>{issueDay ? issueDay : 'Day'}</span>
                  </div>
                </div>

                {/* End Date */}
                <div
                  className='d-flex flex-column position-relative'
                  style={{
                    flex: '1 1 22%',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    minWidth: '200px',
                  }}
                >
                  <label
                    className='position-absolute'
                    style={{
                      top: '-10px',
                      left: '20px',
                      background: '#fff',
                      padding: '0 5px',
                      fontSize: '12px',
                      color: '#327113',
                      zIndex: '1',
                      fontWeight: '600',
                    }}
                  >
                    END DATE
                  </label>
                  <div className='d-flex align-items-center w-100'>
                    <DatePicker
                      style={{
                        background: '#fff',
                        color: '#686868',
                        border: '1px solid #e5e5e5',
                        borderRadius: '5px',
                        width: '100%',
                        padding: '10px 15px',
                        fontSize: '16px',
                      }}
                      disabledDate={disabledDate}
                      onChange={(date) => handleDateChange(date, setExpiryDate, setExpiryDay)}
                    />
                    <span style={{color: '#686868', marginLeft: '10px'}}>{expiryDay ? expiryDay : 'Day'}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div
                  className='d-flex align-items-center justify-content-center'
                  style={{flex: '1 1 18%', paddingLeft: '10px', minWidth: '150px'}}
                >
                  <button
                    type='submit'
                    style={{
                      borderRadius: '5px',
                      backgroundColor: '#327113',
                      border: 'none',
                      color: 'white',
                      height: '50px',
                      width: '100%',
                      fontSize: '16px',
                    }}
                  >
                    <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      Search Insurance
                      {/* <SearchIcon style={{ marginLeft: '8px', fontSize: '20px' }} /> */}
                    </span>
                  </button>
                </div>
                </div>
              </div>
            </Form>
            </div>
          )}
        </Formik>
      </div>
    </>
  )
}

export default MerchantApplyInsurance
