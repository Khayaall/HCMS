import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const FilterDropdown = ({ filter, setFilter }) => {
  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <FormControl
      // variant="outlined"
      size="small"
      style={{ minWidth: 100, backgroundColor: "var(--grey)" }}
    >
      <InputLabel style={{ color: "#666" }}>Filters</InputLabel>
      <Select
        value={filter}
        onChange={handleChange}
        label="Filters"
        style={{ color: "#666" }}
        inputProps={{
          style: { color: "#666" },
        }}
      >
        <MenuItem value="">None</MenuItem>
        <MenuItem value="name-asc">Patient Name (A-Z)</MenuItem>
        <MenuItem value="name-desc">Patient Name (Z-A)</MenuItem>
        <MenuItem value="date">Date</MenuItem>
        <MenuItem value="disease">Disease</MenuItem>
        <MenuItem value="status">Status</MenuItem>
        <MenuItem value="gender">Gender</MenuItem>
      </Select>
    </FormControl>
  );
};

export default FilterDropdown;
