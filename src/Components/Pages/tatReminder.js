import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const TATReminder = () => {
  const [showAllFields, setShowAllFields] = useState(false);
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
      referenceId: 'EMP001',
      employeeName: 'John Doen',
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
      sl: 3,
      tatDays: 5,
      initiationDate: '01-09-2024',
      referenceId: 'EMP001',
      employeeName: 'John Doee',
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

   
  ];

  // Function to filter table based on search
  const filteredData = tableData.filter(row =>
    row.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.referenceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle between showing all fields or only the first 6
  const toggleFields = () => {
    setShowAllFields(!showAllFields);
  };

  // Export table to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TAT Reminder');
    XLSX.writeFile(wb, 'TAT_Reminder.xlsx');
  };

  return (
    <div className="bg-[#c1dff2]">
<h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">TAT REMINDER</h2>
      <div className="bg-white p-12  w-full mx-auto">

        <div className="mb-4 text-center">
            <button
              onClick={toggleFields}
              className="bg-[#2c81ba] text-white rounded px-4 py-2 hover:bg-[#073d88]">
              {showAllFields ? 'Hide Columns' : 'Show Columns'}
            </button>
          </div>
        <div className="mb-4 flex justify-between">
        <button
            onClick={exportToExcel}
            className="bg-orange-500 text-white rounded px-4 py-2 hover:bg-orange-600 border">
            Export to Excel
          </button>
          <input
            type="text"
            placeholder="Search by Refference id or Employee Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-1/3"
          />
        
        </div>

        <div className="overflow-x-auto">
         

          <table className="min-w-full border-collapse border  rounded-lg overflow-scroll whitespace-nowrap">
            <thead className="rounded-lg">
              <tr className="bg-[#c1dff2] text-[#4d606b] rounded-lg">
                <th className="border  px-4 py-2">SL</th>
                <th className="border  px-4 py-2">TAT Days</th>
                <th className="border  px-4 py-2">Initiation Date</th>
                <th className="border  px-4 py-2">Reference Id</th>
                <th className="border  px-4 py-2">Name of the Employee</th>
                <th className="border  px-4 py-2">Exceeded Days</th>

                {showAllFields && (
                  <>
                    <th className="border  px-4 py-2">First Level Insufficiency Remarks</th>
                    <th className="border  px-4 py-2">First Insuff Date</th>
                    <th className="border  px-4 py-2">First Insuff Cleared</th>
                    <th className="border  px-4 py-2">Second Level Insufficiency Remarks</th>
                    <th className="border  px-4 py-2">Second Insuff Date</th>
                    <th className="border  px-4 py-2">Second Insuff Cleared</th>
                    <th className="border  px-4 py-2">Third Level Insufficiency Remarks</th>
                    <th className="border  px-4 py-2">Third Insuff Date</th>
                    <th className="border  px-4 py-2">Third Insuff Cleared</th>
                    <th className="border  px-4 py-2">Remarks & Reason for Delay</th>
                    <th className="border  px-4 py-2">Master Tracker</th>
                    <th className="border  px-4 py-2">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr className="text-center" key={index}>
                    <td className="border  px-4 py-2">{row.sl}</td>
                    <td className="border  px-4 py-2">{row.tatDays}</td>
                    <td className="border  px-4 py-2">{row.initiationDate}</td>
                    <td className="border  px-4 py-2">{row.referenceId}</td>
                    <td className="border  px-4 py-2">{row.employeeName}</td>
                    <td className="border  px-4 py-2">{row.exceededDays}</td>

                    {showAllFields && (
                      <>
                        <td className="border  px-4 py-2">{row.firstRemarks}</td>
                        <td className="border  px-4 py-2">{row.firstInsuffDate}</td>
                        <td className="border  px-4 py-2">{row.firstInsuffCleared}</td>
                        <td className="border  px-4 py-2">{row.secondRemarks}</td>
                        <td className="border  px-4 py-2">{row.secondInsuffDate}</td>
                        <td className="border  px-4 py-2">{row.secondInsuffCleared}</td>
                        <td className="border  px-4 py-2">{row.thirdRemarks}</td>
                        <td className="border  px-4 py-2">{row.thirdInsuffDate}</td>
                        <td className="border  px-4 py-2">{row.thirdInsuffCleared}</td>
                        <td className="border  px-4 py-2">{row.delayReason}</td>
                        <td className="border  px-4 py-2">{row.masterTracker}</td>
                        <td className="border  px-4 py-2">
                          <button className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600">
                            Action
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={showAllFields ? 18 : 6} className="border  px-4 py-2 text-center">
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

export default TATReminder;
