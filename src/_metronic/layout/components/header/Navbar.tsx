import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { KTIcon, toAbsoluteUrl } from '../../../helpers';
import { HeaderNotificationsMenu, HeaderUserMenu, Search, ThemeModeSwitcher } from '../../../partials';
import { useLayout } from '../../core';
import { FcExport } from "react-icons/fc";
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../../../app/helpers/axiosInstance';
import { MdRefresh } from 'react-icons/md';
import Drawer from '@mui/material/Drawer';
import Chat from '../../../../app/pages/chat/Chat';
import { FaWhatsapp } from "react-icons/fa";
import lgout from '../../../assets/card/logout.svg'

const itemClass = 'ms-1 ms-md-4';
const btnClass = 'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px';
const userAvatarClass = 'symbol-35px';
const btnIconClass = 'fs-2';

const Navbar = () => {
  const { config } = useLayout();
  const [currentWallet, setCurrentWallet] = useState(0);  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profile, setProfile] = useState({
    merchant_email_id: '',
    merchant_name: '',
    merchant_profile_photo: '',
    super_admin_profile_photo: '',
    super_admin_name: '',
    super_admin_email: '',
    user_profile_photo: '',
    user_name: '',
    user_email_id: ''
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChatContainerOpen, setIsChatContainerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
    setIsChatContainerOpen(false);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleChatContainerOpen = () => {
    setIsChatContainerOpen(true);
    setIsDrawerOpen(false);
  };

  const handleMerchantLogout = async () => {
    try {
      const response = await axiosInstance.get('/backend/logout/merchant_user');
      if (response.status === 200) {
        Cookies.remove('isLoggedIn');
        setTimeout(() => {
          window.location.href = '/merchant/login';
        }, 400);
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const rotateIcon = async () => {
      while (!isRefreshing) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };

    rotateIcon();
    return () => {
    };
  }, [isRefreshing]);

  useEffect(() => {
    refreshWalletBalance();
  }, []);

  useEffect(() => {
    const walletBalance = Cookies.get('walletBalance');
    if (walletBalance) {
      setCurrentWallet(parseFloat(walletBalance));
    }
  }, []);

  const refreshWalletBalance = async () => {
    try {
      setIsRefreshing(true);
      const response = await axiosInstance.post('/backend/atlys_wallet_balance');
      const updatedBalance = response.data.data;
      Cookies.set('walletBalance', updatedBalance);

      setCurrentWallet(parseFloat(updatedBalance));

      toast.success('Wallet balance refreshed successfully', {
        position: 'top-center'
      });
    } catch (error) {
      console.error('Error refreshing wallet balance:', error);
      toast.error('Error refreshing wallet balance', {
        position: 'top-center'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const user_type = Cookies.get('user_type');

  useEffect(() => {
    if (user_type === 'merchant') {
      fetchwallet();
      fetchProfileData();
      const intervalId = setInterval(fetchwallet, 60000);
      return () => {
        clearInterval(intervalId);
      };
    }
    if (user_type === 'customer') {
      fetchCustomerProfile();
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const user_id = Cookies.get('user_id');

      const response = await axiosInstance.post('/backend/fetch_super_admin', {
        id: user_id
      });

      const responseData = response.data.data;
      setProfile(responseData[0]);
    } catch (error) {
      console.error('Error fetching VISA 247 data:', error);
    }
  };

  const fetchwallet = async () => {
    try {
      const user_id = Cookies.get('user_id');
      const postData = {
        id: user_id
      };
      const response = await axiosInstance.post('/backend/fetch_single_merchant_user', postData);

      if (response.status === 203) {
        toast.error('Please Logout And Login Again', {
          position: 'top-center'
        });
      }

      setCurrentWallet(response.data.data.wallet_balance);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const fetchProfileData = async () => {
    try {
      const user_id = Cookies.get('user_id');
      const postData = {
        id: user_id
      };
      const response = await axiosInstance.post('/backend/fetch_single_merchant_user', postData);

      if (response.status === 203) {
        toast.error('Please Logout And Login Again', {
          position: 'top-center'
        });
      }

      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  const fetchCustomerProfile = async () => {
    try {
      const user_id = Cookies.get('user_id');
      const postData = {
        user_id: user_id
      };
      const response = await axiosInstance.post('/backend/fetch_user', postData);
      if (response.status === 203) {
        toast.error('Please Logout And Login Again', {
          position: 'top-center'
        });
      }
      const responseData = (response.data.data)
      setProfile(responseData[0]);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  return (
    <div className='app-navbar flex-shrink-0'>
      <Toaster />
      {user_type === 'merchant' ? (
        <div style={{ marginTop: '-10px' }} className={clsx('app-navbar-item', itemClass)}>
          <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0' style={{ backgroundColor: '#f5f5f5', padding: 10, borderRadius: 10, marginRight: 30 }}>
            <KTIcon iconName='wallet' className={btnIconClass} />
            <span className='menu-title' style={{ fontWeight: 'bold', marginLeft: 5 }}>{currentWallet} /-</span>
          </div>
        </div>
      ) : user_type === 'super_admin' ? (
        <h1 style={{ position: 'relative', top: '15px', right: '8%', fontSize: '18px' }}>
          Atlys wallet -
          <button
            className='btn btn-success'
            style={{
              backgroundColor: '#fff',
              color: '#000',
              padding: '5px 10px',
              marginTop: '-4px',
              marginLeft: '5px',
              border: '1px solid #327113'
            }}
            onClick={refreshWalletBalance}
          >
            ₹ {new Intl.NumberFormat('en-IN').format(currentWallet)} /-
          </button>
          <MdRefresh
            onClick={refreshWalletBalance}
            title='Refresh'
            style={{
              color: '#327113',
              marginLeft: '12px',
              fontSize: '20px',
              cursor: "pointer",
              marginTop: '-4px',
              transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)',
              transition: 'transform 0.5s ease-in-out'
            }}
          />
        </h1>
      ) : null}


      {user_type === 'merchant' ? (
        <a href='https://wa.link/x3h9ry' className='mx-2' target='_blank' style={{ background: "#327113", border: "none", borderRadius: "10px", color: "#fff", width: "180px", padding: "10px", zIndex: "1", justifyContent: "center", display: "flex", alignItems: "center", height: "40px", marginTop: "6px" }}>
          <FaWhatsapp style={{ fontSize: "20px", marginRight: "3px" }} /> Chat in Whatsapp
        </a>
      ) : (
        <div></div>
      )}

      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          <img 
            style={{ borderRadius: '50%', width: '40px', height: '40px', marginTop: '-15px' }} 
            src={profile.merchant_profile_photo || profile.super_admin_profile_photo || profile.user_profile_photo}
            alt='Profile' 
          />
        </div>
        {user_type === 'merchant' ? (
          <>
            <div className='d-flex flex-column mx-4'>
              <h5 style={{marginBottom:"0", marginTop:"5px"}}>{profile.merchant_name || profile.user_name}</h5>
              <p className='text-muted'>Partner</p>
            </div>
            <img src={lgout} alt='logout' title='Logout' onClick={handleMerchantLogout} style={{width:"25px", marginTop:"-10px", cursor:"pointer", marginLeft:"10px"}} />
          </>
      ) : (
        <div></div>
      )}
        <HeaderUserMenu profile={profile} />
      </div>


      {config.app?.header?.default?.menu?.display && (
        <div className='app-navbar-item d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-35px h-35px'
            id='kt_app_header_menu_toggle'
          >
            <KTIcon iconName='text-align-left' className={btnIconClass} />
          </div>
        </div>
      )}

      <Drawer
        anchor='right'
        open={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <div style={{ width: 350, padding: 16, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", overflowY: "hidden", overflowX: "hidden" }}>
          <a href='https://wa.link/x3h9ry' target='_blank' style={{ background: "#327113", border: "none", borderRadius: "20px", color: "#fff", width: "180px", padding: "10px", zIndex: "1", justifyContent: "center", display: "flex" }}>
            <FaWhatsapp style={{ fontSize: "20px", marginRight: "3px" }} /> Chat in Whatsapp
          </a>
          <hr style={{ position: "absolute", top: "35px" }} />
          <Chat />
        </div>
      </Drawer>
    </div>
  );
};

export { Navbar };
