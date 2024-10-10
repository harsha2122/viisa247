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
        
        // Filter data to exclude entries with null group_id
        const filteredData = response.data.data.filter((item: any) => item.group_id !== null);

        // Define the type of visaData explicitly
        const visaData: any[] = [];
        filteredData.forEach((group: any) => {
          // Filter applications within the group
          const filteredApplications = group.applications.filter((application: any) => 
            application.visa_status === 'Rejected' || application.visa_status === 'Reject'
          );

          if (filteredApplications.length > 0) {
            // Add filtered group with relevant applications
            visaData.push({
              ...group,
              applications: filteredApplications,
            });
          }
        });

        setVisaStatsData(visaData as any);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div >
      <RejectTable className='' title={'Visa247 Rejected'} data={visaStatsData} loading={loading} />
    </div>
  );
}

export default Reject;
