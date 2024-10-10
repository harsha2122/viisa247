import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import Papa from 'papaparse';
import { Modal} from 'react-bootstrap';
import moment from 'moment';
import TablePagination from './TablePagination';

type Props = {
  className: string;
  title: string;
  data: any[];
  loading: boolean;
};

function convertToCSV(data: any) {
  const csv = Papa.unparse(data);
  return csv;
}

const TransactionTable: React.FC<Props> = ({ className, title, data, loading }) => {
  const [itemModalVisibility, setItemModalVisibility] = useState<Array<boolean>>(Array(data.length).fill(false));
  const formatDate1 = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = moment(date).format('DD MMM YYYY');
    const formattedTime = moment(date).format('hh:mm a');
    return `${formattedDate} ${formattedTime}`;
  };

  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteSelectedItem, setDeleteSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [issueDate, setIssueDate] = useState<string | undefined>('');
  const [expiryDate, setExpiryDate] = useState<string | undefined>('');
  const [filteredData, setFilteredData] = useState(data as any[]);

  const handleDatePickerChange = (value: any) => {
    if (value && value.length === 2) {
      const startDate = value[0]?.isValid() ? value[0].format('YYYY-MM-DD') : '';
      const endDate = value[1]?.isValid() ? value[1].format('YYYY-MM-DD') : '';
      const filtered = (data as any[]).filter((item) => {
        const transactionDate = item.created_at.split(' ')[0];
        return transactionDate >= startDate && transactionDate <= endDate;
      });
      setIssueDate(startDate);
      setExpiryDate(endDate);
      setFilteredData(filtered);
    } else {

      setFilteredData(data as any[]);
    }
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = (data as any[]).filter(
      (item) =>
        item.merchant_email_id?.toLowerCase().includes(term) ||
        item.customer_email_id?.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    setFilteredData(data as any[]);
  }, [data]);

  const handleDownloadCSVRevenueTable = () => {
    const csvData = convertToCSV(filteredData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue_table.csv';

    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ boxShadow: 'none' }} className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 style={{ marginLeft: '10px' }} className='card-title align-items-center flex-row'>
          <span className='card-label fw-bold fs-3 mb-1'>{title}</span>
        </h3>
        <div className='fv-row w-25' style={{ position: 'relative', right: '4%' }}>
          <DatePicker.RangePicker
            style={{
              backgroundClip: '#fff',
              width: 400,
              marginTop: 11,
              border: '1px solid #808080',
              borderRadius: 10,
              padding: 10,
            }}
            onChange={handleDatePickerChange}
          />
        </div>
        <div className=' d-flex gap-4 flex-row p-4 dropdown mx-5'>
          <input
            type='text'
            placeholder='Search by email'
            value={searchTerm}
            onChange={handleSearch}
            style={{
              padding: '8px',
              marginLeft: '10px',
              border: '1px solid #808080',
              borderRadius: '8px',
              width: '250px',
            }}
          />
          <button
            style={{
              fontWeight: '600',
              right: '6%',
              padding: '5px 18px',
              backgroundColor: 'transparent',
              color: 'black',
              borderRadius: '10px',
              border: '1px solid #327113',
              zIndex: 1,
              width: '160px',
            }}
            onClick={handleDownloadCSVRevenueTable}
          >
            Download CSV
          </button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          {loading ? (
            <div
              style={{
                height: 300,
                overflowX: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <span className='indicator-progress' style={{ display: 'block' }}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            </div>
          ) : (
            <>
            <section style={{boxShadow:"none"}} className='w-100 card my-5 '>
            <div className='card-body py-3'>
              <div className='table-responsive'>
              <table className='table align-middle gs-10 mt-5'>
                <thead>
                  <tr style={{ background: '#f2f2f2', color: '#000', border: '1px solid #000' }} className='fw-bold'>
                    <th className='min-w-100px'>Date/Time</th>
                    <th className='min-w-100px'>Particular</th>
                    <th className='min-w-100px'>Name</th>
                    <th className='min-w-100px'>Email</th>
                    <th className='min-w-100px'>Status</th>
                    <th className='min-w-100px'>Credit</th>
                    <th className='min-w-100px'>Debit</th>
                    <th className='min-w-100px'>Wallet</th>
                  </tr>
                </thead>
                <tbody style={{ border: '1px solid #cccccc' }}>
                  {currentItems.map((item, index) => (
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
                        <span className='text-dark d-block fs-6'>
                          {item && item.merchant_name || item.customer_name}
                        </span>
                      </td>
                      <td className='text-start'>
                        <span className='text-dark d-block fs-6'>
                          {item && item.merchant_email_id || item.customer_email_id}
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
            </div>
          </section>
          {!loading && (
            <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
            </>
          )}
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  );
};

export { TransactionTable };
