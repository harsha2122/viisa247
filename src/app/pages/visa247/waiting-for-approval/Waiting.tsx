import { WaitingTable } from '../../../components/WaitingTable';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../helpers/axiosInstance';

function Waiting() {
  const [visasStatsData, setVisasStatsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/backend/super_admin/fetch_all_visa');
        
        // Filter data to exclude entries with null group_id
        const filteredData = response.data.data.filter((item: any) => item.group_id !== null);

        // Define the type of visaData explicitly
        const visaData: any[] = [];
        filteredData.forEach((group: any) => {
          // Filter applications within the group
          const filteredApplications = group.applications.filter((application: any) => 
            application.visa_status === 'Not Issued' || application.visa_status === 'Applied'
          );

          if (filteredApplications.length > 0) {
            // Add filtered group with relevant applications
            visaData.push({
              ...group,
              applications: filteredApplications,
            });
          }
        });

        setVisasStatsData(visaData);
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
