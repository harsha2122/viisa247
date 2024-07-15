/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axiosInstance from '../helpers/axiosInstance'
import { KTIcon } from '../../_metronic/helpers';
import { toAbsoluteUrl } from '../../_metronic/helpers';

type Props = {
  className: string
  title: String,
  data: any[];
  loading: Boolean
}

const DummyHotel: React.FC<Props> = ({ className, title, data, loading }) => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hotel_price_b2c: '',
    hotel_price_partner: '',
    hotel_price_retailer: '',
    hotel_actual_price: '',
  });
  const [letterCount, setLetterCount] = useState(0);
  const maxLetters = 100;

  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleDeleteClose = () => setDeleteShow(false);
    const handleDeleteShow = (id: string) => {
      setDeleteId(id);
      setDeleteShow(true);
    }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'description') {
      if (value.length <= maxLetters) {
        setFormData({
          ...formData,
          [name]: value,
        });
        setLetterCount(value.length);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post('/backend/create_dummy_hotel', formData);
      handleClose();
      toast.success('Hotel created successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again later.', {
        position: 'top-center',
      });
    }
  };
  const backgroundImages = [
    '/media/svg/shapes/abstract-1.svg',
    '/media/svg/shapes/abstract-2.svg',
    '/media/svg/shapes/abstract-3.svg',
    '/media/svg/shapes/abstract-4.svg'
  ];

  const getRandomBackgroundImage = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return backgroundImages[randomIndex];
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.post('/backend/delete_dummy_hotel', { _id: deleteId });
      toast.success('Hotel deleted successfully!');
      handleDeleteClose();
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete the hotel.');
    }
  };

  return (
    <div style={{ boxShadow: "none" }} className={`card ${className}`}>
      <Toaster />
      <div className="card-body">
        <div className="age-group-tabs">
          <h1>Dummy Hotels</h1>
          <div className='w-75 d-flex justify-content-end gap-3'>
            <Button variant="primary" onClick={handleShow}>+ Add Hotel</Button>
            <input
              type="text"
              className="form-control w-25"
              placeholder="Search ..."
            />
          </div>
        </div>
        <hr className='aahr' />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="row mt-12">
            {data.map((hotel, index) => (
              <div key={index} className="col-md-4">
                <div
                  style={{
                    backgroundPosition: 'right top',
                    backgroundSize: '30% auto',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: `url(${toAbsoluteUrl(getRandomBackgroundImage())})`,
                  }}
                  className="mb-xl-8 pricing-table purple"
                >
                  <div className="pricing-label fs-4">{hotel.name}</div>
                  <div className="pricing-details">
                    <h6 style={{fontWeight:"500", fontSize:"16px"}}>{hotel.description}</h6>
                    <div className="pricing-features">
                      <div className="feature">B2C Price: <span>₹{hotel.hotel_price_b2c}</span></div>
                      <div className="feature">Partner Price: <span>₹{hotel.hotel_price_partner}</span></div>
                      <div className="feature">Retailer Price: <span>₹{hotel.hotel_price_retailer}</span></div>
                      <div className="feature">Actual Price: <span>₹{hotel.hotel_actual_price}</span></div>
                    </div>
                    <hr className='aahr' />
                    <div className="price-tag">
                      <span className="symbol">₹</span>
                      <span className="amount">{hotel.hotel_actual_price}</span>
                      <span className="after">&nbsp;&nbsp;&nbsp;Actual Base Price</span>
                    </div>
                    <button
                        title='Delete'
                        style={{float:"right", bottom:"20px", position:"relative", right:"-15px"}}
                        onClick={() => handleDeleteShow(hotel._id)}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                    >
                        <KTIcon iconName='trash' className='fs-3' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new Hotel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label>Description (Letters left: {maxLetters - letterCount})</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formB2CPrice" className="mb-3">
                  <Form.Label>B2C Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="hotel_price_b2c"
                    value={formData.hotel_price_b2c}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPartnerPrice" className="mb-3">
                  <Form.Label>Partner Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="hotel_price_partner"
                    value={formData.hotel_price_partner}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formRetailerPrice" className="mb-3">
                  <Form.Label>Retailer Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="hotel_price_retailer"
                    value={formData.hotel_price_retailer}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formActualPrice" className="mb-3">
                  <Form.Label>Actual Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="hotel_actual_price"
                    value={formData.hotel_actual_price}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={deleteShow} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this hotel?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export { DummyHotel }
