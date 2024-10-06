import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import Papa from 'papaparse';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../helpers/axiosInstance';
import img from '../../_metronic/assets/card/report3.jpg';
import { Pagination, Modal, Form, Button } from 'react-bootstrap';

type Props = {
  className: string;
  title: String;
  data: any[];
  loading: Boolean;
};

const ITEMS_PER_PAGE = 10;

const ReportTable: React.FC<Props> = ({ className, title, data, loading }) => {
  const [searchVisible, setSearchVisible] = useState(true);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [issueDate, setIssueDate] = useState<string | undefined>('');
  const [expiryDate, setExpiryDate] = useState<string | undefined>('');
  const [filteredData, setFilteredData] = useState(data as any[]);
  const [datePickerDisabled, setDatePickerDisabled] = useState(true);
  const [downloadCSVDisabled, setDownloadCSVDisabled] = useState(true);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [activePage, setActivePage] = useState<number>(1);
  const [filteredDataa, setFilteredDataa] = useState(
    filteredData.slice(0, ITEMS_PER_PAGE)
  );

  const [addModalShow, setAddModalShow] = useState(false);
  const [deductModalShow, setDeductModalShow] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState("");

  useEffect(() => {
    setFilteredDataa(filteredData.slice(0, ITEMS_PER_PAGE));
    setActivePage(1);
  }, [filteredData]);

  const calculateTotalPages = () => Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setFilteredDataa(filteredData.slice(startIndex, endIndex));
    setActivePage(page);
  };

  const notify = () => toast('Here is your toast.');
  const generatePaginationItems = () => {
    const totalPages = calculateTotalPages();
    const MAX_VISIBLE_PAGES = 7;

    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }).map((_, index) => (
        <Pagination.Item
          key={`page-${index + 1}`}
          active={index + 1 === activePage}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </Pagination.Item>
      ));
    } else {
      let visiblePages: (number | string)[] = [];

      const addVisiblePage = (page: number | string) => {
        visiblePages.push(page);
      };

      const addRangeOfPages = (start: number, end: number) => {
        for (let i = start; i <= end; i++) {
          addVisiblePage(i);
        }
      };

      if (activePage <= MAX_VISIBLE_PAGES - 3) {
        addRangeOfPages(1, MAX_VISIBLE_PAGES - 2);
        addVisiblePage('...');
        addVisiblePage(totalPages - 1);
        addVisiblePage(totalPages);
      } else if (activePage >= totalPages - (MAX_VISIBLE_PAGES - 4)) {
        addVisiblePage(1);
        addVisiblePage('...');
        addRangeOfPages(totalPages - (MAX_VISIBLE_PAGES - 3), totalPages);
      } else {
        addVisiblePage(1);
        addVisiblePage('...');
        addRangeOfPages(activePage - 1, activePage + 1);
        addVisiblePage('...');
        addVisiblePage(totalPages);
      }

      return visiblePages.map((page, index) => (
        <Pagination.Item
          key={`page-${index}`}
          active={page === activePage}
          onClick={() => handlePageChange(typeof page === 'number' ? page : activePage)}
        >
          {page === '...' ? (
            <span style={{ cursor: 'not-allowed' }}>{page}</span>
          ) : (
            page
          )}
        </Pagination.Item>
      ));
    }
  };

  const handleDatePickerChange = (value: any) => {
    if (value && value.length === 2) {
      const startDate = value[0]?.isValid() ? value[0].startOf('day').toISOString() : '';
      const endDate = value[1]?.isValid() ? value[1].endOf('day').toISOString() : '';

      const filtered = (data as any[]).filter((item) => {
        const transactionDate = moment(item.created_at).toISOString();
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      setIssueDate(startDate);
      setExpiryDate(endDate);
      setFilteredData(filtered);
      setDatePickerDisabled(false);
    } else {
      setFilteredData(data as any[]);
      setDatePickerDisabled(true);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.post('/backend/fetch_transaction_by_merchant', {
        merchant_email_id: searchTerm,
      });
      if (response.status === 200) {
        const searchData = response.data.data || [];
        setFilteredData(searchData);
        setRemainingBalance(response.data.remaining_balance);
        setSearchVisible(false);
        setVisible(true);
        setDatePickerDisabled(false);
        setDownloadCSVDisabled(false);
      } else {
        toast.error(response.data.msg, {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('API error:', error);
    }
  };

  const handleCancel = () => {
    setSearchVisible(true);
    setVisible(false);
    setSearchTerm('');
    setDatePickerDisabled(true);
    setDownloadCSVDisabled(true);
  };

  useEffect(() => {
    setDatePickerDisabled(true);
    setDownloadCSVDisabled(true);
  }, []);

  useEffect(() => {
    setFilteredData(data as any[]);
    setDatePickerDisabled(false);
  }, [data]);

  const handleDownloadCSVReportTable = () => {
    const csvData = convertToCSV(filteredData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wallet_report.csv';

    a.click();
    URL.revokeObjectURL(url);
  };

  function convertToCSV(data: any) {
    const csv = Papa.unparse(data);
    return csv;
  }

const getMerchantId = () => {
    if (filteredData.length > 0) {
      return filteredData[0].merchant_id; // Adjust this if the merchant_id is located under a different property
    }
    return '';
  };

  const handleAddBalance = async () => {
    try {
      const amount = parseFloat(balanceAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Amount should be greater than zero.');
        return;
      }
  
      const merchantId = getMerchantId();
  
      if (!merchantId) {
        toast.error('Merchant ID not found.');
        return;
      }
  
      const response = await axiosInstance.post('/backend/credit_wallet', {
        amount: amount,
        merchant_id: merchantId,
      });
  
      if (response.status === 200) {
        setRemainingBalance(prevBalance => Number(prevBalance) + amount);
        // **Update filteredData with Merchant ID**
        const newTransaction = {
          created_at: new Date(),
          category: 'Admin Reconciliation',
          status: 'Approved',
          type: 'Credit',
          wallet_balance: amount,
          remaining_balance: Number(remainingBalance) + amount,
          merchant_id: merchantId, // Add merchant_id in transaction row
        };
        setFilteredData(prevData => [newTransaction, ...prevData]); // Add new transaction with merchant_id
        toast.success('Balance added successfully!');
        setAddModalShow(false);
        setBalanceAmount('');
      } else {
        toast.error('Error adding balance.');
      }
    } catch (error) {
      console.error('API error:', error);
      toast.error('Error adding balance.');
    }
  };
  
  const handleDeductBalance = async () => {
    try {
      const amount = parseFloat(balanceAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Amount should be greater than zero.');
        return;
      }
  
      if (amount > remainingBalance) {
        toast.error('Deduction amount cannot exceed remaining balance.');
        return;
      }
  
      const merchantId = getMerchantId();
  
      if (!merchantId) {
        toast.error('Merchant ID not found.');
        return;
      }
  
      const response = await axiosInstance.post('/backend/debit_wallet', {
        amount: amount,
        merchant_id: merchantId,
      });
  
      if (response.status === 200) {
        setRemainingBalance(prevBalance => Number(prevBalance) - amount);
        // **Update filteredData with Merchant ID**
        const newTransaction = {
          created_at: new Date(),
          category: 'Admin Reconciliation',
          status: 'Approved',
          type: 'Debit',
          wallet_balance: amount,
          remaining_balance: Number(remainingBalance) - amount,
          merchant_id: merchantId, // Add merchant_id in transaction row
        };
        setFilteredData(prevData => [newTransaction, ...prevData]); // Add new transaction with merchant_id
        toast.success('Balance deducted successfully!');
        setDeductModalShow(false);
        setBalanceAmount('');
      } else {
        toast.error('Error deducting balance.');
      }
    } catch (error) {
      console.error('API error:', error);
      toast.error('Error deducting balance.');
    }
  };
  

  return (
    <div style={{ boxShadow: 'none' }} className={`card ${className}`}>
      <Toaster />
      {/* Begin Header */}
      <div className='card-header border-0 pt-5'>
        <h3 style={{ marginLeft: '10px' }} className='card-title align-items-center flex-row'>
          <span className='card-label fw-bold fs-3 mb-1'>{title}</span>
        </h3>
        {/* Other header elements */}
      </div>

      {/* Search and other components */}
      {searchVisible && (
        <div style={{ gap: '10px', display: 'flex', flexDirection: 'column', marginTop: '40px', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <img style={{ height: '700px', width: '700px', borderRadius: '20px' }} src={img} alt="" />
          <div style={{ display: 'flex', gap: '20px' }}>
            <input
              type='text'
              placeholder={`Enter Merchant's email...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 15px',
                fontSize: '14px',
                border: '1px solid #808080',
                borderRadius: '10px',
                width: '350px',
              }}
            />
            <button onClick={handleSearch} className='boton'>
              Search
            </button>
          </div>
        </div>
      )}

      {/* Visible data and modals */}
      {visible && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ marginTop: '40px', fontSize: '18px', fontWeight: '500' }}>
            Remaining Balance: 
            <span style={{ fontSize: '18px', color: '#327113', fontWeight: '600', marginLeft: '10px' }}>
              ₹{new Intl.NumberFormat('en-IN').format(Number(remainingBalance))}
            </span>
          </h1>

            <div className='d-flex gap-2'>
              <button onClick={handleCancel} style={{ fontWeight: '600', backgroundColor: '#d9534f', color: 'white', width: '150px', marginTop: '20px', padding: '10px 15px', borderRadius: '10px', border: '1px solid #d9534f', zIndex: 1, cursor: 'pointer' }}>
                Search for another
              </button>
              <button onClick={() => setAddModalShow(true)} style={{ fontWeight: '600', marginTop: '20px', padding: '10px 15px', background: '#327113', borderRadius: '10px', border: 'none', color: '#fff', zIndex: 1, cursor: 'pointer' }}>
                Add Balance
              </button>
              <button onClick={() => setDeductModalShow(true)} style={{ fontWeight: '600', marginTop: '20px', padding: '10px 15px', background: '#327113', borderRadius: '10px', border: 'none', color: '#fff', zIndex: 1, cursor: 'pointer' }}>
                Deduct Balance
              </button>
            </div>
          </div>
          <table className='table align-middle gs-10 mt-5'>
            <thead>
              <tr style={{ background: '#f2f2f2', color: '#000', border: '1px solid #000' }} className='fw-bold'>
                <th className='min-w-100px'>Date/Time</th>
                <th className='min-w-100px'>Particular</th>
                <th className='min-w-100px'>Status</th>
                <th className='min-w-100px'>Credit</th>
                <th className='min-w-100px'>Debit</th>
                <th className='min-w-100px'>Wallet</th>
              </tr>
            </thead>
            <tbody style={{ border: '1px solid #cccccc' }}>
              {filteredDataa.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td className='text-start'>
                    <a href='#' className='text-dark fw-bold text-hover-primary mb-1 fs-6'>
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
                      <span className='text-dark d-block fs-6'>₹ {new Intl.NumberFormat('en-IN').format(Number(item.wallet_balance))}/-</span>
                    ) : "-"}
                  </td>
                  <td className='text-start'>
                    {item && item.type === 'Debit' ? (
                      <span className='text-dark d-block fs-6'>₹ {new Intl.NumberFormat('en-IN').format(Number(item.wallet_balance))}/-</span>
                    ) : "-"}
                  </td>
                  <td className='text-start'>
                    <span className='text-dark d-block fs-6'>
                      {item && new Intl.NumberFormat('en-IN').format(Number(item.remaining_balance))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Balance Modal */}
      <Modal show={addModalShow} onHide={() => setAddModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Balance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type='text'
            placeholder='Enter amount'
            value={balanceAmount}
            onChange={(e) => setBalanceAmount(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setAddModalShow(false)}>
            Close
          </Button>
          <Button variant='primary' onClick={handleAddBalance}>
            Add Balance
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Deduct Balance Modal */}
      <Modal show={deductModalShow} onHide={() => setDeductModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Deduct Balance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type='text'
            placeholder='Enter amount'
            value={balanceAmount}
            onChange={(e) => setBalanceAmount(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setDeductModalShow(false)}>
            Close
          </Button>
          <Button variant='primary' onClick={handleDeductBalance}>
            Deduct Balance
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export { ReportTable };
