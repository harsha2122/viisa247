import { ProcessedTable } from '../../components/ProcessedTable'
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import { IssueApiTable } from '../../components/IssueApiTable';
import { ICreateAccount, inits } from '../../modules/wizards/components/CreateAccountWizardHelper';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import toast, { Toaster } from 'react-hot-toast';

const inputStyle = {
  border: '1px solid #d3d3d3', // Border width and color
  borderRadius: '10px', // Border radius
  padding: '10px',
  paddingLeft: '20px', // Padding
  width: '90%', // 100% width
  boxSizing: 'border-box', // Include padding and border in the width calculation
}

function ApiSettingWrapper() {
  const [memberStatsData, setMemberStatsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [initValues] = useState<ICreateAccount>(inits)

  const [formData, setFormData] = useState({
    api_percentage: '',
    merchant_percantage: '',
    panel_api_percantage: '',
    flat_rate:'',
    
  })


  const handleFieldChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value })
  }

  const handleSave = async () => {
    setLoading(true);
  
    try {
    const response = await axiosInstance.post('/backend/settings', formData)
    if (response.status == 203) {
      toast.error(response.data.msg, {
        position: 'top-center',
      })
      setLoading(false);
    } else {
      toast.success(response.data.msg, {
        position: 'top-center',
      })
      setLoading(false);
    }
  } catch (error) {
    console.error('API error:', error);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    // Define a function to make the POST request
    const fetchData = async () => {
      setLoading(true);
      try {

        // Make a POST request to your API endpoint
        axiosInstance.get('/backend/fetch_setting')
          .then((response) => {
            const responseData = response.data.data;

            // Update the formData state with the fetched data
            setFormData({
              api_percentage: responseData.api_percentage || '', // Use default value if the response data is missing
              merchant_percantage: responseData.merchant_percantage || '',
              panel_api_percantage: responseData.panel_api_percantage || '',
              flat_rate: responseData.flat_rate || ''
            });
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching Atlys data:', error);
            setLoading(false);
          });


      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []); // The empty dependency array ensures this effect runs once on mount

  return (
    <div>
      <Toaster />
      <div className='w-full' style={{ backgroundColor: '#fff', marginTop:"-80px" }}>

        <div className='px-10 pt-10'>
          <h1 className='text-xl font-bold my-5 mx-auto'>API Setting</h1>
          <hr style={{
            width:"100%",
            border: 0,
            height: "1px",
            backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))"
          }} />
          <Formik initialValues={initValues} onSubmit={() => { }}>
            {() => (
              <Form className='py-5 w-100 d-flex flex-row flex-wrap' noValidate id='kt_create_account_form'>
                <div className='w-50 d-flex flex-column mb-10'>
                  <label className='d-flex align-items-center form-label'>
                    <span className='required'>All Countries</span>
                  </label>
                  <Field
                    as='select'
                    name='fromCountry'
                    className='form-select form-select-md form-select-solid border border-2  border-secondary rounded-4 '
                    style={{ ...inputStyle }}
                  >
                    <option value=''>All Countries</option>
                  </Field>
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='fromCountry' />
                  </div>
                </div>
                <div className='w-50 d-flex flex-column mb-10'>
                  <label className='d-flex align-items-center form-label'>
                    <span className='required'>Admin percentage</span>
                  </label>
                  <Field
                    style={{ ...inputStyle }}
                    onChange={(e) => handleFieldChange('api_percentage', e.target.value)}
                    value={formData.api_percentage}
                    name='api_percentage'
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='api_percentage' />
                  </div>
                </div>
                <div className='w-50 d-flex flex-column mb-10'>
                  <label className='d-flex align-items-center form-label'>
                    <span className='required'>Merchant panel percentage</span>
                  </label>
                  <Field
                    style={{ ...inputStyle }}
                    onChange={(e) => handleFieldChange('merchant_percantage', e.target.value)}
                    name='merchant_percantage'
                    value={formData.merchant_percantage}
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='merchant_percantage' />
                  </div>
                </div>
                <div className='w-50 d-flex flex-column mb-10'>
                  <label className='d-flex align-items-center form-label'>
                    <span className='required'>Partner API percentage</span>
                  </label>
                  <Field
                    style={{ ...inputStyle }}
                    onChange={(e) => handleFieldChange('panel_api_percantage', e.target.value)}
                    name='panel_api_percantage'
                    value={formData.panel_api_percantage}
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='panel_api_percantage' />
                  </div>
                </div>
                <div className='w-50 d-flex flex-column mb-10'>
                  <label className='d-flex align-items-center form-label'>
                    <span className='required'>Flat Rate</span>
                  </label>
                  <Field
                    style={{ ...inputStyle }}
                    onChange={(e) => handleFieldChange('flat_rate', e.target.value)}
                    name='flat_rate'
                    value={formData.flat_rate}
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='flat_rate' />
                  </div>
                </div>
                <div className='d-flex justify-content-center mt-2 w-100'>
                  <button
                    type='submit'
                    className='btn'
                    onClick={handleSave}
                    style={{ background:"#327113"}}
                  >
                    {!loading && <span className='fs-3' style={{ color: 'white'}}>Save</span>}
                    {loading && (
                      <span className='indicator-progress' style={{ display: 'flex', alignItems: 'center', color:"#fff" }}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default ApiSettingWrapper;
