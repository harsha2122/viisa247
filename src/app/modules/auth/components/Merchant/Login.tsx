/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { getUserByToken, login } from '../../core/_requests';
import { toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { useAuth } from '../../core/Auth';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../../../helpers/axiosInstance';
import logo from '../../../../../_metronic/assets/logo.png';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
});

const initialValues = {
  email: '',
  password: '',
};

export function Login() {
  const [loading, setLoading] = useState(false);
  const [isChecked, setChecked] = useState(true); // State to track checkbox status

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const requestBody = {
          merchant_email_id: values.email,
          merchant_password: values.password,
        };

        axiosInstance
          .post('/backend/login/merchant_user', requestBody)
          .then((response) => {
            if (response.status === 200) {
              setLoading(false);
              Cookies.set('isLoggedIn', 'true', { expires: 15 });
              Cookies.set('user_id', response.data.user_id, { expires: 15 });
              Cookies.set('user_type', 'merchant', { expires: 15 });

              localStorage.setItem(
                'markup_percentage',
                response.data.user_markup_percentage
              );

              setTimeout(() => {
                window.location.href = '/merchant/dashboard';
              }, 400);
            } else {
              setLoading(false);
              toast.error(response.data.msg, {
                position: 'top-center',
              });
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    },
  });

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      <Toaster />
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        <img src={logo} style={{ width: '200px' }} />
        <h1 className='text-dark mt-3 mb-3'>Welcome Back !</h1>
      </div>
      {/* begin::Heading */}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-label fs-6 fw-bolder text-dark'>Email</label>
        <input
          placeholder='Email'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
          type='email'
          name='email'
          autoComplete='off'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-3'>
        <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
        <input
          type='password'
          placeholder='Password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />

        {/* begin::Link */}
        <Link to='/merchant/forgot-password' className='link-primary'>
          Forgot Password ?
        </Link>
        {/* end::Link */}
        {/* begin::Wrapper */}
        <div className='d-flex flex-stack mx-auto flex-wrap gap-3 fs-base fw-semibold my-2'>
          {/* Checkbox with state */}
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
            {/* Gooey */}
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
        {/* end::Wrapper */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-success'
          style={{
            backgroundColor: '#327113',
          }}
          disabled={formik.isSubmitting || !formik.isValid || !isChecked}
        >
          {!loading && <span className='indicator-label'>Sign in</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}

      <div className='text-gray-500 text-center fw-semibold fs-6'>
        Not a Member yet?{' '}
        <Link to='/merchant/registration' className='link-primary'>
          Sign up
        </Link>
      </div>
    </form>
  );
}
