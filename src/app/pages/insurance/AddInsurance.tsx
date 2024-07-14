import React, { useState } from 'react';
import { Field, Form, Formik, ErrorMessage, FieldArray } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../helpers/axiosInstance';

interface Price {
  base_price: string;
  price_per_day: string;
}

interface AgeGroup {
  age_group: string;
  description: string;
  benefits: { key: string; value: string }[];
  partner: Price;
  retailer: Price;
  customer: Price;
}

interface Plan {
  platinum: AgeGroup[];
  gold: AgeGroup[];
  silver: AgeGroup[];
}

const inputStyle = {
  border: '1px solid #d3d3d3',
  borderRadius: '10px',
  padding: '10px',
  paddingLeft: '20px',
  width: '90%',
  boxSizing: 'border-box',
};

const inputStyle1 = {
  border: '1px solid #d3d3d3',
  borderRadius: '10px',
  padding: '10px',
  paddingLeft: '20px',
  width: '100%',
  boxSizing: 'border-box',
};

const AddInsurance = () => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [fromCountry, setFromCountry] = useState('IN');

  const initialValues: Plan = {
    platinum: [{ age_group: '', description: '',  benefits: [], partner: { base_price: '', price_per_day: '' }, retailer: { base_price: '', price_per_day: '' }, customer: { base_price: '', price_per_day: '' } }],
    gold: [{ age_group: '', description: '', benefits: [], partner: { base_price: '', price_per_day: '' }, retailer: { base_price: '', price_per_day: '' }, customer: { base_price: '', price_per_day: '' } }],
    silver: [{ age_group: '', description: '', benefits: [], partner: { base_price: '', price_per_day: '' }, retailer: { base_price: '', price_per_day: '' }, customer: { base_price: '', price_per_day: '' } }],
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const formData = {
        country_code: values.selectedCountry,
        nationality_code: values.fromCountry,
        insurance_description: values.insurance_description,
        insurance_base_price: values.insurance_base_price,
        insurance_per_day_price: values.insurance_per_day_price,
        plans: {
          platinum: values.platinum,
          gold: values.gold,
          silver: values.silver,
        },
      };

      await axiosInstance.post('/backend/create_insurance', formData);
      resetForm();
      toast.success('Insurance Created successfully!');
      setTimeout(() => {
        window.location.href = '/superadmin/insurance';
    }, 2500);
    } catch (error) {
      console.error('Error submitting insurance data:', error);
      toast.error('Error submitting form. Please try again later.');
    }
  };

  return (
    <div className='px-auto d-flex flex-column'>
      <Toaster />
      <div className='px-auto mb-4 w-100 d-flex flex-column'>
        <h1>Add Insurance's Details</h1>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, handleChange, setFieldValue }) => (
            <Form className='py-12 d-flex flex-wrap px-9' noValidate id='kt_create_account_form'>
              <div className='d-flex gap-3 w-100 flex-nowrap'>
                <div className='w-50 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>From Country</label>
                  <Field
                    as='select'
                    name='fromCountry'
                    className='form-select form-select-lg form-select-solid border border-1 border-secondary rounded-4'
                    style={inputStyle}
                    onChange={(e: any) => {
                      setFieldValue('fromCountry', e.target.value);
                      setFromCountry(e.target.value);
                    }}
                  >
                  <option value=''>Select a Country...</option>
                  <option value='IN'>India</option>
                  </Field>
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='fromCountry' />
                  </div>
                </div>
                <div className='w-50 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>To Country</label>
                  <Field
                    as='select'
                    name='selectedCountry'
                    className='form-select form-select-lg form-select-solid border border-1 border-secondary rounded-4'
                    style={inputStyle}
                    onChange={(e: any) => {
                      setFieldValue('selectedCountry', e.target.value);
                      setSelectedCountry(e.target.value);
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
                    {/* Add more countries as needed */}
                  </Field>
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='selectedCountry' />
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
                  rows={3}
                />
                <div className='text-danger mt-2'>
                  <ErrorMessage name='insurance_description' />
                </div>
              </div>

              <div className='d-flex w-100 gap-3 mb-5'>
                <div className='w-50'>
                  <label className='form-label fs-5 required'>Insurance Base Price</label>
                  <Field
                    type='text'
                    name='insurance_base_price'
                    className='form-control form-control-lg form-control-solid'
                    style={inputStyle1}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='insurance_base_price' />
                  </div>
                </div>
                <div className='w-50'>
                  <label className='form-label fs-5 required'>Insurance price per day</label>
                  <Field
                    type='text'
                    name='insurance_per_day_price'
                    className='form-control form-control-lg form-control-solid'
                    style={inputStyle1}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='insurance_per_day_price' />
                  </div>
                </div>
              </div>
              {/* Platinum Plan */}
              <div className='w-100 border px-10 py-10'>
                <h2>Platinum Plan</h2>
                <FieldArray name='platinum'>
                  {({ push, remove }) => (
                    <div>
                      {values.platinum.map((ageGroup, index) => (
                        <div key={index} className='my-5'>
                          <hr className='ahr' />
                          <div className='d-flex flex-wrap'>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Age Group</label>
                              <Field
                                type='text'
                                name={`platinum[${index}].age_group`}
                                value={ageGroup.age_group}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`platinum[${index}].age_group`} />
                              </div>
                            </div>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Description</label>
                              <Field
                                type='text'
                                name={`platinum[${index}].description`}
                                value={ageGroup.description}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`platinum[${index}].description`} />
                              </div>
                            </div>

                            {/* Partner Prices */}
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Partner Base Price</label>
                              <Field
                                type='text'
                                name={`platinum[${index}].partner.base_price`}
                                value={ageGroup.partner.base_price}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`platinum[${index}].partner.base_price`} />
                              </div>
                            </div>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Partner Price Per Day</label>
                              <Field
                                type='text'
                                name={`platinum[${index}].partner.price_per_day`}
                                value={ageGroup.partner.price_per_day}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`platinum[${index}].partner.price_per_day`} />
                              </div>
                            </div>

                            {/* Retailer Prices */}
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Retailer Base Price</label>
                              <Field
                                type='text'
                                name={`platinum[${index}].retailer.base_price`}
                                value={ageGroup.retailer.base_price}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`platinum[${index}].retailer.base_price`} />
                              </div>
                            </div>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Retailer Price Per Day</label>
                              <Field
                                type='text'
                                name={`platinum[${index}].retailer.price_per_day`}
                                value={ageGroup.retailer.price_per_day}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`platinum[${index}].retailer.price_per_day`} />
                              </div>
                            </div>

                            {/* Customer Prices */}
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Customer Base Price</label>
                              <Field
                                type='text'
                                name={`platinum[${index}].customer.base_price`}
                                value={ageGroup.customer.base_price}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`platinum[${index}].customer.base_price`} />
                              </div>
                            </div>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Customer Price Per Day</label>
                              <Field
                                type='text'
                                name={`platinum[${index}].customer.price_per_day`}
                                value={ageGroup.customer.price_per_day}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`platinum[${index}].customer.price_per_day`} />
                              </div>
                            </div>

                            {/* Benefits */}
                            <div className='w-100 mt-5'>
                              <label className='form-label fs-5 required'>Benefits (Max - 3)</label>
                              <div className='d-flex flex-column gap-3 mt-2'>
                                {[0, 1, 2].map(benefitIndex => (
                                  <div key={benefitIndex} className='d-flex gap-3'>
                                    <Field
                                      type='text'
                                      name={`platinum[${index}].benefits[${benefitIndex}].key`}
                                      value={ageGroup.benefits[benefitIndex]?.key || ''}
                                      onChange={handleChange}
                                      className='form-control form-control-lg form-control-solid'
                                      placeholder='Benefit Name'
                                      style={inputStyle}
                                    />
                                    <Field
                                      type='text'
                                      name={`platinum[${index}].benefits[${benefitIndex}].value`}
                                      value={ageGroup.benefits[benefitIndex]?.value || ''}
                                      onChange={handleChange}
                                      className='form-control form-control-lg form-control-solid'
                                      placeholder='Value'
                                      style={inputStyle}
                                    />
                                    {/* Display error messages if needed */}
                                    <ErrorMessage name={`platinum[${index}].benefits[${benefitIndex}].key`} />
                                    <ErrorMessage name={`platinum[${index}].benefits[${benefitIndex}].value`} />
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                          {index > 0 && (
                            <button
                              type='button'
                              className='btn btn-danger mt-2'
                              onClick={() => remove(index)}
                            >
                              Delete Age Group
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type='button'
                        className='btn btn-primary'
                        onClick={() =>
                          push({
                            age_group: '',
                            description: '',
                            benefits: [],
                            partner: { base_price: '', price_per_day: '' },
                            retailer: { base_price: '', price_per_day: '' },
                            customer: { base_price: '', price_per_day: '' },
                          })
                        }
                      >
                        Add Age Group
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Gold Plan */}
              <div className='w-100 border px-10 py-10'>
                <h2>Gold Plan</h2>
                <FieldArray name='gold'>
                  {({ push, remove }) => (
                    <div>
                      {values.gold.map((ageGroup, index) => (
                        <div key={index} className='my-5'>
                          <hr className='ahr' />
                          <div className='d-flex flex-wrap'>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Age Group</label>
                              <Field
                                type='text'
                                name={`gold[${index}].age_group`}
                                value={ageGroup.age_group}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`gold[${index}].age_group`} />
                              </div>
                            </div>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Description</label>
                              <Field
                                type='text'
                                name={`gold[${index}].description`}
                                value={ageGroup.description}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`gold[${index}].description`} />
                              </div>
                            </div>

                            {/* Partner Prices */}
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Partner Base Price</label>
                              <Field
                                type='text'
                                name={`gold[${index}].partner.base_price`}
                                value={ageGroup.partner.base_price}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`gold[${index}].partner.base_price`} />
                              </div>
                            </div>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Partner Price Per Day</label>
                              <Field
                                type='text'
                                name={`gold[${index}].partner.price_per_day`}
                                value={ageGroup.partner.price_per_day}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`gold[${index}].partner.price_per_day`} />
                              </div>
                            </div>

                            {/* Retailer Prices */}
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Retailer Base Price</label>
                              <Field
                                type='text'
                                name={`gold[${index}].retailer.base_price`}
                                value={ageGroup.retailer.base_price}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`gold[${index}].retailer.base_price`} />
                              </div>
                            </div>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Retailer Price Per Day</label>
                              <Field
                                type='text'
                                name={`gold[${index}].retailer.price_per_day`}
                                value={ageGroup.retailer.price_per_day}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`gold[${index}].retailer.price_per_day`} />
                              </div>
                            </div>

                            {/* Customer Prices */}
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Customer Base Price</label>
                              <Field
                                type='text'
                                name={`gold[${index}].customer.base_price`}
                                value={ageGroup.customer.base_price}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`gold[${index}].customer.base_price`} />
                              </div>
                            </div>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Customer Price Per Day</label>
                              <Field
                                type='text'
                                name={`gold[${index}].customer.price_per_day`}
                                value={ageGroup.customer.price_per_day}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`gold[${index}].customer.price_per_day`} />
                              </div>
                            </div>

                            {/* Benefits */}
                            <div className='w-100 mt-5'>
                              <label className='form-label fs-5 required'>Benefits (Max - 3)</label>
                              <div className='d-flex flex-column gap-3 mt-2'>
                                {[0, 1, 2].map(benefitIndex => (
                                  <div key={benefitIndex} className='d-flex gap-3'>
                                    <Field
                                      type='text'
                                      name={`gold[${index}].benefits[${benefitIndex}].key`}
                                      value={ageGroup.benefits[benefitIndex]?.key || ''}
                                      onChange={handleChange}
                                      className='form-control form-control-lg form-control-solid'
                                      placeholder='Benefit Name'
                                      style={inputStyle}
                                    />
                                    <Field
                                      type='text'
                                      name={`gold[${index}].benefits[${benefitIndex}].value`}
                                      value={ageGroup.benefits[benefitIndex]?.value || ''}
                                      onChange={handleChange}
                                      className='form-control form-control-lg form-control-solid'
                                      placeholder='Value'
                                      style={inputStyle}
                                    />
                                    {/* Display error messages if needed */}
                                    <ErrorMessage name={`gold[${index}].benefits[${benefitIndex}].key`} />
                                    <ErrorMessage name={`gold[${index}].benefits[${benefitIndex}].value`} />
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                          {index > 0 && (
                            <button
                              type='button'
                              className='btn btn-danger mt-2'
                              onClick={() => remove(index)}
                            >
                              Delete Age Group
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type='button'
                        className='btn btn-primary'
                        onClick={() =>
                          push({
                            age_group: '',
                            description: '',
                            benefits: [],
                            partner: { base_price: '', price_per_day: '' },
                            retailer: { base_price: '', price_per_day: '' },
                            customer: { base_price: '', price_per_day: '' },
                          })
                        }
                      >
                        Add Age Group
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Silver Plan */}
              <div className='w-100 border px-10 py-10'>
                <h2>Silver Plan</h2>
                <FieldArray name='silver'>
                  {({ push, remove }) => (
                    <div>
                      {values.silver.map((ageGroup, index) => (
                        <div key={index} className='my-5'>
                          <hr className='ahr' />
                          <div className='d-flex flex-wrap'>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Age Group</label>
                              <Field
                                type='text'
                                name={`silver[${index}].age_group`}
                                value={ageGroup.age_group}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`silver[${index}].age_group`} />
                              </div>
                            </div>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Description</label>
                              <Field
                                type='text'
                                name={`silver[${index}].description`}
                                value={ageGroup.description}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`silver[${index}].description`} />
                              </div>
                            </div>

                            {/* Partner Prices */}
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Partner Base Price</label>
                              <Field
                                type='text'
                                name={`silver[${index}].partner.base_price`}
                                value={ageGroup.partner.base_price}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`silver[${index}].partner.base_price`} />
                              </div>
                            </div>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Partner Price Per Day</label>
                              <Field
                                type='text'
                                name={`silver[${index}].partner.price_per_day`}
                                value={ageGroup.partner.price_per_day}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`silver[${index}].partner.price_per_day`} />
                              </div>
                            </div>

                            {/* Retailer Prices */}
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Retailer Base Price</label>
                              <Field
                                type='text'
                                name={`silver[${index}].retailer.base_price`}
                                value={ageGroup.retailer.base_price}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`silver[${index}].retailer.base_price`} />
                              </div>
                            </div>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Retailer Price Per Day</label>
                              <Field
                                type='text'
                                name={`silver[${index}].retailer.price_per_day`}
                                value={ageGroup.retailer.price_per_day}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`silver[${index}].retailer.price_per_day`} />
                              </div>
                            </div>

                            {/* Customer Prices */}
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Customer Base Price</label>
                              <Field
                                type='text'
                                name={`silver[${index}].customer.base_price`}
                                value={ageGroup.customer.base_price}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`silver[${index}].customer.base_price`} />
                              </div>
                            </div>
                            <div className='w-25'>
                              <label className='form-label fs-5 required'>Customer Price Per Day</label>
                              <Field
                                type='text'
                                name={`silver[${index}].customer.price_per_day`}
                                value={ageGroup.customer.price_per_day}
                                onChange={handleChange}
                                className='form-control form-control-lg form-control-solid'
                                style={inputStyle}
                              />
                              <div className='text-danger mt-2'>
                                <ErrorMessage name={`silver[${index}].customer.price_per_day`} />
                              </div>
                            </div>
                            {/* Benefits */}
                            <div className='w-100 mt-5'>
                              <label className='form-label fs-5 required'>Benefits (Max - 3)</label>
                              <div className='d-flex flex-column gap-3 mt-2'>
                                {[0, 1, 2].map(benefitIndex => (
                                  <div key={benefitIndex} className='d-flex gap-3'>
                                    <Field
                                      type='text'
                                      name={`silver[${index}].benefits[${benefitIndex}].key`}
                                      value={ageGroup.benefits[benefitIndex]?.key || ''}
                                      onChange={handleChange}
                                      className='form-control form-control-lg form-control-solid'
                                      placeholder='Benefit Name'
                                      style={inputStyle}
                                    />
                                    <Field
                                      type='text'
                                      name={`silver[${index}].benefits[${benefitIndex}].value`}
                                      value={ageGroup.benefits[benefitIndex]?.value || ''}
                                      onChange={handleChange}
                                      className='form-control form-control-lg form-control-solid'
                                      placeholder='Value'
                                      style={inputStyle}
                                    />
                                    {/* Display error messages if needed */}
                                    <ErrorMessage name={`silver[${index}].benefits[${benefitIndex}].key`} />
                                    <ErrorMessage name={`silver[${index}].benefits[${benefitIndex}].value`} />
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                          {index > 0 && (
                            <button
                              type='button'
                              className='btn btn-danger mt-2'
                              onClick={() => remove(index)}
                            >
                              Delete Age Group
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type='button'
                        className='btn btn-primary'
                        onClick={() =>
                          push({
                            age_group: '',
                            description: '',
                            benefits: [],
                            partner: { base_price: '', price_per_day: '' },
                            retailer: { base_price: '', price_per_day: '' },
                            customer: { base_price: '', price_per_day: '' },
                          })
                        }
                      >
                        Add Age Group
                      </button>
                    </div>
                  )}
                </FieldArray>
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
