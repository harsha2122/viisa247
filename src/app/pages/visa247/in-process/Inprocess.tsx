import { VisaInprocess } from '../../../components/VisaInprocess';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../helpers/axiosInstance';

function Inprocess() {
  const [visaStatsData, setVisaStatsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Define a function to make the POST request
    const fetchData = async () => {
      setLoading(true);
      try {
        // Make a POST request to your API endpoint
        axiosInstance.get('/backend/super_admin/fetch_all_visa')
          .then((response) => {
            const filteredData = response.data.data.filter(item => item.visa_provider === 'manual' && item.visa_status === 'Process');
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

    fetchData();
  }, []);

  return (
    <div style={{ marginTop: "-50px" }}>
      <VisaInprocess className='' title={'Visa247 In-Process'} data={visaStatsData} loading={loading} />
    </div>
  )
}

export default Inprocess;
