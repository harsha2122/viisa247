import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HeaderWrapper } from './components/header';
import { RightToolbar } from '../partials/layout/RightToolbar';
import { ScrollTop } from './components/scroll-top';
import { Content } from './components/content';
import { FooterWrapper } from './components/footer';
import { Sidebar } from './components/sidebar';
import { ActivityDrawer, DrawerMessenger, InviteUsers, UpgradePlan } from '../partials';
import { PageDataProvider } from './core';
import { reInitMenu } from '../helpers';
import { ToolbarWrapper } from './components/toolbar';
import Cookies from 'js-cookie';

const MasterLayout = () => {
  const location = useLocation();
  const [formData2, setFormData2] = useState({
    issued_api: []
  });

  const user_type = Cookies.get('user_type');

  useEffect(() => {
    reInitMenu();
  }, [location.key]);

  const role = formData2.issued_api.length > 0 ? "Partner" : "Retailer";

  return (
    <PageDataProvider>
      <div className='d-flex flex-column flex-root app-root' id='kt_app_root'>
        <div className='app-page flex-column flex-column-fluid' id='kt_app_page'>
          <HeaderWrapper role={role} />
          <div className='app-wrapper flex-column flex-row-fluid' id='kt_app_wrapper'>
            {user_type === "super_admin" && <Sidebar />}
            <div className='app-main flex-column flex-row-fluid' style={{ height: '90vh' }}>
              <div className='d-flex flex-column flex-column-fluid'>
                <ToolbarWrapper />
                <Content>
                  <Outlet />
                </Content>
              </div>
              {/* <FooterWrapper /> */}
            </div>
          </div>
        </div>
      </div>

      {/* begin:: Drawers */}
      <ActivityDrawer />
      <RightToolbar />
      <DrawerMessenger />
      {/* end:: Drawers */}

      {/* begin:: Modals */}
      <InviteUsers />
      <UpgradePlan />
      {/* end:: Modals */}
      <ScrollTop />
    </PageDataProvider>
  );
}

export { MasterLayout };