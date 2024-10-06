import React, { FC, useState, useEffect } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { ICreateAccount, inits } from '../modules/wizards/components/CreateAccountWizardHelper'
import axiosInstance from '../helpers/axiosInstance'
import { DatePicker } from 'antd'
import 'dayjs/locale/en';
import toast, { Toaster } from 'react-hot-toast';
import { IoMdSearch } from "react-icons/io";
import not from '../../_metronic/assets/card/3dnot.webp'

type Props = {
  show: (value: boolean) => void
  visaList: boolean
  visaListLoader: (value: boolean) => void
  onApiDataReceived: (data: any) => void
  manualValue: (data: any) => void;
  selectedFromCountry: string; // Add selectedFromCountry prop
  selectedToCountry: string; // Add selectedToCountry prop
}

const HomeApply: React.FC<Props> = ({
  show,
  visaList,
  onApiDataReceived,
  visaListLoader,
  manualValue,
}) => {
  
  const [selectedFromCountry, setSelectedFromCountry] = useState(''); 
  const [selectedToCountry, setSelectedToCountry] = useState('');
  const [issueDate, setIssueDate] = useState<string | undefined>('');
  const [expiryDate, setExpiryDate] = useState<string | undefined>('');
  const [fromCountryCodes, setFromCountryCodes] = useState([]);
  const [toCountryCodes, setToCountryCodes] = useState([] as any);
  const [initValues] = useState<ICreateAccount>(inits)

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
    const fetchToCountryCodes = async () => {
      try {
        const response = await axiosInstance.post('/backend/to_country_dropdown', {
          nationality_code: "IN",
        });
        setToCountryCodes(response.data.data || []); 
      } catch (error) {
        console.error('Error fetching toCountry codes:', error);
      }
    };

    fetchToCountryCodes();
  }, []);
  

  const onSubmit = (values: any) => {
    visaListLoader(true);
    setSelectedFromCountry(values.fromCountry);
    setSelectedToCountry(values.toCountry);
    const postData = {
      country_code: values.toCountry,
      nationality_code: "IN",
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
        const processingTime = apiData.visa_processing_time
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
          processTime: processingTime,
          original_visa_amount: apiData.visa_actual_price,
          receipt: receipt,
          value: apiData.value,
          country_code: values.toCountry,
          nationality_code: values.fromCountry,
          application_arrival_date: issueDate,
          application_departure_date: expiryDate,
        };
  
        main_data.push(extractedData);
      }
      onApiDataReceived(main_data);
      manualValue(manualFieldValue);
      visaListLoader(false);
    })
      .catch((error) => {
        console.error('Error fetching Atlys data:', error);
        visaListLoader(false);
        // Custom toast for some error while fetching visa data
        toast.error('Some error occurred while fetching visa data.\nPlease try after some time', {
          style: {
            background: '#fff',
            color: '#ff4444',
          },
          icon: <img src={not} alt="Not Found" style={{ width: '70px', height: '70px' }} />, // Use the imported image as the icon
        });
      });
  };
    

  const currentDate = new Date();

  const disabledDate = (current) => {
    return current && current < currentDate;
  };

  return (
    <div>
      
      <Formik validationSchema={null} initialValues={initValues} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <Form
            className='mt-8 w-100 px-9'
            noValidate
            id='kt_create_account_form'
            onSubmit={handleSubmit}
          >
            <div 
            className='hola'>
              <div className='fv-row mb-10 w-100'>
                <Field
                  as='select'
                  name='toCountry'
                  defaultValue={selectedToCountry}
                  style={{"color":"#000","background":"transparent","width":"22vw","border":"none",padding:"14px", marginTop:"10px", fontSize:"15px"}}
                >
                    <option value="">Select a Country...</option>
                      {toCountryCodes.map((code) => (
                        <option key={code._id} value={code.country_code}>
                          {countryCodeToNameMap[code.country_code] || code.country_code}
                        </option>
                      ))}
                </Field>
                <div className='text-danger mt-2'>
                  <ErrorMessage name='businessType' />
                </div>
              </div>
              {!visaList && (
              <div className='d-flex youto'>
                <button
                  type='submit'
                  style={{
                    width:"120px",
                    backgroundColor:"#327113",
                    color:"#fff",
                    fontSize:"16px",
                    border:"none",
                    cursor:"pointer",
                    fontWeight:"500",
                    borderRadius:"20px",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    marginRight:"-25px",
                    height:"42px",
                    marginTop:"14px",
                  }}
                ><IoMdSearch style={{fontSize:"20px", marginRight:"5px"}} />
                  Search
                </button>
              </div>
            )}
            </div>

            
          </Form>
        )}
      </Formik>

      
    </div>
  )
}

export default HomeApply
