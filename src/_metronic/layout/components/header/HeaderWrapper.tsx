/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'
import { useLayout } from '../../core'
import { Header } from './Header'
import { Navbar } from './Navbar'
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../app/helpers/axiosInstance'


export function HeaderWrapper({ role }: { role: string }) {
  const { config, classes } = useLayout();
  const [profile, setProfile] = useState<any>({}); // Update the type accordingly
  const [userType, setUserType] = useState<string | undefined>('');
  useEffect(() => {
    if (user_type == 'merchant') {
      
      fetchProfileData()
    }
    else{
      fetchData();
    }
  }, [])
  const fetchProfileData = async () => {
    try {
      const user_id = Cookies.get('user_id');
      const postData = { id: user_id };

      const response = await axiosInstance.post('/backend/fetch_single_merchant_user', postData);

      if (response.status === 203) {
        toast.error('Please Logout And Login Again', { position: 'top-center' });
      }

      setProfile(response.data.data);
      const issuedApi = response.data.data?.issued_api || [];
      setUserType(issuedApi.length > 0 ? 'Partner' : 'Retailer');
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const isMerchant = Cookies.get('user_type') === 'merchant';
  const isCustomer = Cookies.get('user_type') === 'customer';

  if (!config.app?.header?.display) {
    return null;
  }


  const fetchData = async () => {
    try {
      const user_id = Cookies.get('user_id')

      // Make a POST request to your API endpoint
      axiosInstance.post('/backend/fetch_super_admin', {
        id: user_id
      })
        .then((response) => {
          const responseData = response.data.data;
          setProfile(responseData[0])

        })
        .catch((error) => {
          console.error('Error fetching VISA 247 data:', error);
        });


    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const { data } = profile || {}; 
  const user_type = Cookies.get('user_type');
  const issuedApi = (data && data.issued_api) || [];
  const isPartnerOrRetailer = isMerchant && data && data.issued_api && data.issued_api.length > 0;

  

  if (!config.app?.header?.display) {
    return null;
  }
 

  
  return (
    <div id='kt_app_header' className='app-header'>
      <Toaster />
      <div
        id='kt_app_header_container'
        className={clsx(
          'app-container flex-lg-grow-1',
          classes.headerContainer.join(' '),
          config.app?.header?.default?.containerClass
        )}
      >
        {config.app.sidebar?.display && (
          <>
            <div
              className='d-flex align-items-center d-lg-none ms-n2 me-2'
              title='Show sidebar menu'
            >
              <div
                className='btn btn-icon btn-active-color-primary w-35px h-35px'
                id='kt_app_sidebar_mobile_toggle'
              >
                <KTIcon iconName='abstract-14' className=' fs-1' />
              </div>
              <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
                <Link to='/superadmin/dashboard' className='d-lg-none'>
                  <img
                    alt='Logo'
                    src={toAbsoluteUrl('/media/logos/favicon.png')}
                    className='h-30px'
                  />
                </Link>
              </div>
            </div>
          </>
        )}

        {!(config.layoutType === 'dark-sidebar' || config.layoutType === 'light-sidebar') && (
          <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15'>
            <Link to='/merchant/dashboard'>
              {config.layoutType !== 'dark-header' ? (
                <img
                  alt='Logo'
                  src={toAbsoluteUrl('/media/logos/default.svg')}
                  className='h-20px h-lg-30px app-sidebar-logo-default'
                />
              ) : (
                <>
                  <img
                    alt='Logo'
                    src={toAbsoluteUrl('/media/logos/default-dark.svg')}
                    className='h-20px h-lg-30px app-sidebar-logo-default theme-light-show'
                  />
                  <img
                    alt='Logo'
                    src={toAbsoluteUrl('/media/logos/default-small-dark.svg')}
                    className='h-20px h-lg-30px app-sidebar-logo-default theme-dark-show'
                  />
                </>
              )}
            </Link>
          </div>
        )}
        
        {isMerchant && (
        <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15'>
          <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15'>
            <Link to='/merchant/dashboard'>
              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/logos/logo.png')}
                className='h-20px h-lg-30px app-sidebar-logo-default'
              />
            </Link>
             <p
              style={{
                position: 'relative',
                top: '17px',
                color: '#327113',
              }}
            >
              {userType}
            </p>
          </div>
        </div>
      )}

      {isCustomer && (
        <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15'>
          <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15'>
            <Link to='/customer/dashboard'>
              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/logos/logo.png')}
                className='h-20px h-lg-30px app-sidebar-logo-default'
              />
            </Link>
             <p
              style={{
                position: 'relative',
                top: '17px',
                color: '#327113',
              }}
            >
              Customer
            </p>
          </div>
        </div>
      )}

        <div
          id='kt_app_header_wrapper'
          className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'
        >
          {config.app.header.default?.content === 'menu' &&
            config.app.header.default.menu?.display && (
              <div
                className='app-header-menu app-header-mobile-drawer align-items-stretch'
                data-kt-drawer='true'
                data-kt-drawer-name='app-header-menu'
                data-kt-drawer-activate='{default: true, lg: false}'
                data-kt-drawer-overlay='true'
                data-kt-drawer-width='225px'
                data-kt-drawer-direction='end'
                data-kt-drawer-toggle='#kt_app_header_menu_toggle'
                data-kt-swapper='true'
                data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
                data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}"
              >
                <Header />
              </div>
            )}
          <Navbar />
        </div>
      </div>
    </div>
  )
}