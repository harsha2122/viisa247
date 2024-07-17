import { RejectTable } from '../../../components/RejectTable';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../helpers/axiosInstance';

function Reject() {
  const [visaStatsData, setVisaStatsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/backend/super_admin/fetch_all_visa');
        const data = [...(response.data.data || []), ...(response.data.data1 || [])];
        const filteredData = data.filter(item => 
          item.visa_provider === 'manual' && item.visa_status === 'Reject'
        );
        const sortedData = filteredData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setVisaStatsData(sortedData as any);
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
      <RejectTable className='' title={'Visa247 Rejected'} data={visaStatsData} loading={loading} />
    </div>
  );
}

export default Reject;
