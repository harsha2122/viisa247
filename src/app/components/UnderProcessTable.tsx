/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { CSSProperties, useState, useRef, ChangeEvent } from 'react';
import { KTIcon, toAbsoluteUrl } from '../../_metronic/helpers'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { CloseOutlined, DeleteOutline } from '@mui/icons-material'
import ApplicationFormView from './ApplicationFormView'
import axiosInstance from '../helpers/axiosInstance'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'
import ClearIcon from '@mui/icons-material/Delete'
import { FcOk } from "react-icons/fc";
import Cookies from 'js-cookie'
import { FcInfo } from "react-icons/fc";
import Pagination from 'react-bootstrap/Pagination';

type Props = {
  className: string
  title: String,
  data: any[];
  loading:Boolean
  onDataChange: (data: any) => void;
}
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
};

const activeOverlayStyle: CSSProperties = {
  opacity: 1,
  visibility: 'visible',
};
const contentStyle: CSSProperties = {
  backgroundColor: '#fff',
  padding: '10px',
  borderRadius: '5px',
  width: '70%',
  height: '70%',
  overflowY: 'auto'
};



const UnderProcessTable: React.FC<Props> = ({ className, title, data,loading, onDataChange }) => {
  const [visible, setVisible] = useState(false);
  const [visiblee, setVisiblee] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [issueVisaLoader, setissueVisaLoader] = useState(false);
  const [deleteSelectedItem, setDeleteSelectedItem] = useState(null);
  const [open, setOpen] = React.useState(false);
  const visaFileInputRef = useRef<HTMLInputElement | null>(null)
  const [visa, setVisa] = useState('')
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const maxSize = 1024 * 1024; 
  const MAX_VISIBLE_PAGES = 7; 
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const [formData, setFormData] = useState({
    visa: '',
    
  })

  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);

  const visiblePages: (number | string)[] = [];

  const addVisiblePage = (page: number | string) => {
    visiblePages.push(page);
  };

  const addRangeOfPages = (start: number, end: number) => {
    for (let i = start; i <= end; i++) {
      addVisiblePage(i);
    }
  };

  if (totalPages <= MAX_VISIBLE_PAGES) {
    addRangeOfPages(1, totalPages);
  } else {
    if (activePage <= MAX_VISIBLE_PAGES - 3) {
      addRangeOfPages(1, MAX_VISIBLE_PAGES - 2);
      addVisiblePage('...');
      addVisiblePage(totalPages - 1);
      addVisiblePage(totalPages);
    } else if (activePage >= totalPages - (MAX_VISIBLE_PAGES - 4)) {
      addVisiblePage(1);
      addVisiblePage('...');
      addRangeOfPages(totalPages - (MAX_VISIBLE_PAGES - 3), totalPages);
    } else {
      addVisiblePage(1);
      addVisiblePage('...');
      addRangeOfPages(activePage - 1, activePage + 1);
      addVisiblePage('...');
      addVisiblePage(totalPages);
    }
  }

  const handleClickOpen = (item) => {
    setDeleteSelectedItem(item)
    setOpen(!open);
  };

  const handleClose = () => {
    setDeleteSelectedItem(null)
    setOpen(false);
  };

  const handleVisibilityClick = (item) => {
    setSelectedItem(item); // Set the selected item
    setVisible(true);
  };
  const handleCloseClick = () => {
    setSelectedItem(null); // Set the selected item
    setVisible(false);
  };

  const handleVisibilityyClick = (row) => {
    if (row && row._id) {
        setSelectedRowId(row._id); // Set the id of the selected row
        setSelectedItem(row);
        setVisiblee(true);
    } else {
        console.error('Row or row id is undefined.');
    }
};


  const handleCloseeClick = () => {
    setSelectedItem(null); // Set the selected item
    setVisiblee(false);
  };
  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axiosInstance.post('/backend/upload_image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const fileUrl = response.data.data
      return fileUrl 
    } catch (error) {
      console.error('Error uploading file:', error)
      return ''
    }
  }
  const handleVisaSelectButtonClick = () => {
    if (visaFileInputRef.current) {
      visaFileInputRef.current.click();
    }
  }
  
  const handleVisaSelect = async (event: ChangeEvent<HTMLInputElement>) => {
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
          const fileLink = await handleFileUpload(file);
          setVisa(fileLink); // Update the visa state with the file link
          try {
            const fileLink = await handleFileUpload(file);
            setFormData({ ...formData, visa: fileLink });
  
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleSaveAndUpload = async () => {
    try {
      if (selectedRowId && formData.visa) {
        const response = await axiosInstance.post('/backend/upload_visa_file', {
          id: selectedRowId,
          visa_pdf: formData.visa,
        });
        setVisiblee(false);
        toast.success('Visa Uploaded successfully!');
          setTimeout(() => {
            window.location.reload();
        }, 2500);
      } else {
        console.error('Selected row id or visa data is null.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  console.log("as", data)
  return (
    <div style={{boxShadow:"none"}} className={`card ${className}`}>
      <Toaster />
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 style={{marginLeft:"10px"}} className='card-title align-items-center flex-row'>
          <span className='card-label fw-bold fs-3 mb-1'>{title}</span>
          <span className='fs-6 text-gray-400 fw-bold'>{title == 'VISA' && '30 days'}</span>
        </h3>
        {title == 'VISA' && (
          <div className='d-flex flex-wrap my-2'>
            <div className='me-4'>
              <select
                name='status'
                data-control='select2'
                data-hide-search='true'
                className='form-select form-select-sm form-select-white w-125px'
                defaultValue='30 Days'
              >
                <option value='30 Days'>30 Days</option>
                <option value='Approved'>In Progress</option>
                <option value='Declined'>To Do</option>
                <option value='In Progress'>Completed</option>
              </select>
            </div>
          </div>
        )}
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          {loading ?
            <div style={{ height: 300, overflowX: 'hidden', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <span className='indicator-progress' style={{ display: 'block' }}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            </div>
            :
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
                      <th className='fs-5 min-w-160px'>Name</th>
                      <th className='fs-5 min-w-100px'>Email</th>
                      <th className='fs-5 min-w-100px'>Contact</th>
                      <th className='fs-5 min-w-40px'>From</th>
                      <th className='fs-5 text-center min-w-40px'>To</th>
                      <th className='fs-5 text-center min-w-70px'>Date</th>
                      <th className='fs-5 text-center min-w-70px'>Status</th>
                      <th className='fs-5 text-center min-w-70px'>Amount</th>
                      <th className='fs-5 min-w-100px text-center'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {data.slice(startIndex, endIndex).map((row, index) => (
                    <tr key={index}>
                      <td>
                        <a href='#' className='text-gray-600 fw-bold text-hover-primary fs-7'>
                          {row.first_name}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                            {row.merchant_email_id || row.customer_email_id}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                          {row.merchant_phone_number || row.customer_phone_number}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                          {row.nationality}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-center text-muted text-hover-primary d-block mb-1 fs-7'>
                          {row.application_destination}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-center text-muted text-hover-primary d-block mb-1 fs-7'>
                          {row.application_departure_date}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-center text-muted text-hover-primary d-block mb-1 fs-7'>
                          {row.visa_status}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-center text-hover-primary d-block mb-1 fs-7'>
                          ₹ {new Intl.NumberFormat('en-IN').format(Number(row.visa_amount))}
                        </a>
                      </td>
                      <td className='d-flex justify-content-center gap-2'>
                      <button
                        title='Edit'
                        onClick={() => handleVisibilityClick(row)}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      >
                        <KTIcon iconName='pencil' className='fs-3' />
                      </button>
                      <div className='d-flex align-items-center justify-content-around flex-shrink-0'>
                      {row.visa_pdf === null ? (
                        <button
                        title='Upload Visa'
                        onClick={() => handleVisibilityyClick(row)}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      >
                        <KTIcon iconName='exit-up' className='fs-3' />
                      </button>
                      ) : (
                        <FcOk title='Already Uploaded' style={{fontSize:"35px"}} />
                      )}
                      </div>

                    </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          }
          <div className="d-flex justify-content-center">
          <Pagination>
                {visiblePages.map((page, index) => (
                  <Pagination.Item
                    key={index}
                    active={page === activePage}
                    onClick={() => handlePageChange(typeof page === 'number' ? page : activePage)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
              </Pagination>
              </div>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
      {issueVisaLoader &&
        <Loader loading={issueVisaLoader} />
      }
      {visible &&
        <div className='loader-overlay' style={{ ...overlayStyle, ...(visible && activeOverlayStyle), }}>
          <div style={contentStyle}>
            <div onClick={() => handleCloseClick()} style={{ backgroundColor: '#d3d3d3', padding: 10, position: 'absolute', right: "193px", borderRadius: 20, cursor: 'pointer', top: '83px' }}>
              <CloseOutlined />
            </div>
            <ApplicationFormView viewApplication={selectedItem} />
          </div>
        </div>
      }
      {visiblee && (
  <div className='loader-overlay' style={{ ...overlayStyle, ...(visiblee && activeOverlayStyle), }}>
    <div style={contentStyle}>
      <div onClick={() => handleCloseeClick()} style={{ backgroundColor: '#d3d3d3', padding: 10, position: 'absolute', right: "193px", borderRadius: 20, cursor: 'pointer', top: '83px' }}>
        <CloseOutlined />
      </div>
      {visa ? (
        <div
          style={{
            border: '4px dotted gray',
            width: '50%',
            height: 300,
            borderRadius: '10px',
            justifyContent: 'center',
            textAlign: 'center',
            margin:"0 auto",
            position:"relative",
            top:"60px"
          }}
        >
          <div
            onClick={() => setVisa('')}
            style={{
              justifyContent: 'flex-end',
              position: 'relative',
              backgroundColor: 'white',
              padding: 7,
              borderRadius: 50,
              left: "10px",
              width:"35px",
              zIndex:"1",
              cursor: 'pointer',
            }}
          >
            <ClearIcon style={{ color: 'red' }} />
          </div>
          <div>
            <p>File Name: Traveler Visa </p>
            <p>pdf file</p>
            <button onClick={handleSaveAndUpload} className='btn btn-lg btn-primary me-3 mt-7' style={{ justifyContent: 'flex-end' }}>
              <span className='indicator-label'>Save and Upload</span>
            </button>

          </div>
        </div>
      ) : (
        <div
          style={{
            border: '4px dotted gray',
            width: '50%',
            height: 300,
            borderRadius: '10px',
            justifyContent: 'center',
            textAlign: 'center',
            paddingTop: 40,
            margin:"0 auto",
            position:"relative",
            top:"60px"
          }}
        >
          <h4 className='mx-10 mt-10'>Upload Traveler's Visa</h4>
          <button
            type='button'
            onClick={() => handleVisaSelectButtonClick()}
            className='btn btn-lg btn-success me-3 mt-7'
            style={{ justifyContent: 'flex-end', backgroundColor: '#327113' }}
          >
            <span className='indicator-label'>Select Files</span>
          </button>
          <p className='text-bold pt-5 fs-9' style={{ color: '#555555' }}>
            Supports pdf Only.
          </p>
          <input
            type='file'
            ref={visaFileInputRef}
            style={{ display: 'none' }}
            accept="application/pdf"
            onChange={handleVisaSelect}
          />
        </div>
      )}
    </div>
  </div>
)}

    </div>
  )
}

export { UnderProcessTable }
