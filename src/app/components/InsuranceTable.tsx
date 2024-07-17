import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '../../_metronic/helpers';
import axiosInstance from '../helpers/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import { Modal, Button } from 'react-bootstrap';

type Plan = {
  plan_name: string;
  age_groups: AgeGroup[];
};

type AgeGroup = {
  age_group: string;
  description: string;
  partner: Price;
  retailer: Price;
  customer: Price;
  benefits: string[];
  _id: string;
};

type Price = {
  base_price: string;
  price_per_day: string;
  _id: string;
};

type Insurance = {
  _id: string;
  insurance_description: string;
  insurance_base_price: string;
  insurance_per_day_price: string;
  nationality_code: string;
  country_code: string[];
  plans: {
    platinum: Plan;
    gold: Plan;
    silver: Plan;
  };
};

type Props = {
  className: string;
  title: string;
  data: Insurance[];
  loading: boolean;
};

const InsuranceTable: React.FC<Props> = ({ className, title, data, loading }) => {
  const [activeTab, setActiveTab] = useState<string>('platinum'); // Default active tab
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term

  const backgroundImages = [
    '/media/svg/shapes/abstract-1.svg',
    '/media/svg/shapes/abstract-2.svg',
    '/media/svg/shapes/abstract-3.svg',
    '/media/svg/shapes/abstract-4.svg'
  ];

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  const getRandomBackgroundImage = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return backgroundImages[randomIndex];
  };

  const handleDelete = async (id: string) => {
    try {
      const insuranceId = id;
      const response = await axiosInstance.delete(`/backend/delete_insurance/${insuranceId}`);
      if (response.status === 200) {
        toast.success(response.data.msg, {
          position: 'top-center',
        });
        setTimeout(() => {
          window.location.reload();
        }, 2500); // Reload the page after deletion
      } else {
        toast.error(response.data.msg, {
          position: 'top-center',
        });
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.', {
        position: 'top-center',
      });
    }
  };

  const openModal = (id: string) => {
    setSelectedInsuranceId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedInsuranceId(null);
    setShowModal(false);
  };

  const confirmDelete = async () => {
    if (selectedInsuranceId) {
      await handleDelete(selectedInsuranceId);
      closeModal();
    }
  };

  const filteredData = data.filter((insurance: Insurance) =>
    insurance.insurance_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insurance.nationality_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insurance.country_code.some(code => code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <Toaster />
      <div className="container px-4 py-10">
        <div className="age-group-tabs">
          <h1>{title}</h1>
          <div className='w-75 d-flex justify-content-end gap-3'>
            <Link to='/superadmin/addInsurance' className='boton'>+ Add New Insurance</Link>
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search by description, nationality code, or country code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {filteredData.map((insurance: Insurance) => (
          <div className={`card ${className} px-10 mb-8`} key={insurance._id}>
            <div className="age-group-tabs">
              <h2>{insurance.insurance_description}</h2>
              <button onClick={() => openModal(insurance._id)} className='btn btn-danger'>Delete</button>
            </div>
            <div className="d-flex flex-column">
              <h2>Insurance Base Price - ₹{insurance.insurance_base_price}</h2>
              <h2>Insurance Price Per Day - ₹{insurance.insurance_per_day_price}</h2>
            </div>
            <div className='d-flex justify-content-center best-tab my-8 gap-4'>
              {Object.keys(insurance.plans).map((planType: string) => {
                if (['platinum', 'gold', 'silver'].includes(planType)) {
                  return (
                    <button
                      key={planType}
                      className={`age-group-tab capitalize ${activeTab === planType ? 'active' : ''}`}
                      onClick={() => handleTabChange(planType)}
                    >
                      {insurance.plans[planType as keyof typeof insurance.plans].plan_name}
                    </button>
                  );
                }
                return null;
              })}
            </div>
            <div className="row">
              {(insurance.plans[activeTab as keyof typeof insurance.plans].age_groups || []).map((plan: AgeGroup, index: number) => (
                <div key={`${insurance._id}-${activeTab}-${index}`} className="col-md-4">
                  <div
                    style={{
                      backgroundPosition: 'right top',
                      backgroundSize: '30% auto',
                      backgroundRepeat: 'no-repeat',
                      backgroundImage: `url(${toAbsoluteUrl(getRandomBackgroundImage())})`,
                    }}
                    className={`mb-xl-8 pricing-table purple ${activeTab}`}
                  >
                    <div className="pricing-label">{plan.description}</div>
                    <div className="pricing-details">
                      <h2>{plan.age_group}</h2>
                      <div className="pricing-features">
                        <div className="feature">Partner Base Price: <span>₹{plan.partner.base_price}</span></div>
                        <div className="feature">Partner Price per Day: <span>₹{plan.partner.price_per_day}</span></div>
                        <div className="feature">Retailer Base Price: <span>₹{plan.retailer.base_price}</span></div>
                        <div className="feature">Retailer Price per Day: <span>₹{plan.retailer.price_per_day}</span></div>
                        <div className="feature">Customer Base Price: <span>₹{plan.customer.base_price}</span></div>
                        <div className="feature">Customer Price per Day: <span>₹{plan.customer.price_per_day}</span></div>
                        <hr className='aahr' />
                        <div className="feature">
                          <h4>Benefits:</h4>
                          <ul className='d-flex flex-column gap-2'>
                            {plan.benefits.map((benefit, index) => (
                              <li key={index}>
                                <h6>{benefit}</h6>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="price-tag">
                        <span className="symbol">₹</span>
                        <span className="amount">{plan.customer.base_price}</span>
                        <span className="after">&nbsp;&nbsp;&nbsp;B2C Base Price</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this insurance?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export { InsuranceTable };

