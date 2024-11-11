import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx'; // Ensure you have xlsx installed
import Swal from 'sweetalert2';
import { MultiSelect } from "react-multi-select-component";
const storedToken = localStorage.getItem('token');

const ClientManager = () => {
    const [branchName, setBranchName] = useState([]);
    console.log('branch', branchName);
    const [formData, setFormData] = useState({
        organizationName: branchName,
        fullName: '',
        photo: 'sdsds',
        employeeId: '',
        location: '',
        spocUploaded: '',
        groupManager: '',
        package: [],
        services: '',

    });
    useEffect(() => {
        if (branchName) {
            setFormData(prevFormData => ({
                ...prevFormData,
                organizationName: branchName,
            }));
        }
    }, [branchName]);
    console.log('formdata', formData);
    const [packageToServicesMap, setPackageToServicesMap] = useState({}); // Mapping of packages to services

    const [services, setServices] = useState([]);

    const [uniquePackages, setUniquePackages] = useState([]);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitMessage, setSubmitMessage] = useState('');

    const handlePackageSelection = (serviceId, serviceCode, serviceName) => {
        const isSelected = selectedPackages.some(pkg => pkg.sub_serviceName === serviceName);
        const newSelectedPackages = isSelected
            ? selectedPackages.filter(pkg => pkg.sub_serviceName !== serviceName)
            : [...selectedPackages, { serviceId, serviceCode, sub_serviceName: serviceName }];

        setSelectedPackages(newSelectedPackages);

        // Update formData to include the selected services
        setFormData(prevData => ({
            ...prevData,
            services: newSelectedPackages,
        }));

        Swal.fire('Selected Service', serviceName, 'success');
    };


    const fetchServices = useCallback(async () => {
        const storedToken = localStorage.getItem('token'); // Fetch token inside the callback

        if (!storedToken) {
            Swal.fire('Error!', 'No authentication token found. Please log in again.', 'error');
            return;
        }

        try {
            const response = await fetch(`https://screeningstar.onrender.com/Screeningstar/fetchcmdata`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                Swal.fire('Error!', `An error occurred: ${errorData.message}`, 'error');
                return;
            }

            const data = await response.json();

            if (data && data.length > 0) {
                const customer = data[0];
                setBranchName(customer.branchName);

                if (customer.scopeOfServices) {
                    const scopeOfServices = JSON.parse(customer.scopeOfServices);
                    const parsedServices = Object.values(scopeOfServices);
                    setServices(parsedServices);

                    const packageSet = new Set();
                    const uniquePackagesList = [];
                    const newPackageToServicesMap = {};

                    parsedServices.forEach(service => {
                        if (service.packages) {
                            Object.keys(service.packages).forEach(packageId => {
                                if (!packageSet.has(packageId)) {
                                    packageSet.add(packageId);
                                    uniquePackagesList.push({
                                        id: packageId,
                                        name: service.packages[packageId]
                                    });
                                }

                                if (!newPackageToServicesMap[packageId]) {
                                    newPackageToServicesMap[packageId] = [];
                                }
                                newPackageToServicesMap[packageId].push({
                                    serviceId: service.serviceId,
                                    serviceTitle: service.serviceTitle,
                                    serviceCode: service.serviceCode,
                                    sub_serviceName: service.sub_serviceName
                                });
                            });
                        }
                    });

                    setUniquePackages(uniquePackagesList);
                    setPackageToServicesMap(newPackageToServicesMap);
                } else {
                    Swal.fire('Info', 'No services found for this customer.', 'info');
                }
            } else {
                Swal.fire('Info', 'No client data found.', 'info');
            }
        } catch (error) {
            Swal.fire('Error!', 'An unexpected error occurred.', 'error');
        }
    }, [storedToken]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handlePackageChange = (selectedList) => {
        const selectedIds = selectedList.map(item => item.value);
        setFormData(prevData => ({
            ...prevData,
            package: selectedIds,
        }));
    
        const newSelectedServices = [];
        selectedIds.forEach(packageId => {
            if (packageToServicesMap[packageId]) {
                newSelectedServices.push(...packageToServicesMap[packageId]);
            }
        });
    
        // Remove duplicates by checking for unique serviceId
        const uniqueSelectedServices = newSelectedServices.filter(
            (service, index, self) =>
                index === self.findIndex((s) => s.serviceId === service.serviceId)
        );
    
        setSelectedPackages(uniqueSelectedServices);
        setFormData(prevData => ({
            ...prevData,
            services: uniqueSelectedServices,
        }));
    
        Swal.fire('Selected Packages', selectedIds.join(', '), 'success');
        console.log('Selected services with details:', uniqueSelectedServices);
    };
    
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData);

        // Validate form data
        const validationErrors = {};
        if (!formData.organizationName) validationErrors.organizationName = 'Organization name is required.';
        if (!formData.fullName) validationErrors.fullName = 'Full name is required.';
        if (!formData.employeeId) validationErrors.employeeId = 'Employee ID is required.';
        if (!formData.location) validationErrors.location = 'Location is required.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        }

