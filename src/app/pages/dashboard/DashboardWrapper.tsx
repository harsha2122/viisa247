/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { useIntl } from 'react-intl'
import {
  CardsWidget20,
  ChartsWidget3,
} from '../../../_metronic/partials/widgets'
import React, { useState, useEffect } from 'react';
import icustomer from '../../../_metronic/assets/card/va.svg'
import relations from '../../../_metronic/assets/card/tt.svg'
import revenue from '../../../_metronic/assets/card/rg.svg'
import customers from '../../../_metronic/assets/card/vip.svg'
import visa from '../../../_metronic/assets/card/passport.png'
import insurance from '../../../_metronic/assets/card/life-insurance.png'
import flight from '../../../_metronic/assets/card/airplane.png'
import hotel from '../../../_metronic/assets/card/hotels.png'
import packagess from '../../../_metronic/assets/card/package-box.png'
import { HomeMainCard } from '../../components/HomeMainCard'
import Loader from '../../components/Loader'
import axiosInstance from '../../helpers/axiosInstance'
import { ChartsWidget9 } from '../../../_metronic/partials/widgets/charts/ChartWidget9'

type Props = {
  customer_user: string | number
  merchant_user: string | number
  in_process_visa: string | number
  not_applied: string | number
  visa_rejected: string | number
  api: string | number
  processed: string | number
  waiting: string | number
  today_total_transactions: string | number
  visa_processed_today: string | number
  revenue: string | number
  visa_count: number
  insurance_count: number
  package_count: number
  hotel_count: number
  flight_count: number
}

