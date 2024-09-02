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
        
        // Filter data to exclude entries with null group_id
        const filteredData = response.data.data.filter((item: any) => item.group_id !== null);

        // Define the type of visaData explicitly
        let visaData: any[] = [];
        filteredData.forEach((group: any) => {
          // Filter applications within the group
          const filteredApplications = group.applications.filter((application: any) => 
            application.visa_status === 'Processed' || application.visa_status === 'Issued'
          );

          if (filteredApplications.length > 0) {
            // Add filtered group with relevant applications
            visaData.push({
              ...group,
              applications: filteredApplications,
            });
          }
        });

        // Sort visaData by the created_at date of the first application in each group
        visaData = visaData.sort((a, b) => {
          const dateA = new Date(a.applications[0].created_at).getTime();
          const dateB = new Date(b.applications[0].created_at).getTime();
          return dateB - dateA;  // Descending order (most recent first)
        });

        setVisaStatsData(visaStatsData);
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
