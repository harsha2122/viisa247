import { useEffect, useState } from "react";
import axiosInstance from "../helpers/axiosInstance";
import Cookies from 'js-cookie';
import {HomeMainCard} from './HomeMainCard'
import customer from '../../_metronic/assets/card/av.svg'
import merchant from '../../_metronic/assets/card/va.svg'
import process from '../../_metronic/assets/card/vip.svg'
import waiting from '../../_metronic/assets/card/vw.svg'
import transaction from '../../_metronic/assets/card/tt.svg'
import reject from '../../_metronic/assets/card/vr.svg'
import revenue from '../../_metronic/assets/card/rg.svg'

type Applications = {
  country_code: string
  nationality_code: string
  entry_process: string
  application_id: string
  customer_id: string
  first_name: string
  last_name: string
  birth_place: string
  birthday_date: string
  nationality: string
  passport_number: string
  passport_issue_date: string
  passport_expiry_date: string
  gender: string
  marital_status: string
  passport_front: string
  application_arrival_date: string
  application_departure_date: string
  application_destination: string
  photo: string
  fathers_name: string
  passport_back: string
  pan_card: string
  visa_status: string
  visa_amount: string
  visa_provider: string
  created_at: string
  updated_at: string
  visa_description: string
  visa_pdf: string
  visa_remark: string
  }
  
  type VisaData = {
    group_id: string
    applications: Applications[]
  }
  

type Props = {
  dashboardData: any
}

