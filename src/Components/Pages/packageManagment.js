import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';  // Make sure to import Swal

const PackageManagement = () => {
    const [packageName, setPackageName] = useState('');
    const [packageDescription, setPackageDescription] = useState('');
    const [packages, setPackages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [packagesPerPage] = useState(5);
    const [editingPackageId, setEditingPackageId] = useState(null);

    const fetchPackages = async () => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");
        if (!storedToken) {
            console.error("No token found. Please log in.");
            return;
        }
        try {
            const response = await axios.get(`https://screeningstar-new.onrender.com/package/list?admin_id=${admin_id}&_token=${storedToken}`);
            
            // Store new token if returned from the API response
            const newToken = response.data.token || response.data._token || '';
            if (newToken) {
                localStorage.setItem("_token", newToken);
            }

            if (response.data.status) {
                setPackages(response.data.packages);
            } else {
                console.error("Failed to fetch packages.");
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");
        if (!storedToken) {
            console.error("No token found. Please log in.");
            return;
        }
        const requestBody = {
            id: editingPackageId,
            title: packageName,
            description: packageDescription,
            admin_id: admin_id,
            _token: storedToken
        };
        try {
            let response;
            if (editingPackageId) {
                // If editing, use the update API
                response = await axios.put(`https://screeningstar-new.onrender.com/package/update`, requestBody, {
                    headers: { "Content-Type": "application/json" }
                });
                Swal.fire('Success!', 'Package updated successfully.', 'success');
            } else {
                // If not editing, use the create API
                response = await axios.post("https://screeningstar-new.onrender.com/package/create", requestBody, {
                    headers: { "Content-Type": "application/json" }
                });
                Swal.fire('Success!', 'Package created successfully.', 'success');
            }

            // Store new token if returned from the API response
            const newToken = response.data.token || response.data._token || '';
            if (newToken) {
                localStorage.setItem("_token", newToken);
            }

            fetchPackages(); // Refresh the package list
            setPackageName('');
            setPackageDescription('');
            setEditingPackageId(null); // Reset editing state
        } catch (error) {
            console.error(editingPackageId ? 'Error updating package:' : 'Error creating package:', error);
            Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This package will be deleted permanently!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
                const storedToken = localStorage.getItem("_token");
                try {
                    const response = await axios.delete(`https://screeningstar-new.onrender.com/package/delete?id=${id}&admin_id=${admin_id}&_token=${storedToken}`);

                    // Store new token if returned from the API response
                    const newToken = response.data.token || response.data._token || '';
                    if (newToken) {
                        localStorage.setItem("_token", newToken);
                    }

                    setPackages(prevPackages => prevPackages.filter(pkg => pkg.id !== id));
                    Swal.fire('Deleted!', 'Your package has been deleted.', 'success');
                } catch (error) {
                    console.error('Error deleting package:', error);
                    Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
                }
            }
        });
    };

    const handleEdit = (pkg) => {
        setPackageName(pkg.title);
        setPackageDescription(pkg.description);
        setEditingPackageId(pkg.id); // Set the ID to indicate edit mode
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredPackages);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Packages');
        XLSX.writeFile(workbook, 'packages.xlsx');
    };

    const filteredPackages = packages.filter(pkg =>
        pkg.title && pkg.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastPackage = currentPage * packagesPerPage;
    const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
    const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <div className="bg-[#c1dff2]">
        <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">PACKAGE MANAGMENT </h2>
        
        <div className="bg-white p-12 w-full mx-auto">
            <div className="flex flex-wrap">
                <div className="w-2/5">
                    <form onSubmit={handleSubmit} className="space-y-4 ps-0 py-[30px] px-[51px] bg-white rounded-md">
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                name="packageName"
                                value={packageName}
                                onChange={(e) => setPackageName(e.target.value)}
                                placeholder="Package Name"
                                className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <textarea
                                name='packageDescription'
                                value={packageDescription}
                                onChange={(e) => setPackageDescription(e.target.value)}
                                placeholder='Package Description'
                                className='w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300'
                            />
                        </div>
                        <div className="text-left">
                            <button type="submit" className="bg-[#2c81ba] text-white py-2.5 px-[30px] text-[18px] border rounded-md">
                                {editingPackageId ? 'Update' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
    
                <div className="w-3/5">
                    <div className="flex justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Search by Package Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-[450px] rounded-md p-2.5 border border-gray-300"
                        />
                        <button onClick={exportToExcel} className="bg-orange-500 text-white px-4 py-2 rounded text-[18px]">
                            Export to Excel
                        </button>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full border-collapse border rounded-lg overflow-scroll whitespace-nowrap">
                            <thead className="rounded-lg">
                                <tr className="bg-[#c1dff2] text-[#4d606b]">
                                    <th className="border px-4 py-2">SL</th>
                                    <th className="border px-4 py-2">Package Name</th>
                                    <th className="border px-4 py-2">Description</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPackages.map((pkg, index) => (
                                    <tr key={pkg.id} className='text-center'>
                                        <td className="border px-4 py-2">{index + 1 + (currentPage - 1) * packagesPerPage}</td>
                                        <td className="border px-4 py-2">{pkg.title}</td>
                                        <td className="border px-4 py-2">{pkg.description}</td>
                                        <td className="border px-4 py-2">
                                            <button onClick={() => handleEdit(pkg)} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">Edit</button>
                                            <button onClick={() => handleDelete(pkg.id)} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="mt-4 text-center">
                        {Array.from({ length: Math.ceil(filteredPackages.length / packagesPerPage) }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`mx-1 px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-[#2c81ba] text-white' : 'bg-gray-200'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>    
    );
};

export default PackageManagement;
