import {Navigate, Routes, Route, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {ProfileHeader} from './ProfileHeader'
import axiosInstance from '../../helpers/axiosInstance'
import Cookies from 'js-cookie'
import { ProfileDetails } from '../accounts/components/settings/cards/ProfileDetails'

const fetchData = async () => {
  try {
    const user_id = Cookies.get('user_id')

    // Make a POST request to your API endpoint
    axiosInstance.post('/backend/fetch_super_admin',{
      id:user_id
    })
      .then((response) => {
        const responseData = response.data.data;

        // Update the formData state with the fetched data
       
      })
      .catch((error) => {
        console.error('Error fetching Atlys data:', error);
      });


  } catch (error) {
    console.error('Error:', error);
  }
};

const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/crafted/pages/profile/overview',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const ProfilePage = () => (
  <Routes>
    <Route
      element={
        <>
          <ProfileHeader />
          <Outlet />
        </>
      }
    >
      <Route
        path='details'
        element={
          <>
            {/* <PageTitle breadcrumbs={profileBreadCrumbs}>Details</PageTitle> */}
            <ProfileDetails />
          </>
        }
      />
      <Route index element={<Navigate to='/crafted/pages/profile/details' />} />
    </Route>
  </Routes>
)

export default ProfilePage
