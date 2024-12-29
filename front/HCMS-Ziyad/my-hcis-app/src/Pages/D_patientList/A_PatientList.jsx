import React, { useState } from "react";
import CustomDropdown from "../../Components/D_PatientList/CustomDropdown";
import FilterDropdown from "../../Components/D_PatientList/FilterDropdown";
import PatientTable from "../../Components/D_PatientList/PatientTable";
import "./D_PatientList.css"; // Make sure to import the CSS file
import patientsData from "../../Components/D_PatientList/Patients.json"; // Import the JSON data

const A_PatientList = () => {
  const [number, setNumber] = useState(10); // Manage rows per page
  const [filter, setFilter] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(patientsData);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilter(newFilter);
  };

  const applyFilter = (filter) => {
    let filteredData = [...patientsData];
    switch (filter) {
      case "name-asc":
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filteredData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "date":
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "disease":
        filteredData.sort((a, b) => a.disease.localeCompare(b.disease));
        break;
      case "status":
        filteredData.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case "gender":
        filteredData.sort((a, b) => a.gender.localeCompare(b.gender));
        break;
      default:
        filteredData = patientsData;
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

export default A_PatientList;
