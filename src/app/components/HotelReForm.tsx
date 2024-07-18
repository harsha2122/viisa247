import React, {useState, useEffect, CSSProperties} from 'react'
import {Form, Button, Row, Col, Container} from 'react-bootstrap'
import axiosInstance from '../../app/helpers/axiosInstance'
import toast, {Toaster} from 'react-hot-toast'

const inputStyle: CSSProperties = {
  border: '1.5px solid #d3d3d3',
  borderRadius: '10px',
  padding: '10px',
  paddingLeft: '20px',
  width: '90%',
  boxSizing: 'border-box',
};


const HotelReForm = ({ind, onDataChange, selectedEntry}) => {
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
      country_code: formData.country_code,
      nationality_code: formData.nationality_code,
      first_name: formData.first_name,
      traveller: formData.traveller,
      receipt_url: formData.receipt_url,
    }

    try {
      const response = await axiosInstance.post('/backend/update_hotel_application', updatedData)

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

  console.log('asd', selectedEntry)

  return (
    <Container>
      <Toaster />
      <Form onSubmit={handleSubmit}>
        <Row>
            <Col md={6}>
              <Form.Group controlId='traveller' className='mb-3'>
                <Form.Label>TRavellers</Form.Label>
                <Form.Control
                  type='text'
                  name='traveller'
                  value={formData.traveller || ''}
                  style={{ ...inputStyle, width: '95%' }}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId='first_name' className='mb-3'>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type='text'
                  name='first_name'
                  value={formData.first_name || ''}
                  style={{ ...inputStyle, width: '95%' }}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
        </Row>

        <Button variant='primary' type='submit' className='mt-3'>
          Submit
        </Button>
      </Form>
    </Container>
  )
}

export default HotelReForm
