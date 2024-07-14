import React, { useState, ReactElement, useRef, ChangeEvent } from 'react';
import './home.css';
import './swiper-bundle.min.css';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomeApply from '../../components/HomeApply';
import axiosInstance from '../../helpers/axiosInstance';
import { BsArrowUpRight } from "react-icons/bs";
import Loader from '../../components/Loader';
import not from '../../../_metronic/assets/card/3dnot.webp'
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';

type Props = {
  className: string;
  title: string;
  show: (value: boolean) => void;
  visaList: boolean;
  visaListLoader: (value: boolean) => void;
  apiData: any;
  onSelectClick: (entryData: any) => void;
  selectedFromCountry: string;
  selectedToCountry: string;
};

enum Continent {
    HotDeals,
    Asia,
    Europe,
    MiddleEast,
  }

  type PackageItem = {
    _id: string;
    packageName: string;
    departure_date: string;
    arrival_date: string;
    total_seats: number;
    total_package_cost: number;
    duration: string;
  };

const Home: React.FC<Props> = ({
  className,
  title,
  show,
  visaList,
  visaListLoader,
  apiData,
  onSelectClick,
}) => {
  const navigate = useNavigate();

  const [apiDataState, setApiData] = useState(null);
  const [visaListState, setVisaList] = useState(false);
  const [manualValue, setManualValue] = useState(false); // Initialize as false
  const [selectedToCountry, setSelectedToCountry] = useState('');
  const [visaListLoaderState, setVisalistLoader] = useState(false);
  const [selectedFromCountry, setSelectedFromCountry] = useState('');
  const [homeApplyComponent, setHomeApplyComponent] = useState<ReactElement | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<Continent>(Continent.HotDeals);

  const toggleMenu = () => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
      mobileMenu.classList.toggle('hamburger-open');
    }
  };

  const search = () => {
  };

  const handleApiDataReceived = (data) => {
    setApiData(data);
    if (data && data.visaList) {
      setVisaList(data.visaList);
    }
    setVisalistLoader(true);
    navigate('/searched-result', { state: { apiData: data } });
  };

  const [packageData, setPackageData] = useState<any[]>([]);
  const [issueDate, setIssueDate] = useState<string | undefined>('');
  const [expiryDate, setExpiryDate] = useState<string | undefined>('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
  
        axiosInstance.get('/backend/packages')
          .then((response) => {
            setPackageData(response.data);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchPackageData();
  }, []);

  const handleManualReceived = (data) => {
    setManualValue(data);
  };

  const onSelect = (values: any) => {
    setVisalistLoader(true);
    if (values.toCountry === 'AL') {
        setSelectedFromCountry('IN');
      } else {
        setSelectedFromCountry(values.fromCountry);
      }
      
      setSelectedToCountry(values.toCountry);
    const postData = {
      country_code: values.toCountry,
      nationality_code: 'IN',
    };
  
    axiosInstance
    .post('/backend/get_all_possible_visas_customer', postData)
    .then((response) => {
      const manualFieldValue = response.data.manual;
      if (!response.data.data || response.data.data.length === 0) {
        toast.error('Oops !!\nVisa for this country is not available.', {
          style: {
            background: '#fff',
            color: '#ff4444',
          },
          icon: <img src={not} alt="Not Found" style={{ width: '70px', height: '70px' }} />,
        });
        setVisalistLoader(false);
        return;
      }
  
      let main_data: {
        day: number | null;
        entryType: string | null;
        country: string | null;
        description: string | null;
        receipt: any | null;
        value: string | null;
      }[] = [];
  
      for (let i = 0; i < response.data.data.length; i++) {
        const apiData = response.data.data[i];
        const description = manualFieldValue ? apiData.visa_description : apiData.description;
        const dayMatch = description.match(/\d+/);
        const day = dayMatch ? parseInt(dayMatch[0]) : null;
  
        const countryTypeMatch = description.match(/(.+?)\s+\d+\s+Days/);
        const country = countryTypeMatch ? countryTypeMatch[1] : null;
        const entryTypeMatch = description.match(/Days\s+(\w+)/i);
        const entryType = entryTypeMatch ? entryTypeMatch[1] : null;
  
        const receipt = manualFieldValue ? { "Visa Fees": apiData.visa_price_b2c } : apiData.receipt;
  
        const extractedData = {
          day: manualFieldValue ? parseInt(apiData.visa_duration) : day,
          entryType: entryType ? entryType : 'Single',
          country: country,
          description: description,
          receipt: receipt,
          value: apiData.value,
          country_code: values.toCountry,
          nationality_code: values.fromCountry,
          application_arrival_date: issueDate,
          application_departure_date: expiryDate,
        };
  
        main_data.push(extractedData);
      }
      handleApiDataReceived(main_data);
      setVisalistLoader(false);
    })
      .catch((error) => {
        console.error('Error fetching Atlys data:', error);
        setVisalistLoader(false);
        toast.error('Some error occurred while fetching visa data.\nPlease try after some time', {
          style: {
            background: '#fff',
            color: '#ff4444',
          },
          icon: <img src={not} alt="Not Found" style={{ width: '70px', height: '70px' }} />, // Use the imported image as the icon
        });
      });
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

  const handleBookPackage = (packageItem) => {
    setPackageData(packageItem);
    navigate('/book-package', { state: { packageData: packageItem } });
  };

  const handleLoginClick = () => {
    navigate('/customer/login')
  };

  return (
    <> 
        <Toaster />
        <Loader loading={visaListLoaderState} />
        <div id="nav">
        <a href='/' className="part11">
          <img className="logo" src="./media/logos/logo.png" alt="logo" />
        </a>

        <div className="part21">
          <button className="button2" onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </div>

        <div className="page1h">
            <img className="bgimg" src="./media/assets/bgm1.jpg"/>
            <h1>
                Getting visa was <br /><span className='sapn'>never this easy</span>
            </h1>
            <div className="search-bar">
                <div className="search-conti">
                <HomeApply
                    show={(value) => setVisaList(value)}
                    visaList={visaList}
                    visaListLoader={setVisalistLoader}
                    onApiDataReceived={handleApiDataReceived}
                    manualValue={handleManualReceived}
                    selectedFromCountry={selectedFromCountry}
                    selectedToCountry={selectedToCountry}
                    />

                </div>
            </div>
        </div>

        <div className="visas">
            <div className="offers">
                <h2>Package Offers</h2>
                <ul>
                <div style={{cursor:"pointer"}} onClick={() => setSelectedContinent(Continent.HotDeals)}  className={selectedContinent === Continent.HotDeals ? 'activeContinent' : ''}>
                    Hot Deals
                </div>
                <hr style={{
                    width:"100%",
                    border: 0,
                    height: "1px",
                    backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))"
                }} />
                <li onClick={() => setSelectedContinent(Continent.Asia)} className={selectedContinent === Continent.Asia ? 'activeContinent' : ''}>Asia</li>
                    <hr style={{
                        width:"100%",
                        border: 0,
                        height: "0.5px",
                        backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))"
                    }} />
                <li onClick={() => setSelectedContinent(Continent.Europe)} className={selectedContinent === Continent.Europe ? 'activeContinent' : ''}>Europe</li>
                    <hr style={{
                    width:"100%",
                    border: 0,
                    height: "1px",
                    backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))"
                }} />
                <li onClick={() => setSelectedContinent(Continent.MiddleEast)}  className={selectedContinent === Continent.MiddleEast ? 'activeContinent' : ''}>Middle East</li>
                </ul>
            </div>
            {selectedContinent === Continent.HotDeals && (
            <>
                <div style={{ overflow: 'auto', scrollbarWidth: 'none', scrollbarColor: 'transparent transparent' }} className="package">
                {packageData.map(packageItem => (
                    <div key={packageItem._id} className="package1">
                    <div className="imgdiv">
                        <img src={packageItem.packageImage} alt="" />
                    </div>
                    <div className="right">
                        <div className="rl">
                        <h1>{packageItem.packageName}</h1>
                        <p>Date of Departure - <span className='cont'>{formatDate(packageItem.departure_date)}</span></p>
                        <p>Date of Arrival - <span className='cont'>{formatDate(packageItem.arrival_date)}</span></p>
                        <p>Seats Available - <span className='cont'>{packageItem.total_seats}</span></p>
                        <div className="pri">
                            <h1> ₹ {new Intl.NumberFormat('en-IN').format(Number(packageItem.total_package_cost))}</h1>
                            <p>including Tax</p>
                        </div>
                        </div>
                        <div className="rr">
                        <div className="dura">
                            <h1>{packageItem.duration}</h1>
                            <h2>Days</h2>
                        </div>
                        <div className="amen"></div>
                        <button onClick={() => handleBookPackage(packageItem)}>Book Now <BsArrowUpRight /></button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </>
            )}
            {selectedContinent === Continent.Asia && (
                <>
                    <div className="country1">
                        <div className="block1">
                            <div className="imgdiv">
                                <img src="/media/assets/south korea.jpg" alt="" />
                            </div>
                            <div className="contentdiv">
                                <h3>South Korea</h3>
                                <p>Multiple Visas</p>
                                <button onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'KR' })}>Book Now <BsArrowUpRight style={{marginTop:"-2px"}} /></button>
                            </div>
                        </div>
                        <div className="block2">
                            <div className="imgdiv">
                                <img src="/media/assets/japan.jpg" alt="" />
                            </div>
                            <div className="contentdiv">
                                <h3>Japan</h3>
                                <p>Multiple Visas</p>
                                <button onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'JP' })}>Book Now <BsArrowUpRight style={{marginTop:"-2px"}} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="card-vac">
                        <img src="./media/assets/russia.jpg" />
                        <div className="gradient-layer"></div>
                        <div className="book-box">
                            <h3>Russia</h3>
                            <div className="stars">
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                            </div>
                            <div className="book-now">
                                <button onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'RU' })}>Book Now <BsArrowUpRight style={{marginTop:"-2px"}} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="card-vac">
                        <img src="./media/assets/china.jpg" />
                        <div className="gradient-layer"></div>
                        <div className="book-box">
                            <h3>China</h3>
                            <div className="stars">
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                            </div>
                            <div className="book-now">
                                <button onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'CN' })}>Book Now <BsArrowUpRight style={{marginTop:"-2px"}} /></button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {selectedContinent === Continent.Europe && (
                <>
                    <div className="country1">
                        <div className="block1">
                            <div className="imgdiv">
                                <img src="/media/assets/turkey.jpg" alt="" />
                            </div>
                            <div className="contentdiv">
                                <h3>Turkey</h3>
                                <p>Multiple Visas</p>
                                <button onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'TR' })}>Book Now <BsArrowUpRight style={{marginTop:"-2px"}} /></button>
                            </div>
                        </div>
                        <div className="block2">
                            <div className="imgdiv">
                                <img src="/media/assets/albania.jpg" alt="" />
                            </div>
                            <div className="contentdiv">
                                <h3>Albania</h3>
                                <p>Multiple Visas</p>
                                <button onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'AL' })}>Book Now <BsArrowUpRight style={{marginTop:"-2px"}} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="card-vac">
                        <img src="/media/assets/greece.jpg" />
                        <div className="gradient-layer"></div>
                        <div className="book-box">
                            <h3>Greece</h3>
                            <div className="stars">
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                            </div>
                            <div className="book-now">
                                <button onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'GR' })}>Book Now <BsArrowUpRight style={{marginTop:"-2px"}} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="card-vac">
                        <img src="/media/assets/portugal.jpg" />
                        <div className="gradient-layer"></div>
                        <div className="book-box">
                            <h3>Portugal</h3>
                            <div className="stars">
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                            </div>
                            <div className="book-now">
                                <button onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'PT' })}>Book Now <BsArrowUpRight style={{marginTop:"-2px"}} /></button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {selectedContinent === Continent.MiddleEast && (
                <>
                    <div className="country1">
                        <div className="block1">
                            <div className="imgdiv">
                                <img src="/media/assets/qatar.jpg" alt="" />
                            </div>
                            <div className="contentdiv">
                                <h3>Qatar</h3>
                                <p>Multiple Visas</p>
                                <button onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'QA' })}>Book Now <BsArrowUpRight style={{marginTop:"-2px"}} /></button>
                            </div>
                        </div>
                        <div className="block2">
                            <div className="imgdiv">
                                <img src="/media/assets/jordan.jpg" alt="" />
                            </div>
                            <div className="contentdiv">
                                <h3>Jordan</h3>
                                <p>Multiple Visas</p>
                                <button onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'JO' })}>Book Now <BsArrowUpRight style={{marginTop:"-2px"}} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="card-vac">
                        <img src="./media/assets/saudi.jpg" />
                        <div className="gradient-layer"></div>
                        <div className="book-box">
                            <h3>Saudi Arabia</h3>
                            <div className="stars">
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                            </div>
                            <div className="book-now">
                                <button onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'SA' })}>Book Now <BsArrowUpRight style={{marginTop:"-2px"}} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="card-vac">
                        <img src="./media/assets/israel.jpg" />
                        <div className="gradient-layer"></div>
                        <div className="book-box">
                            <h3>Israel</h3>
                            <div className="stars">
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                                <img className='sitar' src="/media/assets/star.png" alt="" />
                            </div>
                            <div className="book-now">
                                <button onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'IL' })}>Book Now <BsArrowUpRight style={{marginTop:"-2px"}} /></button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>

        <div className="page2h">
            <h1 className="head">Premium Offers In Premium Destinations </h1>
            <div style={{ overflow: 'auto', scrollbarWidth: 'none', scrollbarColor: 'transparent transparent' }} className="conti">
                <a onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'AE' })} className="cards-single cursor-pointer">
                    <div className="img-conti">
                        <img className="imgr" src="./media/assets/uae.jpg" alt="" />
                    </div>
                    <div className="title">
                        <h1 className="heading">U.A.E</h1>
                        <span className="rating">
                            
                        </span>

                    </div>
                    <div className="title-2">Tourist Visa</div>
                    <div className="card-info">
                        <ul>
                            <li>Approval Chances 90%</li>
                            <li>Best Visa time</li>
                            <li>Look Around</li>
                        </ul>  
                    </div>
                    <div className="card-price">
                        <del className="del">₹10,000</del>
                        <div className="amount">
                            ₹7,161 <span className="per">Per Person</span>
                        </div>
                    </div>
                </a>
                <a onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'SG' })} className="cards-single cursor-pointer">
                    <div className="img-conti">
                        <img className="imgr" src="./media/assets/singapore.jpg" alt="" />
                    </div>
                    <div className="title">
                        <h1 className="heading">Singapore</h1>
                        <span className="rating">
                            
                        </span>

                    </div>
                    <div className="title-2">Tourist Visa</div>
                    <div className="card-info">
                        <ul>
                            <li>Approval Chances 90%</li>
                            <li>E Visa</li>
                            <li>Holiday</li>
                        </ul>  
                    </div>
                    <div className="card-price">
                        <del className="del">₹3,500</del>
                        <div className="amount">
                            ₹2,767 <span className="per">Per Person</span>
                        </div>
                    </div>
                </a>
                <a onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'SA' })} className="cursor-pointer cards-single">
                    <div className="img-conti">
                        <img className="imgr" src="./media/assets/saudi.jpg" alt="" />
                    </div>
                    <div className="title">
                        <h1 className="heading">Saudi Arabia</h1>
                        <span className="rating">
                            
                        </span>

                    </div>
                    <div className="title-2">Tourist Visa</div>
                    <div className="card-info">
                        <ul>
                            <li>Approval Chances 90%</li>
                            <li>E Visa</li>
                            <li>Explore</li>
                        </ul>  
                    </div>
                    <div className="card-price">
                        <del className="del">₹15,000</del>
                        <div className="amount">
                            ₹12,598 <span className="per">Per Person</span>
                        </div>
                    </div>
                </a>
                <a onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'MY' })} className="cursor-pointer cards-single">
                    <div className="img-conti">
                        <img className="imgr" src="./media/assets/malaysia.jpg" alt="" />
                    </div>
                    <div className="title">
                        <h1 className="heading">Malaysia</h1>
                        <span className="rating">
                            
                        </span>

                    </div>
                    <div className="title-2">Tourist Visa</div>
                    <div className="card-info">
                        <ul>
                            <li>Approval Chances 90%</li>
                            <li>Tourist Visa</li>
                            <li>Vacation</li>
                        </ul>  
                    </div>
                    <div className="card-price">
                        <del className="del">₹16,500</del>
                        <div className="amount">
                            ₹14,444 <span className="per">Per Person</span>
                        </div>
                    </div>
                </a>
                <a onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'TH' })} className="cursor-pointer cards-single">
                    <div className="img-conti">
                        <img className="imgr" src="./media/assets/thailand.jpg" alt="" />
                    </div>
                    <div className="title">
                        <h1 className="heading">Thailand</h1>
                        <span className="rating">
                            
                        </span>

                    </div>
                    <div className="title-2">Tourist Visa</div>
                    <div className="card-info">
                        <ul>
                            <li>Approval Chances 90%</li>
                            <li>Visa within 6 Days</li>
                            <li>Visit</li>
                        </ul>  
                    </div>
                    <div className="card-price">
                        <del className="del">₹8,275</del>
                        <div className="amount">
                            ₹7,258 <span className="per">Per Person</span>
                        </div>
                    </div>
                </a>
                <a onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'OM' })} className="cursor-pointer cards-single">
                    <div className="img-conti">
                        <img className="imgr" src="./media/assets/oman.jpg" alt="" />
                    </div>
                    <div className="title">
                        <h1 className="heading">Oman</h1>
                        <span className="rating">
                            
                        </span>

                    </div>
                    <div className="title-2">Tourist Visa</div>
                    <div className="card-info">
                        <ul>
                            <li>Approval Chances 90%</li>
                            <li>Visa within 6 Days</li>
                            <li>Visit</li>
                        </ul>  
                    </div>
                    <div className="card-price">
                        <del className="del">₹4,500</del>
                        <div className="amount">
                            ₹2,238 <span className="per">Per Person</span>
                        </div>
                    </div>
                </a>
                <a onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'TR' })} className="cursor-pointer cards-single">
                    <div className="img-conti">
                        <img className="imgr" src="./media/assets/turkey.jpg" alt="" />
                    </div>
                    <div className="title">
                        <h1 className="heading">Turkey</h1>
                        <span className="rating">
                            
                        </span>

                    </div>
                    <div className="title-2">Tourist Visa</div>
                    <div className="card-info">
                        <ul>
                            <li>Approval Chances 90%</li>
                            <li>Visa within 6 Days</li>
                            <li>Visit</li>
                        </ul>  
                    </div>
                    <div className="card-price">
                        <del className="del">₹5,300</del>
                        <div className="amount">
                            ₹4,352 <span className="per">Per Person</span>
                        </div>
                    </div>
                </a>
                <a onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'GE' })} className="cursor-pointer cards-single">
                    <div className="img-conti">
                        <img className="imgr" src="./media/assets/georgia.jpg" alt="" />
                    </div>
                    <div className="title">
                        <h1 className="heading">Georgia</h1>
                        <span className="rating">
                            
                        </span>

                    </div>
                    <div className="title-2">Tourist Visa</div>
                    <div className="card-info">
                        <ul>
                            <li>Approval Chances 90%</li>
                            <li>Visa within 6 Days</li>
                            <li>Visit</li>
                        </ul>  
                    </div>
                    <div className="card-price">
                        <del className="del">₹5,500</del>
                        <div className="amount">
                            ₹4,166 <span className="per">Per Person</span>
                        </div>
                    </div>
                </a>
                <a onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'EG' })} className="cursor-pointer cards-single">
                    <div className="img-conti">
                        <img className="imgr" src="./media/assets/egypt.jpg" alt="" />
                    </div>
                    <div className="title">
                        <h1 className="heading">Egypt</h1>
                        <span className="rating">
                            
                        </span>

                    </div>
                    <div className="title-2">Tourist Visa</div>
                    <div className="card-info">
                        <ul>
                            <li>Approval Chances 90%</li>
                            <li>Visa within 6 Days</li>
                            <li>Visit</li>
                        </ul>  
                    </div>
                    <div className="card-price">
                        <del className="del">₹2,800</del>
                        <div className="amount">
                            ₹1,556 <span className="per">Per Person</span>
                        </div>
                    </div>
                </a>
                <a onClick={() => onSelect({ fromCountry: selectedFromCountry, toCountry: 'KE' })} className="cursor-pointer cards-single">
                    <div className="img-conti">
                        <img className="imgr" src="./media/assets/kenya.jpg" alt="" />
                    </div>
                    <div className="title">
                        <h1 className="heading">Kenya</h1>
                        <span className="rating">
                            
                        </span>

                    </div>
                    <div className="title-2">Tourist Visa</div>
                    <div className="card-info">
                        <ul>
                            <li>Approval Chances 90%</li>
                            <li>Visa within 6 Days</li>
                            <li>Visit</li>
                        </ul>  
                    </div>
                    <div className="card-price">
                        <del className="del">₹4,200</del>
                        <div className="amount">
                            ₹3,620 <span className="per">Per Person</span>
                        </div>
                    </div>
                </a>
            </div>

        </div>

        <div className="page3h">
            <img className="img-service" src="./media/assets/contact.png" />
            
            <div className="services">
                <h1 className="service-head">Why Choose Us</h1>
                <p className="service-para">Enjoy different experiences in every place you visit and discover<br/> new and affordable adventures of course.</p>
                <div className="service-conti2">
                    <img className="inoc" src="./media/assets/co1.png" alt=""/>
                    <div className="service-text">
                        <h2>On-Time Visa Approval</h2>
                        <p>Swift visa approvals with our punctual services.</p>
                    </div>
                </div>
                <div className="service-conti2">
                    <img className="inoc" src="./media/assets/co2.png" alt=""/>
                    <div className="service-text">
                        <h2>90% Approval Rate</h2>
                        <p>Benefit of exceptional 90% visa approval success rate.</p>
                    </div>
                </div>
                <div className="service-conti2">
                    <img className="inoc" src="./media/assets/co3.png" alt=""/>
                    <div className="service-text">
                        <h2>Best Price</h2>
                        <p>Unlock your journey with best prices on visa services.</p>
                    </div>
                </div>

                <button className='service-btn'>
                    Search for Packages
                </button>
            </div>
        </div>

        <div className="page4h">
            <img className="testimonial-bg" src="/media/assets/testimonial.png" alt=""/>
            <div className="testimonial-front">
                {/* <h2>PROMOTION</h2> */}
                <h1>See What Our Clients Say<br/> About Us</h1>
            </div>
            <div className="testimonial mySwiper">
                <div className="testi-content swiper-wrapper">
                <div className="slide swiper-slide">
                    <img src="/media/assets/img1.jpg" alt="" className="image" />
                    <p><span style={{position:'absolute', top:'60px', left:'70px'}}><svg width="62" height="48" viewBox="0 0 62 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.65858 43.18C2.13942 39.4422 0.25 35.2499 0.25 28.4542C0.25 16.4958 8.64475 5.77777 20.8525 0.478516L23.9036 5.18668C12.509 11.3503 10.2813 19.3488 9.393 24.3918C11.2278 23.4419 13.6297 23.1105 15.9838 23.3292C22.1474 23.8998 27.0059 28.9598 27.0059 35.2499C27.0059 38.4215 25.746 41.4631 23.5034 43.7058C21.2608 45.9484 18.2191 47.2083 15.0476 47.2083C13.2937 47.1929 11.5603 46.8289 9.94842 46.1373C8.33652 45.4458 6.87829 44.4405 5.65858 43.18ZM39.8253 43.18C36.3061 39.4422 34.4167 35.2499 34.4167 28.4542C34.4167 16.4958 42.8114 5.77777 55.0192 0.478516L58.0703 5.18668C46.6757 11.3503 44.448 19.3488 43.5597 24.3918C45.3944 23.4419 47.7963 23.1105 50.1504 23.3292C56.3141 23.8998 61.1726 28.9598 61.1726 35.2499C61.1726 38.4215 59.9127 41.4631 57.6701 43.7058C55.4274 45.9484 52.3858 47.2083 49.2142 47.2083C47.4603 47.1929 45.727 46.8289 44.1151 46.1373C42.5032 45.4458 41.045 44.4405 39.8253 43.18Z" fill="black" fill-opacity="0.19"/>
                    </svg></span>
                    From the initial consultation to the successful approval of my visa, the team at Visa247 went above and beyond to ensure a smooth and stress-free experience. They guided me through each step, offering valuable insights and answering all my queries promptly.<span style={{top: '-4px', position:'relative'}}><svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.7085 1.33889C9.2235 1.88589 9.5 2.49939 9.5 3.49389C9.5 5.24389 8.2715 6.81239 6.485 7.58789L6.0385 6.89889C7.706 5.99689 8.032 4.82639 8.162 4.08839C7.8935 4.22739 7.542 4.27589 7.1975 4.24389C6.2955 4.16039 5.5845 3.41989 5.5845 2.49939C5.5845 2.03526 5.76887 1.59014 6.09706 1.26195C6.42525 0.933764 6.87037 0.74939 7.3345 0.74939C7.59117 0.751633 7.84483 0.804907 8.08072 0.906112C8.31661 1.00732 8.53001 1.15443 8.7085 1.33889ZM3.7085 1.33889C4.2235 1.88589 4.5 2.49939 4.5 3.49389C4.5 5.24389 3.2715 6.81239 1.485 7.58789L1.0385 6.89889C2.706 5.99689 3.032 4.82639 3.162 4.08839C2.8935 4.22739 2.542 4.27589 2.1975 4.24389C1.2955 4.16039 0.5845 3.41989 0.5845 2.49939C0.5845 2.03526 0.768874 1.59014 1.09706 1.26195C1.42525 0.933765 1.87037 0.74939 2.3345 0.74939C2.59117 0.751634 2.84483 0.804908 3.08072 0.906112C3.31661 1.00732 3.53001 1.15443 3.7085 1.33889Z" fill="black"/>
                        </svg></span>
                    </p>
        
                    <div className="details">
                    <span className="name">Ankush Verma - Customer</span>
                    </div>
        
                </div>
                <div className="slide swiper-slide">
                    <img src="/media/assets/img2.jpg" alt="" className="image" />
                    <p><span style={{position: 'absolute', top:'50px', left:'90px'}}><svg width="62" height="48" viewBox="0 0 62 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.65858 43.18C2.13942 39.4422 0.25 35.2499 0.25 28.4542C0.25 16.4958 8.64475 5.77777 20.8525 0.478516L23.9036 5.18668C12.509 11.3503 10.2813 19.3488 9.393 24.3918C11.2278 23.4419 13.6297 23.1105 15.9838 23.3292C22.1474 23.8998 27.0059 28.9598 27.0059 35.2499C27.0059 38.4215 25.746 41.4631 23.5034 43.7058C21.2608 45.9484 18.2191 47.2083 15.0476 47.2083C13.2937 47.1929 11.5603 46.8289 9.94842 46.1373C8.33652 45.4458 6.87829 44.4405 5.65858 43.18ZM39.8253 43.18C36.3061 39.4422 34.4167 35.2499 34.4167 28.4542C34.4167 16.4958 42.8114 5.77777 55.0192 0.478516L58.0703 5.18668C46.6757 11.3503 44.448 19.3488 43.5597 24.3918C45.3944 23.4419 47.7963 23.1105 50.1504 23.3292C56.3141 23.8998 61.1726 28.9598 61.1726 35.2499C61.1726 38.4215 59.9127 41.4631 57.6701 43.7058C55.4274 45.9484 52.3858 47.2083 49.2142 47.2083C47.4603 47.1929 45.727 46.8289 44.1151 46.1373C42.5032 45.4458 41.045 44.4405 39.8253 43.18Z" fill="black" fill-opacity="0.19"/>
                    </svg></span>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam,
                    saepe provident dolorem a quaerat quo error facere nihil deleniti
                    eligendi ipsum adipisci, fugit, architecto amet asperiores
                    doloremque deserunt eum nemo.<span style={{top: '-4px', position: 'relative'}}><svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.7085 1.33889C9.2235 1.88589 9.5 2.49939 9.5 3.49389C9.5 5.24389 8.2715 6.81239 6.485 7.58789L6.0385 6.89889C7.706 5.99689 8.032 4.82639 8.162 4.08839C7.8935 4.22739 7.542 4.27589 7.1975 4.24389C6.2955 4.16039 5.5845 3.41989 5.5845 2.49939C5.5845 2.03526 5.76887 1.59014 6.09706 1.26195C6.42525 0.933764 6.87037 0.74939 7.3345 0.74939C7.59117 0.751633 7.84483 0.804907 8.08072 0.906112C8.31661 1.00732 8.53001 1.15443 8.7085 1.33889ZM3.7085 1.33889C4.2235 1.88589 4.5 2.49939 4.5 3.49389C4.5 5.24389 3.2715 6.81239 1.485 7.58789L1.0385 6.89889C2.706 5.99689 3.032 4.82639 3.162 4.08839C2.8935 4.22739 2.542 4.27589 2.1975 4.24389C1.2955 4.16039 0.5845 3.41989 0.5845 2.49939C0.5845 2.03526 0.768874 1.59014 1.09706 1.26195C1.42525 0.933765 1.87037 0.74939 2.3345 0.74939C2.59117 0.751634 2.84483 0.804908 3.08072 0.906112C3.31661 1.00732 3.53001 1.15443 3.7085 1.33889Z" fill="black"/>
                        </svg></span>
                    </p>
                    <div className="details">
                    <span className="name">Marnie Lotter - Developer</span>
        
                    </div>
                </div>
                <div className="slide swiper-slide">
                    <img src="/media/assets/img3.jpg" alt="" className="image" />
                    <p><span style={{position: 'absolute', top:'60px', left:'70px'}}><svg width="62" height="48" viewBox="0 0 62 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.65858 43.18C2.13942 39.4422 0.25 35.2499 0.25 28.4542C0.25 16.4958 8.64475 5.77777 20.8525 0.478516L23.9036 5.18668C12.509 11.3503 10.2813 19.3488 9.393 24.3918C11.2278 23.4419 13.6297 23.1105 15.9838 23.3292C22.1474 23.8998 27.0059 28.9598 27.0059 35.2499C27.0059 38.4215 25.746 41.4631 23.5034 43.7058C21.2608 45.9484 18.2191 47.2083 15.0476 47.2083C13.2937 47.1929 11.5603 46.8289 9.94842 46.1373C8.33652 45.4458 6.87829 44.4405 5.65858 43.18ZM39.8253 43.18C36.3061 39.4422 34.4167 35.2499 34.4167 28.4542C34.4167 16.4958 42.8114 5.77777 55.0192 0.478516L58.0703 5.18668C46.6757 11.3503 44.448 19.3488 43.5597 24.3918C45.3944 23.4419 47.7963 23.1105 50.1504 23.3292C56.3141 23.8998 61.1726 28.9598 61.1726 35.2499C61.1726 38.4215 59.9127 41.4631 57.6701 43.7058C55.4274 45.9484 52.3858 47.2083 49.2142 47.2083C47.4603 47.1929 45.727 46.8289 44.1151 46.1373C42.5032 45.4458 41.045 44.4405 39.8253 43.18Z" fill="black" fill-opacity="0.19"/>
                    </svg></span>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam,
                    saepe provident dolorem a quaerat quo error facere nihil deleniti
                    eligendi ipsum adipisci, fugit, architecto amet asperiores
                    doloremque deserunt eum nemo.<span style={{top: '-4px', position: 'relative'}}><svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.7085 1.33889C9.2235 1.88589 9.5 2.49939 9.5 3.49389C9.5 5.24389 8.2715 6.81239 6.485 7.58789L6.0385 6.89889C7.706 5.99689 8.032 4.82639 8.162 4.08839C7.8935 4.22739 7.542 4.27589 7.1975 4.24389C6.2955 4.16039 5.5845 3.41989 5.5845 2.49939C5.5845 2.03526 5.76887 1.59014 6.09706 1.26195C6.42525 0.933764 6.87037 0.74939 7.3345 0.74939C7.59117 0.751633 7.84483 0.804907 8.08072 0.906112C8.31661 1.00732 8.53001 1.15443 8.7085 1.33889ZM3.7085 1.33889C4.2235 1.88589 4.5 2.49939 4.5 3.49389C4.5 5.24389 3.2715 6.81239 1.485 7.58789L1.0385 6.89889C2.706 5.99689 3.032 4.82639 3.162 4.08839C2.8935 4.22739 2.542 4.27589 2.1975 4.24389C1.2955 4.16039 0.5845 3.41989 0.5845 2.49939C0.5845 2.03526 0.768874 1.59014 1.09706 1.26195C1.42525 0.933765 1.87037 0.74939 2.3345 0.74939C2.59117 0.751634 2.84483 0.804908 3.08072 0.906112C3.31661 1.00732 3.53001 1.15443 3.7085 1.33889Z" fill="black"/>
                        </svg></span>
                    </p>
                    <div className="details">
                    <span className="name">Marnie Lotter - Developer</span>
                    </div>
                </div>
                </div>
                <div className="swiper-button-next nav-btn"></div>
                <div className="swiper-button-prev nav-btn"></div>
                <div className="swiper-pagination"></div>
            </div>
        </div>

        <footer className="footer-sech">
            <img className="footer-bg" src="./media/assets/footer.png" alt=""/>
            <div className="mains">
            <div className="logo rowsa">
                <div className="footer-header">
                <img src="./media/logos/logo.png" className="manikk" alt=""/>
                </div>
                <div className="logo-des">
                <p style={{color:"rgba(50, 113, 19, 1)"}}>Visa247 facilitates seamless<br/> Visa online instantly..</p>
                <div className="icons">
                    <a href="#"><i className="social-icon ri-facebook-fill"></i></a>
                    <a href="#"><i className="social-icon ri-instagram-line"></i></a>
                    <a href="#"><i className="social-icon ri-linkedin-fill"></i></a>
                    <a href="#"><i className="social-icon ri-infinity-fill"></i></a>
                </div>
                </div>
            </div>
            
            <div className="office rowsa">
                <div className="footer-header">
                    <h3>Company</h3>
                    </div>                   
                    <div className="link-des">
                    <a href="#" className="footer-links">Career</a>
                    <a href="/privacy-policy" target='_blank' className="footer-links">Privacy Policy</a>
                    <a href='/terms-and-conditions' target='_blank' className="footer-links">Terms & Conditions</a>
                </div>
            </div>
            
            
            <div className="link rowsa">
                
            </div>
            
            
            <div className="newsletter rowsa">
                <div className="footer-header">
                <h3>Join Our Newsletter</h3>
                </div>
                <div className="newsletter-des">
                <div className="subcribe">
                    <input type="mail" placeholder = "Your email address" required/>
                    <button className="butt">Subscribe</button>
                </div>
                <div className="icons">
                    <p style={{fontSize: '15px'}}>Will send you weekly updates for your better tour packages</p>
                </div>
                </div>
            </div>
            
            
            </div>
            <div className="copyright">
            <hr className='divider'/>
                <p>Copyright @ Visa247 2023. All Rights Reserved.</p>
            </div>
        </footer>
        
    </>
  )
}

export default Home;