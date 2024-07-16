import React from 'react'
import  './inner.css'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import Ticket1 from '../../../_metronic/assets/card/ticket1.svg'
import Ticket2 from '../../../_metronic/assets/card/ticket2.svg'

type Props = {
    className: string;
    title: String;
    show: (value: boolean) => void;
    visaList: boolean;
    visaListLoader: (value: boolean) => void;
    apiData: any;  // Add this line
    onApiDataReceived: (data: any) => void;
    manualValue: any
    onSelectClick: (entryData: any) => void; 
  }
  
  const Inner: React.FC<Props> = ({
    className,
    title,
    show,
    visaList,
    visaListLoader,
    apiData,
    onApiDataReceived,
    manualValue,
    onSelectClick,
  }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const receivedData: any = location.state as any;
    useEffect(() => {
        // Example: Set initial apiData from receivedData
        if (receivedData && receivedData.apiData) {
            onApiDataReceived(receivedData.apiData);
        }
    }, [receivedData, onApiDataReceived]);

    const handleSelectClick = (entryData) => {
        onSelectClick(entryData);
    };

    const handleApplyNowClick = () => {
        const selectedEntry = receivedData.apiData[selectedTicket];
        navigate('/applyvisa', { state: selectedEntry });
      };
      
    
    
    const markup_percentage = localStorage.getItem('markup_percentage')??'1';
  
    const [expandedCardIndex, setExpandedCardIndex] = useState(-1)
  
    const [priceCardIndex, setPriceCardIndex] = useState(-1)
  
    const [selectedTicket, setSelectedTicket] = useState(0);
  
    const [selectedTicketPrice, setSelectedTicketPrice] = useState(0);
  
    const [selectedQuantity, setSelectedQuantity] = useState(1);  
    
    const receivedDataArray = receivedData.dataArray || [];
    
    const handleTicketSelection = (ticketIndex) => {
        setSelectedTicket(ticketIndex);
        const selectedEntry = receivedData.apiData[ticketIndex];
        const visaFees = selectedEntry.receipt['Visa Fees'] || '';
        const serviceFees = selectedEntry.receipt['Service Fees'] || '';
        const calculatedPrice = Math.ceil(
          visaFees  + serviceFees
        );
        const initialPrice = calculatedPrice ;
        setSelectedTicketPrice(initialPrice);
      };

      useEffect(() => {
        // Set initial price when component mounts
        handleTicketSelection(selectedTicket);
      }, [selectedTicket]); 

    const toggleMenu = () => {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
          mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
          mobileMenu.classList.toggle('hamburger-open');
        }
      };

    const [showLoginModal, setShowLoginModal] = useState(false);
    const handleCloseLoginModal = () => setShowLoginModal(false);
    const handleCloseSignUpModal = () => setShowSignUpModal(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false); 
    const handleSignUpClick = () => {
        setShowLoginModal(false);
        setShowSignUpModal(true);
    }
    const sortedTickets = receivedData.apiData.sort((a, b) => {
    const getPrice = (entry: any) => {
        const visaFees = entry.receipt['Visa Fees'] || 0;
        const serviceFees = entry.receipt['Service Fees'] || 0;
        return Math.ceil((visaFees + serviceFees));
    };
    
        const priceA = getPrice(a);
        const priceB = getPrice(b);
    
        return priceA - priceB;
      });

      const handleLoginClick = () => {
        navigate('/customer/login')
      };


  return (
    <div>
  
        <div id="nav1">
        <a href='/' className="part11">
            <img className="logo" src="./media/logos/logo.png" alt="logo" />
        </a>

        <div className="part21">
          <button className="button2" onClick={handleLoginClick}>
            Login
          </button>
        </div>

        <i className="ri-menu-3-fill hamburger" onClick={toggleMenu}></i>
        <div id="mobile-menu">
            <a href="#">Home</a>
            <a href="#">Sign up</a>
            <a href="#">Login</a>
        </div>
        </div>

        <div className="choice-maini">
        <h1>Choose Your Visa Type</h1>
        <div className="choice">
        <div className="ticket-container" id="ticketContainer">
        {sortedTickets.map((entry: any, index: number) => {
            return (
                <div
                key={index}
                className={`ticket ${selectedTicket === index ? 'selected' : ''}`}
                onClick={() => handleTicketSelection(index)}
                >   
                    <div className="days">
                        <h1 className="days-size">{entry.day || "--" }</h1>
                        <span>Days</span>
                    </div>
                    <div className="ticket-area">
                        <div className="visa-type">TOURIST VISA&nbsp;
                        <img src={Ticket1} alt="" />
                        </div>
                        <div className="visa-des">
                            <div className="upper">
                                <div className="travel-from">
                                    <h6 className="from">From</h6>
                                    <h2 className="country">IND</h2>
                                </div>
                                <div className="svg-area">
                                    <img src={Ticket2} alt="" />
                                </div>
                                <div className="travel-to">
                                    <h6 className="from">To</h6>
                                    <h2 className="country">{entry.country_code}</h2>
                                </div>
                            </div>
                            <div className="lower">
                                <div className="details">
                                    <h6>Description</h6>
                                    <h2>{entry.description}</h2>
                                </div>
                                <div className="details1">
                                    <h6>Price</h6>
                                    <h2>
                                        ₹ {(
                                            parseInt(entry.receipt['Visa Fees']) +
                                            parseInt(entry.receipt['Service Fees'] || 0)
                                        )}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                );
            })}

        </div>
        <div style={{top:"25px"}} className="apply-card">
            <div className="text-cont">
                <h2><img className="icons" src="/media/assets/vt2.png"/>No of Days</h2>
                <h6>{receivedData.apiData[selectedTicket].day} Days</h6>
            </div>

            <div className="text-cont1">
                <h2 className="tb"><img className="icons" src="/media/assets/vt4.png"/>Total</h2>
                <div className="pb">
                    <h6 style={{top:"10px"}} className="amount">₹{selectedTicketPrice}</h6>
                    
                    <h2 className="tax-des">(includes all government related fees)</h2>
                </div>
            </div>

            <button onClick={handleApplyNowClick}>
                Apply Now
            </button>
        </div>
        
        </div>
    
        </div>
 
        <footer className="footer-seci">
            <img className="footer-bg" src="./media/assets/footer.png" alt=""/>
            <div className="mains">
              <div className="logo rowse">
                  <div className="footer-header">
                    <img src="./media/assets/logo3.png" className="manik" alt=""/>
                  </div>
                  <div className="logo-des">
                    <p>Visa247 facilitates seamless<br/> Visa online instantly..</p>
                    <div className="icons">
                        <a href="#"><i className="social-icon ri-facebook-fill"></i></a>
                        <a href="#"><i className="social-icon ri-instagram-line"></i></a>
                        <a href="#"><i className="social-icon ri-linkedin-fill"></i></a>
                        <a href="#"><i className="social-icon ri-infinity-fill"></i></a>
                    </div>
                  </div>
              </div>
            
              <div className="office rowse">
                  <div className="footer-header">
                      <h3>Company</h3>
                      </div>                   
                      <div className="link-des">
                      <a href="#" className="footer-links">Career</a>
                      <a href='/privacy-policy' target='_blank' className="footer-links">Privacy Policy</a>
                      <a href='/terms-and-conditions' target='_blank' className="footer-links">Terms & Conditions</a>
                  </div>
              </div>
            
            
              <div className="link rowse">
              </div>
            
            
              <div className="newsletter rowse">
                  <div className="footer-header">
                    <h3 >Join Our Newsletter</h3>
                  </div>
                  <div className="newsletter-des">
                    <div className="subcribe">
                        <input type="mail" placeholder = "Your email address" required/>
                        <button className="butt">Subscribe</button>
                    </div>
                    <div className="icons">
                        <p>Will send you weekly updates for your better tour packages</p>
                    </div>
                  </div>
              </div>
            
            </div>
            <div className="copyright">
              <hr/>
              <p>Copyright @ Visa247 2023. All Rights Reserved.</p>
            </div>
        </footer>
  
    </div>
  )
}

export default Inner;