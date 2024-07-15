import { useState, useRef, ChangeEvent } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../../helpers/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';

const validationSchema = Yup.object().shape({
  user_name: Yup.string().required('Name is required'),
  user_email_id: Yup.string().email('Invalid email format').required('Email is required'),
  user_phone_number: Yup.string().required('Contact Number is required'),
  user_profile_photo: Yup.string().required('Profile photo is required'),
});

export function Registration() {
  const [loading, setLoading] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const maxSize = 300 * 1024; // 300KB limit
  const [formData, setFormData] = useState({
    user_name: '',
    user_email_id: '',
    user_phone_number: '',
    user_profile_photo: 'https://visa247.blr1.cdn.digitaloceanspaces.com/kull81d3.png',
  });

  const profilePhotoFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds 300KB limit.', { position: 'top-center' });
        return;
      }

      try {
        const imageLink = await handleFileUpload(file);
        setFormData({ ...formData, user_profile_photo: imageLink });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Error uploading image. Please try again.', { position: 'top-center' });
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post('/backend/upload_image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const fileUrl = response.data.data;
      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleSaveClick = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const response = await axiosInstance.post('/backend/create_normal_user', formData);
      if (response.status === 200) {
        setLoading(false);
        toast.success(response.data.msg, { position: 'top-center' });
        setTimeout(() => {
          window.location.href = '/customer/login';
        }, 400);
      } else {
        setLoading(false);
        toast.error(response.data.msg, { position: 'top-center' });
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errorMessages = error.errors.join(', ');
        toast.error(errorMessages, { position: 'top-center' });
      } else {
        console.error('Error:', error);
        toast.error('An error occurred while submitting the form.', { position: 'top-center' });
      }
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  return (
    <div style={{ maxHeight: '100vh', flex: 1 }}>
      <Toaster />
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
        noValidate
        id='kt_login_signup_form'
        onSubmit={handleSaveClick}
      >
        <div className='text-center mb-11'>
          <h1 className='text-dark fw-bolder mb-3'>Sign Up</h1>
        </div>

        <div className='fv-row mb-5'>
          <label className='form-label fw-bolder text-dark fs-6 required'>Name</label>
          <input
            placeholder='Name'
            type='text'
            value={formData.user_name}
            onChange={(e) => handleFieldChange('user_name', e.target.value)}
            required
            className={clsx('form-control bg-transparent')}
          />
        </div>

        <div className='fv-row mb-5'>
          <label className='form-label fw-bolder text-dark fs-6 required'>Email</label>
          <input
            placeholder='Email'
            type='email'
            value={formData.user_email_id}
            onChange={(e) => handleFieldChange('user_email_id', e.target.value)}
            required
            className={clsx('form-control bg-transparent')}
          />
        </div>

        <div className='fv-row mb-5'>
          <label className='form-label fw-bolder text-dark fs-6 required'>Contact Number</label>
          <div className='input-group'>
            <span style={{lineHeight: '0'}} className='input-group-text'>
              +91
            </span>
            <input
              placeholder='Contact Number'
              type='text'
              required
              autoComplete='off'
              value={formData.user_phone_number}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (/^\d{0,10}$/.test(e.target.value)) {
                  handleFieldChange('user_phone_number', e.target.value)
                }
              }}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault()
                }
              }}
              maxLength={10}
              className={clsx('form-control bg-transparent')}
            />
          </div>
        </div>


        <div className='mb-5'>
          <label className='form-label fw-bolder text-dark required fs-6'>Profile Photo</label>
          <input
            type='file'
            ref={profilePhotoFileInputRef}
            className='form-control'
            id='user_profile_photo'
            name='user_profile_photo'
            accept='image/*'
            onChange={handleFileSelect}
          />
        </div>

        <div className='d-flex flex-stack mx-auto flex-wrap justify-content-start gap-3 mb-5 fs-base fw-semibold my-2'>
          <div className='checkbox-wrapper-12'>
            <div className='cbx'>
              <input
                id='cbx-12'
                type='checkbox'
                checked={isChecked}
                onChange={() => setChecked(!isChecked)}
              />
              <label htmlFor='cbx-12'></label>
              <svg width='15' height='14' viewBox='0 0 15 14' fill='none'>
                <path d='M2 8.36364L6.23077 12L13 2'></path>
              </svg>
            </div>
            <svg xmlns='http://www.w3.org/2000/svg' version='1.1'>
              <defs>
                <filter id='goo-12'>
                  <feGaussianBlur in='SourceGraphic' stdDeviation='4' result='blur'></feGaussianBlur>
                  <feColorMatrix
                    in='blur'
                    mode='matrix'
                    values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7'
                    result='goo-12'
                  ></feColorMatrix>
                  <feBlend in='SourceGraphic' in2='goo-12'></feBlend>
                </filter>
              </defs>
            </svg>
          </div>
          <span className='text-muted fs-6'>
            By signing in you accept our{' '}
            <a href='/terms-and-conditions' target='_blank' className='link-primary'>
              terms and conditions
            </a>
          </span>
        </div>

        <div className='text-center'>
          <button
            type='submit'
            id='kt_sign_up_submit'
            className='btn btn-lg btn-success w-100 mb-5'
            disabled={!isChecked}
          >
            {!loading && <span className='indicator-label'>Submit</span>}
            {loading && (
              <span className='indicator-progress' style={{ display: 'block' }}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
          <Link to='/login'>
            <button
              type='button'
              id='kt_login_signup_form_cancel_button'
              className='btn btn-lg btn-light-primary w-100 mb-5'
              style={{ background: '#000', color: '#fff' }}
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
