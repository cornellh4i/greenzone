import React, { useState } from 'react';
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
} from '@mui/material';

// Custom styled TablePagination to move everything to the left
const StyledTablePagination = styled(TablePagination)({
  '& .MuiToolbar-root': {
    padding: '0 8px',  // Reduce default padding
    minHeight: '52px', // Match default height
    display: 'flex',
    justifyContent: 'flex-start', // Align content to left
    width: '100%',
  },
  '& .MuiTablePagination-spacer': {
    display: 'none', // Remove the spacer that pushes content right
  },
  '& .MuiTablePagination-displayedRows': {
    margin: 0,
    order: 1, // Control the order of elements
  },
  '& .MuiTablePagination-actions': {
    marginLeft: '8px', // Space between text and arrows
    order: 2, // Control the order of elements
  },
  '& .MuiTablePagination-select, & .MuiTablePagination-selectLabel': {
    display: 'none', // Hide rows per page selector
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

const Table: React.FC<TableProps> = ({ columns, rows, loading = false, page: propPage, onPageChange }) => {
  const [internalPage, setInternalPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const page = propPage ?? internalPage;
  const setPage = onPageChange ?? setInternalPage;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Custom label display
  const labelDisplayedRows = ({ from, to, count }: { from: number; to: number; count: number }) => {
    return `${from}–${to} of ${count}`;
  };

  if (columns.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <TableContainer component={Paper} sx={{ 
        boxShadow: 'none',
        border: '1px solid rgba(224, 224, 224, 1)',
        borderRadius: '8px',
      }}>
        <MUITable sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#2F4F4F' }}>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    width: column.width,
                  }}
                >
                  {column.headerName}
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
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.ranking}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
                      '&:hover': { backgroundColor: '#e8e8e8' },
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
        </MUITable>
        <StyledTablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={labelDisplayedRows}
        />
      </TableContainer>
    </Box>
  );
};

export default Table;
