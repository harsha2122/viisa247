import React, { useState, useEffect, CSSProperties } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axiosInstance from '../helpers/axiosInstance'
import toast, { Toaster } from 'react-hot-toast';
import { KTIcon } from '../../_metronic/helpers';
import { CloseOutlined } from '@mui/icons-material';
import AddPackageForm from './AddPackageForm';
import { getScopedCssBaselineUtilityClass } from '@mui/material';
type Traveler = {
    name: string;
    email: string;
    phone: string;
    passFrontPhoto: string;
    passBackPhoto: string;
    travelerPhoto: string;
  }
type Package = {
    _id: string;
    package_name: string;
    duration: string;
    created_at: string;
    package_cost: string;
    package_payment_receipt: string;
    traveller_details: Traveler[]; // Update this line
  }
  type Props = {
    data: Package[];
  }

const inputStyle = {
  border: '1px solid #d3d3d3', 
  borderRadius: '10px', 
  padding: '10px',
  paddingLeft: '20px', 
  width: '90%', 
  boxSizing: 'border-box',
};

const overlayStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 0.3s, visibility 0.3s',
}

const activeOverlayStyle: CSSProperties = {
  opacity: 1,
  visibility: 'visible',
}
const contentStyle: CSSProperties = {
  backgroundColor: '#fff', 
  padding: '10px',
  borderRadius: '5px',
  width: '80%',
  height: '80%',
  overflowY: 'auto',
}

const PackageApplicationTable = ({ data }: Props) => {
  const [visaFields, setVisaFields] = useState(1);
  const [toggleVisible, setToggleVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Package | null>(null);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  

  const handleClickOpen = (item) => {
    setOpen(!open)
    setId(item._id)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleVisibilityClick = (item: Package) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const handleCloseClick = () => {
    setSelectedItem(null)
    setVisible(false)
  }


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    let dayWithSuffix;
    if (day === 1 || day === 21 || day === 31) {
      dayWithSuffix = `${day}st`;
    } else if (day === 2 || day === 22) {
      dayWithSuffix = `${day}nd`;
    } else if (day === 3 || day === 23) {
      dayWithSuffix = `${day}rd`;
    } else {
      dayWithSuffix = `${day}th`;
    }
  
    return `${dayWithSuffix} ${month} ${year}`;
  };


  return (
    <div>
      <Toaster />
      <div className='w-full pb-10' style={{ backgroundColor: '#fff', marginTop: '-80px' }}>
        <div className='px-10 pt-10'>
          <h1 className='text-xl font-bold my-5 mx-auto'>Package</h1>

          <section style={{border:"1px solid #adc6a0"}} className='w-100 card my-5 '>
            <div style={{borderBottom:"1.5px solid #327113"}} className='card-header'>
              <h3 className='card-title align-content-start flex-row'>
                <span className='card-label text-gray-600 fw-bold fs-3'>Recent Applications</span>
              </h3>
            </div>
            <div className='card-body py-3'>
              <div className='table-responsive'>
                <table className='table table-row-bordered table-row-gray-300 align-middle gs-0 gy-3'>
                  <thead>
                    <tr className='fw-bold '>
                      <th className='fs-5 min-w-200px'>Package Name</th>
                      <th className='fs-5 min-w-100px'>Cost</th>
                      <th className='fs-5 min-w-100px'>Traveler Count</th>
                      <th className='fs-5 min-w-100px'>Application Date</th>
                      <th style={{paddingRight:"6%"}} className='fs-5 min-w-100px text-end'>Info</th>
                    </tr>
                  </thead>
                  <tbody>
                  {data.map((packageApplication) => (
                    <tr key={packageApplication._id}>
                        <td>
                        <a href='#' className='text-gray-600 fw-bold text-hover-primary fs-6'>
                            {packageApplication.package_name}
                        </a>
                        </td>
                        <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-6'>
                            ₹ {new Intl.NumberFormat('en-IN').format(Number(packageApplication.package_cost))}
                        </a>
                        </td>
                        <td>
                        <a style={{marginLeft:"-35px"}} href='#' className='text-muted text-center text-hover-primary d-block mb-1 fs-6'>
                            {packageApplication.traveller_details.length}
                        </a>
                        </td>
                        <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-6'>
                            {formatDate(packageApplication.created_at)}
                        </a>
                        </td>
                        <td className='text-center'>
                        <button
                            title='View Details'
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            onClick={() => handleVisibilityClick(packageApplication)}
                        >
                            <KTIcon iconName='eye' className='fs-3' />
                        </button>
                        </td>
                    </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
      {visible && selectedItem && (
  <div className='loader-overlay' style={{ ...overlayStyle, ...(visible && activeOverlayStyle) }}>
    <div style={contentStyle}>
      <div onClick={() => handleCloseClick()} style={{ backgroundColor: '#d3d3d3', padding: "9px", position: "absolute", top: "10%", left: "89.5%", transform: "translate(-35%, -40%)", borderRadius: 20, cursor: 'pointer' }}>
        <CloseOutlined />
      </div>
      <div className="rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Traveler Details</h2>
        {selectedItem.traveller_details.map((traveler, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div>
                  <h3 style={{marginBottom:"15px"}} className="fs-4 font-semibold">Name - {traveler.name}</h3>
                  <p className="text-gray-600 fs-4">Email - {traveler.email}</p>
                  <p className="text-gray-600 fs-4">Contact - {traveler.phone}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
                <div style={{ gap: "30px", marginTop:"10px" }} className="d-flex w-100 items-center">
                    <div className="flex flex-col items-center">
                    <h5 className="text-lg font-semibold mb-2">Passport Front</h5>
                    <img src={traveler.passFrontPhoto} alt="Passport Front" style={{ width: '280px', height: '200px', marginBottom: '10px', borderRadius: '10px' }} />
                    </div>
                    <div className="flex flex-col items-center">
                    <h5 className="text-lg font-semibold mb-2">Passport Back</h5>
                    <img src={traveler.passBackPhoto} alt="Passport Back" style={{ width: '280px', height: '200px', marginBottom: '10px', borderRadius: '10px' }} />
                    </div>
                    <div className="flex flex-col items-center">
                    <h5 className="text-lg font-semibold mb-2">Traveler Photo</h5>
                    <img src={traveler.travelerPhoto} alt="Traveler" style={{ width: '280px', height: '200px', marginBottom: '10px', borderRadius: '10px' }} />
                    </div>
                </div>
            </div>
            <hr style={{
                width:"100%",
                border: 0,
                margin:"30px 0px 0px 0px",
                height: "0.5px",
                backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0))"
            }} />
          </div>
          
        ))}
        <hr style={{
            width:"100%",
            border: 0,
            height: "0.5px",
            backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0))"
        }} />
        <div className="flex justify-center px-10 items-start">
          <h2 style={{marginBottom:"30px"}} className="text-2xl font-bold text-center">Receipt Image</h2>
          <h2 style={{marginBottom:"30px", fontWeight:"500"}}>Receipt of amount - ₹ {selectedItem.package_cost}</h2>
          <img src={selectedItem.package_payment_receipt} alt="Receipt" style={{ width: '280px', height: '200px', marginBottom: '10px', borderRadius: '10px' }} />
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default PackageApplicationTable;

