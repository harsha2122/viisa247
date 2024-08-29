import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../app/helpers/axiosInstance';
import { InsuranceRevenue } from '../../../components/InsuranceRevenue';
import Cookies from 'js-cookie'

function InsuranceRevenueWrapper() {
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
        const response = await axiosInstance.post('/backend/merchant/insurance_revenue', postData)
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
      <InsuranceRevenue className='' title='Insurance Revenue' data={insuranceData} loading={loading} />
    </div>
  );
}

export default InsuranceRevenueWrapper;
