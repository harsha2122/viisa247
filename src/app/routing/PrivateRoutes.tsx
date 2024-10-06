import { lazy, FC, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { MasterLayout } from '../../_metronic/layout/MasterLayout';
import TopBarProgress from 'react-topbar-progress-indicator';
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils';
import { WithChildren } from '../../_metronic/helpers';
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper';
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { MenuTestPage } from '../pages/MenuTestPage'
import CustomersWrapper from '../pages/customers/CustomersWrapper';
import MerchantWrapper from '../pages/merchants/MerchantWrapper';
import AddNewMerchant from '../pages/merchants/AddNewMerchant';
import ProcessedWrapper from '../pages/processed/ProcessedWrapper';
import InProcessWrapper from '../pages/In-process/InProcessWrapper';
import ApprovalWrapper from '../pages/waiting-for-approval/ApprovalWrapper';
import RejectedWrapper from '../pages/visa-rejected/RejectedWrapper';
import NewVisaWrapper from '../pages/New-visa/CreateNewVisa';
import ApplyVisaWrapper from '../pages/apply-visa/ApplyVisaWrapper';
import MerchantDashboard from '../pages/merchants/dashboard/Dashboard';
import MerchantNewVisaWrapper from '../pages/merchants/apply-visa/MerchantNewVisaWrapper';
import MerchantProfile from '../pages/merchants/profile/MerchantProfile';
import Cookies from 'js-cookie';
import WalletWrapper from '../pages/wallet/WalletWrapper';
import ReportWrapper from '../pages/report/ReportWrapper';
import RevenueWrapper from '../pages/revenue/RevenueWrapper';
import IssueApiWrapper from '../pages/IssueApi/IssueApiWrapper';
import ApiSettingWrapper from '../pages/api-setting/ApiSettingWrapper';
import ApiPaymentWrapper from '../pages/api-payment/ApiPaymentWrapper';
import ApiMerchantWrapper from '../pages/api-merchant/ApiMerchantWrapper';
import { ChangePassword } from '../modules/profile/components/ChangePassword';
import TestingWrapper  from '../pages/testing/TestingWrapper';
import UnderProcess from '../pages/visa247/processed/UnderProcess';
import Inprocess from '../pages/visa247/in-process/Inprocess';
import Reject from '../pages/visa247/rejected/Reject';
import AddCountryWrapper from '../pages/add-country/AddCountryWrapper';
import PasswordPage from '../../app/pages/Forgot_password/PasswordResetWrapper';
import AllVisasWrapper from '../pages/all-visas/AllVisasWrapper';
import Chats from '../components/Chat';
import Chat from '../pages/chat/Chat';
import { Error404 } from '../modules/errors/components/Error404';
import Waiting from '../pages/visa247/waiting-for-approval/Waiting';
import AddPackageWrapper from '../pages/add-packages/AddPackage';
import PackageApplicationWrapper from '../pages/package-application/PackageApplicationWrapper';
import InsuranceWrapper from '../pages/insurance/InsuranceWrapper';
import AddInsurance from '../pages/insurance/AddInsurance';
import CustomerDashboard from '../pages/merchants/dashboard/CustomerDashboard';
import CustomerNewVisaWrapper from '../pages/merchants/apply-visa/CustomerNewVisaWrapper';
import CustomerNewInsurance from '../pages/merchants/apply-insurance/CustomerNewInsurance';
import MerchantNewInsurance from '../pages/merchants/apply-insurance/MerchantNewInsurance';
import Iwaiting from '../pages/insurance-wrapper/Iwaiting';
import Ireject from '../pages/insurance-wrapper/Irejected';
import Iprocessed from '../pages/insurance-wrapper/Iprocessed';
import RevenueInsurance from '../pages/revenue/RevenueInsurance';
import HotelWrapper from '../pages/dummy/HotelWrapper';
import FlightWrapper from '../pages/dummy/FlightWrapper';
import MerchantNewFlight from '../pages/merchants/apply-others/MerchantNewFlight';
import MerchantNewHotel from '../pages/merchants/apply-others/MerchantNewHotel';
import CustomerNewFlight from '../pages/merchants/apply-others/CustomerNewFlight';
import CustomerNewHotel from '../pages/merchants/apply-others/CustomerNewHotel';
import Hprocessed from '../pages/hotel-wrapper/Hprocessed';
import Hwaiting from '../pages/hotel-wrapper/Hwaiting';
import Hreject from '../pages/hotel-wrapper/Hrejected';
import Fwaiting from '../pages/flight-wrapper/Fwaiting';
import Fprocessed from '../pages/flight-wrapper/Fprocessed';
import Freject from '../pages/flight-wrapper/Frejected';
import RevenueHotel from '../pages/revenue/RevenueHotel';
import RevenueFlight from '../pages/revenue/RevenueFlight';
import UserWrapper from '../pages/users/UserWrapper';
import Wallet from '../pages/merchants/profile/Wallet';
import MerchantDirectInsurance from '../pages/merchants/apply-insurance/MerchantDirectInsurance';
import CustomerDirectInsurance from '../pages/merchants/apply-insurance/CustomerDirectInsurance';
import InsuranceWrap from '../pages/insurance/InsuranceWrap';
import AddInc from '../pages/insurance/AddInc';

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'));
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'));
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'));
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'));
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'));
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'));

  const user_type = Cookies.get('user_type');

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after successful login/registration */}
        {user_type === 'merchant' && (
          <>
            <Route path='/' element={<Navigate to='/merchant/dashboard' />} />
            <Route path='/merchant/apply-visa' element={<MerchantNewVisaWrapper />} />
            <Route path='/merchant/apply-insurance' element={<MerchantNewInsurance />} />
            <Route path='/merchant/directinsurance' element={<MerchantDirectInsurance/>} />
            <Route path='/merchant/apply-hotel' element={<MerchantNewHotel />} />
            <Route path='/merchant/apply-flight' element={<MerchantNewFlight />} />
            <Route path='/merchant/dashboard' element={<MerchantDashboard />} />
            <Route path='/merchant/profile' element={<MerchantProfile />} />
            <Route path='/merchant/wallet' element={<Wallet />} />
            <Route path='/merchant/chat' element={<Chat />} />
          </>
        )}

        {user_type === 'customer' && (
          <>
            <Route path='/' element={<Navigate to='/customer/dashboard' />} />
            <Route path='/customer/dashboard' element={<CustomerDashboard />} />
            <Route path='/customer/apply-visa' element={<CustomerNewVisaWrapper />} />
            <Route path='/customer/apply-insurance' element={<CustomerNewInsurance />} />
            <Route path='/customer/directinsurance' element={<CustomerDirectInsurance />} />
            <Route path='/customer/apply-hotel' element={<CustomerNewHotel />} />
            <Route path='/customer/apply-flight' element={<CustomerNewFlight />} />
          </>
        )}

        {user_type === 'super_admin' && (
          <>
            <Route path='/' element={<Navigate to='/superadmin/dashboard' />} />
            <Route path='/superadmin/dashboard' element={<DashboardWrapper />} />
            <Route path='/superadmin/users' element={<UserWrapper />} />
            <Route path='/superadmin/merchants' element={<MerchantWrapper />} />
            <Route path='/superadmin/add-new-merchant' element={<AddNewMerchant />} />

            <Route path='/superadmin/processed' element={<ProcessedWrapper />} />
            <Route path='/superadmin/in-process' element={<InProcessWrapper />} />
            <Route path='/superadmin/waiting-for-approval' element={<ApprovalWrapper />} />
            <Route path='/superadmin/rejected' element={<RejectedWrapper />} />

            <Route path='/superadmin/flight' element={<FlightWrapper />} />
            <Route path='/superadmin/hotel' element={<HotelWrapper />} />

            <Route path='/superadmin/visa247/processed' element={<UnderProcess />} />
            <Route path='/superadmin/visa247/in-process' element={<Inprocess />} />
            <Route path='/superadmin/visa247/waiting-for-approval' element={<Waiting />} />
            <Route path='/superadmin/visa247/rejected' element={<Reject />} />

            <Route path='/superadmin/insurance/processed' element={<Iprocessed />} />
            <Route path='/superadmin/insurance/waiting' element={<Iwaiting />} />
            <Route path='/superadmin/insurance/rejected' element={<Ireject />} />

            <Route path='/superadmin/hotel/processed' element={<Hprocessed />} />
            <Route path='/superadmin/hotel/waiting' element={<Hwaiting />} />
            <Route path='/superadmin/hotel/rejected' element={<Hreject />} />

            <Route path='/superadmin/flight/processed' element={<Fprocessed />} />
            <Route path='/superadmin/flight/waiting' element={<Fwaiting />} />
            <Route path='/superadmin/flight/rejected' element={<Freject />} />

            <Route path='/superadmin/wallet' element={<WalletWrapper />} />
            <Route path='/superadmin/report' element={<ReportWrapper />} />
            <Route path='/superadmin/revenue/visa' element={<RevenueWrapper />} />
            <Route path='/superadmin/revenue/insurance' element={<RevenueInsurance />} />
            <Route path='/superadmin/revenue/hotel' element={<RevenueHotel />} />
            <Route path='/superadmin/revenue/flight' element={<RevenueFlight />} />
            <Route path='/superadmin/insurance' element={<InsuranceWrapper />} />

            <Route path='/superadmin/insurance/manual' element={<InsuranceWrapper />} />
            <Route path='/superadmin/insurance/api' element={<InsuranceWrap />} />

            <Route path='/superadmin/testing' element={<TestingWrapper />} />
            <Route path='/builder' element={<BuilderPageWrapper />} />
            <Route path='/menu-test' element={<MenuTestPage />} />
            <Route path='/superadmin/issueApi' element={<IssueApiWrapper />} />
            <Route path='/superadmin/all-visas' element={<AllVisasWrapper />} />
            <Route path='/superadmin/apiSetting' element={<ApiSettingWrapper />} />
            <Route path='/superadmin/add-country' element={<AddCountryWrapper />} />

            <Route path='/superadmin/addInsurance' element={<AddInsurance />} />
            <Route path='/superadmin/addInsurance/manual' element={<AddInc />} />
            
            <Route path='/superadmin/apiPayment' element={<ApiPaymentWrapper />} />
            <Route path='/superadmin/apiMerchants' element={<ApiMerchantWrapper />} />
            <Route path='/superadmin/add-package' element={<AddPackageWrapper />} />
            <Route path='/superadmin/package-application' element={<PackageApplicationWrapper />} />
            <Route path='/superadmin/forgotPassword' element={<PasswordPage />} />
            <Route path='/superadmin/chat' element={<Chat />} />
            {/* Lazy Modules */}
            <Route
              path='/crafted/pages/profile/*'
              element={
                <SuspensedView>
                  <ProfilePage />
                </SuspensedView>
              }
            />
            <Route
              path='/crafted/pages/wizards/*'
              element={
                <SuspensedView>
                  <WizardsPage />
                </SuspensedView>
              }
            />
            <Route
              path='/crafted/widgets/*'
              element={
                <SuspensedView>
                  <WidgetsPage />
                </SuspensedView>
              }
            />
            <Route
              path='/crafted/account/*'
              element={
                <SuspensedView>
                  <AccountPage />
                </SuspensedView>
              }
            />

            <Route
              path='/apps/user-management/*'
              element={
                <SuspensedView>
                  <UsersPage />
                </SuspensedView>
              }
            />
          </>
        )}

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary');
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes };
