/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { CSSProperties, useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../_metronic/helpers'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { CloseOutlined, DeleteOutline } from '@mui/icons-material'
import ApplicationFormView from './ApplicationFormView'
import ConfirmationModal from './ConfirmationModal'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axiosInstance from '../helpers/axiosInstance'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'
import { FcFullTrash } from "react-icons/fc";
import Cookies from 'js-cookie'
import { FcInfo } from "react-icons/fc";
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



const VisaInprocess: React.FC<Props> = ({ className, title, data,loading }) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [issueVisaLoader, setissueVisaLoader] = useState(false);
  const [deleteSelectedItem, setDeleteSelectedItem] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [tableData, setTableData] = useState(data);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const MAX_VISIBLE_PAGES = 7; 
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };
  const handleStatusChange = async (row, selectedStatus) => {
    try {
      const response = await axiosInstance.post('/backend/update_application_status', {
        id: row._id,
        visa_status: selectedStatus,
      });

      if (response.status === 200) {
        const updatedData = tableData.map(item => {
          if (item._id === row._id) {
            return { ...item, visa_status: selectedStatus };
          }
          return item;
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
                            {row.merchant_email_id}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                          {row.merchant_phone_number}
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
                      <td className='text-end'>
                      <button
                        title='Edit'
                        onClick={() => handleVisibilityClick(row)}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      >
                        <KTIcon iconName='pencil' className='fs-3' />
                      </button>
                      <select
                          className='form-select form-select-sm form-select-white w-75'
                          onChange={(e) => handleStatusChange(row, e.target.value)}
                        >
                          <option value=''>Update</option>
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
            Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleApproveClick}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export { VisaInprocess }
