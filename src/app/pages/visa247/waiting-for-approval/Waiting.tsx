import { WaitingTable } from '../../../components/WaitingTable';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../helpers/axiosInstance';
import { ProcessedTable } from '../../../components/ProcessedTable';

function Waiting() {
  const [visasStatsData, setVisasStatsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Define a function to make the POST request
    const fetchData = async () => {
      setLoading(true);
      try {

        // Make a POST request to your API endpoint
        axiosInstance.get('/backend/super_admin/fetch_all_visa')
          .then((response) => {
            const filteredData = response.data.data.filter(item => ['Applied', 'Not Issued'].includes(item.visa_status) && item.visa_provider === 'manual');
            setVisasStatsData(filteredData);
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
      <WaitingTable className='' title={'Visa247 Waiting for Approval'} data={visasStatsData} loading={loading} />
    </div>
  )
}

export default Waiting