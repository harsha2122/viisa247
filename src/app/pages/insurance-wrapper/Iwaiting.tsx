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
        const filteredData = response.data.data.filter((item: any) => item.group_id !== null);
        let visaData: any[] = [];
        filteredData.forEach((group: any) => {
          const filteredApplications = group.applications.filter((application: any) => 
            application.insurance_status === 'Not Issued' || application.insurance_status === 'Applied'
          );

          if (filteredApplications.length > 0) {
            visaData.push({
              ...group,
              applications: filteredApplications,
            });
          }
        });

        visaData = visaData.sort((a, b) => {
          const dateA = new Date(a.applications[0].created_at).getTime();
          const dateB = new Date(b.applications[0].created_at).getTime();
          return dateB - dateA;
        });

        setInsuranceData(visaData);
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
