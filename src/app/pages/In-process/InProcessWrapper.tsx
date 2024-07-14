import { ProcessedTable } from '../../components/ProcessedTable'
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';

function InProcessWrapper() {
  const [visaStatsData, setVisaStatsData] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    // Define a function to make the POST request
    const fetchData = async () => {
      setLoading(true);
      try {
  
        axiosInstance.get('/backend/super_admin/fetch_all_visa')
          .then((response) => {
            const filteredData = response.data.data.filter(item => item.visa_status === 'Applied');
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
      <ProcessedTable className='' title={'Visa In-Process'} data={visaStatsData} loading={loading} />
    </div>
  )
}

export default InProcessWrapper