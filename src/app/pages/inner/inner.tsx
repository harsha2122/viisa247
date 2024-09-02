import React from 'react'
import './inner.css'
import {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {Link, useNavigate} from 'react-router-dom'
import Ticket1 from '../../../_metronic/assets/card/ticket1.svg'
import Ticket2 from '../../../_metronic/assets/card/ticket2.svg'
import {FaFacebook} from 'react-icons/fa'
import {AiOutlineTwitter} from 'react-icons/ai'
import {AiFillInstagram} from 'react-icons/ai'

type Props = {
  className: string
  title: String
  show: (value: boolean) => void
  visaList: boolean
  visaListLoader: (value: boolean) => void
  apiData: any // Add this line
  onApiDataReceived: (data: any) => void
  manualValue: any
  onSelectClick: (entryData: any) => void
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
  const location = useLocation()
  const navigate = useNavigate()
  const receivedData: any = location.state as any
  useEffect(() => {
    // Example: Set initial apiData from receivedData
    if (receivedData && receivedData.apiData) {
      onApiDataReceived(receivedData.apiData)
    }
  }, [receivedData, onApiDataReceived])

  const handleSelectClick = (entryData) => {
    onSelectClick(entryData)
  }

  const handleApplyNowClick = (entry: any) => {
    navigate('/applyvisa', { state: entry })
  }

  const markup_percentage = localStorage.getItem('markup_percentage') ?? '1'

  const [expandedCardIndex, setExpandedCardIndex] = useState(-1)

  const [priceCardIndex, setPriceCardIndex] = useState(-1)

  const [selectedTicket, setSelectedTicket] = useState(0)

  const [selectedTicketPrice, setSelectedTicketPrice] = useState(0)

  const [selectedQuantity, setSelectedQuantity] = useState(1)

  const receivedDataArray = receivedData.dataArray || []

  const handleTicketSelection = (ticketIndex) => {
    setSelectedTicket(ticketIndex)
    const selectedEntry = receivedData.apiData[ticketIndex]
    const visaFees = selectedEntry.receipt['Visa Fees'] || ''
    const serviceFees = selectedEntry.receipt['Service Fees'] || ''
    const calculatedPrice = Math.ceil(visaFees + serviceFees)
    const initialPrice = calculatedPrice
    setSelectedTicketPrice(initialPrice)
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  

  useEffect(() => {
    handleTicketSelection(selectedTicket)
  }, [selectedTicket])

  const toggleMenu = () => {
    const mobileMenu = document.getElementById('mobile-menu')
    if (mobileMenu) {
      mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex'
      mobileMenu.classList.toggle('hamburger-open')
    }
  }

  const [showLoginModal, setShowLoginModal] = useState(false)
  const handleCloseLoginModal = () => setShowLoginModal(false)
  const handleCloseSignUpModal = () => setShowSignUpModal(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const handleSignUpClick = () => {
    setShowLoginModal(false)
    setShowSignUpModal(true)
  }
  const sortedTickets = receivedData.apiData.sort((a, b) => {
    const getPrice = (entry: any) => {
      const visaFees = entry.receipt['Visa Fees'] || 0
      const serviceFees = entry.receipt['Service Fees'] || 0
      return Math.ceil(visaFees + serviceFees)
    }

    const priceA = getPrice(a)
    const priceB = getPrice(b)

    return priceA - priceB
  })

  const handleLoginClick = () => {
    navigate('/customer/login')
  }

  return (
    <div>
      <div id='nav1'>
        <a href='/' className='part11'>
          <img className='logo' src='./media/logos/logo1.png' alt='logo' />
        </a>

        <div className='part21'>
          <button className='button2' onClick={handleLoginClick}>
            Login
          </button>
        </div>

        <i className='ri-menu-3-fill hamburger' onClick={toggleMenu}></i>
        <div id='mobile-menu'>
          <a href='#'>Home</a>
          <a href='#'>Sign up</a>
          <a href='#'>Login</a>
        </div>
      </div>

      <div className='choice-maini'>
        <h1 className='titile'> Choose Your Visa Type</h1>
        <div className='choice'>
          <div className='ticket-container' id='ticketContainer'>
            {sortedTickets.map((entry: any, index: number) => {
              return (
                <div
                className='d-flex justify-content-center'
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
                            <h2>₹{' '}
                              {parseInt(entry.receipt['Visa Fees']) +
                              parseInt(entry.receipt['Service Fees'] || 0)}
                            </h2>
                        </div>
                        <button onClick={() => handleApplyNowClick(entry)} className="choose-button">
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

      <footer className='footer-seci'>
        <img className='footer-bg' src='./media/assets/footer.png' alt='' />
        <div className='mains'>
          <div className='logo rowse'>
            <div className='footer-header'>
              <img src='./media/assets/logo3.png' className='manik' alt='' />
            </div>
            <div className='logo-des'>
              <p>
                Visa247 facilitates seamless
                <br /> Visa online instantly..
              </p>
              <div className='icons'>
                <a href='#'>
                  <i className='social-icon ri-facebook-fill'></i>
                </a>
                <a href='#'>
                  <i className='social-icon ri-instagram-line'></i>
                </a>
                <a href='#'>
                  <i className='social-icon ri-linkedin-fill'></i>
                </a>
                <a href='#'>
                  <i className='social-icon ri-infinity-fill'></i>
                </a>
              </div>
            </div>
          </div>

          <div className='office rowse'>
            <div className='footer-header'>
              <h3>Company</h3>
            </div>
            <div className='link-des'>
              <a href='#' className='footer-links'>
                Career
              </a>
              <a href='/privacy-policy' target='_blank' className='footer-links'>
                Privacy Policy
              </a>
              <a href='/terms-and-conditions' target='_blank' className='footer-links'>
                Terms & Conditions
              </a>
            </div>
          </div>

          <div className='link rowse'></div>

          <div className='newsletter rowse'>
            <div className='footer-header'>
              <h3>Social Links</h3>
            </div>
            <div className='social-icons-btn'>
              <a className='iconss twitter' href='#'>
                <AiOutlineTwitter name='logo-twitter' />
              </a>
              <a className='iconss facebook' href='#'>
                <FaFacebook name='logo-facebook' />
              </a>
              <a className='iconss instagram' href='#'>
                <AiFillInstagram name='logo-instagram' />
              </a>
            </div>
          </div>
        </div>
        <div className='copyright'>
          <hr />
          <p>Copyright @ Visa247 2023. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Inner
