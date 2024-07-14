import { ProcessedTable } from '../../components/ProcessedTable'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../helpers/axiosInstance';

function RejectedWrapper() {
  const [visaStatsData, setVisaStatsData] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    // Define a function to make the POST request
    const fetchData = async () => {
      setLoading(true);
      try {
        const postData = {
          super_admin_id:'6507f4b97c2c4102d5024e01'
        };
        // Make a POST request to your API endpoint
        axiosInstance.post('/backend/super_admin/fetch_visa', postData)
          .then((response) => {
            const filteredData = response.data.data.filter(item => item.visa_status === 'Reject');
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
      <ProcessedTable className='' title={'Visa Rejected'} data={visaStatsData} loading={loading}/>
    </div>
  )
}

export default RejectedWrapper