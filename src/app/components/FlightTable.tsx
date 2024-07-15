import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { Button } from 'react-bootstrap';
import { KTIcon } from '../../_metronic/helpers';
import { toAbsoluteUrl } from '../../_metronic/helpers';

type Props = {
  className: string
  title: String,
  apiData: any;
  show?: (value: boolean) => void;
  visaList?: boolean;
  visaListLoader?: (value: boolean) => void;
  manualValue?: any;
  onSelectClick?: (entryData: {
    id: string;
    totalAmount: number;
    country_code: string;
    nationality_code: string;
    flight_original_amount: number;
    description: string;
    merchant_flight_amount: number;
  }) => void;
}

const FlightTable: React.FC<Props> = ({ className, title, apiData = {}, onSelectClick }) => {
  const [selectedflight, setSelectedflight] = useState<any | null>(null);

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

  const calculateRetailerPrice = (price: number) => {
    const markupPercentageString = localStorage.getItem('markup_percentage') ?? '1';
    const markupPercentage = parseFloat(markupPercentageString);
    return Math.round(price * (1 + markupPercentage / 100));
  };

  const calculateNumberOfDays = (issueDate: string, expiryDate: string) => {
    const issue = new Date(issueDate);
    const expiry = new Date(expiryDate);
    const timeDifference = expiry.getTime() - issue.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
    return daysDifference;
  };

  if (!apiData.flightData || !Array.isArray(apiData.flightData)) {
    return <p>Invalid data format</p>;
  }

  const numberOfDays = calculateNumberOfDays(apiData.issue_date, apiData.expiry_date);

  const handleflightSelect = (flight: any) => {
    setSelectedflight(flight);
  };

  const handleProceed = () => {
    if (selectedflight && onSelectClick) {
      onSelectClick({
        id: selectedflight._id,
        totalAmount: parseFloat(selectedflight.flight_price_retailer),
        country_code: apiData.selectedFromCountry,
        nationality_code: apiData.selectedToCountry,
        flight_original_amount: parseFloat(selectedflight.flight_actual_price),
        description: selectedflight.description,
        merchant_flight_amount: calculateRetailerPrice(parseFloat(selectedflight.flight_price_retailer)),
      });
    }
  };
  console.log("adsf", apiData)
  return (
    <div style={{ boxShadow: "none" }} className={`card ${className}`}>
      <Toaster />
      <div className="card-body">
        <div className="age-group-tabs">
          <h1>Flight</h1>
        </div>
        <hr className='aahr' />
        <div className="row justify-content-center mt-12">
          {apiData.flightData.map((flight, index) => (
            <div key={index} className="col-md-4">
              <div
                onClick={() => handleflightSelect(flight)}
                style={{
                  backgroundPosition: 'right top',
                  backgroundSize: '30% auto',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: `url(${toAbsoluteUrl(getRandomBackgroundImage())})`,
                  border: selectedflight && selectedflight._id === flight._id ? '2px solid #327113' : '1px solid #dadada',
                  cursor: 'pointer',
                }}
                className="mb-xl-8 pricing-table purple"
              >
                <div className="pricing-label fs-4">{flight.name}</div>
                <div className="pricing-details">
                  <h6 style={{ fontWeight: "500", fontSize: "16px" }}>{flight.description}</h6>
                  <div className="pricing-features">
                    <div className="feature">Retailer Price: <span>₹{calculateRetailerPrice(parseFloat(flight.flight_price_retailer))}</span></div>
                    <div className="feature">No of Days: <span>{numberOfDays}</span></div>
                  </div>
                  <hr className='aahr' />
                  <div className="price-tag">
                    <span className="symbol">₹</span>
                    <span className="amount">{calculateRetailerPrice(parseFloat(flight.flight_price_retailer))}</span>
                    <span className="after">&nbsp;&nbsp;&nbsp;for {numberOfDays} Days</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedflight && (
          <div className="d-flex justify-content-center mt-4">
            <Button variant="primary" onClick={handleProceed}>Proceed</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export { FlightTable }
