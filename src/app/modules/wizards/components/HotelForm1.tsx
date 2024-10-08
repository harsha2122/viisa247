import { useEffect, useState, useRef, ChangeEvent } from 'react';
import { KTIcon } from '../../../../_metronic/helpers';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { ICreateAccount, inits } from './CreateAccountWizardHelper';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ClearIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../../helpers/axiosInstance';
import { DatePicker } from 'antd';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';

function HotelForm1({ onDataChange, ind }) {
  const [initValues] = useState<ICreateAccount>(inits);
  const passportFrontFileInputRef = useRef<HTMLInputElement | null>(null);
  const [passportFrontImageURL, setPassportFrontImageURL] = useState('');
  const maxSize = 1024 * 1024;
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    birthDetail: Yup.string().required('Date of Birth is required'),
    passportIssueDate: Yup.string().required('Passport Issue Date is required'),
    passPortExpiryDate: Yup.string().required('Passport Expiry Date is required'),
    gender: Yup.string().required('Gender is required'),
    maritalStatus: Yup.string().required('Marital Status is required'),
    panNo: Yup.string().required('PAN number is required'),
  });

  const [formData, setFormData] = useState({
    fullName: '',
    traveller: '',
  });

  const inputStyle = {
    border: '1.5px solid #d3d3d3',
    borderRadius: '15px',
    padding: '10px',
    paddingLeft: '20px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post('/backend/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const fileUrl = response.data.url;

      setLoading(false);

      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
      return '';
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
    onDataChange({ ...formData, [fieldName]: value });

    if (fieldName === 'birthDetail') {
      setDob(value);
    }
    if (fieldName === 'passportIssueDate') {
      setIssueDate(value);
    }
    if (fieldName === 'passPortExpiryDate') {
      setExpiryDate(value);
    }
  };

  const [issueDate, setIssueDate] = useState<string | undefined>('');
  const [expiryDate, setExpiryDate] = useState<string | undefined>('');
  const [dob, setDob] = useState<string | undefined>('');

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
    <Toaster />
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
      <div className='d-flex flex-column flex-md-row'>
        <div className='flex-grow-1 bg-body rounded p-3'>
          <Formik initialValues={initValues} onSubmit={() => { }} validationSchema={validationSchema}>
            {() => (
              <Form className='row g-3'>
                <div className='col-md-6'>
                  <label className='form-label'>Full Name</label>
                  <Field
                    style={inputStyle}
                    name='fullName'
                    className='form-control form-control-lg form-control-solid'
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  />
                  <ErrorMessage name='fullName' component='div' className='text-danger mt-2' />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>Traveller Count</label>
                  <Field
                    style={inputStyle}
                    name='traveller'
                    type='number'
                    className='form-control form-control-lg form-control-solid'
                    onChange={(e) => handleFieldChange('traveller', e.target.value)}
                  />
                  <ErrorMessage name='traveller' component='div' className='text-danger mt-2' />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default HotelForm1;
