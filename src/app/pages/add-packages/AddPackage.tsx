import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import PackageTable from '../../components/PackageTable';

function AddPackageWrapper() {
  const [packageData, setPackageData] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
  
        axiosInstance.get('/backend/packages')
          .then((response) => {
            setPackageData(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            setLoading(false);
          });

        
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  return (
    <div style={{marginTop:"-50px"}}>
      <PackageTable data={packageData} />
    </div>
  )
}

export default AddPackageWrapper