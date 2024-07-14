import React, { useEffect, useState } from 'react'
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import { IProfileDetails, profileDetailsInitValues as initialValues } from '../SettingsModel'
import * as Yup from 'yup'
import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik'
import axiosInstance from '../../../../../helpers/axiosInstance'
import Cookies from 'js-cookie'
import { DatePicker } from 'antd'
import toast, { Toaster } from 'react-hot-toast';

const profileDetailsSchema = Yup.object().shape({
  fName: Yup.string().required('First name is required'),
  lName: Yup.string().required('Last name is required'),
  company: Yup.string().required('Company name is required'),
  contactPhone: Yup.string().required('Contact phone is required'),
  companySite: Yup.string().required('Company site is required'),
  country: Yup.string().required('Country is required'),
  language: Yup.string().required('Language is required'),
  timeZone: Yup.string().required('Time zone is required'),
  currency: Yup.string().required('Currency is required'),
})
const inputStyle = {
  border: '2px solid #d3d3d3', // Border width and color
  borderRadius: '10px', // Border radius
  padding: '10px',
  paddingLeft: '20px', // Padding
  width: 380, // 100% width
  boxSizing: 'border-box',
  backgroundColor: 'white', // Include padding and border in the width calculation
}

const ProfileDetails: React.FC = () => {
  const [data, setData] = useState<IProfileDetails>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IProfileDetails>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user_id = Cookies.get('user_id')
  const [formData, setFormData] = useState({
    super_admin_id: user_id,
    super_admin_name: '',
    super_admin_email: '',
    super_admin_phone_number:"",
    super_admin_profile_photo:"",
    created_at:''
  });

  useEffect(() => {
    fetchData();
  }, [])
  const fetchData = async () => {
    try {
      const user_id = Cookies.get('user_id')

      // Make a POST request to your API endpoint
      axiosInstance.post('/backend/fetch_super_admin', {
        id: user_id
      })
        .then((response) => {
          const responseData = response.data.data;
          setFormData(responseData[0])
          // Update the formData state with the fetched data

        })
        .catch((error) => {
          console.error('Error fetching VISA 247 data:', error);
        });


    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value })

  }

  const handleSaveClick = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post('/backend/update_super_admin', formData)
    if (response.status == 200) {
      toast.success(response.data.msg, {
        position: 'top-center',
      })
      setLoading(false);
    } else {
      toast.error(response.data.msg, {
        position: 'top-center',
      })
      setLoading(false);
    }
      } catch (error) {
      toast.error('Something went wrong', {
        position: 'top-center',
      })
      setLoading(false);
      }
    
  }
  const [loading, setLoading] = useState(false)
  const formik = useFormik<IProfileDetails>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        values.communications.email = data.communications.email
        values.communications.phone = data.communications.phone
        values.allowMarketing = data.allowMarketing
        const updatedData = Object.assign(data, values)
        setData(updatedData)
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <div style={{marginTop:"-100px", boxShadow:"none"}} className='card mb-5 mb-xl-10'>
      <Toaster />
      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={()=>{}} noValidate className='form'>
          <div className='card-body p-9'>
            {/* <div className='col mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Profile Picture</label>
              <div className='col-lg-8'>
                <div
                  className='image-input image-input-outline'
                  data-kt-image-input='true'
                  style={{ backgroundImage: `url(${toAbsoluteUrl('/media/avatars/blank.png')})` }}
                >
                  <div
                    className='image-input-wrapper w-200px h-200px'
                    style={{ backgroundImage: `url(${formData.super_admin_profile_photo})`, backgroundSize:"contain" }}
                  ></div>
                </div>
              </div>
            </div> */}

           
          <Formik initialValues={initialValues} onSubmit={() => { }}>
            {() => (
              <Form className='py-4 px-9' noValidate id='kt_create_account_form'>
                <div className='d-flex flex-column flex-wrap justify-between'>
                  <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-5'>
                      <label style={{marginLeft:"10px"}} className='form-label required'>Name</label>

                      <Field
                        name='super_admin_name'
                        style={inputStyle}
                        value={formData.super_admin_name}
                        className='form-control form-control-lg form-control-solid'
                        onChange={(e) => handleFieldChange('super_admin_name', e.target.value)}
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='businessName' />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-5'>
                      <label style={{marginLeft:"10px"}} className='form-label required'>Email</label>

                      <Field
                        name='super_admin_email'
                        style={inputStyle}
                        readOnly
                        value={formData.super_admin_email}
                        className='form-control form-control-lg form-control-solid'
                        onChange={(e) => handleFieldChange('super_admin_email', e.target.value)}
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='businessName' />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                    <div className='fv-row mb-5'>
                      <label style={{marginLeft:"10px"}} className='form-label required'>Contact</label>

                      <Field
                        name='super_admin_phone_number'
                        style={inputStyle}
                        value={formData.super_admin_phone_number}
                        className='form-control form-control-lg form-control-solid'
                        onChange={(e) => handleFieldChange('super_admin_phone_number', e.target.value)}
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='businessName' />
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button style={{backgroundColor:"#327113"}} onClick={handleSaveClick} className='btn btn-success' disabled={loading}>
              {!loading && 'Save Changes'}
              {loading && (
                <span className='indicator-progress' style={{ display: 'block' }}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export { ProfileDetails }
