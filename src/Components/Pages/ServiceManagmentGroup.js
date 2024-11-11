import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2'; // Import SweetAlert2

const ServiceManagementGroup = () => {
    const [symbol, setSymbol] = useState();
    const [title, setTitle] = useState();
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [servicesPerPage] = useState(5);
    const [editingServiceId, setEditingServiceId] = useState(null); 
    const storedToken = localStorage.getItem('token');

    const fetchServices = async () => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");
        if (!storedToken) {
            console.error("No token found. Please log in.");
            return;
        }
        try {
            const response = await axios.get(`https://screeningstar-new.onrender.com/service-group/list?admin_id=${admin_id}&_token=${storedToken}`);
            
            const newToken = response.data.token || response.data._token || '';
            if (newToken) {
                localStorage.setItem("_token", newToken);
            }

            if (response.data.status) {
                setServices(response.data.services);
            } else {
                console.error("Failed to fetch services.");
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");
        if (!storedToken) {
            console.error("No token found. Please log in.");
            return;
        }
    
        const raw = JSON.stringify({
            id: editingServiceId,
            title: title,
            symbol: symbol,
            admin_id: admin_id,
            _token: storedToken,
        });
    
        const requestOptions = {
            method: editingServiceId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: raw,
        };
    
        try {
            const url = editingServiceId 
                ? `https://screeningstar-new.onrender.com/service-group/update` 
                : `https://screeningstar-new.onrender.com/service-group/create`;
    
            const response = await fetch(url, requestOptions);
            
            const result = await response.json();
            console.log(result);
    
            console.log('API Response:', result); // Log the full response to inspect
    
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: editingServiceId ? 'Service Updated!' : 'Service Created!',
                    text: result.message || 'The service has been updated successfully.',
                });
                setEditingServiceId(null); // Clear editing state
                setTitle(''); // Clear input fields
                setSymbol(''); // Clear input fields
                fetchServices(); // Re-fetch services to update the list
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: 'Failed to update the service. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error while updating:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while updating the service. Please try again.',
            });
        }
    };
    
    
    const handleEdit = (service) => {
        setEditingServiceId(service.id); // Set service ID for edit mode
        setTitle(service.title || '');
        setSymbol(service.symbol || '');
    };

   
const handleDelete = async (id) => {
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
                const response = await axios.delete(`https://screeningstar-new.onrender.com/service-group/delete?id=${id}&admin_id=${admin_id}&_token=${storedToken}`);
        
                const newToken = response.data.token || response.data._token || '';
                if (newToken) {
                    localStorage.setItem("_token", newToken);
                }

                setServices((prevServices) =>
                    prevServices.filter((service) => service.id !== id)
                );
                Swal.fire('Deleted!', 'Your package has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting package:', error);
                Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
            }
        }
    });
};

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredServices);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Services');
        XLSX.writeFile(workbook, 'services.xlsx');
    };

    const filteredServices = services.filter((service) =>
        service.title && service.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);



return (
<div className="bg-[#c1dff2] ">
<h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">SERVICE MANAGEMENT GROUP</h2>
            <div className="bg-white p-12  w-full mx-auto">
                <div className="flex flex-wrap">
                    <div className="w-2/5">
                        <form onSubmit={handleSubmit} className="space-y-4 ps-0 py-[30px] px-[51px] bg-white rounded-md">
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    name="symbol"
                                    value={symbol}
                                    onChange={(e) => setSymbol(e.target.value)}
                                    placeholder="Group Symbol"
                                    className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Group Title"
                                    className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                />
                            </div>
                       
                         
                            <div className="text-left">
                                <button
                                    type="submit"
                                    className="bg-[#2c81ba] text-white py-2.5 px-[30px] text-[18px] border  rounded-md"
                                >
                                    {editingServiceId ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="w-3/5">
                        <div className="flex justify-between mb-4">
                            <input
                                type="text"
                                placeholder="Search by Service Name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-[450px] rounded-md p-2.5 border border-gray-300"
                            />
                            <button
                                onClick={exportToExcel}
                                className="bg-orange-500 text-white px-4 py-2 rounded text-[18px]"
                            >
                                Export to Excel
                            </button>
                        </div>
                        <div className="overflow-auto">
                            <table className="min-w-full border-collapse border  rounded-lg overflow-scroll whitespace-nowrap">
                                <thead className="rounded-lg">
                                    <tr className="bg-[#c1dff2] text-[#4d606b]">
                                        <th className="border  px-4 py-2">SL</th>
                                        <th className="border  px-4 py-2">Group Symbol </th>
                                        <th className="border  px-4 py-2">Group Title</th>
                                        <th className="border  px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentServices.map((service, index) => (
                                        <tr key={service.id} className="text-center">
                                            <td className="border  px-4 py-2">
                                                {index + 1 + (currentPage - 1) * servicesPerPage}
                                            </td>
                                            <td className="border  px-4 py-2">{service.symbol}</td>
                                            <td className="border  px-4 py-2">{service.title}</td>
                                            
                                            <td className="border  px-4 py-2">
                                                <button
                                                    onClick={() => handleEdit(service)}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(service.id)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 text-center">
                            {Array.from({ length: Math.ceil(filteredServices.length / servicesPerPage) }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    className={`mx-1 px-3 py-1 rounded-md ${
                                        currentPage === index + 1 ? 'bg-[#2c81ba] text-white' : 'bg-gray-200'
                                    }`}
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

export default ServiceManagementGroup;