export function MerchantAnaltytics({dashboardData}) {
  const [loading, setLoading] = useState(false); 
  const [visaData, setVisaData] = useState<any[]>([]);
  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
  
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }
  
    const formattedDate = date.toLocaleDateString('en-US', options)
    return formattedDate
  }

  const formatDate1 = (dateString) => {
    const date = new Date(dateString)
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const month = monthNames[date.getMonth()]

    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const merchant_id = Cookies.get('user_id');
      let postBody = { merchant_id: merchant_id };
      let visaResponse = await axiosInstance.post("/backend/merchant/fetch_visa", postBody);
      
      if (visaResponse.status === 200) {
        const visaData = visaResponse.data.data;
        const filteredVisaData = visaData
          .filter((item: VisaData) => item.group_id)
          .map((item: VisaData) => item.applications[0]) 
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
  
        setVisaData(filteredVisaData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  

  return (
    <>
      <h1
        style={{
          marginTop: '20px',
          fontSize: '20px',
          fontWeight: '500',
          marginBottom: '20px',
        }}
      >
        Analytics
      </h1>
      <div className='row gx-5 gy-5'>
        {/* begin::Col */}
        <div className=' col-md-6 col-lg-6 col-xl-6 col-xxl-3'>
          <HomeMainCard
            className='mb-5 mb-xl-10'
            description='Total Visa'
            color='#fff'
            too='/merchant/dashboard'
            icon={customer}
            textColor='#071437'
            count={dashboardData?.total_visa || 0}
          />
        </div>
        <div className=' col-md-6 col-lg-6 col-xl-6 col-xxl-3'>
          <HomeMainCard
            className='mb-5 mb-xl-10'
            description='Approved Visa'
            color='#fff'
            too='/merchant/dashboard'
            icon={merchant}
            textColor='#071437'
            count={dashboardData?.approved_visa || 0}
          />
        </div>
        <div className=' col-md-6 col-lg-6 col-xl-6 col-xxl-3'>
          <HomeMainCard
            className='mb-5 mb-xl-10'
            description='Visa In-Process'
            color='#fff'
            too='/merchant/dashboard'
            icon={process}
            textColor='#071437'
            count={dashboardData?.in_process_visa || 0}
          />
        </div>
        <div className=' col-md-6 col-lg-6 col-xl-6 col-xxl-3 '>
          <HomeMainCard
            className='mb-5 mb-xl-10'
            description='Visa In Waiting'
            color='#fff'
            too='/merchant/dashboard'
            icon={waiting}
            textColor='#071437'
            count={dashboardData?.waiting_visa || 0}
          />
        </div>
      </div>
      <div className='row gx-5 gy-5'>
        <div className=' col-md-6 col-lg-6 col-xl-6 col-xxl-3 '>
          <HomeMainCard
            className='mb-5 mb-xl-10'
            description='Visa Not Issued'
            color='#fff'
            too='/merchant/dashboard'
            icon={reject}
            textColor='#071437'
            count={dashboardData?.not_issued_visa || 0}
          />
        </div>
        <div className=' col-md-6 col-lg-6 col-xl-6 col-xxl-3 '>
          <HomeMainCard
            className='mb-5 mb-xl-10'
            description='Revenue generated'
            color='#fff'
            too='/merchant/dashboard'
            icon={revenue}
            textColor='#071437'
            count={dashboardData?.revenue || 0}
          />
        </div>
      </div>

      <h1
        style={{
          fontSize: '20px',
          fontWeight: '500',
          marginBottom: '20px',
        }}
      >
        Today's Statistics
      </h1>
      <div className='row gx-5 gy-5'>
        <div className=' col-md-6 col-lg-6 col-xl-6 col-xxl-3'>
          <HomeMainCard
            className='mb-5 mb-xl-10'
            description='Total Transaction'
            color='#fff'
            too='/merchant/dashboard'
            icon={transaction}
            textColor='#071437'
            count={dashboardData?.today_total_transactions || 0}
          />
        </div>
        <div className=' col-md-6 col-lg-6 col-xl-6 col-xxl-3'>
          <HomeMainCard
            className='mb-5 mb-xl-10'
            description='Visa processed'
            color='#fff'
            too='/merchant/dashboard'
            icon={process}
            textColor='#071437'
            count={dashboardData?.visa_processed_today || 0}
          />
        </div>
      </div>

      <div className='row gx-5 gy-5'>
      <div className="d-flex mt-8 mb-4 w-100 justify-content-between">
        <h4>
          Recent 5 Visa Applications
        </h4>
        <h6></h6>
      </div>
      {visaData.map((entry, index) => (
        <div
          className='w-full mt-5'
          key={index}
          style={{
            display: 'flex',
            backgroundColor: '#fff',
            justifyContent: 'space-between',
            borderRadius: 25,
            border: "1px solid #DFDFDF",
            width: '100%',
          }}
        >
          <div style={{ flex: '1', borderRight: '1px solid #DFDFDF' }} className='p-10'>
            <h3 style={{ textTransform: 'capitalize' }}>
              {entry.first_name} {entry.last_name} - {entry.passport_number}
            </h3>
            <p>Created: {formatDate(entry.created_at)}</p>
            <h5 style={{ marginTop: 20 }}>{entry.country_code}</h5>
            <p>
              {entry.visa_description} {entry.entry_process}:{' '}
              {formatDate1(entry.application_arrival_date)} -{' '}
              {formatDate1(entry.application_departure_date)}
            </p>
          </div>
          <div style={{ flex: '1', borderRight: '1px solid #DFDFDF' }} className='p-10'>
            <h2>Applicants: 1</h2>
            <br />
            <h6 style={{ color: 'red' }}>Status - {entry.visa_status}</h6>
            <br />
            {entry.visa_remark && (
              <h6>
                Remarks -{' '}
                <span style={{ color: 'red' }}>{entry.visa_remark}</span>
              </h6>
            )}
          </div>
          <div
            style={{
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <button
              type='submit'
              id='kt_sign_in_submit'
              className='btn btn-success'
              style={{ backgroundColor: '#327113' }}
            >
              Track Application
            </button>
            <button
              type='submit'
              id='kt_sign_in_submit'
              className='btn btn-success'
              style={{ backgroundColor: '#327113', marginTop: 20 }}
            >
              Download Invoice
            </button>
            {(entry.visa_status === 'Reject' || entry.visa_status === 'Rejected') && (
              <button
                type='submit'
                id='kt_sign_in_submit'
                className='btn btn-success'
                style={{ backgroundColor: '#327113', marginTop: 20 }}
              >
                Re - Submit Form
              </button>
            )}
            {entry.visa_pdf && (
              <button
                type='submit'
                id='kt_sign_in_submit'
                className='btn btn-success'
                style={{
                  backgroundColor: '#327113',
                  marginTop: 20,
                }}
              >
                Download Visa
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
    </>
  )
}
