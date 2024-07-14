/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React, { FC, useEffect } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'
import { ErrorsPage } from '../modules/errors/ErrorsPage'
import { Logout, AuthPage, useAuth } from '../modules/auth'
import { App } from '../App'
import Cookies from 'js-cookie';

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { PUBLIC_URL } = process.env

const AppRoutes: FC = () => {
  const { currentUser } = useAuth()
  const isLoggedIn = Cookies.get('isLoggedIn');
  const user_type = Cookies.get('user_type');
  // useEffect(() => {
  //   // Use useEffect to monitor changes in the isLoggedIn cookie
  //   if (isLoggedIn) {
  //     // Redirect to the dashboard when isLoggedIn is true
  //     window.location.href = '/dashboard';
  //   } else {
  //     // Redirect to the login page when isLoggedIn is false
  //     window.location.href = '/auth';
  //   }
  // }, []);

  return (
    <BrowserRouter >
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {isLoggedIn ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              {user_type == "super_admin" ?
                <>
                  <Route index element={<Navigate to='/superadmin/apply-visa' />} />
                  <Route index element={<Navigate to='/superadmin/issueApi' />} />
                  <Route index element={<Navigate to='/superadmin/testing' />} />
                  <Route index element={<Navigate to='/superadmin/apiSetting' />} />
                  <Route index element={<Navigate to='/superadmin/dashboard' />} />
                  <Route index element={<Navigate to='/superadmin/apiPayment' />} />
                  <Route index element={<Navigate to='/superadmin/apiMerchants' />} />
                  <Route index element={<Navigate to='/merchants' />} />
                  <Route index element={<Navigate to='/add-new-merchant' />} />
                  <Route index element={<Navigate to='/superadmin/changepassword' />} />
                  <Route index element={<Navigate to='/processed' />} />
                  <Route index element={<Navigate to='/in-process' />} />
                  <Route index element={<Navigate to='/waiting-for-approval' />} />
                  <Route index element={<Navigate to='/rejected' />} />
                  <Route index element={<Navigate to='/visa247/processed' />} />
                  <Route index element={<Navigate to='/visa247/in-process' />} />
                  <Route index element={<Navigate to='/visa247/waiting-for-approval' />} />
                  <Route index element={<Navigate to='/visa247/rejected' />} />
                </>
                :
                <>
                  <Route index element={<Navigate to='/merchant/apply-visa' />} />
                  <Route index element={<Navigate to='/merchant/dashboard' />} />
                  <Route index element={<Navigate to='/cutomers' />} />
                  <Route index element={<Navigate to='/create-visa' />} />
                  <Route index element={<Navigate to='/create-new-visa' />} />
                  <Route index element={<Navigate to='/merchant/profile' />} />
                </>
              }

            </>
          ) : (
            <>
              {/* <Route index element={<Navigate to='/superadmin/forgotPassword' />} /> */}
              <Route path='*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { AppRoutes }
