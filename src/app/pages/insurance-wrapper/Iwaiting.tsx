import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../app/helpers/axiosInstance';
import { IwaitingTable } from '../../components/IwaitingTable';

function Iwaiting() {
  const [insuranceData, setInsuranceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/backend/super_admin/fetch_all_insurance');
        const data = [...(response.data.data || []), ...(response.data.data1 || [])];
        const filteredData = data.filter(item => ['Applied', 'Not Issued'].includes(item.insurance_status));
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
    <div style={{ marginTop: "-50px" }}>
      <IwaitingTable className='' title='Insurance Waiting for Approval' data={insuranceData} loading={loading} />
    </div>
  );
}

export default Iwaiting;
