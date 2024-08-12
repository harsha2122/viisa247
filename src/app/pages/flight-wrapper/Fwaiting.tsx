import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import { Wfwaiting } from '../../components/Wfwaiting';

function Fwaiting() {
  const [insuranceData, setInsuranceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/backend/super_admin/fetch_all_flight');
        setInsuranceData(response.data.data);
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
      <Wfwaiting className='' title='Flight Waiting for Approval' data={insuranceData} loading={loading} />
    </div>
  );
}

export default Fwaiting;
