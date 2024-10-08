import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import { TransactionTable } from '../../components/TransactionTable';

function OverallTransactions() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        axiosInstance.get('/backend/transaction_history')
          .then((response) => {
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
    <div style={{ marginTop: "-50px" }}>
      <TransactionTable className='' title={'Transaction'} data={revenueData} loading={loading} />
    </div>
  );
}

export default OverallTransactions;
