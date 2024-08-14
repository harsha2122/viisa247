/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { toAbsoluteUrl } from '../../../_metronic/helpers'
import { PageTitle } from '../../../_metronic/layout/core'
import {
  ChartsWidget1,
  ChartsWidget3,
  StatisticsWidget4,
  StatisticsWidget6,
} from '../../../_metronic/partials/widgets'
import React, { useState, useEffect } from 'react';
import icustomer from '../../../_metronic/assets/card/va.svg'
import relations from '../../../_metronic/assets/card/tt.svg'
import revenue from '../../../_metronic/assets/card/rg.svg'
import customers from '../../../_metronic/assets/card/vip.svg'
import { HomeMainCard } from '../../components/HomeMainCard'
import Loader from '../../components/Loader'
import axiosInstance from '../../helpers/axiosInstance'
import { ChartsWidget9 } from '../../../_metronic/partials/widgets/charts/ChartWidget9'

type Props = {
  customer_user: string | number
  merchant_user: string | number
  in_process_visa: string | number
  not_applied: string | number
  visa_rejected:string | number
  api:string | number
  processed:string | number
  waiting:string | number
  today_total_transactions:string | number
  visa_processed_today:string | number
  revenue:string |number
}


const DashboardPage: FC<Props> = (data) => (
  
  
  <>
    {/* begin::Row */}
    <div className='row gx-8 gy-5'>
      {/* begin::Col */}
      <div className=' col-md-6 col-lg-4 col-xl-3 col-xxl-3 '>
        <HomeMainCard
          className='mb-5 mx-auto mb-xl-10'
          description='Revenue generated'
          color='#fff'
          too='/superadmin/revenue'
          icon={revenue}
          textColor='#071437'
          count={data.revenue}
        />
      </div>
      <div className=' col-md-6 col-lg-4 col-xl-3 col-xxl-3'>
        <HomeMainCard
          className='mb-6 mx-auto mb-xl-10'
          description='Total Partners'
          color='#fff'
          too='/superadmin/issueApi'
          icon={customers}
          textColor='#071437'
          count={data.api}
        />
      </div>
      <div className=' col-md-6 col-lg-4 col-xl-3 col-xxl-3'>
        <HomeMainCard
          className='mb-6 mx-auto mb-xl-10'
          description='Total Retailers'
          color='#fff'
          too='/superadmin/merchants'
          icon={relations}
          textColor='#071437'
          count={data.merchant_user}
        />
      </div>
      <div className=' col-md-6 col-lg-4 col-xl-3 col-xxl-3'>
        <HomeMainCard
          className='mb-6 mx-auto mb-xl-10'
          description='Individual Customers'
          color='#fff'
          too='/superadmin/partners'
          icon={icustomer}
          textColor='#071437'
          count={data.customer_user}
        />
      </div>
    </div>
    {/* <div className='row gx-1 gy-5'>
    <div className=' col-md-6 col-lg-4 col-xl-3 col-xxl-3'>
        <HomeMainCard
          className='mb-6 mx-auto mb-xl-10'
          description='Visa Issued'
          color='#fff'
          too='/superadmin/processed'
          icon={issued}
          textColor='#071437'
          count={data.processed}
        />
      </div>
      <div className=' col-md-6 col-lg-4 col-xl-3 col-xxl-3 '>
        <HomeMainCard
          className='mb-5 mx-auto mb-xl-10'
          description='Waiting for Approval'
          color='#fff'
          too='/superadmin/in-process'
          icon={waiting}
          textColor='#071437'
          count={data.waiting}
        />
      </div>
      <div className=' col-md-6 col-lg-4 col-xl-3 col-xxl-3 '>
        <HomeMainCard
          className='mb-5 mx-auto mb-xl-10'
          description='Visa In-Process'
          color='#fff'
          too='/superadmin/waiting-for-approval'
          icon={process}
          textColor='#071437'
          count={data.in_process_visa}
        />
      </div>
      <div className=' col-md-6 col-lg-4 col-xl-3 col-xxl-3'>
        <HomeMainCard
          className='mb-6 mx-auto mb-xl-10'
          description='Visa Rejected'
          color='#fff'
          too='/superadmin/rejected'
          icon={rejected}
          textColor='#071437'
          count={data.visa_rejected}
        />
      </div>
    </div> */}
    {/* <h1
      style={{
        marginTop:"-10px",
        marginBottom:"30px",
        fontSize:"19px"
    }}
    >Today's Statistics</h1>
    <div className='row gx-1 gy-5'>
      <div className=' col-md-6 col-lg-4 col-xl-3 col-xxl-3'>
          <HomeMainCard
            className='mb-5 mx-auto mb-xl-10'
            description='Total transactions'
            color='#fff'
            too='/superadmin/wallet'
            icon={transaction}
            textColor='#071437'
            count={data.today_total_transactions}
          />
      </div>
      <div className=' col-md-6 col-lg-4 col-xl-3 col-xxl-3'>
          <HomeMainCard
            className='mb-5 mx-auto mb-xl-10'
            description='Visa processed today'
            color='#fff'
            too='/superadmin/processed'
            icon={done}
            textColor='#071437'
            count={data.visa_processed_today}
          />
      </div>
    </div> */}
    <div className='row gx-3 mb-3 gy-5'>
      <div className=' col-md-5 col-lg-5 col-xl-5 col-xxl-5'>
        <ChartsWidget9 className='border' />
      </div>
      <div className=' col-md-7 col-lg-7 col-xl-7 col-xxl-7'>
        <ChartsWidget3 className='border' />
      </div>
    </div>
    {/* <div className='row gx-3 mb-3 gy-5'>
      <div className=' col-md-6 col-lg-6 col-xl-6 col-xxl-6'>
        <ChartsWidget3 className='border' />
      </div>
      <div className=' col-md-6 col-lg-6 col-xl-6 col-xxl-6'>
        <ChartsWidget1 className='border' />
      </div>
    </div> */}
  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  const [dashData, setDashData] = useState<Props>({
    customer_user: '',
    merchant_user: '',
    in_process_visa: '',
    not_applied: '',
    visa_rejected: '',
    api:'',
    processed:'',
    waiting:'',
    today_total_transactions:'',
    visa_processed_today:'',
    revenue:'',
  });
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a Get request to your API endpoint
        axiosInstance.get('/backend/super_admin_dashboard')
          .then((response) => {
            setDashData(response.data.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching Atlys data:', error);
            setLoading(false);
          });
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {loading ?
      <Loader loading={loading} />
      :
      <DashboardPage {...dashData}/>
}
    </>
  )
}

export { DashboardWrapper }
