import { useIntl } from 'react-intl';
import { MenuItem } from './MenuItem';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../../app/helpers/axiosInstance';

export function MenuInner() {
  const intl = useIntl();
  const user_type = Cookies.get('user_type');
  const [superadminName, setSuperadminName] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (user_type === 'super_admin') {
      fetchData();
    }
  }, [user_type]);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const fetchData = async () => {
    try {
      const user_id = Cookies.get('user_id');
      const response = await axiosInstance.post('/backend/fetch_super_admin', {
        id: user_id,
      });

      const responseData = response.data.data;
      if (responseData && responseData.length > 0) {
        const name = responseData[0].super_admin_name;
        setSuperadminName(name);
      }
    } catch (error) {
      console.error('Error fetching superadmin data:', error);
    }
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  return (
    <>
      {user_type === 'super_admin' ? (
        <>
          <h1 style={{marginTop:"15px", textTransform:"capitalize"}}>{greeting} {superadminName} !</h1>
        </>
      ) : (
        <div style={{marginLeft:"-40px", fontSize:"14px", marginTop:"10px"}}>
          {/* <MenuItem title={intl.formatMessage({ id: 'MENU.DASHBOARD' })} to='/merchant/dashboard' /> */}
          {/* <MenuItem title={'Apply Visa'} to='/merchant/apply-visa' /> */}
        </div>
      )}
    </>
  );
}
