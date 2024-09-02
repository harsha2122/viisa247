/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {CSSProperties, useState, useRef, ChangeEvent} from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {CloseOutlined, DeleteOutline} from '@mui/icons-material'
import {Accordion, Button, Table} from 'react-bootstrap'
import toast, {Toaster} from 'react-hot-toast'
import Loader from './Loader'
import axiosInstance from '../helpers/axiosInstance'
import FlightFormView from './FlightFormView'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { KTIcon, toAbsoluteUrl } from '../../_metronic/helpers'

interface InsurancePayload {
  id: string
  flight_status: string
  flight_remark?: string
  flight_pdf?: string
}

type TableRow = InsurancePayload & {
  first_name: string
  merchant_email_id: string
  merchant_phone_number: string
  nationality: string
  flight_amount: string
  _id: string
  group_id: string
}

type Props = {
  className: string
  title: String
  data: any[]
  loading: Boolean
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

const inputStyle = {
  border: '1.5px solid #d3d3d3',
  borderRadius: '10px',
  padding: '10px',
  paddingLeft: '20px',
  width: '90%',
  boxSizing: 'border-box',
}

const Wfwaiting: React.FC<Props> = ({className, title, data}) => {
  const [visible, setVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [tableData, setTableData] = useState(data)
  const [issueVisaLoader, setissueVisaLoader] = useState(false)
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([])
  const [deleteSelectedItem, setDeleteSelectedItem] = useState(null)
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState<TableRow[]>([])
  const [file, setFile] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showResubmitModal, setShowResubmitModal] = useState(false)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [rejectRemark, setRejectRemark] = useState('')
  const flightFileInputRef = useRef<HTMLInputElement | null>(null)
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

  const handleCheckboxChange = (id: string) => {
    setSelectedApplicants((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((applicantId) => applicantId !== id)
      } else {
        return [...prevState, id]
      }
    })
  }

  const handleStatusChange = async (applications: TableRow[], selectedStatus: string) => {
    setSelectedRows(applications)

    if (selectedStatus === 'Reject') {
      setShowRejectModal(true)
    } else if (selectedStatus === 'Re-Submit') {
      setShowResubmitModal(true)
    } else if (selectedStatus === 'Issue') {
      setShowIssueModal(true)
    }
  }

  const handleRejectSubmit = async () => {
    try {
      const allIds = selectedRows.map((row) => row._id)
      const payload = {
        ids: allIds,
        flight_status: 'Rejected',
        flight_remark: rejectRemark,
      }

      const response = await axiosInstance.post('/backend/upload_flight_file', payload)

      if (response.data.success === 1) {
        toast.success('Applications rejected successfully')
        handleCloseRejectModal()
        setTimeout(() => {
          window.location.reload()
        }, 2500)
      } else {
        toast.error('Error rejecting the applications')
      }
    } catch (error) {
      console.error('Error submitting rejection:', error)
      toast.error('Error submitting rejection')
    }
  }

  const handleResubmitSubmit = async () => {
    try {
      const selectedIds = selectedApplicants
      const payload = {
        ids: selectedIds,
        flight_status: 'Re-Submit',
        flight_remark: rejectRemark,
      }

      const response = await axiosInstance.post('/backend/upload_flight_file', payload)

      if (response.data.success === 1) {
        toast.success('Applications resubmitted successfully')
        setShowResubmitModal(false)
        setTimeout(() => {
          window.location.reload()
        }, 2500)
      } else {
        toast.error('Error resubmitting the applications')
      }
    } catch (error) {
      console.error('Error submitting resubmission:', error)
      toast.error('Error submitting resubmission')
    }
  }

  const handleIssueSubmit = async () => {
    if (selectedRows.length > 0 && file) {
      try {
        const allIds = selectedRows.map((row) => row._id)
        const payloads = selectedRows.map((row) => ({
          ids: allIds,
          flight_status: 'Issued',
          flight_pdf: file, // Upload the same file for all rows
        }))

        const promises = payloads.map((payload) =>
          axiosInstance.post('/backend/upload_flight_file', payload)
        )

        const responses = await Promise.all(promises)
        const allSuccess = responses.every((response) => response.data.success === 1)

        if (allSuccess) {
          toast.success('Applications issued successfully')
          handleCloseIssueModal()
          setTimeout(() => {
            window.location.reload()
          }, 2500)
        } else {
          toast.error('Error issuing some applications')
        }
      } catch (error) {
        console.error('Error submitting flight:', error)
        toast.error('Error submitting flight')
      }
    } else {
      toast.error('Please upload the flight file before submitting')
    }
  }

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
        const validFileTypes = ['application/zip', 'application/x-zip-compressed'];
        if (!validFileTypes.includes(file.type)) {
            toast.error('Only .zip files are allowed.', {position: 'top-center'});
            return;
        }

        if (file.size > maxSize) {
            toast.error('File size exceeds 300KB limit.', {position: 'top-center'});
            return;
        }

        try {
            const imageLink = await handleFileUpload(file);
            setFile(imageLink);
            toast.success('File uploaded successfully', {position: 'top-center'});
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading image. Please try again.', {position: 'top-center'});
        }
    }
  }


  const handleClickOpen = (item) => {
    setDeleteSelectedItem(item)
    setOpen(!open)
  }

  const handleClose = () => {
    setDeleteSelectedItem(null)
    setOpen(false)
  }

  const handleVisibilityClick = (item) => {
    setSelectedItem(item) // Set the selected item
    setVisible(true)
  }
  const handleVisibilityyClick = (item) => {
    setSelectedItem(item) // Set the selected item
    setShowRejectModal(true)
  }
  const handleCloseClick = () => {
    setSelectedItem(null) // Set the selected item
    setVisible(false)
  }
  const handleCloseRejectModal = () => {
    setShowRejectModal(false)
    setRejectRemark('')
  }

  const handleCloseIssueModal = () => {
    setShowIssueModal(false)
    setFile(null)
  }

  const [expandedGroups, setExpandedGroups] = useState<{[key: string]: boolean}>({})

  const groupData = (data: TableRow[]) => {
    const groupedData: {[key: string]: TableRow[]} = {}
    data.forEach((item) => {
      const groupId = item.group_id // Use group_id here
      if (!groupedData[groupId]) {
        groupedData[groupId] = []
      }
      groupedData[groupId].push(item)
    })
    return groupedData
  }

  const handleGroupToggle = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const groupedData = groupData(data)

  console.log("bv",data)
 
  return (
    <div style={{boxShadow: 'none'}} className={`card ${className}`}>
      <Toaster />
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 style={{marginLeft: '10px'}} className='card-title align-items-center flex-row'>
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
            <section style={{border: '1px solid #adc6a0'}} className='w-100 card my-5'>
              <div className='card-header'>
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
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    </div>
                  ) : (
                    <Accordion defaultActiveKey='0'>
                      {data.map(({group_id, applications}) => {
                        const firstApp = applications[0] || {}
                        const totalApps = applications.length
                        return (
                          <Accordion.Item
                            style={{border: '1px solid #327113', borderRadius: '5px'}}
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
                                  <th style={{ width: '10%' }}>Group ID</th>
                                  <th style={{ width: '20%' }}>Name</th>
                                  <th style={{ width: '20%' }}>Email</th>
                                  <th style={{ width: '10%' }}>Applicants</th>
                                  <th style={{ width: '20%' }}>Status</th>
                                  <th style={{ width: '20%' }}>Download Documents</th>
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
                                  <td>
                                    <button
                                      className='btn btn-sm btn-primary'
                                      // onClick={() => handleDownloadDocuments(group_id)}
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
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>Amount</th>
                                    <th className='text-center'>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {applications.map((app) => (
                                    <tr key={app._id}>
                                      <td>{app.first_name}</td>
                                      <td>{app.merchant_email_id}</td>
                                      <td>{app.merchant_phone_number}</td>
                                      <td>{app.flight_amount}</td>
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
                        )
                      })}
                    </Accordion>
                  )}
                </div>
              </div>
            </section>
          )}
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
      {issueVisaLoader && <Loader loading={issueVisaLoader} />}
      {visible && (
        <div
          className='loader-overlay'
          style={{...overlayStyle, ...(visible && activeOverlayStyle)}}
        >
          <div style={contentStyle}>
            <div
              onClick={() => handleCloseClick()}
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
            <FlightFormView viewApplication={selectedItem} />
          </div>
        </div>
      )}
      {showRejectModal && (
        <div
          className='loader-overlay'
          style={{...overlayStyle, ...(showRejectModal && activeOverlayStyle)}}
        >
          <div style={contentStyle}>
            <div
              onClick={handleCloseRejectModal}
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
              <button
                className='btn'
                style={{background: '#327113', width: '100px', color: '#fff'}}
                onClick={handleRejectSubmit}
              >
                Confirm
              </button>
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
              onClick={handleCloseRejectModal}
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

              <h3 className='mt-4'>Select Applicants</h3>
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
              ref={flightFileInputRef}
              className='form-control'
              id='flight_pdf'
              name='flight_pdf'
              accept='.zip'
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

export {Wfwaiting}
