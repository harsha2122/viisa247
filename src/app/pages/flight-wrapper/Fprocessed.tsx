import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import { Wfprocessed } from '../../components/Wfprocessed';

function Fprocessed() {
  const [insuranceData, setInsuranceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/backend/super_admin/fetch_all_flight');
        const data = [...(response.data.data || []), ...(response.data.data1 || [])];
        const filteredData = data.filter(item => item.flight_status === 'Issued');
        const sortedData = filteredData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setInsuranceData(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ marginTop: '-50px' }}>
      <Wfprocessed className='' title='Insurance Issued' data={insuranceData} loading={loading} />
    </div>
  );
}

export default Fprocessed;
