
import React, { useState, useEffect } from 'react';
import { MemberStatsTable } from '../../components/MemberStatsTable'
import axios from 'axios';
import axiosInstance from '../../helpers/axiosInstance';

function ApiMerchantWrapper() {
  // Define the initial state for memberStatsData
  const [memberStatsData, setMemberStatsData] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    // Define a function to make the POST request
    const fetchData = async () => {
      setLoading(true);
      try {
        const postData = {
          // Your POST data goes here
        };
        // Make a POST request to your API endpoint
        axiosInstance.post('/backend/fetch_merchant_user', postData)
          .then((response) => {
            setMemberStatsData(response.data.data);
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
    <div>
      <MemberStatsTable className='' data={memberStatsData} loading={loading} />
    </div>
  );
}

export default ApiMerchantWrapper