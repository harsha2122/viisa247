import { useEffect, useState, useRef, ChangeEvent } from 'react'
import { KTIcon } from '../../../../_metronic/helpers'
import { ErrorMessage, Field, Form, Formik, FormikValues } from 'formik'
import { ICreateAccount, inits } from './CreateAccountWizardHelper'
import { useNavigate } from 'react-router-dom'
import ClearIcon from '@mui/icons-material/Delete'
import axiosInstance from '../../../helpers/axiosInstance'
import { DatePicker } from 'antd'
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css'
import toast, { Toaster } from 'react-hot-toast'
function PackageApply({ onDataChange}) {
  const [initValues] = useState<ICreateAccount>(inits)
  const passportFrontFileInputRef = useRef<HTMLInputElement | null>(null)
  const passportBackFileInputRef = useRef<HTMLInputElement | null>(null)
  const photoFileInputRef = useRef<HTMLInputElement | null>(null)
  const panFileInputRef = useRef<HTMLInputElement | null>(null)
  const itrFileInputRef = useRef<HTMLInputElement | null>(null)
  const [passportFrontImageURL, setPassportFrontImageURL] = useState('')
  const [passportBackImageURL, setPassportBackImageURL] = useState('')
  const [photo, setPhoto] = useState('')
  const [loading, setLoading] = useState(false);
  const maxSize = 1024 * 1024; 

  const [formData, setFormData] = useState({
    name: '',
    email:'',
    phone:'' ,
    passFrontPhoto: '',
    passBackPhoto: '',
    travelerPhoto: '',
    reciept:'',
  })

  const inputStyle = {
    border: '1px solid #d3d3d3',
    borderRadius: '10px',
    padding: '10px',
    paddingLeft: '20px',
    width: '90%',
    boxSizing: 'border-box',
  };
  const handleFileUpload = async (file) => {
    try {
      setLoading(true);

      const formData = new FormData()
      formData.append('file', file)
      const response = await axiosInstance.post('/backend/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const fileUrl = response.data.url

      setLoading(false);

      return fileUrl 
    } catch (error) {
      console.error('Error uploading file:', error)
      setLoading(false);
      return ''
    }
  }
  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
      const reader = new FileReader()
      reader.onload = async (e) => {
        if (e.target) {
          setPassportFrontImageURL(e.target.result as string)

          try {
            const imageLink = await handleFileUpload(file)
            setFormData({ ...formData, passFrontPhoto: imageLink })
            onDataChange({ ...formData, passFrontPhoto: imageLink })
          } catch (error) {
            console.error('Error uploading image:', error)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = () => {
    if (passportFrontFileInputRef.current) {
      passportFrontFileInputRef.current.click()
    }
  }
  const handleFileSelectBack = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
      const reader = new FileReader()

      reader.onload = async (e) => {
        if (e.target) {
          setPassportBackImageURL(e.target.result as string)
          try {
            const imageLink = await handleFileUpload(file)
            setFormData({ ...formData, passBackPhoto: imageLink })
            onDataChange({ ...formData, passBackPhoto: imageLink })
          } catch (error) {
            console.error('Error uploading image:', error)
          }
        }
      }

      reader.readAsDataURL(file)
    }
  }
  const handleImageUploadBack = () => {
    if (passportBackFileInputRef.current) {
      passportBackFileInputRef.current.click()
    }
  }

  const handlePhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
      const reader = new FileReader()

      reader.onload = async (e) => {
        if (e.target) {
          setPhoto(e.target.result as string)
          try {
            const imageLink = await handleFileUpload(file)
            setFormData({ ...formData, travelerPhoto: imageLink })
            onDataChange({ ...formData, travelerPhoto: imageLink })
          } catch (error) {
            console.error('Error uploading image:', error)
          }
        }
      }

      reader.readAsDataURL(file)
    }
  }
  const handlePhotoUpload = () => {
    if (photoFileInputRef.current) {
      photoFileInputRef.current.click()
    }
  }


  const handleFieldChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value })
    onDataChange({ ...formData, [fieldName]: value })
  }

  return (
    <div
    ><Toaster />
      <hr
        style={{
            width: '90%',
            borderTop: '2px dashed #327113',
            borderBottom: '1px solid transparent',
            margin: '10px',
        }}
    />
    <div className='d-flex w-100'>
        <div style={{ width: '45%', marginTop:"30px"}}>
        <h6>Passport Front Page Image</h6>
        {loading ? (
        <div style={{color:"#000"}}>Loading...</div>
        ) : (passportFrontImageURL ? (
            <div
            style={{
                border: '4px dotted gray',
                width:"90%",
                height: 200,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
            }}
            >
            <div
                onClick={() => setPassportFrontImageURL('')}
                style={{
                justifyContent: 'flex-end',
                position: 'relative',
                backgroundColor: 'white',
                padding: 7,
                borderRadius: 50,
                left: "10px",
                width:"35px",
                zIndex:"1",
                cursor: 'pointer',
                }}
            >
                <ClearIcon style={{ color: 'red' }} />
            </div>
            <img
                src={passportFrontImageURL}
                alt='Uploaded Image'
                style={{ maxWidth: '100%', maxHeight: '100%', position:"relative", marginTop:"-35px" }}
            />
            </div>
        ) : (
            <div
            style={{
                border: '4px dotted gray',
                width:"90%",
                height: 200,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
            }}
            >
            <h4 className='mx-10 mt-10'>Passport Front Photo</h4>
            <button
                type='button'
                onClick={handleImageUpload}
                className='btn btn-lg btn-success me-3 mt-7'
                style={{ justifyContent: 'flex-end', backgroundColor: '#327113' }}
            >
                <span className='indicator-label'>Select Files</span>
            </button>
            <p className='text-bold pt-5 fs-9' style={{ color: '#555555' }}>
                Supports Image only.
            </p>
            <input
                type='file'
                ref={passportFrontFileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileSelect}
            />
            </div>
        )
        )}
        </div>
        <div style={{ width: '45%', marginLeft:"25px", marginTop:"30px"}}>
        <h6>Passport Back Page Image</h6>
        {loading ? (
        <div style={{color:"#000"}}>Loading...</div>
        ) : (passportBackImageURL ? (
            <div
            style={{
                border: '4px dotted gray',
                width:"90%",
                height: 200,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
            }}
            >
            <div
                onClick={() => setPassportBackImageURL('')}
                style={{
                justifyContent: 'flex-end',
                position: 'relative',
                backgroundColor: 'white',
                padding: 7,
                borderRadius: 50,
                left: "10px",
                width:"35px",
                zIndex:"1",
                cursor: 'pointer',
                }}
            >
                <ClearIcon style={{ color: 'red' }} />
            </div>
            <img
                src={passportBackImageURL}
                alt='Uploaded Image'
                style={{ maxWidth: '100%', maxHeight: '100%', position:"relative", marginTop:"-35px" }}
            />
            </div>
        ) : (
            <div
            style={{
                border: '4px dotted gray',
                width:"90%",
                height: 200,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
            }}
            >
            <h4 className='mx-10 mt-10'>Passport Back Photo</h4>
            <button
                type='button'
                onClick={handleImageUploadBack}
                className='btn btn-lg btn-success me-3 mt-7'
                style={{ justifyContent: 'flex-end', backgroundColor: '#327113' }}
            >
                <span className='indicator-label'>Select Files</span>
            </button>
            <p className='text-bold pt-5 fs-9' style={{ color: '#555555' }}>
              Supports Image Only.
            </p>
            <input
                type='file'
                ref={passportBackFileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileSelectBack}
            />
            </div>
        )
        )}
        </div>
        <div style={{ width: '45%', marginLeft:"25px", marginTop:"30px"}}>
        <h6>Photo</h6>
        {loading ? (
        <div style={{color:"#000"}}>Loading...</div>
        ) : (photo ? (
            <div
            style={{
                border: '4px dotted gray',
                width:"90%",
                height: 200,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
            }}
            >
            <div
                onClick={() => setPhoto('')}
                style={{
                justifyContent: 'flex-end',
                position: 'relative',
                backgroundColor: 'white',
                padding: 7,
                borderRadius: 50,
                left: "10px",
                width:"35px",
                zIndex:"1",
                cursor: 'pointer',
                }}
            >
                <ClearIcon style={{ color: 'red' }} />
            </div>
            <img src={photo} alt='Uploaded Image' style={{ maxWidth: '100%', maxHeight: '100%', position:"relative", marginTop:"-35px" }} />
            </div>
        ) : (
            <div
            style={{
                border: '4px dotted gray',
                width:"90%",
                height: 200,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
            }}
            >
            <h4 className='mx-10 mt-10'>Traveller Photo</h4>
            <button
                type='button'
                onClick={handlePhotoUpload}
                className='btn btn-lg btn-success me-3 mt-7'
                style={{ justifyContent: 'flex-end', backgroundColor: '#327113' }}
            >
                <span className='indicator-label'>Select Files</span>
            </button>
            <p className='text-bold pt-5 fs-9' style={{ color: '#555555' }}>
                Supports Image only.
            </p>
            <input
                type='file'
                ref={photoFileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handlePhotoSelect}
            />
            </div>
        )
        )}
        </div>
    </div>
    <div className='d-flex w-100 flex-wrap'>
        <div className='w-50 d-flex flex-column mt-12'>
            <label className='form-label fs-5 required'>Name</label>
            <Field
                type='text'
                name='name'
                className='form-control form-control-lg form-control-solid'
                style={inputStyle}
                onChange={(e) => handleFieldChange('name', e.target.value)}
            />
            <div className='text-danger mt-2'>
                <ErrorMessage name='name' />
            </div>
        </div>
        <div className='w-50 d-flex flex-column mt-12'>
            <label className='form-label fs-5 required'>Email</label>
            <Field
                type='text'
                name='email'
                className='form-control form-control-lg form-control-solid'
                style={inputStyle}
                onChange={(e) => handleFieldChange('email', e.target.value)}
            />
            <div className='text-danger mt-2'>
                <ErrorMessage name='email' />
            </div>
        </div>
        <div className='w-50 d-flex flex-column my-5'>
            <label className='form-label fs-5 required'>Phone</label>
            <Field
                type='tel'
                name='phone'
                className='form-control form-control-lg form-control-solid'
                style={inputStyle}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
            />
            <div className='text-danger mt-2'>
                <ErrorMessage name='phone' />
            </div>
        </div>
    </div>
    </div>
  )
}

export default PackageApply
