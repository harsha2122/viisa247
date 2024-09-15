/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {KTIcon} from '../../../../helpers'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'
import dashboard from '../../../../assets/icons/dashboards.svg'

const SidebarMenuMain = () => {
  const intl = useIntl()

  return (
    <>
      <SidebarMenuItem
        to='/superadmin/dashboard'
        icon={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill=''
            width='20'
            height='20'
            viewBox='0 0 24 24'
          >
            <path d='M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' />
          </svg>
        }
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />

      {/* <SidebarMenuItem
        to='/superadmin/customers'
        icon='element-11'
        title={'Customers'}
        fontIcon='bi-app-indicator'
      /> */}
      <div className='menu-item border-4'>
        <div className='menu-content py-4'>
          ────
          <span style={{fontWeight: '600'}} className='menu-section text-uppercase fs-7 ls-1'>
            {' '}
            Merchants{' '}
          </span>
          ────
        </div>
      </div>
      <SidebarMenuItem
        to='/superadmin/merchants'
        icon={
          <svg
            width='20'
            height='20'
            viewBox='-2.4 -2.4 28.80 28.80'
            fill=''
            xmlns='http://www.w3.org/2000/svg'
            stroke=''
          >
            <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
            <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
              {' '}
              <path
                d='M1.5 6.5C1.5 3.46243 3.96243 1 7 1C10.0376 1 12.5 3.46243 12.5 6.5C12.5 9.53757 10.0376 12 7 12C3.96243 12 1.5 9.53757 1.5 6.5Z'
                fill=''
              ></path>{' '}
              <path
                d='M14.4999 6.5C14.4999 8.00034 14.0593 9.39779 13.3005 10.57C14.2774 11.4585 15.5754 12 16.9999 12C20.0375 12 22.4999 9.53757 22.4999 6.5C22.4999 3.46243 20.0375 1 16.9999 1C15.5754 1 14.2774 1.54153 13.3005 2.42996C14.0593 3.60221 14.4999 4.99966 14.4999 6.5Z'
                fill=''
              ></path>{' '}
              <path
                d='M0 18C0 15.7909 1.79086 14 4 14H10C12.2091 14 14 15.7909 14 18V22C14 22.5523 13.5523 23 13 23H1C0.447716 23 0 22.5523 0 22V18Z'
                fill=''
              ></path>{' '}
              <path
                d='M16 18V23H23C23.5522 23 24 22.5523 24 22V18C24 15.7909 22.2091 14 20 14H14.4722C15.4222 15.0615 16 16.4633 16 18Z'
                fill=''
              ></path>{' '}
            </g>
          </svg>
        }
        title={'Retailers'}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/superadmin/issueApi'
        icon={
          <svg
            width='20'
            height='20'
            fill=''
            version='1.1'
            id='Capa_1'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 520.071 520.07'
            stroke='#fff'
          >
            <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
            <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
              {' '}
              <g>
                {' '}
                <g>
                  {' '}
                  <circle cx='98.16' cy='60.547' r='57.586'></circle>{' '}
                  <path d='M421.917,2.961c31.806,0,57.582,25.783,57.582,57.586s-25.776,57.585-57.582,57.585 c-31.807,0-57.589-25.783-57.589-57.585S390.11,2.961,421.917,2.961z'></path>{' '}
                  <path d='M465.129,112.109c-11.337,10.586-26.51,17.117-43.213,17.117c-16.71,0-31.877-6.537-43.214-17.117 c-24.554,6.481-44.083,25.318-51.583,49.414c-21.214-3.91-43.746-6.029-67.082-6.029c-23.338,0-45.867,2.119-67.081,6.029 c-7.498-24.096-27.036-42.933-51.58-49.414c-11.343,10.58-26.51,17.111-43.217,17.111c-16.704,0-31.874-6.531-43.213-17.111 C23.374,120.449,0,149.17,0,183.319v59.77l0.15,0.925l4.123,1.289c12.85,4.013,25.083,7.069,36.78,9.46 c-5.391,11.559-8.334,23.723-8.334,36.289c0,54.272,53.779,101.169,131.199,122.802c-2.858,7.838-4.445,16.278-4.445,25.098v59.77 l0.154,0.934l4.12,1.289c38.792,12.117,72.504,16.166,100.253,16.166c54.189,0,85.594-15.457,87.532-16.438l3.854-1.95h0.408 v-59.77c0-8.382-1.419-16.42-4.008-23.921c79.76-21.072,135.569-68.701,135.569-123.979c0-11.976-2.647-23.578-7.554-34.637 c22.26-4.604,34.803-10.767,36.003-11.378l3.859-1.954l0.408,0.006v-59.77C520.077,149.17,496.705,120.449,465.129,112.109z M471.649,291.052c0,48.965-52.15,91.149-126.62,109.728c-9.806-16.054-25.534-28.117-44.171-33.029 c-11.343,10.58-26.516,17.105-43.217,17.105c-16.698,0-31.874-6.525-43.216-17.105c-18.223,4.812-33.683,16.443-43.524,31.965 C98.65,380.623,48.433,339.101,48.433,291.052c0-11.597,2.976-22.798,8.426-33.407c17.396,2.707,33.337,3.824,47.665,3.824 c54.187,0,85.597-15.451,87.532-16.432l3.854-1.954l0.414,0.006v-59.775c0-2.187-0.104-4.359-0.292-6.496 c20.206-3.644,41.704-5.621,64.007-5.621c22.308,0,43.811,1.977,64.014,5.621c-0.188,2.143-0.295,4.309-0.295,6.502v59.77 l0.153,0.931l4.126,1.289c38.786,12.111,72.501,16.16,100.24,16.16c13.312,0,25.222-0.928,35.684-2.358 C468.936,269.288,471.649,279.986,471.649,291.052z'></path>{' '}
                  <circle cx='257.641' cy='316.185' r='57.583'></circle>{' '}
                </g>{' '}
              </g>{' '}
            </g>
          </svg>
        }
        title={'Partners'}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/superadmin/users'
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 7.5C15.5 9.433 13.933 11 12 11C10.067 11 8.5 9.433 8.5 7.5C8.5 5.567 10.067 4 12 4C13.933 4 15.5 5.567 15.5 7.5Z"/>
          <path d="M18 16.5C18 18.433 15.3137 20 12 20C8.68629 20 6 18.433 6 16.5C6 14.567 8.68629 13 12 13C15.3137 13 18 14.567 18 16.5Z"/>
          <path d="M7.12205 5C7.29951 5 7.47276 5.01741 7.64005 5.05056C7.23249 5.77446 7 6.61008 7 7.5C7 8.36825 7.22131 9.18482 7.61059 9.89636C7.45245 9.92583 7.28912 9.94126 7.12205 9.94126C5.70763 9.94126 4.56102 8.83512 4.56102 7.47063C4.56102 6.10614 5.70763 5 7.12205 5Z"/>
          <path d="M5.44734 18.986C4.87942 18.3071 4.5 17.474 4.5 16.5C4.5 15.5558 4.85657 14.744 5.39578 14.0767C3.4911 14.2245 2 15.2662 2 16.5294C2 17.8044 3.5173 18.8538 5.44734 18.986Z"/>
          <path d="M16.9999 7.5C16.9999 8.36825 16.7786 9.18482 16.3893 9.89636C16.5475 9.92583 16.7108 9.94126 16.8779 9.94126C18.2923 9.94126 19.4389 8.83512 19.4389 7.47063C19.4389 6.10614 18.2923 5 16.8779 5C16.7004 5 16.5272 5.01741 16.3599 5.05056C16.7674 5.77446 16.9999 6.61008 16.9999 7.5Z"/>
          <path d="M18.5526 18.986C20.4826 18.8538 21.9999 17.8044 21.9999 16.5294C21.9999 15.2662 20.5088 14.2245 18.6041 14.0767C19.1433 14.744 19.4999 15.5558 19.4999 16.5C19.4999 17.474 19.1205 18.3071 18.5526 18.986Z"/>
          </svg>
        }
        title={'Users'}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/superadmin/testing'
        icon={
          <svg
            width='20'
            height='20'
            xmlns='http://www.w3.org/2000/svg'
            fill=''
            viewBox='0 0 24 24'
            stroke=''
          >
            <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
            <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
              <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z'></path>
            </g>
          </svg>
        }
        title={'Testing (Sandbox)'}
        fontIcon='bi-app-indicator'
      />
      {/* <SidebarMenuItem to='/builder' icon='switch' title='Layout Builder' fontIcon='bi-layers' /> */}
      <div className='menu-item'>
        <div className='menu-content py-4'>
          ───
          <span style={{fontWeight: '600'}} className='menu-section text-uppercase fs-7 ls-1'>
            {' '}
            Application{' '}
          </span>
          ───
        </div>
      </div>
      {/* <SidebarMenuItem
        to='/apply-visa'
        icon=''
        title={'Create New VISA'}
        fontIcon='bi-app-indicator'
      /> */}
      <SidebarMenuItemWithSub 
        to="/your-path"
        title="Atlys"
        icon={<svg width="23" height="23" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet"><path d="M28.216 35.543h7.431l-3.666-11.418z" fill="rgb(119, 186, 123)"></path><path d="M32 2C15.432 2 2 15.431 2 32c0 16.569 13.432 30 30 30s30-13.432 30-30C62 15.431 48.568 2 32 2m7.167 44.508l-1.914-5.965H26.567L24.6 46.508h-6.342l10.358-29.016h6.859l10.266 29.016h-6.574" fill="rgb(119, 186, 123)"></path></svg>}
        hasBullet={false}
      >
      <SidebarMenuItem
        to='/superadmin/processed'
        title={'Issued'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      <SidebarMenuItem
        to='/superadmin/waiting-for-approval'
        title={'In Process'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      <SidebarMenuItem
        to='/superadmin/rejected'
        title={'Rejected'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub 
        to="/your-path"
        title="Visa247"
        icon={<svg width="23" height="23" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet"><path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2m2.824 44.508h-5.728l-9.813-29.016h6.476l6.3 22.027l6.358-22.027h6.299l-9.892 29.016" fill="rgb(119, 186, 123)"></path></svg>}
        hasBullet={false}
      >
      <SidebarMenuItem
        to='superadmin/visa247/processed'
        title={'Issued'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      <SidebarMenuItem
        to='superadmin/visa247/waiting-for-approval'
        title={'In Process'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      <SidebarMenuItem
        to='superadmin/visa247/rejected'
        title={'Rejected'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub 
        to="/your-path"
        title="Insurance"
        icon={<svg width="23" height="23" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--emojione-monotone" preserveAspectRatio="xMidYMid meet"><path d="M32 2C15.432 2 2 15.431 2 32c0 16.569 13.432 30 30 30s30-13.432 30-30C62 15.431 48.568 2 32 2m3.012 44.508h-6.023V17.492h6.023v29.016" fill="rgb(119, 186, 123)"></path></svg>}
        hasBullet={false}
      >
      <SidebarMenuItem
        to='superadmin/insurance/processed'
        title={'Issued'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      <SidebarMenuItem
        to='superadmin/insurance/waiting'
        title={'In Process'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      <SidebarMenuItem
        to='superadmin/insurance/rejected'
        title={'Rejected'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub 
        to="/your-path"
        title="Hotel"
        icon={<svg width="23" height="23" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--emojione-monotone" preserveAspectRatio="xMidYMid meet"><path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2zm11.664 44.508h-6.023V33.555h-11.28v12.953h-6.025V17.492h6.025v11.063H37.64V17.492h6.023v29.016z" fill="rgb(119, 186, 123)"></path></svg>}
        hasBullet={false}
      >
      <SidebarMenuItem
        to='superadmin/hotel/processed'
        title={'Issued'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      <SidebarMenuItem
        to='superadmin/hotel/waiting'
        title={'In Process'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      <SidebarMenuItem
        to='superadmin/hotel/rejected'
        title={'Rejected'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub 
        to="/your-path"
        title="Flight"
        icon={<svg width="23" height="23" fill="rgb(119, 186, 123)" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--emojione-monotone" preserveAspectRatio="xMidYMid meet"><path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2zm10.345 20.61H27.68v6.673h12.854v5.039H27.68v12.166h-6.024V17.512h20.689v5.098z"></path></svg>}
        hasBullet={false}
      >
      <SidebarMenuItem
        to='superadmin/flight/processed'
        title={'Issued'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      <SidebarMenuItem
        to='superadmin/flight/waiting'
        title={'In Process'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      <SidebarMenuItem
        to='superadmin/flight/rejected'
        title={'Rejected'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />
      </SidebarMenuItemWithSub>


      <SidebarMenuItem
        to='/superadmin/package-application'
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.58579 2.58579C3 3.17157 3 4.11438 3 6V16C3 18.8284 3 20.2426 3.87868 21.1213C4.51998 21.7626 5.44655 21.9359 7 21.9827V19C7 18.4477 7.44772 18 8 18C8.55228 18 9 18.4477 9 19L9 22H15V19C15 18.4477 15.4477 18 16 18C16.5523 18 17 18.4477 17 19L17 21.9827C18.5534 21.9359 19.48 21.7626 20.1213 21.1213C21 20.2426 21 18.8284 21 16V6C21 4.11438 21 3.17157 20.4142 2.58579C19.8284 2 18.8856 2 17 2H7C5.11438 2 4.17157 2 3.58579 2.58579ZM8 8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10H16C16.5523 10 17 9.55228 17 9C17 8.44772 16.5523 8 16 8H8ZM8 14L16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12L8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" />
          </svg>
        }
        title={'Package'}
        fontIcon='bi-app-indicator'
      />

      <div className='menu-item'>
        <div className='menu-content py-4'>
          ───
          <span style={{fontWeight: '600'}} className='menu-section text-uppercase fs-7 ls-1'>
            {' '}
            Reports{' '}
          </span>
          ───
        </div>
      </div>
      <SidebarMenuItemWithSub 
        to="/your-path"
        title="Revenue"
        icon={
          <svg
            height='20'
            width='20'
            version='1.1'
            id='Capa_1'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 612 612'
            fill="rgb(119, 186, 123)"
          >
            <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
            <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
              {' '}
              <g>
                {' '}
                <g>
                  {' '}
                  <path d='M306,0C137.002,0,0,137.002,0,306s137.002,306,306,306s306-137.002,306-306S474.998,0,306,0z M562.116,323.16 l19.511,19.021c3.189,3.103,2.375,8.421-1.597,10.435l-24.315,12.307c-3.482,1.769-4.633,6.193-2.436,9.425l15.282,22.564 c2.491,3.684,0.63,8.727-3.672,9.896l-26.285,7.167c-3.77,1.022-5.783,5.129-4.29,8.745l10.429,25.165 c1.701,4.113-1.144,8.678-5.581,8.96l-27.191,1.726c-3.905,0.245-6.701,3.862-5.961,7.699l5.147,26.757 c0.838,4.37-2.87,8.274-7.271,7.65l-26.983-3.782c-3.874-0.545-7.338,2.43-7.387,6.34l-0.355,27.246 c-0.055,4.449-4.468,7.521-8.666,6.028l-25.661-9.137c-3.678-1.31-7.681,0.906-8.519,4.725l-5.82,26.616 c-0.949,4.345-5.9,6.469-9.7,4.168l-23.305-14.125c-3.348-2.026-7.711-0.649-9.296,2.919l-11.065,24.896 c-1.805,4.07-7.075,5.153-10.337,2.13l-19.988-18.519c-2.864-2.656-7.411-2.191-9.688,0.985l-15.845,22.161 c-2.589,3.623-7.968,3.623-10.557,0l-15.851-22.161c-2.271-3.182-6.818-3.641-9.688-0.985l-19.988,18.519 c-3.262,3.023-8.537,1.94-10.337-2.13l-11.059-24.896c-1.591-3.568-5.955-4.945-9.296-2.919l-23.305,14.125 c-3.807,2.301-8.752,0.177-9.7-4.168l-5.826-26.616c-0.832-3.819-4.829-6.034-8.513-4.725l-25.667,9.137 c-4.186,1.493-8.605-1.585-8.666-6.028l-0.343-27.246c-0.055-3.911-3.519-6.885-7.393-6.34l-26.977,3.782 c-4.413,0.624-8.115-3.28-7.271-7.65l5.147-26.757c0.734-3.837-2.062-7.454-5.961-7.699l-27.191-1.726 c-4.443-0.282-7.283-4.847-5.581-8.96l10.422-25.165c1.493-3.617-0.514-7.723-4.284-8.745l-26.292-7.167 c-4.29-1.169-6.163-6.218-3.666-9.896l15.276-22.564c2.191-3.231,1.047-7.656-2.436-9.425l-24.309-12.307 c-3.966-2.013-4.786-7.332-1.603-10.435l19.511-19.021c2.803-2.723,2.57-7.289-0.49-9.725l-21.328-16.952 c-3.482-2.766-3.213-8.14,0.532-10.545l22.95-14.7c3.286-2.111,3.978-6.628,1.475-9.627l-17.491-20.894 c-2.852-3.415-1.506-8.623,2.65-10.22l25.429-9.786c3.648-1.401,5.233-5.698,3.384-9.131l-12.919-23.99 c-2.111-3.917,0.257-8.752,4.651-9.48l26.879-4.461c3.856-0.636,6.273-4.517,5.153-8.268l-7.827-26.102 c-1.279-4.26,2.013-8.519,6.463-8.342l27.228,1.034c3.905,0.147,7.05-3.17,6.708-7.056l-2.411-27.142 c-0.392-4.437,3.69-7.938,8.011-6.879l26.457,6.493c3.794,0.93,7.546-1.677,7.999-5.563l3.097-27.069 c0.508-4.419,5.208-7.026,9.235-5.122l24.615,11.689c3.525,1.671,7.73-0.129,8.947-3.843l8.488-25.894 c1.383-4.223,6.512-5.838,10.074-3.164l21.757,16.408c3.121,2.35,7.595,1.426,9.541-1.958l13.525-23.654 c2.203-3.862,7.558-4.406,10.502-1.071l18.005,20.453c2.583,2.931,7.154,2.931,9.737,0l18.011-20.453 c2.938-3.335,8.286-2.791,10.502,1.071l13.519,23.654c1.94,3.39,6.42,4.308,9.541,1.958l21.757-16.408 c3.556-2.681,8.69-1.065,10.074,3.164l8.482,25.894c1.218,3.715,5.422,5.514,8.954,3.843l24.609-11.689 c4.015-1.903,8.721,0.704,9.229,5.122l3.103,27.069c0.441,3.886,4.198,6.499,7.993,5.563l26.463-6.493 c4.321-1.059,8.403,2.442,8.011,6.879l-2.411,27.142c-0.349,3.892,2.803,7.209,6.714,7.056l27.222-1.034 c4.449-0.171,7.742,4.082,6.463,8.342l-7.821,26.102c-1.126,3.745,1.291,7.626,5.153,8.268l26.879,4.461 c4.388,0.728,6.763,5.563,4.651,9.48l-12.919,23.99c-1.854,3.439-0.269,7.73,3.384,9.131l25.422,9.786 c4.156,1.597,5.502,6.805,2.65,10.22l-17.479,20.894c-2.509,2.999-1.818,7.521,1.469,9.627l22.938,14.7 c3.745,2.405,4.021,7.779,0.539,10.545l-21.328,16.952C559.552,315.865,559.319,320.431,562.116,323.16z'></path>{' '}
                  <path d='M351.888,344.911c-5.337-3.752-13.507-6.591-24.517-8.525v49.303c21.671-2.791,32.516-10.839,32.516-24.125 C359.887,354.226,357.218,348.681,351.888,344.911z'></path>{' '}
                  <path d='M251.85,252.744c0,7.344,2.791,12.944,8.391,16.781c5.588,3.849,14.07,6.818,25.435,8.917v-50.349 c-12.766,1.401-21.597,4.241-26.487,8.525C254.292,240.902,251.85,246.275,251.85,252.744z'></path>{' '}
                  <path d='M306,76.5C179.249,76.5,76.5,179.249,76.5,306S179.249,535.5,306,535.5c126.745,0,229.5-102.749,229.5-229.5 S432.745,76.5,306,76.5z M394.104,413.229c-15.649,12.766-37.889,20.716-66.732,23.856v27.014h-41.689V438.4 c-17.142-0.526-33.262-2.056-48.385-4.59c-15.123-2.534-27.662-6.071-37.626-10.618v-51.39c6.818,2.448,13.458,4.59,19.933,6.42 c6.463,1.842,13.109,3.415,19.933,4.719c6.812,1.316,13.978,2.368,21.5,3.152c7.509,0.783,15.735,1.273,24.651,1.438v-57.424 c-11.022-1.579-21.946-3.715-32.779-6.432c-10.839-2.699-20.588-6.763-29.235-12.191c-8.654-5.416-15.692-12.589-21.108-21.506 c-5.422-8.911-8.127-20.453-8.127-34.609c0-11.542,2.099-21.806,6.291-30.808c4.198-9.003,10.227-16.781,18.091-23.342 c7.87-6.555,17.442-11.836,28.715-15.869c11.273-4.015,23.99-6.812,38.152-8.391v-27.001h41.696v26.218 c12.754,0.698,25.735,2.148,38.935,4.327c13.195,2.185,25.306,5.208,36.322,9.045v51.922 c-26.922-8.739-52.014-13.641-75.258-14.682v58.213c11.01,1.75,21.891,4.064,32.644,6.952 c10.753,2.883,20.361,7.075,28.844,12.589c8.476,5.502,15.386,12.717,20.716,21.634c5.331,8.911,7.999,20.367,7.999,34.345 C417.568,382.898,409.746,400.468,394.104,413.229z'></path>{' '}
                </g>{' '}
              </g>{' '}
            </g>
          </svg>
        }
        hasBullet={false}
      >
      <SidebarMenuItem
        to='/superadmin/revenue/visa'
        title={'Visa'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />

      <SidebarMenuItem
        to='/superadmin/revenue/insurance'
        title={'Insurance'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />

      <SidebarMenuItem
        to='/superadmin/revenue/hotel'
        title={'Hotel'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />

      <SidebarMenuItem
        to='/superadmin/revenue/flight'
        title={'Flight'}
        fontIcon='bi-app-indicator'
        hasBullet={true}
      />

      </SidebarMenuItemWithSub>
      <SidebarMenuItem
        to='/superadmin/wallet'
        icon={
          <svg
            width='20'
            height='20'
            viewBox='-1.5 0 33 33'
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            fill=''
          >
            <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
            <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
              {' '}
              <g id='Page-1' stroke='' stroke-width='1' fill='' fill-rule='evenodd'>
                {' '}
                <g id='Icon-Set-Filled' transform='translate(-259.000000, -776.000000)' fill=''>
                  {' '}
                  <path
                    d='M283,799 L289,799 L289,797 L283,797 L283,799 Z M287,787 L259,787 L259,807 C259,808.104 259.896,809 261,809 L287,809 C288.104,809 289,808.104 289,807 L289,801 L282,801 C281.448,801 281,800.553 281,800 L281,796 C281,795.448 281.448,795 282,795 L289,795 L289,789 C289,787.896 288.104,787 287,787 L287,787 Z M287,778 C287,777.447 286.764,777.141 286.25,776.938 C285.854,776.781 285.469,776.875 285,777 L259,785 L287,785 L287,778 L287,778 Z'
                    id='wallet'
                  >
                    {' '}
                  </path>{' '}
                </g>{' '}
              </g>{' '}
            </g>
          </svg>
        }
        title={'Wallet'}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/superadmin/report'
        icon={
          <svg
            height='20'
            width='20'
            version='1.1'
            id='Layer_1'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 512 512'
          >
            <g transform='translate(0 -1)'>
              <g>
                <g>
                  <path d='M503.467,478.867h-8.533v-8.533c0-4.719-3.823-8.533-8.533-8.533s-8.533,3.814-8.533,8.533v8.533h-25.6v-8.533 c0-4.719-3.823-8.533-8.533-8.533s-8.533,3.814-8.533,8.533v8.533h-25.6v-8.533c0-4.719-3.823-8.533-8.533-8.533 s-8.533,3.814-8.533,8.533v8.533h-25.6v-8.533c0-4.719-3.823-8.533-8.533-8.533s-8.533,3.814-8.533,8.533v8.533h-25.6v-8.533 c0-4.719-3.823-8.533-8.533-8.533s-8.533,3.814-8.533,8.533v8.533h-25.6v-8.533c0-4.719-3.823-8.533-8.533-8.533 c-4.71,0-8.533,3.814-8.533,8.533v8.533h-25.6v-8.533c0-4.719-3.823-8.533-8.533-8.533s-8.533,3.814-8.533,8.533v8.533h-25.6 v-8.533c0-4.719-3.823-8.533-8.533-8.533s-8.533,3.814-8.533,8.533v8.533h-25.6v-8.533c0-4.719-3.823-8.533-8.533-8.533 c-4.71,0-8.533,3.814-8.533,8.533v8.533h-25.6v-8.533c0-4.719-3.823-8.533-8.533-8.533c-4.71,0-8.533,3.814-8.533,8.533v8.533 h-25.6v-8.533c0-4.719-3.823-8.533-8.533-8.533s-8.533,3.814-8.533,8.533v8.533H34.133v-51.2h8.533 c4.71,0,8.533-3.814,8.533-8.533s-3.823-8.533-8.533-8.533h-8.533V385h8.533c4.71,0,8.533-3.814,8.533-8.533 s-3.823-8.533-8.533-8.533h-8.533v-25.6h8.533c4.71,0,8.533-3.814,8.533-8.533s-3.823-8.533-8.533-8.533h-8.533v-25.6h8.533 c4.71,0,8.533-3.814,8.533-8.533c0-4.719-3.823-8.533-8.533-8.533h-8.533V257h8.533c4.71,0,8.533-3.814,8.533-8.533 s-3.823-8.533-8.533-8.533h-8.533v-25.6h8.533c4.71,0,8.533-3.814,8.533-8.533s-3.823-8.533-8.533-8.533h-8.533v-25.6h8.533 c4.71,0,8.533-3.814,8.533-8.533s-3.823-8.533-8.533-8.533h-8.533V129h8.533c4.71,0,8.533-3.814,8.533-8.533 s-3.823-8.533-8.533-8.533h-8.533v-25.6h8.533c4.71,0,8.533-3.814,8.533-8.533s-3.823-8.533-8.533-8.533h-8.533v-25.6h8.533 c4.71,0,8.533-3.814,8.533-8.533S47.377,26.6,42.667,26.6h-8.533V9.533C34.133,4.814,30.31,1,25.6,1 c-4.71,0-8.533,3.814-8.533,8.533V26.6H8.533C3.823,26.6,0,30.414,0,35.133s3.823,8.533,8.533,8.533h8.533v25.6H8.533 C3.823,69.267,0,73.081,0,77.8s3.823,8.533,8.533,8.533h8.533v25.6H8.533c-4.71,0-8.533,3.814-8.533,8.533S3.823,129,8.533,129 h8.533v25.6H8.533c-4.71,0-8.533,3.814-8.533,8.533s3.823,8.533,8.533,8.533h8.533v25.6H8.533c-4.71,0-8.533,3.814-8.533,8.533 s3.823,8.533,8.533,8.533h8.533v25.6H8.533c-4.71,0-8.533,3.814-8.533,8.533S3.823,257,8.533,257h8.533v25.6H8.533 c-4.71,0-8.533,3.814-8.533,8.533c0,4.719,3.823,8.533,8.533,8.533h8.533v25.6H8.533c-4.71,0-8.533,3.814-8.533,8.533 s3.823,8.533,8.533,8.533h8.533v25.6H8.533c-4.71,0-8.533,3.814-8.533,8.533S3.823,385,8.533,385h8.533v25.6H8.533 c-4.71,0-8.533,3.814-8.533,8.533s3.823,8.533,8.533,8.533h8.533v25.6H8.533c-4.71,0-8.533,3.814-8.533,8.533 c0,4.719,3.823,8.533,8.533,8.533h8.533V487.4c0,4.719,3.823,8.533,8.533,8.533h25.6v8.533c0,4.719,3.823,8.533,8.533,8.533 s8.533-3.814,8.533-8.533v-8.533h25.6v8.533c0,4.719,3.823,8.533,8.533,8.533c4.71,0,8.533-3.814,8.533-8.533v-8.533h25.6v8.533 c0,4.719,3.823,8.533,8.533,8.533c4.71,0,8.533-3.814,8.533-8.533v-8.533h25.6v8.533c0,4.719,3.823,8.533,8.533,8.533 s8.533-3.814,8.533-8.533v-8.533h25.6v8.533c0,4.719,3.823,8.533,8.533,8.533s8.533-3.814,8.533-8.533v-8.533h25.6v8.533 c0,4.719,3.823,8.533,8.533,8.533c4.71,0,8.533-3.814,8.533-8.533v-8.533h25.6v8.533c0,4.719,3.823,8.533,8.533,8.533 s8.533-3.814,8.533-8.533v-8.533h25.6v8.533c0,4.719,3.823,8.533,8.533,8.533s8.533-3.814,8.533-8.533v-8.533h25.6v8.533 c0,4.719,3.823,8.533,8.533,8.533s8.533-3.814,8.533-8.533v-8.533h25.6v8.533c0,4.719,3.823,8.533,8.533,8.533 s8.533-3.814,8.533-8.533v-8.533h25.6v8.533c0,4.719,3.823,8.533,8.533,8.533s8.533-3.814,8.533-8.533v-8.533h8.533 c4.71,0,8.533-3.814,8.533-8.533S508.177,478.867,503.467,478.867z' />{' '}
                  <path d='M281.6,96.467v-54.4c0-8.525-6.938-15.471-15.462-15.471H76.8v85.333h189.338 C274.662,111.929,281.6,104.991,281.6,96.467z' />{' '}
                  <path d='M435.2,207.4V153c0-8.525-6.938-15.471-15.462-15.471H76.8v85.333h342.938C428.262,222.862,435.2,215.925,435.2,207.4z' />{' '}
                  <path d='M366.933,318.333v-54.4c0-8.525-6.938-15.471-15.462-15.471H76.8v85.333h274.671 C359.996,333.796,366.933,326.858,366.933,318.333z' />{' '}
                  <path d='M494.933,429.267v-54.4c0-8.525-6.938-15.471-15.462-15.471H76.8v85.333h402.671 C487.996,444.729,494.933,437.792,494.933,429.267z' />{' '}
                  <path d='M460.8,35.133h42.667c4.71,0,8.533-3.814,8.533-8.533s-3.823-8.533-8.533-8.533H460.8c-4.71,0-8.533,3.814-8.533,8.533 S456.09,35.133,460.8,35.133z' />{' '}
                  <path d='M418.133,35.133h8.533c4.71,0,8.533-3.814,8.533-8.533s-3.823-8.533-8.533-8.533h-8.533c-4.71,0-8.533,3.814-8.533,8.533 S413.423,35.133,418.133,35.133z' />{' '}
                  <path d='M418.133,69.267h34.133c4.71,0,8.533-3.814,8.533-8.533s-3.823-8.533-8.533-8.533h-34.133 c-4.71,0-8.533,3.814-8.533,8.533S413.423,69.267,418.133,69.267z' />{' '}
                  <path d='M503.467,52.2H486.4c-4.71,0-8.533,3.814-8.533,8.533s3.823,8.533,8.533,8.533h17.067c4.71,0,8.533-3.814,8.533-8.533 S508.177,52.2,503.467,52.2z' />{' '}
                </g>{' '}
              </g>{' '}
            </g>{' '}
          </svg>
        }
        title={'Wallet Report'}
        fontIcon='bi-app-indicator'
      />
      {/* <SidebarMenuItem
        to='/superadmin/apiPayment'
        icon=''
        title={'Api Payment'}
        fontIcon='bi-app-indicator'
      /> */}
      <div className='menu-item'>
        <div className='menu-content py-4'>
          ─────
          <span style={{fontWeight: '600'}} className='menu-section text-uppercase fs-7 ls-1'>
            {' '}
            Settings{' '}
          </span>
          ─────
        </div>
      </div>
      <SidebarMenuItem
        to='/superadmin/apisetting'
        icon={
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill=''
            xmlns='http://www.w3.org/2000/svg'
          >
            <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
            <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
              {' '}
              <path
                d='M20.1 9.2214C18.29 9.2214 17.55 7.9414 18.45 6.3714C18.97 5.4614 18.66 4.3014 17.75 3.7814L16.02 2.7914C15.23 2.3214 14.21 2.6014 13.74 3.3914L13.63 3.5814C12.73 5.1514 11.25 5.1514 10.34 3.5814L10.23 3.3914C9.78 2.6014 8.76 2.3214 7.97 2.7914L6.24 3.7814C5.33 4.3014 5.02 5.4714 5.54 6.3814C6.45 7.9414 5.71 9.2214 3.9 9.2214C2.86 9.2214 2 10.0714 2 11.1214V12.8814C2 13.9214 2.85 14.7814 3.9 14.7814C5.71 14.7814 6.45 16.0614 5.54 17.6314C5.02 18.5414 5.33 19.7014 6.24 20.2214L7.97 21.2114C8.76 21.6814 9.78 21.4014 10.25 20.6114L10.36 20.4214C11.26 18.8514 12.74 18.8514 13.65 20.4214L13.76 20.6114C14.23 21.4014 15.25 21.6814 16.04 21.2114L17.77 20.2214C18.68 19.7014 18.99 18.5314 18.47 17.6314C17.56 16.0614 18.3 14.7814 20.11 14.7814C21.15 14.7814 22.01 13.9314 22.01 12.8814V11.1214C22 10.0814 21.15 9.2214 20.1 9.2214ZM12 15.2514C10.21 15.2514 8.75 13.7914 8.75 12.0014C8.75 10.2114 10.21 8.7514 12 8.7514C13.79 8.7514 15.25 10.2114 15.25 12.0014C15.25 13.7914 13.79 15.2514 12 15.2514Z'
                fill=''
              ></path>{' '}
            </g>
          </svg>
        }
        title={'API Settings'}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/superadmin/all-visas'
        icon={
          <svg fill="" version="1.1" id="Capa_1" 
	          width="20" height="20" viewBox="0 0 47 47">
            <g>
              <g id="Layer_1_22_">
                <g>
                  <path d="M6.12,38.52V5.136h26.962v28.037l5.137-4.243V2.568C38.219,1.15,37.07,0,35.652,0h-32.1C2.134,0,0.985,1.15,0.985,2.568
                    v38.519c0,1.418,1.149,2.568,2.567,2.568h22.408L22.33,38.52H6.12z"/>
                  <path d="M45.613,27.609c-0.473-0.446-1.2-0.467-1.698-0.057l-11.778,9.734l-7.849-4.709c-0.521-0.312-1.188-0.219-1.603,0.229
                    c-0.412,0.444-0.457,1.117-0.106,1.613l8.506,12.037c0.238,0.337,0.625,0.539,1.037,0.543c0.004,0,0.008,0,0.012,0
                    c0.408,0,0.793-0.193,1.035-0.525l12.6-17.173C46.149,28.78,46.084,28.055,45.613,27.609z"/>
                  <path d="M27.306,8.988H11.897c-1.418,0-2.567,1.15-2.567,2.568s1.149,2.568,2.567,2.568h15.408c1.418,0,2.566-1.15,2.566-2.568
                    S28.724,8.988,27.306,8.988z"/>
                  <path d="M27.306,16.691H11.897c-1.418,0-2.567,1.15-2.567,2.568s1.149,2.568,2.567,2.568h15.408c1.418,0,2.566-1.149,2.566-2.568
                    C29.874,17.841,28.724,16.691,27.306,16.691z"/>
                  <path d="M27.306,24.395H11.897c-1.418,0-2.567,1.15-2.567,2.568s1.149,2.568,2.567,2.568h15.408c1.418,0,2.566-1.15,2.566-2.568
                    C29.874,25.545,28.724,24.395,27.306,24.395z"/>
                </g>
              </g>
            </g>
          </svg>
        }
        title={'All Visas'}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/superadmin/add-package'
        icon={
        <svg height="18" width="18" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  
          viewBox="0 0 512 512">
        <g>
          <g>
            <g>
              <path d="M211.814,0v190.645l37.46-20.851c4.181-2.329,9.27-2.329,13.452,0l37.461,20.851V0H211.814z"/>
              <polygon points="211.814,190.646 211.814,190.645 211.813,190.646 			"/>
            </g>
          </g>
        </g>
        <g>
          <g>
            <path d="M498.17,0H327.847v214.171c0,4.903-2.596,9.438-6.822,11.923c-2.162,1.27-4.583,1.907-7.008,1.907
              c-2.317,0-4.634-0.581-6.726-1.747l-51.291-28.551l-51.291,28.551c-4.282,2.387-9.507,2.326-13.734-0.16
              c-4.226-2.485-6.822-7.02-6.822-11.923V0H13.83C6.193,0,0,6.193,0,13.83v406.057L92.113,512h327.775L512,419.887V13.83
              C512,6.193,505.807,0,498.17,0z"/>
          </g>
        </g>
        <g>
          <g>
            <path d="M459.006,512h39.164c7.637,0,13.83-6.193,13.83-13.83v-39.164L459.006,512z"/>
          </g>
        </g>
        <g>
          <g>
            <path d="M0,459.006v39.164C0,505.807,6.193,512,13.83,512h39.164L0,459.006z"/>
          </g>
        </g>
        </svg>
        }
        title={'Packages'}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/superadmin/insurance'
        icon={

          <svg height="20" width="20" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 229.5 229.5"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M214.419,32.12c-0.412-2.959-2.541-5.393-5.419-6.193L116.76,0.275c-1.315-0.366-2.704-0.366-4.02,0L20.5,25.927 c-2.878,0.8-5.007,3.233-5.419,6.193c-0.535,3.847-12.74,94.743,18.565,139.961c31.268,45.164,77.395,56.738,79.343,57.209 c0.579,0.14,1.169,0.209,1.761,0.209s1.182-0.07,1.761-0.209c1.949-0.471,48.076-12.045,79.343-57.209 C227.159,126.864,214.954,35.968,214.419,32.12z M174.233,85.186l-62.917,62.917c-1.464,1.464-3.384,2.197-5.303,2.197 s-3.839-0.732-5.303-2.197l-38.901-38.901c-1.407-1.406-2.197-3.314-2.197-5.303s0.791-3.897,2.197-5.303l7.724-7.724 c2.929-2.928,7.678-2.929,10.606,0l25.874,25.874l49.89-49.891c1.406-1.407,3.314-2.197,5.303-2.197s3.897,0.79,5.303,2.197 l7.724,7.724C177.162,77.508,177.162,82.257,174.233,85.186z"></path> </g></svg>

        }
        title={'Insurance'}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/superadmin/flight'
        icon={
          <svg width="20" height="20" viewBox="-2.5 0 19 19" xmlns="http://www.w3.org/2000/svg" className="cf-icon-svg"><path d="M12.382 5.304 10.096 7.59l.006.02L11.838 14a.908.908 0 0 1-.211.794l-.573.573a.339.339 0 0 1-.566-.08l-2.348-4.25-.745-.746-1.97 1.97a3.311 3.311 0 0 1-.75.504l.44 1.447a.875.875 0 0 1-.199.79l-.175.176a.477.477 0 0 1-.672 0l-1.04-1.039-.018-.02-.788-.786-.02-.02-1.038-1.039a.477.477 0 0 1 0-.672l.176-.176a.875.875 0 0 1 .79-.197l1.447.438a3.322 3.322 0 0 1 .504-.75l1.97-1.97-.746-.744-4.25-2.348a.339.339 0 0 1-.08-.566l.573-.573a.909.909 0 0 1 .794-.211l6.39 1.736.02.006 2.286-2.286c.37-.372 1.621-1.02 1.993-.65.37.372-.279 1.622-.65 1.993z"/></svg>
        }
        title={'Flight'}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/superadmin/hotel'
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2,7V21a1,1,0,0,0,1,1H13V6H3A1,1,0,0,0,2,7ZM5,9h5v2H5Zm0,4h5v2H5Zm0,4h5v2H5ZM22,3V21a1,1,0,0,1-1,1H15V4H10V3a1,1,0,0,1,1-1H21A1,1,0,0,1,22,3Z"/></svg>
        }
        title={'Hotel'}
        fontIcon='bi-app-indicator'
      />
    </>
  )
}

export {SidebarMenuMain}
