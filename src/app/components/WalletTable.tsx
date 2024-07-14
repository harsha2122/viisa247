import React, { CSSProperties, useState, useEffect } from "react";
import { DatePicker } from "antd";
import Papa from "papaparse";
import moment from "moment";
import { CloseOutlined, DeleteOutline } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import WalletFormView from "./WalletFormView";
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from "../helpers/axiosInstance";
import { FcInfo } from "react-icons/fc";
import { FcFullTrash, FcExternal, FcCheckmark, FcCancel } from "react-icons/fc";
import { Tooltip, Pagination, Modal} from "react-bootstrap";
import { KTIcon } from "../../_metronic/helpers";

type Props = {
  className: string;
  title: String;
  data: any[];
  loading: Boolean;
};
const overlayStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  opacity: 0,
  visibility: "hidden",
  transition: "opacity 0.3s, visibility 0.3s",
};

const activeOverlayStyle: CSSProperties = {
  opacity: 1,
  visibility: "visible",
};
const contentStyle: CSSProperties = {
  backgroundColor: "#fff",
  padding: "10px",
  borderRadius: "5px",
  width: "70%",
  height: "70%",
  overflowY: "auto",
};

const ITEMS_PER_PAGE = 10;

const WalletTable: React.FC<Props> = ({ className, title, data, loading }) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItem1, setSelectedItem1] = useState(null);
  const [deleteSelectedItem, setDeleteSelectedItem] = useState(null);
  const [filter, setFilter] = useState("all");
  const [issueDate, setIssueDate] = useState<string | undefined>("");
  const [expiryDate, setExpiryDate] = useState<string | undefined>("");
  const [activePage, setActivePage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState(data as any[]);
  const [filteredDataa, setFilteredDataa] = useState(
    data.slice(0, ITEMS_PER_PAGE)
  );

  useEffect(() => {
    // Sort the entire dataset when it changes
    const sortedData = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setFilteredData(sortedData);
    setFilteredDataa(sortedData.slice(0, ITEMS_PER_PAGE));
    setActivePage(1);
  }, [data]);

  useEffect(() => {
    setFilteredDataa(data.slice(0, ITEMS_PER_PAGE));
  }, [data]);

  const calculateTotalPages = () => Math.ceil(data.length / ITEMS_PER_PAGE);

  const generatePaginationItems = () => {
    const totalPages = calculateTotalPages();

    if (totalPages <= 7) {
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
      if (activePage <= 4) {
        visiblePages = [1, 2, 3, 4, 5, '...', totalPages - 1, totalPages];
      } else if (activePage >= totalPages - 3) {
        visiblePages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        visiblePages = [1, '...', activePage - 1, activePage, Number(activePage) + 1, '...', totalPages.toString()];
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

  
  const handlePageChange = (page: number | string) => {
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setActivePage(pageNumber);
  
    let dataToDisplay: any[] = [];
  
    if (filter === "all") {
      dataToDisplay = data.slice(startIndex, endIndex);
    } else if (filter === "waitingForApproval") {
      dataToDisplay = data.filter((item) => item.status === "In-processed").slice(startIndex, endIndex);
    } else if (filter === "history") {
      dataToDisplay = data.filter((item) => item.status !== "In-processed").slice(startIndex, endIndex);
    } else {
      dataToDisplay = data.slice(startIndex, endIndex);
    }
  
    setFilteredDataa(dataToDisplay);
  };
  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = moment(date).format("DD MMM YYYY");
    const formattedTime = moment(date).format("hh:mm a");
    return `${formattedDate} ${formattedTime}`;
  };

  useEffect(() => {
    setFilteredDataa(filteredData.slice(0, ITEMS_PER_PAGE));
    setActivePage(1);
  }, [filteredData, ITEMS_PER_PAGE]);
  
  const handleDatePickerChange = (value: any) => {
    if (value && value.length === 2) {
      const startDate = value[0]?.isValid() ? value[0].format("YYYY-MM-DD") : "";
      const endDate = value[1]?.isValid() ? value[1].format("YYYY-MM-DD") : "";
      let filtered = data;
      
      if (startDate && endDate) {
        filtered = data.filter((item) => {
          const transactionDate = item.created_at.split(" ")[0];
          return transactionDate >= startDate && transactionDate <= endDate;
        });
      }
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setIssueDate(startDate);
      setExpiryDate(endDate);
      setFilteredData(filtered);

      setActivePage(1);

      setFilteredDataa(filtered.slice(0, ITEMS_PER_PAGE));
    } else {
      setFilteredData(data);
      setActivePage(1);
      setIssueDate("");
      setExpiryDate("");
      setFilteredDataa(data.slice(0, ITEMS_PER_PAGE));
    }
  };


  const handleDownloadCSVWalletTable = () => {
    const csvData = convertToCSV(filteredData);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wallet_table.csv";

    a.click();
    URL.revokeObjectURL(url);
  };

  function convertToCSV(data: any) {
    const csv = Papa.unparse(data);
    return csv;
  }

  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  const handleApproveConfirmation = (row) => {
    setOpen3(true);
    setSelectedItem(row);
  };

  const handleApproveClick = async (selectedItem) => {
    const response = await axiosInstance.post("/backend/approve_transaction", {
      wallet_id: selectedItem._id,
      merchant_id: selectedItem.merchant_id,
    });

    if (response.status == 200) {
      window.location.reload();
    } else {
      toast.error(response.data.msg, {
        position: "top-center",
      });
    }
  };

  const handleDeleteEntry = async (item) => {
    try {
      const response = await axiosInstance.post("/backend/delete_wallet_entry", {
        wallet_id: item._id,
      });
  
      if (response.status === 200) {
        toast.success(response.data.msg, {
          position: "top-center",
        });
  
        // Reload the page after successful deletion
        window.location.reload();
      } else {
        toast.error(response.data.msg, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  
  
  
  const handleClose1 = () => {
    setDeleteSelectedItem(null);
    setOpen1(false);
  };

  const handleClose2 = () => {
    setSelectedItem(null);
    setOpen2(false);
  };
  const handleClose3 = () => {
    setSelectedItem(null);
    setOpen3(false);
  };

  const handleVisibilityClick = (item) => {
    setSelectedItem(item);
    setVisible(true);
  };
  const handleCloseClick = () => {
    setSelectedItem(null);
    setVisible(false);
  };
  const sortedData = [...filteredDataa].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleDeleteConfirmation = (row) => {
    setOpen1(true);
    setDeleteSelectedItem(row);
  };

  const handleDeclineConfirmation = (row) => {
    setOpen2(true);
    setSelectedItem1(row);
  };

  const handleDeclineClick = async (selectedItem1) => {
    try {
      if (selectedItem1) {
        const response = await axiosInstance.post(
          "/backend/decline_transaction",
          {
            wallet_id: selectedItem1._id,
          }
        );
  
        if (response.status === 200) {
          window.location.reload();
          // Update the state with the new data after deletion
          setFilteredData((prevData) =>
            prevData.filter((entry) => entry._id !== selectedItem1._id)
          );
        } else {
          toast.error(response.data.msg, {
            position: "top-center",
          });
        }
      } else {
        toast.error("Selected entry is null", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("API error:", error);
    }
  
    setSelectedItem1(null);
    setOpen2(false);
  };
  
  
  
  const getFilteredData = () => {
    if (filter === "waitingForApproval") {
      return data.filter((item) => item.status === "In-processed");
    } else if (filter === "history") {
      return data.filter((item) => item.status !== "In-processed");
    } else {
      return data;
    }
  };
  
  const handleFilterClick = (filterType: string) => {
    setFilter(filterType);
    let filteredData: any[] = [];
  
    if (filterType === "waitingForApproval") {
      filteredData = data.filter((item) => item.status === "In-processed");
    } else if (filterType === "history") {
      filteredData = data.filter((item) => item.status !== "In-processed");
    } else {
      filteredData = data;
    }
  
    filteredData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
    setFilteredData(filteredData);
    setActivePage(1);
    setFilteredDataa(filteredData.slice(0, ITEMS_PER_PAGE));
  };
  return (
    <div style={{ boxShadow: "none" }} className={`card ${className}`}>
      <Toaster />
      <div className="card-header border-0 pt-5">
        <h3
          style={{ marginLeft: "10px" }}
          className="card-title align-items-center flex-row"
        >
          <span className="card-label fw-bold fs-3 mb-1">{title}</span>
        </h3>
        <div className="fv-row" style={{ position: "relative", right: "0%" }}>
          <DatePicker.RangePicker
            style={{
              backgroundClip: "#fff",
              width: 400,
              marginTop: 11,
              border: "1px solid #808080",
              borderRadius: 10,
              padding: 10,
            }}
            onChange={handleDatePickerChange}
          />
        </div>
        <div
          style={{
            gap: "10px",
            padding: "10px 0px",
          }}
          className="dropdown d-flex g-3"
        >
          <button
            style={{
              fontWeight: "600",
              right: "0%",
              padding: "0px 5px",
              backgroundColor: "transparent",
              color: "black",
              borderRadius: "10px",
              border: "1px solid #327113",
              zIndex: 1,
              width: "135px",
            }}
            onClick={handleDownloadCSVWalletTable}
          >
            Download CSV
          </button>
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filter
          </button>
          <ul className="dropdown-menu">
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => handleFilterClick("all")}
              >
                All
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => handleFilterClick("waitingForApproval")}
              >
                Waiting For Approval
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="card-body py-3">
        <div className="table-responsive">
          {loading ? (
            <div
              style={{
                height: 300,
                overflowX: "hidden",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <span className="indicator-progress" style={{ display: "block" }}>
                Please wait...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            </div>
          ) : (
            <section style={{border:"1px solid #adc6a0"}} className='w-100 card my-5 '>
            <div className='card-body py-3'>
              <div className='table-responsive'>
                <table className='table table-row-bordered table-row-gray-300 align-middle gs-0 gy-3'>
                  <thead>
                    <tr className='fw-bold '>
                      <th className='fs-5 min-w-160px'>Name</th>
                      <th className='fs-5 min-w-100px'>Company</th>
                      <th className='fs-5 min-w-100px'>Txn. ID</th>
                      <th className='fs-5 min-w-40px'>Amount</th>
                      <th className='fs-5 text-center min-w-40px'>Status</th>
                      <th className='fs-5 min-w-100px text-end'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {sortedData.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <a href='#' className='text-gray-600 fw-bold text-hover-primary fs-7'>
                          {`${formatDate(row.created_at)}`}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                            {row.merchant_name}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                          {row.merchant_company_name}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                          {row.upi_ref_id}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-center text-muted text-hover-primary d-block mb-1 fs-7'>
                          ₹{" "}
                          {new Intl.NumberFormat("en-IN").format(
                            Number(row.wallet_balance)
                          )}
                        </a>
                      </td>
                      <td className='text-end justify-content-end d-flex align-items-center gap-2'>
                        <button
                          title='Edit'
                          onClick={() => handleVisibilityClick(row)}
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        >
                          <KTIcon iconName='eye' className='fs-3' />
                        </button>
                        {row.status !== "In-processed" && (
                          <FcFullTrash
                            style={{ fontSize: "20px" }}
                            onClick={() => handleDeleteConfirmation(row)}
                            className="mx-2 cursor-pointer"
                            title="Delete Entry"
                          />
                        )}

                        {row.status === "In-processed" && (
                          <div className="d-flex align-items-center justify-content-center flex-shrink-0">
                            <FcCheckmark
                              style={{ fontSize: "20px" }}
                              className="mx-2 cursor-pointer"
                              title="Approve Transaction"
                              onClick={() => handleApproveConfirmation(row)}
                            />
                            <FcCancel
                              style={{ fontSize: "20px" }}
                              className="mx-2 cursor-pointer"
                              title="Decline Transaction"
                              onClick={() => handleDeclineConfirmation(row)}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          )}
        </div>
      </div>
      <div className='d-flex justify-content-center'>
        <Pagination>
          {generatePaginationItems()}
        </Pagination>
      </div>
      {visible && (
        <div
          className="loader-overlay"
          style={{ ...overlayStyle, ...(visible && activeOverlayStyle) }}
        >
          <div style={contentStyle}>
            <div
              onClick={() => handleCloseClick()}
              style={{
                backgroundColor: "#d3d3d3",
                padding: "9px",
                position: "absolute",
                top: "15%",
                left: "84.5%",
                transform: "translate(-35%, -40%)",
                borderRadius: 20,
                cursor: "pointer",
              }}
            >
              <CloseOutlined />
            </div>
            <WalletFormView viewApplication={selectedItem} />
          </div>
        </div>
      )}
      <div>
        <Dialog
          open={open1}
          onClose={handleClose1}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle
            style={{ cursor: "move", color: "red" }}
            id="draggable-dialog-title"
          >
            Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to Delete this transaction?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose1}>
              Cancel
            </Button>
            <Button onClick={handleDeleteEntry}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={open2}
          onClose={handleClose2}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle
            style={{ cursor: "move", color: "red" }}
            id="draggable-dialog-title"
          >
            Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to Decline this transaction?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose2}>
              Cancel
            </Button>
            <Button onClick={() => handleDeclineClick(selectedItem1)}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={open3}
          onClose={handleClose3}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle
            style={{ cursor: "move", color: "red" }}
            id="draggable-dialog-title"
          >
            Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to Approve this transaction?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose3}>
              Cancel
            </Button>
            <Button onClick={() => handleApproveClick(selectedItem)}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export { WalletTable };
