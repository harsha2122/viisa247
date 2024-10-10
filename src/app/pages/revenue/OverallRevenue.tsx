import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import { RevenueTable } from '../../components/RevenueTable';
import { RevenueTa } from '../../components/RevenueTa';

function OverallRevenue() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        axiosInstance.get('/backend/super_admin/total_revenue')
          .then((response) => {
            console.log("sdf", response.data.data)
            const sortedData = response.data.data.sort((a, b) => new Date(b.transaction_time).getTime() - new Date(a.transaction_time).getTime());
            setRevenueData(sortedData);
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
      <RevenueTa className='' title={'Revenue'} data={revenueData} loading={loading} />
    </div>
  );
}

export default OverallRevenue;
