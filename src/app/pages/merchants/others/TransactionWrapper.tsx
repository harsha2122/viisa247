import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../app/helpers/axiosInstance';
import Cookies from 'js-cookie'
import { TransactionMerchant } from '../../../components/TransactionMerchant';

function TransactionWrapper() {
  const [insuranceData, setInsuranceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user_id = Cookies.get('user_id')
        const postData = {
          merchant_id: user_id,
        }
        const response = await axiosInstance.post('/backend/fetch_merchant_transaction', postData)
        setInsuranceData(response.data.data)
      } catch (error) {
        console.error('Error fetching profile data:', error)
        // Handle error (e.g., show an error message)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ marginTop: "-20px" }}>
      <TransactionMerchant className='' title='Visa Revenue' data={insuranceData} loading={loading} />
    </div>
  );
}

export default TransactionWrapper;
