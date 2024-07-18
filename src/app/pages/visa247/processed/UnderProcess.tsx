import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../helpers/axiosInstance';
import Cookies from 'js-cookie';
import { UnderProcessTable } from '../../../components/UnderProcessTable';

function UnderProcess() {
  const [visaStatsData, setVisaStatsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user_id = Cookies.get('user_id');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/backend/super_admin/fetch_all_visa');
        const data = [...(response.data.data || []), ...(response.data.data1 || [])];
        const filteredData = data.filter(item => 
          item.visa_provider === 'manual' && item.visa_status === 'Issue'
        );
        const sortedData = filteredData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        console.log("asd", sortedData)
        setVisaStatsData(sortedData as any);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDataChange = (newData) => {
    setVisaStatsData(newData);
  };

  return (
    <div style={{ marginTop: "-50px" }}>
      <UnderProcessTable onDataChange={handleDataChange} className='' title={'Visa247 Issued'} data={visaStatsData} loading={loading} />
    </div>
  );
}

export default UnderProcess;
