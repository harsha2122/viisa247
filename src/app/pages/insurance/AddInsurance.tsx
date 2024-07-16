import React, { useState } from 'react';
import { Field, Form, Formik, ErrorMessage, FieldArray } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../helpers/axiosInstance';
import Accordion from 'react-bootstrap/Accordion';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme CSS
import 'primereact/resources/primereact.min.css'; // PrimeReact CSS
import 'primeicons/primeicons.css'; // PrimeIcons CSS
interface Country {
  name: string;
  code: string;
}

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
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [fromCountry, setFromCountry] = useState('IN');
  const countries: Country[] = [
    { name: 'Afghanistan', code: 'AF' },
    { name: 'Albania', code: 'AL' },
];


  const countryTemplate = (option: Country) => {
    return (
      <div className="d-flex align-items-center">
        <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px', marginRight:"5px" }} />
        <div>{option.name}</div>
      </div>
    );
  };

  const panelFooterTemplate = () => {
    const length = selectedCountries ? selectedCountries.length : 0;
    return (
      <div className="py-2 px-3">
        <b>{length}</b> item{length > 1 ? 's' : ''} selected.
      </div>
    );
  };

  const initialValues: Plan = {
    platinum: [{ age_group: '', description: '', benefits: [], partner: { base_price: '', price_per_day: '' }, retailer: { base_price: '', price_per_day: '' }, customer: { base_price: '', price_per_day: '' } }],
    gold: [{ age_group: '', description: '', benefits: [], partner: { base_price: '', price_per_day: '' }, retailer: { base_price: '', price_per_day: '' }, customer: { base_price: '', price_per_day: '' } }],
    silver: [{ age_group: '', description: '', benefits: [], partner: { base_price: '', price_per_day: '' }, retailer: { base_price: '', price_per_day: '' }, customer: { base_price: '', price_per_day: '' } }],
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const formData = {
        nationality_code: values.fromCountry,
        country_code: selectedCountries.map(country => country.code),
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
                    onChange={(e: any) => {
                      setFieldValue('fromCountry', e.target.value);
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
                  <label className='form-label fs-5 required'>To Countries</label>
                  <MultiSelect
                    value={selectedCountries}
                    options={countries}
                    onChange={(e: MultiSelectChangeEvent) => setSelectedCountries(e.value)}
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

              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Plan 1</Accordion.Header>
                  <Accordion.Body>
                    {/* Add your plan fields here */}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

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
