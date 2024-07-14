import React, { useEffect, useState } from "react";
import { VisaDetailCard } from "../../../components/VisaDetailCard";
import axiosInstance from "../../../helpers/axiosInstance";
import Cookies from 'js-cookie';
import { MerchantAnaltytics } from "../../../components/MerchantAnalytics";
import { TfiStatsUp } from "react-icons/tfi";
import { MdOutlineAlignHorizontalLeft } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { GoStopwatch } from "react-icons/go";
import { MdOutlineDoNotDisturb } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { GiAirplaneDeparture } from "react-icons/gi";
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import Loader from '../../../components/Loader';
import { GoArrowLeft } from "react-icons/go";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { GoArrowRight } from "react-icons/go";
import logo from '../../../../_metronic/assets/favi.png'
import CustomerApplyVisa from "../../../components/CustomerApplyVisa";
import { FaShieldAlt } from "react-icons/fa";

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All"); 
  const [visaData, setVisaData] = useState<any[]>([]);
  const [insuranceData, setInsuranceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabClick = async (tabName: string) => {
    setActiveTab(tabName);

    if (tabName === 'ApplyVisa') {
      navigate('/customer/apply-visa');
      try {
        await fetchData();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    }
    if (tabName === 'ApplyInsurance') {
      navigate('/customer/apply-insurance');
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
      const user_id = Cookies.get('user_id');
      let postBody = {
        user_id: user_id
      };
      let data: any[] = [];
      let visaResponse = await axiosInstance.post("/backend/user/fetch_visa", postBody);
      let insuranceResponse = await axiosInstance.post("/backend/user/fetch_insurace_data", postBody);
  
      if (visaResponse.data.success === 1 || insuranceResponse.data.success === 1) {
        const visaData = visaResponse.data.data;
        const insuranceData = insuranceResponse.data.data;
        if (activeTab === "Processed") {
          data = [
            ...visaData.filter(item => item.visa_status === 'Processed' || item.visa_status === 'Issue'),
            ...insuranceData.filter(item => item.insurance_status === 'Processed' || item.insurance_status === 'Issue')
          ];
        } else if (activeTab === "In-Process") {
          data = [
            ...visaData.filter(item => item.visa_status === 'Applied'),
            ...insuranceData.filter(item => item.insurance_status === 'Applied')
          ];
        } else if (activeTab === "All") {
          data = [...visaData, ...insuranceData];
        } else if (activeTab === "Not Issued") {
          data = [
            ...visaData.filter(item => item.visa_status === 'Not Issued'),
            ...insuranceData.filter(item => item.insurance_status === 'Not Issued')
          ];
        } else if (activeTab === "Rejected") {
          data = [
            ...visaData.filter(item => item.visa_status === 'Reject'),
            ...insuranceData.filter(item => item.insurance_status === 'Reject')
          ];
        } else if (activeTab === "Waiting") {
          data = [
            ...visaData.filter(item => item.visa_status === 'Waiting'),
            ...insuranceData.filter(item => item.insurance_status === 'Waiting')
          ];
        }
  
        if (activeTab != "ApplyVisa" && "ApplyInsurance") {
          setVisaData(visaData);
          setInsuranceData(insuranceData);
        }
  
        if (activeTab === 'ApplyVisa') {
          navigate('/customer/apply-visa');
        }
        if (activeTab === 'ApplyInsurance') {
          navigate('/customer/apply-insurance');
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const activeTabTextStyle = {
    color: '#000', 
    cursor: 'pointer',
    backgroundColor:"#E2FDD5",
    fontSize: 16,
    fontWeight: 600,
    border: "none",
    paddingBottom: "20px",
    padding: '10px 0',
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
  };

  const activeTabBorderStyle = {
    padding: 7,
    paddingLeft: 8,
    marginTop: 5,
    borderRadius:20,
    fontWeight:"500",
    color: '#327113', 
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
    marginTop: 5,
  };



  return (
    <div style={{ display: 'flex', width: '100%', marginTop: -70, backgroundColor: '#fff' }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '260px' : '80px', // Toggle sidebar width
          backgroundColor: '#f8f8f8',
          padding: '12px',
          position: 'fixed',
          height: '100%',
          overflowY: 'auto',
          paddingTop: 70,
          left: 0,
          transition: 'all 0.5s ease', // Add transition property
        }}
      >
        {sidebarOpen ? (
          <>
            <div
              onClick={() => handleTabClick("ApplyVisa")}
              style={activeTab === "ApplyVisa" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
              {sidebarOpen && <><GiAirplaneDeparture style={iconStyle1} /> Apply Visa</>}
            </div>
            <div
              onClick={() => handleTabClick("ApplyInsurance")}
              style={activeTab === "ApplyInsurance" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
              {sidebarOpen && <><FaShieldAlt style={iconStyle1} /> Apply Insurance</>}
            </div>
            <h5 className="py-7" style={{ padding: 8 }}>
              {sidebarOpen && '─────VISA──────'}
            </h5>
            <div
              onClick={() => handleTabClick("All")}
              style={activeTab === "All" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
              {sidebarOpen && <><MdOutlineAlignHorizontalLeft style={iconStyle} /> All</>}
            </div>
            <div
              onClick={() => handleTabClick("Processed")}
              style={activeTab === "Processed" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
              {sidebarOpen && <><IoMdDoneAll style={iconStyle} />Processed</>}
            </div>
            <div
              onClick={() => handleTabClick("In-Process")}
              style={activeTab === "In-Process" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
              {sidebarOpen && <><IoSettingsOutline style={iconStyle} />In-Process</>}
            </div>
            <div
              onClick={() => handleTabClick("Waiting")}
              style={activeTab === "Waiting" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
              {sidebarOpen && <><GoStopwatch style={iconStyle} />Waiting</>}
            </div>
            <div
              onClick={() => handleTabClick("Not Issued")}
              style={activeTab === "Not Issued" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
              {sidebarOpen && <><MdOutlineDoNotDisturb style={iconStyle} />Not Issued</>}
            </div>
            <div
              onClick={() => handleTabClick("Rejected")}
              style={activeTab === "Rejected" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
              {sidebarOpen && <><RxCross1 style={iconStyle} />Rejected</>}
            </div>
          
            </>
        ) : (
          <>
          <img style={{width:"35px", height:"35px", marginTop:"-75px", marginLeft:"10px"}} src={logo} alt="" />
            <div
              onClick={() => handleTabClick("ApplyVisa")}
              style={{ ...tabBorderStyle }}
            >
              <GiAirplaneDeparture style={iconStyle1} />
            </div>
            <h5 className="py-7" style={{ padding: 8 }}>
              VISA
            </h5>
            <div
              onClick={() => handleTabClick("All")}
              style={activeTab === "All" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
              <MdOutlineAlignHorizontalLeft style={iconStyle1} />
            </div>
            <div
              onClick={() => handleTabClick("Processed")}
              style={activeTab === "Processed" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
              <IoMdDoneAll style={iconStyle1} />
            </div>
            <div
              onClick={() => handleTabClick("In-Process")}
              style={activeTab === "In-Process" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
             <IoSettingsOutline style={iconStyle1} />
            </div>
            <div
              onClick={() => handleTabClick("Waiting")}
              style={activeTab === "Waiting" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
              <GoStopwatch style={iconStyle1} />
            </div>
            <div
              onClick={() => handleTabClick("Not Issued")}
              style={activeTab === "Not Issued" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
              <MdOutlineDoNotDisturb style={iconStyle1} />
            </div>
            <div
              onClick={() => handleTabClick("Rejected")}
              style={activeTab === "Rejected" ? { ...activeTabTextStyle, ...activeTabBorderStyle } : { ...tabTextStyle, ...tabBorderStyle }}
            >
              <RxCross1 style={iconStyle1} />
            </div>
          </>
        )}
      </div>

      <div style={{ marginLeft: sidebarOpen ? '20%' : '80px', width: sidebarOpen ? '80%' : '100%', overflowY: 'auto', padding: '16px' }}>
        {activeTab === "Analytics" ?
            <div>
              yoyyoyoyoyo
            </div>
          :
          <>
            <Loader loading={loading} />
            {!loading && (
              <VisaDetailCard visaData={visaData} insuranceData={insuranceData} />
            )}
          </>
        }
      </div>
      <button
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
      </button>
    </div>
  );
};

export default CustomerDashboard;
