/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { CSSProperties, useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../_metronic/helpers'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { CloseOutlined, DeleteOutline } from '@mui/icons-material'
import ApplicationFormView from './ApplicationFormView'
import ConfirmationModal from './ConfirmationModal'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axiosInstance from '../helpers/axiosInstance'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'
import { Accordion, Button, Table } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';

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
  backgroundColor: '#fff', // Background color for highlighting
  padding: '10px', // Adjust padding as needed
  borderRadius: '5px', // Rounded corners for the highlight
  // textAlign:'center',
  width: '70%',
  height: '70%',
  overflowY: 'auto'
};



const IprocessedTable: React.FC<Props> = ({ className, title, data,loading }) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [issueVisaLoader, setissueVisaLoader] = useState(false);
  const [deleteSelectedItem, setDeleteSelectedItem] = useState(null);
  const [open, setOpen] = React.useState(false);
  
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

  const [visaDialogOpen, setVisaDialogOpen] = React.useState(false);

  const handleClickOpen1 = (item) => {
    setDeleteSelectedItem(item)
    setOpen(true);
  };
  
  const handleClose1 = () => {
    setDeleteSelectedItem(null)
    setOpen(false);
  };
  
  const handleVisaDialogOpen = (item) => {
    setSelectedItem(item); // Set the selected item
    setVisaDialogOpen(true);
  };
  
  const handleVisaDialogClose = () => {
    setSelectedItem(null); // Set the selected item
    setVisaDialogOpen(false);
  };

  const handleApproveClick = async () => {
    try {
      if(deleteSelectedItem){
        const selectedEntry = deleteSelectedItem as { _id: string }; 
      if(deleteSelectedItem == null){
        toast.error('Selected entry is null', {
          position: 'top-center',
        });
      }
      const response = await axiosInstance.post('/backend/delete_application', {
        application_id: selectedEntry._id,
      });

      if (response.status === 200) {
        toast.success(response.data.msg, {
          position: 'top-center',
        });

        window.location.reload();
        // Handle any additional actions after a successful API call
      } else {
        toast.error(response.data.msg, {
          position: 'top-center',
        });
      }
    }
    } catch (error) {
      console.error('API error:', error);
    }
  };

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

  const handleDownloadClick = async (item) => {
    const response = await axiosInstance.post('/backend/download_visa', {
      application_id: item._id
    })

    if (response.status == 200) {
      toast.success(response.data.msg, {
        position: 'top-center', // Center the toast notification
      })
      // navigate('/merchant/apply-visa')
    } else {
      toast.error(response.data.msg.error, {
        position: 'top-center',
      })
    }
  };
  const navigate = useNavigate();

  const handleIssueVisaClick = async (item) => {
    setissueVisaLoader(true);
    const response = await axiosInstance.post('/backend/apply_visa', {
      application_id: item._id
    })

    if (response.status == 200) {
      toast.success(response.data.msg, {
        position: 'top-center', // Center the toast notification
      })
      window.location.reload();
      navigate('/superadmin/processed')
      setissueVisaLoader(false);
    } else {
      toast.error(response.data.msg, {
        position: 'top-center',
      })
      setissueVisaLoader(false);
    }
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
                                    <th style={{ width: '15%' }}>Group ID</th>
                                    <th style={{ width: '15%' }}>Name</th>
                                    <th style={{ width: '20%' }}>Email</th>
                                    <th style={{ width: '10%' }}>Applicants</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{group_id}</td>
                                <td>{firstApp.first_name || 'N/A'}</td>
                                <td>{firstApp.merchant_email_id || firstApp.customer_email_id}</td>
                                <td>{totalApps}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Table striped bordered hover responsive>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Passport No</th>
                                <th>Contact</th>
                                <th>Channel</th>
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
            <ApplicationFormView viewApplication={selectedItem} />
          </div>
        </div>
      }
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move', color: 'red' }} id="draggable-dialog-title">
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose1}>
              Cancel
            </Button>
            <Button onClick={handleApproveClick}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={visaDialogOpen}
          onClose={handleVisaDialogClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move', color: 'red' }} id="draggable-dialog-title">
            Confirm Visa Issue
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to issue visa for this application?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleVisaDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleIssueVisaClick}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export { IprocessedTable }
