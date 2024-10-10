import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import { InsuranceTable } from '../../components/InsuranceTable';

function InsuranceWrapper() {
  const [insuranceData, setInsuranceData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        axiosInstance.get('/backend/fetch_insurance')
          .then((response) => {
            setInsuranceData(response.data.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching insurance data:', error);
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
      <InsuranceTable className='border py-8 px-4' title={'Insurance'} data={insuranceData} loading={loading} />
    </div>
  );
}

export default InsuranceWrapper;
