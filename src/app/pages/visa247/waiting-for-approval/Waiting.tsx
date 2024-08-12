import { WaitingTable } from '../../../components/WaitingTable';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../helpers/axiosInstance';

function Waiting() {
  const [visasStatsData, setVisasStatsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/backend/super_admin/fetch_all_visa');
        
        // Filter data to exclude entries with null group_id
        const filteredData = response.data.data.filter(item => item.group_id !== null);
        
        setVisasStatsData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ marginTop: "-50px" }}>
      <WaitingTable className='' title={'Visa247 In-Process'} data={visasStatsData} loading={loading} />
    </div>
  );
}

export default Waiting;
