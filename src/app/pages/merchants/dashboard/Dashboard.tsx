import { useEffect, useState } from "react";
import { VisaDetailCard } from "../../../components/VisaDetailCard";
import axiosInstance from "../../../helpers/axiosInstance";
import Cookies from 'js-cookie';
import { MerchantAnaltytics } from "../../../components/MerchantAnalytics";
import { TfiStatsUp } from "react-icons/tfi";
import { GiAirplaneDeparture } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/Loader';
import { FaShieldAlt } from "react-icons/fa";
import logo from '../../../../_metronic/assets/favi.png'
import { MdOutlineFlight } from "react-icons/md";
import { FaHotel } from "react-icons/fa6";
import MerchantNewVisaWrapper from "../apply-visa/MerchantNewVisaWrapper";
import MerchantNewInsurance from "../apply-insurance/MerchantNewInsurance";
import MerchantNewHotel from "../apply-others/MerchantNewHotel";
import MerchantNewFlight from "../apply-others/MerchantNewFlight";

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState("Analytics"); 
  const [visaData, setVisaData] = useState<any[]>([]);
  const [insuranceData, setInsuranceData] = useState<any[]>([]);
  const [hotelData, setHotelData] = useState<any[]>([]);
  const [flightData, setFlightData] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchDashboardData(); 
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
    <div style={{ display: 'flex', width: '100%', marginTop: -70, background: '#fff' }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '240px' : '80px', // Toggle sidebar width
          backgroundColor: '#f8f8f8',
          padding: '12px',
          position: 'fixed',
          height: '100%',
          overflowY: 'auto',
          paddingTop: 70,
          paddingBottom: 100,
          left: 0,
          transition: 'all 0.5s ease', // Add transition property
        }}
      >
        {sidebarOpen ? (
          <>
            <div
              onClick={() => handleTabClick("Analytics")}
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

        <div style={{ marginLeft: sidebarOpen ? '15%' : '80px', width: sidebarOpen ? '80%' : '100%', overflowY: 'auto', padding: '16px' }}>
          {activeTab === "Analytics" ?
            <div>
              <MerchantAnaltytics dashboardData={dashboardData} />
            </div>
            :
            <>
              <Loader loading={loading} />
              {!loading && (
                <div className="pt-12">
                  {activeTab === "ApplyVisa" && <MerchantNewVisaWrapper />}
                  {activeTab === "ApplyInsurance" && <MerchantNewInsurance />}
                  {activeTab === "ApplyHotel" && <MerchantNewHotel />}
                  {activeTab === "ApplyFlight" && <MerchantNewFlight />}
                </div>
              )}
            </>
          }
        </div>
    </div>
  );
};

export default MerchantDashboard;