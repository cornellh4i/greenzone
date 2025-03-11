import React, { useState, useEffect } from "react";
import Table from "../components/molecules/Table";
import {
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";

const ExampleTable = () => {
  // Define table columns
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "age", headerName: "Age", width: 150 },
  ];

  // Define state for rows, pagination, and sorting
  const [rows, setRows] = useState([]);
  const [dataSetLength, setDataSetLength] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5, // Number of rows per page
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  // Simulate fetching data (Replace this with API call)
  useEffect(() => {
    const fetchData = async () => {
      // Simulated API Data
      const fakeData = [
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
        { id: 3, name: "Charlie", age: 35 },
        { id: 4, name: "David", age: 28 },
        { id: 5, name: "Eve", age: 22 },
      ];

      setRows(fakeData);
      setDataSetLength(fakeData.length);
    };

    fetchData();
  }, [paginationModel, sortModel]); // Fetch data when pagination or sorting changes

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">User Table</h2>
      <Table
        columns={columns}
        rows={rows}
        dataSetLength={dataSetLength}
        paginationModel={paginationModel}
        sortModel={sortModel}
        handlePaginationModelChange={setPaginationModel}
        handleSortModelChange={setSortModel}
        loading={false} // Set to true when fetching data
      />
    </div>
  );
};

export default ExampleTable;
