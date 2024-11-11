import React, { useState } from "react";

const ApplicationStatus = () => {
    // Sample table data
    const tableData = [
        { id: 1, reportDate: "2024-09-28", referenceId: "REF12345", applicant: "John Doe", analyst: "Analyst 1", status: "Completed", qcStatus: "Approved", qcAnalyst: "QC Analyst 1", qcDate: "2024-09-29" },
        { id: 2, reportDate: "2024-09-28", referenceId: "REF12344", applicant: "Jane Doe", analyst: "Analyst 2", status: "Completed", qcStatus: "Approved", qcAnalyst: "QC Analyst 1", qcDate: "2024-09-29" },
        { id: 3, reportDate: "2024-09-28", referenceId: "REF12346", applicant: "John Smith", analyst: "Analyst 1", status: "In Progress", qcStatus: "Pending", qcAnalyst: "QC Analyst 2", qcDate: "2024-09-30" },
    ];

    // State to hold filter values
    const [filters, setFilters] = useState({
        reportGeneratedBy: "",
        qcStatusFetch: "",
        date: "",
        reportGeneratedByMonth: ""
    });

    // State to hold filtered table data
    const [filteredData, setFilteredData] = useState(tableData);

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Filter the table data based on the selected filters
        const result = tableData.filter(item => {
            return (
                (filters.reportGeneratedBy ? item.analyst === filters.reportGeneratedBy : true) &&
                (filters.qcStatusFetch ? item.qcStatus === filters.qcStatusFetch : true) &&
                (filters.date ? item.reportDate === filters.date : true) &&
                (filters.reportGeneratedByMonth ? item.qcDate.startsWith(filters.reportGeneratedByMonth) : true)
            );
        });

        // Update the filtered data state
        setFilteredData(result);
    };

    return (
        <>    <div className="w-full bg-[#c1dff2] border overflow-hidden">
                    <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">APPLICATION STATUS</h2>

                <div className="bg-white p-12 rounded-md w-full mx-auto">

                    {/* Form for filtering */}
                    <form onSubmit={handleSubmit} className="flex items-center space-x-4 p-4">
                        <div className="w-1/4">
                            <label htmlFor="reportGeneratedBy" className="block text-sm font-medium text-gray-700">Report Generated By</label>
                            <select id="reportGeneratedBy" name="reportGeneratedBy" className="mt-1 block w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" onChange={handleFilterChange}>
                                <option value="">Select an option</option>
                                <option value="Analyst 1">Analyst 1</option>
                                <option value="Analyst 2">Analyst 2</option>
                            </select>
                        </div>

                        <div className="w-1/4">
                            <label htmlFor="qcStatusFetch" className="block text-sm font-medium text-gray-700">QC Status Fetch</label>
                            <select id="qcStatusFetch" name="qcStatusFetch" className="mt-1 block w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" onChange={handleFilterChange}>
                                <option value="">Select a status</option>
                                <option value="Approved">Approved</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>

                        <div className="w-1/4">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" id="date" name="date" className="mt-1 block w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" onChange={handleFilterChange} />
                        </div>

                        <div className="w-1/4">
                            <label htmlFor="reportGeneratedByMonth" className="block text-sm font-medium text-gray-700">Report Generated By Month</label>
                            <input type="month" id="reportGeneratedByMonth" name="reportGeneratedByMonth" className="mt-1 block w-full bg-[#f7f6fb] border-gray-300 rounded px-3 py-2" onChange={handleFilterChange} />
                        </div>

                        <div className="w-auto block text-center">
                            <button type="submit" className="mt-6 px-3 py-3 px-22 bg-[#2c81ba] text-white rounded-md hover:bg-blue-700">Submit</button>
                        </div>
                    </form>

                    {/* Filtered Table */}
                    <div className="mt-24">
                        <table className="min-w-full border-collapse border overflow-scroll ">
                            <thead className=''>
                                <tr className="bg-[#c1dff2] whitespace-nowrap text-[#4d606b]">
                                    <th className="border px-4 py-2">SL No</th>
                                    <th className="border px-4 py-2">Report Date</th>
                                    <th className="border px-4 py-2">Reference ID</th>
                                    <th className="border px-4 py-2">Name of the Applicant</th>
                                    <th className="border px-4 py-2">Report Analyst Name</th>
                                    <th className="border px-4 py-2">Overall Status</th>
                                    <th className="border px-4 py-2">QC Status</th>
                                    <th className="border px-4 py-2">QC Analyst Name</th>
                                    <th className="border px-4 py-2">QC Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr className="text-center" key={item.id}>
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{item.reportDate}</td>
                                        <td className="border px-4 py-2">{item.referenceId}</td>
                                        <td className="border px-4 py-2">{item.applicant}</td>
                                        <td className="border px-4 py-2">{item.analyst}</td>
                                        <td className="border px-4 py-2">{item.status}</td>
                                        <td className="border px-4 py-2">{item.qcStatus}</td>
                                        <td className="border px-4 py-2">{item.qcAnalyst}</td>
                                        <td className="border px-4 py-2">{item.qcDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApplicationStatus;
