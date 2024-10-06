import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import { InsuranceApi } from '../../components/InsuranceApi';

function InsuranceWrap() {
  const [insuranceData, setInsuranceData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        axiosInstance.post('/backend/fetch_insurance_list')
          .then((response) => {
            setInsuranceData(response.data.data.products);
            console.log("df", response.data)
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
    <div style={{ marginTop: "-50px" }}>
      <InsuranceApi className='border py-8 px-4' title={'Available Insurance'} data={insuranceData} loading={loading} />
    </div>
  );
}

export default InsuranceWrap;
