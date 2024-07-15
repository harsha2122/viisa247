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
    hotel_original_amount: number;
    description: string;
    merchant_hotel_amount: number;
  }) => void;
}

const HotelTable1: React.FC<Props> = ({ className, title, apiData = {}, onSelectClick }) => {
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);

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

  const calculateNumberOfDays = (issueDate: string, expiryDate: string) => {
    const issue = new Date(issueDate);
    const expiry = new Date(expiryDate);
    const timeDifference = expiry.getTime() - issue.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
    return daysDifference;
  };

  if (!apiData.hotelData || !Array.isArray(apiData.hotelData)) {
    return <p>Invalid data format</p>;
  }

  const numberOfDays = calculateNumberOfDays(apiData.issue_date, apiData.expiry_date);

  const handleHotelSelect = (hotel: any) => {
    setSelectedHotel(hotel);
  };

  const handleProceed = () => {
    if (selectedHotel && onSelectClick) {
      onSelectClick({
        id: selectedHotel._id,
        totalAmount: parseFloat(selectedHotel.hotel_price_b2c),
        country_code: apiData.selectedFromCountry,
        nationality_code: apiData.selectedToCountry,
        hotel_original_amount: parseFloat(selectedHotel.hotel_actual_price),
        description: selectedHotel.description,
        merchant_hotel_amount: parseFloat(selectedHotel.hotel_price_b2c),
      });
    }
  };
  return (
    <div style={{ boxShadow: "none" }} className={`card ${className}`}>
      <Toaster />
      <div className="card-body">
        <div className="age-group-tabs">
          <h1>Hotel</h1>
        </div>
        <hr className='aahr' />
        <div className="row justify-content-center mt-12">
          {apiData.hotelData.map((hotel, index) => (
            <div key={index} className="col-md-4">
              <div
                onClick={() => handleHotelSelect(hotel)}
                style={{
                  backgroundPosition: 'right top',
                  backgroundSize: '30% auto',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: `url(${toAbsoluteUrl(getRandomBackgroundImage())})`,
                  border: selectedHotel && selectedHotel._id === hotel._id ? '2px solid #327113' : '1px solid #dadada',
                  cursor: 'pointer',
                }}
                className="mb-xl-8 pricing-table purple"
              >
                <div className="pricing-label fs-4">{hotel.name}</div>
                <div className="pricing-details">
                  <h6 style={{ fontWeight: "500", fontSize: "16px" }}>{hotel.description}</h6>
                  <div className="pricing-features">
                    <div className="feature">Retailer Price: <span>₹{parseFloat(hotel.hotel_price_b2c)}</span></div>
                    <div className="feature">No of Days: <span>{numberOfDays}</span></div>
                  </div>
                  <hr className='aahr' />
                  <div className="price-tag">
                    <span className="symbol">₹</span>
                    <span className="amount">{parseFloat(hotel.hotel_price_b2c)}</span>
                    <span className="after">&nbsp;&nbsp;&nbsp;for {numberOfDays} Days</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedHotel && (
          <div className="d-flex justify-content-center mt-4">
            <Button variant="primary" onClick={handleProceed}>Proceed</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export { HotelTable1 }