alert('dsds')
        const payload = {
            ...formData,
            package: formData.package,
            services: formData.services,
        };

        console.log('Final payload:', payload);

        try {
            const response = await fetch('https://screeningstar.onrender.com/Screeningstar/clientmanager', {
                method: 'POST',
                body: JSON.stringify(payload), // Send the final payload as JSON
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                alert('submitted');
                setSubmitMessage('Form submitted successfully!');
                // Reset form data after successful submission
                setFormData({
                    organizationName: '',
                    fullName: '',
                    photo: '',
                    employeeId: '',
                    location: '',
                    spocUploaded: '',
                    groupManager: '',
                    package: [],
                    services: '',
                });
                setSelectedPackages([]); // Reset selected services
            } else {
                const errorData = await response.json();
                setSubmitMessage(`Error: ${errorData.message}`);
            }
        } catch (error) {
            setSubmitMessage('Error submitting form.');
        }
    };


    console.log('uniquePackages', uniquePackages)


    return (


        <div className="bg-[#c1dff2]">
            <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">CLIENT MANAGER</h2>
            <div className="bg-white p-12 w-full mx-auto">
                <form className="space-y-4 w-full text-center" onSubmit={handleSubmit}>
                    <div className="w-full">
                        <label htmlFor="organizationName" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Name of the Organization</label>
                        <input
                            type="text"
                            name="organizationName"
                            value={branchName}
                            readOnly
                            placeholder="NAME OF THE ORGANIZATION"
                            onChange={handleChange}
                            className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.organizationName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.organizationName && <p className="text-red-500 text-sm">{errors.organizationName}</p>}
                    </div>

                    {/* Full Name */}
                    <div className="w-full">
                        <label htmlFor="fullName" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Full Name of the Applicant</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="FULL NAME OF THE APPLICANT"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                    </div>

                    {/* Upload Photo */}
                    <div className="w-full">
                        <label htmlFor="photo" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Upload Photo</label>
                        <input
                            type="file"
                            name="photo"
                            onChange={handleChange}
                            className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.photo ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
                    </div>

                    {/* Employee ID */}
                    <div className="w-full">
                        <label htmlFor="employeeId" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Employee ID</label>
                        <input
                            type="text"
                            name="employeeId"
                            placeholder="EMPLOYEE ID"
                            value={formData.employeeId}
                            onChange={handleChange}
                            className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.employeeId ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.employeeId && <p className="text-red-500 text-sm">{errors.employeeId}</p>}
                    </div>

                    {/* Location */}
                    <div className="w-full">
                        <label htmlFor="location" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="LOCATION"
                            value={formData.location}
                            onChange={handleChange}
                            className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                    </div>

                    {/* SPOC Case Uploaded */}
                    <div className="w-full">
                        <label htmlFor="spocUploaded" className="block text-left w-1/2 m-auto mb-2 text-gray-700">SPOC Case Uploaded</label>
                        <select
                            name="spocUploaded"
                            value={formData.spocUploaded}
                            onChange={handleChange}
                            className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.spocUploaded ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        >
                            <option value="">Select SPOC</option>
                            <option value="Client SPOC">Client SPOC</option>
                            <option value="Screeningstar SPOC">Screeningstar SPOC</option>
                        </select>
                        {errors.spocUploaded && <p className="text-red-500 text-sm">{errors.spocUploaded}</p>}
                    </div>

                    {/* Group Manager */}
                    <div className="w-full">
                        <label htmlFor="groupManager" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Group Manager (If any group of clients under one roof)</label>
                        <input
                            type="text"
                            name="groupManager"
                            placeholder="GROUP MANAGER (If any group of clients under one roof)"
                            value={formData.groupManager}
                            onChange={handleChange}
                            className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.groupManager ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.groupManager && <p className="text-red-500 text-sm">{errors.groupManager}</p>}
                    </div>


                    <div className='w-1/2 m-auto'>
                        {uniquePackages.length > 0 ? (
                            <MultiSelect
                                options={uniquePackages.map(pkg => ({ label: pkg.name, value: pkg.id }))}
                                value={formData.package.map(id => ({ label: uniquePackages.find(pkg => pkg.id === id)?.name, value: id }))}
                                onChange={handlePackageChange}
                                labelledBy="Select Packages"
                            />
                        ) : (
                            <p>No packages available</p>
                        )}
                    </div>
                    <table className="m-auto w-1/2 border-collapse border rounded-lg">
                        <thead>
                            <tr className="bg-[#c1dff2] text-[#4d606b] ">
                                <th className="border px-4 py-2">PACKAGE</th>
                                <th className="border px-4 py-2">SERVICE CODE</th>
                                <th className="border px-4 py-2">SERVICE NAMES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((item, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">
                                        <input
                                            type="checkbox"
                                            value={String(item.serviceId)}
                                            checked={selectedPackages.some(pkg => pkg.sub_serviceName === item.sub_serviceName)}
                                            onChange={() => handlePackageSelection(item.serviceId, item.serviceCode, item.sub_serviceName)}
                                        />
                                    </td>
                                    <td className="border px-4 py-2">{item.serviceCode}</td>
                                    <td className="border px-4 py-2">{item.sub_serviceName}</td>
                                </tr>
                            ))}                        </tbody>
                    </table>



                    <div className='block'>
                        <button type="submit" className="bg-[#2c81ba] text-white p-5 px-28 text-2xl rounded-md">Submit</button>
                        <h4 className='text-xl'>Or</h4>
                        <button type="button" className="bg-green-500 text-white p-5 px-20 text-2xl rounded-md">Bulk Upload</button>
                    </div>
                    <div className="flex text-left space-x-4 py-4">
                        <div>
                            <div className='show pages '> show pages 10</div>
                            <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-md">Export Excel</button>
                        </div>
                        <div>
                            <input type="search" />
                        </div>
                    </div>


                    {submitMessage && <p className="text-green-500">{submitMessage}</p>}
                </form>
            </div>
        </div>
    );
};
export default ClientManager;