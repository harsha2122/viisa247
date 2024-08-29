import React, { CSSProperties, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Pagination from 'react-bootstrap/Pagination';
import Papa from 'papaparse';

type TableRow = {
  name: string;
  transaction_time: string;
  application_no: string;
  paid: number;
  receive: number;
  revenue: number;
};

type Props = {
  className: string;
  title: String;
  data: TableRow[];
  loading: Boolean;
};

const VisaRevenue: React.FC<Props> = ({ className, title, data, loading }) => {
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const startIndex = (activePage - 1) * itemsPerPage;
  const currentItemsRevenue = data.slice(startIndex, startIndex + itemsPerPage);

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
    const revenueCSVData = convertToCSV(currentItemsRevenue);  // data ko directly pass karna hai yaha
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
            <div className='d-flex justify-content-center align-items-center'>
              <span className='indicator-progress'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            </div>
          ) : (
            <div className='w-full mt-5 mx-10'>
              <div className='d-flex align-items-center px-10'>
                <div className='d-flex align-items-center' style={{ flex: 1 }}>
                  <h2>Visa Revenue</h2>
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
                    <th className='min-w-100px text-center'>Recieve</th>
                    <th className='text-center min-w-100px'>Merchant Margin</th>
                  </tr>
                </thead>
                <tbody style={{ borderBottom: '1px solid #cccccc' }}>
                  {currentItemsRevenue.map((item, index) => (
                    <tr key={index}>
                      <td className='text-start'>
                        <a href='#' className='text-dark text-hover-primary mb-1 fs-6'>
                          {item.name}
                        </a>
                      </td>
                      <td className='text-start'>
                        <span className='text-dark d-block fs-6'>{formatDate1(item.transaction_time)}</span>
                      </td>
                      <td className='text-start'>
                        <span className='text-dark d-block fs-6'>{item.application_no}</span>
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
              {Array.from({ length: totalPages }).map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index + 1 === activePage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export { VisaRevenue };
