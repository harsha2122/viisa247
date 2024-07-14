import React from 'react'
import  '../inner/inner.css'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaDownload } from "react-icons/fa";
import { BsArrowUpRight } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { FaBaby } from "react-icons/fa6";

enum Continent {
  Overview,
  Tour,
  Hotel,
  IE,
}

type Props = {
  packageItem: any;
}
  
const Packages = ({ packageItem }: Props) => {
  const location = useLocation();
  const [selectedContinent, setSelectedContinent] = useState<Continent>(Continent.Overview);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { packageData }: any = location.state || {};
  useEffect(() => {
  }, [packageItem]);

  const markup_percentage = localStorage.getItem('markup_percentage') ?? '1';

  const toggleMenu = () => {
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) {
          mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
          mobileMenu.classList.toggle('hamburger-open');
      }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    let dayWithSuffix;
    if (day === 1 || day === 21 || day === 31) {
      dayWithSuffix = `${day}st`;
    } else if (day === 2 || day === 22) {
      dayWithSuffix = `${day}nd`;
    } else if (day === 3 || day === 23) {
      dayWithSuffix = `${day}rd`;
    } else {
      dayWithSuffix = `${day}th`;
    }
  
    return `${dayWithSuffix} ${month} ${year}`;
  };

  return (
    <div>
        <div id="nav1">
        <a href='/' className="part11">
            <img className="logo" src="./media/logos/logo.png" alt="logo" />
        </a>

        <div className="part21">
        </div>

        <i className="ri-menu-3-fill hamburger" onClick={toggleMenu}></i>
        <div id="mobile-menu">
            <a href="#">Home</a>
            <a href="#">Sign up</a>
            <a href="#">Login</a>
        </div>
        </div>

        <div className="pack-main">
          <div className="pricing">
            <div className="deta">
              <h1>{packageData.packageName}</h1>
              <p className='pp'>Duration: <span className='data'>{packageData.duration} Days</span></p>
              <div className="amene">
              <p className='pp'>Includes</p>
              <div className="includes">
                {packageData.amenities.map((amenity, index) => (
                  <div className="blocky" key={index}>
                    <img src={amenity.icon} alt="" />
                    <p className='pp'>{amenity.name}</p>
                  </div>
                ))}
              </div>

              <div className="costing">
                <div className="per">
                  <h1>₹{new Intl.NumberFormat('en-IN').format(parseInt(packageData.cost_per_person))}</h1>
                  <p className='pp'>Per Person</p>
                </div>
                <div className="per">
                  <h1>{packageData.booked_seats != null ? packageData.booked_seats : 0}</h1>
                  <p className='pp'>Seats Booked</p>
                </div>

              </div>
              <div className="depart">
                <div className="location">
                  <p className="pp">Departures :</p>
                  <h3>{packageData.departure_location}</h3>
                </div>
                <button onClick={() => window.open(packageData.pdf_file)}>Download Tour Description <FaDownload /></button>
              </div>
              <hr style={{
                    width:"100%",
                    border: 0,
                    margin:"20px 0px",
                    height: "0.5px",
                    backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))"
                }} />
              <div className="tc">
                <h2>Total Cost -</h2>
                <div className="ct">
                  <h2> ₹ {new Intl.NumberFormat('en-IN').format(Number(packageData.total_package_cost))}</h2>
                  <p className='pp'>Inclusive of all taxes</p>
                </div>
              </div>
              <button className='bugs'>
                <Link to="/booking" state={{ packageData }}>
                  Book Now <BsArrowUpRight style={{marginLeft:"5px", fontWeight:"bold"}} />
                </Link>
              </button>
            </div>
            </div>
            <div className="imga">
              <img src={packageData.packageImage} alt="" />
            </div>
          </div>
          <div className="detailing {activeTab === 'overview' ? 'mainroe' : 'hotels'}">
            <div className="taba">
                <div onClick={() => setSelectedContinent(Continent.Overview)} className={`tabs ${selectedContinent === Continent.Overview ? 'activeTab' : ''}`}>
                  Package Overview
                </div>
                <div onClick={() => setSelectedContinent(Continent.Tour)} className={`tabs ${selectedContinent === Continent.Tour ? 'activeTab' : ''}`}>
                  Tour Cost
                </div>
                <div onClick={() => setSelectedContinent(Continent.Hotel)} className={`tabs ${selectedContinent === Continent.Hotel ? 'activeTab' : ''}`}>
                  Hotel
                </div>
                <div onClick={() => setSelectedContinent(Continent.IE)} className={`tabs ${selectedContinent === Continent.IE ? 'activeTab' : ''}`}>
                  Inclusion/Exclusion
                </div>
            </div>
            <hr style={{
              width:"90%",
              border: 0,
              marginLeft:"25px",
              marginTop:"0px",
              height: "1px",
              backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"
              }} />
              {selectedContinent === Continent.Overview && (
              <>
                <div className="mainroe">
                  <div className="roe">
                    <div className="conte">
                      <h3>Flight & Transport</h3>
                      {packageData.flight_and_transport.map((item, index) => (
                        <div key={index}>
                          <p className='pp'>{item}</p>
                        </div>
                      ))}
                    </div>
                    <div className="conte">
                      <h3>Visa and Taxes</h3>
                      {packageData.visa_and_taxes.map((item, index) => (
                        <div key={index}>
                          <p className='pp'>{item}</p>
                        </div>
                      ))}
                    </div>
                    <div className="conte">
                      <h3>Flight & Transport</h3>
                      <p className='pp'>Pickup and Drop will be in SIC basis</p>
                      <p className='pp'>All Ziyarats and Intercity transfer
                        will be on SIC Basis</p>
                      <p className='pp'>minimum 2 pax Required</p>
                      <p className='pp'>Air Tickets cost are included</p>
                    </div>
                  </div>
                  <h2>Overview</h2>
                  <p>{packageData.package_overview}</p>
                </div>
                <div className="ies">
                <div className="inc">
                  <h3>Payment Policy</h3>
                  <ul>
                    {packageData.payment_policy.map((policy, index) => (
                      <li key={index}>{policy}</li>
                    ))}
                  </ul>
                </div>
                <div className="exc">
                <h3>Cancellation Policy</h3>
                  <ul>
                    {packageData.cancellation_policy.map((policy, index) => (
                      <li key={index}>{policy}</li>
                    ))}
                  </ul>
                </div>
                </div>
              </>
              )}

              {selectedContinent === Continent.Hotel && (
                <>
                  <div className="hotels">
                    <div className="roe">
                    {packageData.hotels.map((hotel, index) => ( 
                      <div className="hot-card">
                        <img className='hga' src={hotel.hotelImage} alt="" />
                        <div className="detaila">
                          <h4>{hotel.name}</h4>
                          <p className='pp'>Duration - <span className='data'>{hotel.duration} days</span></p>
                        </div>
                        <h3 className='hotelname'>{hotel.location}</h3>
                        <div className="pilace">

                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                  <div className="ies">
                    <div className="inc">
                      <h3>Payment Policy</h3>
                      <ul>
                        {packageData.payment_policy.map((policy, index) => (
                          <li key={index}>{policy}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="exc">
                    <h3>Cancellation Policy</h3>
                      <ul>
                        {packageData.cancellation_policy.map((policy, index) => (
                          <li key={index}>{policy}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {selectedContinent === Continent.IE && (
                <>
                  <div className="ie">
                  <div className="inc">
                    <h3>Inclusions</h3>
                    <ul>
                      {packageData.inclusion.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                    <div className="exc">
                    <h3>Exclusions</h3>
                    <ul>
                      {packageData.exclusion.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    </div>
                  </div>

                  <div className="ies">
                    <div className="inc">
                      <h3>Payment Policy</h3>
                      <ul>
                        {packageData.payment_policy.map((policy, index) => (
                          <li key={index}>{policy}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="exc">
                    <h3>Cancellation Policy</h3>
                      <ul>
                        {packageData.cancellation_policy.map((policy, index) => (
                          <li key={index}>{policy}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {selectedContinent === Continent.Tour && (
                <>
                  <div className="toro">
                    <div className="dep">
                      <h1>Tour Details</h1>
                      <div className="dates">
                        <div className="blok">
                          <p className='pp'>Departures :</p>
                          <h4 className='datas'>{formatDate(packageData.departure_date)}</h4>
                        </div>
                        <div className="blok">
                          <p className='pp'>Arrival :</p>
                          <h4 className='datas'>{formatDate(packageData.arrival_date)}</h4>
                        </div>
                      </div>
                      <div className="blok">
                        <p className='pp'>Departure City :</p>
                        <h4 className='datas'>{packageData.departure_location}</h4>
                      </div>
                      <button className='bugss'>Request a Callback <BsArrowUpRight style={{marginLeft:"5px", fontWeight:"bold"}} /></button>
                    </div>
                    <div className="share">
                      {packageData.share_break_down.map((item, index) => (
                        <div className="der" key={index}>
                          <h2>{item.share} Share</h2>
                          <div className="ico">
                            {[...Array(parseInt(item.share))].map((_, i) => (
                              <FaUser key={i} style={{ fontSize: "30px" }} />
                            ))}
                          </div>
                          <h2>₹{new Intl.NumberFormat('en-IN').format(parseInt(item.price))}</h2>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="ies">
                    <div className="inc">
                      <h3>Payment Policy</h3>
                      <ul>
                        {packageData.payment_policy.map((policy, index) => (
                          <li key={index}>{policy}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="exc">
                    <h3>Cancellation Policy</h3>
                      <ul>
                        {packageData.cancellation_policy.map((policy, index) => (
                          <li key={index}>{policy}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
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
                      <a href="#" className="footer-links">About</a>
                      <a href="#" className="footer-links">Career</a>
                      <a href="#" className="footer-links">Blog</a>
                      <a href='/terms-and-conditions' className="footer-links">Terms & Conditions</a>
                  </div>
              </div>
            
            
              <div className="link rowse">
                  <div className="footer-header">
                    <h3>Destinations</h3>
                  </div> 
                  <div className="link-des">
                    <a href="#" className="footer-links">Maldives</a>
                    <a href="#" className="footer-links">Los Angeles</a>
                    <a href="#" className="footer-links">Las Vegas</a>
                    <a href="#" className="footer-links">Torronto</a>
                  </div>
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

export default Packages;