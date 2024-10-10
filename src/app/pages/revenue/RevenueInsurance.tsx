import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import { RevenueInsuranceTable } from '../../components/RevenueInsuranceTable';

function RevenueInsurance() {
  const [revenueiData, setRevenueiData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        axiosInstance.get('/backend/super_admin/insurance_revenue')
          .then((response) => {
            const sortedData = response.data.data.sort((a, b) => new Date(b.transaction_time).getTime() - new Date(a.transaction_time).getTime());
            setRevenueiData(sortedData);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching revenue data:', error);
            setLoading(false);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div >
      <RevenueInsuranceTable className='' title={'Revenue'} data={revenueiData} loading={loading} />
    </div>
  );
}

export default RevenueInsurance;
