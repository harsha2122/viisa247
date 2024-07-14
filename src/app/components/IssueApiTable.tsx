/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, CSSProperties } from 'react'
import { CloseOutlined, DeleteOutline } from '@mui/icons-material'
import axiosInstance from '../helpers/axiosInstance'
import toast, { Toaster } from 'react-hot-toast';
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { ICreateAccount, inits } from '../modules/wizards/components/CreateAccountWizardHelper'
import { Modal, Button, Toast } from 'react-bootstrap';
import { FcFullTrash } from "react-icons/fc";
import 'react-toastify/dist/ReactToastify.css';
import { FaEye } from "react-icons/fa";
import Pagination from 'react-bootstrap/Pagination';
import { KTIcon } from '../../_metronic/helpers';

type Props = {
  className: string
  data: any[];
  loading: boolean
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
  height: '40%',
  overflowY: 'auto'
};


const inputStyle = {
  border: '1.5px solid #d3d3d3', // Border width and color
  borderRadius: '15px', // Border radius
  padding: '10px',
  paddingLeft: '20px', // Padding
  width: '90%', // 100% width
  boxSizing: 'border-box', // Include padding and border in the width calculation
}

const itemsPerPage = 10; 

const calculateTotalPages = (totalItems: number) => {
  return Math.ceil(totalItems / itemsPerPage);
};


