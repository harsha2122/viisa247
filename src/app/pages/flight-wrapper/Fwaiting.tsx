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
        const data = response.data.data;

        const filteredByStatus = data.filter((entry: any) => {
          const status = entry.applications[0]?.flight_status;
          return status === 'Applied' || status === 'Not Issued';
        });

        const sortedData = filteredByStatus.sort((a: any, b: any) => {
          const dateA = new Date(a.applications[0]?.updated_at);
          const dateB = new Date(b.applications[0]?.updated_at);
          return dateB.getTime() - dateA.getTime();
        });

        setInsuranceData(sortedData);
        console.log("Sorted and Filtered Data:", sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Wfwaiting className='' title='Flight Waiting for Approval' data={insuranceData} loading={loading} />
    </div>
  );
}

export default Fwaiting;
