
import { useState } from 'react';
import { Search, Filter, Edit2, Trash2 } from 'lucide-react';
import { Pagination } from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TableCell from '../SocialMediaCellFormatter/TableCell';

const TableWithActions = ({ title, tableHeader, tableData }) => {
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(tableData);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const [newRowData, setNewRowData] = useState(tableHeader.map(() => ''));
  const rowsPerPage = 10;

  // Processed Data: Filtered and Sorted
  const processedData = data
    .filter((row) =>
      row.some((cell) => {
        if (Array.isArray(cell)) {
          // Handle social links array
          return cell.some(
            (social) =>
              social.platform
                .toLowerCase()
                .includes(filterText.toLowerCase()) ||
              social.link.toLowerCase().includes(filterText.toLowerCase())
          );
        }
        return cell.toString().toLowerCase().includes(filterText.toLowerCase());
      })
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const columnIndex = tableHeader.indexOf(sortConfig.key);
      const aValue = a[columnIndex];
      const bValue = b[columnIndex];

      // Skip sorting for social links
      if (Array.isArray(aValue) || Array.isArray(bValue)) return 0;

      if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });

  // Pagination: Get current page data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = processedData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Handle Sorting
  const handleSort = (header) => {
    setSortConfig((prevConfig) => ({
      key: header,
      direction:
        prevConfig.key === header && prevConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    }));
  };

  // Handle Pagination
  const handlePageChange = (_, page) => {
    setCurrentPage(page);
  };

  // Handle Delete Row
  const handleDelete = () => {
    setData((prevData) => prevData.filter((_, index) => index !== rowToDelete));
    setDeleteModalOpen(false);
    setRowToDelete(null);
  };

  const confirmDelete = (rowIndex) => {
    setRowToDelete(rowIndex);
    setDeleteModalOpen(true);
  };

  // Handle Edit Row
  const handleEdit = (rowIndex) => {
    setEditRowIndex(rowIndex);
    setEditRowData(data[rowIndex]);
    setModalOpen(true);
  };

  // Save Edit
  const saveEdit = () => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[editRowIndex] = editRowData;
      return newData;
    });
    setModalOpen(false);
  };

  // Handle Add New Row
  const handleAddNewRow = () => {
    setData((prevData) => [...prevData, newRowData]);
    setAddModalOpen(false);
    setNewRowData(tableHeader.map(() => ''));
  };

  // Render input field based on header type
  const renderInputField = (header, value, onChange) => {
    if (header === 'Social Links') {
      return (
        <div className="space-y-2">
          {Array.isArray(value)
            ? value.map((social, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Platform"
                    value={social.platform || ''}
                    onChange={(e) => {
                      const newValue = [...value];
                      newValue[idx] = {
                        ...newValue[idx],
                        platform: e.target.value,
                      };
                      onChange(newValue);
                    }}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
                  />
                  <input
                    type="text"
                    placeholder="Link"
                    value={social.link || ''}
                    onChange={(e) => {
                      const newValue = [...value];
                      newValue[idx] = {
                        ...newValue[idx],
                        link: e.target.value,
                      };
                      onChange(newValue);
                    }}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
                  />
                </div>
              ))
            : null}
          <button
            onClick={() =>
              onChange([...(value || []), { platform: '', link: '' }])
            }
            className="text-sm text-violet-500/10 hover:text-violet-700/10"
          >
            + Add Social Link
          </button>
        </div>
      );
    }

    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring--violet-500/10"
      />
    );
  };

  return (
    <div className="p-4 rounded-lg w-full mx-auto border bg-gray-800 text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl font-bold font-poppins tracking-tight w-full text-center md:text-left">
          {title}
        </h2>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search table..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-transparent transition duration-300"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {paginatedData.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-600 bg-gray-700 rounded-lg shadow-md">
            <thead className="bg-violet-500/10 text-white">
              <tr>
                {tableHeader.map((header, index) => (
                  <th
                    key={index}
                    onClick={() => handleSort(header)}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer hover:bg-violet-700/10 transition duration-300"
                  >
                    <div className="flex items-center justify-between font-poppins">
                      {header}
                      <Filter className="h-4 w-4 text-gray-100 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-600 transition-colors duration-200 font-poppins text-sm tracking-tight"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-4 text-gray-300 whitespace-nowrap"
                    >
                      <TableCell value={cell} header={tableHeader[cellIndex]} />
                    </td>
                  ))}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400 flex gap-4">
                    <button
                      onClick={() => handleEdit(rowIndex)}
                      className="text-green-400 hover:text-green-500"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(rowIndex)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-300">No data available</div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          count={Math.ceil(processedData.length / rowsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>

      {/* Modals */}
      {/* Edit Row Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="edit-row-modal"
        aria-describedby="edit-row-modal-description"
      >
        <Box className="bg-white p-6 rounded-lg w-96 mx-auto">
          <h2 className="text-lg font-bold mb-4">Edit Row</h2>
          {tableHeader.map((header, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-semibold">{header}</label>
              {renderInputField(header, editRowData[index], (newValue) => {
                setEditRowData((prevData) => {
                  const updatedData = [...prevData];
                  updatedData[index] = newValue;
                  return updatedData;
                });
              })}
            </div>
          ))}
          <div className="flex justify-between">
            <button
              onClick={() => setModalOpen(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </Box>
      </Modal>

      {/* Add Row Modal */}
      {/* (similar to the Edit Row Modal, omitted for brevity) */}

      {/* Delete Row Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        aria-labelledby="delete-row-modal"
        aria-describedby="delete-row-modal-description"
      >
        <Box className="bg-white p-6 rounded-lg w-96 mx-auto">
          <h2 className="text-lg font-bold mb-4 text-red-600">Delete Row</h2>
          <p>Are you sure you want to delete this row?</p>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded-md"
            >
              Delete
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default TableWithActions;