const IssueApiTable: React.FC<Props> = ({ className, data, loading }) => {
  const [itemModalVisibility, setItemModalVisibility] = useState<Array<boolean>>(Array(data.length).fill(false));
  const [formData, setFormData] = useState({
    walletBalance: ''
  })
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [initValues] = useState<ICreateAccount>(inits)
  const [deleteSelectedItem, setDeleteSelectedItem] = useState(null);
  const [loadingButton, setloadingButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [isSwitchOn, setSwitchOn] = React.useState(false);
  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };
  const totalItems = data.length;
  const totalPages = calculateTotalPages(totalItems);

  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const initialSwitchesState = data.reduce((acc, item) => {
    acc[item._id] = true;
    return acc;
}, {});

React.useEffect(() => {
  const initialSwitchesState = data.reduce((acc, item) => {
    acc[item._id] = item.is_active;
    return acc;
  }, {});

  setItemSwitches(initialSwitchesState);
}, [data]);

const handleToggleSwitch = async (itemId) => {
  try {
    setItemSwitches((prevSwitches) => ({
      ...prevSwitches,
      [itemId]: !prevSwitches[itemId],
    }));

    const response = await axiosInstance.post('/backend/change_api_status', {
      api_id: itemId,
      status: !itemSwitches[itemId], 
    });


    if (response.status !== 200) {
      setItemSwitches((prevSwitches) => ({
        ...prevSwitches,
        [itemId]: !prevSwitches[itemId],
      }));

      toast.error(response.data.msg, {
        position: 'top-center',
      });
    } else {
      const updatedData = data.map((item) => {
        if (item._id === itemId) {
          return {
            ...item,
            is_active: !itemSwitches[itemId],
          };
        }
        return item;
      });
      setMemberStatsData(updatedData);
      toast.success(response.data.msg, {
        position: 'top-center',
      });
    }
  } catch (error) {
    console.error('API error:', error);
    setItemSwitches((prevSwitches) => ({
      ...prevSwitches,
      [itemId]: !prevSwitches[itemId],
    }));

    toast.error('Error occurred while making the API call', {
      position: 'top-center',
    });
  }
};
const [itemSwitches, setItemSwitches] = React.useState(initialSwitchesState);
const [memberStatsData, setMemberStatsData] = useState(data);

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const [open, setOpen] = React.useState(false);

  const [disable, setDisable] = React.useState(false);

  const handleAddBalanceClick = (item) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const handleClickOpen = (item) => {
    setDeleteSelectedItem(item);
    setOpen(!open);
  };

const handleClose = () => {
    setDeleteSelectedItem(null);
    setOpen(false);
};

const handleVisibilityClick = (item) => {
    setSelectedItem(item);
    setVisible(true);
};

const handleApproveClick = async () => {
  try {
      if (deleteSelectedItem) {
          const selectedEntry = deleteSelectedItem as { _id: string };
          if (deleteSelectedItem == null) {
              toast.error('Selected entry is null', {
                  position: 'top-center',
              });
          }
          const response = await axiosInstance.post('/backend/merchant/delete_api', {
              api_id: selectedEntry._id,
          });

          if (response.status === 200) {
              toast.success(response.data.msg, {
                  position: 'top-center',
              });
              handleCloseClick();
              window.location.reload();
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

const handleCloseClick = () => {
    setSelectedItem(null);
    setDeleteSelectedItem(null);
    setVisible(false);
};

const handleFieldChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
};

const copyApiKey = (apiKey: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = apiKey;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  navigator.clipboard.writeText(apiKey)
      .then(() => {
        toast.success('API Key copied successfully!');
      })
      .catch((error) => {
        console.error('Error copying API key:', error);
      });
};



const handleSaveClick = async () => {
    setloadingButton(true);
    const response = await axiosInstance.post('/backend/add_api_balance', {
        api_id: selectedItem._id,
        amount: formData.walletBalance,
    });

    if (response.status == 200) {
        toast.success(response.data.msg, {
            position: 'top-center',
        });
        handleCloseClick();
        window.location.reload();
    } else {
        toast.error(response.data.msg, {
            position: 'top-center',
        });
    }
};

  return (
    <div style={{ backgroundColor: '#fff' }} className='w-full'>
      <Toaster />
      <div style={{boxShadow:"none"}} className={`card ${className}`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 style={{marginLeft:"10px"}} className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Partner Statistics</span>
            <span style={{
            }} className='text-muted mt-1 fw-semibold fs-7'>{data.length} Member</span>
          </h3>

        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='card-body py-3'>
          <div className='tab-content'>
            {/* begin::Tap pane */}
            <div className='tab-pane fade show active' id='kt_table_widget_6_tab_1'>
              {/* begin::Table container */}
              <div style={{ overflowX:"hidden"}} className='table-responsive'>
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
                      <span className='card-label text-gray-600 fw-bold fs-3'>Recent Partners</span>
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
                            <th className='fs-5 text-center min-w-70px'>Key</th>
                            <th className='fs-5 text-center min-w-70px'>Wallet</th>
                            <th className='fs-5 text-center min-w-70px'>Status</th>
                            <th className='fs-5 min-w-100px text-end'>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <a href='#' className='text-gray-600 fw-bold text-hover-primary fs-7'>
                                {item.merchant.merchant_name}
                              </a>
                            </td>
                            <td>
                              <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                                  {item.merchant.merchant_email_id}
                              </a>
                            </td>
                            <td>
                              <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                                {item.merchant.merchant_phone_number}
                              </a>
                            </td>
                            <td>
                              <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                                {item.merchant.merchant_company_name}
                              </a>
                            </td>
                            <td className='text-center'>
                            <button onClick={() => {
                              const updatedVisibility = [...itemModalVisibility];
                              updatedVisibility[index] = true;
                              setItemModalVisibility(updatedVisibility);
                            }} style={{ backgroundColor: 'transparent', border: 'none' }}>
                              <FaEye title='Revel Key' style={{fontSize:"20px", color:"#000"}} />
                            </button>
                            
                            <Modal show={itemModalVisibility[index]} onHide={() => {
                              const updatedVisibility = [...itemModalVisibility];
                              updatedVisibility[index] = false;
                              setItemModalVisibility(updatedVisibility);
                            }}>
                              <Modal.Header closeButton>
                                <Modal.Title>API Key</Modal.Title>
                              </Modal.Header>
                              <Modal.Body style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                                <p>{item.api_key}</p>
                              </Modal.Body>
                              <Modal.Footer>
                                <Toast />
                              <Button style={{background:"#327113"}} variant="primary" onClick={() => copyApiKey(item.api_key)}>
                                Copy API Key
                              </Button>
                              
                                <Button variant='secondary' onClick={() => {
                                  const updatedVisibility = [...itemModalVisibility];
                                  updatedVisibility[index] = false;
                                  setItemModalVisibility(updatedVisibility);
                                }}>
                                  Close
                                </Button>
                              </Modal.Footer>
                            </Modal>

                            </td>
                            <td>
                              <a href='#' className='text-muted text-center text-hover-primary d-block mb-1 fs-7'>
                                ₹ {new Intl.NumberFormat('en-IN').format(Number(item.api_wallet_balance))}
                              </a>
                            </td>
                            <td className='text-center'>
                            <label className='switch'>
                              <input
                                title='API State'
                                type='checkbox'
                                checked={itemSwitches[item._id]}
                                onChange={() => handleToggleSwitch(item._id)}
                              />
                              <span className='slider'></span>
                            </label>

                            </td>
                            <td className='text-end'>
                            <div className='d-flex align-items-center gap-3 justify-content-end'>
                              <a title='Delete' onClick={() => {
                                    handleClickOpen(item)
                                  }} href='#' className='btn btn-icon btn-bg-light btn-active-color-primary me-1 btn-sm'>
                                <KTIcon iconName='trash' className='fs-3' />
                              </a>

                              <button style={{backgroundColor:"#327113", padding:"5px 8px", border:"none", color:"#fff", borderRadius:"5px", fontSize:"12px"}} onClick={() => handleAddBalanceClick(item)}>Add Balance</button>
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
                {totalPages > 1 && (
                  <Pagination>
                    {Array.from({ length: totalPages }).map((_, index) => (
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
      {visible &&
        <div className='loader-overlay' style={{ ...overlayStyle, ...(visible && activeOverlayStyle), }}>
          <div style={contentStyle}>

            <div onClick={() => handleCloseClick()} style={{ backgroundColor: '#d3d3d3', padding:"9px", position:"absolute", top:"30%", left:"84.5%", transform:"translate(-35%, -40%)", borderRadius: 20, cursor: 'pointer' }}>
              <CloseOutlined />
            </div>
            <div className='px-10 py-10'>
              {selectedItem && (
                <h3>
                  Current Balance: {selectedItem.api_wallet_balance}
                </h3>
              )}
              <Formik initialValues={formData} onSubmit={() => { }}>
                {() => (
                  <Form className='py-10 px-0' noValidate id='kt_create_account_form'>

                    <div className='fv-row mb-5 d-flex flex-column'>
                      <label className='d-flex align-items-center form-label'>
                        <span className='required'>Add Balance</span>
                      </label>

                      <Field
                        style={{ ...inputStyle, width: '450px', marginBottom:"15px" }}
                        name='walletBalance'
                        value={formData.walletBalance}
                        className='form-control form-control-lg form-control-solid'
                        onChange={(e) => handleFieldChange('walletBalance', e.target.value)}
                      />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='walletBalance' />
                      </div>
                    </div>

                    <div className='d-flex justify-content-center mt-5'>
                      <button
                        type='submit'
                        className='btn btn-success'
                        onClick={handleSaveClick}
                        style={{ backgroundColor: '#327113', width: 180 }}
                      >

                        {!loadingButton && <span className='indicator-label'>Save</span>}
                        {loadingButton && (
                          <span className='indicator-progress' style={{ display: 'block' }}>
                            Please wait...
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                          </span>
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>

            </div>
          </div>
        </div>
      }
      <div>
      <Modal show={open} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ color: 'red' }}>Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete this API</p>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{ background: "#327113", color: "#fff" }} onClick={handleClose}>
                    Cancel
                </Button>
                <Button style={{ background: "red" }} variant="danger" onClick={handleApproveClick}>
                    {!loading && <span>Yes</span>}
                    {loading && (
                        <span className='indicator-progress' style={{ display: 'flex', alignItems: 'center', color: "#fff" }}>
                            Please wait...
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
</div>
    </div>
  )
}

export { IssueApiTable }
