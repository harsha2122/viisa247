import React, { useState, useRef, ChangeEvent } from 'react';
import { Field, ErrorMessage, Formik, Form } from 'formik';
import ClearIcon from '@mui/icons-material/Delete'
import axiosInstance from '../../app/helpers/axiosInstance'
import { DatePicker } from 'antd'
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css'
import toast, { Toaster } from 'react-hot-toast';

const AddPackageForm = ({ inputStyle }) => {
  const [loading, setLoading] = useState(false);
  const packageImageFileInputRef = useRef<HTMLInputElement | null>(null);
  const iconFileInputRef = useRef<HTMLInputElement | null>(null);
  const hotelImageFileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfFileInputRef = useRef<HTMLInputElement | null>(null);
  const [packageImage, setPackageImage] = useState('');
  const [pdfFile, setpdfFile] = useState('');
  const [hotelImage, setHotelImage] = useState('');
  const maxSize = 1024 * 1024; 
  const [icon, setIcon] = useState('');
  const [departureDate, setDepartureDate] = useState<string | undefined>('');
  const [arrivalDate, setArrivalDate] = useState<string | undefined>('');
  const [packageData, setPackageData] = useState<{
    pdf_file: string;
    packageName: string;
    packageImage: string;
    duration: string;
    total_seats: string;
    booked_seats: string;
    cost_per_person: string;
    departure_location: string;
    per_person_cost: string;
    total_package_cost: string;
    package_overview: string;
    payment_policy: string[];
    amenities: { icon: string, name: string }[];
    cancellation_policy: string[];
    meals: {};
    flight_and_transport: string[];
    visa_and_taxes: string[];
    hotels: { hotelImage: string, name: string, location: string, duration: string }[];
    inclusion: string[];
    exclusion: string[];
    arrival_date: string;
    departure_date: string;
    share_break_down: { share: string, price: string }[];
  }>({
    pdf_file: '',
    packageName: '',
    packageImage: '',
    duration: '',
    total_seats: '',
    booked_seats: '',
    cost_per_person: '',
    departure_location: '',
    per_person_cost: '',
    total_package_cost: '',
    package_overview: '',
    payment_policy: [],
    cancellation_policy: [],
    amenities: [{ icon: '', name: '' }],
    meals: {},
    flight_and_transport: [],
    visa_and_taxes: [],
    hotels: [{ hotelImage: '', name: '', location: '', duration: '' }],
    inclusion: [],
    exclusion: [],
    arrival_date: '',
    departure_date: '',
    share_break_down: [{ share: '', price: '' }],
  });



  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post('/backend/upload_image/upload', formData, {
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

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target) {
          setPackageImage(e.target.result as string);
          try {
            const imageLink = await handleFileUpload(file);
            setPackageData({ ...packageData, packageImage: imageLink });
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (packageImageFileInputRef.current) {
      packageImageFileInputRef.current.click();
    }
  };

  const handlePdfSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target) {
          setpdfFile(e.target.result as string);
          try {
            const fileLink = await handleFileUpload(file);
            setPackageData({ ...packageData, pdf_file: fileLink });
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = () => {
    if (pdfFileInputRef.current) {
      pdfFileInputRef.current.click();
    }
  };

  const handleHotelImageSelect = async (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target) {
          const imageLink = await handleFileUpload(file);
          handleHotelImageChange(index, imageLink);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleHotelImageChange = (index: number, value: string) => {
    const updatedHotels = [...packageData.hotels];
    updatedHotels[index] = {
      ...updatedHotels[index],
      hotelImage: value
    };
    setPackageData({ ...packageData, hotels: updatedHotels });
  };
  

  const handleHotelImageUpload = (index) => {
    if (hotelImageFileInputRef.current) {
      hotelImageFileInputRef.current.click();
    }
  };

  const handleAmenityChange = (index: number, field: string, value: string) => {
    const updatedAmenities = [...packageData.amenities];
    updatedAmenities[index] = {
      ...updatedAmenities[index],
      [field]: value
    };
    setPackageData({ ...packageData, amenities: updatedAmenities });
  };
  
  const handleIconSelect = async (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target) {
          const imageLink = await handleFileUpload(file);
          handleAmenityChange(index, 'icon', imageLink);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleNameChange = (index: number, value: string) => {
    handleAmenityChange(index, 'name', value);
  };
  
  const removeAmenity = (index: number) => {
    const updatedAmenities = [...packageData.amenities];
    updatedAmenities.splice(index, 1);
    setPackageData({ ...packageData, amenities: updatedAmenities });
  };

  const removeHotelImage = (index) => {
    const updatedHotels = [...packageData.hotels];
    updatedHotels[index].hotelImage = '';
    setPackageData({ ...packageData, hotels: updatedHotels });
  };
  
  
  const addAmenity = () => {
    setPackageData(prevData => ({
      ...prevData,
      amenities: [...prevData.amenities, { icon: '', name: '' }]
    }));
  };
  

  const handleIconUpload = (index: number) => {
    if (iconFileInputRef.current) {
      iconFileInputRef.current.click();
    }
  };

  const removeIcon = (index: number) => {
    const updatedAmenities = [...packageData.amenities];
    updatedAmenities[index].icon = '';
    setPackageData({ ...packageData, amenities: updatedAmenities });
  };

  const addRow = (propertyName: string) => {
    return () => {
      if (propertyName === 'share_break_down') {
        setPackageData(prevData => ({
          ...prevData,
          [propertyName]: [...prevData[propertyName], { share: '', price: '' }]
        }));
      } else {
        setPackageData(prevData => ({
          ...prevData,
          [propertyName]: [...prevData[propertyName], '']
        }));
      }
    };
  };
  

  const removeRow = (propertyName: string) => {
    return (index: number) => {
      const updatedArray = [...packageData[propertyName]];
      updatedArray.splice(index, 1); 
      setPackageData(prevData => ({
        ...prevData,
        [propertyName]: updatedArray
      }));
    };
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    if (!fieldName) return;
    const fieldArray = fieldName.split('[');
  
    if (fieldArray.length >= 2) {
      const propertyName = fieldArray[0];
      const index = parseInt(fieldArray[1].substring(0, fieldArray[1].length - 1));
  
      if (propertyName && packageData.hasOwnProperty(propertyName)) {
        const updatedArray = [...packageData[propertyName]];
        if (propertyName === 'share_break_down' || propertyName === 'amenities' || propertyName === 'hotels') {
          updatedArray[index] = { ...updatedArray[index], [fieldName.split('.')[1]]: value };
        } else {
          updatedArray[index] = value;
        }
        setPackageData(prevData => ({
          ...prevData,
          [propertyName]: updatedArray
        }));
      }
  
      if (propertyName === 'flight_and_transport') {
        const updatedArray = [...packageData.flight_and_transport];
        updatedArray[index] = value;
  
        setPackageData(prevData => ({
          ...prevData,
          flight_and_transport: updatedArray
        }));
      }
  
      // if (fieldName === 'arrival_date') {
      //   setArrivalDate(value);
      //   console.log('Arrival Date:', value.format('YYYY-MM-DD'));
      // } else if (fieldName === 'departure_date') {
      //   setDepartureDate(value);
      //   console.log('Departure Date:', value.format('YYYY-MM-DD'));
      // }else 
      {
        setPackageData(prevData => ({
          ...prevData,
          [fieldName]: value
        }));
      }
    }
  };
  
  const handleSubmit = async (values) => {
    try {
      const formValues = { 
        ...values, 
        packageImage: packageData.packageImage,
        pdf_file: packageData.pdf_file,
        flight_and_transport: packageData.flight_and_transport, 
        visa_and_taxes: packageData.visa_and_taxes,
        inclusion: packageData.inclusion,
        exclusion: packageData.exclusion,
        share_break_down: packageData.share_break_down,
        payment_policy: packageData.payment_policy,
        cancellation_policy: packageData.cancellation_policy,
        amenities: packageData.amenities,
        hotels: packageData.hotels,
        arrival_date: values.arrival_date,
        departure_date: values.departure_date,
      };
      const response = await axiosInstance.post("/backend/create_packages", formValues);
      toast.success('Package Created successfully!');
      setTimeout(() => {
        window.location.reload();
    }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form. Please try again later.');
    }
  };
  
  
  
  
  const addFlightAndTransportRow = addRow('flight_and_transport');
  const addVisaAndTaxesRow = addRow('visa_and_taxes');
  const addHotelsRow = addRow('hotels');
  const addInclusionsRow = addRow('inclusion');
  const addExclusionsRow = addRow('exclusion');
  const addShareBreakdownRow = addRow('share_break_down');
  const addPaymentPolicyRow = addRow('payment_policy');
  const addCancellationPolicyRow = addRow('cancellation_policy')
  const addAmenitiesRow = addRow('amenities');
  
  const removeFlightAndTransportRow = removeRow('flight_and_transport');
  const removeVisaAndTaxesRow = removeRow('visa_and_taxes');
  const removeHotelsRow = removeRow('hotels');
  const removeInclusionsRow = removeRow('inclusion');
  const removeExclusionsRow = removeRow('exclusion');
  const removeShareBreakdownRow = removeRow('share_break_down');
  const removePaymentPolicyRow = removeRow('payment_policy');
  const removeCancellationPolicyRow = removeRow('cancellation_policy');
  const removeAmenitiesRow = removeRow('amenities');

  return (
    <>
    <Toaster />
    <Formik
      initialValues={packageData}
      onSubmit={handleSubmit}
    >
        {() => (
          <Form style={{ border: "1px solid #327113", borderRadius: "10px" }} className='py-5 mt-10 px-10 px-auto w-100  d-flex flex-row flex-wrap' noValidate id={`kt_create_account_form`}>
            <div className='px-auto d-flex flex-column'>
              <div className='px-auto my-4 w-100 d-flex flex-row flex-wrap'>
                <h1 className='text-xl font-bold mx-auto'>Add Package</h1>
                <hr
                  style={{
                    width: '100%',
                    borderTop: '2px dashed #327113',
                    borderBottom: '1px solid transparent',
                    margin: '10px',
                  }}
                />
                <div className='d-flex w-50'>
                  <div style={{ width: '80%', marginTop: 20 }}>
                    <h6 className='form-label fs-5 required'>Package Image</h6>
                    {loading ? (
                      <div style={{ color: "#000" }}>Loading...</div>
                    ) : (
                      packageImage ? (
                        <div
                          style={{
                            border: '2px dashed gray',
                            width: '112%',
                            height: 250,
                            borderRadius: '10px',
                            justifyContent: 'center',
                            textAlign: 'center',
                            marginTop: 20,
                          }}
                        >
                          <div
                            onClick={() => setPackageImage('')}
                            style={{
                              justifyContent: 'flex-end',
                              position: 'relative',
                              backgroundColor: 'white',
                              padding: 7,
                              borderRadius: 50,
                              left: "10px",
                              width: "35px",
                              zIndex: "1",
                              cursor: 'pointer',
                            }}
                          >
                            <ClearIcon style={{ color: 'red' }} />
                          </div>
                          <img
                            src={packageImage}
                            alt='Uploaded Image'
                            style={{ maxWidth: '100%', maxHeight: '100%', position: "relative", marginTop: "-35px" }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            border: '2px dashed gray',
                            width: '112%',
                            height: 250,
                            borderRadius: '10px',
                            justifyContent: 'center',
                            textAlign: 'center',
                            paddingTop: 40,
                            marginTop: 20,
                          }}
                        >
                          <h4 className='mx-10 mt-5'>Package Image</h4>
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
                            ref={packageImageFileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileSelect}
                          />
                        </div>
                      )
                    )}
                  </div>
                  </div>
                  <div className='d-flex w-50'>
                  <div style={{ width: '80%', marginTop: 20 }}>
                    <h6 className='form-label fs-5 required'>Package Description</h6>
                    {loading ? (
                      <div style={{ color: "#000" }}>Loading...</div>
                    ) : (
                      pdfFile ? (
                        <div
                          style={{
                            border: '2px dashed gray',
                            width: '112%',
                            height: 250,
                            borderRadius: '10px',
                            justifyContent: 'center',
                            textAlign: 'center',
                            marginTop: 20,
                          }}
                        >
                          <div
                            onClick={() => setpdfFile('')}
                            style={{
                              justifyContent: 'flex-end',
                              position: 'relative',
                              backgroundColor: 'white',
                              padding: 7,
                              borderRadius: 50,
                              left: "10px",
                              width: "35px",
                              zIndex: "1",
                              cursor: 'pointer',
                            }}
                          >
                            <ClearIcon style={{ color: 'red' }} />
                          </div>
                           <h2>Uploaded Successfully</h2>
                        </div>
                      ) : (
                        <div
                          style={{
                            border: '2px dashed gray',
                            width: '112%',
                            height: 250,
                            borderRadius: '10px',
                            justifyContent: 'center',
                            textAlign: 'center',
                            paddingTop: 40,
                            marginTop: 20,
                          }}
                        >
                          <h4 className='mx-10 mt-5'>Package Description</h4>
                          <button
                            type='button'
                            onClick={handlePdfUpload}
                            className='btn btn-lg btn-success me-3 mt-7'
                            style={{ justifyContent: 'flex-end', backgroundColor: '#327113' }}
                          >
                            <span className='indicator-label'>Select Files</span>
                          </button>
                          <p className='text-bold pt-5 fs-9' style={{ color: '#555555' }}>
                            Supports pdf only.
                          </p>
                          <input
                            type='file'
                            ref={pdfFileInputRef}
                            style={{ display: 'none' }}
                            onChange={handlePdfSelect}
                            accept='application/pdf'
                          />
                        </div>
                      )
                    )}
                  </div>
                  </div>
                  <div className='w-50 d-flex flex-column mt-8 my-5'>
                    <label className='form-label fs-5 required'>Package Name</label>
                    <Field
                      type='text'
                      name='packageName'
                      className='form-control form-control-lg form-control-solid'
                      style={inputStyle}
                    />
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='packageName' />
                    </div>
                  </div>
                  <div className='w-50 d-flex flex-column mt-8 my-5'>
                  <label className='form-label fs-5 required'>Duration (In days)</label>
                  <Field
                    type='text'
                    name='duration'
                    className='form-control form-control-lg form-control-solid'
                    style={inputStyle}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='duration' />
                  </div>
                </div>
                
                <div className='w-50 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Total Seats</label>
                  <Field
                    type='text'
                    name='total_seats'
                    className='form-control form-control-lg form-control-solid'
                    style={inputStyle}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='total_seats' />
                  </div>
                </div>
                <div className='w-50 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Cost per Person</label>
                  <Field
                    type='text'
                    name='cost_per_person'
                    className='form-control form-control-lg form-control-solid'
                    style={inputStyle}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='cost_per_person' />
                  </div>
                </div>
                <div className='w-50 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Departure Location</label>
                  <Field
                    type='text'
                    name='departure_location'
                    className='form-control form-control-lg form-control-solid'
                    style={inputStyle}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='departure_location' />
                  </div>
                </div>
                <div className='w-50 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Total Package Cost</label>
                  <Field
                    type='text'
                    name='total_package_cost'
                    className='form-control form-control-lg form-control-solid'
                    style={inputStyle}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='total_package_cost' />
                  </div>
                </div>
                <div className='w-50 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Arrival Date</label>
                  <Field
                    type='text'
                    name='arrival_date'
                    placeholder='YYYY-MM-DD'
                    className='form-control form-control-lg form-control-solid'
                    style={inputStyle}
                  />       
                  {/* <DatePicker
                    style={{ backgroundClip: '#fff', width:"90%", marginTop: 2, border: '1px solid #d3d3d3', borderRadius: 10, padding: 10 }}
                    onChange={(value) => {
                      if (value) {
                        handleFieldChange('arrival_date', value.format('YYYY-MM-DD'))
                      }}
                    }
                  /> */}
                </div>
                <div className='w-50 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Departure Date</label>
                  <Field
                    type='text'
                    name='departure_date'
                    placeholder='YYYY-MM-DD'
                    className='form-control form-control-lg form-control-solid'
                    style={inputStyle}
                  />   
                  {/* <DatePicker
                    style={{ backgroundClip: '#fff', width:"90%", marginTop: 2, border: '1px solid #d3d3d3', borderRadius: 10, padding: 10 }}
                    onChange={(value) => {
                      if (value) {
                        handleFieldChange('departure_date', value.format('YYYY-MM-DD'))
                      }}
                    }
                  /> */}
                </div>
                <div className='w-100 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Package Overview</label>
                  <Field
                    as='textarea'
                    type='text'
                    row={5}
                    name='package_overview'
                    className='form-control form-control-lg form-control-solid'
                    style={inputStyle}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='package_overview' />
                  </div>
                </div>
                <hr
                  style={{
                    width: '100%',
                    borderTop: '2px dashed #327113',
                    borderBottom: '1px solid transparent',
                    margin: '10px',
                  }}
                />
                <div className='w-100 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Flight & Transport</label>
                  {packageData.flight_and_transport.map((flight_and_transport, index) => (
                    <div key={index} className='my-2 d-flex align-items-center'>
                      <Field
                        type='text'
                        name={`flight_and_transport[${index}]`}
                        value={flight_and_transport}
                        className='form-control form-control-lg form-control-solid w-75'
                        style={inputStyle}
                        onChange={(e) => handleFieldChange(`flight_and_transport[${index}]`, e.target.value)}
                      />
                      <button
                        type='button'
                        onClick={() => removeFlightAndTransportRow(index)}
                        className='btn btn-sm btn-danger mx-8'
                        style={{background:"red"}}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={addFlightAndTransportRow}
                    className='btn btn-sm btn-primary mt-4 w-25'
                  >
                    + Add Details
                  </button>
                </div>
                <hr
                  style={{
                    width: '100%',
                    borderTop: '2px dashed #327113',
                    borderBottom: '1px solid transparent',
                    margin: '10px',
                  }}
                />
                <div className='w-100 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Visa & Taxes</label>
                  {packageData.visa_and_taxes.map((visa_and_taxes, index) => (
                    <div key={index} className='my-2 d-flex align-items-center'>
                      <Field
                        type='text'
                        name={`visa_and_taxes[${index}]`}
                        value={visa_and_taxes}
                        className='form-control form-control-lg form-control-solid w-75'
                        style={inputStyle}
                        onChange={(e) => handleFieldChange(`visa_and_taxes[${index}]`, e.target.value)}
                      />
                      <button
                        type='button'
                        onClick={() => removeVisaAndTaxesRow(index)}
                        className='btn btn-sm btn-danger mx-8'
                        style={{background:"red"}}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={addVisaAndTaxesRow}
                    className='btn btn-sm btn-primary mt-4 w-25'
                  >
                    + Add Details
                  </button>
                </div>
                <hr
                  style={{
                    width: '100%',
                    borderTop: '2px dashed #327113',
                    borderBottom: '1px solid transparent',
                    margin: '10px',
                  }}
                />
                <div className='w-100 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Hotel Stay Details</label>
                  {packageData.hotels.map((hotel, index) => (
                    <div key={index} className='my-4 d-flex align-items-center'>
                      <div className='w-25'>
                        {loading ? (
                          <div style={{ color: "#000" }}>Loading...</div>
                        ) : (
                          hotel.hotelImage ? (
                            <div
                              style={{
                                border: '2px dashed gray',
                                width: '100%',
                                height: 150,
                                borderRadius: '10px',
                                justifyContent: 'center',
                                textAlign: 'center',
                              }}
                            >
                              <div
                                onClick={() => removeHotelImage(index)}
                                style={{
                                  justifyContent: 'flex-end',
                                  position: 'relative',
                                  backgroundColor: 'white',
                                  padding: 7,
                                  borderRadius: 50,
                                  left: "10px",
                                  width: "35px",
                                  zIndex: "1",
                                  cursor: 'pointer',
                                }}
                              >
                                <ClearIcon style={{ color: 'red' }} />
                              </div>
                              <img
                                src={hotel.hotelImage}
                                style={{ maxWidth: '100%', maxHeight: '100%', position: "relative", marginTop: "-35px" }}
                              />
                            </div>
                          ) : (
                            <div
                              style={{
                                border: '2px dashed gray',
                                width: '100%',
                                height: 150,
                                borderRadius: '10px',
                                justifyContent: 'center',
                                textAlign: 'center',
                                paddingTop: 10,
                              }}
                            >
                              <button
                                type='button'
                                onClick={() => handleHotelImageUpload(index)}
                                className='btn btn-lg btn-success me-3 mt-7'
                                style={{ justifyContent: 'flex-end', backgroundColor: '#327113' }}
                              >
                                <span className='indicator-label'>Select Image</span>
                              </button>
                              <p className='text-bold pt-5 fs-9' style={{ color: '#555555' }}>
                                Supports Image only
                              </p>
                              <input
                                type='file'
                                ref={hotelImageFileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={(e) => handleHotelImageSelect(e, index)}
                              />
                            </div>
                          )
                        )}
                      </div>
                      <div className='d-flex flex-column gap-3 mx-4 w-75'>
                        <Field
                          type='text'
                          name={`hotels[${index}].name`}
                          value={hotel.name}
                          onChange={(e) => handleFieldChange(`hotels[${index}].name`, e.target.value)}
                          className='form-control form-control-lg form-control-solid w-75'
                          style={inputStyle}
                          placeholder='Name'
                        />
                        <Field
                          type='text'
                          name={`hotels[${index}].location`}
                          value={hotel.location}
                          onChange={(e) => handleFieldChange(`hotels[${index}].location`, e.target.value)}
                          className='form-control form-control-lg form-control-solid w-75'
                          style={inputStyle}
                          placeholder='Location'
                        />
                        <Field
                          type='text'
                          name={`hotels[${index}].duration`}
                          value={hotel.duration}
                          onChange={(e) => handleFieldChange(`hotels[${index}].duration`, e.target.value)}
                          className='form-control form-control-lg form-control-solid w-75'
                          style={inputStyle}
                          placeholder='Duration'
                        />
                      </div>
                      <button
                        type='button'
                        onClick={() => removeHotelsRow(index)}
                        className='btn btn-sm btn-danger mx-8'
                        style={{background:"red"}}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={addHotelsRow}
                    className='btn btn-sm btn-primary mt-4 w-25'
                  >
                    + Add Details
                  </button>
                </div>

                <hr
                  style={{
                    width: '100%',
                    borderTop: '2px dashed #327113',
                    borderBottom: '1px solid transparent',
                    margin: '10px',
                  }}
                />
    
                <div className='w-100 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Inclusions</label>
                  {packageData.inclusion.map((inclusion, index) => (
                    <div key={index} className='my-2 d-flex align-items-center'>
                      <Field
                        type='text'
                        name={`inclusion[${index}]`}
                        value={inclusion}
                        className='form-control form-control-lg form-control-solid w-75'
                        style={inputStyle}
                        onChange={(e) => handleFieldChange(`inclusion[${index}]`, e.target.value)}
                      />
                      <button
                        type='button'
                        onClick={() => removeInclusionsRow(index)}
                        className='btn btn-sm btn-danger mx-8'
                        style={{background:"red"}}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={addInclusionsRow}
                    className='btn btn-sm btn-primary mt-4 w-25'
                  >
                    + Add Details
                  </button>
                </div>
                <hr
                  style={{
                    width: '100%',
                    borderTop: '2px dashed #327113',
                    borderBottom: '1px solid transparent',
                    margin: '10px',
                  }}
                />
                <div className='w-100 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Exclusions</label>
                  {packageData.exclusion.map((exclusion, index) => (
                    <div key={index} className='my-2 d-flex align-items-center'>
                      <Field
                        type='text'
                        name={`exclusion[${index}]`}
                        value={exclusion}
                        className='form-control form-control-lg form-control-solid w-75'
                        style={inputStyle}
                        onChange={(e) => handleFieldChange(`exclusion[${index}]`, e.target.value)}
                      />
                      <button
                        type='button'
                        onClick={() => removeExclusionsRow(index)}
                        className='btn btn-sm btn-danger mx-8'
                        style={{background:"red"}}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={addExclusionsRow}
                    className='btn btn-sm btn-primary mt-4 w-25'
                  >
                    + Add Details
                  </button>
                </div>
                <hr
                  style={{
                    width: '100%',
                    borderTop: '2px dashed #327113',
                    borderBottom: '1px solid transparent',
                    margin: '10px',
                  }}
                />

                <div className='w-100 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Share Breakdown</label>
                  {packageData.share_break_down.map((item, index) => (
                  <div key={index} className='my-2 d-flex align-items-center w-100'>
                    <div className="d-flex w-50 flex-column">
                      <label className='form-label'>Share</label>
                      <Field
                        type='text'
                        name={`share_break_down[${index}].share`}
                        className='form-control form-control-lg form-control-solid w-100'
                        value={item.share}
                        style={inputStyle}
                        onChange={(e) => handleFieldChange(`share_break_down[${index}].share`, e.target.value)}
                      />
                    </div>
                    <div className="d-flex w-50 flex-column mx-4">
                      <label className='form-label'>Price in (₹)</label>
                      <Field
                        type='text'
                        name={`share_break_down[${index}].price`}
                        className='form-control form-control-lg form-control-solid w-100'
                        style={inputStyle}
                        value={item.price}
                        onChange={(e) => handleFieldChange(`share_break_down[${index}].price`, e.target.value)}
                      />
                    </div>
                    <button
                      type='button'
                      onClick={() => removeShareBreakdownRow(index)}
                      className='btn btn-sm btn-danger mt-8'
                      style={{background:"red"}}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                  <button
                    type='button'
                    onClick={addShareBreakdownRow}
                    className='btn btn-sm btn-primary mt-4 w-25'
                  >
                    + Add Details
                  </button>
                </div>
                <hr
                  style={{
                    width: '100%',
                    borderTop: '2px dashed #327113',
                    borderBottom: '1px solid transparent',
                    margin: '10px',
                  }}
                />
                <div className='w-100 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Payment Policy</label>
                  {packageData.payment_policy.map((payment_policy, index) => (
                    <div key={index} className='my-2 d-flex align-items-center'>
                      <Field
                        type='text'
                        name={`payment_policy[${index}]`}
                        value={payment_policy}
                        className='form-control form-control-lg form-control-solid w-75'
                        style={inputStyle}
                        onChange={(e) => handleFieldChange(`payment_policy[${index}]`, e.target.value)}
                      />
                      <button
                        type='button'
                        onClick={() => removePaymentPolicyRow(index)}
                        className='btn btn-sm btn-danger mx-8'
                        style={{background:"red"}}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={addPaymentPolicyRow}
                    className='btn btn-sm btn-primary mt-4 w-25'
                  >
                    + Add Details
                  </button>
                </div>
                <hr
                  style={{
                    width: '100%',
                    borderTop: '2px dashed #327113',
                    borderBottom: '1px solid transparent',
                    margin: '10px',
                  }}
                />
                <div className='w-100 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Cancellation Policy</label>
                  {packageData.cancellation_policy.map((cancellation_policy, index) => (
                    <div key={index} className='my-2 d-flex align-items-center'>
                      <Field
                        type='text'
                        name={`cancellation_policy[${index}]`}
                        value={cancellation_policy}
                        className='form-control form-control-lg form-control-solid w-75'
                        style={inputStyle}
                        onChange={(e) => handleFieldChange(`cancellation_policy[${index}]`, e.target.value)}
                      />
                      <button
                        type='button'
                        onClick={() => removeCancellationPolicyRow(index)}
                        className='btn btn-sm btn-danger mx-8'
                        style={{background:"red"}}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={addCancellationPolicyRow}
                    className='btn btn-sm btn-primary mt-4 w-25'
                  >
                  + Add Details
                  </button>
                </div>
                <hr
                  style={{
                    width: '100%',
                    borderTop: '2px dashed #327113',
                    borderBottom: '1px solid transparent',
                    margin: '10px',
                  }}
                />
                <div className='w-100 d-flex flex-column my-5'>
                  <label className='form-label fs-5 required'>Amenities</label>
                  {packageData.amenities.map((amenity, index) => (
                    <div key={index} className='my-2 d-flex gap-12 align-items-center'>
                      <div className="d-flex w-25 flex-column">
                        <label className='form-label'>Icon</label>
                        <div>
                          {loading ? (
                            <div style={{ color: "#000" }}>Loading...</div>
                          ) : (
                            amenity.icon ? (
                              <div
                                style={{
                                  border: '2px dashed gray',
                                  width: '100%',
                                  height: 150,
                                  borderRadius: '10px',
                                  justifyContent: 'center',
                                  textAlign: 'center',
                                }}
                              >
                                <div
                                  onClick={() => removeAmenity(index)}
                                  style={{
                                    justifyContent: 'flex-end',
                                    position: 'relative',
                                    backgroundColor: 'white',
                                    padding: 7,
                                    borderRadius: 50,
                                    left: "10px",
                                    width: "35px",
                                    zIndex: "1",
                                    cursor: 'pointer',
                                  }}
                                >
                                  <ClearIcon style={{ color: 'red' }} />
                                </div>
                                <img
                                  src={amenity.icon}
                                  style={{ maxWidth: '100%', maxHeight: '100%', position: "relative", marginTop: "-35px" }}
                                />
                              </div>
                            ) : (
                              <div
                                style={{
                                  border: '2px dashed gray',
                                  width: '100%',
                                  height: 150,
                                  borderRadius: '10px',
                                  justifyContent: 'center',
                                  textAlign: 'center',
                                  paddingTop: 10,
                                }}
                              >
                                <button
                                  type='button'
                                  onClick={() => handleIconUpload(index)}
                                  className='btn btn-lg btn-success me-3 mt-7'
                                  style={{ justifyContent: 'flex-end', backgroundColor: '#327113' }}
                                >
                                  <span className='indicator-label'>Select Icon</span>
                                </button>
                                <p className='text-bold pt-5 fs-9' style={{ color: '#555555' }}>
                                  Upload icons of dimensions 64x64.
                                </p>
                                <input
                                  type='file'
                                  ref={iconFileInputRef}
                                  style={{ display: 'none' }}
                                  accept="image/*"
                                  onChange={(e) => handleIconSelect(e, index)}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div className="d-flex flex-column">
                        <label className='form-label'>Name</label>
                        <Field
                          type='text'
                          name={`amenities[${index}].name`}
                          value={amenity.name}
                          onChange={(e) => handleNameChange(index, e.target.value)}
                          className='form-control form-control-lg form-control-solid w-100'
                          style={inputStyle}
                        />
                      </div>
                      <button
                        type='button'
                        onClick={() => removeAmenity(index)}
                        className='btn btn-sm btn-danger mt-8 mx-8'
                        style={{ background: "red" }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={addAmenity}
                    className='btn btn-sm btn-primary mt-4 w-25'
                  >
                    + Add Amenity
                  </button>
                </div>


              </div>
            </div>
            <button type='submit' className='btn btn-lg btn-success mt-5' style={{ width: '100%' }}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddPackageForm;
