import React, { useState, useEffect, CSSProperties } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axiosInstance from '../helpers/axiosInstance'
import toast, { Toaster } from 'react-hot-toast';
import { KTIcon } from '../../_metronic/helpers';
import { CloseOutlined } from '@mui/icons-material';
import AddPackageForm from './AddPackageForm';

type Package = {
    _id: string;
    packageName: string;
    duration: string;
    total_seats: string;
    booked_seats: string;
    total_package_cost: string;
    departure_date: string;
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

const PackageTable = ({ data }: Props) => {
  const [visaFields, setVisaFields] = useState(1);
  const [toggleVisible, setToggleVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  

  const handleClickOpen = (item) => {
    setOpen(!open)
    setId(item._id)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleVisibilityClick = (item) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const handleCloseClick = () => {
    setSelectedItem(null)
    setVisible(false)
  }

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/backend/packages/${id}`);
      toast.success('Package Deleted successfully!');
      setTimeout(() => {
        window.location.reload();
    }, 2000);
    } catch (error) {
      toast.error('Error Deleting package.');
    }
  };

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
                <span className='card-label text-gray-600 fw-bold fs-3'>Recently Added Packages</span>
              </h3>
            </div>
            <div className='card-body py-3'>
              <div className='table-responsive'>
                <table className='table table-row-bordered table-row-gray-300 align-middle gs-0 gy-3'>
                  <thead>
                    <tr className='fw-bold '>
                      <th className='fs-5 min-w-200px'>Package Name</th>
                      <th className='fs-5 min-w-100px'>Duration</th>
                      <th className='fs-5 min-w-100px'>Seats Booked</th>
                      <th className='fs-5 min-w-100px'>Cost</th>
                      <th className='fs-5 min-w-100px'>Depart Date</th>
                      <th className='fs-5 min-w-100px text-end'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {data.map((packageItem) => (
                    <tr key={packageItem._id}>
                      <td>
                        <a href='#' className='text-gray-600 fw-bold text-hover-primary fs-6'>
                            {packageItem.packageName}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-6'>
                            {packageItem.duration}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-6'>
                            {packageItem.booked_seats} / {packageItem.total_seats}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-6'>
                            ₹ {packageItem.total_package_cost}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-6'>
                          {formatDate(packageItem.departure_date)}
                        </a>
                      </td>
                      <td className='text-end'>
                      <button
                        title='Edit'
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      >
                        <KTIcon iconName='pencil' className='fs-3' />
                      </button>
                      <a title='Delete' onClick={() => handleDelete(packageItem._id)} href='#' className='btn btn-icon btn-bg-light btn-active-color-primary me-1 btn-sm'>
                        <KTIcon iconName='trash' className='fs-3' />
                      </a>
                    </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          <AddPackageForm inputStyle={inputStyle} />
        </div>
      </div>
      {visible && (
        <div className='loader-overlay' style={{ ...overlayStyle, ...(visible && activeOverlayStyle) }}>
          <div style={contentStyle}>
            <div onClick={() => handleCloseClick()} style={{ backgroundColor: '#d3d3d3', padding: "9px", position: "absolute", top: "10%", left: "89.5%", transform: "translate(-35%, -40%)", borderRadius: 20, cursor: 'pointer' }}>
              <CloseOutlined />
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default PackageTable;

