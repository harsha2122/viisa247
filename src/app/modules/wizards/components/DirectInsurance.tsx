import { useEffect, useState, useRef } from 'react';
import { KTIcon } from '../../../../_metronic/helpers';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import ClearIcon from '@mui/icons-material/Delete';


export interface ICreateAccount {
  passport_number?: string;
  first_name?: string;
  last_name?: string;
  birth_place?: string;
  birthday_date?: string; 
  passport_issue_date?: string;
  passport_expiry_date?: string;
  gender?: string;
  marital_status?: string;
  panNo?: string;
  passport_front?: string;
}

export const inits: ICreateAccount = {
  passport_number: '',
  first_name: '',
  last_name: '',
  birth_place: '',
  birthday_date: '',
  passport_issue_date: '',
  passport_expiry_date: '',
  gender: '',
  marital_status: '',
  panNo: '',
  passport_front: '',
};

interface DirectInsuranceProps {
    ind: number;
    combinedData: ICreateAccount;
    onDataChange: (newData: ICreateAccount) => void;
    onFieldChange: (index: number, fieldName: string, value: string) => void;
    onFileDelete: (fileKey: string) => void;
  }

  function DirectInsurance({
    ind,
    combinedData,
    onDataChange,
    onFieldChange,
    onFileDelete,
  }: DirectInsuranceProps) {
    const [initValues] = useState<ICreateAccount>(combinedData || inits);
    const passportFrontFileInputRef = useRef<HTMLInputElement | null>(null);
    const [passportFrontImageURL, setPassportFrontImageURL] = useState('');
    const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    birthday_date: Yup.string().required('Date of Birth is required'),
    passport_issue_date: Yup.string().required('Passport Issue Date is required'),
    passport_expiry_date: Yup.string().required('Passport Expiry Date is required'),
    gender: Yup.string().required('Gender is required'),
    marital_status: Yup.string().required('Marital Status is required'),
    panNo: Yup.string().required('PAN number is required')
  });

  useEffect(() => {
    if (combinedData?.passport_front) {
      setPassportFrontImageURL(combinedData.passport_front);
    }
  }, [combinedData]);

  console.log("sdf", passportFrontImageURL)
  console.log("--------", combinedData)

  const inputStyle = {
    border: '1.5px solid #d3d3d3',
    borderRadius: '15px',
    padding: '10px',
    paddingLeft: '20px',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#f5f5f5'
  };

  return (
    <div
      className='py-10 px-20'
      style={{
        borderRadius: 20,
        borderColor: '#f2f2f2',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        marginLeft: 10,
        marginTop: 10,
        backgroundColor: 'white',
      }}
    >
      <h5 style={{fontSize: 30, letterSpacing: 0.3}}>Traveller {ind + 1} </h5>
      <hr
        style={{
          width: '100%',
          border: 0,
          height: '1px',
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0))',
        }}
      />
      <br />
      <div className='d-flex w-100 flex-column'>
        <div style={{width: '100%'}}>
          <h6>Passport Front Page Image</h6>
          {loading ? (
            <div style={{color: '#000'}}>Loading...</div>
          ) : passportFrontImageURL ? (
            <div
              style={{
                border: '2px dashed gray',
                width: '100%',
                height: 300,
                borderRadius: '10px',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <div
                onClick={() => {
                  setPassportFrontImageURL('');
                }}
                style={{
                  justifyContent: 'flex-end',
                  position: 'relative',
                  backgroundColor: 'white',
                  padding: 7,
                  borderRadius: 50,
                  left: '10px',
                  width: '35px',
                  zIndex: '1',
                  cursor: 'pointer',
                }}
              >
                <ClearIcon style={{color: 'red'}} />
              </div>
              <img
                src={passportFrontImageURL}
                alt='Uploaded Image'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  position: 'relative',
                  marginTop: '-35px',
                }}
              />
            </div>
          ) : (
            <p>No preview available</p>
          )}
        </div>

        <div
          className='d-flex flex-row-fluid flex-center bg-body rounded'
          style={{width: '100%', backgroundColor: 'blue'}}
        >
          <Formik
            initialValues={initValues}
            onSubmit={() => {}}
            validationSchema={validationSchema}
          >
            {() => (
              <Form className='py-20 px-9 w-100' noValidate id='kt_create_account_form'>
                <div>
                  <div className='fv-row gap-8 w-100 mb-5'>
                    <label className='d-flex align-items-center form-label'>
                      <span className='required'>Passport Number</span>
                    </label>

                    <Field
                      style={inputStyle}
                      name='passportNumber'
                      className='form-control form-control-lg form-control-solid'
                      value={initValues.passport_number || ''}
                      readOnly
                    />
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='passportNumber' />
                    </div>
                  </div>
                  <div className='d-flex gap-8'>
                    <div className='fv-row gap-8 w-100 mb-5'>
                      <label className='form-label required'>First Name</label>

                      <Field
                        name='first_name'
                        style={inputStyle}
                        className='form-control form-control-lg form-control-solid'
                        value={initValues.first_name || ''}
                        readOnly
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='first_name' />
                      </div>
                    </div>
                    <div className='fv-row gap-8 w-100 mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Last Name</span>
                      </label>

                      <Field
                        style={inputStyle}
                        name='last_name'
                        className='form-control form-control-lg form-control-solid'
                        value={initValues.last_name || ''}
                        readOnly
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='last_name' />
                      </div>
                    </div>
                  </div>
                  <div className='fv-row gap-8 w-100 mb-5'>
                    <label className='d-flex align-items-center form-label'>
                      <span className='required'>Birth Place</span>
                    </label>

                    <Field
                      style={inputStyle}
                      name='birth_place'
                      className='form-control form-control-lg form-control-solid'
                      value={initValues.birth_place || ''}
                      readOnly
                    />
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='birth_place' />
                    </div>
                  </div>
                  <div className='fv-row gap-8 w-100 mb-5'>
                    <label className='d-flex align-items-center form-label'>
                      <span className='required'>Date of Birth</span>
                    </label>

                    <Field
                      name='birthday_date'
                      as='input'
                      type='date'
                      style={inputStyle}
                      className='form-control form-control-lg form-control-solid'
                      value={initValues.birthday_date || ''}
                      readOnly
                    />
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='birthday_date' />
                    </div>
                  </div>
                  <div className='d-flex gap-8'>
                    <div className='fv-row gap-8 w-100 mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Passport Issue Date</span>
                      </label>

                      <Field
                        name='passport_issue_date'
                        as='input'
                        type='date'
                        style={inputStyle}
                        className='form-control form-control-lg form-control-solid'
                        value={initValues.passport_issue_date || ''}
                        readOnly
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='passport_issue_date' />
                      </div>
                    </div>
                    <div className='fv-row gap-8 w-100 mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Passport Expiry Date</span>
                      </label>

                      <Field
                        name='passport_expiry_date'
                        as='input'
                        type='date'
                        style={inputStyle}
                        className='form-control form-control-lg form-control-solid'
                        value={initValues.passport_expiry_date || ''}
                        readOnly
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='passport_expiry_date' />
                      </div>
                    </div>
                  </div>
                  <div className='d-flex gap-8'>
                    <div className='fv-row gap-8 w-100 mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Gender</span>
                      </label>

                      <Field
                        style={inputStyle}
                        name='gender'
                        className='form-control form-control-lg form-control-solid'
                        value={initValues.gender || ''}
                        readOnly
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='gender' />
                      </div>
                    </div>
                    <div className='fv-row gap-8 w-100 mb-5'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Marital Status</span>
                      </label>

                      <Field
                        style={inputStyle}
                        name='marital_status'
                        className='form-control form-control-lg form-control-solid'
                        value={initValues.marital_status || ''}
                        readOnly
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='marital_status' />
                      </div>
                    </div>
                  </div>
                  <div className='fv-row gap-8 w-100 mb-5'>
                    <label className='d-flex align-items-center form-label'>
                      <span className='required'>PAN Number</span>
                    </label>

                    <Field
                      style={inputStyle}
                      name='panNo'
                      className='form-control form-control-lg form-control-solid'
                      value={initValues.panNo || ''}
                      readOnly
                    />
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='panNo' />
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

export default DirectInsurance;
