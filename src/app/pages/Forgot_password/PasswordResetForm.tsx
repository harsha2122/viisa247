// PasswordResetForm.tsx

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './forgot.css'

interface PasswordResetFormProps {
  onSubmit: (newPassword: string) => void;
}
    // Or cheeze apne according change krlena
const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onSubmit }) => {
  const validate = (values: { newPassword: string; confirmPassword: string }) => {
    const errors: { newPassword?: string; confirmPassword?: string } = {};

    if (!values.newPassword) {
      errors.newPassword = 'Required';
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Required';
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSubmit = (values: { newPassword: string }) => {
    onSubmit(values.newPassword);
  };

  return (
    <Formik
      initialValues={{ newPassword: '', confirmPassword: '' }}
      validate={validate}
      onSubmit={handleSubmit}
    >
      <Form>
        <div className="mainDiv">
          <div className="cardStyle">
            <img src="/media/logos/logo.png" id="signupLogo" alt="Logo" />
            <h2 className="formTitle">Login to your account</h2>

            <div className="inputDiv">
              <label className="inputLabel" htmlFor="newPassword">
                New Password
              </label>
              <Field
                type="password"
                id="newPassword"
                name="newPassword"
                className="inputField"
              />
              <ErrorMessage name="newPassword" component="div" className="error" />
            </div>

            <div className="inputDiv">
              <label className="inputLabel" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="inputField"
              />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>

            <div className="buttonWrapper">
              <button type="submit" id="submitButton" className="submitButton">
                <span>Continue</span>
              </button>
            </div>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default PasswordResetForm;
