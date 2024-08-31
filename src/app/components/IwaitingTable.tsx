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
import { Accordion, Button, Table } from 'react-bootstrap';
import InsuranceFormView from './InsuranceFormView'

interface InsurancePayload {
  id: string;
  insurance_status: string;
  insurance_remark?: string;
  insurance_pdf?: string;
}

type TableRow = InsurancePayload & {
  first_name: string;
  merchant_email_id: string;
  merchant_phone_number: string;
  nationality: string;
  insurance_amount: string;
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



const IwaitingTable: React.FC<Props> = ({ className, title, data}) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tableData, setTableData] = useState(data);
  const [issueVisaLoader, setissueVisaLoader] = useState(false);
  const [deleteSelectedItem, setDeleteSelectedItem] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const insuranceFileInputRef = useRef<HTMLInputElement | null>(null);
  const maxSize = 1024 * 1024
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemark, setRejectRemark] = useState('');
  const [selectedRow, setSelectedRow] = useState<TableRow[]>([])
  const [selectedRows, setSelectedRows] = useState<TableRow[]>([])
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([])
  const [showResubmitModal, setShowResubmitModal] = useState(false)

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

const handleStatusChange = async (applications, selectedStatus) => {
    if (selectedStatus === 'Reject') {
      setSelectedRow(applications)
      setShowRejectModal(true);
    } else if (selectedStatus === 'Re-Submit') {
      setSelectedRow(applications)
      setShowResubmitModal(true);
    } else {
      try {
        const payload = applications.map(app => ({
          id: app._id,
          insurance_status: selectedStatus,
        }));
  
        const response = await axiosInstance.post('/backend/upload_insurance_file', payload);
  
        if (response.status === 200) {
          const updatedData = tableData.map(item => {
            const app = payload.find(p => p.id === item._id);
            return app ? { ...item, insurance_status: app.insurance_status } : item;
          });
          setTableData(updatedData);
          toast.success('Status updated successfully');
        } else {
          toast.error('Failed to update status');
        }
      } catch (error) {
        console.error('Error updating status:', error);
        toast.error('Failed to update status');
      }
    }
  };

  const handleResubmitSubmit = async () => {
    try {
      const payload = {
        ids: selectedApplicants,
        insurance_status: 'Re-Submit',
        insurance_remark: rejectRemark,
      };
  
      const response = await axiosInstance.post('/backend/upload_insurance_file', payload);
  
      if (response.data.success === 1) {
        setShowRejectModal(false);
        setSelectedApplicants([]);
        setRejectRemark('');
        toast.success('Applications resubmitted successfully');
      } else {
        toast.error('Error resubmitting the applications');
      }
    } catch (error) {
      console.error('Error submitting resubmission:', error);
      toast.error('Error submitting resubmission');
    }
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectRemark('');
  };

  const handleCloseResubmitModal = () => {
    setShowResubmitModal(false);
    setRejectRemark('');
  };

  const handleReject = async (selectedItem) => {
    try {
      const response = await axiosInstance.post('/backend/upload_insurance_file', {
        id: selectedItem._id,
        insurance_status: 'Reject',
        insurance_remark: rejectRemark,
      });
  
      if (response.status === 200) {
        const updatedData = tableData.map(item => {
          if (item._id === selectedItem._id) {
            return { ...item, insurance_status: 'Reject' };
          }
          return item;
        });
        setTableData(updatedData);
        setShowRejectModal(false);
        toast.success('Status updated successfully');
        setRejectRemark('');
        setSelectedItem(null);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error('Failed to update status: Server error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status: Network error');
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
  
  const handleCloseIssueModal = () => {
    setShowIssueModal(false);
    setFile(null);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedApplicants((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((applicantId) => applicantId !== id);
      } else {
        return [...prevState, id];
      }
    });
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
            {loading ? (
              <div
                style={{
                  height: 300,
                  overflowX: 'hidden',
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <span className='indicator-progress' style={{ display: 'block' }}>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              </div>
                ) : (
                  <Accordion defaultActiveKey='0'>
                    {data.map(({ group_id, applications }) => {
                      const firstApp = applications[0] || {};
                      const totalApps = applications.length;
                      return (
                        <Accordion.Item
                          style={{ border: '1px solid #327113', borderRadius: '5px' }}
                          eventKey={group_id}
                          key={group_id}
                        >
                          <Accordion.Header>
                            <Table
                              bordered
                              size='sm'
                              style={{ marginBottom: 0, tableLayout: 'fixed', width: '90%' }}
                            >
                              <thead>
                                <tr>
                                  <th style={{ width: '20%' }}>Group ID</th>
                                  <th style={{ width: '20%' }}>Name</th>
                                  <th style={{ width: '20%' }}>Email</th>
                              <th style={{ width: '20%' }}>Total Applications</th>
                              <th style={{ width: '20%' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{group_id}</td>
                              <td>{firstApp.first_name || 'N/A'}</td>
                              <td>{firstApp.merchant_email_id || 'N/A'}</td>
                              <td>{totalApps}</td>
                              <td>
                                <select
                                  className='form-select form-select-sm form-select-white w-75'
                                  onChange={(e) =>
                                    handleStatusChange(applications, e.target.value)
                                  }
                                >
                                  <option value='Not Issued'>Update</option>
                                  <option value='Issue'>Issue</option>
                                  <option value='Reject'>Reject</option>
                                  <option value='Re-Submit'>Re-Submit</option>
                                </select>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Contact</th>
                              <th>Channel</th>
                              <th className='text-center'>To</th>
                              <th className='text-center'>Status</th>
                              <th className='text-center'>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {applications.map((app) => (
                              <tr key={app._id}>
                                <td>
                                  <a
                                    href='#'
                                    className='text-gray-600 fw-bold text-hover-primary fs-7'
                                  >
                                    {app.first_name}
                                  </a>
                                </td>
                                <td>
                                  <a
                                    href='#'
                                    className='text-muted text-hover-primary d-block mb-1 fs-7'
                                  >
                                    {app.merchant_email_id || app.customer_email_id}
                                  </a>
                                </td>
                                <td>
                                  <a
                                    href='#'
                                    className='text-muted text-hover-primary d-block mb-1 fs-7'
                                  >
                                    {app.merchant_phone_number || app.customer_phone_number}
                                  </a>
                                </td>
                                <td>
                                  <a
                                    href='#'
                                    className='text-muted text-hover-primary d-block mb-1 fs-7'
                                  >
                                    {app.customer_email_id ? 'Customer' : 'Merchant'}
                                  </a>
                                </td>
                                <td>
                                  <a
                                    href='#'
                                    className='text-center text-muted text-hover-primary d-block mb-1 fs-7'
                                  >
                                    {app.country_code}
                                  </a>
                                </td>
                                <td>
                                  <a
                                    href='#'
                                    className='text-center text-muted text-hover-primary d-block mb-1 fs-7'
                                  >
                                    {app.insurance_status}
                                  </a>
                                </td>
                                <td>
                                  <a
                                    href='#'
                                    className='text-muted text-center text-hover-primary d-block mb-1 fs-7'
                                  >
                                    ₹{' '}
                                    {new Intl.NumberFormat('en-IN').format(
                                      Number(app.insurance_amount)
                                    )}
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            )}
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
            <InsuranceFormView viewApplication={selectedItem} />
          </div>
        </div>
      }
      {showRejectModal && (
        <div className='loader-overlay' style={{ ...overlayStyle, ...(showRejectModal && activeOverlayStyle) }}>
          <div style={contentStyle}>
            <div onClick={handleCloseRejectModal} style={{ backgroundColor: '#d3d3d3', padding: 10, position: 'absolute', right: "193px", borderRadius: 20, cursor: 'pointer', top: '83px' }}>
              <CloseOutlined />
            </div>
            <div style={{justifyContent:"center", alignItems:"center", marginTop:"50px"}} className='d-flex flex-column gap-5'>
              <h2>Reject Application</h2>
              <textarea style={{ ...inputStyle, boxSizing: 'border-box' }} value={rejectRemark} onChange={(e) => setRejectRemark(e.target.value)} placeholder="Enter your remark"></textarea>
              <button className='btn' style={{background:"#327113", width:"100px", color:"#fff"}} onClick={() => handleReject(selectedItem)}>Reject</button>
            </div>
          </div>
        </div>
      )}
      {showResubmitModal && (
        <div
          className='loader-overlay'
          style={{...overlayStyle, ...(showResubmitModal && activeOverlayStyle)}}
        >
          <div style={contentStyle}>
            <div
              onClick={handleCloseResubmitModal}
              style={{
                backgroundColor: '#d3d3d3',
                padding: 10,
                position: 'absolute',
                right: '193px',
                borderRadius: 20,
                cursor: 'pointer',
                top: '83px',
              }}
            >
              <CloseOutlined />
            </div>
            <div
              style={{justifyContent: 'center', alignItems: 'center', marginTop: '50px'}}
              className='d-flex flex-column gap-5'
            >
              <h2>Remarks</h2>
              <textarea
                style={{...inputStyle, boxSizing: 'border-box'}}
                value={rejectRemark}
                onChange={(e) => setRejectRemark(e.target.value)}
                placeholder='Enter your remark'
              ></textarea>

              <h3>Select Applicants</h3>
              <ul style={{listStyle: 'none', paddingLeft: 0}}>
              {selectedRow && selectedRow.length > 0 ? (
                selectedRow.map((app) => (
                  <li style={{display:"flex", alignItems:"center", gap:"15px"}} key={app._id}>
                    <input
                      type='checkbox'
                      checked={selectedApplicants.includes(app._id)}
                      onChange={() => handleCheckboxChange(app._id)}
                    />
                    {app.first_name}
                  </li>
                ))
              ) : (
                <p>No Applicants Found</p>
              )}
            </ul>


              <button
                className='btn'
                style={{background: '#327113', width: '100px', color: '#fff'}}
                onClick={handleResubmitSubmit}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export { IwaitingTable }
