import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { IoArrowBackOutline } from "react-icons/io5";
import './card.css'

type Props = {
  className: string
  title: String
  show: (value: boolean) => void
  visaList: boolean
  visaListLoader: (value: boolean) => void
  apiData: any
  manualValue: any
  onSelectClick: (entryData: any) => void 
}


const VisaTable: React.FC<Props> = ({
  className,
  title,
  show,
  visaList,
  visaListLoader,
  apiData,
  manualValue,
  onSelectClick,
}) => {
  const [sortedData, setSortedData] = useState<any[]>([]);
  useEffect(() => {
    const filteredData = apiData.filter((entry) =>
      entry.description !== "UAE 96 Hours Transit E-Visa" &&
      entry.description !== "UAE 48 Hours Transit E-Visa" &&
      entry.entryType.toLowerCase() !== "covid"
    );
    const tempSortedData = filteredData.sort((a, b) => {
      const priceA = calculateTotalPrice(a);
      const priceB = calculateTotalPrice(b);
      return priceA - priceB;
    });


    const initialSelectedTicket = 0;
    const initialPrice = calculateTotalPrice(tempSortedData[initialSelectedTicket]);

    setSelectedTicket(initialSelectedTicket);
    setSelectedTicketPrice(initialPrice);

    setSortedData(tempSortedData);
  }, [apiData]);

  const calculateTotalPrice = (entry) => {
    if (!entry || !entry.receipt) {
      return 0; 
    }
  
    const visaFees = entry.receipt['Visa Fees'] || 0;
    const serviceFees = entry.receipt['Service Fees'] || 0;
    const markupPercentageString = localStorage.getItem('markup_percentage') ?? '1';
    const markupPercentage = parseFloat(markupPercentageString);
    const calculatedPrice = Math.ceil((visaFees * (1 + markupPercentage / 100)) + serviceFees);
  
    return calculatedPrice;
  };

  const handleApplyNowClick = (index) => {
    setSelectedTicket(index);
    setSelectedTicketPrice(calculateTotalPrice(sortedData[index]));
    onSelectClick(sortedData[index]);
  };

  const markup_percentage = localStorage.getItem('markup_percentage')??'1';

  const [expandedCardIndex, setExpandedCardIndex] = useState(-1)

  const [priceCardIndex, setPriceCardIndex] = useState(-1)

  const [selectedTicket, setSelectedTicket] = useState(0);

  const [selectedTicketPrice, setSelectedTicketPrice] = useState(0);

  const [selectedQuantity, setSelectedQuantity] = useState(1);  

  return (
    <div className='choice-maini'>
        <h1 className='titile'> Choose Your Visa Type</h1>
        <div className='choice'>
          <div className='ticket-container' id='ticketContainer'>
            {sortedData.map((entry: any, index: number) => {
              return (
                <div
                  key={index}
                >
                  <div className="visa-card">
                    <div className="entry-info">
                        <h2>{entry.day || '--'} Days</h2>
                        <p>Single Entry</p>
                    </div>
                    <div className="left-section">
                        <div className="visa-details">
                            <p>Visa Type: Tourist Visa</p>
                            <p>Price is inclusive of taxes.</p>
                            <p>{entry.description}</p>
                        </div>
                        <div className="stay-validity">
                            <p><span>✔</span> Stay Period: <strong>{entry.day || '--'} Days</strong></p>
                            <p><span>✔</span> Validity: <strong>58 Days</strong></p>
                        </div>
                    </div>
                    <div className="right-section">
                        <div className="amount">
                            <p>Amount</p>
                            <h2>₹ {Math.ceil(
                          ((entry && entry.receipt && entry.receipt['Visa Fees']) ? entry.receipt['Visa Fees'] : 0) * 
                          ((parseFloat(markup_percentage) ? (1 + (parseFloat(markup_percentage) / 100)) : 1)) +
                          ((entry && entry.receipt && entry.receipt['Service Fees']) ? entry.receipt['Service Fees'] : 0)
                        )}
                            </h2>
                        </div>
                        <button 
                          className="choose-button" 
                          onClick={() => handleApplyNowClick(index)}
                        >
                          Choose
                        </button>

                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
  )
}

export {VisaTable}
