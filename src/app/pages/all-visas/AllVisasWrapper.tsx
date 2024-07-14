import { ProcessedTable } from '../../components/ProcessedTable'
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import VisasTable from '../../components/VisasTable';

function AllVisasWrapper() {
  const [allVisasData, setAllVisasData] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
  
        axiosInstance.get('/backend/fetch_all_visa_data')
          .then((response) => {
            setAllVisasData(response.data.data);
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
      <VisasTable data={allVisasData} />
    </div>
  )
}

export default AllVisasWrapper