// MerchantDirectApply.tsx

import React, { useEffect, useState } from 'react';
import axiosInstance from '../helpers/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import not from '../../_metronic/assets/card/3dnot.webp';
import Cookies from 'js-cookie';

type Props = {
  show: (value: boolean) => void;
  visaList: boolean;
  visaListLoader: (value: boolean) => void;
  onApiDataReceived: (data: any) => void;
  combinedData: any;  // Adjust the type as needed
};

const CustomerDirectApply: React.FC<Props> = ({ show, visaList, onApiDataReceived, visaListLoader, combinedData }) => {
  const [issueDate, setIssueDate] = useState<string | undefined>('');
  const [expiryDate, setExpiryDate] = useState<string | undefined>('');

  useEffect(() => {
    if (combinedData) {
      setIssueDate(combinedData.selectedEntry.application_arrival_date);
      setExpiryDate(combinedData.selectedEntry.application_departure_date);
      fetchInsuranceData();
    }
  }, [combinedData]);

  const validatePostData = (postData: any) => {
    for (const key in postData) {
      if (!postData[key]) {
        return false;
      }
    }
    return true;
  };

  const fetchInsuranceData = () => {
    visaListLoader(true);

    const postData = {
      country_code: combinedData.selectedEntry.country_code,
      nationality_code: combinedData.selectedEntry.nationality_code,
      issue_date: combinedData.selectedEntry.application_arrival_date,
      expiry_date: combinedData.selectedEntry.application_departure_date,
    };

    if (!validatePostData(postData)) {
      toast.error('All fields are required.');
      visaListLoader(false);
      return;
    }

    axiosInstance
      .post('/backend/fetch_normal_user_insurance', postData)
      .then((response) => {
        if (!response.data.data || response.data.data.length === 0) {
          toast.error('Oops !!\nInsurance for this country is not available.', {
            style: {
              background: '#fff',
              color: '#ff4444',
            },
            icon: <img src={not} alt="Not Found" style={{ width: '70px', height: '70px' }} />,
          });
          visaListLoader(false);
          return;
        }
        const responseData = {
          issue_date: postData.issue_date,
          expiry_date: postData.expiry_date,
          insuranceData: response.data.data,
        };
        onApiDataReceived(responseData);
        visaListLoader(false);
      })
      .catch((error) => {
        console.error('Error fetching Atlys data:', error);
        visaListLoader(false);
        toast.error('Some error occurred while fetching visa data.\nPlease try after some time', {
          style: {
            background: '#fff',
            color: '#ff4444',
          },
          icon: <img src={not} alt="Not Found" style={{ width: '70px', height: '70px' }} />,
        });
      });
  };

  return (
    <>
      
    </>
  );
}

export default CustomerDirectApply;
