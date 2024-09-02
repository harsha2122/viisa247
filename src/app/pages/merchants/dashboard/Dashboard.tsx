import { useEffect, useState } from "react";
import { VisaDetailCard } from "../../../components/VisaDetailCard";
import axiosInstance from "../../../helpers/axiosInstance";
import Cookies from 'js-cookie';
import { MerchantAnaltytics } from "../../../components/MerchantAnalytics";
import { TfiStatsUp } from "react-icons/tfi";
import { GiAirplaneDeparture } from "react-icons/gi";
import Loader from '../../../components/Loader';
import { FaShieldAlt } from "react-icons/fa";
import logo from '../../../../_metronic/assets/favi.png'
import { MdOutlineFlight } from "react-icons/md";
import { FaHotel } from "react-icons/fa6";
import { Dropdown, Modal, Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import MerchantNewVisaWrapper from "../apply-visa/MerchantNewVisaWrapper";
import MerchantNewInsurance from "../apply-insurance/MerchantNewInsurance";
import MerchantNewHotel from "../apply-others/MerchantNewHotel";
import MerchantNewFlight from "../apply-others/MerchantNewFlight";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import VisaRevenueWrapper from '../../merchants/others/VisaRevenueWrapper'
import InsuranceRevenueWrapper from "../others/InsuranceRevenueWrapper";
import HotelRevenueWrapper from "../others/HotelRevenueWrapper";
import FlightRevenueWrapper from "../others/FlightRevenueWrapper";
import toast, { Toaster } from 'react-hot-toast';
import { Field } from 'formik';
import TransactionWrapper from "../others/TransactionWrapper";

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState("Analytics"); 
  const [visaData, setVisaData] = useState<any[]>([]);
  const [insuranceData, setInsuranceData] = useState<any[]>([]);
  const [hotelData, setHotelData] = useState<any[]>([]);
  const [flightData, setFlightData] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commission, setCommission] = useState(0);
  const [upperLimit, setUpperLimit] = useState(0);
  const [issuedApiKey, setIssuedApiKey] = useState('');
  const [showApiDropdown, setShowApiDropdown] = useState(false);

  useEffect(() => {
    fetchData();
    fetchDashboardData(); 
    fetchProfileData();
    fetchCommission();
  }, [activeTab]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabClick = async (tabName) => {
    setActiveTab(tabName);

    if (tabName === 'ApplyVisa' || tabName === 'ApplyInsurance' || tabName === 'ApplyHotel' || tabName === 'ApplyFlight') {
      setLoading(true);
      try {
        await fetchData();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true)
      const merchant_id = Cookies.get('user_id');
      let postBody = {
        merchant_id: merchant_id
      };
      let data: any[] = [];
      let visaResponse = await axiosInstance.post("/backend/merchant/fetch_visa", postBody);
      let insuranceResponse = await axiosInstance.post("/backend/merchant/fetch_applied_insurance", postBody);
      let hotelResponse = await axiosInstance.post("/backend/merchant/fetch_applied_hotel", postBody);
      let flightResponse = await axiosInstance.post("/backend/merchant/fetch_applied_flight", postBody);
  
      if (visaResponse.status === 200 && insuranceResponse.status === 200 && hotelResponse.status === 200 && flightResponse.status === 200) {
        const visaData = visaResponse.data.data;
        const insuranceData = insuranceResponse.data.data;
        const hotelData = hotelResponse.data.data;
        const flightData = flightResponse.data.data;
  
        if (activeTab === "Processed") {
          data = [
            ...visaData.filter(item => item.visa_status === 'Processed' || item.visa_status === 'Issue'),
            ...insuranceData.filter(item => item.insurance_status === 'Processed' || item.insurance_status === 'Issue'),
            ...hotelData.filter(item => item.hotel_status === 'Processed' || item.hotel_status === 'Issue'),
            ...flightData.filter(item => item.flight_status === 'Processed' || item.flight_status === 'Issue')
          ];
        } else if (activeTab === "In-Process") {
          data = [
            ...visaData.filter(item => item.visa_status === 'Applied'),
            ...insuranceData.filter(item => item.insurance_status === 'Applied'),
            ...hotelData.filter(item => item.hotel_status === 'Applied'),
            ...flightData.filter(item => item.flight_status === 'Applied')
          ];
        } else if (activeTab === "All") {
          data = [...visaData, ...insuranceData, ...hotelData, ...flightData];
        } else if (activeTab === "Not Issued") {
          data = [
            ...visaData.filter(item => item.visa_status === 'Not Issued'),
            ...insuranceData.filter(item => item.insurance_status === 'Not Issued'),
            ...hotelData.filter(item => item.hotel_status === 'Not Issued'),
            ...flightData.filter(item => item.flight_status === 'Not Issued')
          ];
        } else if (activeTab === "Rejected") {
          data = [
            ...visaData.filter(item => item.visa_status === 'Reject'),
            ...insuranceData.filter(item => item.insurance_status === 'Reject'),
            ...hotelData.filter(item => item.hotel_status === 'Reject'),
            ...flightData.filter(item => item.flight_status === 'Reject')
          ];
        } else if (activeTab === "Waiting") {
          data = [
            ...visaData.filter(item => item.visa_status === 'Waiting'),
            ...insuranceData.filter(item => item.insurance_status === 'Waiting'),
            ...hotelData.filter(item => item.hotel_status === 'Waiting'),
            ...flightData.filter(item => item.flight_status === 'Waiting')
          ];
        }
  
        if (activeTab !== "Analytics") {
          setVisaData(visaData);
          setInsuranceData(insuranceData);
          setHotelData(hotelData);
          setFlightData(flightData);
        }
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const merchant_id = Cookies.get('user_id');
      let postBody = {
        merchant_id: merchant_id
      }
      let response = await axiosInstance.post("/backend/merchant_dashboard", postBody);
      if (response.status == 200) {
        setDashboardData(response.data.data); 
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCommissionChange = (e) => {
    const value = e.target.value;
    if (value <= upperLimit) {
      setCommission(parseFloat(value));
    }
  };


  const fetchCommission = async () => {
    try {
      const markup_percentage = localStorage.getItem('markup_percentage') ?? '1';
      const markup_percentageAsNumber = parseFloat(markup_percentage);

      const response = await axiosInstance.get('/backend/fetch_setting');
      if (response.status === 203) {
        toast.error('Please Logout And Login Again', {
          position: 'top-center',
        });
      }

      setUpperLimit(parseFloat(response.data.data.merchant_percantage));
      setCommission(markup_percentageAsNumber);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  const saveCommission = async () => {
    setLoading(true);
    const user_id = Cookies.get('user_id')

    const response = await axiosInstance.patch('/backend/set_markup_percentage', {
      merchant_id: user_id,
      markup_percentage: commission.toString()
    })
    if (response.status == 203) {
      toast.error(response.data.msg, {
        position: 'top-center',
      })
      setLoading(false);
    } else {
      localStorage.removeItem('markup_percentage');
      localStorage.setItem('markup_percentage', commission.toString());
      setShowCommissionModal(false);
      toast.success(response.data.msg, {
        position: 'top-center',
      })
      setTimeout(() => {
        window.location.reload();
      }, 2500);
      setLoading(false);
    }
  }
  const fetchProfileData = async () => {
    try {
      const user_id = Cookies.get('user_id');
      const postData = {
        id: user_id,
      };
      const response = await axiosInstance.post('/backend/fetch_single_merchant_user', postData);
      console.log("Response Data:", response);
      
      if (response.data.data.issued_api && response.data.data.issued_api.length > 0) {
        setIssuedApiKey(response.data.data.issued_api[0]);
        setShowApiDropdown(true); // Issued API key exists, so show the API option
      } else {
        setShowApiDropdown(false); // No Issued API key, hide the API option
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  

  const copyApiKey = () => {
    navigator.clipboard.writeText(issuedApiKey);
    toast.success("API Key copied to clipboard!");
  };

  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);

  const handleCommissionClick = () => {
  setShowCommissionModal(true);
  };

  const handleApiClick = () => {
  setShowApiModal(true);
  };

  const handleCloseCommissionModal = () => {
  setShowCommissionModal(false);
  };

  const handleCloseApiModal = () => {
  setShowApiModal(false);
  };

  const activeTabTextStyle = {
    color: '#000', 
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    border: "none",
    borderLeft:"4px solid #327113",
    paddingBottom: "20px",
    padding: '7px 0',
    display: 'flex',
    alignItems: 'center',
    transition:"all 0.5s ease"
  };

  const activeTabTextStyle1 = {
    color: '#000', 
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 500,
    border: "none",
    paddingBottom: "20px",
    padding: '7px 0',
    display: 'flex',
    alignItems: 'center',
    transition:"all 0.5s ease"
  };


  const activeTabBorderStyle = {
    padding: 7,
    paddingLeft: 20,
    marginTop: 10,
    fontWeight:"500",
    color: '#327113', 
  };

  const activeTabBorderStyle1 = {
    padding: 7,
    paddingLeft: 20,
    marginTop: 10,
    fontWeight:"500",
    color: '#959595', 
  };


  const tabTextStyle = {
    color: '#959595', 
    cursor: 'pointer',
    fontSize: 16,
    paddingBottom: "25px",
    padding: '10px 0',
    marginTop: 25,
    display: 'flex',
    alignItems: 'center',
  };

  const tabTextStyle1 = {
    cursor: 'pointer',
    color: '#959595', 
    fontSize: 16,
    paddingBottom: "25px",
    padding: '10px 0',
    marginTop: 25,
    display: 'flex',
    alignItems: 'center',
  };

  const iconStyle1 = {
    fontSize:"20px",
    marginRight:"10px",
    marginLeft:"10px",
    cursor:"pointer"
  };


  const tabBorderStyle = { 
    padding: '8px',
    paddingLeft:"20px",
    marginTop: 12,
  };


  const tabStyle = (activeTab: string) => {
    return activeTab
      ? {
          ...activeTabTextStyle1,
          ...activeTabBorderStyle1,
        }
      : {
          ...tabTextStyle1,
          ...tabBorderStyle,
        };
  };
  

  return (
    <div style={{ display: 'flex', width: '100%', marginTop: -70, background: '#fff' }}>
      <Toaster />
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '240px' : '80px',
          backgroundColor: '#f8f8f8',
          padding: '12px',
          position: 'fixed',
          height: '100%',
          // overflowY: 'auto',
          zIndex:"101",
          paddingTop: 70,
          top:"0",
          paddingBottom: 100,
          left: 0,
          transition: 'all 0.5s ease',
        }}
      >
        {sidebarOpen ? (
          <>
          <div style={{position:"absolute", marginLeft:"10%", top:"35px"}} className='d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15'>
            <Link to='/merchant/dashboard'>
              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/logos/logo.png')}
                className='h-20px h-lg-30px app-sidebar-logo-default'
              />
            </Link>
          </div>
        
          <div
            onClick={() => handleTabClick("Analytics")}
            className="mt-16"
            style={activeTab === "Analytics" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
          >
            {sidebarOpen && <> Dashboard</>}
          </div>
        
          <div
            onClick={() => handleTabClick("ApplyVisa")}
            style={activeTab === "ApplyVisa" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
          >
            {sidebarOpen && <> Visa</>}
          </div>
        
          <div
            onClick={() => handleTabClick("ApplyInsurance")}
            style={activeTab === "ApplyInsurance" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
          >
            {sidebarOpen && <> Insurance</>}
          </div>
        
          <div
            onClick={() => handleTabClick("ApplyHotel")}
            style={activeTab === "ApplyHotel" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
          >
            {sidebarOpen && <> Hotel</>}
          </div>
        
          <div
            onClick={() => handleTabClick("ApplyFlight")}
            style={activeTab === "ApplyFlight" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
          >
            {sidebarOpen && <> Flight</>}
          </div>
        
          <div
            onClick={() => handleTabClick("All")}
            style={activeTab === "All" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
          >
            {sidebarOpen && <> Applications</>}
          </div>

                  
          <Dropdown style={{paddingLeft:"20px"}}>
            <Dropdown.Toggle
              variant="link"
              
              id="dropdown-revenue"
              style={tabStyle(activeTab.includes("Revenue") ? activeTab : "")}
              className="w-100 text-start"
            >
              {sidebarOpen && <> Revenue</>}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleTabClick("Transactions")}>
                Transactions
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleTabClick("Visa Revenue")}>
                Visa Revenue
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleTabClick("Insurance Revenue")}>
                Insurance Revenue
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleTabClick("Hotel Revenue")}>
                Hotel Revenue
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleTabClick("Flight Revenue")}>
                Flight Revenue
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown style={{paddingLeft:"20px"}}>
            <Dropdown.Toggle
              variant="link"
              
              id="dropdown-settings"
              style={tabStyle(activeTab.includes("Re") ? activeTab : "")}
              className="w-100 text-start"
            >
              {sidebarOpen && <> Settings </>}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={handleCommissionClick}>
                Commission
              </Dropdown.Item>
              {showApiDropdown && (
                <Dropdown.Item onClick={handleApiClick}>
                  API
                </Dropdown.Item>
              )}

            </Dropdown.Menu>
          </Dropdown>
        </>
        
          ) : (
            <>
            <img style={{width:"35px", height:"35px", marginTop:"-75px", marginLeft:"10px"}} src={logo} alt="" />
              <div
                onClick={() => handleTabClick("Analytics")}
                style={activeTab === "Analytics" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
              >
                <TfiStatsUp style={iconStyle1} />
              </div>
              <div
                onClick={() => handleTabClick("ApplyVisa")}
                style={{ ...tabBorderStyle }}
              >
                <GiAirplaneDeparture style={iconStyle1} />
              </div>
              <div
                onClick={() => handleTabClick("ApplyInsurance")}
                style={{ ...tabBorderStyle }}
              >
                <FaShieldAlt style={iconStyle1} />
              </div>
              <div
                onClick={() => handleTabClick("ApplyHotel")}
                style={{ ...tabBorderStyle }}
              >
                <FaHotel style={iconStyle1} />
              </div>
              <div
                onClick={() => handleTabClick("ApplyFlight")}
                style={{ ...tabBorderStyle }}
              >
                <MdOutlineFlight style={iconStyle1} />
              </div>
            </>
          )}
        </div>

        <div style={{ marginLeft: sidebarOpen ? '18%' : '80px', width: sidebarOpen ? '80%' : '100%', overflowY: 'auto', padding: '16px' }}>
          {activeTab === "Analytics" ?
          <>
            <div>
              <MerchantAnaltytics dashboardData={dashboardData} />
            </div>
          </>
            :
            <>
              <Loader loading={loading} />
              {!loading && (
                <div className="pt-12">
                  {activeTab === "All" && <VisaDetailCard visaData={visaData} insuranceData={insuranceData} hotelData={hotelData} flightData={flightData} />}
                  {activeTab === "ApplyVisa" && <MerchantNewVisaWrapper />}
                  {activeTab === "ApplyInsurance" && <MerchantNewInsurance />}
                  {activeTab === "ApplyHotel" && <MerchantNewHotel />}
                  {activeTab === "ApplyFlight" && <MerchantNewFlight />}
                  {activeTab === "Transactions" && <TransactionWrapper />}
                  {activeTab === "Visa Revenue" && <VisaRevenueWrapper />}
                  {activeTab === "Insurance Revenue" && <InsuranceRevenueWrapper/>}
                  {activeTab === "Hotel Revenue" && <HotelRevenueWrapper />}
                  {activeTab === "Flight Revenue" && <FlightRevenueWrapper />}
                </div>
              )}
            </>
          }
        </div>
        <Modal show={showCommissionModal} onHide={handleCloseCommissionModal}>
          <Modal.Header closeButton>
            <Modal.Title>Commission Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Commission input field */}
            <Form.Control
              style={{ width: '100%' }}
              value={commission}
              onChange={handleCommissionChange} // Custom handler for input field change
              placeholder='Commission'
              name='commission'
              max={upperLimit} // Set the maximum allowed value
              type="number" // Set the input type to number for better validation
              className='form-control form-control-lg form-control-solid'
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCommissionModal}>
              Close
            </Button>
            <Button variant="primary" onClick={saveCommission}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* API Modal */}
        <Modal show={showApiModal} onHide={handleCloseApiModal}>
          <Modal.Header closeButton>
            <Modal.Title>API Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Issued API Key:</strong> {issuedApiKey}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseApiModal}>
              Close
            </Button>
            <Button variant="primary" onClick={copyApiKey}>
              Copy API Key
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
  );
};

export default MerchantDashboard;