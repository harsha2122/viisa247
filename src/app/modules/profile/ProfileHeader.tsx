/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Link, useLocation } from 'react-router-dom'
import { Dropdown1 } from '../../../_metronic/partials'
import Cookies from 'js-cookie'
import axiosInstance from '../../helpers/axiosInstance'
import moment from 'moment'

const ProfileHeader: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    super_admin_name: '',
    super_admin_email: '',
    super_admin_phone_number:"",
    super_admin_profile_photo:"",
    created_at:''
  });

  useEffect(() => {
    fetchData();
  }, [])
  const fetchData = async () => {
    try {
      const user_id = Cookies.get('user_id')

      // Make a POST request to your API endpoint
      axiosInstance.post('/backend/fetch_super_admin', {
        id: user_id
      })
        .then((response) => {
          const responseData = response.data.data;
          setFormData(responseData[0])
          // Update the formData state with the fetched data

        })
        .catch((error) => {
          console.error('Error fetching VISA 247 data:', error);
        });


    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div style={{boxShadow:"none", paddingLeft:"30px"}} className='card mb-5 mb-xl-10'>
      <div className='card-body pt-9 pb-0'>
        <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
          <div className='me-7 mb-4'>
            <div className='position-relative'>
              <img style={{width:"130px", height:"130px", borderRadius:"15px"}} src={formData.super_admin_profile_photo} alt='Profile pic' />
              <div className='position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
            </div>
          </div>

          <div className='flex-grow-1'>
            <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
              <div className='d-flex flex-column'>
                <div className='d-flex align-items-center mb-2'>
                  <a style={{textTransform:"capitalize"}} href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                    {formData.super_admin_name}
                  </a>
                </div>

                <div className='d-flex flex-column fs-4 mb-2 pe-2'>
                  {/* <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                  >
                    Punjab, India
                  </a> */}
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2'
                  >
                    {formData.super_admin_email}
                  </a>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-500 text-hover-primary mb-2'
                  >
                    Joined: {moment(formData.created_at).format('DD MMM YYYY')}
                  </a>
                </div>
              </div>

              {/* <div className='d-flex my-4'>
                <a href='#' className='btn btn-sm btn-light me-2' id='kt_user_follow_button'>
                  <KTIcon iconName='check' className='fs-3 d-none' />

                  <span className='indicator-label'>Follow</span>
                  <span className='indicator-progress'>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                </a>
                <a
                  href='#'
                  className='btn btn-sm btn-success me-3'
                  data-bs-toggle='modal'
                  data-bs-target='#kt_modal_offer_a_deal'
                >
                  Hire Me
                </a>
              </div> */}
            </div>

            <div className='d-flex flex-wrap flex-stack'>
              <div className='d-flex flex-column flex-grow-1 pe-8'>
                <div className='d-flex flex-wrap'>
                  {/* <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                    <div className='d-flex align-items-center'>
                      <div className='fs-2 fw-bolder'>75</div>
                    </div>

                    <div className='fw-bold fs-6 text-gray-400'>VISA Applied</div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className='d-flex overflow-auto h-55px'>
          <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
            {/* <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/crafted/pages/profile/overview' && 'active')
                }
                to='/crafted/pages/profile/overview'
              >
                Activities
              </Link>
            </li> */}
            {/* <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/crafted/pages/profile/projects' && 'active')
                }
                to='/crafted/pages/profile/projects'
              >
                Visa
              </Link>
            </li> */}
            {/* <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/crafted/pages/profile/campaigns' && 'active')
                }
                to='/crafted/pages/profile/campaigns'
              >
                Details
              </Link>
            </li> */}
            {/* <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/crafted/pages/profile/documents' && 'active')
                }
                to='/crafted/pages/profile/documents'
              >
                Documents
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/crafted/pages/profile/connections' && 'active')
                }
                to='/crafted/pages/profile/connections'
              >
                Connections
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  )
}

export { ProfileHeader }
