import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  Menu,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import PropTypes from 'prop-types';
import TablePagination from '@mui/material/TablePagination';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputAdornment  from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IoIosAddCircleOutline, IoIosTrash} from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";
import Swal from "sweetalert2";
import API_URL from './api';
import { IoClose } from "react-icons/io5"; 
import { FaRegEdit } from "react-icons/fa";
const ADL = () => {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [namesOpen, setNamesOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    pfo: '',
    adlNo: '',
    beneficiaries: '',
    actual: '',
    status: 'Pending',
    date_received_payroll: '',
    duration: '',
    location: '',
    budget: '',
    moi: '',
    project_title: '',
    receiver_payroll: '',
    district: '',
    poi: '',
    
  });
  const [names, setNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPFO, setSelectedPFO] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openRows, setOpenRows] = useState({});
  const [selectedTupadsId, setSelectedTupadsId] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const ITEMS_PER_PAGE = 7;
  const NAMES_PER_PAGE = 10;
  const formatDateTime = (dateString) => {
    return dateString ? new Date(dateString).toISOString().slice(0, 16) : "mm/dd/yyyy";
  };
  

  const handleDateChange = (name, newDate) => {
    setStatuses((prevStatuses) =>
      prevStatuses.map((status) =>
        status.name === name ? { ...status, date: newDate } : status
      )
    );
  };



  const formatDate = (date) => {
    return date && date !== "mm/dd/yyyy" ? date : null;
  };
  
  const handleSave = async () => {
    try {
        const payload = {
            tupad_id: selectedTupadsId,
            tssd: formatDate(statuses.find(s => s.name === "TSSD")?.date),
            r_tssd: formatDate(statuses.find(s => s.name === "Received from TSSD")?.date),
            budget: formatDate(statuses.find(s => s.name === "Budget")?.date),
            r_budget: formatDate(statuses.find(s => s.name === "Received from Budget")?.date),
            rt_budget: formatDate(statuses.find(s => s.name === "Return to Budget")?.date),
            accounting: formatDate(statuses.find(s => s.name === "Accounting")?.date),
            r_accounting: formatDate(statuses.find(s => s.name === "Return to Accounting")?.date),
        };

        console.log("Sending Payload:", payload);

        const response = await axios.post("http://localhost:8000/api/adl_papers", payload);

        console.log(response.data.message, response.data.data);

        Swal.fire({
            icon: "success",
            title: "Saved Successfully!",
            text: "Your data has been saved.",
            timer: 2000,
            showConfirmButton: false,
        });

        setStatusOpen(false);
        fetchTupadData(); // Refresh data after saving
    } catch (error) {
        console.error("Error saving data:", error.response?.data || error.message);

        Swal.fire({
            icon: "error",
            title: "Save Failed",
            text: error.response?.data?.message || "An error occurred while saving.",
        });
    }
};

