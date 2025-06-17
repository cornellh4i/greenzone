import React, { useState, useMemo } from "react";
import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TablePagination,
  styled,
  TableFooter,
} from "@mui/material";

const StyledTablePagination = styled(TablePagination)({
  "& .MuiToolbar-root": {
    padding: "0 8px",
    minHeight: "52px",
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
  },
  "& .MuiTablePagination-spacer": {
    display: "none",
  },
  "& .MuiTablePagination-displayedRows": {
    margin: 0,
    order: 1,
  },
  "& .MuiTablePagination-actions": {
    marginLeft: "8px",
    order: 2,
  },
  "& .MuiTablePagination-select, & .MuiTablePagination-selectLabel": {
    display: "none",
  },
});

interface TableProps {
  columns: {
    field: string;
    headerName: string;
    width?: number;
    format?: (value: any) => string;
  }[];
  rows: any[];
  loading?: boolean;
  page?: number;
  onPageChange?: (newPage: number) => void;
}

const Table: React.FC<TableProps> = ({
  columns,
  rows,
  loading = false,
  page: propPage,
  onPageChange,
}) => {
  const [internalPage, setInternalPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const page = propPage ?? internalPage;
  const setPage = onPageChange ?? setInternalPage;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field: string) => {
    setSortOrder((prev) =>
      sortField === field ? (prev === "asc" ? "desc" : "asc") : "asc"
    );
    setSortField(field);
  };

  const sortedRows = useMemo(() => {
    if (!sortField) return rows;

    const sorted = [...rows].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [rows, sortField, sortOrder]);

  const labelDisplayedRows = ({
    from,
    to,
    count,
  }: {
    from: number;
    to: number;
    count: number;
  }) => {
    return `${from}–${to} of ${count}`;
  };

  if (columns.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "none",
          border: "1px solid rgba(224, 224, 224, 1)",
          borderRadius: "8px",
        }}
      >
        <MUITable sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#2F4F4F" }}>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    width: column.width,
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => handleSort(column.field)}
                >
                  {column.headerName}
                  {sortField === column.field &&
                    (sortOrder === "asc" ? " ↑" : " ↓")}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              sortedRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.ranking || JSON.stringify(row)} // fallback key
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" },
                      "&:hover": { backgroundColor: "#e8e8e8" },
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.field}>
                        {column.format
                          ? column.format(row[column.field])
                          : row[column.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <StyledTablePagination
                rowsPerPageOptions={[10]}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelDisplayedRows={labelDisplayedRows}
              />
            </TableRow>
          </TableFooter>
        </MUITable>
        {/* <StyledTablePagination
          rowsPerPageOptions={[10]}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={labelDisplayedRows}
        /> */}
      </TableContainer>
    </Box>
  );
};

export default Table;
