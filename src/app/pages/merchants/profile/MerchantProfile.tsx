import React, { useState, useRef, ChangeEvent, useEffect, CSSProperties } from 'react'
import BankIcon from '@mui/icons-material/AccountBalance'
import Uploadicon from '@mui/icons-material/CloudUpload'
import UpiIcon from '@mui/icons-material/TapAndPlay'
import ClearIcon from '@mui/icons-material/Delete'
import { ErrorMessage, Field, Form, Formik, FormikValues, useFormik } from 'formik'
import { ICreateAccount, inits } from '../../../modules/wizards/components/CreateAccountWizardHelper'
import axiosInstance from '../../../helpers/axiosInstance'
import Cookies from 'js-cookie'
import toast, { Toaster } from 'react-hot-toast';
import { FaFileCode } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { CloseOutlined } from '@mui/icons-material'
import Papa from 'papaparse';
import moment from 'moment'
import 'react-range-slider-input/dist/style.css';
import { Slider } from 'antd'
import { HiReceiptPercent } from "react-icons/hi2";
import { DatePicker } from 'antd'
import {HeaderWrapper} from '../../../../_metronic/layout/components/header/HeaderWrapper';
import { BsClipboardDataFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { FaWallet } from "react-icons/fa6";
import qr from '../../../../_metronic/assets/card/qr.png'
import bank from '../../../../_metronic/assets/card/bank.svg'
import upi from '../../../../_metronic/assets/card/upi.svg'
import rec from '../../../../_metronic/assets/card/reciept.svg'

interface Transaction {
  created_at: string;
  wallet_balance: number;
  category: string;
  type: string;
  status: string;
  remaining_balance: string;
}

interface Revenue {
  name: string;
  revenue: number;
  transaction_time: string;
  application_no: string;
  paid: number;
  receive:number;
}

const itemsPerPage = 10;
const MAX_VISIBLE_PAGES = 5;

function MerchantProfile() {
  const [activeTab, setActiveTab] = useState('Profile')
  const maxSize = 1024 * 1024;
  const [formData, setFormData] = useState({
    upi_ref_id: '',
    receipt: '',
    amount: '',
  })

  const [issueDate, setIssueDate] = useState<string | undefined>('');
  const [expiryDate, setExpiryDate] = useState<string | undefined>('');

  const formatDate1 = (dateString) => {
    // Create a Date object from the input date string
    const date = new Date(dateString)

    // Get the month name as a three-letter abbreviation (e.g., "Oct")
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
  const [formData2, setFormData2] = useState({
    merchant_phone_number: '',
    merchant_email_id: '',
    merchant_gst_no: '',
    merchant_pan_no: '',
    merchant_country: '',
    merchant_address_one_line: '',
    merchant_address_second_line: '',
    merchant_state: '',
    merchant_zip_code: '',
    merchant_name: '',
    merchant_id: '',
    merchant_profile_photo: '',
    issued_api: [],
    commission: [0, 50]
  })

  const user_id = Cookies.get('user_id')

  const handleFieldChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value })
  }

  const [activeWalletTab, setActiveWalletTab] = useState('Bank Transfer (0% Fee)')
  const [initValues] = useState<ICreateAccount>(inits)
  const [recieptImage, setReceiptImage] = useState('')
  const [receiptShow, setReceiptshow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [checked, setChecked] = React.useState(true);
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const [revenue, setRevenue] = useState<Revenue[]>([]);
  const [flight, setFlight] = useState<Revenue[]>([]);
  const [hotel, setHotel] = useState<Revenue[]>([]);
  const [insurance, setInsurance] = useState<Revenue[]>([]);
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [commission, setCommission] = useState(0);
  const [upperLimit, setUpperLimit] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleWalletTabClick = (tabName: string) => {
    setActiveWalletTab(tabName)
  }

  const handleProfileFieldChange = (fieldName, value) => {
    setFormData2({ ...formData2, [fieldName]: value })
  }
  const filterTransactions = (startDate: string, endDate: string) => {
    const filtered = transaction.filter((item: Transaction) => {
      const transactionDate = moment(item.created_at);
      return transactionDate.isBetween(startDate, endDate, null, '[]');
    });
    setTransaction(filtered);
  };
  useEffect(() => {
    // Fetch profile data when the component mounts
    fetchProfileData()
    fetchTransactionData()
    fetchCommission()
    fetchRevenueData()
    fetchRevenueData1()
    fetchRevenueData2()
    fetchRevenueData3()
  }, [])

  useEffect(() => {
    if (issueDate && expiryDate) {
      filterTransactions(issueDate, expiryDate);
    }
  }, [issueDate, expiryDate]);

  const fetchCommission = async () => {
    try {
      const markup_percentage = localStorage.getItem('markup_percentage') ?? '1';
      const markup_percentageAsNumber = parseFloat(markup_percentage); // Convert the string to a number

      const response = await axiosInstance.get('/backend/fetch_setting')
      if (response.status == 203) {
        toast.error('Please Logout And Login Again', {
          position: 'top-center',
        })
      }

      setUpperLimit(parseFloat(response.data.data.merchant_percantage))

      setCommission(markup_percentageAsNumber)
    } catch (error) {
      console.error('Error fetching profile data:', error)
      // Handle error (e.g., show an error message)
    }
  }
  const fetchProfileData = async () => {
    try {
      const user_id = Cookies.get('user_id')
      const postData = {
        id: user_id,
      }
      const response = await axiosInstance.post('/backend/fetch_single_merchant_user', postData)

      if (response.status == 203) {
        toast.error('Please Logout And Login Again', {
          position: 'top-center',
        })
      }
      // Assuming the response contains the profile data, update the state with the data
      setFormData2(response.data.data)
    } catch (error) {
      console.error('Error fetching profile data:', error)
      // Handle error (e.g., show an error message)
    }
  }
  const [currentPageRevenue, setCurrentPageRevenue] = useState(1);
  const itemsPerPageRevenue = 10; // Adjust the number of items per page as needed

  const [currentPageInsurance, setCurrentPageInsurance] = useState(1);
  const itemsPerPageInsurance = 10; // Adjust the number of items per page as needed

  const [currentPageFlight, setCurrentPageFlight] = useState(1);
  const itemsPerPageFlight = 10; // Adjust the number of items per page as needed

  const [currentPageHotel, setCurrentPageHotel] = useState(1);
  const itemsPerPageHotel = 10; // Adjust the number of items per page as needed
  

  const fetchTransactionData = async () => {
    try {
      const user_id = Cookies.get('user_id');
      const postData = {
        merchant_id: user_id,
      };
      const response = await axiosInstance.post('/backend/fetch_merchant_transaction', postData);

      if (response.status === 203) {
        toast.error('Please Logout And Login Again', {
          position: 'top-center',
        });
      }
      // Assuming the response contains the profile data, update the state with the data
      setTransaction(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Handle error (e.g., show an error message)
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, []); 

  const handlePageClickRevenue = (page: number | string) => {
    if (page !== '...' && page !== currentPageRevenue) {
      setCurrentPageRevenue(page as number);
    }
  };
  const indexOfLastItemRevenue = currentPageRevenue * itemsPerPageRevenue;
const indexOfFirstItemRevenue = indexOfLastItemRevenue - itemsPerPageRevenue;
const currentItemsRevenue = revenue.slice(indexOfFirstItemRevenue, indexOfLastItemRevenue);

const indexOfLastItemInsurance = currentPageInsurance * itemsPerPageInsurance;
const indexOfFirstItemInsurance = indexOfLastItemInsurance - itemsPerPageInsurance;
const currentItemsInsurance = insurance.slice(indexOfFirstItemInsurance, indexOfLastItemInsurance);

const indexOfLastItemFlight = currentPageFlight * itemsPerPageFlight;
const indexOfFirstItemFlight = indexOfLastItemFlight - itemsPerPageFlight;
const currentItemsFlight = flight.slice(indexOfFirstItemFlight, indexOfLastItemFlight);

const indexOfLastItemHotel = currentPageHotel * itemsPerPageHotel;
const indexOfFirstItemHotel = indexOfLastItemHotel - itemsPerPageHotel;
const currentItemsHotel = hotel.slice(indexOfFirstItemHotel, indexOfLastItemHotel);


const renderPageNumbersRevenue = () => {
  const totalPagesRevenue = Math.ceil(revenue.length / itemsPerPageRevenue);

  if (totalPagesRevenue <= MAX_VISIBLE_PAGES) {
    return addRangeOfPages(1, totalPagesRevenue);
  } else {
    if (currentPage <= MAX_VISIBLE_PAGES - 3) {
      return [
        ...addRangeOfPages(1, MAX_VISIBLE_PAGES - 2),
        '...',
        totalPages - 1,
        totalPages,
      ];
    } else if (currentPage >= totalPages - (MAX_VISIBLE_PAGES - 4)) {
      return [
        1,
        '...',
        ...addRangeOfPages(totalPages - (MAX_VISIBLE_PAGES - 3), totalPages),
      ];
    } else {
      return [
        1,
        '...',
        ...addRangeOfPages(currentPage - 1, currentPage + 1),
        '...',
        totalPages,
      ];
    }
  }
};
const renderPageNumbersInsurance = () => {
  const totalPagesInsurance = Math.ceil(insurance.length / itemsPerPageInsurance);

  if (totalPagesInsurance <= MAX_VISIBLE_PAGES) {
    return addRangeOfPages(1, totalPagesInsurance);
  } else {
    if (currentPage <= MAX_VISIBLE_PAGES - 3) {
      return [
        ...addRangeOfPages(1, MAX_VISIBLE_PAGES - 2),
        '...',
        totalPages - 1,
        totalPages,
      ];
    } else if (currentPage >= totalPages - (MAX_VISIBLE_PAGES - 4)) {
      return [
        1,
        '...',
        ...addRangeOfPages(totalPages - (MAX_VISIBLE_PAGES - 3), totalPages),
      ];
    } else {
      return [
        1,
        '...',
        ...addRangeOfPages(currentPage - 1, currentPage + 1),
        '...',
        totalPages,
      ];
    }
  }
};
const renderPageNumbersFlight = () => {
  const totalPagesFlight = Math.ceil(flight.length / itemsPerPageFlight);

  if (totalPagesFlight <= MAX_VISIBLE_PAGES) {
    return addRangeOfPages(1, totalPagesFlight);
  } else {
    if (currentPage <= MAX_VISIBLE_PAGES - 3) {
      return [
        ...addRangeOfPages(1, MAX_VISIBLE_PAGES - 2),
        '...',
        totalPages - 1,
        totalPages,
      ];
    } else if (currentPage >= totalPages - (MAX_VISIBLE_PAGES - 4)) {
      return [
        1,
        '...',
        ...addRangeOfPages(totalPages - (MAX_VISIBLE_PAGES - 3), totalPages),
      ];
    } else {
      return [
        1,
        '...',
        ...addRangeOfPages(currentPage - 1, currentPage + 1),
        '...',
        totalPages,
      ];
    }
  }
};
const renderPageNumbersHotel = () => {
  const totalPagesHotel = Math.ceil(hotel.length / itemsPerPageHotel);

  if (totalPagesHotel <= MAX_VISIBLE_PAGES) {
    return addRangeOfPages(1, totalPagesHotel);
  } else {
    if (currentPage <= MAX_VISIBLE_PAGES - 3) {
      return [
        ...addRangeOfPages(1, MAX_VISIBLE_PAGES - 2),
        '...',
        totalPages - 1,
        totalPages,
      ];
    } else if (currentPage >= totalPages - (MAX_VISIBLE_PAGES - 4)) {
      return [
        1,
        '...',
        ...addRangeOfPages(totalPages - (MAX_VISIBLE_PAGES - 3), totalPages),
      ];
    } else {
      return [
        1,
        '...',
        ...addRangeOfPages(currentPage - 1, currentPage + 1),
        '...',
        totalPages,
      ];
    }
  }
};
  const fetchRevenueData = async () => {
    try {
      const user_id = Cookies.get('user_id')
      const postData = {
        merchant_id: user_id,
      }
      const response = await axiosInstance.post('/backend/merchant/revenue', postData)

      if (response.status == 203) {
        toast.error('Please Logout And Login Again', {
          position: 'top-center',
        })
      }
      // Assuming the response contains the profile data, update the state with the data
      setRevenue(response.data.data)
    } catch (error) {
      console.error('Error fetching profile data:', error)
      // Handle error (e.g., show an error message)
    }
  }
  const fetchRevenueData1 = async () => {
    try {
      const user_id = Cookies.get('user_id')
      const postData = {
        merchant_id: user_id,
      }
      const response = await axiosInstance.post('/backend/merchant/insurance_revenue', postData)

      if (response.status == 203) {
        toast.error('Please Logout And Login Again', {
          position: 'top-center',
        })
      }
      // Assuming the response contains the profile data, update the state with the data
      setInsurance(response.data.data)
    } catch (error) {
      console.error('Error fetching profile data:', error)
      // Handle error (e.g., show an error message)
    }
  }

  const fetchRevenueData2 = async () => {
    try {
      const user_id = Cookies.get('user_id')
      const postData = {
        merchant_id: user_id,
      }
      const response = await axiosInstance.post('/backend/merchant/flight_revenue', postData)

      if (response.status == 203) {
        toast.error('Please Logout And Login Again', {
          position: 'top-center',
        })
      }
      // Assuming the response contains the profile data, update the state with the data
      setFlight(response.data.data)
    } catch (error) {
      console.error('Error fetching profile data:', error)
      // Handle error (e.g., show an error message)
    }
  }

  const fetchRevenueData3 = async () => {
    try {
      const user_id = Cookies.get('user_id')
      const postData = {
        merchant_id: user_id,
      }
      const response = await axiosInstance.post('/backend/merchant/hotel_revenue', postData)

      if (response.status == 203) {
        toast.error('Please Logout And Login Again', {
          position: 'top-center',
        })
      }
      // Assuming the response contains the profile data, update the state with the data
      setHotel(response.data.data)
    } catch (error) {
      console.error('Error fetching profile data:', error)
      // Handle error (e.g., show an error message)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const addRangeOfPages = (start: number, end: number): (number | string)[] => {
      const pages: (number | string)[] = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    };
    const renderPageNumbers = (): (number | string)[] => {
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
      if (totalPages <= MAX_VISIBLE_PAGES) {
        return addRangeOfPages(1, totalPages);
      } else {
        if (currentPage <= MAX_VISIBLE_PAGES - 3) {
          return [
            ...addRangeOfPages(1, MAX_VISIBLE_PAGES - 2),
            '...',
            totalPages - 1,
            totalPages,
          ];
        } else if (currentPage >= totalPages - (MAX_VISIBLE_PAGES - 4)) {
          return [
            1,
            '...',
            ...addRangeOfPages(totalPages - (MAX_VISIBLE_PAGES - 3), totalPages),
          ];
        } else {
          return [
            1,
            '...',
            ...addRangeOfPages(currentPage - 1, currentPage + 1),
            '...',
            totalPages,
          ];
        }
      }
    };
  

  const handlePageClick = (page: number | string) => {
    // Check if the clicked page is not ellipsis or disabled
    if (page !== '...' && page !== currentPage && typeof page === 'number') {
      // Implement the logic to update the current page
      setCurrentPage(page);
    }
  };


  const saveCommission = async () => {
    setLoading(true);
    const user_id = Cookies.get('user_id')

    const response = await axiosInstance.patch('/backend/set_markup_percentage', {
      merchant_id: user_id,
      markup_percentage: commission.toString()
    })
    if (response.status == 203) {
      toast.error(response.data.msg, {
        position: 'top-center',
      })
      setLoading(false);
    } else {
      localStorage.removeItem('markup_percentage');
      localStorage.setItem('markup_percentage', commission.toString());

      toast.success(response.data.msg, {
        position: 'top-center',
      })
      setLoading(false);
    }
  }

  const handleCommissionChange = (e) => {
    const inputValue = parseFloat(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= upperLimit) {
      setCommission(inputValue);
    } else if (isNaN(inputValue) || inputValue < 0) {
      setCommission(0);
    } else {
      setCommission(upperLimit);
    }
  };
  
  

  const handleSave = async () => {
    setLoading(true);
    const user_id = Cookies.get('user_id')
    setFormData2({ ...formData2, ['merchant_id']: user_id })

    const response = await axiosInstance.patch('/backend/update_merchant_user', formData2)
    if (response.status == 203) {
      toast.error(response.data.msg, {
        position: 'top-center',
      })
      setLoading(false);
    } else {
      toast.success(response.data.msg, {
        position: 'top-center',
      })
      setLoading(false);
    }
  }

  const inputStyle = {
    border: '1px solid #d3d3d3', // Border width and color
    borderRadius: '10px', // Border radius
    padding: '10px',
    paddingLeft: '20px', // Padding
    width: 280, // 100% width
    boxSizing: 'border-box',
    backgroundColor: 'white', // Include padding and border in the width calculation
  }


  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.3s, visibility 0.3s',
  };

  const activeOverlayStyle: CSSProperties = {
    opacity: 1,
    visibility: 'visible',
  };
  const contentStyle: CSSProperties = {
    backgroundColor: '#fff', // Background color for highlighting
    padding: '10px', // Adjust padding as needed
    borderRadius: '5px', // Rounded corners for the highlight
    // textAlign:'center',
    width: '70%',
    height: '70%',
    overflowY: 'auto'
  };

  const profileContent = (
    <div
      className='w-full mt-5 mx-10 px-10'
      style={{
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderColor: '#f5f5f5',
        border: '1px solid #d3d3d3',
        boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.1)',
        width: '95%',
        overflow: 'hidden',
        display:"flex",
        flexDirection:"column",
        alignItems:"center"
      }}
    >
      <h2 className='pb-5 pt-10'>Agency Information</h2>
      <hr style={{
        width:"70%",
        border: 0,
        height: "1px",
        backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))"
      }} />
      <Formik initialValues={{...formData2}} onSubmit={() => { }}>
        {() => (
          <Form className='py-10 px-9' noValidate id='kt_create_account_form'>
            <div>
              <div className='d-flex'>
                <div className='fv-row mb-10'>
                  <label className='form-label mx-1' style={{ fontWeight: 'bold' }}>
                    Name
                  </label>
                  <Field
                    style={inputStyle}
                    name='merchant_name'
                    onChange={(e) => handleProfileFieldChange('merchant_name', e.target.value)}
                    value={formData2?.merchant_name}
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='merchant_name' />
                  </div>
                </div>
                <div className='fv-row mb-10 mx-10'>
                  <label
                    className='d-flex align-items-center form-label mx-1'
                    style={{ fontWeight: 'bold' }}
                  >
                    <span className='required'>Email</span>
                  </label>

                  <Field
                    style={inputStyle}
                    name='businessDescriptor'
                    value={formData2?.merchant_email_id}
                    readOnly
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='businessDescriptor' />
                  </div>
                </div>
              </div>

              <div className='d-flex'>
                <div className='fv-row mb-10'>
                  <label
                    className='d-flex align-items-center form-label mx-1'
                    style={{ fontWeight: 'bold' }}
                  >
                    <span>Contact Number</span>
                  </label>

                  <Field
                    style={inputStyle}
                    name='merchant_phone_number'
                    value={formData2.merchant_phone_number}
                    onChange={(e) =>
                      handleProfileFieldChange('merchant_phone_number', e.target.value)
                    }
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='merchant_phone_number' />
                  </div>
                </div>
              </div>

              <div className='d-flex'>
                <div className='fv-row mb-10'>
                  <label
                    className='d-flex align-items-center form-label mx-1'
                    style={{ fontWeight: 'bold' }}
                  >
                    <span className='required'>GST Number</span>
                  </label>

                  <Field
                    style={{ ...inputStyle, }}
                    value={formData2.merchant_gst_no}
                    readOnly
                    name='businessDescriptor'
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='businessDescriptor' />
                  </div>
                </div>
                <div className='fv-row mb-10 mx-10'>
                  <label
                    className='d-flex align-items-center form-label mx-1'
                    style={{ fontWeight: 'bold' }}
                  >
                    <span className='required'>PAN Card</span>
                  </label>

                  <Field
                    style={{ ...inputStyle, width: '285px' }}
                    name='businessDescriptor'
                    value={formData2.merchant_pan_no}
                    readOnly
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='businessDescriptor' />
                  </div>
                </div>
              </div>
              <hr style={{
                width:"100%",
                border: 0,
                height: "1px",
                marginTop:"10px",
                marginBottom:"35px",
                backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))"
              }} />

              <div className='d-flex'>
                <div className='fv-row mb-5'>
                  <label
                    className='d-flex align-items-center form-label mx-1'
                    style={{ fontWeight: 'bold' }}
                  >
                    <span>Address Line 1</span>
                  </label>

                  <Field
                    style={{ ...inputStyle, width: "590px" }}
                    value={formData2?.merchant_address_one_line}
                    name='merchant_address_one_line'
                    onChange={(e) =>
                      handleProfileFieldChange('merchant_address_one_line', e.target.value)
                    }
                    className='form-control form-control-lg form-control-solid '
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='merchant_address_one_line' />
                  </div>
                </div>
              </div>
              <div className='d-flex'>
                <div className='fv-row mb-10'>
                  <label
                    className='d-flex align-items-center form-label mx-1'
                    style={{ fontWeight: 'bold' }}
                  >
                    <span>Address Line 2</span>
                  </label>

                  <Field
                    style={{ ...inputStyle, width: "590px" }}
                    value={formData2.merchant_address_second_line}
                    name='merchant_address_second_line'
                    onChange={(e) =>
                      handleProfileFieldChange('merchant_address_second_line', e.target.value)
                    }
                    className='form-control form-control-lg form-control-solid '
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='merchant_address_second_line' />
                  </div>
                </div>
              </div>

              <div className='d-flex'>
                <div className='fv-row mb-10'>
                  <label
                    className='d-flex align-items-center form-label mx-1'
                    style={{ fontWeight: 'bold' }}
                  >
                    <span>Country</span>
                  </label>

                  <Field
                    style={{ ...inputStyle }}
                    name='merchant_country'
                    value={formData2.merchant_country}
                    onChange={(e) => handleProfileFieldChange('merchant_country', e.target.value)}
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='merchant_country' />
                  </div>
                </div>
                <div className='fv-row mb-10 mx-10'>
                  <label
                    className='d-flex align-items-center form-label mx-1'
                    style={{ fontWeight: 'bold' }}
                  >
                    <span>State</span>
                  </label>

                  <Field
                    style={{ ...inputStyle }}
                    name='merchant_state'
                    value={formData2.merchant_state}
                    onChange={(e) => handleProfileFieldChange('merchant_state', e.target.value)}
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='merchant_state' />
                  </div>
                </div>
                <div className='fv-row mb-10'>
                  <label
                    className='d-flex align-items-center form-label mx-1'
                    style={{ fontWeight: 'bold' }}
                  >
                    <span>Zip Code</span>
                  </label>

                  <Field
                    style={{ ...inputStyle }}
                    name='merchant_zip_code'
                    value={formData2.merchant_zip_code}
                    onChange={(e) => handleProfileFieldChange('merchant_zip_code', e.target.value)}
                    className='form-control form-control-lg form-control-solid'
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='merchant_zip_code' />
                  </div>
                </div>
              </div>
              <div className='d-flex justify-content-end'>
                <button
                  type='submit'
                  className='btn btn-success'
                  onClick={handleSave}
                  style={{ backgroundColor: '#327113' }}
                >
                  {!loading && <span className='indicator-label'>Save</span>}
                  {loading && (
                    <span className='indicator-progress' style={{ display: 'block' }}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )

  const bankContent = (
      <Formik initialValues={initValues} onSubmit={() => { }}>
        {() => (
          <Form
            className='py-10'
            style={{ justifyContent: 'center', marginLeft: 100, width: '75%', display:"flex", flexDirection:"column", height:"100%" }}
            noValidate
            id='kt_create_account_form'
          >
            <div className='d-flex'>
              <div className='fv-row mb-2'>
                <Field
                  style={{
                    ...inputStyle,
                    width: "590px",
                  }}
                  readOnly
                  value="Bank- The Jammu and Kashmir Bank Ltd"
                  name='businessDescriptor'
                  className='form-control form-control-lg form-control-solid '
                />
                <div className='text-danger mt-2'>
                  <ErrorMessage name='businessDescriptor' />
                </div>
              </div>
            </div>
            <div className='d-flex'>
              <div className='fv-row mb-2'>
                <Field
                  style={{
                    ...inputStyle,
                    width: "590px",
                  }}
                  readOnly
                  value="Account No- 0014020100000923                  "
                  name='businessDescriptor'
                  className='form-control form-control-lg form-control-solid '
                />
                <div className='text-danger mt-2'>
                  <ErrorMessage name='businessDescriptor' />
                </div>
              </div>
            </div>

            <div className='d-flex'>
              <div className='fv-row mb-5'>
                <Field
                  style={{
                    ...inputStyle,
                    width: "590px",
                  }}
                  readOnly
                  value="IFSC - JAKA0EMPIRE (0-zero)"
                  name='businessDescriptor'
                  className='form-control form-control-lg form-control-solid '
                />
                <div className='text-danger mt-2'>
                  <ErrorMessage name='businessDescriptor' />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
  )

  const upiContent = (
    <div>
      <Formik initialValues={initValues} onSubmit={() => { }}>
        {() => (
          <Form
            className='py-10'
            style={{ justifyContent: 'center', marginLeft: 150, width: '75%' }}
            noValidate
            id='kt_create_account_form'
          >
            <div className='d-flex justify-content-center'>
              <div className='fv-row mb-5'>
                {/* <Field
                  style={{
                    ...inputStyle,
                    width: "590px",
                    border: '1px solid #d3d3d3',
                    borderRadius: 10,
                  }}
                  readOnly
                  name='businessDescriptor'
                  className='form-control form-control-lg form-control-solid '
                /> */}
                <img style={{marginLeft:"20px"}} width="200px" src={qr} alt="qr-code" />
                <div className='text-danger mt-2'>
                  <ErrorMessage name='businessDescriptor' />
                </div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 14 }}>
              Scan the UPI QR code with any payment app and make a payment, upload your transaction screenshot along with your UTR reference no.
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
  const handleFileUpload = async (file) => {
    try {
        setLoading(true); // Loader ko true set karo

        const formData = new FormData()
        formData.append('file', file)

        // Make a POST request to your server to upload the file
        const response = await axiosInstance.post('/backend/upload_image/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        // Assuming your server responds with the file URL
        const fileUrl = response.data.data

        // Reset loader after getting the URL
        setLoading(false);

        return fileUrl // Return the file URL
    } catch (error) {
        console.error('Error uploading file:', error)

        // Reset loader in case of an error
        setLoading(false);

        return '' // Return an empty string in case of an error
    }
}

const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
        const reader = new FileReader()

        reader.onload = async (e) => {
            // Update the state variable with the image data (base64-encoded)
            if (e.target) {
                setReceiptImage(e.target.result as string)
                try {
                    // Assuming handleFileUpload is an asynchronous function that returns a promise
                    const imageLink = await handleFileUpload(file)

                    // Update the form data with the image link
                    setFormData({ ...formData, receipt: imageLink })
                } catch (error) {
                    console.error('Error uploading image:', error)
                }
            }
        }

        reader.readAsDataURL(file)
    }
}


  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const navigate = useNavigate()
  const handleSaveClick = async () => {
    setLoading(true);
  
    const postBody = {
      upi_ref_id: formData.upi_ref_id,
      merchant_id: user_id,
      receipt: formData.receipt,
      amount: formData.amount,
      type: 'Credit',
      category: 'Wallet Balance',
    };
  
    try {
      const response = await axiosInstance.post('/backend/upload_receipt', postBody);
  
      if (response.status === 200) {
        toast.success(response.data.msg, {
          position: 'top-center',
        });
        setLoading(false);
  
        // Page Refresh after API call
        window.location.reload();
  
        // Form and Image Reset
        setFormData({
          upi_ref_id: '',
          amount: '',
          receipt: '',
        });
        setReceiptImage('');
      } else {
        toast.error(response.data.msg, {
          position: 'top-center',
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error uploading receipt:', error);
      toast.error('An error occurred while uploading receipt.', {
        position: 'top-center',
      });
      setLoading(false);
    }
  };
  const uploadReciept = (
    <div className='d-flex ' style={{ width: '100%' }}>
      <div style={{ width: '30%', marginTop: 65, marginBottom: 30, marginLeft: 40 }}>
        <h6>Receipt</h6>
        {recieptImage ? (
          <div
            style={{
              border: '4px dotted gray',
              width: '100%',
              height: 200,
              borderRadius: '10px',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div
              onClick={() => setReceiptImage('')}
              style={{
                justifyContent: 'flex-end',
                position: 'relative',
                backgroundColor: 'white',
                padding: 7,
                borderRadius: 50,
                left: "10px",
                width:"35px",
                zIndex:"1",
                cursor: 'pointer',
              }}
            >
              <ClearIcon style={{ color: 'red' }} />
            </div>
            <img
              src={recieptImage}
              alt='Uploaded Image'
              style={{ maxWidth: '100%', maxHeight: '100%', position:"relative", marginTop:"-35px" }}
            />
          </div>
        ) : (
          <div
            style={{
              border: '4px dotted gray',
              width: '100%',
              height: 200,
              borderRadius: '10px',
              justifyContent: 'center',
              textAlign: 'center',
              paddingTop: 40,
            }}
          >
            <h4 className='mx-10 mt-4'>Receipt Photo</h4>
            <button
              type='button'
              onClick={handleImageUpload}
              className='btn btn-lg btn-success me-3 mt-3'
              style={{ justifyContent: 'flex-end', backgroundColor: '#327113' }}
            >
              <span className='indicator-label'>Select Files</span>
            </button>
            <p className='text-bold pt-5 fs-9' style={{ color: '#555555' }}>
              Supports Image Only
            </p>
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept='.jpeg, .jpg, .pdf, .png'
              onChange={handleFileSelect}
            />
          </div>
        )}
      </div>
      <div
        className='d-flex flex-row-fluid flex-center bg-body rounded'
        style={{ width: '70%', backgroundColor: 'blue' }}
      >
        <Formik initialValues={initValues} onSubmit={() => { }}>
          {() => (
            <Form className='py-20 px-20' noValidate id='kt_create_account_form'>
              <div>
                <div className='fv-row mb-4'>
                  <label className='form-label required'>Transaction ID</label>
                  <Field
                    name='upi_ref_id'
                    style={{ ...inputStyle, width: '450px' }}
                    className='form-control form-control-lg form-control-solid'
                    onChange={(e) => handleFieldChange('upi_ref_id', e.target.value)}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='upi_ref_id' />
                  </div>
                </div>

                <div className='fv-row mb-4'>
                  <label className='d-flex align-items-center form-label'>
                    <span className='required'>Amount</span>
                  </label>
                  <Field
                    style={{ ...inputStyle, width: '450px' }}
                    name='amount'
                    className='form-control form-control-lg form-control-solid'
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                      handleFieldChange('amount', onlyNumbers);
                    }}
                    onKeyDown={(e) => {
                      if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 8)) {
                        e.preventDefault();
                      }
                    }}
                  />

                  <div className='text-danger mt-2'>
                    <ErrorMessage name='amount' />
                  </div>
                </div>
                {/* <FormGroup>
                  <FormControlLabel control={<Switch />} label="Issue for Api" />
                </FormGroup> */}

                <div className='pt-5 d-flex justify-content-center'>
                  <button
                    type='submit'
                    style={{ width: 200, backgroundColor: '#327113' }}
                    className='btn btn-success'
                    onClick={handleSaveClick}
                  >
                    {!loading && <span className='indicator-label'>Save</span>}
                    {loading && (
                      <span className='indicator-progress' style={{ display: 'block' }}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )

  const handleIssueApiClick = async (formValues) => {
    setLoading(true);
    try {
      const postBody = {
        upi_ref_id: formValues.upi_ref_id,
        merchant_id: user_id,
        receipt: formValues.receipt,
        amount: formValues.amount,
        type: 'Credit',
        category: 'API',
      };
  
      const response = await axiosInstance.post('/backend/upload_api_receipt', postBody);
  
      if (response.status === 200) {
        toast.success(response.data.msg, {
          position: 'top-center',
        });
          window.location.reload();
      } else {
        toast.error(response.data.msg, {
          position: 'top-center',
        });
      }
    } catch (error: any) {
      console.error('Error:', error.message);
      toast.error('An error occurred. Please try again.', {
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  const uploadIssueApiReciept = (
    <div className='d-flex ' style={{ width: '100%' }}>
      <div style={{ width: '40%', marginTop: 50, marginBottom: 30, marginLeft:"10%" }}>
        <h6>Receipt</h6>
        {recieptImage ? (
          <div
            style={{
              border: '4px dotted gray',
              width: '100%',
              height: 250,
              borderRadius: '10px',
              justifyContent: 'center',
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            <div
              onClick={() => setReceiptImage('')}
              style={{
                justifyContent: 'flex-end',
                position: 'absolute',
                backgroundColor: 'white',
                padding: 7,
                borderRadius: 50,
                cursor: 'pointer',
              }}
            >
              <ClearIcon style={{ color: 'red' }} />
            </div>
            <img
              src={recieptImage}
              alt='Uploaded Image'
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
        ) : (
          <div
            style={{
              border: '4px dotted gray',
              width: '100%',
              height: 250,
              borderRadius: '10px',
              justifyContent: 'center',
              textAlign: 'center',
              paddingTop: 40,
              marginTop: 20,
            }}
          >
            <h4 className='mx-10 mt-10'>Receipt Photo</h4>
            <button
              type='button'
              onClick={handleImageUpload}
              className='btn btn-lg btn-success me-3 mt-3'
              style={{ justifyContent: 'flex-end', backgroundColor: '#327113' }}
            >
              <span className='indicator-label'>Select Files</span>
            </button>
            <p className='text-bold pt-5 fs-9' style={{ color: '#555555' }}>
              Supports Image Only
            </p>
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept='.jpeg, .jpg, .pdf, .png'
              onChange={handleFileSelect}
            />
          </div>
        )}
      </div>
      <div
        className='d-flex flex-row-fluid flex-center bg-body rounded mt-10'
        style={{ width: '70%', backgroundColor: 'blue' }}
      >
        <Formik initialValues={initValues} onSubmit={() => { }}>
          {() => (
            <Form className='py-20 px-9' noValidate id='kt_create_account_form'>
              <div>
                <div className='fv-row mb-10'>
                  <label className='form-label required'>Transaction ID</label>
                  <Field
                    name='upi_ref_id'
                    style={{ ...inputStyle, width: '450px' }}
                    className='form-control form-control-lg form-control-solid'
                    onChange={(e) => handleFieldChange('upi_ref_id', e.target.value)}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='upi_ref_id' />
                  </div>
                </div>

                <div className='fv-row mb-10'>
                  <label className='d-flex align-items-center form-label'>
                    <span className='required'>Amount</span>
                  </label>
                  <Field
                    style={{ ...inputStyle, width: '450px' }}
                    name='amount'
                    className='form-control form-control-lg form-control-solid'
                    onChange={(e) => handleFieldChange('amount', e.target.value)}
                  />
                  <div className='text-danger mt-2'>
                    <ErrorMessage name='amount' />
                  </div>
                </div>
                {/* <FormGroup>
                  <FormControlLabel control={<Switch />} label="Issue for Api" />
                </FormGroup> */}

                <div className='pt-5 d-flex justify-content-center'>
                  <button
                    type='submit'
                    style={{ width: 200, backgroundColor: '#327113' }}
                    className='btn btn-success'
                    onClick={handleIssueApiClick}
                  >
                    {!loading && <span className='indicator-label'>Save</span>}
                    {loading && (
                      <span className='indicator-progress' style={{ display: 'block' }}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )

  const walletTabs = [
    {
      label: 'Bank Transfer (0% Fee)',
      content: bankContent,
      icon: <img src={bank} style={{ width: 25, height: 25 }} />,
    },
    { label: 'UPI (0% Fee)', icon: <img src={upi} style={{ width: 25, height: 25 }} />, content: upiContent },
    {
      label: 'Upload Receipt',
      icon: <img src={rec} style={{ width: 25, height: 25 }} />,
      content: uploadReciept,
    },
  ]

  const activeWalletTabContent = walletTabs.find((tab) => tab.label === activeWalletTab)?.content

  const loadWalletContent = (
    <div
      className='w-full mt-5 mx-10 px-10'
      style={{
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderColor: '#d3d3d3',
        border: '1px solid #d3d3d3',
        boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.2)',
        width: '95%',
        overflow: 'hidden',
      }}
    >
      <h2 style={{display:"flex", justifyContent:"center"}} className='pt-10 pb-5'>Load Wallet</h2>
      <hr style={{
        width:"70%",
        border: 0,
        height: "1px",
        backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))"
      }} />
      <div className='d-flex justify-content-content'>
        <div className='d-flex flex-column py-10' style={{ justifyContent: 'center' }}>
          {walletTabs.map((tab) => (
            <div
              key={tab.label}
              style={{
                padding: '20px 30px',
                marginTop: 20,
                width:"330px",
                display: 'flex',
                borderRadius:"20px",
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                alignItems: 'center',
                border: activeWalletTab === tab.label ? '2px solid #327113' : ' 0.5px solid #dadada',
                fontWeight: activeWalletTab === tab.label ? 'bold' : 'normal',
                color: activeWalletTab === tab.label ? '#327113' : '#333',
              }}
              onClick={() => handleWalletTabClick(tab.label)}
            >
              <div style={{ marginRight: 15 }}>{tab.icon}</div>
              <h3
                style={{
                  color: activeWalletTab === tab.label ? '#327113' : '#333',
                }}
              >
                {tab.label}
              </h3>
            </div>
          ))}
        </div>
        <div>{activeWalletTabContent}</div>
      </div>
      
    </div>
  )

    const filterData = (startDate: string, endDate: string) => {
    const filtered = transaction.filter((item) => {
      const transactionDate = item.created_at.split(' ')[0];
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset current page when applying filters
  };

  const handleDatePickerChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates.length === 2) {
      var x = dates[0]?.format('YYYY-MM-DD');
      var y = dates[1]?.format('YYYY-MM-DD');
      setIssueDate(x);
      setExpiryDate(y);
      
      const filtered = transaction.filter((item: Transaction) => {
        const transactionDate = moment(item.created_at);
        return transactionDate.isBetween(x, y, null, '[]');
      });
  
      setFilteredData(filtered);
      setCurrentPage(1);
    } else {
      setFilteredData(transaction);
      setCurrentPage(1);
    }
  };
  const [remainingBalance, setRemainingBalance] = useState("");

  function convertToCSV(data) {
    const csv = Papa.unparse(data);
    return csv;
  }

  function handleDownloadCSV() {
    const csvData = convertToCSV(transaction);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
  const transactionContent = (
    <div
      className='w-full mt-5 mx-10 pt-5'
      style={{
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderColor: '#d3d3d3',
        border: '1px solid #d3d3d3',
        boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.2)',
        width: '95%',
        overflow: 'hidden',
      }}
    >
      <div className='d-flex align-items-center px-10'>
        <div className='d-flex align-items-center' style={{ flex: 1 }}>
          <h2 className='' >Visa247 Wallet</h2>

        </div>

        <div className='fv-row w-50' style={{position:"relative", right:"4%"}}>
          
        <DatePicker.RangePicker
          style={{ backgroundClip: '#fff', width: 400, marginTop: 8, border: '2px solid #e5e5e5', borderRadius: 10, padding: 10 }}
          onCalendarChange={(dates, dateStrings) => {
            if (!dates) {
              // Date picker cancel hua hai, isliye original data ko set karo
              setTransaction(transaction);
            }
          }}
          onChange={handleDatePickerChange}
        />
        </div>

        <div
          className='px-5 py-2'
          style={{
            border: '1px solid #327113',
            borderRadius: 10,
            alignItems: 'center',
            display: 'flex',
            marginLeft: 'auto',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={handleDownloadCSV}
        >
          <h6 className='fs-4' style={{ marginTop: 5 }}>
            Download CSV
          </h6>
        </div>
      </div>

      <table className='table align-middle gs-10 mt-10'>
        {/* begin::Table head */}
        <thead >
        <tr style={{ background: '#F9FAFB', color: '#000'}} className='fw-bold'>
            <th className='min-w-100px'>Date/Time</th>
            <th className='min-w-100px'>Particular</th>
            <th className='min-w-100px'>Status</th>
            <th className='min-w-100px'>Credit</th>
            <th className='min-w-100px'>Debit</th>
            <th className='min-w-100px'>Wallet</th>
          </tr>
        </thead>
        {/* end::Table head */}
        {/* begin::Table body */}
        <tbody style={{borderBottom:"1px solid #cccccc"}} >
        {currentItems.map((item, index) => (
          <tr key={index}>
            <td className='text-start'>
              <a href='#' className='text-dark text-hover-primary mb-1 fs-6 '>
                {item && moment(item.created_at).format('DD MMM YYYY hh:mm a')}
              </a>
            </td>
            <td className='text-start'>
              <span className='text-dark d-block fs-6'>
                {item && item.category}
              </span>
            </td>
            <td className='text-start'>
              <span className='text-dark fw-semibold d-block fs-6'>
                {item && item.status}
              </span>
            </td>
            <td className='text-start'>
              {item && item.type === 'Credit' ? (
                <span className='text-dark d-block fs-6'>₹ {item.wallet_balance}/-</span>
              ) : "-"}
            </td>
            <td className='text-start'>
              {item && item.type === 'Debit' ? (
                <span className='text-dark d-block fs-6'>₹ {item.wallet_balance}/-</span>
              ) : "-"}
            </td>
            <td className='text-start'>
              <span className='text-dark fw-semibold d-block fs-6'>
                {item && item.remaining_balance}
              </span>
            </td>
          </tr>
        ))}

        </tbody>
        {/* end::Table body */}
      </table>
      <ul className='pagination mb-5'>
        {renderPageNumbers().map((page, index) => (
          <li
            key={index}
            className={`page-item ${page === '...' ? '' : (page === currentPage ? 'active' : '')}`}
            onClick={() => handlePageClick(page as number)}
          >
            {page === '...' ? (
              <span className="page-link">{page}</span>
            ) : (
              <a className="page-link" href="#">
                {page}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )


  function handleDownloadCSVRevenue() {
    // Convert revenue data to CSV
    const revenueCSVData = convertToCSV(revenue);

    // Create a Blob and generate a download link
    const blob = new Blob([revenueCSVData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue.csv';

    a.click();

    // Release the Object URL
    URL.revokeObjectURL(url);
}
  const revenueContent = (
    <div
      className='w-full mt-5 mx-10 pt-5'
      style={{
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderColor: '#d3d3d3',
        border: '1px solid #d3d3d3',
        boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.2)',
        width: '95%',
        overflow: 'hidden',
      }}
    >
      <div className='d-flex align-items-center px-10'>
        <div className='d-flex align-items-center' style={{ flex: 1 }}>
          <h2 className='' >Revenue</h2>

        </div>

        <div className='fv-row w-50' style={{position:"relative", right:"4%"}}>
          
        </div>

        <div
          className='px-5 py-2'
          style={{
            border: '1px solid #327113',
            borderRadius: 10,
            alignItems: 'center',
            display: 'flex',
            marginLeft: 'auto',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={handleDownloadCSVRevenue}
        >
          <h6 className='fs-4' style={{ marginTop: 5 }}>
            Download CSV
          </h6>
        </div>
      </div>

      <table className='table align-middle gs-10 mt-10'>
        {/* begin::Table head */}
        <thead >
        <tr style={{ background: '#F9FAFB', color: '#000'}} className='fw-bold'>
            <th className='min-w-100px'>Name</th>
            <th className='min-w-100px'>Transaction time</th>
            <th className='min-w-100px'>Application No.</th>
            <th className='min-w-100px text-center'>Paid</th>
            <th className='min-w-100px text-center'>Recieve</th>
            <th className='text-center min-w-100px'>Merchant Margin</th>
            {/* <th className='text-center min-w-150px'>Invoice</th> */}
          </tr>
        </thead>
        {/* end::Table head */}
        {/* begin::Table body */}
        <tbody style={{borderBottom:"1px solid #cccccc"}} >
        {currentItemsRevenue.map((item, index) => (

            <tr key={index}>
              <td className='text-start'>
                <a href='#' className='text-dark text-hover-primary mb-1 fs-6 '>
                  {item.name}
                </a>
              </td>
              <td className='text-start'>
                <span className='text-dark d-block fs-6'>
                  {formatDate1(item.transaction_time)}
                </span>
              </td>
              <td className='text-start'>
                <span className='text-dark d-block fs-6'>
                  {item.application_no}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark d-block fs-6'>
                  ₹ {item.paid}
                </span>

              </td>
              <td className='text-center'>
                <span className='text-dark d-block fs-6'>
                  ₹ {item.receive}
                </span>

              </td>
              <td className='text-center'>
                <span className='text-dark d-block fs-6'>
                  ₹ {item.revenue}
                </span>

              </td>
            </tr>
           ))} 

        </tbody>
        {/* end::Table body */}
      </table>
      <ul className='pagination mb-5'>
        {renderPageNumbersRevenue().map((page, index) => (
          <li
            key={index}
            className={`page-item ${page === '...' ? '' : (page === currentPageRevenue ? 'active' : '')}`}
            onClick={() => handlePageClickRevenue(page as number)}
          >
            {page === '...' ? (
              <span className="page-link">{page}</span>
            ) : (
              <a className="page-link" href="#">
                {page}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )

  const insuranceContent = (
    <div
      className='w-full mt-5 mx-10 pt-5'
      style={{
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderColor: '#d3d3d3',
        border: '1px solid #d3d3d3',
        boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.2)',
        width: '95%',
        overflow: 'hidden',
      }}
    >
      <div className='d-flex align-items-center px-10'>
        <div className='d-flex align-items-center' style={{ flex: 1 }}>
          <h2 className=''>Insurance Revenue</h2>
        </div>
  
        <div className='fv-row w-50' style={{ position: 'relative', right: '4%' }}>
          
        </div>
  
        <div
          className='px-5 py-2'
          style={{
            border: '1px solid #327113',
            borderRadius: 10,
            alignItems: 'center',
            display: 'flex',
            marginLeft: 'auto',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={handleDownloadCSVRevenue}
        >
          <h6 className='fs-4' style={{ marginTop: 5 }}>
            Download CSV
          </h6>
        </div>
      </div>
  
      <table className='table align-middle gs-10 mt-10'>
        {/* begin::Table head */}
        <thead>
          <tr style={{ background: '#F9FAFB', color: '#000' }} className='fw-bold'>
            <th className='min-w-100px'>Name</th>
            <th className='min-w-100px'>Transaction time</th>
            <th className='min-w-100px'>Application No.</th>
            <th className='min-w-100px text-center'>Paid</th>
            <th className='min-w-100px text-center'>Receive</th>
            <th className='text-center min-w-100px'>Merchant Margin</th>
          </tr>
        </thead>
        {/* end::Table head */}
        {/* begin::Table body */}
        <tbody style={{ borderBottom: '1px solid #cccccc' }}>
          {currentItemsInsurance.map((item, index) => (
            <tr key={index}>
              <td className='text-start'>
                <a href='#' className='text-dark text-hover-primary mb-1 fs-6'>
                  {item.name}
                </a>
              </td>
              <td className='text-start'>
                <span className='text-dark d-block fs-6'>
                  {formatDate1(item.transaction_time)}
                </span>
              </td>
              <td className='text-start'>
                <span className='text-dark d-block fs-6'>
                  {item.application_no}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark d-block fs-6'>₹ {item.paid}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark d-block fs-6'>₹ {item.receive}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark d-block fs-6'>₹ {item.revenue}</span>
              </td>
            </tr>
          ))}
        </tbody>
        {/* end::Table body */}
      </table>
      <ul className='pagination mb-5'>
        {renderPageNumbersInsurance().map((page, index) => (
          <li
            key={index}
            className={`page-item ${
              page === '...' ? '' : page === currentPage ? 'active' : ''
            }`}
            onClick={() => handlePageClick(page as number)}
          >
            {page === '...' ? (
              <span className='page-link'>{page}</span>
            ) : (
              <a className='page-link' href='#'>
                {page}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const flightContent = (
    <div
      className='w-full mt-5 mx-10 pt-5'
      style={{
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderColor: '#d3d3d3',
        border: '1px solid #d3d3d3',
        boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.2)',
        width: '95%',
        overflow: 'hidden',
      }}
    >
      <div className='d-flex align-items-center px-10'>
        <div className='d-flex align-items-center' style={{ flex: 1 }}>
          <h2 className=''>Flight Revenue</h2>
        </div>
  
        <div className='fv-row w-50' style={{ position: 'relative', right: '4%' }}>
          
        </div>
  
        <div
          className='px-5 py-2'
          style={{
            border: '1px solid #327113',
            borderRadius: 10,
            alignItems: 'center',
            display: 'flex',
            marginLeft: 'auto',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={handleDownloadCSVRevenue}
        >
          <h6 className='fs-4' style={{ marginTop: 5 }}>
            Download CSV
          </h6>
        </div>
      </div>
  
      <table className='table align-middle gs-10 mt-10'>
        {/* begin::Table head */}
        <thead>
          <tr style={{ background: '#F9FAFB', color: '#000' }} className='fw-bold'>
            <th className='min-w-100px'>Name</th>
            <th className='min-w-100px'>Transaction time</th>
            <th className='min-w-100px'>Application No.</th>
            <th className='min-w-100px text-center'>Paid</th>
            <th className='min-w-100px text-center'>Receive</th>
            <th className='text-center min-w-100px'>Merchant Margin</th>
          </tr>
        </thead>
        {/* end::Table head */}
        {/* begin::Table body */}
        <tbody style={{ borderBottom: '1px solid #cccccc' }}>
          {currentItemsFlight.map((item, index) => (
            <tr key={index}>
              <td className='text-start'>
                <a href='#' className='text-dark text-hover-primary mb-1 fs-6'>
                  {item.name}
                </a>
              </td>
              <td className='text-start'>
                <span className='text-dark d-block fs-6'>
                  {formatDate1(item.transaction_time)}
                </span>
              </td>
              <td className='text-start'>
                <span className='text-dark d-block fs-6'>
                  {item.application_no}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark d-block fs-6'>₹ {item.paid}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark d-block fs-6'>₹ {item.receive}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark d-block fs-6'>₹ {item.revenue}</span>
              </td>
            </tr>
          ))}
        </tbody>
        {/* end::Table body */}
      </table>
      <ul className='pagination mb-5'>
        {renderPageNumbersFlight().map((page, index) => (
          <li
            key={index}
            className={`page-item ${
              page === '...' ? '' : page === currentPage ? 'active' : ''
            }`}
            onClick={() => handlePageClick(page as number)}
          >
            {page === '...' ? (
              <span className='page-link'>{page}</span>
            ) : (
              <a className='page-link' href='#'>
                {page}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const hotelContent = (
    <div
      className='w-full mt-5 mx-10 pt-5'
      style={{
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderColor: '#d3d3d3',
        border: '1px solid #d3d3d3',
        boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.2)',
        width: '95%',
        overflow: 'hidden',
      }}
    >
      <div className='d-flex align-items-center px-10'>
        <div className='d-flex align-items-center' style={{ flex: 1 }}>
          <h2 className=''>Hotel Revenue</h2>
        </div>
  
        <div className='fv-row w-50' style={{ position: 'relative', right: '4%' }}>
          
        </div>
  
        <div
          className='px-5 py-2'
          style={{
            border: '1px solid #327113',
            borderRadius: 10,
            alignItems: 'center',
            display: 'flex',
            marginLeft: 'auto',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={handleDownloadCSVRevenue}
        >
          <h6 className='fs-4' style={{ marginTop: 5 }}>
            Download CSV
          </h6>
        </div>
      </div>
  
      <table className='table align-middle gs-10 mt-10'>
        {/* begin::Table head */}
        <thead>
          <tr style={{ background: '#F9FAFB', color: '#000' }} className='fw-bold'>
            <th className='min-w-100px'>Name</th>
            <th className='min-w-100px'>Transaction time</th>
            <th className='min-w-100px'>Application No.</th>
            <th className='min-w-100px text-center'>Paid</th>
            <th className='min-w-100px text-center'>Receive</th>
            <th className='text-center min-w-100px'>Merchant Margin</th>
          </tr>
        </thead>
        {/* end::Table head */}
        {/* begin::Table body */}
        <tbody style={{ borderBottom: '1px solid #cccccc' }}>
          {currentItemsHotel.map((item, index) => (
            <tr key={index}>
              <td className='text-start'>
                <a href='#' className='text-dark text-hover-primary mb-1 fs-6'>
                  {item.name}
                </a>
              </td>
              <td className='text-start'>
                <span className='text-dark d-block fs-6'>
                  {formatDate1(item.transaction_time)}
                </span>
              </td>
              <td className='text-start'>
                <span className='text-dark d-block fs-6'>
                  {item.application_no}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark d-block fs-6'>₹ {item.paid}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark d-block fs-6'>₹ {item.receive}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark d-block fs-6'>₹ {item.revenue}</span>
              </td>
            </tr>
          ))}
        </tbody>
        {/* end::Table body */}
      </table>
      <ul className='pagination mb-5'>
        {renderPageNumbersHotel().map((page, index) => (
          <li
            key={index}
            className={`page-item ${
              page === '...' ? '' : page === currentPage ? 'active' : ''
            }`}
            onClick={() => handlePageClick(page as number)}
          >
            {page === '...' ? (
              <span className='page-link'>{page}</span>
            ) : (
              <a className='page-link' href='#'>
                {page}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
  

    const user_type = Cookies.get('user_type');
    const role = formData2.issued_api.length > 0 ? "Partner" : "Retailer";
    (
      <>
        {user_type === "merchant" && (
          <HeaderWrapper role={role} />
        )}
      </>
    )
  

  const isuueAPIContent = (
    <div
      className='w-full mt-5 mx-10 pt-5'
      style={{
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderColor: '#d3d3d3',
        border: '1px solid #d3d3d3',
        boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.2)',
        width: '95%',
        overflow: 'hidden',
      }}
    >
      <div className='d-flex align-items-center px-10'>
        <div className='d-flex align-items-center' style={{ flex: 1 }}>
          <h2 className='' >API</h2>
        </div>
      </div>
      <hr />
      <div>

        <Formik initialValues={initValues} onSubmit={() => { }}>
          {() => (
            <Form className='py-10 px-9' noValidate id='kt_create_account_form'>
              <div>
                  {formData2.issued_api.length > 0 ? (
                  <div className='fv-row mb-10'>
                    <label className='d-flex align-items-center form-label'>
                      <span className='required mx-5'>API Key</span>
                    </label>
                    <Field
                      as='textarea'
                      rows={3}
                      style={{ ...inputStyle, width: '550px' }}
                      name='amount'
                      value={formData2.issued_api[0]}
                      className='form-control form-control-lg form-control-solid'
                    />
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='amount' />
                    </div>
                  </div>
                ) : (
                  <div className='pt-5 d-flex justify-content-center'>
                    <button
                      type='submit'
                      style={{ width: 200, backgroundColor: '#327113' }}
                      className='btn btn-success'
                      onClick={() => { setReceiptshow(true) }}
                    >
                      {!loading && <span className='indicator-label'>Issue API</span>}
                      {loading && (
                        <span className='indicator-progress' style={{ display: 'block' }}>
                          Please wait...
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )}
                    </button>
                  </div>
                )}
                {receiptShow &&

                  <div className='loader-overlay' style={{ ...overlayStyle, ...(receiptShow && activeOverlayStyle), }}>
                    <div style={contentStyle}>

                      <div onClick={() => setReceiptshow(false)} style={{ backgroundColor: '#d3d3d3', padding: "9px", position: "absolute", top: "15%", left: "84.5%", transform: "translate(-35%, -40%)", borderRadius: 20, cursor: 'pointer' }}>
                        <CloseOutlined />
                      </div>
                      {uploadIssueApiReciept}
                    </div>
                  </div>
                }
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )

  const commissionContent = (
    <div
      className='w-full mt-5 mx-10 pt-5'
      style={{
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderColor: '#d3d3d3',
        border: '1px solid #d3d3d3',
        boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.2)',
        width: '95%',
        overflow: 'hidden',
      }}
    >
      <div className='d-flex align-items-center px-10'>
        <div className='d-flex justify-content-center align-items-center' style={{ flex: 1 }}>
          <h2 className='' >Merchant Commission</h2>
        </div>
      </div>
      <hr style={{
        width:"70%",
        border: 0,
        height: "1px",
        backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))"
      }} />
      <div>

        <Formik initialValues={initValues} onSubmit={() => { }}>
          {() => (
            <Form className='py-10 px-9' noValidate id='kt_create_account_form'>
              <div>
                <div className='fv-row mb-10'>
                  <label className='d-flex align-items-start flex-column form-label'>
                    <span className='required mx-5'>Commisions</span> 
                    <p className='mx-5'>Tip - <span style={{color:"red"}}>Better to use up and down arrow for adjusting  the value.</span></p>
                  </label>

                  <div className='d-flex'>
                    <div className='fv-row mb-2'>
                    <Field
                      style={{
                        ...inputStyle,
                        width: 500,
                      }}
                      value={commission}
                      onChange={handleCommissionChange} // Call custom handler for input field change
                      placeholder='Commission'
                      name='commission'
                      max={upperLimit} // Set the maximum allowed value
                      type="number" // Set the input type to number for better validation
                      className='form-control form-control-lg form-control-solid '
                    />
                      <div className='text-danger mt-2'>
                        <ErrorMessage name='businessDescriptor' />
                      </div>

                    </div>

                  </div>

                  <div className='text-danger mt-2'>
                    <ErrorMessage name='amount' />
                  </div>
                </div>
                {/* <div style={{ width: 300 }}>
                  <Slider
                    min={0}
                    max={upperLimit} // Maximum value for the slider
                    step={0.1} // Step size for the slider
                    onChange={(e) => setCommission(e)}
                    railStyle={{
                      height: 5, // Adjust the line stroke width by changing the height
                      backgroundColor: 'lightgray', // Customize the rail color
                    }}
                    trackStyle={{
                      backgroundColor: '#327113', // Customize the track color
                    }}
                    handleStyle={{
                      borderColor: '#327113', // Customize the handle border color
                      backgroundColor: 'white', // Customize the handle background color
                    }}
                  />
                </div> */}
                <div className='pt-5 d-flex justify-content-center'>
                  <button
                    type='submit'
                    style={{ width: 200, backgroundColor: '#327113' }}
                    className='btn btn-success'
                    onClick={() => saveCommission()}
                  >
                    {!loading && <span className='indicator-label'>Set Commission</span>}
                    {loading && (
                      <span className='indicator-progress' style={{ display: 'block' }}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )

  const tabs = [
    {
      label: 'Profile',
      content: profileContent,
      icon: <FaUser style={{ width: 25, height: 25, marginTop:"-5px" }} />,
    },
    {
      label: 'Load Wallet',
      icon: <FaWallet style={{ width: 25, height: 25, marginTop:"-5px" }} />,
      content: loadWalletContent,
    },
    { label: 'Transactions', icon: <FaMoneyCheckDollar style={{ width: 25, height: 25, marginTop:"-5px" }} />, content: transactionContent },
    { label: 'Visa Revenue', icon: <BsClipboardDataFill style={{ width: 25, height: 25, marginTop:"-5px" }} />, content: revenueContent },
    { label: 'Insurance Revenue', icon: <BsClipboardDataFill style={{ width: 25, height: 25, marginTop:"-5px" }} />, content: insuranceContent },
    { label: 'Flight Revenue', icon: <BsClipboardDataFill style={{ width: 25, height: 25, marginTop:"-5px" }} />, content: flightContent },
    { label: 'Hotel Revenue', icon: <BsClipboardDataFill style={{ width: 25, height: 25, marginTop:"-5px" }} />, content: hotelContent },
    { label: 'Commisions', icon: <HiReceiptPercent style={{ width: 25, height: 25, marginTop:"-5px" }} />, content: commissionContent },
    ...(formData2.issued_api.length > 0
      ? [
          {
            label: 'API',
            icon: <FaFileCode style={{ width: 25, height: 25, marginTop:"-5px" }} />,
            content: isuueAPIContent,
          },
        ]
      : []),
  ];

  // Find the active tab's content
  const activeTabContent = tabs.find((tab) => tab.label === activeTab)?.content

  return (
    <div
      style={{
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        marginTop: -30,
        paddingTop: 20,
      }}
    >
      <Toaster />
      <div className='d-flex' style={{ alignItems: 'center', paddingLeft:"1%" }}>
        <img style={{borderRadius:"50%"}} src={formData2.merchant_profile_photo} alt='Profile photo' width={70} height={70} />
        <div className='px-10'>
          <h1 style={{ fontSize: 20 }}>Welcome {formData2.merchant_name}</h1>
          <h5 style={{ fontSize: 15 }}>{formData2.merchant_email_id}</h5>
        </div>
      </div>
      {/* Left Side */}
      <div className='d-flex'>
        <div className='' style={{ width: '20%', padding: '20px' }}>
          {tabs.map((tab) => (
            <div
              key={tab.label}
              style={{
                padding: '10px 0',
                marginTop: 20,
                display: 'flex',
                cursor: 'pointer',
                alignItems: 'center',
                borderBottom: '1px solid #ccc',
                fontWeight: activeTab === tab.label ? 'bold' : 'normal',
                color: activeTab === tab.label ? '#327113' : '#333',
              }}
              onClick={() => handleTabClick(tab.label)}
            >
              <div style={{ marginRight: 15 }}>{tab.icon}</div>
              <h3
                style={{
                  color: activeTab === tab.label ? '#327113' : '#333',
                }}
              >
                {tab.label}
              </h3>
            </div>
          ))}
        </div>

        {/* Right Side */}
        <div className='my-10' style={{ width: '80%' }}>
          <div>{activeTabContent}</div>
        </div>
      </div>
    </div>
  )
}

export default MerchantProfile