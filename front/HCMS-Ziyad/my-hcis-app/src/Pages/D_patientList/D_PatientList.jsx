import React, { useContext, useState, useEffect } from "react";
import CustomDropdown from "../../Components/D_PatientList/CustomDropdown";
import FilterDropdown from "../../Components/D_PatientList/FilterDropdown";
import PatientTable from "../../Components/D_PatientList/PatientTable";
import { MergedDataContext } from "../../Components/APIs/AppointmentsWithPatients"; // Adjust the import path if needed
import "./D_PatientList.css";

const D_PatientList = () => {
  const mergedData = useContext(MergedDataContext); // Consume the context
  const [number, setNumber] = useState(10); // Manage rows per page
  const [filter, setFilter] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setFilteredPatients(mergedData);
  }, [mergedData]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilter(newFilter);
  };

  const applyFilter = (filter) => {
    let filteredData = [...mergedData];
    switch (filter) {
      case "name-asc":
        filteredData.sort((a, b) => a.patientName.localeCompare(b.patientName));
        break;
      case "name-desc":
        filteredData.sort((a, b) => b.patientName.localeCompare(a.patientName));
        break;
      case "date":
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "job":
        filteredData.sort((a, b) => a.job.localeCompare(b.job));
        break;
      case "patient_type":
        filteredData.sort((a, b) => a.patient_type.localeCompare(b.patient_type));
        break;
      default:
        filteredData = mergedData;
    }
    setFilteredPatients(filteredData);
  };

  // Pagination logic
  const indexOfLastRow = currentPage * number;
  const indexOfFirstRow = indexOfLastRow - number;
  const currentRows = filteredPatients.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredPatients.length / number)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(filteredPatients.length / number);
    const paginationButtons = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        paginationButtons.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={currentPage === i ? "active" : ""}
          >
            {i}
          </button>
        );
      }
    } else {
      paginationButtons.push(
        <button
          key={1}
          onClick={() => paginate(1)}
          className={currentPage === 1 ? "active" : ""}
        >
          1
        </button>
      );
      if (currentPage > 3) {
        paginationButtons.push(<span key="ellipsis1">...</span>);
      }
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        paginationButtons.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={currentPage === i ? "active" : ""}
          >
            {i}
          </button>
        );
      }
      if (currentPage < totalPages - 2) {
        paginationButtons.push(<span key="ellipsis2">...</span>);
      }
      paginationButtons.push(
        <button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className={currentPage === totalPages ? "active" : ""}
        >
          {totalPages}
        </button>
      );
    }

    return paginationButtons;
  };

  return (
    <div>
      <h2>Patients List</h2>
      <div className="top-row">
        <div className="entries-container">
          <h4>Show</h4>
          <CustomDropdown number={number} setNumber={setNumber} />
          <h4>entries</h4>
        </div>
        <div className="filter-container">
          <FilterDropdown filter={filter} setFilter={handleFilterChange} />
        </div>
      </div>
      <div>
        <PatientTable patients={currentRows} />
        <div className="pagination-container">
          <div className="pagination">
            <button
              className="arrow"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              &lsaquo;
            </button>
            {renderPaginationButtons()}
            <button
              className="arrow"
              onClick={handleNextPage}
              disabled={
                currentPage === Math.ceil(filteredPatients.length / number)
              }
            >
              &rsaquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D_PatientList;