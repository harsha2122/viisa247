/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { CSSProperties, useState, useRef, ChangeEvent } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../_metronic/helpers'
import { CloseOutlined, DeleteOutline } from '@mui/icons-material'
import toast, { Toaster } from 'react-hot-toast';
import Loader from './Loader'
import axiosInstance from '../helpers/axiosInstance'
import Pagination from 'react-bootstrap/Pagination';
import { Accordion, Button, Table } from 'react-bootstrap';
import InsuranceFormView from './InsuranceFormView'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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

interface Application {
  _id: string;
  insurance_description: string;
  updated_at: string;
  merchant_email_id?: string;
  customer_email_id?: string;
  merchant_phone_number?: string;
  customer_phone_number?: string;
  application_id: string;
  insurance_status: string;
  insurance_amount: number;
  application_destination: string;
  letter?: string;
  pan_card?: string;
  itr?: string;
  passport_front?: string;
  passport_back?: string;
}

interface Propss {
  data: { group_id: string; applications: Application[] }[];
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
  const [selectedApplications, setSelectedApplications] = useState<Application[]>([]);

  const handleFileUpload = async (file) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('file', file)
      const response = await axiosInstance.post('/backend/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const fileUrl = response.data.url
      setLoading(false)
      return fileUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      setLoading(false)
      return ''
    }
  }

  const handleStatusChange = async (applications, selectedStatus) => {
    setSelectedRows(applications)
    if (selectedStatus === 'Reject') {
      setShowRejectModal(true)
    } else if (selectedStatus === 'Re-Submit') {
      setShowResubmitModal(true)
    } else if (selectedStatus === 'Issue') {
      setShowIssueModal(true)
    }
  };

  const handleResubmitSubmit = async () => {
    try {
      const selectedIds = selectedApplicants
      const payload = {
        ids: selectedIds,
        insurance_status: 'Re-Submit',
        insurance_remark: rejectRemark,
      };
  
      const response = await axiosInstance.post('/backend/upload_insurance_file', payload);
  
      if (response.data.success === 1) {
        setShowResubmitModal(false);
        setSelectedApplicants([]);
        setRejectRemark('');
        toast.success('Applications resubmitted successfully');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
      const allIds = selectedRows.map((row) => row._id)
      const response = await axiosInstance.post('/backend/upload_insurance_file', {
        ids: allIds,
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

  const handleIssueSubmit = async () => {
    try {
      // Check if insurance_pdf (file) is present
      if (!file) {
        toast.error('Please upload the insurance PDF before issuing');
        return; // Stop form submission if file is not present
      }
  
      const allIds = selectedRows.map((row) => row._id);
      const payload = {
        ids: allIds,
        insurance_status: 'Issued',
        insurance_pdf: file,
      };
  
      const response = await axiosInstance.post('/backend/upload_insurance_file', payload);
      if (response.data.success === 1) {
        toast.success('Applications issued successfully');
        handleCloseIssueModal();
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      } else {
        toast.error('Error issuing applications');
      }
    } catch (error) {
      console.error('Error submitting insurance:', error);
      toast.error('Error submitting insurance');
    }
  };
  
  

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
        const validFileTypes = ['application/pdf']; // Only PDF allowed
        if (!validFileTypes.includes(file.type)) {
            toast.error('Only .pdf files are allowed.', { position: 'top-center' });
            return;
        }

        if (file.size > maxSize) {
            toast.error('File size exceeds 300KB limit.', { position: 'top-center' });
            return;
        }

        try {
            const imageLink = await handleFileUpload(file);
            setFile(imageLink);
            toast.success('File uploaded successfully', { position: 'top-center' });
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Error uploading file. Please try again.', { position: 'top-center' });
        }
    }
}


  const handleSelectApplication = (app: Application) => {
    setSelectedApplications((prevSelected) => {
      if (prevSelected.includes(app)) {
        return prevSelected.filter((selectedApp) => selectedApp !== app);
      } else {
        return [...prevSelected, app];
      }
    });
  };

  const handleDownloadSelected = async () => {
    const zip = new JSZip();

    for (const app of selectedApplications) {
      const fileFields = ['letter', 'pan_card', 'itr', 'passport_front', 'passport_back'];

      for (const field of fileFields) {
        if (app[field as keyof Application]) {
          try {
            const response = await fetch(app[field as keyof Application] as string);
            const blob = await response.blob();
            const fileName = `${app.application_id}_${field}.jpeg`;
            zip.file(fileName, blob);
          } catch (error) {
            console.error(`Error downloading ${field} from application ID: ${app.application_id}`, error);
          }
        } else {
          console.log(`${field} is not available for application ID: ${app.application_id}`);
        }
      }
    }

    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, 'documents.zip');
      console.log('ZIP file has been generated and download started.');
    });
  };

  const handleDownloadDocuments = async (applications) => {
    const zip = new JSZip();
  
    for (const app of applications) {
      const fileFields = ['passport_front', 'passport_back'];
  
      for (const field of fileFields) {
        if (app[field]) {
          try {
            const response = await fetch(app[field]);
            const blob = await response.blob();
            const fileName = `${app.application_id}_${field}.jpeg`;
            zip.file(fileName, blob);
          } catch (error) {
            console.error(`Error downloading ${field} from application ID: ${app.application_id}`, error);
          }
        } else {
          console.log(`${field} is not available for application ID: ${app.application_id}`);
        }
      }
    }

    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, 'documents.zip');
      console.log('ZIP file has been generated and download started.');
    });
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
    setSelectedItem(item);
    setShowRejectModal(true);
  };
  const handleCloseClick = () => {
    setSelectedItem(null);
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
          <div className='card-header'>
            <h3 className='card-title align-content-start flex-row'>
              <span className='card-label text-gray-600 fw-bold fs-3'>Recent Applications</span>
            </h3>
            {selectedApplications.length > 0 && (
              <button
                className='btn btn-primary mt-3'
                onClick={handleDownloadSelected}
              >
                Download Selected Documents
              </button>
            )}
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
                              style={{ marginBottom: 0, tableLayout: 'fixed', width: '95%' }}
                            >
                              <thead>
                                <tr>
                                  <th style={{ width: '5%' }}></th>
                                  <th style={{ width: '15%' }}>Group ID</th>
                                  <th style={{ width: '15%' }}>Name</th>
                                  <th style={{ width: '20%' }}>Email</th>
                                  <th style={{ width: '10%' }}>Applicants</th>
                                  <th style={{ width: '15%' }}>Status</th>
                                  <th style={{ width: '20%' }}>Download Documents</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className='text-center'>
                                <input
                                  type='checkbox'
                                  onChange={() => handleSelectApplication(firstApp)}
                                  checked={selectedApplications.includes(firstApp)}
                                />
                              </td>
                              <td>{group_id}</td>
                              <td>{firstApp.first_name || 'N/A'}</td>
                              <td>{firstApp.merchant_email_id || firstApp.customer_email_id}</td>
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
                              <td>
                                    <button
                                      className='btn btn-sm btn-primary'
                                      onClick={() => handleDownloadDocuments(applications)}
                                    >
                                      Download
                                    </button>
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
                              <th>Passport</th>
                              <th>Contact</th>
                              <th>Channel</th>
                              <th className='text-center'>To</th>
                              <th className='text-center'>Status</th>
                              <th className='text-center'>Amount</th>
                              <th className='text-center'>Actions</th>
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
                                    {app.passport_number}
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
                                <td className='justify-content-center d-flex'>
                                    <button
                                      title='Edit'
                                      onClick={() => handleVisibilityClick(app)}
                                      className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                    >
                                      <KTIcon iconName='eye' className='fs-3' />
                                    </button>
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
              {selectedRows.map((app) => (
                  <li style={{display:"flex", alignItems:"center", gap:"15px"}} key={app._id}>
                    <input
                      type='checkbox'
                      checked={selectedApplicants.includes(app._id)}
                      onChange={() => handleCheckboxChange(app._id)}
                    />
                    {app.first_name}
                  </li>
                ))}
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
      {showIssueModal && (
        <div style={{...overlayStyle, ...activeOverlayStyle}}>
          <div style={contentStyle}>
            <h4>Upload Documents</h4>
            <input
              type='file'
              ref={insuranceFileInputRef}
              className='form-control'
              id='insurance_pdf'
              name='insurance_pdf'
              accept='.pdf'
              onChange={handleFileSelect}
            />
            <div style={{marginTop: '10px'}}>
              <Button variant='primary' onClick={handleIssueSubmit}>
                Submit
              </Button>
              <Button
                variant='secondary'
                onClick={handleCloseIssueModal}
                style={{marginLeft: '10px'}}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { IwaitingTable }
