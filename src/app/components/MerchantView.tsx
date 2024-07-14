import { useEffect, useState, useRef, ChangeEvent } from 'react'
import { ErrorMessage, Field, Form, Formik, FormikValues } from 'formik'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../helpers/axiosInstance'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ICreateAccount, inits } from '../modules/wizards/components/CreateAccountWizardHelper'
import { CloseOutlined } from '@mui/icons-material'
import toast, { Toaster } from 'react-hot-toast';
function MerchantView({ viewApplication }) {
  const [initValues] = useState<ICreateAccount>(inits)
  const isApiIssued = viewApplication.issued_api && viewApplication.issued_api.length > 0;
  const isApiAlreadyIssued = isApiIssued;

  const [formData, setFormData] = useState({
    merchant_id: viewApplication._id,
    merchant_address_one_line: viewApplication.merchant_address_one_line,
    merchant_address_second_line: viewApplication.merchant_address_second_line,
    merchant_company_name: viewApplication.merchant_company_name,
    merchant_country: viewApplication.merchant_country,
    merchant_gst_no: viewApplication.merchant_gst_no,
    merchant_name: viewApplication.merchant_name,
    merchant_pan_no: viewApplication.merchant_pan_no,
    merchant_phone_number: viewApplication.merchant_phone_number,
    merchant_state: viewApplication.merchant_state,
    merchant_zip_code: viewApplication.merchant_zip_code,
    wallet_balance: viewApplication.wallet_balance,
    merchant_profile_photo: viewApplication.merchant_profile_photo,
    merchant_pan_photo: viewApplication.merchant_pan_photo
  })
  const [loading, setLoading] = useState(false);
  const handleSaveClick = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch('/backend/super_admin/update_merchant_user', formData);
  
      if (response.status === 200) {
        toast.success(response.data.msg, {
          position: 'top-center',
        });
        setTimeout(() => {
          window.location.reload();
        }, 2500);
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

  const handleFieldChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value })
  }

  const handleButtonClick = async (apiType) => {
    try {
        setLoading(true);
        const response = await axiosInstance.post('/backend/merchant/issue_api', {
            merchant_id: formData.merchant_id,
            api_type: apiType,
        });

        if (response.status === 200) {
            toast.success(response.data.msg, {
                position: 'top-center',
            });
            window.location.href = '/superadmin/issueApi';
        } else {
            toast.error(response.data.msg, {
                position: 'top-center',
            });
        }
    } catch (error) {
        console.error('API error:', error);
    } finally {
        setLoading(false);
    }
};



  const inputStyle = {
    border: '1.5px solid #d3d3d3', // Border width and color
    borderRadius: '15px', // Border radius
    padding: '10px',
    paddingLeft: '20px', // Padding
    width: '90%', // 100% width
    boxSizing: 'border-box', // Include padding and border in the width calculation
  }

  const inputStyle1 = {
    border: '1.5px solid #d3d3d3', // Border width and color
    borderRadius: '15px', // Border radius
    padding: '10px',
    paddingLeft: '20px', // Padding
    width: '95%', // 100% width
    boxSizing: 'border-box', // Include padding and border in the width calculation
  }
  return (
    <div
      className='py-10 px-20'>
        <Toaster />
      <div className='d-flex ' style={{ width: '100%' }}>

        <div style={{ width: '40%', marginTop: 70 }}>
          <h6>Profile Photo</h6>
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
            {/* <div
              style={{
                justifyContent: 'flex-end',
                position: 'absolute',
                backgroundColor: 'white',
                padding: '7',
                borderRadius: '50',
                cursor: 'pointer',
              }}
            ></div> */}
            <img
              src={viewApplication.merchant_profile_photo}
              alt='Uploaded Image'
              style={{ maxWidth: '100%', maxHeight: '100%', }}
            />
          </div>
        </div>
        <div
          className='d-flex flex-row-fluid flex-center bg-body rounded'
          style={{ width: '70%', }}
        >
          <Formik initialValues={formData} onSubmit={() => { }}>
            {() => (
              <Form style={{marginLeft:"50px"}} className='py-20 px-9' noValidate id='kt_create_account_form'>
                <div>
                  <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-5'>
                      <label className='form-label required mx-5'>Merchant Name</label>

                      <Field
                        name='merchant_name'
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
                        name='merchant_company_name'
                        onChange={(e) => handleFieldChange('merchant_company_name', e.target.value)}
                        value={formData.merchant_company_name}
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
                      style={inputStyle1}
                      name='merchant_country'
                      onChange={(e) => handleFieldChange('merchant_country', e.target.value)}
                      value={formData.merchant_country}
                      className='form-control form-control-lg form-control-solid'
                    />
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
                        value={viewApplication.merchant_email_id}
                        name='birthPlace'
                        readOnly
                        className='form-control form-control-lg form-control-solid'
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='birthPlace' />
                      </div>
                    </div>
                    <div className='fv-row mb-5'>
                      <label className='d-flex align-items-center form-label mx-5'>
                        <span className='required'>Contact Number</span>
                      </label>

                      <Field
                        style={inputStyle}
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

        
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className='d-flex ' style={{ width: '100%' }}>
        <div style={{ width: '40%', marginTop: 65 }}>
          <h6>Pan Card Photo</h6>
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
            {/* <div
              style={{
                justifyContent: 'flex-end',
                position: 'absolute',
                backgroundColor: 'white',
                padding: 7,
                borderRadius: 50,
                cursor: 'pointer',
              }}
            ></div> */}
            <img
              src={viewApplication.merchant_pan_photo}
              alt='Uploaded Image'
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
        </div>
        <div style={{ marginLeft: 50 }}>
          <Formik initialValues={initValues} onSubmit={() => { }}>
            {() => (
              <Form className='py-20 px-9' noValidate id='kt_create_account_form'>

                <div className='fv-row mb-10'>
                  <label className='d-flex align-items-center form-label mx-5'>
                    <span className='required'>PAN Number</span>
                  </label>

                  <Field
                    style={{ ...inputStyle1 }}
                    name='merchant_pan_no'
                    value={formData.merchant_pan_no}
                    onChange={(e) => handleFieldChange('merchant_pan_no', e.target.value)}
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='businessDescriptor' />
                  </div>
                </div>

                <div className='fv-row mb-10'>
                  <label className='d-flex align-items-center form-label mx-5'>
                    <span className='required'>GST</span>
                  </label>

                  <Field
                    style={{ ...inputStyle1 }}
                    name='panNo'
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
                      onChange={(e) => handleFieldChange('wallet_balance', e.target.value)}
                      name='birthPlace'
                      className='form-control form-control-lg form-control-solid'
                    />
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='wallet_balance' />
                    </div>
                  </div>
                </div>
                <div className='d-flex'>
                  <div
                    // onClick={handleReviewAndSave}
                    className='mt-10'
                    onClick={handleSaveClick}
                    style={{
                      height: 40,
                      width: 160,
                      border: '1px solid',
                      marginLeft: 50,
                      borderColor: '#696969',
                      borderRadius: 25,
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: '#327113',
                      cursor: 'pointer',
                    }}
                  >
                    {!loading && <h6 className='fs-4' style={{ color: 'white', paddingTop: 7 }}>Save</h6>}
                    {loading && (
                      <span className='indicator-progress' style={{ display: 'flex', alignItems: 'center', color:"#fff" }}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </div>

                  <div
                  className='mt-10'
                  onClick={() => handleButtonClick('Production')}
                  style={{
                    height: 40,
                    width: 160,
                    border: '1px solid',
                    marginLeft: 20,
                    borderColor: '#696969',
                    borderRadius: 25,
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: '#327113',
                    cursor: 'pointer',
                    pointerEvents: loading || isApiIssued ? 'none' : 'auto',
                    opacity: loading || isApiIssued ? 0.6 : 1,
                  }}
                >
                  {!loading && <h6 className='fs-4' style={{ color: 'white', paddingTop: 7 }}>{isApiAlreadyIssued ? 'Already Issued' : 'Issue API'}</h6>}
                {loading && (
                  <span className='indicator-progress' style={{ display: 'flex', alignItems: 'center', color: "#fff" }}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
                </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default MerchantView


