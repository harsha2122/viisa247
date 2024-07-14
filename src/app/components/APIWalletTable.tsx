/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { CSSProperties, useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../_metronic/helpers'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { CloseOutlined, DeleteOutline, Padding } from '@mui/icons-material'
import ApplicationFormView from './ApplicationFormView'
import ConfirmationModal from './ConfirmationModal'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WalletFormView from './WalletFormView'
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../helpers/axiosInstance'

type Props = {
  className: string
  title: String,
  data: any[];
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

const APIWalletTable: React.FC<Props> = ({ className, title, data }) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteSelectedItem, setDeleteSelectedItem] = useState(null);

  const [filter, setFilter] = useState('all')
  const [open, setOpen] = React.useState(false);
  const handleApproveClick = async (item) => {
    const response = await axiosInstance.post('/backend/merchant/issue_api', {
      merchant_id: item.merchant_id,
      api_type :'Production'
    })
    if (response.status == 200) {
      
      const response1 = await axiosInstance.post('/backend/approve_api_transaction', {
        wallet_id: item._id,
        merchant_id: item.merchant_id
      })
      if(response1.status == 200){
        toast.success(response.data.msg, {
          position: 'top-center',
        })
        window.location.reload();
      }else{
        toast.error(response.data.msg, {
          position: 'top-center',
        })
      }
      // navigate('/merchant/apply-visa')
    } else {
      toast.error(response.data.msg, {
        position: 'top-center',
      })
    }
  };

  const getFilteredData = () => {
    if (filter === 'waitingForApproval') {
      return data.filter((item) => item.status === 'In-processed')
    } if (filter === 'history') {
      return data.filter((item) => item.status != 'In-processed')
    }else {
      return data // Show all items by default
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
    setSelectedItem(item);
    setVisible(true);
  };
  const handleCloseClick = () => {
    setSelectedItem(null); // Set the selected item
    setVisible(false);
  };

  const handleDeleteConfirmation = async () => {
    // Call your API with the selected item here
    try {
      if(deleteSelectedItem){
        const selectedEntry = deleteSelectedItem as { _id: string }; 
      if(deleteSelectedItem == null){
        toast.error('Selected entry is null', {
          position: 'top-center',
        });
      }
      const response = await axiosInstance.post('/backend/decline_transaction', {
        wallet_id: selectedEntry._id,
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

    setSelectedItem(null); // Clear the selected item after the API call
    setOpen(false); // Close the dialog
  };
  const handleFilterClick = (filterType) => {
    setFilter(filterType)
  }
  return (
    <div style={{boxShadow:"none"}} className={`card ${className}`}>
      <Toaster />
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 style={{marginLeft:"10px"}} className='card-title align-items-center flex-row'>
          <span className='card-label fw-bold fs-3 mb-1'>{title}</span>
        </h3>

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
                <li>
                  <a
                    className='dropdown-item'
                    href='#'
                    onClick={() => handleFilterClick('history')}
                  >
                    History
                  </a>
                </li>
              </ul>
            </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div style={{borderRadius:"10px", border:"1px solid #327113"}} className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead >
            <tr style={{ background: '#f2f2f2', color: '#000', border:"1px solid #000"}} className='fw-bold'>

                <th style={{paddingLeft:"20px"}} className='min-w-100px text-start'>Email Id</th>
                <th className='min-w-100px text-center'>Transaction Id</th>
                <th className='min-w-100px text-center'>Amount</th>
                <th className='min-w-100px text-center'>Status</th>
                <th className='min-w-100px text-center'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {getFilteredData().map((row, index) => (

                <tr>
                  <td className='text-center'>
                    {/* Avatar and Name */}
                    <div className='d-flex align-items-center'>
                      <div className='symbol symbol-45px me-5'>
                        {/* <img src={row.photo} alt='' /> */}
                      </div>
                      <div className='d-flex justify-content-center flex-column'>
                        <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                          {row.merchant_email_id}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className='text-center'>
                    {/* Date */}
                    <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                      {row.upi_ref_id}
                    </a>
                  </td>
                  <td className='text-center'>
                    {/* Location 1 */}
                    <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                      ₹ {row.wallet_balance}
                    </a>
                  </td>

                  <td className='text-center'>
                      {/* Location 1 */}
                      <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                        {row.status}
                      </a>
                    </td>
                  <td  style={{paddingLeft:"5%"}} className='text-center'>
                    {/* Action Buttons */}
                    <div className='d-flex align-items-center  flex-shrink-0'>

                      <VisibilityIcon className='mx-5 cursor-pointer' onClick={() => handleVisibilityClick(row)} />

                      <DeleteOutline onClick={() => {
                        handleClickOpen(row)
                        // const confirmed = window.confirm('Are you sure you want to delete this item?');
                        // if (confirmed) {
                        // Laxit write here for delete api 
                        // }
                      }} className='mx-5 cursor-pointer' />
                      {row.status === 'In-processed' && (
                          // Render the "Approve" button only when the merchant is not approved
                          <button className='btn btn-success align-self-center' onClick={() => handleApproveClick(row)}>Issue API</button>

                        )}
                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
      {visible &&
        <div className='loader-overlay' style={{ ...overlayStyle, ...(visible && activeOverlayStyle), }}>
          <div style={contentStyle}>
            <div onClick={() => handleCloseClick()} style={{ backgroundColor: '#d3d3d3', padding:"9px", position:"absolute", top:"15%", left:"84.5%", transform:"translate(-35%, -40%)", borderRadius: 20, cursor: 'pointer' }}>
              <CloseOutlined />
            </div>
            <WalletFormView viewApplication={selectedItem} />
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
              Are you sure you want to reject this transaction?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirmation}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export { APIWalletTable }
