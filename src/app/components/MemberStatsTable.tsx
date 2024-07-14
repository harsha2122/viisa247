import React, { useState, CSSProperties } from 'react';
import { KTIcon, toAbsoluteUrl } from '../../_metronic/helpers';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MerchantView from './MerchantView';
import { CloseOutlined, DeleteOutline } from '@mui/icons-material';
import axiosInstance from '../helpers/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import moment from 'moment';
import { FcInfo } from 'react-icons/fc';
import { FcFullTrash } from 'react-icons/fc';
import Pagination from 'react-bootstrap/Pagination';

type Props = {
  className: string;
  data: any[];
  loading: boolean;
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
  width: '70%',
  height: '70%',
  overflowY: 'auto',
}

const itemsPerPage = 10; // Adjust as needed

const calculateTotalPages = (filteredData: any[]) => {
  const totalItems = filteredData.length;
  return Math.ceil(totalItems / itemsPerPage);
};

const MemberStatsTable: React.FC<Props> = ({ className, data, loading }) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [id, setId] = useState(null);
  const [activePage, setActivePage] = useState(1);

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  const getFilteredData = () => {
    // Your existing filter logic
    if (filter === 'waitingForApproval') {
      return data.filter((item) => item.merchant_approved === false);
    } else {
      return data; // Show all items by default
    }
  };

  const filteredData = getFilteredData();

  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const handleFilterClick = (filterType) => {
    setFilter(filterType);
    setActivePage(1);
  }
  const handleClickOpen = (item) => {
    setOpen(!open)
    setId(item._id)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpen1 = (item) => {
    setOpen1(!open1)
    setSelectedItem(item);
  }

  const handleClose1 = () => {
    setOpen1(false)
  }

  const handleVisibilityClick = (item) => {
    setSelectedItem(item) // Set the selected item
    setVisible(true)
  }

  const handleApproveClick = async (item) => {
    const response = await axiosInstance.post('/backend/super_admin/approve_merchant', {
      merchant_id: item._id,
    })

    if (response.status == 200) {
      toast.success(response.data.msg, {
        position: 'top-center', // Center the toast notification
      })
      window.location.reload();
      // navigate('/merchant/apply-visa')
    } else {
      toast.error(response.data.msg, {
        position: 'top-center',
      })
    }
  }

  const handleDeleteClick = async () => {
    const response = await axiosInstance.post('/backend/delete_merchant_user', {
      merchant_id: id,
    })

    if (response.status == 200) {
      toast.success(response.data.msg, {
        position: 'top-center', // Center the toast notification
      })
      handleClose()
      window.location.reload()
    } else {
      toast.error(response.data.msg, {
        position: 'top-center',
      })
    }
  }

  const handleCloseClick = () => {
    setSelectedItem(null)
    setVisible(false)
  }

  return (
    <div style={{backgroundColor: '#fff'}} className='w-full'>
    <Toaster />
      <div style={{boxShadow:"none"}} className={`card ${className}`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 style={{marginLeft:"10px"}} className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Retailer Statistics</span>
            <span className='text-muted mt-1 fw-semibold fs-7'>{data.length} Member</span>
          </h3>
          <div className='d-flex flex-row'>
            <div className='dropdown mx-5'>
              <button
                className='btn btn-secondary dropdown-toggle'
                type='button'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                Filter
              </button>
              <ul className='dropdown-menu'>
                <li>
                  <a className='dropdown-item' href='#' onClick={() => handleFilterClick('all')}>
                    All
                  </a>
                </li>
                <li>
                  <a
                    className='dropdown-item'
                    href='#'
                    onClick={() => handleFilterClick('waitingForApproval')}
                  >
                    Waiting For Approval
                  </a>
                </li>
              </ul>
            </div>
            <Link to={'/superadmin/add-new-merchant'}>
              <button style={{backgroundColor:"#327113"}} className='btn btn-success align-self-center'>Add new Retailer</button>
            </Link>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='card-body py-3'>
          <div className='tab-content'>
            {/* begin::Tap pane */}
            <div className='tab-pane fade show active' id='kt_table_widget_6_tab_1'>
              {/* begin::Table container */}
              <div className='table-responsive'>
                {/* begin::Table */}
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
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  </div>
                ) : (
                  <section style={{border:"1px solid #adc6a0"}} className='w-100 card my-5 '>
                  <div style={{borderBottom:"1.5px solid #327113"}} className='card-header'>
                    <h3 className='card-title align-content-start flex-row'>
                      <span className='card-label text-gray-600 fw-bold fs-3'>Recent Merchants</span>
                    </h3>
                  </div>
                  <div className='card-body py-3'>
                    <div className='table-responsive'>
                      <table className='table table-row-bordered table-row-gray-300 align-middle gs-0 gy-3'>
                        <thead>
                          <tr className='fw-bold '>
                            <th className='fs-5 min-w-180px'>Agent</th>
                            <th className='fs-5 min-w-100px'>Email</th>
                            <th className='fs-5 min-w-100px'>Contact</th>
                            <th className='fs-5 min-w-100px'>Company</th>
                            <th className='fs-5 text-center min-w-70px'>Visas</th>
                            <th className='fs-5 text-center min-w-70px'>Wallet</th>
                            <th className='fs-5 min-w-100px text-end'>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <a href='#' className='text-gray-600 fw-bold text-hover-primary fs-7'>
                                {item.merchant_name}
                              </a>
                            </td>
                            <td>
                              <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                                  {item.merchant_email_id}
                              </a>
                            </td>
                            <td>
                              <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                                {item.merchant_phone_number}
                              </a>
                            </td>
                            <td>
                              <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                                {item.merchant_company_name}
                              </a>
                            </td>
                            <td>
                              <a href='#' className='text-center text-muted text-hover-primary d-block mb-1 fs-7'>
                                 {item.merchant_applicants.length}
                              </a>
                            </td>
                            <td>
                              <a href='#' className='text-muted text-center text-hover-primary d-block mb-1 fs-7'>
                                ₹ {new Intl.NumberFormat('en-IN').format(Number(item.wallet_balance))}
                              </a>
                            </td>
                            <td className='text-end'>
                            <button
                              title='Edit'
                              onClick={() => handleVisibilityClick(item)}
                              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            >
                              <KTIcon iconName='pencil' className='fs-3' />
                            </button>
                            <a title='Delete' onClick={() => {
                                  handleClickOpen(item)
                                }} href='#' className='btn btn-icon btn-bg-light btn-active-color-primary me-1 btn-sm'>
                              <KTIcon iconName='trash' className='fs-3' />
                            </a>
                            {item.merchant_approved === false && (
                                <button
                                  style={{
                                    backgroundColor: '#327113',
                                    color: '#fff',
                                    border: 'none',
                                    padding: "0px 5px",
                                    borderRadius: "50%",
                                    cursor: 'pointer',
                                    marginLeft: "4%"

                                  }}
                                  onClick={() => handleClickOpen1(item)}
                                >
                                  ✔
                                </button>
                              )}

                          </td>
                          </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
                  
                )}
                {calculateTotalPages(filteredData) > 1 && (
                  <Pagination>
                    {Array.from({ length: calculateTotalPages(filteredData) }).map((_, index) => (
                      <Pagination.Item
                        key={index}
                        active={index + 1 === activePage}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                )}
              </div>
              {/* end::Table */}
            </div>
            {/* end::Tap pane */}

            {/* end::Tap pane */}
          </div>
        </div>

        {/* end::Body */}
      </div>
      {visible && (
        <div
          className='loader-overlay'
          style={{...overlayStyle, ...(visible && activeOverlayStyle)}}
        >
          <div style={contentStyle}>
            <div
              onClick={() => handleCloseClick()}
              style={{ backgroundColor: '#d3d3d3', padding:"9px", position:"absolute", top:"15%", left:"84.5%", transform:"translate(-35%, -40%)", borderRadius: 20, cursor: 'pointer' }}
            >
              <CloseOutlined />
            </div>
            <MerchantView viewApplication={selectedItem} />
          </div>
        </div>
      )}
      <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby='draggable-dialog-title'>
          <DialogTitle style={{cursor: 'move', color: 'red'}} id='draggable-dialog-title'>
            Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={() => handleDeleteClick()}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog open={open1} onClose={handleClose1} aria-labelledby='draggable-dialog-title'>
          <DialogTitle style={{cursor: 'move', color: '#327113'}} id='draggable-dialog-title'>
            Confirm
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to Approve this Merchant?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose1}>
              Cancel
            </Button>
            <Button onClick={() => handleApproveClick(selectedItem)}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export {MemberStatsTable}
