import React, { useState, useEffect } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import axiosInstance from '../../helpers/axiosInstance';
import { ICreateAccount, inits } from '../../modules/wizards/components/CreateAccountWizardHelper';
import toast, { Toaster } from 'react-hot-toast';

const inputStyle = {
    border: '1px solid #d3d3d3', 
    borderRadius: '10px', 
    padding: '10px',
    paddingLeft: '20px', 
    width: '90%', 
    boxSizing: 'border-box',
};

function EditVisa({ visasData, selectedItem, onClose, selectedCountry, fromCountry }) {
    const [editedData, setEditedData] = useState(visasData);
    const [initValues] = useState<ICreateAccount>(inits)
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        visa_actual_price: visasData.visa_actual_price,
        visa_price_retailer: visasData.visa_price_retailer,
        visa_price_partner: visasData.visa_price_partner,
        visa_price_b2c: visasData.visa_price_b2c,
        visa_provide: visasData.visa_provide,
        visa_processing_time: visasData.visa_processing_time,
        visa_duration: visasData.visa_duration,
        visa_description: visasData.visa_description,
        pan_doc:visasData.pan_doc,
        letter_doc:visasData.letter_doc,
        ticket_doc:visasData.ticket_doc,
        itr_doc:visasData.pan_doc,
      })
    useEffect(() => {
        setEditedData(visasData);
    }, [visasData]);

    const handleFieldChange = (fieldName, value, index) => {
        const updatedData = [...editedData];
        updatedData[index] = { ...updatedData[index], [fieldName]: value };
        setEditedData(updatedData);
      }

      const handleDeleteVisa = (index) => {
        const updatedData = [...editedData];
        updatedData.splice(index, 1);
        setEditedData(updatedData);
    }

    const handleCheckboxChange = (fieldName, index) => {
        const updatedData = [...editedData];
        updatedData[index] = { ...updatedData[index], [fieldName]: !updatedData[index][fieldName] };
        setEditedData(updatedData);
    }

    const handleSave = async () => {
        try {
            await axiosInstance.post('/backend/update_visa', {
                country_code: selectedCountry,
                nationality_code: fromCountry,
                visas: editedData
            });
            toast.success('Visas Updated Successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 2500);
            onClose();
        } catch (error) {
            console.error('Error updating visa:', error);
        }
    };

    return (
        <Formik
            initialValues={formData}
            onSubmit={handleSave}
        >
            {() => (
                <Form style={{ marginLeft: "50px" }} className='py-20 d-flex justify-content-center flex-wrap px-9' noValidate id='kt_create_account_form'>
                    <h1 style={{marginTop:"-40px", marginBottom:"20px", marginLeft:"-20px"}} >Edit Visa's Details</h1>
                    <Toaster />
                    {editedData.map((visa, index) => (
                        <div key={index} className='px-auto my-4 w-100 d-flex flex-row flex-wrap'> 
                            <hr
                                style={{
                                    width: '100%',
                                    borderTop: '2px dashed #327113',
                                    borderBottom: '1px solid transparent',
                                    marginBottom: '30px',
                                }}
                            />
                            <div className='w-50 d-flex flex-column my-5'>
                                <label className='form-label fs-5 required'>Visa price</label>
                                <Field
                                    type='number'
                                    name={`visa_actual_price_${index}`}
                                    className='form-control form-control-lg form-control-solid'
                                    style={inputStyle}
                                    value={visa.visa_actual_price}
                                    onChange={(e) => handleFieldChange('visa_actual_price', e.target.value, index)}
                                />
                                <div className='text-danger mt-2'>
                                    <ErrorMessage name={`visa_actual_price_${index}`} />
                                </div>
                            </div>
                            <div className='w-50 d-flex flex-column my-5'>
                                <label className='form-label fs-5 required'>Visa Retailer price</label>
                                <Field
                                    type='number'
                                    name={`visa_price_retailer_${index}`}
                                    className='form-control form-control-lg form-control-solid'
                                    style={inputStyle}
                                    value={visa.visa_price_retailer}
                                    onChange={(e) => handleFieldChange('visa_price_retailer', e.target.value, index)}
                                />
                                <div className='text-danger mt-2'>
                                    <ErrorMessage name={`visa_price_retailer_${index}`} />
                                </div>
                            </div>
                            <div className='w-50 d-flex flex-column my-5'>
                                <label className='form-label fs-5 required'>Visa Partner price</label>
                                <Field
                                    type='number'
                                    name={`visa_price_partner_${index}`}
                                    className='form-control form-control-lg form-control-solid'
                                    style={inputStyle}
                                    value={visa.visa_price_partner}
                                    onChange={(e) => handleFieldChange('visa_price_partner', e.target.value, index)}
                                />
                                <div className='text-danger mt-2'>
                                    <ErrorMessage name={`visa_price_partner_${index}`} />
                                </div>
                            </div>
                            <div className='w-50 d-flex flex-column my-5'>
                                <label className='form-label fs-5 required'>Visa B2C price</label>
                                <Field
                                    type='number'
                                    name={`visa_price_b2c_${index}`}
                                    className='form-control form-control-lg form-control-solid'
                                    style={inputStyle}
                                    value={visa.visa_price_b2c}
                                    onChange={(e) => handleFieldChange('visa_price_b2c', e.target.value, index)}
                                />
                                <div className='text-danger mt-2'>
                                    <ErrorMessage name={`visa_price_b2c_${index}`} />
                                </div>
                            </div>
                            <div className='w-50 d-flex flex-column my-5'>
                                <label className='form-label fs-5 required'>Visa provider</label>
                                <Field
                                    as='select'
                                    name={`visa_provide_${index}`}
                                    className='form-control form-control-lg form-control-solid'
                                    style={inputStyle}
                                    value={visa.visa_provide}
                                    onChange={(e) => handleFieldChange('visa_provide', e.target.value, index)}
                                >
                                    <option value='Visa247'>Visa247</option>
                                </Field>
                                <div className='text-danger mt-2'>
                                    <ErrorMessage name={`visa_provide_${index}`} />
                                </div>
                            </div>
                            <div className='w-50 d-flex flex-column my-5'>
                                <label className='form-label fs-5 required'>Visa processing time (In Days)</label>
                                <Field
                                    type='number'
                                    name={`visa_processing_time_${index}`}
                                    className='form-control form-control-lg form-control-solid'
                                    style={inputStyle}
                                    value={visa.visa_processing_time}
                                    onChange={(e) => handleFieldChange('visa_processing_time', e.target.value, index)}
                                />
                                <div className='text-danger mt-2'>
                                    <ErrorMessage name={`visa_processing_time_${index}`} />
                                </div>
                            </div>
                            <div className='w-50 d-flex flex-column my-5'>
                                <label className='form-label fs-5 required'>Visa duration (In Days)</label>
                                <Field
                                    type='number'
                                    name={`visa_duration_${index}`}
                                    className='form-control form-control-lg form-control-solid'
                                    style={inputStyle}
                                    value={visa.visa_duration}
                                    onChange={(e) => handleFieldChange('visa_duration', e.target.value, index)}
                                />
                                <div className='text-danger mt-2'>
                                    <ErrorMessage name={`visa_duration_${index}`} />
                                </div>
                            </div>
                            <div className='w-50 d-flex flex-column my-5'>
                                <label className='form-label fs-5 required'>Visa description</label>
                                <Field
                                    as='textarea'
                                    name={`visa_description_${index}`}
                                    className='form-control form-control-lg form-control-solid'
                                    rows={3}
                                    style={{ ...inputStyle }}
                                    value={visa.visa_description}
                                    onChange={(e) => handleFieldChange('visa_description', e.target.value, index)}
                                />
                                <div className='text-danger mt-2'>
                                    <ErrorMessage name={`visa_description_${index}`} />
                                </div>
                            </div>
                            <div style={{marginTop:"-20px"}} className='w-50 d-flex flex-column gap-3'>
                            <label className='form-label fs-5 required'>Documents Required</label>
                            <div className='d-flex flex-column gap-3'>
                                <div className="form-check">
                                <Field
                                    type='checkbox'
                                    name={`pan_doc_${index}`}
                                    id={`pan_doc_${index}`}
                                    checked={visa.pan_doc}
                                    onChange={() => handleCheckboxChange('pan_doc', index)}
                                    className="form-check-input"
                                />
                                <label className="form-check-label mx-3 fs-5" htmlFor="pan_doc">PAN Card</label>
                                </div>
                                <div className="form-check">
                                <Field
                                    type='checkbox'
                                    name={`letter_doc_${index}`}
                                    id={`letter_doc_${index}`}
                                    checked={visa.letter_doc}
                                    onChange={() => handleCheckboxChange('letter_doc', index)}
                                    className="form-check-input"
                                />
                                <label className="form-check-label mx-3 fs-5" htmlFor="letter_doc">Letter</label>
                                </div>
                                <div className="form-check">
                                <Field
                                    type='checkbox'
                                    name={`ticket_doc_${index}`}
                                    id={`ticket_doc_${index}`}
                                    checked={visa.ticket_doc}
                                    onChange={() => handleCheckboxChange('ticket_doc', index)}
                                    className="form-check-input"
                                />
                                <label className="form-check-label mx-3 fs-5" htmlFor="ticket_doc">Ticket</label>
                                </div>
                                <div className="form-check">
                                <Field
                                    type='checkbox'
                                    name={`itr_doc_${index}`}
                                    id={`itr_doc_${index}`}
                                    checked={visa.itr_doc}
                                    onChange={() => handleCheckboxChange('itr_doc', index)}
                                    className="form-check-input"
                                />
                                <label className="form-check-label mx-3 fs-5" htmlFor="itr_doc">ITR</label>
                                </div>
                            </div>
                            </div>
                            <div style={{alignItems:"center", marginTop:"60px"}} className='w-50 d-flex flex-column'>
                                <button
                                    type='button'
                                    className='btn'
                                    onClick={() => handleDeleteVisa(index)}
                                    style={{ background:"red", color:"#fff"}}
                                >
                                    Remove this Visa
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className='d-flex justify-content-center mt-16 w-100'>
                        <button
                            type='button'
                            onClick={handleSave} 
                            className='btn'
                            style={{ background:"#327113", marginLeft:"-40px", color:"#fff"}}
                        >
                            Save Changes
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default EditVisa;
