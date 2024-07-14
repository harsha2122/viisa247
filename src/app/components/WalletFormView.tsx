import { useEffect, useState, useRef, ChangeEvent } from 'react'
import { ErrorMessage, Field, Form, Formik, FormikValues } from 'formik'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../helpers/axiosInstance'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ICreateAccount, inits } from '../modules/wizards/components/CreateAccountWizardHelper'
function WalletFormView({ viewApplication }) {
    const handleDownload = () => {
        const imageUrl = viewApplication?.receipt || '';
        const link = document.createElement('a');
        link.href = imageUrl;
        const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [initValues] = useState<ICreateAccount>(inits)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthPlace: '',
        birthDetail: '',
        gender: '',
        maritalStatus: '',
        fatherName: '',
        motherName: '',
        panNumber: '',
        passportNumber: '',
        passportIssueDate: '',
        passPortExpiryDate: '',
        passFrontPhoto: '',
        passBackPhoto: '',
        travelerPhoto: '',
        panNo: '',
        panPhoto: '',
    })

    const inputStyle = {
        border: '1.5px solid #d3d3d3', // Border width and color
        borderRadius: '10px', // Border radius
        padding: '10px',
        paddingLeft: '20px', // Padding
        width: '90%', // 100% width
        boxSizing: 'border-box', // Include padding and border in the width calculation
    }


    return (
        <div
            className='py-10 px-20'
            // style={{
            //     borderRadius: 20,
            //     borderColor: '#f5f5f5',
            //     boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            //     marginLeft: 10,
            //     marginTop: 20,
            //     backgroundColor: 'white',
            // }}
        >

            <div className='d-flex ' style={{ width: '100%' }}>
                <div style={{ width: '40%', marginTop: 50 }}>
                    <h6>Receipt Image</h6>
                    <div
                        style={{
                            border: '4px dotted gray',
                            width: '100%',
                            height: 300,
                            borderRadius: '10px',
                            justifyContent: 'center',
                            textAlign: 'center',
                            marginTop: 10,
                        }}
                    >
                        <div
                            style={{
                                justifyContent: 'flex-end',
                                position: 'absolute',
                                backgroundColor: 'white',
                                padding: 7,
                                borderRadius: 50,
                                cursor: 'pointer',
                            }}
                        ></div>
                        <img
                            src={viewApplication?.receipt || ''}
                            alt='Uploaded Image'
                            style={{ maxWidth: '100%', maxHeight: '100%',  }}
                        />
                    </div>
                </div>

                <div
                    className='d-flex flex-row-fluid flex-center bg-body rounded'
                    style={{ width: '70%', backgroundColor: 'blue' }}
                >
                    <Formik initialValues={initValues} onSubmit={() => { }}>
                        {() => (
                            <Form className='py-20 px-9' noValidate id='kt_create_account_form'>
                                <div className='fv-row mb-10'>
                                    <label className='d-flex align-items-center form-label'>
                                        <span className='required'>Transaction Id</span>
                                    </label>

                                    <Field
                                        style={{ ...inputStyle, width: '450px' }}
                                        readOnly
                                        value={viewApplication.upi_ref_id}
                                        name='fatherName'
                                        className='form-control form-control-lg form-control-solid'
                                    />
                                    <div className='text-danger mt-2'>
                                        <ErrorMessage name='fatherName' />
                                    </div>
                                </div>

                                <div className='fv-row mb-10'>
                                    <label className='d-flex align-items-center form-label'>
                                        <span className='required'>Amount</span>
                                    </label>

                                    <Field
                                        style={{ ...inputStyle, width: '450px' }}
                                        name='motherName'
                                        readOnly
                                        value={viewApplication.wallet_balance}
                                        className='form-control form-control-lg form-control-solid'
                                    />
                                    <div className='text-danger mt-2'>
                                        <ErrorMessage name='motherName' />
                                    </div>
                                </div>

                                <button
                                onClick={handleDownload}
                                style={{
                                    position: 'relative',
                                    color: '#fff',
                                    border: 'none',
                                    backgroundColor: '#327113',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                }}
                            >
                                Download Receipt
                            </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

        </div>
    )
}

export default WalletFormView