const handleNameSave = async () => {
  try {
      const payload = {
          tupad_id: selectedTupadsId,
          tssd: formatDate(statuses.find(s => s.name === "TSSD")?.date),
          r_tssd: formatDate(statuses.find(s => s.name === "Received from TSSD")?.date),
          name: names, // include the array
      };

      console.log("Sending Payload:", payload);

      const response = await axios.post("http://localhost:8000/api/names", payload);

      console.log(response.data.message, response.data.data);

      Swal.fire({
          icon: "success",
          title: "Saved Successfully!",
          text: "Your data has been saved.",
          timer: 2000,
          showConfirmButton: false,
      });

      setNamesOpen(false);
      fetchTupadData(); // Refresh data after saving
  } catch (error) {
      console.error("Error saving data:", error.response?.data || error.message);

      Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: error.response?.data?.message || "An error occurred while saving.",
      });
  }
};

  
const filteredRows = rows.filter(row =>
  (!selectedPFO || row.pfo === selectedPFO) &&
  (
    (Array.isArray(row.adlNo) && row.adlNo.some(adl => 
      String(adl).toLowerCase().includes(searchQuery.toLowerCase()))
    ) ||
    (row.project_title && row.project_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (row.pfo && row.pfo.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (Array.isArray(row.history) && row.history.some(historyRow => 
      historyRow.dateReceived && historyRow.dateReceived.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  )
);




  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const handlePrint = () => {
    setOpenRows(prevState => {
      const allRows = {}; 
      rows.forEach((_, index) => {
        allRows[index] = true; 
      });
      return allRows;
    });
  
    setTimeout(() => {
      window.print();
    }, 500); 
  };

  
  

  const handleExport = () => {
    const headers = ["Series No", "ADL No", "PFO", "Beneficiaries", "Actual", "Status", "Date Received", "Duration", "Location", "Budget", "MOI", "Voucher Amount"];
    const csvRows = [];
  
    csvRows.push(headers.join(","));
  
    paginatedRows.forEach(row => {
      const history = Array.isArray(row.history) && row.history.length > 0 ? row.history[0] : {};
  
      const rowData = [
        row.adlNo,
        row.pfo,
        row.beneficiaries,
        row.actual,
        row.status,
        history.date_received_payroll || 'N/A',  
        history.duration || 'N/A',  
        history.location || 'N/A',  
        history.budget || '0',
        history.moi || '0',
      ];
      csvRows.push(rowData.join(","));
    });
  
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tupad_data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  

  
  const handleInputChange = async (field, value) => {
    const cleanValue = value.replace(/,/g, '');
  
    setNewEntry((prev) => {
      const updatedEntry = {
        ...prev,
        [field]: value,
      };
  
      const budget = Number(updatedEntry.budget?.replace(/,/g, '') || 0);
      const amount = Number(updatedEntry.amount?.replace(/,/g, '') || 0);
      const changeAmount = Number(updatedEntry.change_amount?.replace(/,/g, '') || 0);
  
      let obligated = 0;
      if (field === 'budget' || field === 'amount' || field === 'change_amount') {
        if (changeAmount > 0) {
          obligated = budget - changeAmount;
        } else {
          obligated = budget - amount;
        }
        updatedEntry.obligated_amount = obligated;
      }
  
      return updatedEntry;
    });
  
    // Keep the seriesNo logic
    if (field === "pfo" && value) {
      try {
        const response = await axios.get(`${API_URL}/api/tupads/latest-series/${value}`);
        const latestSeriesNo = response.data.latestSeriesNo || 0;
        const nextSeriesNo = String(latestSeriesNo + 1).padStart(3, "0");
  
        setNewEntry((prev) => ({
          ...prev,
          seriesNo: nextSeriesNo,
        }));
      } catch (error) {
        console.error("Error fetching latest series number:", error);
      }
    }
  };
  

  const resetForm = () => {
    setNewEntry({
      pfo: '',
      adlNo: [''],
      target: '',
      initial: '',
      status: 'Pending',
      date_received_payroll: '',
      duration: '',
      location: '',
      budget: '',
      moi: '',
      poi: '',
      district: '',
      receiver_payroll: '',
      project_title: '',
    });
  
    setAdlNumbers(['']); 
    setSelectedEntry(null);
  };
  
  
  const [adlNumbers, setAdlNumbers] = useState(['']);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const PFO_OPTIONS = ['CDO', 'BUKIDNON', 'TSSD', 'MISOR', 'MISOC', 'LDN', 'CAMIGUIN'];
  const DISTRICT_OPTIONS = ["1st", "2nd", "3rd", "4th"];

  const handleDistrictCheckboxChange = (option) => {
    let updated = newEntry.district.split(" ").filter(Boolean);
  
    if (updated.includes(option)) {
      updated = updated.filter(item => item !== option);
    } else {
      updated.push(option);
    }
  
    handleInputChange("district", updated.join(" "));
  };

  const fetchTupadData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tupads`);
      const data = response.data.data;
  
      const formattedData = data
        .map((item, index) => ({
          id: item.id || index,
          adlNo: item.adl_no,
          pfo: item.pfo,
          budget: item.budget,
          cut_off: item.cut_off,
          amount: item.amount,
          change_amount: item.change_amount,
          obligated_amount: item.obligated_amount,
          district: item.district,
          history: [
            {
              receiver_payroll: item.receiver_payroll,
              date_received_payroll: item.date_received_payroll || "N/A",
            },
          ],
        }))
        .filter(
          (row) =>
            !(
              row.status === "Implemented" &&
              (row.commited_status === "Late Received" ||
                row.commited_status === "Received") &&
              row.payment_status === "Paid"
            )
        );
  
      setRows(formattedData);
    } catch (error) {
      console.error("Error fetching Tupad data:", error);
    }
  };
  
  useEffect(() => {
    fetchTupadData();
  }, []);
  

  const handleEditEntry = (entry) => {
    console.log('Selected Entry:', entry); 
  
    setSelectedEntry(entry); 
    
    const cleanedAdlNumbers = entry.adlNo.map(adl => adl.split('-').pop());

    setNewEntry({
      pfo: entry.pfo || '',
      adlNo: cleanedAdlNumbers, 
      date_received_payroll: entry.history?.[0]?.date_received_payroll || '',
      budget: entry.budget || '',
      receiver_payroll: entry.history?.[0]?.receiver_payroll || '',
      district: entry.district || '',
      cut_off: entry.cut_off || '',
      amount: entry.amount || '',
      change_amount: entry.change_amount || '',
      obligated_amount: entry.obligated_amount || '',

    });

    setAdlNumbers(cleanedAdlNumbers);
    setModalOpen(true);
};

  
  

const handleAddNewEntry = () => {
  const formattedAdlNos = adlNumbers.map(adl => 
    adl.startsWith(`ADL-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-`) 
      ? adl 
      : `ADL-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${adl}`
  );

  const payload = {
    adl_no: formattedAdlNos,
    pfo: newEntry.pfo,
    date_received_payroll: newEntry.date_received_payroll,
    budget: parseFloat(newEntry.budget.replace(/,/g, '')),
    receiver_payroll: newEntry.receiver_payroll,
    district: newEntry.district,
    cut_off: newEntry.cut_off,
    amount: parseFloat(newEntry.amount.replace(/,/g, '')),
    change_amount: parseFloat(newEntry.change_amount.replace(/,/g, '')),
    obligated_amount: newEntry.obligated_amount,


  };

  if (selectedEntry) {
    axios.put(`http://localhost:8000/api/tupads/${selectedEntry.id}`, payload)
      .then((response) => {
        console.log('Entry updated successfully:', response.data);

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedEntry.id
              ? { ...row, ...response.data.data }
              : row
          )
        );

        Swal.fire({
          icon: "success",
          title: "Updated Successfully!",
          text: "The entry has been updated.",
          timer: 2000,
          showConfirmButton: false
        });

        setSelectedEntry(null);
        fetchTupadData();
      })
      .catch((error) => {
        console.error('Error updating entry:', error.response?.data || error.message);

        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: error.response?.data?.message || "An error occurred while updating.",
        });
      });
  } else {
    axios.post(`http://localhost:8000/api/tupads`, payload)
      .then((response) => {
        console.log('Entry created successfully:', response.data);

        setRows((prevRows) => [...prevRows, response.data.data]);
        fetchTupadData();

        Swal.fire({
          icon: "success",
          title: "Added Successfully!",
          text: "The new entry has been created.",
          timer: 2000,
          showConfirmButton: false
        });

      })
      .catch((error) => {
        console.error('Error creating entry:', error.response?.data || error.message);

        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: error.response?.data?.message || "An error occurred while adding the entry.",
        });
      });
  }
  
  setModalOpen(false);
};

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    return (
      <>    
       <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
       <TableCell>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "50px" }}>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </div>
        </TableCell>


          <TableCell align="center">
            {Array.isArray(row.adlNo) ? row.adlNo.join(" | ") : row.adlNo}
          </TableCell>
          <TableCell align="center">{row.district}</TableCell>
          <TableCell align="center">
            {Number(row.budget).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </TableCell>
          <TableCell align="center">{row.cut_off}</TableCell>
          <TableCell align="center">
            {Number(row.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </TableCell>
          <TableCell align="center">
            {Number(row.change_amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </TableCell>
          <TableCell align="center">
            {Number(row.obligated_amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </TableCell>
          <TableCell align="center">
          <Button
            variant="text" // Removes background color
            size="small"
            onClick={() => handleEditEntry(row)}
            sx={{
              minWidth: "auto",
              p: 1,
              backgroundColor: "transparent", // Ensures background is fully transparent
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" }, // Light hover effect
            }}
          >
            <FaRegEdit size={20} color="black" />
          </Button>
      </TableCell>

        </TableRow>

        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" className="tupad-collapse">
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Additional Details
                </Typography>
                <Table size="small" aria-label="details">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Received By</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Date Received</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Status History</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>Names</TableCell>
                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(Array.isArray(row.history) ? row.history : []).map((historyRow, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell align="center">{historyRow.receiver_payroll}</TableCell>
                          <TableCell align="center">{historyRow.date_received_payroll}</TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: "underline",
                                color: "blue",
                                cursor: "pointer",
                              }}
                              onClick={async () => {
                                console.log("Row Data:", row);
                                console.log("Tupad ID:", row.id);

                                if (!row.id) {
                                  console.error("Tupad ID is undefined for this row");
                                  return;
                                }

                                try {
                                  const response = await fetch(`http://localhost:8000/api/adl_papers/adl/${row.id}`);
                                  const data = response.ok ? await response.json() : {};
                                  console.log("Fetched Data:", data);


                                  setStatuses([
                                    { name: "TSSD", date: formatDateTime(data.tssd) || "" },
                                    { name: "Received from TSSD", date: formatDateTime(data.r_tssd) || "" },
                                    { name: "Budget", date: formatDateTime(data.budget) || "" },
                                    { name: "Received from Budget", date: formatDateTime(data.r_budget) || "" },
                                    { name: "Return to Budget", date: formatDateTime(data.rt_budget) || "" },
                                    { name: "Accounting", date: formatDateTime(data.accounting) || "" },
                                    { name: "Return to Accounting", date: formatDateTime(data.r_accounting) || "" },
                                  ]);

                                  setSelectedTupadsId(row.id);
                                  setStatusOpen(true);

                                } catch (error) {
                                  console.error("Error fetching data:", error);
                                  setStatusOpen(true);
                                }
                              } }
                            >
                              View Details
                            </Typography>
                          </TableCell>


                          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}


                          <TableCell align="center"> 
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: "underline",
                                color: "blue",
                                cursor: "pointer",
                              }}
                              onClick={async () => {
                                console.log("Row Data:", row);
                                console.log("Tupad ID:", row.id);

                                if (!row.id) {
                                  console.error("Tupad ID is undefined for this row");
                                  return;
                                }

                                try {
                                  const response = await fetch(`http://localhost:8000/api/names/names/${row.id}`);
                                  const data = response.ok ? await response.json() : {};
                                  console.log("Fetched Data:", data);


                                  setStatuses([
                                    { name: "TSSD", date: formatDateTime(data.tssd) || "" },
                                    { name: "Received from TSSD", date: formatDateTime(data.r_tssd) || "" },
                                  ]);

                                  setNames(data.name || []);

                                  setSelectedTupadsId(row.id);
                                  setNamesOpen(true);

                                } catch (error) {
                                  console.error("Error fetching data:", error);
                                  setNamesOpen(true);
                                }
                              } }
                            >
                              View Names
                            </Typography>
                          </TableCell>

                          {/* NAAAAAAAAAAAMESSSSS */}

                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
      
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      adlNo: PropTypes.string.isRequired,
      pfo: PropTypes.string.isRequired,
      beneficiaries: PropTypes.number.isRequired,
      actual: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          date_received_payroll: PropTypes.string.isRequired,
          duration: PropTypes.string.isRequired,
          location: PropTypes.string.isRequired,
          budget: PropTypes.number.isRequired,
        })
      ).isRequired,
    }).isRequired,
  };

  return (
    <div className="tupad-container">

    {/* INSERTING AND UPDATING MODAL */}
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
    <Box
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  }}
>
  {/* Header with Title and Close Button */}
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
    <Typography variant="h6" gutterBottom>
      {selectedEntry ? "Edit WP" : "Insert New WP"}
    </Typography>
    <IconButton 
      onClick={() => setModalOpen(false)} 
      sx={{ color: "red" }} // Set button color to red
    >
      <IoClose size={24} />
    </IconButton>

  </Box>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
        alignItems: "center",
      }}
    >
      <FormControl fullWidth>
        <InputLabel>PFO</InputLabel>
        <Select
          value={newEntry.pfo}
          onChange={(e) => handleInputChange("pfo", e.target.value)}
        >
          {PFO_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  {adlNumbers.map((adl, index) => (
    <Box
      key={index}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <TextField
        label={`ADL Number ${index + 1}`}
        value={adlNumbers[index]}
        onChange={(e) => {
          const updatedAdlNumbers = [...adlNumbers];
          updatedAdlNumbers[index] = e.target.value;
          setAdlNumbers(updatedAdlNumbers);
        }}
      />
      {adlNumbers.length > 1 && (
        <IconButton
          onClick={() => {
            const updatedAdlNumbers = adlNumbers.filter((_, i) => i !== index);
            setAdlNumbers(updatedAdlNumbers);
          }}
        >
          <IoIosTrash color="red" />
        </IconButton>
      )}
    </Box>
  ))}
  <IconButton onClick={() => setAdlNumbers([...adlNumbers, ""])}>
    <IoIosAddCircleOutline color="green" />
  </IconButton>
</Box>

      <TextField
        fullWidth
        label="Date Received"
        value={newEntry.date_received_payroll}
        onChange={(e) => handleInputChange("date_received_payroll", e.target.value)}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
      />
     <TextField
  fullWidth
  label="District"
  value={newEntry.district}
  onChange={(e) => handleInputChange("district", e.target.value)}
/>

      <TextField
        fullWidth
        label="Received By"
        value={newEntry.receiver_payroll}
        onChange={(e) => handleInputChange("receiver_payroll", e.target.value)}
      />
      <FormGroup row sx={{ mt: 1 }}>
  {DISTRICT_OPTIONS.map((option) => (
    <FormControlLabel
      key={option}
      control={
        <Checkbox
          checked={newEntry.district.split(" ").includes(option)}
          onChange={() => handleDistrictCheckboxChange(option)}
        />
      }
      label={option}
    />
  ))}
</FormGroup>
<TextField
  fullWidth
  label="Budget (₱)"
  value={newEntry.budget}
  onChange={(e) => {
    const rawValue = e.target.value.replace(/,/g, ''); // Remove existing commas
    if (!isNaN(rawValue)) {
      const formattedValue = Number(rawValue).toLocaleString(); // Add commas
      handleInputChange("budget", formattedValue);
    }
  }}
  inputProps={{ inputMode: 'numeric' }}
/>

<TextField
        fullWidth
        label="Cut Off"
        value={newEntry.cut_off}
        onChange={(e) => handleInputChange("cut_off", e.target.value)}
      />
      <TextField
  fullWidth
  label="Amount (₱)"
  value={newEntry.amount}
  onChange={(e) => {
    const rawValue = e.target.value.replace(/,/g, ''); // Remove existing commas
    if (!isNaN(rawValue)) {
      const formattedValue = Number(rawValue).toLocaleString(); // Add commas
      handleInputChange("amount", formattedValue);
    }
  }}
  inputProps={{ inputMode: 'numeric' }}
/>
<TextField
  fullWidth
  label="Change Amount (₱)"
  value={newEntry.change_amount}
  onChange={(e) => {
    const rawValue = e.target.value.replace(/,/g, ''); // Remove existing commas
    if (!isNaN(rawValue)) {
      const formattedValue = Number(rawValue).toLocaleString(); // Add commas
      handleInputChange("change_amount", formattedValue);
    }
  }}
  inputProps={{ inputMode: 'numeric' }}
/>
      <TextField
      fullWidth
      label="Obligated"
      value={newEntry.obligated_amount?.toLocaleString?.() || ""}
      InputProps={{ readOnly: true }}
    />



    </Box>
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
  <Button
    variant="contained"
    sx={{ ml: "auto" }}
    onClick={handleAddNewEntry}
  >
    Save
  </Button>
</Box>

  </Box>
</Modal>



      {/* STATUS MODAL */}

      <Modal open={statusOpen} onClose={() => setStatusOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 900,
      height: 580,
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Header with Close Button */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Implementation Status
      </Typography>
      <IconButton onClick={() => setStatusOpen(false)} sx={{ color: "red" }}>
        <IoClose size={24} />
      </IconButton>
    </Box>

    {/* Table Container */}
    <TableContainer component={Paper} sx={{ flex: 1, overflow: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Paper Status</strong></TableCell>
            <TableCell><strong>Date Received</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {statuses.length > 0 ? (
            statuses.slice(0, ITEMS_PER_PAGE).map((status, index) => (
              <TableRow key={index}>
                <TableCell>{status.name || "No Name"}</TableCell>
                <TableCell>
                  <TextField
                    type="datetime-local"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={status.date || ""}
                    onChange={(e) => handleDateChange(status.name, e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

    {/* Save Button */}
    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </Box>
  </Box>
</Modal>


{/* NAMES MODAL */}
<Modal open={namesOpen} onClose={() => setNamesOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 900,
      height: 580,
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Header */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Typography variant="h6">Names</Typography>
      <IconButton onClick={() => setNamesOpen(false)} sx={{ color: "red" }}>
        <IoClose size={24} />
      </IconButton>
    </Box>

    {/* Scrollable Two Column List */}
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        gap: 2,
        pr: 1,
      }}
    >
      {[0, 1].map((col) => (
        <Box key={col} sx={{ flex: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "20px" }}><strong>#</strong></TableCell>
                <TableCell sx={{ width: "100%" }}><strong>Name</strong></TableCell>
                <TableCell sx={{ width: "20px" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {names
                .slice(currentPage * 20 + col * 10, currentPage * 20 + col * 10 + 10)
                .map((name, index) => {
                  const globalIndex = currentPage * 20 + col * 10 + index;
                  return (
                    <TableRow key={globalIndex}>
                      <TableCell>{globalIndex + 1}</TableCell>
                      <TableCell sx={{ pr: 0 }}>
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={name}
                          onChange={(e) => {
                            const updated = [...names];
                            updated[globalIndex] = e.target.value;
                            setNames(updated);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            const updated = [...names];
                            updated.splice(globalIndex, 1);
                            setNames(updated);
                          }}
                        >
                          -
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Box>
      ))}
    </Box>

    {/* Pagination */}
    {/* Pagination */}
<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
  <Button
    variant="outlined"
    size="small"
    disabled={currentPage === 0}
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
    startIcon={<GrFormPrevious />}
  >
    Previous
  </Button>

  <Typography variant="body2">
    Page {currentPage + 1} of {Math.ceil(names.length / 20)}
  </Typography>

  <Button
    variant="outlined"
    size="small"
    disabled={(currentPage + 1) * 20 >= names.length}
    onClick={() => setCurrentPage((prev) => prev + 1)}
    endIcon={<GrFormNext />}
  >
    Next
  </Button>
</Box>


    {/* Add Name */}
    <Box sx={{ mt: 2 }}>
      <Button variant="outlined" size="small" onClick={() => setNames([...names, ""])}>
        + Add Name
      </Button>
    </Box>

    {/* Save Button */}
    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
      <Button variant="contained" color="primary" onClick={handleNameSave}>
        Save
      </Button>
    </Box>
  </Box>
</Modal>




    <h2>ADL MONITORING</h2>

    <Box 
  sx={{ 
    display: "flex", 
    justifyContent: "flex-end", // Align content to the right
    alignItems: "center", 
    width: "100%", // full width container
    paddingRight: "20px" // optional padding from right edge
  }}
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: "5px",
      width: "400px",
      height: "50px",
      padding: "0 8px",
      border: "1px solid #c4c4c4"
    }}
  >
    <FormControl
      size="small"
      sx={{
        width: "110px",
        marginRight: 1,
        backgroundColor: "transparent"
      }}
    >
      <Select
        displayEmpty
        value={selectedPFO}
        onChange={(e) => setSelectedPFO(e.target.value)}
        sx={{
          fontSize: "0.85rem",
          backgroundColor: "transparent",
          boxShadow: "none",
          ".MuiOutlinedInput-notchedOutline": { border: "none" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        disableUnderline
      >
        <MenuItem value="">
          <em>All PFOs</em>
        </MenuItem>
        {PFO_OPTIONS.map(pfo => (
          <MenuItem key={pfo} value={pfo}>{pfo}</MenuItem>
        ))}
      </Select>
    </FormControl>

    <Divider orientation="vertical" flexItem sx={{ marginRight: 1 }} />

    <InputAdornment position="start">
      <CiSearch size={18} />
    </InputAdornment>

    <input
      type="text"
      placeholder="Search here"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      style={{
        border: "none",
        outline: "none",
        flex: 1,
        fontSize: "0.85rem",
        padding: "8px",
        backgroundColor: "transparent"
      }}
    />
  </Box>
</Box>




    <TableContainer component={Paper} className="tupad-table">
      <Table aria-label="collapsible table">
              <TableHead 
          align="center"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#A4B465",
          }} 
          className="tupad-table-head"
        >
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "white" }} />
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>ADL No</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>DISTRICT</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>BUDGET (₱)</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>CUT OFF</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>AMOUNT</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>CHANGE AMOUNT</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>OBLIGATED</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row) => (
            <Row key={row.seriesNo} row={row} />
          ))}
        </TableBody>

      </Table>
    </TableContainer>

    {/* Pagination and Export Buttons */}
    <Box 
  sx={{ 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    width: "100%", 
    marginTop: "10px"
  }}
>
  {/* Pagination Component */}
  <TablePagination
    component="div"
    count={rows.length}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    rowsPerPageOptions={[5, 10, 20, 50, 100]}
  />

  {/* Export Button */}
  <Button
    variant="contained"
    onClick={handleClick}
    startIcon={<MdOutlineFileDownload />}
    sx={{ backgroundColor: "#A4B465", color: "white", "&:hover": { backgroundColor: "#A0C878" } }}
  >
    Export
  </Button>

  {/* Dropdown Menu */}
  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
    <MenuItem onClick={() => { handleExport(); handleClose(); }}>Download CSV</MenuItem>
    <MenuItem onClick={() => { handlePrint(); handleClose(); }}>Print</MenuItem>
  </Menu>
</Box>



  </div>
);

};

export default ADL;