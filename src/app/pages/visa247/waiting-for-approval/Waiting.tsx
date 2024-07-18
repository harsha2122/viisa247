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
        const data = [...(response.data.data || []), ...(response.data.data1 || [])];
        const filteredData = data.filter(item => 
          ['Applied', 'Not Issued'].includes(item.visa_status) && item.visa_provider === 'manual'
        );
        const sortedData = filteredData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setVisasStatsData(sortedData as any);

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
