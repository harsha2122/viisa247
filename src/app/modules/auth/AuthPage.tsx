import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { Registration as SuperadminRegistration } from './components/Superadmin/Registration'; 
import { ForgotPassword as SuperadminForgotPassword } from './components/Superadmin/ForgotPassword'; 
import { Login as SuperadminLogin } from './components/Superadmin/Login'; 
import { AuthLayout } from './AuthLayout';
import { Login as MerchantLogin } from './components/Merchant/Login'; 
import { Registration as MerchantRegistration } from './components/Merchant/Registration'; 
import { ForgotPassword as MerchantForgotPassword } from './components/Merchant/ForgotPassword'; 
import { Login as CustomerLogin } from './components/Customer/Login'; 
import { Registration as CustomerRegistration } from './components/Customer/Registration'; 
import { ForgotPassword as CustomerForgotPassword } from './components/Customer/ForgotPassword'; 
// import { LandingPage } from './components/LandingPage';
import { ChangePassword } from './components/Merchant/ChangePassword';
import Home from '../../pages/landing/home';
import Inner from '../../pages/inner/inner';
import PasswordResetWrapper from '../../pages/Forgot_password/PasswordResetWrapper'
import Terms from '../../pages/tac/terms';
import Package from '../../pages/package/packages';
import Booking from '../../pages/booking/booking';
import Privacy from '../../pages/pp/privacy';
import CustomerDashboard from '../../pages/merchants/dashboard/CustomerDashboard';
import { Vertical5 } from '../wizards/components/Vertical5';

const AuthPage = () => {
  const [manualValue, setManualValue] = useState(null);

  return (
    <Routes>
      <Route path='/passwordreset' element={<PasswordResetWrapper />} />
      <Route path='/terms-and-conditions' element={<Terms />} />
      <Route path='/privacy-policy' element={<Privacy />} />
      <Route
        index
        element={<Home
          className="yourClassNameHere"
          title="Your Title Here"
          show={(value) => {}}
          visaList={false}
          visaListLoader={(value) => {}}
          apiData={[]}
          onSelectClick={(entryData) => {}}
          selectedFromCountry=""
          selectedToCountry=""
        />}
      />
      <Route
        path='/searched-result'
        element={
          <Inner
            className="yourClassNameHere"
            title="Your Title Here"
            show={(value) => {}}
            visaList={true}
            manualValue={manualValue}
            visaListLoader={(value) => {}}
            apiData={[]}  // Pass your actual apiData here
            onSelectClick={(entryData) => {}}
            onApiDataReceived={(handleApiDataReceived) => {}}
          />
        }
      />
      <Route
        path='/book-package'
        element={
          <Package packageItem={[]} />
        }
      />
      <Route
        path='/booking'
        element={
          <Booking packageData={[]} />
        }
      />
      <Route
        path='/applyvisa'
        element={
          <Vertical5 
            selectedEntry={{}} // Pass appropriate initial data
            show={(value) => {}}
            visaList={false}
            visaListLoader={(value) => {}}
            showfinalSubmitLoader={(value) => {}}
          />
        }
      />

      <Route element={<AuthLayout />}>
        <Route path='superadmin/login' element={<SuperadminLogin />} />
        <Route path='superadmin/registration' element={<SuperadminRegistration />} />
        <Route path='superadmin/forgot-password' element={<SuperadminForgotPassword />} />
        <Route path='merchant/login' element={<MerchantLogin />} />
        <Route path='merchant/registration' element={<MerchantRegistration />} />
        <Route path='merchant/forgot-password' element={<MerchantForgotPassword />} />
        <Route path='merchant/change-password' element={<ChangePassword />} />
        <Route path='customer/login' element={<CustomerLogin />} />
        <Route path='customer/registration' element={<CustomerRegistration />} />
        <Route path='customer/forgot-password' element={<CustomerForgotPassword />} />
      </Route>
    </Routes>
  );
};

export { AuthPage };
