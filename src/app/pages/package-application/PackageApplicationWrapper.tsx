import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import { RevenueTable } from '../../components/RevenueTable';
import PackageApplicationTable from '../../components/PackageApplicationTable';

function PackageApplicationWrapper() {
  const [papplyData, setPapplyData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        axiosInstance.post('/backend/fetch_package')
          .then((response) => {
            const sortedData = response.data;
            setPapplyData(sortedData);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
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
      <PackageApplicationTable data={papplyData}/>
    </div>
  );
}

export default PackageApplicationWrapper;
