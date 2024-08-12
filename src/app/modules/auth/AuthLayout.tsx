import { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../_metronic/helpers';

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.style.height = '100%';
    }
    return () => {
      if (root) {
        root.style.height = 'auto';
      }
    };
  }, []);

  return (
    <div className='d-flex flex-column flex-lg-row-reverse flex-column-fluid h-100'>
      <div
        className='d-flex justify-content-center align-items-center flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2'
        style={{ backgroundImage: `url(${toAbsoluteUrl('/media/misc/bg.png')}`, 
                 height:"90%",
                 position:"relative",
                 top:"5%",
                 left:"3%",
                 borderRadius:"50px",
                 boxShadow:"6px 2px 16px 16px rgb(245 255 240 / 80%)"
                 
      }}
      >
      </div>
      <div
        className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1'
        style={{ overflowY: 'auto', maxHeight: '100vh' }}
      >
        <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
          <div className='w-lg-500px p-10'>
            <Outlet />
          </div>
        </div>
      </div>

      
    </div>
  );
};

export { AuthLayout };
