/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { CSSProperties, useState, useRef, ChangeEvent } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../_metronic/helpers'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { CloseOutlined, DeleteOutline } from '@mui/icons-material'
import ApplicationFormView from './ApplicationFormView'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'
import Cookies from 'js-cookie'
import { FcCancel, FcInfo } from "react-icons/fc";
import axiosInstance from '../helpers/axiosInstance'
import Pagination from 'react-bootstrap/Pagination';
import InsuranceFormView from './InsuranceFormView'
import HotelFormView from './HotelFormView'

interface InsurancePayload {
  id: string;
  hotel_status: string;
  hotel_remark?: string;
  hotel_pdf?: string;
}

type TableRow = InsurancePayload & {
  first_name: string;
  merchant_email_id: string;
  merchant_phone_number: string;
  nationality: string;
  hotel_amount: string;
  _id: string;
};

type Props = {
  className: string
  title: String,
  data: any[];
  loading:Boolean
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

const inputStyle = {
  border: '1.5px solid #d3d3d3',
  borderRadius: '10px', 
  padding: '10px',
  paddingLeft: '20px', 
  width: '90%', 
  boxSizing: 'border-box', 
}



const Whwaiting: React.FC<Props> = ({ className, title, data}) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tableData, setTableData] = useState(data);
  const [issueVisaLoader, setissueVisaLoader] = useState(false);
  const [deleteSelectedItem, setDeleteSelectedItem] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [file, setFile] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [rejectRemark, setRejectRemark] = useState('');
  const hotelFileInputRef = useRef<HTMLInputElement | null>(null);
  const maxSize = 1024 * 1024

  const handleFileUpload = async (file) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('file', file)
      const response = await axiosInstance.post('/backend/upload_image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const fileUrl = response.data.data
      setLoading(false)
      return fileUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      setLoading(false)
      return ''
    }
  }

  const handleStatusChange = async (row: any, selectedStatus: string) => {
    setSelectedRow(row);
    if (selectedStatus === 'Reject') {
        setShowRejectModal(true);
    } else if (selectedStatus === 'Issue') {
        setShowIssueModal(true);
    }
  };

  const handleRejectSubmit = async () => {
      if (selectedRow) {
          try {
              const payload: InsurancePayload = {
                  id: selectedRow._id,
                  hotel_status: 'Rejected',
                  hotel_remark: rejectRemark,
              };

              const response = await axiosInstance.post('/backend/upload_hotel_file', payload);
              if (response.data.success === 1) {
                  toast.success('Application rejected successfully');
                  handleCloseRejectModal();
                  setTimeout(() => {
                    window.location.reload();
                  }, 2500);
              } else {
                  toast.error('Error rejecting application');
              }
          } catch (error) {
              console.error('Error submitting rejection:', error);
              toast.error('Error submitting rejection');
          }
      }
  };

  const handleIssueSubmit = async () => {
    if (selectedRow && selectedRow.hotel_pdf) {
      try {
        const payload: InsurancePayload = {
          id: selectedRow._id,
          hotel_status: 'Issued',
          hotel_pdf: selectedRow.hotel_pdf,
        };
  
        const response = await axiosInstance.post('/backend/upload_hotel_file', payload);
        if (response.data.success === 1) {
          toast.success('Hotel issued successfully');
          handleCloseIssueModal();
          setTimeout(() => {
            window.location.reload();
          }, 2500);
        } else {
          toast.error('Error issuing hotel');
        }
      } catch (error) {
        console.error('Error submitting issuance:', error);
        toast.error('Error submitting issuance');
      }
    } else {
      toast.error('Please upload the hotel file before submitting');
    }
  };
  

  console.log("sdfg", data)

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
  
    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds 300KB limit.', { position: 'top-center' });
        return;
      }
  
      try {
        const imageLink = await handleFileUpload(file);
        if (selectedRow) {
          setSelectedRow({
            ...selectedRow,
            hotel_pdf: imageLink,
          });
        }
        toast.success('File uploaded successfully', { position: 'top-center' });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Error uploading image. Please try again.', { position: 'top-center' });
      }
    }
  };
  


  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const MAX_VISIBLE_PAGES = 7; 
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

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
  const handleVisibilityyClick = (item) => {
    setSelectedItem(item); // Set the selected item
    setShowRejectModal(true);
  };
  const handleCloseClick = () => {
    setSelectedItem(null); // Set the selected item
    setVisible(false);
  };
  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectRemark('');
  };
  
  const handleCloseIssueModal = () => {
    setShowIssueModal(false);
    setFile(null);
  };
  
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
                      <th className='fs-5 min-w-40px'>To</th>
                      <th className='fs-5 min-w-40px'>Channel</th>
                      <th className='fs-5 text-center min-w-70px'>Status</th>
                      <th className='fs-5 text-center min-w-70px'>Amount</th>
                      <th className='fs-5 min-w-150px text-center'>Actions</th>
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
                          {row.nationality_code}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                          {row.country_code}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                          {row.customer_email_id ? 'Customer' : 'Merchant'}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-center text-muted text-hover-primary d-block mb-1 fs-7'>
                          {row.hotel_status}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-center text-hover-primary d-block mb-1 fs-7'>
                          ₹ {new Intl.NumberFormat('en-IN').format(Number(row.hotel_original_amount))}
                        </a>
                      </td>
                      <td className='text-end d-flex'>
                          <button
                              title='Edit'
                              onClick={() => handleVisibilityClick(row)}
                              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                          >
                              <KTIcon iconName='eye' className='fs-3' />
                          </button>
                          <select
                              className='form-select form-select-sm form-select-white w-75'
                              onChange={(e) => handleStatusChange(row, e.target.value)}
                          >
                              <option value='Not Issued'>Update</option>
                              <option value='Issue'>Issue</option>
                              <option value='Reject'>Reject</option>
                          </select>
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
            <HotelFormView viewApplication={selectedItem} />
          </div>
        </div>
      }
      {showRejectModal && (
          <div className='loader-overlay' style={{ ...overlayStyle, ...(showRejectModal && activeOverlayStyle) }}>
              <div style={contentStyle}>
                  <div onClick={handleCloseRejectModal} style={{ backgroundColor: '#d3d3d3', padding: 10, position: 'absolute', right: "193px", borderRadius: 20, cursor: 'pointer', top: '83px' }}>
                      <CloseOutlined />
                  </div>
                  <div style={{ justifyContent: "center", alignItems: "center", marginTop: "50px" }} className='d-flex flex-column gap-5'>
                      <h2>Reject Application</h2>
                      <textarea style={{ ...inputStyle, boxSizing: 'border-box' }} value={rejectRemark} onChange={(e) => setRejectRemark(e.target.value)} placeholder="Enter your remark"></textarea>
                      <button className='btn' style={{ background: "#327113", width: "100px", color: "#fff" }} onClick={handleRejectSubmit}>Reject</button>
                  </div>
              </div>
          </div>
      )}

      {showIssueModal && (
          <div className='loader-overlay' style={{ ...overlayStyle, ...(showIssueModal && activeOverlayStyle) }}>
              <div style={contentStyle}>
                  <div onClick={handleCloseIssueModal} style={{ backgroundColor: '#d3d3d3', padding: 10, position: 'absolute', right: "193px", borderRadius: 20, cursor: 'pointer', top: '83px' }}>
                      <CloseOutlined />
                  </div>
                  <div className='mb-5'>
                    <label className='form-label fw-bolder text-dark required fs-6'>Hotel Doc Upload</label>
                    <input
                      type='file'
                      ref={hotelFileInputRef}
                      className='form-control'
                      id='hotel_pdf'
                      name='hotel_pdf'
                      accept='.pdf'
                      onChange={handleFileSelect}
                    />
                  </div>
                  <div>
                      <button 
                          className='btn btn-primary' 
                          onClick={handleIssueSubmit}
                          disabled={!selectedRow || !selectedRow.hotel_pdf}
                      >
                          Upload
                      </button>
                  </div>
              </div>
          </div>
      )}


    </div>
  )
}

export { Whwaiting }
