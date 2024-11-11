import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const DataManagement = () => {
    const [data, setData] = useState([]);
    const [filterDate, setFilterDate] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // Fetch your data (e.g., from API) and set it in the state
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data); // Converts JSON to Excel sheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        XLSX.writeFile(workbook, 'DataManagement.xlsx'); // Saves file as Excel
    };

    const filteredData = data.filter(item => {
        return filterDate ? item.initiationDate.includes(filterDate) : true;
    });

    return (
        <div className="bg-[#c1dff2]">
  <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">
    DATA MANAGEMENT
  </h2>
            <div className="text-center  bg-white ">

                {/* Filter by Date */}
                <input
                    type="date"
                    value={filterDate}
                    onChange={e => setFilterDate(e.target.value)}
                    className="mb-4 p-2 border rounded mt-5"
                    placeholder="Filter by Initiation Date"
                />

                {/* Table */}
                <div className='overflow-scroll '>
                <table className="min-w-full border-collapse border rounded-lg ">
                    <thead>
                        <tr className="bg-[#c1dff2] text-[#4d606b] whitespace-nowrap">
                            <th className="border px-4 py-2">CLIENT CODE</th>
                            <th className="border px-4 py-2">REFERENCE ID</th>
                            <th className="border px-4 py-2">MONTH - YEAR</th>
                            <th className="border px-4 py-2">INITIATION DATE</th>
                            <th className="border px-4 py-2">NAME OF THE CLIENT ORGANIZATION</th>
                            <th className="border px-4 py-2">VERIFICATION PURPOSE</th>
                            <th className="border px-4 py-2">APPLICANT EMPLOYEE ID</th>
                            <th className="border px-4 py-2">NAME OF THE APPLICANT</th>
                            <th className="border px-4 py-2">CONTACT NUMBER</th>
                            <th className="border px-4 py-2">ALTERNATE NUMBER</th>
                            <th className="border px-4 py-2">FATHER FULL NAME</th>
                            <th className="border px-4 py-2">SPOUSE NAME</th>
                            <th className="border px-4 py-2">DATE OF BIRTH</th>
                            <th className="border px-4 py-2">GENDER</th>
                            <th className="border px-4 py-2">MARITAL STATUS</th>
                            <th className="border px-4 py-2">NATIONALITY</th>
                            <th className="border px-4 py-2">DATE OF DATA ENTRY</th>
                            <th className="border px-4 py-2">DATA ENTRY ANALYST NAME</th>
                            <th className="border px-4 py-2">DATA QC STATUS</th>
                            <th className="border px-4 py-2">QC ANALYST NAME</th>
                            <th className="border px-4 py-2">QC DATE</th>
                            <th className="border px-4 py-2">PERMANENT ADDRESS</th>
                            <th className="border px-4 py-2">CURRENT ADDRESS</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-t text-center">
                            <td className="border px-4 py-2">C001</td>
                            <td className="border px-4 py-2">REF123</td>
                            <td className="border px-4 py-2">2024-10</td>
                            <td className="border px-4 py-2">2024-10-01</td>
                            <td className="border px-4 py-2">Acme Corp</td>
                            <td className="border px-4 py-2">Employment Verification</td>
                            <td className="border px-4 py-2">APP123</td>
                            <td className="border px-4 py-2">John Doe</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">C001</td>
                            <td className="border px-4 py-2">REF123</td>
                            <td className="border px-4 py-2">2024-10</td>
                            <td className="border px-4 py-2">2024-10-01</td>
                            <td className="border px-4 py-2">Acme Corp</td>
                            <td className="border px-4 py-2">Employment Verification</td>
                            <td className="border px-4 py-2">APP123</td>
                            <td className="border px-4 py-2">APP123</td>
                            <td className="border px-4 py-2">John Doe</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>

                        </tr>
                        <tr className="border-t text-center">
                            <td className="border px-4 py-2">C002</td>
                            <td className="border px-4 py-2">REF456</td>
                            <td className="border px-4 py-2">2024-10</td>
                            <td className="border px-4 py-2">2024-10-02</td>
                            <td className="border px-4 py-2">Beta LLC</td>
                            <td className="border px-4 py-2">Identity Verification</td>
                            <td className="border px-4 py-2">APP456</td>
                            <td className="border px-4 py-2">Jane Smith</td>
                            <td className="border px-4 py-2">555-0456</td>
                            <td className="border px-4 py-2">C001</td>
                            <td className="border px-4 py-2">REF123</td>
                            <td className="border px-4 py-2">2024-10</td>
                            <td className="border px-4 py-2">2024-10-01</td>
                            <td className="border px-4 py-2">Acme Corp</td>
                            <td className="border px-4 py-2">Employment Verification</td>
                            <td className="border px-4 py-2">APP123</td>
                            <td className="border px-4 py-2">APP123</td>
                            <td className="border px-4 py-2">John Doe</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                        </tr>
                        <tr className="border-t text-center">
                            <td className="border px-4 py-2">C003</td>
                            <td className="border px-4 py-2">REF789</td>
                            <td className="border px-4 py-2">2024-09</td>
                            <td className="border px-4 py-2">2024-09-15</td>
                            <td className="border px-4 py-2">Gamma Industries</td>
                            <td className="border px-4 py-2">Background Check</td>
                            <td className="border px-4 py-2">APP789</td>
                            <td className="border px-4 py-2">Alice Johnson</td>
                            <td className="border px-4 py-2">555-0789</td>
                            <td className="border px-4 py-2">C001</td>
                            <td className="border px-4 py-2">REF123</td>
                            <td className="border px-4 py-2">2024-10</td>
                            <td className="border px-4 py-2">2024-10-01</td>
                            <td className="border px-4 py-2">Acme Corp</td>
                            <td className="border px-4 py-2">Employment Verification</td>
                            <td className="border px-4 py-2">APP123</td>
                            <td className="border px-4 py-2">APP123</td>
                            <td className="border px-4 py-2">John Doe</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                        </tr>
                        <tr className="border-t text-center">
                            <td className="border px-4 py-2">C004</td>
                            <td className="border px-4 py-2">REF012</td>
                            <td className="border px-4 py-2">2024-08</td>
                            <td className="border px-4 py-2">2024-08-30</td>
                            <td className="border px-4 py-2">Delta Solutions</td>
                            <td className="border px-4 py-2">Reference Check</td>
                            <td className="border px-4 py-2">APP012</td>
                            <td className="border px-4 py-2">Bob Brown</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">C001</td>
                            <td className="border px-4 py-2">REF123</td>
                            <td className="border px-4 py-2">2024-10</td>
                            <td className="border px-4 py-2">2024-10-01</td>
                            <td className="border px-4 py-2">Acme Corp</td>
                            <td className="border px-4 py-2">Employment Verification</td>
                            <td className="border px-4 py-2">APP123</td>
                            <td className="border px-4 py-2">APP123</td>
                            <td className="border px-4 py-2">John Doe</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                            <td className="border px-4 py-2">555-0123</td>
                        </tr>
                    </tbody>

                </table>
                </div>


                {/* Download Button */}
                <button
                    onClick={handleDownloadExcel}
                    className="mt-4 px-4 py-2 bg-[#2c81ba] text-white rounded"
                >
                    Download Excel
                </button>
            </div>
        </div>
    );
};

export default DataManagement;
