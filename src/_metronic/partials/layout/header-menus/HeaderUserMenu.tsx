/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../app/modules/auth'
import { Languages } from './Languages'
import { toAbsoluteUrl } from '../../../helpers'
import Cookies from 'js-cookie';
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../../../app/helpers/axiosInstance'
type Props = {
  profile:any;
}
const HeaderUserMenu: React.FC<Props> = ({ profile }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const user_type = Cookies.get('user_type');

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

  const handleSuperAdminLogout = async () => {
    try {
      const response = await axiosInstance.get('/backend/logout/merchant_user');
      if (response.status === 200) {
        Cookies.remove('isLoggedIn');
        setTimeout(() => {
          window.location.href = '/superadmin/login';
        }, 400);
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCustomerLogout = () => {
    Cookies.remove('isLoggedIn');
    setTimeout(() => {
      window.location.href = '/customer/login';
    }, 400);
  };

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-auto'
      data-kt-menu='true'
    >
      <Toaster />
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img
              alt='Logo'
              src={profile.merchant_profile_photo || profile.super_admin_profile_photo || profile.user_profile_photo}
            />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {profile ? profile.merchant_name || profile.super_admin_name ||  profile.user_name : ''}

            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {profile.merchant_email_id || profile.super_admin_email || profile.user_email_id}
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      <div className='menu-item px-5'>
        {user_type === "merchant" && (
          <Link to={'/merchant/profile'} className='menu-link px-5'>
            My Profile
          </Link>
        )}

        {user_type === "super_admin" && (
          <>
            <Link to={'/crafted/pages/profile'} className='menu-link px-5'>
              My Profile
            </Link>
            <Link to={'/superadmin/changepassword'} className='menu-link px-5'>
              Change Password
            </Link>
          </>
        )}

        {user_type === "customer" && (
          <Link to={'/customer/profile'} className='menu-link px-5'>
            My Profile
          </Link>
        )}
      </div>


      <div className='menu-item px-5'>
        {user_type === 'merchant' ? (
          <a onClick={handleMerchantLogout} className='menu-link px-5'>
            Sign Out
          </a>
        ) : user_type === 'superadmin' ? (
          <a onClick={handleSuperAdminLogout} className='menu-link px-5'>
            Sign Out
          </a>
        ) : (
          <a onClick={handleCustomerLogout} className='menu-link px-5'>
            Sign Out
          </a>
        )}
      </div>
    </div>
  );
}

export { HeaderUserMenu };
