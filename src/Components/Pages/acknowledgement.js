import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const Acknowledgement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Table data (replace with your actual data)
  const tableData = [
    {
      sl: 1,
      tatDays: 5,
      initiationDate: '01-09-2024',
      referenceId: 'EMP001',
      employeeName: 'John Doe',
      exceededDays: 2,
      firstRemarks: 'Incomplete documents',
      firstInsuffDate: '02-09-2024',
      firstInsuffCleared: 'Yes',
      secondRemarks: 'Pending signature',
      secondInsuffDate: '03-09-2024',
      secondInsuffCleared: 'Yes',
      thirdRemarks: 'Additional details needed',
      thirdInsuffDate: '04-09-2024',
      thirdInsuffCleared: 'No',
      delayReason: 'Delay due to incomplete submission',
      masterTracker: 'Track001',
    },
    {
      sl: 2,
      tatDays: 5,
      initiationDate: '01-09-2024',
      referenceId: 'EMP002',
      employeeName: 'Jane Smith',
      exceededDays: 3,
      firstRemarks: 'Missing verification',
      firstInsuffDate: '02-09-2024',
      firstInsuffCleared: 'No',
      secondRemarks: 'Pending review',
      secondInsuffDate: '03-09-2024',
      secondInsuffCleared: 'No',
      thirdRemarks: 'Under process',
      thirdInsuffDate: '04-09-2024',
      thirdInsuffCleared: 'No',
      delayReason: 'Documents pending',
      masterTracker: 'Track002',
    },
    // Add more unique rows here
  ];

  // Function to filter table based on search
  const filteredData = tableData.filter(row =>
    row.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.referenceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export table to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Acknowledgement');
    XLSX.writeFile(wb, 'Acknowledgement.xlsx');
  };

  return (
    <div className="bg-[#c1dff2]">
  <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">
    ACKNOWLEGDEMENT
  </h2>
  <div className="bg-white p-12 w-full mx-auto">
    <div className="mb-4 flex justify-between">
      <button
        onClick={exportToExcel}
        className="bg-orange-500 text-white rounded px-4 py-2 hover:bg-orange-600 border">
        Export to Excel
      </button>
      <input
        type="text"
        placeholder="Search by Reference ID or Employee Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-1/3"
      />
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border rounded-lg overflow-scroll whitespace-nowrap">
        <thead className="rounded-lg">
          <tr className="bg-[#c1dff2] text-[#4d606b] rounded-lg">
            <th className="border px-4 py-2">SL</th>
            <th className="border px-4 py-2">Client Code</th>
            <th className="border px-4 py-2">Company Name</th>
            <th className="border px-4 py-2">Application Count</th>
            <th className="border px-4 py-2">Case Rcvd Date</th>
            <th className="border px-4 py-2">Send Approvals</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <tr className="text-center" key={index}>
                <td className="border px-4 py-2">{row.sl}</td>
                <td className="border px-4 py-2">{row.tatDays}</td>
                <td className="border px-4 py-2">{row.initiationDate}</td>
                <td className="border px-4 py-2">{row.referenceId}</td>
                <td className="border px-4 py-2">{row.employeeName}</td>
                <td className="border px-4 py-2">
                  <button className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600">
                    Action
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border px-4 py-2 text-center">
                No data available in table
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

  );
};

export default Acknowledgement;