const DashboardPage: FC<Props> = (data) => (
  <>
    {/* begin::Row */}
    <div className='row gx-8 gy-5'>
      {/* Revenue */}
      {/* <div className='col-md-6 col-lg-4 col-xl-3 col-xxl-3'>
        <HomeMainCard
          className='mb-5 mx-auto mb-xl-10'
          description='Revenue generated'
          color='#fff'
          too='/superadmin/revenue'
          icon={revenue}
          textColor='#071437'
          count={data.revenue}
        />
      </div> */}
      {/* Partners */}
      <div className='col-md-6 col-lg-4 col-xl-4 col-xxl-4'>
        <HomeMainCard
          className='mb-6 mx-auto mb-xl-10'
          description='Partners'
          color='#fff'
          too='/superadmin/issueApi'
          icon={customers}
          textColor='#071437'
          count={data.api}
        />
      </div>
      {/* Retailers */}
      <div className='col-md-6 col-lg-4 col-xl-4 col-xxl-4'>
        <HomeMainCard
          className='mb-6 mx-auto mb-xl-10'
          description='Retailers'
          color='#fff'
          too='/superadmin/merchants'
          icon={relations}
          textColor='#071437'
          count={data.merchant_user}
        />
      </div>
      {/* Customers */}
      <div className='col-md-6 col-lg-4 col-xl-4 col-xxl-4'>
        <HomeMainCard
          className='mb-6 mx-auto mb-xl-10'
          description='Customers'
          color='#fff'
          too='/superadmin/partners'
          icon={icustomer}
          textColor='#071437'
          count={data.customer_user}
        />
      </div>
    </div>

    <div className='row mt-0 gx-8 gy-5'>
      {/* Revenue */}
      {/* <div className='col-md-6 col-lg-4 col-xl-3 col-xxl-3'>
        <HomeMainCard
          className='mb-5 mx-auto mb-xl-10'
          description='Revenue generated'
          color='#fff'
          too='/superadmin/revenue'
          icon={revenue}
          textColor='#071437'
          count={data.revenue}
        />
      </div> */}
      {/* Partners */}
      <div className='col-md-6 col-lg-4 col-xl-4 col-xxl-4'>
        <HomeMainCard
          className='mb-6 mx-auto mb-xl-10'
          description='Revenue'
          color='#fff'
          too='/superadmin/issueApi'
          icon={customers}
          textColor='#071437'
          count={data.revenue}
        />
      </div>
      {/* Retailers */}
      <div className='col-md-6 col-lg-4 col-xl-4 col-xxl-4'>
        <HomeMainCard
          className='mb-6 mx-auto mb-xl-10'
          description="Today's total transactions" 
          color='#fff'
          too='/superadmin/merchants'
          icon={relations}
          textColor='#071437'
          count={data.today_total_transactions}
        />
      </div>
      {/* Customers */}
      <div className='col-md-6 col-lg-4 col-xl-4 col-xxl-4'>
        <HomeMainCard
          className='mb-6 mx-auto mb-xl-10'
          description='Visa Processed Today'
          color='#fff'
          too='/superadmin/partners'
          icon={icustomer}
          textColor='#071437'
          count={data.visa_processed_today}
        />
      </div>
    </div>

    {/* Status-based Counts */}
    <div className='row justify-content-between gx-8 gy-5 px-4 mb-12'>
    <hr style={{
        width:"100%",
        border: 0,
        height: "1px",
        backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0))"
      }} />
      <h2 className='w-100 my-8'>Applications In-Process</h2>
      <div className='col-md-2'>
        <CardsWidget20
          className='my-custom-class'
          description='Visa'
          color='rgb(229, 255, 235)'  // Light Royal Blue
          icon={visa}
          textColor='black'
          count={data.visa_count}
        />
      </div>
      <div className='col-md-2'>
        <CardsWidget20
          className='my-custom-class'
          description='Insurance'
          color='rgb(235, 245, 255)'  // Light Lavender
          icon={insurance}
          textColor='black'
          count={data.insurance_count}
        />
      </div>
      <div className='col-md-2'>
        <CardsWidget20
          className='my-custom-class'
          description='Flight'
          color='rgb(255, 245, 235)'  // Pale Aqua
          icon={flight}
          textColor='black'
          count={data.flight_count}
        />
      </div>
      <div className='col-md-2'>
        <CardsWidget20
          className='my-custom-class'
          description='Package'
          color='rgb(255, 250, 240)'  // Light Rose
          icon={packagess}
          textColor='black'
          count={0}
        />
      </div>
      <div className='col-md-2'>
        <CardsWidget20
          className='my-custom-class'
          description='Hotel'
          color='rgb(245, 235, 255)'  // Soft Mint Green
          icon={hotel}
          textColor='black'
          count={data.hotel_count}
        />
      </div>
    </div>

    {/* Charts */}
    <div className='row gx-3 mb-3 gy-5'>
      <div className='col-md-5 col-lg-5 col-xl-5 col-xxl-5'>
        <ChartsWidget9 className='border' />
      </div>
      <div className='col-md-7 col-lg-7 col-xl-7 col-xxl-7'>
        <ChartsWidget3 className='border' />
      </div>
    </div>
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
    api: '',
    processed: '',
    waiting: '',
    today_total_transactions: '',
    visa_processed_today: '',
    revenue: '',
    visa_count: 0,
    insurance_count: 0,
    flight_count: 0,
    hotel_count: 0,
    package_count: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardResponse, visaResponse, insuranceResponse, flightResponse, hotelResponse] = await Promise.all([
          axiosInstance.get('/backend/super_admin_dashboard'),
          axiosInstance.get('/backend/super_admin/fetch_all_visa'),
          axiosInstance.get('/backend/super_admin/fetch_all_insurance'),
          axiosInstance.get('/backend/super_admin/fetch_all_flight'),
          axiosInstance.get('/backend/super_admin/fetch_all_hotel'),
        ]);

        const visaFilteredData = visaResponse.data.data.filter((item: any) => {
          const filteredApplications = item.applications.filter(
            (application: any) => application.visa_status === 'Not Issued' || application.visa_status === 'Applied'
          );
          return filteredApplications.length > 0;
        });
        const visaCount = visaFilteredData.length;

        const insuranceFilteredData = insuranceResponse.data.data.filter((item: any) => {
          const filteredApplications = item.applications.filter(
            (application: any) => application.insurance_status === 'Not Issued' || application.insurance_status === 'Applied'
          );
          return filteredApplications.length > 0;
        });
        const insuranceCount = insuranceFilteredData.length;

        const filteredFlight = flightResponse.data.data.filter((entry: any) => {
          const status = entry.applications[0]?.flight_status;
          return status === 'Applied' || status === 'Not Issued';
        });
        const flightCount = filteredFlight.length

        const hotelData = [...(hotelResponse.data.data || []), ...(hotelResponse.data.data1 || [])];
        const filteredData = hotelData.filter(item => ['Applied', 'Not Issued'].includes(item.hotel_status));
        const hotelCount = filteredData.length;
        console.log("----->", dashboardResponse.data.data)
        setDashData({
          ...dashboardResponse.data.data,
          visa_count: visaCount,
          insurance_count: insuranceCount,
          flight_count: flightCount,
          hotel_count: hotelCount,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading ? <Loader loading={loading} /> : <DashboardPage {...dashData} />}
    </>
  );
}

export { DashboardWrapper }
