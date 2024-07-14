import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../helpers/axiosInstance';
import Cookies from 'js-cookie'
import { DummyFlight } from '../../components/DummyFlight';

function FlightWrapper() {
  const [hotelData, setHotelData] = useState([]);
  const [loading,setLoading] = useState(false);
  const user_id = Cookies.get('user_id');

  useEffect(() => {
    // Define a function to make the POST request
    const fetchData = async () => {
      setLoading(true);
      try {
    
        axiosInstance.get('/backend/fetch_dummy_flight')
          .then((response) => {
            setHotelData(response.data.data);
            setLoading(false)
          })
          .catch((error) => {
            console.error('Error fetching Atlys data:', error);
            setLoading(false)
          });
      } catch (error) {
        console.error('Error:', error);
        setLoading(false)
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []); // The empty dependency array ensures this effect runs once on mount

  return (
    <div style={{marginTop:"-50px"}} >
      <DummyFlight className='' title={'Visa Processed'} data={hotelData} loading={loading}/>
    </div>
  )
}

export default FlightWrapper