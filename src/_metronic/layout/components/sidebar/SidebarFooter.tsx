import React from 'react';
import Cookies from 'js-cookie'; // Import the library

const SidebarFooter = () => {
  const handleLogout = () => {
    Cookies.remove('isLoggedIn');
    document.location.reload()
  };

  return (
    <div className='app-sidebar-footer flex-column-auto pt-2 pb-6 px-6' id='kt_app_sidebar_footer'>
      <button
        onClick={handleLogout}
        className='btn btn-flex flex-center btn-custom btn-success overflow-hidden text-nowrap px-0 h-40px w-100'
        data-bs-toggle='tooltip'
        data-bs-trigger='hover'
        data-bs-dismiss='click'
        title='Logout'
      >
        <span className='btn-label'>Logout</span>
      </button>
    </div>
  );
};

export { SidebarFooter };
