import React, { useState } from 'react'
import hotels from "../../_metronic/assets/card/hotel.svg"

type Props = {
  className: string;
  title: String;
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

const HotelTable: React.FC<Props> = ({ className, title, apiData = {}, onSelectClick }) => {
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

  if (!apiData.hotelData || !Array.isArray(apiData.hotelData)) {
    return <p>Invalid data format</p>;
  }

  const numberOfDays = calculateNumberOfDays(apiData.issue_date, apiData.expiry_date);

  const handleSelectAndProceed = (hotel: any) => {
    setSelectedHotel(hotel);
    if (onSelectClick) {
      onSelectClick({
        id: hotel._id,
        totalAmount: parseFloat(hotel.hotel_price_retailer),
        country_code: apiData.selectedFromCountry,
        nationality_code: apiData.selectedToCountry,
        hotel_original_amount: parseFloat(hotel.hotel_actual_price),
        description: hotel.description,
        merchant_hotel_amount: calculateRetailerPrice(parseFloat(hotel.hotel_price_retailer)),
      });
    }
  };

  return (
    <div className="choice-maini">
      <h1 className="title">Choose Your Hotel Stay</h1>
      <div className="choice">
        <div className="ticket-container" id="ticketContainer">
          {apiData.hotelData.map((hotel, index) => (
            <div key={index} className="visa-card">
              <div className="entry-info">
                <h2>{numberOfDays} Days</h2>
                <p>Hotel Stay</p>
              </div>
              <div className="left-sectiona">
                <div className="hotel-details">
                  <div className='hotel-data'>
                    <h5>{apiData.selectedFromCountry}</h5>
                    <p>{apiData.issue_date}</p>
                  </div>
                  <img src={hotels} alt="" />
                  <div className='hotel-data'>
                    <h5>{apiData.selectedToCountry}</h5>
                    <p>{apiData.expiry_date}</p>
                  </div>
                </div>
              </div>
              <div className="right-section">
                <div className="amount">
                  <p>Amount</p>
                  <h2>₹ {calculateRetailerPrice(parseFloat(hotel.hotel_price_retailer))}</h2>
                </div>
                <button 
                  className="choose-button" 
                  onClick={() => handleSelectAndProceed(hotel)}
                >
                  Pay Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { HotelTable };
