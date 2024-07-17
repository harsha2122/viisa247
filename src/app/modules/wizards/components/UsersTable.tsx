import React, { useState, CSSProperties } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import toast, { Toaster } from 'react-hot-toast';

type Props = {
  className: string;
  data: any[];
  loading: boolean;
};

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
  backgroundColor: '#fff',
  padding: '10px',
  borderRadius: '5px',
  width: '70%',
  height: '70%',
  overflowY: 'auto',
};

const itemsPerPage = 10;

const calculateTotalPages = (filteredData: any[]) => {
  const totalItems = filteredData.length;
  return Math.ceil(totalItems / itemsPerPage);
};

const UsersTable: React.FC<Props> = ({ className, data, loading }) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [id, setId] = useState(null);
  const [activePage, setActivePage] = useState(1);

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  const getFilteredData = () => {
    return data;
  };

  const filteredData = getFilteredData();
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    let dayWithSuffix;
    if (day === 1 || day === 21 || day === 31) {
      dayWithSuffix = `${day}st`;
    } else if (day === 2 || day === 22) {
      dayWithSuffix = `${day}nd`;
    } else if (day === 3 || day === 23) {
      dayWithSuffix = `${day}rd`;
    } else {
      dayWithSuffix = `${day}th`;
    }
  
    return `${dayWithSuffix} ${month} ${year}`;
  };


  return (
    <div style={{ backgroundColor: '#fff' }} className='w-full'>
      <Toaster />
      <div style={{ boxShadow: 'none' }} className={`card ${className}`}>
        <div className='card-header border-0 pt-5'>
          <h3 style={{ marginLeft: '10px' }} className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Retailer Statistics</span>
            <span className='text-muted mt-1 fw-semibold fs-7'>{data.length} Member</span>
          </h3>
        </div>
        <div className='card-body py-3'>
          <div className='tab-content'>
            <div className='tab-pane fade show active' id='kt_table_widget_6_tab_1'>
              <div className='table-responsive'>
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
                  <section style={{ border: '1px solid #adc6a0' }} className='w-100 card my-5'>
                    <div style={{ borderBottom: '1.5px solid #327113' }} className='card-header'>
                      <h3 className='card-title align-content-start flex-row'>
                        <span className='card-label text-gray-600 fw-bold fs-3'>Recent Users</span>
                      </h3>
                    </div>
                    <div className='card-body py-3'>
                      <div className='table-responsive'>
                        <table className='table table-row-bordered table-row-gray-300 align-middle gs-0 gy-3'>
                          <thead>
                            <tr className='fw-bold'>
                              <th className='fs-5 min-w-180px'>Name</th>
                              <th className='fs-5 min-w-100px'>Email</th>
                              <th className='fs-5 min-w-100px'>Contact</th>
                              <th className='fs-5 min-w-100px'>Joined Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedData.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <a href='#' className='text-gray-600 fw-bold text-hover-primary fs-7'>
                                    {item.user_name}
                                  </a>
                                </td>
                                <td>
                                  <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                                    {item.user_email_id}
                                  </a>
                                </td>
                                <td>
                                  <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                                    {item.user_phone_number}
                                  </a>
                                </td>
                                <td>
                                  <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                                    {formatDate(item.created_at)}
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                )}
                {calculateTotalPages(filteredData) > 1 && (
                  <Pagination>
                    {Array.from({ length: calculateTotalPages(filteredData) }).map((_, index) => (
                      <Pagination.Item
                        key={index}
                        active={index + 1 === activePage}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UsersTable };
