import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import Papa from 'papaparse';
import { Modal} from 'react-bootstrap';
import moment from 'moment';

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

const RevenueInsuranceTable: React.FC<Props> = ({ className, title, data, loading }) => {
  const [itemModalVisibility, setItemModalVisibility] = useState<Array<boolean>>(Array(data.length).fill(false));
  const formatDate1 = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = moment(date).format('DD MMM YYYY');
    const formattedTime = moment(date).format('hh:mm a');
    return `${formattedDate} ${formattedTime}`;
  };

  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteSelectedItem, setDeleteSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [issueDate, setIssueDate] = useState<string | undefined>('');
  const [expiryDate, setExpiryDate] = useState<string | undefined>('');
  const [filteredData, setFilteredData] = useState(data as any[]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDatePickerChange = (value: any) => {
    if (value && value.length === 2) {
      const startDate = value[0]?.isValid() ? value[0].format('YYYY-MM-DD') : '';
      const endDate = value[1]?.isValid() ? value[1].format('YYYY-MM-DD') : '';
      const filtered = (data as any[]).filter((item) => {
        const transactionDate = item.transaction_time.split(' ')[0];
        return transactionDate >= startDate && transactionDate <= endDate;
      });
      setIssueDate(startDate);
      setExpiryDate(endDate);
      setFilteredData(filtered);
    } else {

      setFilteredData(data as any[]);
    }
  };
  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = (data as any[]).filter((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          value && (value as any).toString().toLowerCase().includes(term)
      )
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

  const renderPageNumbers = Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, index) => index + 1)
    .map((number) => (
      <li
        key={number}
        className={`page-item ${number === currentPage ? 'active' : ''}`}
        onClick={() => setCurrentPage(number)}
      >
        <span className="page-link">{number}</span>
      </li>
    ));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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

          <input
            type='text'
            placeholder='Search...'
            onChange={handleSearch}
            value={searchTerm}
            style={{
              border: '1px solid #d3d3d3',
              borderRadius: '10px',
              padding: '10px',
              paddingLeft: '20px',
              width: '70%',
              boxSizing: 'border-box',
            }}
          />
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
            <section style={{border:"1px solid #adc6a0"}} className='w-100 card my-5 '>
            <div className='card-body py-3'>
              <div className='table-responsive'>
                <table className='table table-row-bordered table-row-gray-300 align-middle gs-0 gy-3'>
                  <thead>
                    <tr className='fw-bold '>
                      <th className='fs-5 min-w-160px'>Date</th>
                      <th className='fs-5 min-w-100px'>App. ID</th>
                      <th className='fs-5 min-w-100px'>Name</th>
                      <th className='fs-5 min-w-40px'>Channel</th>
                      <th className='fs-5 text-center min-w-70px'>Cost Price</th>
                      <th className='fs-5 text-center min-w-70px'>Selling Price</th>
                      <th className='fs-5 text-center min-w-70px'>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                  {currentItems.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <a href='#' className='text-gray-600 fw-bold text-hover-primary fs-7'>
                          {`${formatDate1(row.transaction_time)}`}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-gray-600 fw-bold text-hover-primary fs-7'>
                          {row.id}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                          <button onClick={() => {
                            const updatedVisibility = [...itemModalVisibility];
                            updatedVisibility[index] = true;
                            setItemModalVisibility(updatedVisibility);
                          }} style={{ backgroundColor: 'transparent', border: 'none' }}>
                            {row.name}
                          </button>
                          <Modal show={itemModalVisibility[index]} onHide={() => {
                            const updatedVisibility = [...itemModalVisibility];
                            updatedVisibility[index] = false;
                            setItemModalVisibility(updatedVisibility);
                          }}>
                            <Modal.Header closeButton>
                              <Modal.Title>Merchant Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                              <span className='d-flex'><h1 style={{fontSize:"16px", fontWeight:"600"}}>Merchant id -</h1><p style={{fontSize:"14px"}}>&nbsp;&nbsp;{row.id}</p></span>
                              <span className='d-flex'><h1 style={{fontSize:"16px", fontWeight:"600"}}>State -</h1><p style={{fontSize:"14px"}}>&nbsp;&nbsp;{row.address}</p></span>
                            </Modal.Body>
                          </Modal>
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                          {row.customer_type}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-center text-muted text-hover-primary d-block mb-1 fs-7'>
                          ₹ {new Intl.NumberFormat('en-IN').format(Number(row.paid))}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-center text-muted text-hover-primary d-block mb-1 fs-7'>
                         ₹ {new Intl.NumberFormat('en-IN').format(Number(row.receive))}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-center text-hover-primary d-block mb-1 fs-7'>
                          ₹ {new Intl.NumberFormat('en-IN').format(Number(row.revenue))}
                        </a>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
              <ul className="pagination">
                {renderPageNumbers}
              </ul>
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

export { RevenueInsuranceTable };
