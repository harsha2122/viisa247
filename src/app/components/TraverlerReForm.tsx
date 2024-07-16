import React, {useState, useEffect} from 'react'
import {Form, Button, Row, Col, Container} from 'react-bootstrap'
import axiosInstance from '../../app/helpers/axiosInstance'
import toast, {Toaster} from 'react-hot-toast'

const TraverlerReForm = ({ind, onDataChange, selectedEntry}) => {
  const [formData, setFormData] = useState({...selectedEntry})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData({...selectedEntry})
  }, [selectedEntry])

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
      setLoading(false)
      return response.data.data // New image URL
    } catch (error) {
      console.error('Error uploading file:', error)
      setLoading(false)
      return ''
    }
  }

  const handleFileChange = async (e) => {
    const {name, files} = e.target
    if (files && files[0]) {
      const uploadedFileUrl = await handleFileUpload(files[0])
      console.log('Uploaded File URL:', uploadedFileUrl)
      setFormData((prevData) => ({
        ...prevData,
        [name]: uploadedFileUrl,
      }))
      onDataChange({
        ...formData,
        [name]: uploadedFileUrl,
      })
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    onDataChange({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updatedData = {
      _id: selectedEntry._id,
      passport_front: formData.passport_front,
      passport_back: formData.passport_back,
      photo: formData.photo,
      pan_card: formData.pan_card,
      tickets: formData.tickets,
      receipt_url: formData.receipt_url,
      application_destination: formData.application_destination,
      application_id: formData.application_id,
      birth_place: formData.birth_place,
      country_code: formData.country_code,
      fathers_name: formData.fathers_name,
      first_name: formData.first_name,
      gender: formData.gender,
      last_name: formData.last_name,
      passport_number: formData.passport_number,
      visa_amount: formData.visa_amount,
      visa_description: formData.visa_description,
      marital_status: formData.marital_status,
    }

    try {
      const response = await axiosInstance.post('/backend/update_user_application', updatedData)

      if (response.data.success === 1) {
        toast.success('Data updated successfully!')
        setTimeout(() => {
          window.location.reload()
        }, 2500)
      } else {
        toast.error('Error updating data: ' + response.data.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Error updating user application:', error)
      toast.error('Error updating data: ')
    }
  }

  return (
    <Container>
      <Toaster />
      <Form onSubmit={handleSubmit}>
        <Row>
          {formData.first_name && (
            <Col md={6}>
              <Form.Group controlId='first_name' className='mb-3'>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type='text'
                  name='first_name'
                  value={formData.first_name || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          )}

          {formData.last_name && (
            <Col md={6}>
              <Form.Group controlId='last_name' className='mb-3'>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type='text'
                  name='last_name'
                  value={formData.last_name || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          )}

          <Row>
            {formData.gender && (
              <Col md={6}>
                <Form.Group controlId='gender' className='mb-3'>
                  <Form.Label>Gender</Form.Label>
                  <Form.Control
                    as='select'
                    name='gender'
                    value={formData.gender || ''}
                    onChange={handleChange}
                  >
                    <option value=''>Select</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Other'>Other</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            )}
          </Row>

          <Row>
            {formData.marital_status && (
              <Col md={6}>
                <Form.Group controlId='gender' className='mb-3'>
                  <Form.Label>Marital Status</Form.Label>
                  <Form.Control
                    as='select'
                    name='maritalstatus'
                    value={formData.marital_status || ''}
                    onChange={handleChange}
                  >
                    <option value=''>Select</option>
                    <option value='Single'>Single</option>
                    <option value='Married'>Married</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            )}
          </Row>

          {formData.birth_place && (
            <Col md={6}>
              <Form.Group controlId='birth_place' className='mb-3'>
                <Form.Label>Birth Place</Form.Label>
                <Form.Control
                  type='text'
                  name='birth_place'
                  value={formData.birth_place || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          )}
          {formData.country_code && (
            <Col md={6}>
              <Form.Group controlId='country_code' className='mb-3'>
                <Form.Label>To Country</Form.Label>
                <Form.Control
                  type='text'
                  name='country_code'
                  value={formData.country_code || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          )}
        </Row>
        <Row>
          {formData.passport_number && (
            <Col md={6}>
              <Form.Group controlId='passport_number' className='mb-3'>
                <Form.Label>Passport Number</Form.Label>
                <Form.Control
                  type='text'
                  name='passport_number'
                  value={formData.passport_number || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          )}
        </Row>

        <Row>
          {formData.fathers_name && (
            <Col md={6}>
              <Form.Group controlId='fathers_name' className='mb-3'>
                <Form.Label>Father's Name</Form.Label>
                <Form.Control
                  type='text'
                  name='fathers_name'
                  value={formData.fathers_name || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          )}
        </Row>

        <Row>
        {formData.passport_front && (
            <Col md={6}>
              <Form.Group controlId="passport_front" className="mb-3">
                <Form.Label>Passport Front</Form.Label>
                <Form.Control
                  type="file"
                  name="passport_front"
                  onChange={handleFileChange}
                />
                {formData.passport_front && (
                  <img src={formData.passport_front} alt="Passport Front Preview" style={{ width: '100px', height: '100px' }} />
                )}
              </Form.Group>
            </Col>
          )}
          {formData.passport_back && (
            <Col md={6}>
              <Form.Group controlId="passport_back" className="mb-3">
                <Form.Label>Passport Back</Form.Label>
                <Form.Control
                  type="file"
                  name="passport_back"
                  onChange={handleFileChange}
                />
                {formData.passport_back && (
                  <img src={formData.passport_back} alt="Passport Back Preview" style={{ width: '100px', height: '100px' }} />
                )}
              </Form.Group>
            </Col>
          )}
          {formData.photo && (
            <Col md={6}>
              <Form.Group controlId="photo" className="mb-3">
                <Form.Label>Photo</Form.Label>
                <Form.Control
                  type="file"
                  name="photo"
                  onChange={handleFileChange}
                />
                {formData.photo && (
                  <img src={formData.photo} alt="Photo Preview" style={{ width: '100px', height: '100px' }} />
                )}
              </Form.Group>
            </Col>
          )}
          {formData.pan_card && (
            <Col md={6}>
              <Form.Group controlId="pan_card" className="mb-3">
                <Form.Label>PAN Card</Form.Label>
                <Form.Control
                  type="file"
                  name="pan_card"
                  onChange={handleFileChange}
                />
                {formData.pan_card && (
                  <img src={formData.pan_card} alt="PAN Card Preview" style={{ width: '100px', height: '100px' }} />
                )}
              </Form.Group>
            </Col>
          )}
          {formData.tickets && (
            <Col md={6}>
              <Form.Group controlId="tickets" className="mb-3">
                <Form.Label>Tickets</Form.Label>
                <Form.Control
                  type="file"
                  name="tickets"
                  onChange={handleFileChange}
                />
                {formData.tickets && (
                  <img src={formData.tickets} alt="Ticket Preview" style={{ width: '100px', height: '100px' }} />
                )}
              </Form.Group>
            </Col>
          )}
          {formData.receipt_url && (
            <Col md={6}>
              <Form.Group controlId="receipt_url" className="mb-3">
                <Form.Label>Receipt</Form.Label>
                <Form.Control
                  type="file"
                  name="receipt_url"
                  onChange={handleFileChange}
                />
                {formData.receipt_url && (
                  <img src={formData.receipt_url} alt="Receipt Preview" style={{ width: '100px', height: '100px' }} />
                )}
              </Form.Group>
            </Col>
          )}
        </Row>

        <Button variant='primary' type='submit' className='mt-3'>
          Submit
        </Button>
      </Form>
    </Container>
  )
}

export default TraverlerReForm
