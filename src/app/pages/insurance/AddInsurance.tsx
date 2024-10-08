import React, { useState, useEffect } from 'react';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../helpers/axiosInstance';
import { useLocation } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface Country {
  name: string;
  code: string;
}

interface Price {
  base_price: string;
  price_per_day: string;
  actual_price: string;
}

interface AgeGroup {
  age_group: string;
  description: string;
  benefits: string[];
  partner: Price;
  retailer: Price;
  customer: Price;
}

interface Plan {
  plan_name: string;
  age_groups: AgeGroup[];
  base_price: string;
  actual_price: string;
}

interface Plans {
  platinum: Plan;
  gold: Plan;
  silver: Plan;
}

const inputStyle1 = {
  border: '1px solid #d3d3d3',
  borderRadius: '10px',
  padding: '10px',
  paddingLeft: '20px',
  width: '100%',
  boxSizing: 'border-box',
};

const AddInsurance = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country[]>([]);
  const [fromCountry, setFromCountry] = useState('IN');
  const location = useLocation(); 
  const { insuranceData }: any = location.state || {};

  const countries: Country[] = [
    { name: 'Afghanistan', code: 'AF' },
    { name: 'Albania', code: 'AL' },
    { name: 'Algeria', code: 'DZ' },
    { name: 'Andorra', code: 'AD' },
    { name: 'Angola', code: 'AO' },
    { name: 'Antigua and Barbuda', code: 'AG' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Armenia', code: 'AM' },
    { name: 'Australia', code: 'AU' },
    { name: 'Austria', code: 'AT' },
    { name: 'Azerbaijan', code: 'AZ' },
    { name: 'Bahamas', code: 'BS' },
    { name: 'Bahrain', code: 'BH' },
    { name: 'Bangladesh', code: 'BD' },
    { name: 'Barbados', code: 'BB' },
    { name: 'Belarus', code: 'BY' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Belize', code: 'BZ' },
    { name: 'Benin', code: 'BJ' },
    { name: 'Bhutan', code: 'BT' },
    { name: 'Bolivia', code: 'BO' },
    { name: 'Bosnia and Herzegovina', code: 'BA' },
    { name: 'Botswana', code: 'BW' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Brunei Darussalam', code: 'BN' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'Burkina Faso', code: 'BF' },
    { name: 'Burundi', code: 'BI' },
    { name: 'Cabo Verde', code: 'CV' },
    { name: 'Cambodia', code: 'KH' },
    { name: 'Cameroon', code: 'CM' },
    { name: 'Canada', code: 'CA' },
    { name: 'Central African Republic', code: 'CF' },
    { name: 'Chad', code: 'TD' },
    { name: 'Chile', code: 'CL' },
    { name: 'China', code: 'CN' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Comoros', code: 'KM' },
    { name: 'Congo', code: 'CG' },
    { name: 'Congo (Democratic Republic of the)', code: 'CD' },
    { name: 'Costa Rica', code: 'CR' },
    { name: 'Croatia', code: 'HR' },
    { name: 'Cuba', code: 'CU' },
    { name: 'Cyprus', code: 'CY' },
    { name: 'Czech Republic', code: 'CZ' },
    { name: 'Denmark', code: 'DK' },
    { name: 'Djibouti', code: 'DJ' },
    { name: 'Dominica', code: 'DM' },
    { name: 'Dominican Republic', code: 'DO' },
    { name: 'Ecuador', code: 'EC' },
    { name: 'Egypt', code: 'EG' },
    { name: 'El Salvador', code: 'SV' },
    { name: 'Equatorial Guinea', code: 'GQ' },
    { name: 'Eritrea', code: 'ER' },
    { name: 'Estonia', code: 'EE' },
    { name: 'Eswatini', code: 'SZ' },
    { name: 'Ethiopia', code: 'ET' },
    { name: 'Fiji', code: 'FJ' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'Gabon', code: 'GA' },
    { name: 'Gambia', code: 'GM' },
    { name: 'Georgia', code: 'GE' },
    { name: 'Germany', code: 'DE' },
    { name: 'Ghana', code: 'GH' },
    { name: 'Greece', code: 'GR' },
    { name: 'Grenada', code: 'GD' },
    { name: 'Guatemala', code: 'GT' },
    { name: 'Guinea', code: 'GN' },
    { name: 'Guinea-Bissau', code: 'GW' },
    { name: 'Guyana', code: 'GY' },
    { name: 'Haiti', code: 'HT' },
    { name: 'Honduras', code: 'HN' },
    { name: 'Hungary', code: 'HU' },
    { name: 'Iceland', code: 'IS' },
    { name: 'India', code: 'IN' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Iran', code: 'IR' },
    { name: 'Iraq', code: 'IQ' },
    { name: 'Ireland', code: 'IE' },
    { name: 'Israel', code: 'IL' },
    { name: 'Italy', code: 'IT' },
    { name: 'Jamaica', code: 'JM' },
    { name: 'Japan', code: 'JP' },
    { name: 'Jordan', code: 'JO' },
    { name: 'Kazakhstan', code: 'KZ' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Kiribati', code: 'KI' },
    { name: 'Korea (Democratic People\'s Republic of)', code: 'KP' },
    { name: 'Korea (Republic of)', code: 'KR' },
    { name: 'Kuwait', code: 'KW' },
    { name: 'Kyrgyzstan', code: 'KG' },
    { name: 'Lao People\'s Democratic Republic', code: 'LA' },
    { name: 'Latvia', code: 'LV' },
    { name: 'Lebanon', code: 'LB' },
    { name: 'Lesotho', code: 'LS' },
    { name: 'Liberia', code: 'LR' },
    { name: 'Libya', code: 'LY' },
    { name: 'Liechtenstein', code: 'LI' },
    { name: 'Lithuania', code: 'LT' },
    { name: 'Luxembourg', code: 'LU' },
    { name: 'Madagascar', code: 'MG' },
    { name: 'Malawi', code: 'MW' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Maldives', code: 'MV' },
    { name: 'Mali', code: 'ML' },
    { name: 'Malta', code: 'MT' },
    { name: 'Marshall Islands', code: 'MH' },
    { name: 'Mauritania', code: 'MR' },
    { name: 'Mauritius', code: 'MU' },
    { name: 'Mexico', code: 'MX' },
    { name: 'Micronesia (Federated States of)', code: 'FM' },
    { name: 'Moldova (Republic of)', code: 'MD' },
    { name: 'Monaco', code: 'MC' },
    { name: 'Mongolia', code: 'MN' },
    { name: 'Montenegro', code: 'ME' },
    { name: 'Morocco', code: 'MA' },
    { name: 'Mozambique', code: 'MZ' },
    { name: 'Myanmar', code: 'MM' },
    { name: 'Namibia', code: 'NA' },
    { name: 'Nauru', code: 'NR' },
    { name: 'Nepal', code: 'NP' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'Nicaragua', code: 'NI' },
    { name: 'Niger', code: 'NE' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'North Macedonia', code: 'MK' },
    { name: 'Norway', code: 'NO' },
    { name: 'Oman', code: 'OM' },
    { name: 'Pakistan', code: 'PK' },
    { name: 'Palau', code: 'PW' },
    { name: 'Panama', code: 'PA' },
    { name: 'Papua New Guinea', code: 'PG' },
    { name: 'Paraguay', code: 'PY' },
    { name: 'Peru', code: 'PE' },
    { name: 'Philippines', code: 'PH' },
    { name: 'Poland', code: 'PL' },
    { name: 'Portugal', code: 'PT' },
    { name: 'Qatar', code: 'QA' },
    { name: 'Romania', code: 'RO' },
    { name: 'Russian Federation', code: 'RU' },
    { name: 'Rwanda', code: 'RW' },
    { name: 'Saint Kitts and Nevis', code: 'KN' },
    { name: 'Saint Lucia', code: 'LC' },
    { name: 'Saint Vincent and the Grenadines', code: 'VC' },
    { name: 'Samoa', code: 'WS' },
    { name: 'San Marino', code: 'SM' },
    { name: 'Sao Tome and Principe', code: 'ST' },
    { name: 'Saudi Arabia', code: 'SA' },
    { name: 'Senegal', code: 'SN' },
    { name: 'Serbia', code: 'RS' },
    { name: 'Seychelles', code: 'SC' },
    { name: 'Sierra Leone', code: 'SL' },
    { name: 'Singapore', code: 'SG' },
    { name: 'Slovakia', code: 'SK' },
    { name: 'Slovenia', code: 'SI' },
    { name: 'Solomon Islands', code: 'SB' },
    { name: 'Somalia', code: 'SO' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'South Sudan', code: 'SS' },
    { name: 'Spain', code: 'ES' },
    { name: 'Sri Lanka', code: 'LK' },
    { name: 'Sudan', code: 'SD' },
    { name: 'Suriname', code: 'SR' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'Syrian Arab Republic', code: 'SY' },
    { name: 'Tajikistan', code: 'TJ' },
    { name: 'Tanzania, United Republic of', code: 'TZ' },
    { name: 'Thailand', code: 'TH' },
    { name: 'Timor-Leste', code: 'TL' },
    { name: 'Togo', code: 'TG' },
    { name: 'Tonga', code: 'TO' },
    { name: 'Trinidad and Tobago', code: 'TT' },
    { name: 'Tunisia', code: 'TN' },
    { name: 'Turkey', code: 'TR' },
    { name: 'Turkmenistan', code: 'TM' },
    { name: 'Tuvalu', code: 'TV' },
    { name: 'Uganda', code: 'UG' },
    { name: 'Ukraine', code: 'UA' },
    { name: 'United Arab Emirates', code: 'AE' },
    { name: 'United Kingdom of Great Britain and Northern Ireland', code: 'GB' },
    { name: 'United States of America', code: 'US' },
    { name: 'Uruguay', code: 'UY' },
    { name: 'Uzbekistan', code: 'UZ' },
    { name: 'Vanuatu', code: 'VU' },
    { name: 'Venezuela (Bolivarian Republic of)', code: 'VE' },
    { name: 'Viet Nam', code: 'VN' },
    { name: 'Yemen', code: 'YE' },
    { name: 'Zambia', code: 'ZM' },
    { name: 'Zimbabwe', code: 'ZW' }
  ];

  const countryTemplate = (option: Country) => {
    return (
      <div className="d-flex align-items-center">
        <img
          alt={option.name}
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`mr-2 flag flag-${option.code.toLowerCase()}`}
          style={{ width: '18px', marginRight: '5px' }}
        />
        <div>{option.name}</div>
      </div>
    );
  };

  const panelFooterTemplate = () => {
    const length = selectedCountry.length;
    return (
      <div className="py-2 px-3">
        <b>{length}</b> item{length > 1 ? 's' : ''} selected.
      </div>
    );
  };

  const initialValues = {
    platinum: {
      plan_name: 'Titan',
      base_price: '',
      actual_price: '',
      age_groups: [
        {
          age_group: '3 mths–50 yrs',
          description: '',
          benefits: ['', '', ''],
          partner: { base_price: '', price_per_day: '', actual_price: '' },
          retailer: { base_price: '', price_per_day: '', actual_price: '' },
          customer: { base_price: '', price_per_day: '', actual_price: '' },
        },
        {
          age_group: '50 yrs, 1 day–60 yrs',
          description: '',
          benefits: ['', '', ''],
          partner: { base_price: '', price_per_day: '', actual_price: '' },
          retailer: { base_price: '', price_per_day: '', actual_price: '' },
          customer: { base_price: '', price_per_day: '', actual_price: '' },
        },
        {
          age_group: '60 yrs, 1 day–70 yrs',
          description: '',
          benefits: ['', '', ''],
          partner: { base_price: '', price_per_day: '', actual_price: '' },
          retailer: { base_price: '', price_per_day: '', actual_price: '' },
          customer: { base_price: '', price_per_day: '', actual_price: '' },
        },
      ],
    },
    gold: {
      plan_name: 'Shippuden',
      base_price: '',
      actual_price: '',
      age_groups: [
        {
          age_group: '3 mths–50 yrs',
          description: '',
          benefits: ['', '', ''],
          partner: { base_price: '', price_per_day: '', actual_price: '' },
          retailer: { base_price: '', price_per_day: '', actual_price: '' },
          customer: { base_price: '', price_per_day: '', actual_price: '' },
        },
        {
          age_group: '50 yrs, 1 day–60 yrs',
          description: '',
          benefits: ['', '', ''],
          partner: { base_price: '', price_per_day: '', actual_price: '' },
          retailer: { base_price: '', price_per_day: '', actual_price: '' },
          customer: { base_price: '', price_per_day: '', actual_price: '' },
        },
        {
          age_group: '60 yrs, 1 day–70 yrs',
          description: '',
          benefits: ['', '', ''],
          partner: { base_price: '', price_per_day: '', actual_price: '' },
          retailer: { base_price: '', price_per_day: '', actual_price: '' },
          customer: { base_price: '', price_per_day: '', actual_price: '' },
        },
      ],
    },
    silver: {
      plan_name: 'Once Piece',
      base_price: '',
      actual_price: '',
      age_groups: [
        {
          age_group: '3 mths–50 yrs',
          description: '',
          benefits: ['', '', ''],
          partner: { base_price: '', price_per_day: '', actual_price: '' },
          retailer: { base_price: '', price_per_day: '', actual_price: '' },
          customer: { base_price: '', price_per_day: '', actual_price: '' },
        },
        {
          age_group: '50 yrs, 1 day–60 yrs',
          description: '',
          benefits: ['', '', ''],
          partner: { base_price: '', price_per_day: '', actual_price: '' },
          retailer: { base_price: '', price_per_day: '', actual_price: '' },
          customer: { base_price: '', price_per_day: '', actual_price: '' },
        },
        {
          age_group: '60 yrs, 1 day–70 yrs',
          description: '',
          benefits: ['', '', ''],
          partner: { base_price: '', price_per_day: '', actual_price: '' },
          retailer: { base_price: '', price_per_day: '', actual_price: '' },
          customer: { base_price: '', price_per_day: '', actual_price: '' },
        },
      ],
    },
  };
  

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const formData = {
        nationality_code: fromCountry,
        api_id: insuranceData.id,
        type: "api",
        country_code: selectedCountry.map((country) => country.code),
        insurance_description: insuranceData.name,
        plans: values,
      };
      await axiosInstance.post('/backend/create_insurance', formData);
      toast.success('Insurance Created successfully!');
      setTimeout(() => {
        window.location.href = '/superadmin/insurance';
    }, 2500);
    } catch (error) {
      console.error('Error submitting insurance data:', error);
      toast.error('Error submitting form. Please try again later.');
    }
  };

  const plans = ['platinum', 'gold', 'silver'];

  return (
    <div className='px-auto d-flex flex-column'>
      <Toaster />
      <div className='px-auto mb-4 w-100 d-flex flex-column'>
        <h1>Add Insurance's Details</h1>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, setFieldValue }) => (
            <Form className='py-12 d-flex flex-wrap px-9' noValidate id='kt_create_account_form'>
              <div className='d-flex gap-3 w-100 flex-nowrap'>
              <div className='w-50 d-flex flex-column my-5'>
              <label className='form-label fs-5 required'>From Country</label>
              <Field
                as='select'
                name='fromCountry'
                className='form-select form-select-lg form-select-solid border border-1 border-secondary rounded-4'
                onChange={(e: any) => setFieldValue('fromCountry', e.target.value)}
              >
                <option value=''>Select a Country...</option>
                <option value='IN'>India</option>
              </Field>
              <div className='text-danger mt-2'>
                <ErrorMessage name='fromCountry' />
              </div>
            </div>
            <div className='w-50 d-flex flex-column my-5'>
              <label className='form-label fs-5 required'>To Countries</label>
              <MultiSelect
                value={selectedCountry}
                options={countries}
                onChange={(e: MultiSelectChangeEvent) => setSelectedCountry(e.value)}
                optionLabel="name"
                placeholder="Select a Country..."
                itemTemplate={countryTemplate}
                panelFooterTemplate={panelFooterTemplate}
                className='form-select form-select-lg form-select-solid border border-1 border-secondary rounded-4'
                display="chip"
              />
              <div className='text-danger mt-2'>
                <ErrorMessage name='selectedCities' />
              </div>
            </div>

              </div>

              <div className='w-100 d-flex flex-column my-5'>
                <label className='form-label fs-5 required'>Insurance Description</label>
                <Field
                  as='textarea'
                  name='insurance_description'
                  className='form-control form-control-lg form-control-solid'
                  style={inputStyle1}
                  value={insuranceData.name}
                  readyOnly
                  rows={3}
                />
                <div className='text-danger mt-2'>
                  <ErrorMessage name='insurance_description' />
                </div>
              </div>

              <div className='w-100 d-flex flex-column'>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Platinum Plan</Accordion.Header>
                  <Accordion.Body>
                    <div className='mb-3'>
                      <label className='form-label required'>Plan Name</label>
                      <Field
                        type='text'
                        name="platinum.plan_name"
                        className='form-control'
                        style={inputStyle1}
                      />
                      <div className='text-danger'>
                        <ErrorMessage name="platinum.plan_name" />
                      </div>
                    </div>

                    <div className='d-flex w-100 gap-3 mb-5'>
                      <div className='w-50'>
                        <label className='form-label fs-5 required'>Base Price</label>
                        <Field
                          type='text'
                          name='platinum.base_price'
                          className='form-control form-control-lg form-control-solid'
                          style={inputStyle1}
                        />
                        <div className='text-danger mt-2'>
                          <ErrorMessage name='platinum.base_price' />
                        </div>
                      </div>
                      <div className='w-50'>
                        <label className='form-label fs-5 required'>Insurance Cost</label>
                        <Field
                          type='text'
                          name='platinum.actual_price'
                          className='form-control form-control-lg form-control-solid'
                          style={inputStyle1}
                        />
                        <div className='text-danger mt-2'>
                          <ErrorMessage name='platinum.actual_price' />
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between">
                      {['3 mths–50 yrs', '50 yrs, 1 day–60 yrs', '60 yrs, 1 day–70 yrs'].map((ageGroup, index) => (
                        <div key={index} className="card flex-fill mx-2">
                          <div className="card-body">
                            <h3 className="card-title">{ageGroup}</h3>
                            <div className='mb-3'>
                              <label className='form-label required'>Description</label>
                              <Field
                                as='textarea'
                                name={`platinum.age_groups[${index}].description`}
                                className='form-control'
                                style={inputStyle1}
                                rows={2}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`platinum.age_groups[${index}].description`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Partner Base Price</label>
                              <Field
                                type='text'
                                name={`platinum.age_groups[${index}].partner.base_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`platinum.age_groups[${index}].partner.base_price`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Partner Price Per Day</label>
                              <Field
                                type='text'
                                name={`platinum.age_groups[${index}].partner.price_per_day`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`platinum.age_groups[${index}].partner.price_per_day`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Partner Actual Price</label>
                              <Field
                                type='text'
                                name={`platinum.age_groups[${index}].partner.actual_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`platinum.age_groups[${index}].partner.actual_price`} />
                              </div>
                            </div>
                            <hr className="ahr" />
                            <div className='mb-3'>
                              <label className='form-label required'>Retailer Base Price</label>
                              <Field
                                type='text'
                                name={`platinum.age_groups[${index}].retailer.base_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`platinum.age_groups[${index}].retailer.base_price`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Retailer Price Per Day</label>
                              <Field
                                type='text'
                                name={`platinum.age_groups[${index}].retailer.price_per_day`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`platinum.age_groups[${index}].retailer.price_per_day`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Retailer Actual Price</label>
                              <Field
                                type='text'
                                name={`platinum.age_groups[${index}].retailer.actual_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`platinum.age_groups[${index}].retailer.actual_price`} />
                              </div>
                            </div>
                            <hr className="ahr" />
                            <div className='mb-3'>
                              <label className='form-label required'>Customer Base Price</label>
                              <Field
                                type='text'
                                name={`platinum.age_groups[${index}].customer.base_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`platinum.age_groups[${index}].customer.base_price`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Customer Price Per Day</label>
                              <Field
                                type='text'
                                name={`platinum.age_groups[${index}].customer.price_per_day`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`platinum.age_groups[${index}].customer.price_per_day`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Customer Actual Price</label>
                              <Field
                                type='text'
                                name={`platinum.age_groups[${index}].customer.actual_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`platinum.age_groups[${index}].customer.actual_price`} />
                              </div>
                            </div>
                            <hr className="ahr" />
                            <div className='mb-3 d-flex flex-column gap-2'>
                              <label className='form-label required'>Benefits</label>
                              {Array.from({ length: 3 }).map((_, benefitIndex) => (
                                <div key={benefitIndex}>
                                  <Field
                                    type='text'
                                    name={`platinum.age_groups[${index}].benefits[${benefitIndex}]`}
                                    className='form-control'
                                    style={inputStyle1}
                                  />
                                  <div className='text-danger'>
                                    <ErrorMessage name={`platinum.age_groups[${index}].benefits[${benefitIndex}]`} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>

            <div className='w-100 d-flex flex-column'>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Gold Plan</Accordion.Header>
                  <Accordion.Body>
                    <div className='mb-3'>
                      <label className='form-label required'>Plan Name</label>
                      <Field
                        type='text'
                        name="gold.plan_name"
                        className='form-control'
                        style={inputStyle1}
                      />
                      <div className='text-danger'>
                        <ErrorMessage name="gold.plan_name" />
                      </div>
                    </div>

                    <div className='d-flex w-100 gap-3 mb-5'>
                      <div className='w-50'>
                        <label className='form-label fs-5 required'>Base Price</label>
                        <Field
                          type='text'
                          name='gold.base_price'
                          className='form-control form-control-lg form-control-solid'
                          style={inputStyle1}
                        />
                        <div className='text-danger mt-2'>
                          <ErrorMessage name='gold.base_price' />
                        </div>
                      </div>
                      <div className='w-50'>
                        <label className='form-label fs-5 required'>Insurance Cost</label>
                        <Field
                          type='text'
                          name='gold.actual_price'
                          className='form-control form-control-lg form-control-solid'
                          style={inputStyle1}
                        />
                        <div className='text-danger mt-2'>
                          <ErrorMessage name='gold.actual_price' />
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between">
                      {['3 mths–50 yrs', '50 yrs, 1 day–60 yrs', '60 yrs, 1 day–70 yrs'].map((ageGroup, index) => (
                        <div key={index} className="card flex-fill mx-2">
                          <div className="card-body">
                            <h3 className="card-title">{ageGroup}</h3>
                            <div className='mb-3'>
                              <label className='form-label required'>Description</label>
                              <Field
                                as='textarea'
                                name={`gold.age_groups[${index}].description`}
                                className='form-control'
                                style={inputStyle1}
                                rows={2}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`gold.age_groups[${index}].description`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Partner Base Price</label>
                              <Field
                                type='text'
                                name={`gold.age_groups[${index}].partner.base_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`gold.age_groups[${index}].partner.base_price`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Partner Price Per Day</label>
                              <Field
                                type='text'
                                name={`gold.age_groups[${index}].partner.price_per_day`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`gold.age_groups[${index}].partner.price_per_day`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Partner Actual Price</label>
                              <Field
                                type='text'
                                name={`gold.age_groups[${index}].partner.actual_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`gold.age_groups[${index}].partner.actual_price`} />
                              </div>
                            </div>
                            <hr className="ahr" />
                            <div className='mb-3'>
                              <label className='form-label required'>Retailer Base Price</label>
                              <Field
                                type='text'
                                name={`gold.age_groups[${index}].retailer.base_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`gold.age_groups[${index}].retailer.base_price`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Retailer Price Per Day</label>
                              <Field
                                type='text'
                                name={`gold.age_groups[${index}].retailer.price_per_day`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`gold.age_groups[${index}].retailer.price_per_day`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Retailer Actual Price</label>
                              <Field
                                type='text'
                                name={`gold.age_groups[${index}].retailer.actual_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`gold.age_groups[${index}].retailer.actual_price`} />
                              </div>
                            </div>
                            <hr className="ahr" />
                            <div className='mb-3'>
                              <label className='form-label required'>Customer Base Price</label>
                              <Field
                                type='text'
                                name={`gold.age_groups[${index}].customer.base_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`gold.age_groups[${index}].customer.base_price`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Customer Price Per Day</label>
                              <Field
                                type='text'
                                name={`gold.age_groups[${index}].customer.price_per_day`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`gold.age_groups[${index}].customer.price_per_day`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Customer Actual Price</label>
                              <Field
                                type='text'
                                name={`gold.age_groups[${index}].customer.actual_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`gold.age_groups[${index}].customer.actual_price`} />
                              </div>
                            </div>
                            <hr className="ahr" />
                            <div className='mb-3 d-flex flex-column gap-2'>
                              <label className='form-label required'>Benefits</label>
                              {Array.from({ length: 3 }).map((_, benefitIndex) => (
                                <div key={benefitIndex}>
                                  <Field
                                    type='text'
                                    name={`gold.age_groups[${index}].benefits[${benefitIndex}]`}
                                    className='form-control'
                                    style={inputStyle1}
                                  />
                                  <div className='text-danger'>
                                    <ErrorMessage name={`gold.age_groups[${index}].benefits[${benefitIndex}]`} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>

            <div className='w-100 d-flex flex-column'>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Silver Plan</Accordion.Header>
                  <Accordion.Body>
                    <div className='mb-3'>
                      <label className='form-label required'>Plan Name</label>
                      <Field
                        type='text'
                        name="silver.plan_name"
                        className='form-control'
                        style={inputStyle1}
                      />
                      <div className='text-danger'>
                        <ErrorMessage name="silver.plan_name" />
                      </div>
                    </div>

                    <div className='d-flex w-100 gap-3 mb-5'>
                      <div className='w-50'>
                        <label className='form-label fs-5 required'>Base Price</label>
                        <Field
                          type='text'
                          name='silver.base_price'
                          className='form-control form-control-lg form-control-solid'
                          style={inputStyle1}
                        />
                        <div className='text-danger mt-2'>
                          <ErrorMessage name='silver.base_price' />
                        </div>
                      </div>
                      <div className='w-50'>
                        <label className='form-label fs-5 required'>Insurance Cost</label>
                        <Field
                          type='text'
                          name='silver.actual_price'
                          className='form-control form-control-lg form-control-solid'
                          style={inputStyle1}
                        />
                        <div className='text-danger mt-2'>
                          <ErrorMessage name='silver.actual_price' />
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between">
                      {['3 mths–50 yrs', '50 yrs, 1 day–60 yrs', '60 yrs, 1 day–70 yrs'].map((ageGroup, index) => (
                        <div key={index} className="card flex-fill mx-2">
                          <div className="card-body">
                            <h3 className="card-title">{ageGroup}</h3>
                            <div className='mb-3'>
                              <label className='form-label required'>Description</label>
                              <Field
                                as='textarea'
                                name={`silver.age_groups[${index}].description`}
                                className='form-control'
                                style={inputStyle1}
                                rows={2}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`silver.age_groups[${index}].description`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Partner Base Price</label>
                              <Field
                                type='text'
                                name={`silver.age_groups[${index}].partner.base_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`silver.age_groups[${index}].partner.base_price`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Partner Price Per Day</label>
                              <Field
                                type='text'
                                name={`silver.age_groups[${index}].partner.price_per_day`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`silver.age_groups[${index}].partner.price_per_day`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Partner Actual Price</label>
                              <Field
                                type='text'
                                name={`silver.age_groups[${index}].partner.actual_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`silver.age_groups[${index}].partner.actual_price`} />
                              </div>
                            </div>
                            <hr className="ahr" />
                            <div className='mb-3'>
                              <label className='form-label required'>Retailer Base Price</label>
                              <Field
                                type='text'
                                name={`silver.age_groups[${index}].retailer.base_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`silver.age_groups[${index}].retailer.base_price`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Retailer Price Per Day</label>
                              <Field
                                type='text'
                                name={`silver.age_groups[${index}].retailer.price_per_day`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`silver.age_groups[${index}].retailer.price_per_day`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Retailer Actual Price</label>
                              <Field
                                type='text'
                                name={`silver.age_groups[${index}].retailer.actual_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`silver.age_groups[${index}].retailer.actual_price`} />
                              </div>
                            </div>
                            <hr className="ahr" />
                            <div className='mb-3'>
                              <label className='form-label required'>Customer Base Price</label>
                              <Field
                                type='text'
                                name={`silver.age_groups[${index}].customer.base_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`silver.age_groups[${index}].customer.base_price`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Customer Price Per Day</label>
                              <Field
                                type='text'
                                name={`silver.age_groups[${index}].customer.price_per_day`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`silver.age_groups[${index}].customer.price_per_day`} />
                              </div>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label required'>Customer Actual Price</label>
                              <Field
                                type='text'
                                name={`silver.age_groups[${index}].customer.actual_price`}
                                className='form-control'
                                style={inputStyle1}
                              />
                              <div className='text-danger'>
                                <ErrorMessage name={`silver.age_groups[${index}].customer.actual_price`} />
                              </div>
                            </div>
                            <hr className="ahr" />
                            <div className='mb-3 d-flex flex-column gap-2'>
                              <label className='form-label required'>Benefits</label>
                              {Array.from({ length: 3 }).map((_, benefitIndex) => (
                                <div key={benefitIndex}>
                                  <Field
                                    type='text'
                                    name={`silver.age_groups[${index}].benefits[${benefitIndex}]`}
                                    className='form-control'
                                    style={inputStyle1}
                                  />
                                  <div className='text-danger'>
                                    <ErrorMessage name={`silver.age_groups[${index}].benefits[${benefitIndex}]`} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>

            <div className='w-100 d-flex justify-content-end my-5'>
              <button type='submit' className='btn btn-success'>
                Submit
              </button>
            </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddInsurance;
