import React, { useEffect, useState } from "react";
import { VisaDetailCard } from "../../../components/VisaDetailCard";
import axiosInstance from "../../../helpers/axiosInstance";
import Cookies from 'js-cookie';
import { TfiStatsUp } from "react-icons/tfi";
import { GiAirplaneDeparture } from "react-icons/gi";
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import Loader from '../../../components/Loader';
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { Link } from "react-router-dom";
import logo from '../../../../_metronic/assets/favi.png'
import { FaShieldAlt } from "react-icons/fa";
import { MdOutlineFlight } from "react-icons/md";
import { FaHotel } from "react-icons/fa6";
import CustomerNewVisaWrapper from "../apply-visa/CustomerNewVisaWrapper";
import CustomerNewInsurance from "../apply-insurance/CustomerNewInsurance";
import CustomerNewHotel from "../apply-others/CustomerNewHotel";
import CustomerNewFlight from "../apply-others/CustomerNewFlight";

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All"); 
  const [visaData, setVisaData] = useState<any[]>([]);
  const [hotelData, setHotelData] = useState<any[]>([]);
  const [flightData, setFlightData] = useState<any[]>([]);
  const [insuranceData, setInsuranceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true)
      const merchant_id = Cookies.get('user_id');
      let postBody = {
        user_id: merchant_id
      };
      let data: any[] = [];
      let visaResponse = await axiosInstance.post("/backend/user/fetch_visa", postBody);
      let insuranceResponse = await axiosInstance.post("/backend/user/fetch_insurace_data", postBody);
      let hotelResponse = await axiosInstance.post("/backend/user/fetch_hotel_data", postBody);
      let flightResponse = await axiosInstance.post("/backend/user/fetch_flight_data", postBody);
  
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
  
        // if (activeTab === 'ApplyVisa') {
        //   navigate('/merchant/apply-visa');
        // }
        // if (activeTab === 'ApplyInsurance') {
        //   navigate('/merchant/apply-insurance');
        // }
        // if (activeTab === 'ApplyHotel') {
        //   navigate('/merchant/apply-hotel');
        // }
        // if (activeTab === 'ApplyFlight') {
        //   navigate('/merchant/apply-flight');
        // }
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  const activeTabTextStyle = {
    color: '#000', 
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    border: "none",
    borderLeft:"4px solid #327113",
    paddingBottom: "20px",
    padding: '10px 0',
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
  };


  const activeTabBorderStyle = {
    padding: 7,
    paddingLeft: 20,
    marginTop: 30,
    fontWeight:"500",
    color: '#327113', 
  };

  const tabTextStyle = {
    color: '#959595', 
    cursor: 'pointer',
    fontSize: 16,
    paddingBottom: "25px",
    padding: '10px 0',
    marginTop: 45,
    display: 'flex',
    alignItems: 'center',
  };

  const iconStyle = {
    fontSize:"20px",
    marginRight:"10px",
    marginLeft:"10px",
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
    marginTop: 25,
  };


  return (
    <div style={{ display: 'flex', width: '100%', marginTop: -70, backgroundColor: '#fff' }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '240px' : '80px',
          backgroundColor: '#f8f8f8',
          padding: '12px',
          position: 'fixed',
          height: '100%',
          overflowY: 'auto',
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
            <Link to='/customer/dashboard'>
              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/logos/logo.png')}
                className='h-20px h-lg-30px app-sidebar-logo-default'
              />
            </Link>
          </div>
          <div
            onClick={() => handleTabClick("ApplyVisa")}
            className="mt-20"
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
            <div>
              yoyyoyoyoyo
            </div>
          :
          <>
            <Loader loading={loading} />
            {!loading && (
              <>
              <Loader loading={loading} />
              {!loading && (
                <div className="pt-12">
                  {activeTab === "All" && <VisaDetailCard visaData={[]} insuranceData={[]} hotelData={[]} flightData={[]} />}
                  {activeTab === "ApplyVisa" && <CustomerNewVisaWrapper />}
                  {activeTab === "ApplyInsurance" && <CustomerNewInsurance />}
                  {activeTab === "ApplyHotel" && <CustomerNewHotel />}
                  {activeTab === "ApplyFlight" && <CustomerNewFlight />}
                </div>
              )}
            </>
            )}
          </>
        }
      </div>
      {/* <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          color: "#000",
          fontSize:"18px",
          top: "100px",
          left: sidebarOpen ? "260px" : '80px',
          transform: "translate(-50%, -50%)",
          zIndex: 999,
          border:"none",
          background: "#fff",
          borderRadius:"50%",
          cursor: "pointer",
          transition:"all 0.5s ease ",
          display:"flex",
          padding:"5px"
        }}
      >
        {sidebarOpen ? <GoArrowLeft /> : <GoArrowRight />}
      </button> */}
    </div>
  );
};

export default CustomerDashboard;
