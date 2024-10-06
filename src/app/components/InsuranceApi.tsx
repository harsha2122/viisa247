import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Modal, Button, Card, Row, Col } from 'react-bootstrap';

// Type definitions for the insurance data
type Source = {
  id: string;
  name: string;
  logo: string;
};

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
  name: string;
  nationality_code: string;
  country_code: string[];
  plans: {
    platinum: Plan;
    gold: Plan;
    silver: Plan;
  };
  source: Source;
  startingFromPrice: number;
  category: string;
};

// Component props
type Props = {
  className: string;
  title: string;
  data: Insurance[]; // Update this to accept the full insurance data
  loading: boolean;
};

const InsuranceApi: React.FC<Props> = ({ className, title, data, loading }) => {
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const navigate = useNavigate();

  // Handle Add Insurance (navigate with full insurance data)
  const handleAdd = (insurance: Insurance) => {
    // Here, we pass the complete insurance data to the next page via state
    navigate('/superadmin/addInsurance', { state: { insuranceData: insurance } });
  };

  const filteredData = data.filter((insurance) => {
    const insuranceName = insurance.name ? insurance.name.toLowerCase() : ''; 
    const insuranceCategory = insurance.category ? insurance.category.toLowerCase() : ''; 
    return (
      insuranceName.includes(searchTerm.toLowerCase()) ||
      insuranceCategory.includes(searchTerm.toLowerCase())
    );
  });

  console.log("df", data)
  
  return (
    <div className={className}>
      <Toaster />
      <div className="container px-4 py-10">
        <h1 className="mb-8">{title}</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Row>
            {filteredData.map((insurance) => (
              <Col key={insurance._id} md={4} className="mb-4">
                <Card>
                  <Card.Img
                    variant="top"
                    src={insurance.source.logo}
                    alt={insurance.source.name}
                    style={{ height: '150px', objectFit: 'contain' }}
                  />
                  <Card.Body>
                    <Card.Title>{insurance.insurance_description}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {insurance.source.name}
                    </Card.Subtitle>
                    <Card.Text>Base Price: ₹{insurance.startingFromPrice}</Card.Text>
                    <Card.Text>Category: {insurance.category}</Card.Text>

                    <Button variant="primary" onClick={() => handleAdd(insurance)}>
                      + Add Insurance
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export { InsuranceApi };
