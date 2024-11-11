import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const VerificationStatus = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;

    // Fake data for demonstration
    const data = [
        { tatDays: 10, location: "Location A", referenceId: "SS-NTIPL-1", photo: "image1.jpg", nameOfApplicant: "Lakshmi Haarika", employeeCode: "E123", applicationDate: "07-10-2024", deadlineDate: "21-10-2024", reportDate: "", overallStatus: "WIP", qcVerificationStatus: "NO", reportType: "" },
        { tatDays: 15, location: "Location B", referenceId: "SS-NTIPL-2", photo: "image2.jpg", nameOfApplicant: "Sumith O Naik", employeeCode: "E124", applicationDate: "08-10-2024", deadlineDate: "22-10-2024", reportDate: "", overallStatus: "WIP", qcVerificationStatus: "NO", reportType: "" },
        { tatDays: 8, location: "Location C", referenceId: "SS-NTIPL-3", photo: "image3.jpg", nameOfApplicant: "Ravi Kumar", employeeCode: "E125", applicationDate: "09-10-2024", deadlineDate: "23-10-2024", reportDate: "", overallStatus: "WIP", qcVerificationStatus: "YES", reportType: "" },
        { tatDays: 12, location: "Location D", referenceId: "SS-NTIPL-4", photo: "image4.jpg", nameOfApplicant: "Aditi Sharma", employeeCode: "E126", applicationDate: "10-10-2024", deadlineDate: "24-10-2024", reportDate: "", overallStatus: "WIP", qcVerificationStatus: "NO", reportType: "" },
        { tatDays: 20, location: "Location E", referenceId: "SS-NTIPL-5", photo: "image5.jpg", nameOfApplicant: "Rajesh Verma", employeeCode: "E127", applicationDate: "11-10-2024", deadlineDate: "25-10-2024", reportDate: "", overallStatus: "WIP", qcVerificationStatus: "YES", reportType: "" },
        { tatDays: 7, location: "Location F", referenceId: "SS-NTIPL-6", photo: "image6.jpg", nameOfApplicant: "Sneha Patel", employeeCode: "E128", applicationDate: "12-10-2024", deadlineDate: "26-10-2024", reportDate: "", overallStatus: "WIP", qcVerificationStatus: "NO", reportType: "" },
        { tatDays: 18, location: "Location G", referenceId: "SS-NTIPL-7", photo: "image7.jpg", nameOfApplicant: "Anil Yadav", employeeCode: "E129", applicationDate: "13-10-2024", deadlineDate: "27-10-2024", reportDate: "", overallStatus: "WIP", qcVerificationStatus: "YES", reportType: "" },
        { tatDays: 25, location: "Location H", referenceId: "SS-NTIPL-8", photo: "image8.jpg", nameOfApplicant: "Kavita Singh", employeeCode: "E130", applicationDate: "14-10-2024", deadlineDate: "28-10-2024", reportDate: "", overallStatus: "WIP", qcVerificationStatus: "NO", reportType: "" },
        { tatDays: 5, location: "Location I", referenceId: "SS-NTIPL-9", photo: "image9.jpg", nameOfApplicant: "Deepak Reddy", employeeCode: "E131", applicationDate: "15-10-2024", deadlineDate: "29-10-2024", reportDate: "", overallStatus: "WIP", qcVerificationStatus: "YES", reportType: "" },
        { tatDays: 30, location: "Location J", referenceId: "SS-NTIPL-10", photo: "image10.jpg", nameOfApplicant: "Meena Kumari", employeeCode: "E132", applicationDate: "16-10-2024", deadlineDate: "30-10-2024", reportDate: "", overallStatus: "WIP", qcVerificationStatus: "NO", reportType: "" },
        // Add more fake data as needed
    ];

    const filteredData = data.filter(item =>
        item.nameOfApplicant.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "VerificationStatus");
        XLSX.writeFile(workbook, "VerificationStatus.xlsx");
    };

    const handleNextPage = () => {
        if (currentPage < pageCount - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="bg-[#c1dff2]">
<h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">VERIFICATION STATUS</h2>
            <div className="bg-white p-12 w-full mx-auto">
                <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border mb-4 p-2 rounded"
                />
                <button onClick={handleDownload} className="bg-[#2c81ba] text-white p-2 ml-2 rounded mb-4">
                    Download Excel
                </button>
                <div className='overflow-scroll'>
                    <table className="min-w-full border-collapse border  whitespace-nowrap overflow-scroll">
                        <thead className="rounded-lg">
                            <tr className="bg-[#c1dff2] text-[#4d606b]">
                                <th className="border  px-4 py-2">SL No</th>
                                <th className="border  px-4 py-2">TAT Days</th>
                                <th className="border  px-4 py-2">Location</th>
                                <th className="border  px-4 py-2">Reference ID</th>
                                <th className="border  px-4 py-2">Photo</th>
                                <th className="border  px-4 py-2">Name Of The Applicant</th>
                                <th className="border  px-4 py-2">Employee Code</th>
                                <th className="border  px-4 py-2">Application Date</th>
                                <th className="border  px-4 py-2">Deadline Date</th>
                                <th className="border  px-4 py-2">Report Date</th>
                                <th className="border  px-4 py-2">Overall Status</th>
                                <th className="border  px-4 py-2">QC Verification Status</th>
                                <th className="border  px-4 py-2">Report Type</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {currentData.map((item, index) => (
                                <tr key={index}>
                                    <td className="border  px-4 py-2">{currentPage * itemsPerPage + index + 1}</td>
                                    <td className="border  px-4 py-2">{item.tatDays}</td>
                                    <td className="border  px-4 py-2">{item.location}</td>
                                    <td className="border  px-4 py-2">{item.referenceId}</td>
                                    <td className="border  px-4 py-2"><img src={item.photo} alt="Applicant" className="w-10 h-10" /></td>
                                    <td className="border  px-4 py-2">{item.nameOfApplicant}</td>
                                    <td className="border  px-4 py-2">{item.employeeCode}</td>
                                    <td className="border  px-4 py-2">{item.applicationDate}</td>
                                    <td className="border  px-4 py-2">{item.deadlineDate}</td>
                                    <td className="border  px-4 py-2">{item.reportDate}</td>
                                    <td className="border  px-4 py-2">{item.overallStatus}</td>
                                    <td className="border  px-4 py-2">{item.qcVerificationStatus}</td>
                                    <td className="border  px-4 py-2">{item.reportType}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center my-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}
                        className={`mx-2 p-2 rounded ${currentPage === 0 ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage >= pageCount - 1}
                        className={`mx-2 p-2 rounded ${currentPage >= pageCount - 1 ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationStatus;
