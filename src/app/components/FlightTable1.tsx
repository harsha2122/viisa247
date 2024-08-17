import React, { useState } from 'react'
import hotels from "../../_metronic/assets/card/hotel.svg"

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

const FlightTable1: React.FC<Props> = ({ className, title, apiData = {}, onSelectClick }) => {
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

  const handleSelectAndProceed = (flight: any) => {
    setSelectedflight(flight);
    if (onSelectClick) {
      onSelectClick({
        id: flight._id,
        totalAmount: parseFloat(flight.flight_price_b2c),
        country_code: apiData.selectedFromCountry,
        nationality_code: apiData.selectedToCountry,
        flight_original_amount: parseFloat(flight.flight_actual_price),
        description: flight.description,
        merchant_flight_amount: calculateRetailerPrice(parseFloat(flight.flight_price_retailer)),
      });
    }
  };
console.log("sdf", apiData)
  const selectedFlightPrice = selectedflight ? parseFloat(selectedflight.flight_price_b2c) : 0;
  const selectedDays = selectedflight ? numberOfDays : "--";

  return (
    <div className="choice-maini">
      <h1 className="title">Choose Your Flight</h1>
      <div className="choice">
        <div className="ticket-container" id="ticketContainer">
          {apiData.flightData.map((flight, index) => (
            <div key={index} className="visa-card">
              <div className="entry-info">
                <h2>{numberOfDays} Days</h2>
                <p>Single Entry</p>
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
                  <h2>₹ {(parseFloat(flight.flight_price_b2c))}</h2>
                </div>
                <button 
                  className="choose-button" 
                  onClick={() => handleSelectAndProceed(flight)}
                >
                  Choose
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { FlightTable1 }
