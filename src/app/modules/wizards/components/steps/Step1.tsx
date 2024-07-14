/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useState } from 'react'
import { KTIcon } from '../../../../../_metronic/helpers'
import { ErrorMessage, Field } from 'formik'
interface Step1Props {
  setFormDataStep1: (data: any) => void; // Callback prop to set data in Vertical
}

const inputStyle ={
  border: '1.5px solid #d3d3d3',    // Border width and color
  borderRadius: '15px',         // Border radius
  padding: '10px',        
  paddingLeft:'20px',             // Padding
  width: '90%',               // 100% width
  boxSizing: 'border-box',     // Include padding and border in the width calculation
}
const Step1: FC<Step1Props> = ({ setFormDataStep1 }) => {
  const [imageURL, setImageURL] = useState('') // State variable to hold the image URL

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = (e: any) => {
        // Update the state variable with the image data (base64-encoded)
        setImageURL(e.target.result)
      }

      reader.readAsDataURL(file)
    }
  }

  // Function to save data to the form and set formDataStep1
  const handleNext = () => {
    const updatedFormData = {
      // first_name: formik.values.first_name,
      // last_name: formik.values.last_name,
      // birth_place: formik.values.birth_place,
      // birth_detail: formik.values.birth_detail,
      // gender: formik.values.gender,
      // marital_status: formik.values.marital_status,
      // father_name: formik.values.accountName,
      // panUri: formData.panUri,
      // photoUri: formData.photoUri
      // Add other fields here...
    };
    // Collect data from the form fields


    // Set formDataStep1
    setFormDataStep1(updatedFormData);

    // Move to the next step
    // formik.submitForm();
  };
  return (
    <div className='d-flex flex-row' style={{width:'100%'}} >
      {/* <div >
        {imageURL ? (
          <div
            className='d-flex flex-column p-5'

          >
            <label>Pancard Image</label>
            <img
              src={imageURL}
              alt='Uploaded Image'
              style={{ maxWidth: '100%', maxHeight: '200px' }}
            />
          </div>
        )
      :
      <div className='w-100' style={{ border: '4px dotted gray', width:100,height:100, borderRadius: '10px', marginTop: '5%' }}>
        </div>
      }
      </div> */}
      <div>
        <div className='d-flex' style={{justifyContent:'space-between'}}>
        <div className='fv-row mb-10'>
          <label className='form-label required'>First Name</label>

          <Field name='businessName' style={inputStyle} className='form-control form-control-lg form-control-solid'  />
          <div className='text-danger mt-2'>
            <ErrorMessage name='businessName' />
          </div>
        </div>
        <div className='fv-row mb-10'>
          <label className='d-flex align-items-center form-label'>
            <span className='required'>Last Name</span>
          </label>

          <Field
          style={inputStyle}
            name='businessDescriptor'
            className='form-control form-control-lg form-control-solid'
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='businessDescriptor' />
          </div>
        </div>
        </div>
        
        <div className='d-flex' style={{justifyContent:'space-between'}}>
        <div className='fv-row mb-10'>
          <label className='d-flex align-items-center form-label'>
            <span className='required'>Birth Place</span>
          </label>

          <Field
          style={inputStyle}
            name='businessDescriptor'
            className='form-control form-control-lg form-control-solid'
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='businessDescriptor' />
          </div>
        </div>
        <div className='fv-row mb-10'>
          <label className='d-flex align-items-center form-label'>
            <span className='required'>Birth Detail</span>
          </label>

          <Field
          style={inputStyle}
            name='businessDescriptor'
            className='form-control form-control-lg form-control-solid'
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='businessDescriptor' />
          </div>
        </div>
        </div>
        
        <div className='d-flex' style={{justifyContent:'space-between'}}>
        <div className='fv-row mb-10'>
          <label className='form-label required'>Gender</label>

          <Field
            as='select'
            name='businessType'
            style={{width:215}}
            className='form-select form-select-lg form-select-solid'
          >
            <option></option>
            <option value='1'>Male</option>
            <option value='1'>Female</option>
            <option value='2'>Others</option>
          </Field>
          <div className='text-danger mt-2'>
            <ErrorMessage name='businessType' />
          </div>
        </div>
        <div className='fv-row mb-10'>
          <label className='form-label required'>Marital Status</label>

          <Field
            as='select'
            style={{width:215}}
            name='businessType'
            className='form-select form-select-lg form-select-solid'
          >
            <option></option>
            <option value='1'>Yes</option>
            <option value='1'>No</option>
          </Field>
          <div className='text-danger mt-2'>
            <ErrorMessage name='businessType' />
          </div>
        </div>
        </div>
        <div className='fv-row mb-10'>
          <label className='d-flex align-items-center form-label'>
            <span className='required'>Father Name</span>
          </label>

          <Field
          style={inputStyle}
            name='businessDescriptor'
            className='form-control form-control-lg form-control-solid'
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='businessDescriptor' />
          </div>
        </div>
      </div>
    </div>
  )
}

export { Step1 }

