import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css'

const ServiceManagement = () => {
    
    const [group_name, setGroup_name] = useState();
    const [groupId, setGroupId] = useState('');
    const [serviceGroups, setServiceGroups] = useState();
    const [servicecode, setServicecode] = useState();
    const [serviceName, setServiceName] = useState();
    const [sub_serviceName, setSub_serviceName] = useState();
    const [short_code, setShort_code] = useState();
    const [sac_code, setSac_code] = useState();
    const [totalResults, setTotalResults] = useState();
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
            const response = await axios.get(`https://screeningstar-new.onrender.com/service/list?admin_id=${admin_id}&_token=${storedToken}`);

            // Store new token if returned from the API response
            const newToken = response.data.token || response.data._token || '';
            if (newToken) {
                localStorage.setItem("_token", newToken);
            }

            if (response.data.status) {
                setServices(response.data.services);

                // Using Map to ensure unique group_id
                const uniqueGroups = Array.from(
                    services.reduce((map, { group_id, group_name }) => {
                        if (!map.has(group_id)) map.set(group_id, { value: group_id, name: group_name });
                        return map;
                    }, new Map()).values()
                );
                console.log(`services - `, services);
                console.log('uniqueGroups - ', uniqueGroups);
                setServiceGroups(uniqueGroups);
                console.log(`setServiceGroups - `, serviceGroups);
                setTotalResults(response.data.totalResults);
            } else {
                console.error("Failed to fetch packages.");
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");
        if (!storedToken) {
            console.error("No token found. Please log in.");
            return;
        }
        e.preventDefault();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
            "title": serviceName,
            "description": sub_serviceName,
            "group_name": group_name,
            "short_code": short_code,
            "sac_code": sac_code,
            "admin_id": admin_id,
            "_token": storedToken
        });
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("https://screeningstar-new.onrender.com/service/create", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));


    };


    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://screeningstar.onrender.com/Screeningstar/service/${id}`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
            setServices((prevServices) =>
                prevServices.filter((service) => service.id !== id)
            );
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };


    const handleEdit = (service) => {
        setGroup_name(service.group_name || '');
        setServicecode(service.servicecode || '');
        setServiceName(service.serviceName || '');
        setSub_serviceName(service.sub_serviceName || '');
        setEditingServiceId(service.id);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredServices);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Services');
        XLSX.writeFile(workbook, 'services.xlsx');
    };

    // Filter services based on search term
    const filteredServices = services.filter((service) =>
        service.title && service.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get current services for the current page
    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

    // Pagination function
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="bg-[#c1dff2] ">
            <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">SERVICE MANAGEMENT</h2>
            <div className="bg-white p-12  w-full mx-auto">
                <div className="flex flex-wrap">
                    <div className="w-2/5">
                        <form onSubmit={handleSubmit} className="space-y-4 ps-0 py-[30px] px-[51px] bg-white rounded-md">
                            <div className="grid grid-cols-1 gap-4">
                                <SelectSearch
                                    options={serviceGroups}
                                    value={groupId}
                                    name="group_id"
                                    placeholder="Choose Service Group"
                                    onChange={(value) => setGroupId({ target: { name: "group_id", value } })}
                                    search
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    name="serviceName"
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    placeholder="Service Name"
                                    className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    name="sub_serviceName"
                                    value={sub_serviceName}
                                    onChange={(e) => setSub_serviceName(e.target.value)}
                                    placeholder="Sub Service Name"
                                    className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    name="sac_code"
                                    value={sac_code}
                                    onChange={(e) => setSac_code(e.target.value)}
                                    placeholder="Service Name"
                                    className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                />
                            </div><div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    name="short_code"
                                    value={short_code}
                                    onChange={(e) => setShort_code(e.target.value)}
                                    placeholder="Service Name"
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
                                        <th className="border  px-4 py-2">Group</th>
                                        <th className="border  px-4 py-2">Service Name</th>
                                        <th className="border  px-4 py-2">Sub Service Name</th>
                                        <th className="border  px-4 py-2">Short Code</th>
                                        <th className="border  px-4 py-2">SAC Code</th>
                                        <th className="border  px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentServices.map((service, index) => (
                                        <tr key={service.id} className="text-center">
                                            <td className="border  px-4 py-2">
                                                {index + 1 + (currentPage - 1) * servicesPerPage}
                                            </td>
                                            <td className="border  px-4 py-2">{service.group_name}</td>
                                            <td className="border  px-4 py-2">{service.title}</td>
                                            <td className="border  px-4 py-2">{service.description}</td>
                                            <td className="border  px-4 py-2">{service.short_code}</td>
                                            <td className="border  px-4 py-2">{service.sac_code}</td>
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
                                    className={`mx-1 px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-[#2c81ba] text-white' : 'bg-gray-200'
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

export default ServiceManagement;
