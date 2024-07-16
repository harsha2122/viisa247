import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { Button } from 'react-bootstrap';
import { KTIcon } from '../../_metronic/helpers';
import { toAbsoluteUrl } from '../../_metronic/helpers';
import Ticket1 from '../../_metronic/assets/card/ticket1.svg';
import Ticket2 from '../../_metronic/assets/card/ticket2.svg';

type Props = {
  className: string;
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

  const selectedHotelPrice = selectedHotel ? parseFloat(selectedHotel.hotel_price_b2c) : 0;
  const selectedDays = selectedHotel ? numberOfDays : "--";

  return (
    <div className={`card ${className}`} style={{ boxShadow: "none" }}>
      <Toaster />
      <div className="card-body">
        <div className="choice">
          <div className="ticket-container" id="ticketContainer">
            {apiData.hotelData.map((hotel, index) => (
              <div
                key={index}
                className={`ticket ${selectedHotel && selectedHotel._id === hotel._id ? 'selected' : ''}`}
                onClick={() => handleHotelSelect(hotel)}
                style={{
                  backgroundPosition: 'right top',
                  backgroundSize: '30% auto',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: `url(${toAbsoluteUrl(getRandomBackgroundImage())})`,
                }}
              >
                <div className="days">
                  <h1 className="days-size">{numberOfDays}</h1>
                  <span>Days</span>
                </div>
                <div className="ticket-area">
                  <div className="visa-type">HOTEL STAY&nbsp;
                    <img src={Ticket1} alt="" />
                  </div>
                  <div className="visa-des">
                    <div className="upper">
                      <div className="travel-from">
                        <h6 className="from">From</h6>
                        <h2 className="country">{apiData.selectedFromCountry}</h2>
                      </div>
                      <div className="svg-area">
                        <img src={Ticket2} alt="" />
                      </div>
                      <div className="travel-to">
                        <h6 className="from">To</h6>
                        <h2 className="country">{apiData.selectedToCountry}</h2>
                      </div>
                    </div>
                    <div className="lower">
                      <div className="details">
                        <h6>Description</h6>
                        <h2>{hotel.description}</h2>
                      </div>
                      <div className="details1">
                        <h6>Price</h6>
                        <h2>₹ {parseFloat(hotel.hotel_price_b2c)}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ top: "25px" }} className="apply-card">
            <div className="text-cont">
              <h2><img className="icons" src="/media/assets/vt2.png" alt="" />No of Days</h2>
              <h6>{selectedDays} Days</h6>
            </div>
            <div className="text-cont1">
              <h2 className="tb"><img className="icons" src="/media/assets/vt4.png" alt="" />Total</h2>
              <div className="pb">
                <h6 style={{ top: "10px" }} className="amount">₹{selectedHotelPrice}</h6>
                <h2 className="tax-des">(includes all government related fees)</h2>
              </div>
            </div>
            <button onClick={handleProceed}>
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { HotelTable1 };
