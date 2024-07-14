import React, { FC, useState } from 'react'
import { ErrorMessage, Field, useFormikContext } from 'formik'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import axios from 'axios';
import { KTIcon } from '../../../../../_metronic/helpers';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../helpers/axiosInstance';
// Define a prop for Step1
interface Step2Props {
  data: {
    first_name: string;
    last_name: string;
    birth_place: string;
    birth_detail: string;
    gender: string;
    marital_status: string;
    father_name: string;
    panUri: string;
    photoUri: string;
    // Add other fields here...
  };
  data1: any,
  prevStep: (data: any) => void;
  
  showfinalSubmitLoader: (data: any) => void;
}

const Step2: FC<Step2Props> = ({ data, data1, prevStep,showfinalSubmitLoader }) => {
  const formik = useFormikContext<any>();

  const [formData, setFormData] = useState<any>({
    passport_number: '',
    passport_issueDate: '',
    passport_expiryDate: '',
    passFront: '',
    passBack: '',
  });
  const navigate = useNavigate();
  function formatDateWithTimezoneToYMD(dateString) {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is zero-based
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return null; // Invalid date string
  }
  // Function to save data to the form and set formDataStep1
  const handleNext = async () => {
    showfinalSubmitLoader(true);
    const updatedData = {
      country_code: data1.country_code,
      entry_process: data1.value,
      nationality_code: data1.nationality_code,
      first_name: data.first_name,
      last_name: data.last_name,
      birth_place: data.birth_place,
      birthday_date: data.birth_detail,
      nationality: data1.nationality_code,
      passport_number: formik.values.first_name,
      passport_issue_date: formatDateWithTimezoneToYMD(issueDate),
      passport_expiry_date: formatDateWithTimezoneToYMD(expiryDate),
      gender: data.gender,
      marital_status: data.marital_status,
      application_arrival_date: formatDateWithTimezoneToYMD(data1.application_arrival_date),
      application_departure_date: formatDateWithTimezoneToYMD(data1.application_departure_date),
      application_destination: data1.country_code,
      fathers_name: data.father_name,
      passport_front: formData.passFront,
      passport_back: formData.passBack,
      pan_card: data.panUri,
      photo: data.photoUri,
      visa_amount: (data1.receipt['Visa Fees'] ? data1.receipt['Visa Fees'] : 0) + (data1.receipt['Service Fees'] ? data1.receipt['Service Fees'] : 0)
    }

    const response = await axiosInstance.post('/backend/create_user_application', updatedData);

    if (response.status == 200) {
      let formBody = {
        super_admin_id: '6507f4b97c2c4102d5024e01',
        application_id: response.data.data
      }
      const response1 = await axiosInstance.patch('/backend/super_admin/add_applicant', formBody);

      if (response1.status == 200) {
        const response2 = await axiosInstance.post('/backend/super_admin/apply_visa', {
          application_id: response.data.data
        });


      }
      showfinalSubmitLoader(false);
      
      navigate('/dashboard');
    }

  };

  const handleFrontUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post('/backend/upload_image/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const imageUri = response.data.data;
        setFormData((prevData) => ({
          ...prevData,
          passFront: imageUri,
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleBackUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post('/backend/upload_image/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const imageUri = response.data.data;
        setFormData((prevData) => ({
          ...prevData,
          passBack: imageUri,
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  const [issueDate, setIssueDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-12'>
        <h2 className='fw-bolder text-dark'>Passport Details</h2>
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label required'>Passport Number</label>

        <Field name='passport_number' className='form-control form-control-lg form-control-solid' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='passport_number' />
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='d-flex align-items-center form-label'>
          <span className='required'>Passport Issue Date</span>
        </label>

        <DatePicker
          name='last_name'
          selected={issueDate}
          onChange={(date) => setIssueDate(date)}
          className='form-control form-control-lg form-control-solid'
          dateFormat='MM/dd/yyyy'
          placeholderText='Select Issue Date'
        />

        <div className='text-danger mt-2'>
          <ErrorMessage name='passport_issueDate' />
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='d-flex align-items-center form-label'>
          <span className='required'>Passport Expiry Date</span>
        </label>

        <DatePicker
          name='accountName'
          selected={expiryDate}
          onChange={(date) => setExpiryDate(date)}
          className='form-control form-control-lg form-control-solid'
          dateFormat='MM/dd/yyyy'
          placeholderText='Select Expiry Date'
        />

        <div className='text-danger mt-2'>
          <ErrorMessage name='accountName' />
        </div>
      </div>

      <div className='mb-10'>
        <label htmlFor='aadharBack' className='form-label'>
          Upload Passport Front Photo
        </label>
        <input
          type='file'
          className='form-control'
          id='passFront'
          name='passFront'
          accept='image/*'
          onChange={handleFrontUpload}
          required
        />
      </div>
      <div className='mb-10'>
        <label htmlFor='aadharBack' className='form-label'>
          Upload Passport Back Photo
        </label>
        <input
          type='file'
          className='form-control'
          id='passBack'
          name='passBack'
          accept='image/*'
          onChange={handleBackUpload}
          required
        />
      </div>
      <div className='d-flex flex-stack pt-10'>

        <div className='mr-2'>
          <button
            onClick={prevStep}
            type='button'
            className='btn btn-lg btn-light-primary me-3'
          // data-kt-stepper-action='previous'
          >
            <KTIcon iconName='arrow-left' className='fs-4 me-1' />
            Back
          </button>
        </div>


        <div>
          <button type='button' onClick={handleNext} className='btn btn-lg btn-success me-3' style={{ justifyContent: 'flex-end' }}>
            <span className='indicator-label'>
              Apply
              <KTIcon iconName='arrow-right' className='fs-3 ms-2 me-0' />
            </span>
          </button>
        </div>
      </div>
    </div>

  )
}

export { Step2 }
