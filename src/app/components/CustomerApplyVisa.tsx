import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { ICreateAccount, inits } from '../modules/wizards/components/CreateAccountWizardHelper';
import RoomIcon from '@mui/icons-material/Room';
import FlightIcon from '@mui/icons-material/Flight';
import axiosInstance from '../helpers/axiosInstance';
import { DatePicker } from 'antd';
import 'dayjs/locale/en';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import bgl from '../../_metronic/assets/card/apply2.png';
import not from '../../_metronic/assets/card/3dnot.webp';
import moment from 'moment';

type Props = {
  show: (value: boolean) => void;
  visaList: boolean;
  visaListLoader: (value: boolean) => void;
  onApiDataReceived: (data: any) => void;
  manualValue: (data: any) => void;
};


const CustomerApplyVisa: React.FC<Props> = ({ show, visaList, onApiDataReceived, manualValue, visaListLoader }) => {
  const [issueDate, setIssueDate] = useState<string | undefined>('');
  const [expiryDate, setExpiryDate] = useState<string | undefined>('');
  const [profile, setProfile] = useState<any>({}); // Update the type accordingly
  const [userType, setUserType] = useState<string | undefined>('');
  const [pan_doc, setPanDoc] = useState<boolean[]>([]);
  const [letter_doc, setLetterDoc] = useState<boolean[]>([]);
  const [itr_doc, setItrDoc] = useState<boolean[]>([]);
  const [ticket_doc, setTicketDoc] = useState<boolean[]>([]);
  const [initValues] = useState<ICreateAccount>(inits);
  const user_type = Cookies.get('user_type');
  const [fromCountryCodes, setFromCountryCodes] = useState([]);
  const [toCountryCodes, setToCountryCodes] = useState([] as any);

  const countryCodeToNameMap: { [key: string]: string } = {
    'AF': 'Afghanistan',
    'AL': 'Albania',
    'DZ': 'Algeria',
    'AS': 'American Samoa',
    'AD': 'Andorra',
    'AO': 'Angola',
    'AI': 'Anguilla',
    'AQ': 'Antarctica',
    'AG': 'Antigua and Barbuda',
    'AR': 'Argentina',
    'AM': 'Armenia',
    'AW': 'Aruba',
    'AU': 'Australia',
    'AT': 'Austria',
    'AZ': 'Azerbaijan',
    'BS': 'Bahamas',
    'BH': 'Bahrain',
    'BD': 'Bangladesh',
    'BB': 'Barbados',
    'BY': 'Belarus',
    'BE': 'Belgium',
    'BZ': 'Belize',
    'BJ': 'Benin',
    'BM': 'Bermuda',
    'BT': 'Bhutan',
    'BO': 'Bolivia',
    'BA': 'Bosnia and Herzegovina',
    'BW': 'Botswana',
    'BR': 'Brazil',
    'BN': 'Brunei',
    'BG': 'Bulgaria',
    'BF': 'Burkina Faso',
    'BI': 'Burundi',
    'CV': 'Cabo Verde',
    'KH': 'Cambodia',
    'CM': 'Cameroon',
    'CA': 'Canada',
    'KY': 'Cayman Islands',
    'CF': 'Central African Republic',
    'TD': 'Chad',
    'CL': 'Chile',
    'CN': 'China',
    'CO': 'Colombia',
    'KM': 'Comoros',
    'CG': 'Congo - Brazzaville',
    'CD': 'Congo - Kinshasa',
    'CR': 'Costa Rica',
    'CI': "Côte d'Ivoire",
    'HR': 'Croatia',
    'CU': 'Cuba',
    'CY': 'Cyprus',
    'CZ': 'Czechia',
    'DK': 'Denmark',
    'DJ': 'Djibouti',
    'DM': 'Dominica',
    'DO': 'Dominican Republic',
    'EC': 'Ecuador',
    'EG': 'Egypt',
    'SV': 'El Salvador',
    'GQ': 'Equatorial Guinea',
    'ER': 'Eritrea',
    'EE': 'Estonia',
    'SZ': 'Eswatini',
    'ET': 'Ethiopia',
    'FJ': 'Fiji',
    'FI': 'Finland',
    'FR': 'France',
    'GF': 'French Guiana',
    'PF': 'French Polynesia',
    'GA': 'Gabon',
    'GM': 'Gambia',
    'GE': 'Georgia',
    'DE': 'Germany',
    'GH': 'Ghana',
    'GI': 'Gibraltar',
    'GR': 'Greece',
    'GL': 'Greenland',
    'GD': 'Grenada',
    'GP': 'Guadeloupe',
    'GU': 'Guam',
    'GT': 'Guatemala',
    'GN': 'Guinea',
    'GW': 'Guinea-Bissau',
    'GY': 'Guyana',
    'HT': 'Haiti',
    'HN': 'Honduras',
    'HK': 'Hong Kong SAR China',
    'HU': 'Hungary',
    'IS': 'Iceland',
    'IN': 'India',
    'ID': 'Indonesia',
    'IR': 'Iran',
    'IQ': 'Iraq',
    'IE': 'Ireland',
    'IM': 'Isle of Man',
    'IL': 'Israel',
    'IT': 'Italy',
    'JM': 'Jamaica',
    'JP': 'Japan',
    'JO': 'Jordan',
    'KZ': 'Kazakhstan',
    'KE': 'Kenya',
    'KI': 'Kiribati',
    'KW': 'Kuwait',
    'KG': 'Kyrgyzstan',
    'LA': 'Laos',
    'LV': 'Latvia',
    'LB': 'Lebanon',
    'LS': 'Lesotho',
    'LR': 'Liberia',
    'LY': 'Libya',
    'LI': 'Liechtenstein',
    'LT': 'Lithuania',
    'LU': 'Luxembourg',
    'MO': 'Macau SAR China',
    'MG': 'Madagascar',
    'MW': 'Malawi',
    'MY': 'Malaysia',
    'MV': 'Maldives',
    'ML': 'Mali',
    'MT': 'Malta',
    'MH': 'Marshall Islands',
    'MQ': 'Martinique',
    'MR': 'Mauritania',
    'MU': 'Mauritius',
    'YT': 'Mayotte',
    'MX': 'Mexico',
    'FM': 'Micronesia',
    'MD': 'Moldova',
    'MC': 'Monaco',
    'MN': 'Mongolia',
    'ME': 'Montenegro',
    'MS': 'Montserrat',
    'MA': 'Morocco',
    'MZ': 'Mozambique',
    'MM': 'Myanmar (Burma)',
    'NA': 'Namibia',
    'NR': 'Nauru',
    'NP': 'Nepal',
    'NL': 'Netherlands',
    'NC': 'New Caledonia',
    'NZ': 'New Zealand',
    'NI': 'Nicaragua',
    'NE': 'Niger',
    'NG': 'Nigeria',
    'NU': 'Niue',
    'NF': 'Norfolk Island',
    'KP': 'North Korea',
    'MK': 'North Macedonia',
    'NO': 'Norway',
    'OM': 'Oman',
    'PK': 'Pakistan',
    'PW': 'Palau',
    'PS': 'Palestine',
    'PA': 'Panama',
    'PG': 'Papua New Guinea',
    'PY': 'Paraguay',
    'PE': 'Peru',
    'PH': 'Philippines',
    'PL': 'Poland',
    'PT': 'Portugal',
    'PR': 'Puerto Rico',
    'QA': 'Qatar',
    'RO': 'Romania',
    'RU': 'Russia',
    'RW': 'Rwanda',
    'RE': 'Réunion',
    'WS': 'Samoa',
    'SM': 'San Marino',
    'ST': 'São Tomé & Príncipe',
    'SA': 'Saudi Arabia',
    'SN': 'Senegal',
    'RS': 'Serbia',
    'SC': 'Seychelles',
    'SL': 'Sierra Leone',
    'SG': 'Singapore',
    'SX': 'Sint Maarten',
    'SK': 'Slovakia',
    'SI': 'Slovenia',
    'SB': 'Solomon Islands',
    'SO': 'Somalia',
    'ZA': 'South Africa',
    'KR': 'South Korea',
    'SS': 'South Sudan',
    'ES': 'Spain',
    'LK': 'Sri Lanka',
    'BL': 'St. Barthélemy',
    'SH': 'St. Helena',
    'KN': 'St. Kitts & Nevis',
    'LC': 'St. Lucia',
    'MF': 'St. Martin',
    'PM': 'St. Pierre & Miquelon',
    'VC': 'St. Vincent & Grenadines',
    'SD': 'Sudan',
    'SR': 'Suriname',
    'SJ': 'Svalbard & Jan Mayen',
    'SE': 'Sweden',
    'CH': 'Switzerland',
    'SY': 'Syria',
    'TW': 'Taiwan',
    'TJ': 'Tajikistan',
    'TZ': 'Tanzania',
    'TH': 'Thailand',
    'TL': 'Timor-Leste',
    'TG': 'Togo',
    'TK': 'Tokelau',
    'TO': 'Tonga',
    'TT': 'Trinidad & Tobago',
    'TN': 'Tunisia',
    'TR': 'Turkey',
    'TM': 'Turkmenistan',
    'TC': 'Turks & Caicos Islands',
    'TV': 'Tuvalu',
    'UG': 'Uganda',
    'UA': 'Ukraine',
    'AE': 'United Arab Emirates',
    'GB': 'United Kingdom',
    'US': 'United States',
    'UY': 'Uruguay',
    'UZ': 'Uzbekistan',
    'VU': 'Vanuatu',
    'VA': 'Vatican City',
    'VE': 'Venezuela',
    'VN': 'Vietnam',
    'WF': 'Wallis & Futuna',
    'EH': 'Western Sahara',
    'YE': 'Yemen',
    'ZM': 'Zambia',
    'ZW': 'Zimbabwe',
  };

  useEffect(() => {
    const fetchFromCountryCodes = async () => {
      try {
        const response = await axiosInstance.get('/backend/from_country_dropdown');
        setFromCountryCodes(response.data.data || []);
      } catch (error) {
        console.error('Error fetching fromCountry codes:', error);
      }
    };

    fetchFromCountryCodes();
  }, []);

  const handleFromCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setSelectedFromCountry(selectedCountry);
    try {
      const response = await axiosInstance.post('/backend/to_country_dropdown', {
        nationality_code: selectedCountry,
      });
      setToCountryCodes(response.data.data || []); 
    } catch (error) {
      console.error('Error fetching toCountry codes:', error);
    }
  };


  const onSubmit = (values: any) => {
    visaListLoader(true);
    setSelectedFromCountry(values.fromCountry);
    setSelectedToCountry(values.toCountry);
    const postData = {
      country_code: values.toCountry,
      nationality_code: selectedFromCountry || values.fromCountry,
    };
  
    axiosInstance
      .post('/backend/get_all_possible_visas_customer', postData)
      .then((response) => {
        const manualFieldValue = response.data.manual;
        if (!response.data.data || response.data.data.length === 0) {
          toast.error('Oops !!\nVisa for this country is not available.', {
            style: {
              background: '#fff',
              color: '#ff4444',
            },
            icon: <img src={not} alt="Not Found" style={{ width: '70px', height: '70px' }} />,
          });
          visaListLoader(false);
          return;
        }
  
        let main_data: {
          day: number | null;
          entryType: string | null;
          country: string | null;
          description: string | null;
          receipt: any | null;
          value: string | null;
        }[] = [];
  
  
        for (let i = 0; i < response.data.data.length; i++) {
          const apiData = response.data.data[i];     
          const description = manualFieldValue ? apiData.visa_description : apiData.description;
          const dayMatch = description.match(/\d+/);
          const day = dayMatch ? parseInt(dayMatch[0]) : null;
          const actualPrice = apiData.visa_actual_price;
          const countryTypeMatch = description.match(/(.+?)\s+\d+\s+Days/);
          const country = countryTypeMatch ? countryTypeMatch[1] : null;
          const entryTypeMatch = description.match(/Days\s+(\w+)/i);
          const entryType = entryTypeMatch ? entryTypeMatch[1] : null;
          const receipt = manualFieldValue ? { "Visa Fees": apiData.visa_price_b2c } : apiData.receipt;

  
          const extractedData = {
            day: manualFieldValue ? parseInt(apiData.visa_duration) : day,
            entryType: entryType ? entryType : 'Single',
            country: country,
            description: description,
            receipt: receipt,
            value: apiData.value,
            country_code: values.toCountry,
            nationality_code:  selectedFromCountry || values.fromCountry,
            application_arrival_date: issueDate,
            application_departure_date: expiryDate,
            pan_doc: apiData.pan_doc,
            letter_doc: apiData.letter_doc,
            itr_doc: apiData.itr_doc,
            ticket_doc: apiData.ticket_doc,
            visa_actual_price: actualPrice,
          };
  
          main_data.push(extractedData);
        }
        
        // Set manual value and other document values
        onApiDataReceived(main_data);
        manualValue(manualFieldValue);
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
      const formattedDate = date.toDate(); // Converts moment object to Date object
      const dayOfWeek = moment(formattedDate).format('ddd');
      setDate(moment(formattedDate).format('YYYY-MM-DD'));
      setDay(dayOfWeek);
    } else {
      setDate('');
      setDay('');
    }
  };

  const disabledDate = (current) => {
    return current && current < currentDate
  }

  const disabledDates = (current) => {
    return current && current > currentDate
  }


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
                <h1 style={{fontSize:"30px"}} className='mb-20'>Getting visa was never this easy</h1>
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
                      onChange={handleFromCountryChange} 
                      name='fromCountry'
                      defaultValue={selectedFromCountry}
                      className='form-select border border-1 rounded'
                      style={{
                        background: '#fff',
                        color: '#000',
                        width: '100%',
                        padding: '10px 15px',
                        fontSize: '14px',
                      }}
                    >
                      <option value="">Select a Country...</option>
                      {fromCountryCodes.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
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
                      <option value="">Select a Country...</option>
                      {toCountryCodes.map((code) => (
                        <option key={code._id} value={code.country_code}>
                          {countryCodeToNameMap[code.country_code] || code.country_code}
                        </option>
                      ))}
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
                      Search Visa
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

export default CustomerApplyVisa
