import React, { useState } from 'react';
import { Field, ErrorMessage } from 'formik';

const VisaFields = ({ inputStyle, onVisaFieldChange}) => {
  const [visaData, setVisaData] = useState({
    visa_actual_price: '',
    visa_price_b2c: '',
    visa_price_retailer: '',
    visa_price_partner: '',
    visa_provide: '',
    visa_processing_time: '',
    visa_duration: '',
    visa_description: '',
    pan_doc: false,
    letter_doc: false,
    ticket_doc: false,
    itr_doc: false
  });
  

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setVisaData(prevData => ({
      ...prevData,
      [name]: value
    }));
    onVisaFieldChange({
      ...visaData,
      [name]: value
    });
  };

    const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setVisaData(prevData => ({
      ...prevData,
      [name]: checked
    }));
    onVisaFieldChange({
      ...visaData,
      [name]: checked
    });
  };

  return (
    <div className='px-auto d-flex flex-column'>
      <div className='px-auto my-4 w-100 d-flex flex-row flex-wrap'>
        <hr
          style={{
            width: '100%',
            borderTop: '2px dashed #327113',
            borderBottom: '1px solid transparent',
            margin: '10px',
          }}
        />
        <div className='w-50 d-flex flex-column my-5'>
          <label className='form-label fs-5 required'>Visa price</label>
          <Field
            type='number'
            name='visa_actual_price'
            className='form-control form-control-lg form-control-solid'
            style={inputStyle}
            value={visaData.visa_actual_price}
            onChange={handleFieldChange}
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='visa_actual_price' />
          </div>
        </div>
        <div className='w-50 d-flex flex-column my-5'>
          <label className='form-label fs-5 required'>Visa B2C price</label>
          <Field
            type='number'
            name='visa_price_b2c'
            className='form-control form-control-lg form-control-solid'
            style={inputStyle}
            value={visaData.visa_price_b2c}
            onChange={handleFieldChange}
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='visa_price_b2c' />
          </div>
        </div>
        <div className='w-50 d-flex flex-column my-5'>
          <label className='form-label fs-5 required'>Visa Retailer price</label>
          <Field
            type='number'
            name='visa_price_retailer'
            className='form-control form-control-lg form-control-solid'
            style={inputStyle}
            value={visaData.visa_price_retailer}
            onChange={handleFieldChange}
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='visa_price_retailer' />
          </div>
        </div>
        <div className='w-50 d-flex flex-column my-5'>
          <label className='form-label fs-5 required'>Visa Partner price</label>
          <Field
            type='number'
            name='visa_price_partner'
            className='form-control form-control-lg form-control-solid'
            style={inputStyle}
            value={visaData.visa_price_partner}
            onChange={handleFieldChange}
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='visa_price_partner' />
          </div>
        </div>
        <div className='w-50 d-flex flex-column my-5'>
          <label className='form-label fs-5 required'>Visa provider</label>
          <Field
            as='select'
            name='visa_provide'
            className='form-control form-control-lg form-control-solid'
            style={inputStyle}
            value={visaData.visa_provide}
            onChange={handleFieldChange}
          >
            <option value='Visa247'>Visa247</option>
          </Field>
          <div className='text-danger mt-2'>
            <ErrorMessage name='visa_provide' />
          </div>
        </div>
        <div className='w-50 d-flex flex-column my-5'>
          <label className='form-label fs-5 required'>Visa processing time (In Days)</label>
          <Field
            type='number'
            name='visa_processing_time'
            className='form-control form-control-lg form-control-solid'
            style={inputStyle}
            value={visaData.visa_processing_time}
            onChange={handleFieldChange}
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='visa_processing_time' />
          </div>
        </div>
        <div className='w-50 d-flex flex-column my-5'>
          <label className='form-label fs-5 required'>Visa duration (In Days)</label>
          <Field
            type='number'
            name='visa_duration'
            className='form-control form-control-lg form-control-solid'
            style={inputStyle}
            value={visaData.visa_duration}
            onChange={handleFieldChange}
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='visa_duration' />
          </div>
        </div>
      </div>
      <div className='px-auto w-100 d-flex flex-row flex-wrap'>
        <div className='w-50 d-flex flex-column my-5'>
          <label className='form-label fs-5 required'>Visa description</label>
          <Field
            as='textarea'
            name='visa_description'
            className='form-control form-control-lg form-control-solid'
            rows={5}
            style={{ ...inputStyle }}
            value={visaData.visa_description}
            onChange={handleFieldChange}
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='visa_description' />
          </div>
        </div>
        <div className='w-50 d-flex flex-column gap-3 my-5'>
          <label className='form-label fs-5 required'>Documents Required</label>
          <div className='d-flex flex-column gap-3'>
            <div className="form-check">
              <Field
                type='checkbox'
                name='pan_doc'
                id="pan_doc"
                checked={visaData.pan_doc}
                onChange={handleCheckboxChange}
                className="form-check-input"
              />
              <label className="form-check-label mx-3 fs-5" htmlFor="pan_doc">PAN Card</label>
            </div>
            <div className="form-check">
              <Field
                type='checkbox'
                name='letter_doc'
                id="letter_doc"
                checked={visaData.letter_doc}
                onChange={handleCheckboxChange}
                className="form-check-input"
              />
              <label className="form-check-label mx-3 fs-5" htmlFor="letter_doc">Letter</label>
            </div>
            <div className="form-check">
              <Field
                type='checkbox'
                name='ticket_doc'
                id="ticket_doc"
                checked={visaData.ticket_doc}
                onChange={handleCheckboxChange}
                className="form-check-input"
              />
              <label className="form-check-label mx-3 fs-5" htmlFor="ticket_doc">Ticket</label>
            </div>
            <div className="form-check">
              <Field
                type='checkbox'
                name='itr_doc'
                id="itr_doc"
                checked={visaData.itr_doc}
                onChange={handleCheckboxChange}
                className="form-check-input"
              />
              <label className="form-check-label mx-3 fs-5" htmlFor="itr_doc">ITR</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaFields;
