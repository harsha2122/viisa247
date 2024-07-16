import { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function HotelFormView({ viewApplication }) {
  const inputStyle = {
    border: '1.5px solid #d3d3d3',
    borderRadius: '10px', 
    padding: '10px',
    paddingLeft: '20px', 
    width: '90%', 
    boxSizing: 'border-box', 
  };

  const handleDownload = (url) => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      const filename = url.substring(url.lastIndexOf('/') + 1);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className='py-10 px-20'>
      <h5 className='mx-auto' style={{ fontSize: 30, letterSpacing: 0.3 }}>Traveller 1</h5>
      <hr style={{
        width: "70%",
        border: 0,
        height: "1px",
        backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))"
      }} />
      <br />
      <h3>Uploaded Traveler's Data</h3>
      <br />
      <div className='d-flex' style={{ width: '100%' }}>
        <div style={{ width: '40%', marginTop: 70 }}>
          <h6>Passport Front Page Image</h6>
          <div style={{
            border: '4px dotted gray',
            width: '100%',
            height: 300,
            borderRadius: '10px',
            justifyContent: 'center',
            textAlign: 'center',
            marginTop: 20,
          }}>
            <img
              src={viewApplication.receipt_url || 'placeholder.jpg'} // Placeholder image
              alt='Uploaded Image'
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
          <button
            onClick={() => handleDownload(viewApplication.receipt_url)}
            style={{
              position: 'relative',
              color: '#fff',
              border: 'none',
              backgroundColor: '#327113',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginTop: "20px"
            }}
          >
            Download Passport Front
          </button>
        </div>

        <div className='d-flex flex-row-fluid flex-center bg-body rounded' style={{ width: '70%', backgroundColor: 'blue' }}>
          <Formik initialValues={viewApplication} onSubmit={() => {}}>
            {() => (
              <Form className='py-20 px-9' noValidate id='kt_create_account_form'>
                <div>
                <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-5'>
                      <label className='form-label required'>From</label>
                      <Field
                        name='firstName'
                        readOnly
                        value={viewApplication.nationality_code}
                        style={inputStyle}
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='firstName' />
                      </div>
                    </div>

                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>To</span>
                      </label>
                      <Field
                        style={inputStyle}
                        name='lastName'
                        readOnly
                        value={viewApplication.country_code}
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='lastName' />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-5'>
                      <label className='form-label required'>First Name</label>
                      <Field
                        name='firstName'
                        readOnly
                        value={viewApplication.first_name}
                        style={inputStyle}
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='firstName' />
                      </div>
                    </div>

                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Contact</span>
                      </label>
                      <Field
                        style={inputStyle}
                        name='lastName'
                        readOnly
                        value={viewApplication.customer_email_id || viewApplication.merchant_email_id}
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='lastName' />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Merchant hotel Amount</span>
                      </label>
                      <Field
                        style={inputStyle}
                        readOnly
                        value={viewApplication.merchant_hotel_amount}
                        name='birthPlace'
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='birthPlace' />
                      </div>
                    </div>

                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Original Amount</span>
                      </label>
                      <Field
                        style={inputStyle}
                        readOnly
                        value={viewApplication.hotel_original_amount}
                        name='birthPlace'
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='birthPlace' />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Hotel Status</span>
                      </label>
                      <Field
                        style={inputStyle}
                        readOnly
                        value={viewApplication.hotel_status}
                        name='hotelStatus'
                        className='form-control form-control-lg form-control-solid'
                      />
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default HotelFormView;
