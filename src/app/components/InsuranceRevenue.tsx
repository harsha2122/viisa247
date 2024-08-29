import React, { CSSProperties, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Pagination from 'react-bootstrap/Pagination';
import Papa from 'papaparse';

interface InsurancePayload {
  id: string;
  insurance_status: string;
  insurance_remark?: string;
  insurance_pdf?: string;
}

type TableRow = InsurancePayload & {
  name: string;
  merchant_email_id: string;
  merchant_phone_number: string;
  nationality: string;
  insurance_amount: string;
  _id: string;
  transaction_time: string;  // Assuming this exists in the data
  application_no: string;    // Assuming this exists in the data
  paid: number;
  receive: number;
  revenue: number;
};

type Props = {
  className: string;
  title: string;
  data: TableRow[];
  loading: boolean;
};

const InsuranceRevenue: React.FC<Props> = ({ className, title, data, loading }) => {
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const MAX_VISIBLE_PAGES = 7; 
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItemsInsurance = data.slice(startIndex, endIndex); // Extract current items for the active page

  const visiblePages: (number | string)[] = [];

  const addVisiblePage = (page: number | string) => {
    visiblePages.push(page);
  };

  const addRangeOfPages = (start: number, end: number) => {
    for (let i = start; i <= end; i++) {
      addVisiblePage(i);
    }
  };

  if (totalPages <= MAX_VISIBLE_PAGES) {
    addRangeOfPages(1, totalPages);
  } else {
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
  }

  const formatDate1 = (dateString: string) => {
    const date = new Date(dateString);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  function convertToCSV(data: TableRow[]) {
    return Papa.unparse(data);
  }

  function handleDownloadCSVRevenue() {
    const revenueCSVData = convertToCSV(currentItemsInsurance);
    const blob = new Blob([revenueCSVData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)'}} className={`card ${className} pb-4`}>
      <Toaster />
      <div className='card-body py-3'>
        <div className='table-responsive'>
          {loading ? (
            <div style={{ height: 300, overflowX: 'hidden', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <span className='indicator-progress' style={{ display: 'block' }}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            </div>
          ) : (
            <div className='w-full mt-5 mx-10'>
              <div className='d-flex align-items-center px-10'>
                <div className='d-flex align-items-center' style={{ flex: 1 }}>
                  <h2>Insurance Revenue</h2>
                </div>
                <div
                  className='px-5 py-2'
                  style={{
                    border: '1px solid #327113',
                    borderRadius: 10,
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
              </table>
            </div>
          )}
          <div className='d-flex justify-content-center'>
            <Pagination>
              {visiblePages.map((page, index) => (
                <Pagination.Item
                  key={index}
                  active={page === activePage}
                  onClick={() => handlePageChange(typeof page === 'number' ? page : activePage)}
                >
                  {page}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export { InsuranceRevenue };
