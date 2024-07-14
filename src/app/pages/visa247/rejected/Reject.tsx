import { RejectTable } from '../../../components/RejectTable';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../../helpers/axiosInstance';

function Reject() {
  const [visaStatsData, setVisaStatsData] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    // Define a function to make the POST request
    const fetchData = async () => {
      setLoading(true);
      try {
        axiosInstance.get('/backend/super_admin/fetch_all_visa')
          .then((response) => {
            const filteredData = response.data.data.filter(item => item.visa_provider === 'manual' && item.visa_status === 'Reject');
            setVisaStatsData(filteredData);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching Atlys data:', error);
            setLoading(false);
          });

        
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []); // The empty dependency array ensures this effect runs once on mount

  return (
    <div style={{marginTop:"-50px"}}>
      <RejectTable className='' title={'Visa247 Rejected'} data={visaStatsData} loading={loading}/>
    </div>
  )
}

export default Reject