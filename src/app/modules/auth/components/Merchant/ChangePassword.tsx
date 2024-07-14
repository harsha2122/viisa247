import { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { requestPassword } from '../../core/_requests'

const initialValues = {
  email: 'admin@demo.com',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const changePasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  oldPassword: Yup.string().required('Old password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
})

export function ChangePassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const formik = useFormik({
    initialValues,
    validationSchema: changePasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      setHasErrors(undefined)
      setTimeout(() => {
        requestPassword(values.email)
          .then(({ data: { result } }) => {
            setHasErrors(false)
            setLoading(false)
          })
          .catch(() => {
            setHasErrors(true)
            setLoading(false)
            setSubmitting(false)
            setStatus('The login details are incorrect')
          })
      }, 1000)
    },
  })

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        {/* begin::Title */}
        <h1 className='text-dark fw-bolder mb-3'>Change Password</h1>
        {/* end::Title */}
      </div>

      {/* begin::Title */}
      {hasErrors === true && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>
            Sorry, looks like there are some errors detected, please try again.
          </div>
        </div>
      )}

      {hasErrors === false && (
        <div className='mb-10 bg-light-info p-8 rounded'>
          <div className='text-info'>Password changed successfully.</div>
        </div>
      )}
      {/* end::Title */}

      {/* begin::Form group - Email */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label>
        <input
          type='email'
          placeholder='Email'
          autoComplete='off'
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group - Email */}

      {/* begin::Form group - Old Password */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Old Password</label>
        <input
          type='password'
          placeholder=''
          autoComplete='off'
          {...formik.getFieldProps('oldPassword')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.oldPassword && formik.errors.oldPassword },
            {
              'is-valid': formik.touched.oldPassword && !formik.errors.oldPassword,
            }
          )}
        />
        {formik.touched.oldPassword && formik.errors.oldPassword && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.oldPassword}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group - Old Password */}

      {/* begin::Form group - New Password */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>New Password</label>
        <input
          type='password'
          placeholder=''
          autoComplete='off'
          {...formik.getFieldProps('newPassword')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.newPassword && formik.errors.newPassword },
            {
              'is-valid': formik.touched.newPassword && !formik.errors.newPassword,
            }
          )}
        />
        {formik.touched.newPassword && formik.errors.newPassword && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.newPassword}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group - New Password */}

      {/* begin::Form group - Confirm Password */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Confirm Password</label>
        <input
          type='password'
          placeholder=''
          autoComplete='off'
          {...formik.getFieldProps('confirmPassword')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.confirmPassword && formik.errors.confirmPassword },
            {
              'is-valid': formik.touched.confirmPassword && !formik.errors.confirmPassword,
            }
          )}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.confirmPassword}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group - Confirm Password */}

      {/* begin::Form group - Buttons */}
      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
        <button type='submit' id='kt_password_reset_submit' className='btn btn-success me-4'>
          <span className='indicator-label'>Submit</span>
          {loading && (
            <span className='indicator-progress'>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/merchant/login'>
          <button
            type='button'
            id='kt_login_password_reset_form_cancel_button'
            className='btn btn-light'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            Cancel
          </button>
        </Link>{' '}
      </div>
      {/* end::Form group - Buttons */}
    </form>
  )
}
