import React, { useState } from "react";
import * as XLSX from "xlsx"; // Ensure you have xlsx installed

const TeamManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        spocName: "",
        designation: "",
        contactNumber: "",
        emailId: "",
    });

    // Dummy data for demonstration purposes
    const [spocs] = useState([
        { id: 1, name: "John Doe", designation: "Manager", contactNumber: "1234567890", email: "john@example.com" },
        { id: 2, name: "Jane Smith", designation: "Developer", contactNumber: "0987654321", email: "jane@example.com" },
        // Add more SPoC data here
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Filter SPoCs based on the search term
    const filteredSpocs = spocs.filter(spoc =>
        spoc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastSpoc = currentPage * itemsPerPage;
    const indexOfFirstSpoc = indexOfLastSpoc - itemsPerPage;
    const currentSpocs = filteredSpocs.slice(indexOfFirstSpoc, indexOfLastSpoc);
    const totalPages = Math.ceil(filteredSpocs.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Export to Excel function
    const exportToExcel = () => {
        if (filteredSpocs.length > 0) {
            const ws = XLSX.utils.json_to_sheet(filteredSpocs);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "SPoCs");
            XLSX.writeFile(wb, "spocs_data.xlsx");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here (e.g., send to API)
        console.log("Form submitted:", formData);
        setFormData({ spocName: "", designation: "", contactNumber: "", emailId: "" }); // Reset form
    };

    return (
        <div className="w-full bg-[#c1dff2]">
          <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">
    TEAM MANAGEMENT
  </h2>
            <div className="text-center border ">

                <form className="space-y-4 py-[30px] px-[51px] bg-white " onSubmit={handleSubmit}>
                    <div className="space-y-4 py-5">
                        <input
                            type="text"
                            name="spocName"
                            placeholder="Name of the Applicant"
                            className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                            value={formData.spocName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="contactNumber"
                            placeholder="Mobile Number"
                            className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="emailId"
                            placeholder="Email ID"
                            className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                            value={formData.emailId}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="company_name"
                            placeholder="Name of the Organization"
                            className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                            value="NORWIN TECHNOLOGIES INDIA PVT LTD"
                            readOnly
                        />
                        <input type="hidden" name="clientid_cdb" value="BRB1064" />
                    </div>
                </form>


                <div className='space-y-4 py-[30px] px-[51px] bg-white rounded-md'>
                    <select name="packageselection" id="packageselection" className='m-auto w-1/2  rounded-md p-2.5 border bg-[#c1dff2] border-gray-300 text-[#4d606b]'>
                        <option className='text-[#4d606b] bg-[#c1dff2] ' value="">--PACKAGE OPTIONS--</option>
                        <option className='text-[#4d606b] bg-[#c1dff2]' value="all">ALL</option>
                        <option className='text-[#4d606b] bg-[#c1dff2]' value="package_stnd">STANDARD BGV</option>
                        <option className='text-[#4d606b] bg-[#c1dff2]' value="package_a">FRESHER</option>
                        <option className='text-[#4d606b] bg-[#c1dff2]' value="package_b">EXPERIENCE BGV</option>
                        <option className='text-[#4d606b] bg-[#c1dff2]' value="package_c">SPECIAL BGV</option>
                        <option className='text-[#4d606b] bg-[#c1dff2]' value="package_d">PACKAGE BGV</option>
                    </select>
                    <table className=" m-auto w-1/2  border-collapse border  rounded-lg ">
                        <thead>
                            <tr className="bg-[#c1dff2] text-[#4d606b] rounded-lg whitespace-nowrap">
                                <th className="border  px-4 py-2">SERVICE</th>
                                <th className="border  px-4 py-2">SERVICE CODE</th>
                                <th className="border  px-4 py-2">SERVICE NAMES</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t text-center">
                                <td className="border  px-4 py-2">
                                    <input type="checkbox" name="services[]" value="1#post-graduation" id="post-graduation" className='text-center w-8  h-8' />
                                </td>
                                <td className="border  px-4 py-2 text-gray-700 text-xl">A1</td>
                                <td className="border  px-4 py-2 text-xl">Post Graduation </td>

                            </tr>
                            <tr className="border-t text-center">
                                <td className="border  px-4 py-2">
                                    <input type="checkbox" name="services[]" value="1#post-graduation" id="post-graduation" className='text-center w-8  h-8' />
                                </td>
                                <td className="border  px-4 py-2 text-gray-700 text-xl">A2</td>
                                <td className="border  px-4 py-2 text-xl">Graduation </td>

                            </tr>
                            <tr className="border-t text-center">
                                <td className="border  px-4 py-2">
                                    <input type="checkbox" name="services[]" value="1#post-graduation" id="post-graduation" className='text-center w-8  h-8' />
                                </td>
                                <td className="border  px-4 py-2 text-gray-700 text-xl">A3</td>
                                <td className="border  px-4 py-2 text-xl">MASTER</td>

                            </tr>
                        </tbody>
                    </table>
                    <div className="text-center">
                        <div className="block">
                        <div>
                            <button type="submit" className="bg-[#ff8d22] text-white py-2.5 px-[50px] text-[18px] border border-none rounded-md">
                                Submit
                            </button>
                            </div>
                            or
                            <div>
                            <button type="submit" className="bg-[#2c81ba] text-white py-2.5 px-[50px] text-[18px] border border-none rounded-md">
                                Bulk Mail
                            </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between w-full">
                        <div className="mb-4 w-1/2">
                            <input
                                type="text"
                                placeholder="Search SPoCs..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className=" w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                            />
                        </div>

                        {/* Excel Export Button */}
                        <button
                            onClick={exportToExcel}
                            className="bg-green-500 text-end text-white py-2.5 px-4 mb-4 rounded-md"
                        >
                            Export to Excel
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border  rounded-lg whitespace-nowrap">
                            <thead className='rounded-lg'>
                                <tr className="bg-[#c1dff2] text-[#4d606b] rounded-lg">
                                    <th className="border  px-4 py-2">SL</th>
                                    <th className="border  px-4 py-2">Name of Spoc</th>
                                    <th className="border  px-4 py-2">Designation</th>
                                    <th className="border  px-4 py-2">Number</th>
                                    <th className="border  px-4 py-2">Email</th>
                                    <th className="border  px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSpocs.map((spoc, index) => (
                                    <tr key={spoc.id} className='text-center'>
                                        <td className="border  px-4 py-2">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                        <td className="border  px-4 py-2">{spoc.name}</td>
                                        <td className="border  px-4 py-2">{spoc.designation}</td>
                                        <td className="border  px-4 py-2">{spoc.contactNumber}</td>
                                        <td className="border  px-4 py-2">{spoc.email}</td>
                                        <td className="border  px-4 py-2">
                                            <button className="bg-green-500 text-white px-4 py-2 rounded mr-3">Edit</button>
                                            <button className="bg-[#c9302c] text-white px-4 py-2 rounded">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="flex justify-center mt-4">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Search Bar */}



            </div>
        </div>
    );
};

export default TeamManagement;