import { ProcessedTable } from '../../components/ProcessedTable'
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import { IssueApiTable } from '../../components/IssueApiTable';

function IssueApiWrapper() {
    const [memberStatsData, setMemberStatsData] = useState([]);
    const [loading,setLoading] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {

          axiosInstance.get('/backend/fetch_merchant_api')
          .then((response) => {
              setMemberStatsData(response.data.data);
              setLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching Atlys data:', error);
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
    <div style={{marginTop:"-50px"}} >
      <IssueApiTable className='' data={memberStatsData} loading={loading}/>
    </div>
  )
}

export default IssueApiWrapper;