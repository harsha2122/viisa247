import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../helpers/axiosInstance';
import { UsersTable } from '../../modules/wizards/components/UsersTable';

function UserWrapper() {
  // Define the initial state for memberStatsData
  const [userData, setUserData] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    // Define a function to make the POST request
    const fetchData = async () => {
      setLoading(true);
      try {
        const postData = {
          // Your POST data goes here
        };
        // Make a POST request to your API endpoint
        axiosInstance.post('/backend/fetch_normal_user', postData)
          .then((response) => {
            setUserData(response.data.data);
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

    // Call the fetchData function when the component mounts
    fetchData();
  }, []); // The empty dependency array ensures this effect runs once on mount

  return (
    <div style={{marginTop:"-40px"}} >
      <UsersTable className='' data={userData} loading={loading} />
    </div>
  );
}

export default UserWrapper