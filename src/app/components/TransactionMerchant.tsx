import React, { CSSProperties, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Pagination from 'react-bootstrap/Pagination';
import Papa from 'papaparse';
import moment from 'moment'

type TableRow = {
  created_at: string;
  wallet_balance: number;
  category: string;
  type: string;
  status: string;
  remaining_balance: string;
};

type Props = {
  className: string;
  title: String;
  data: TableRow[];
  loading: Boolean;
};

const TransactionMerchant: React.FC<Props> = ({ className, title, data, loading }) => {
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const startIndex = (activePage - 1) * itemsPerPage;
  const currentItemsRevenue = data.slice(startIndex, startIndex + itemsPerPage);

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
                    <th className='min-w-100px'>Date / Time</th>
                    <th className='min-w-100px'>Particular</th>
                    <th className='min-w-100px'>Status</th>
                    <th className='min-w-100px text-center'>Credit</th>
                    <th className='min-w-100px text-center'>Debit</th>
                    <th className='text-center min-w-100px'>Wallet</th>
                  </tr>
                </thead>
                <tbody style={{ borderBottom: '1px solid #cccccc' }}>
                  {currentItemsRevenue.map((item, index) => (
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
                      <td className='text-center'>
                        {item && item.type === 'Credit' ? (
                          <span className='text-dark d-block fs-6'>₹ {item.wallet_balance}/-</span>
                        ) : "-"}
                      </td>
                      <td className='text-center'>
                        {item && item.type === 'Debit' ? (
                          <span className='text-dark d-block fs-6'>₹ {item.wallet_balance}/-</span>
                        ) : "-"}
                      </td>
                      <td className='text-center'>
                        <span className='text-dark fw-semibold d-block fs-6'>
                          {item && item.remaining_balance}
                        </span>
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

export { TransactionMerchant };
