import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { MultiSelect } from "react-multi-select-component";

const ClientManager = () => {
    const [branchData, setBranchData] = useState(null);
    const [formData, setFormData] = useState({
        organizationName: '',
        fullName: '',
        photo: '',
        employeeId: '',
        location: '',
        spocUploaded: '',
        groupManager: '',
        package: [],
        services: [],
    });
    const [errors, setErrors] = useState({});
    const [submitMessage, setSubmitMessage] = useState('');
    const [spocName, setSpocName] = useState('');
    const [spocIds, setSpocIds] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [organisationName, setOrganisationName] = useState('');



    useEffect(() => {
        const branchInfo = JSON.parse(localStorage.getItem("branch"));
        if (branchInfo) {
            setBranchData(branchInfo);
        }
    }, []);

    useEffect(() => {
        // Fetch branch data and customer info when branchData is available
        if (branchData) {
            const fetchCustomerInfo = async () => {
                const { customer_id, id: branch_id } = branchData;
                const branch_token = localStorage.getItem("branch_token");
                const url = `https://screeningstar-new.onrender.com/branch/customer-info?customer_id=${customer_id}&branch_id=${branch_id}&branch_token=${branch_token}`;

                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        const result = await response.json();
                        const newToken = result.token || result._token || '';
                        if (newToken) {
                            localStorage.setItem("branch_token", newToken);
                        }

                        if (result.status && result.customers.length > 0) {
                            const customerInfo = result.customers[0];
                            const services = customerInfo.services ? JSON.parse(customerInfo.services) : [];
                            setServices(services);
                            setFormData(prevFormData => ({
                                ...prevFormData,
                                organizationName: customerInfo.name || '',
                            }));
                            setOrganisationName(customerInfo.name);
                            setSpocIds(customerInfo.client_spoc_id);
                        } else {
                            console.log('Error fetching data:', response.statusText);
                        }
                    } else {
                        console.log('Error fetching data:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchCustomerInfo();
        }

        const fetchTableData = async () => {
            const branch_id = branchData?.id;
            const token = localStorage.getItem("branch_token");
            const apiUrl = `https://screeningstar-new.onrender.com/branch/client-application/list?branch_id=${branch_id}&_token=${token}`;

            const requestOptions = {
                method: "GET",
                redirect: "follow",
            };

            try {
                const response = await fetch(apiUrl, requestOptions);
                if (response.ok) {
                    const result = await response.json();
                    const newToken = result.token || result._token || '';
                    if (newToken) {
                        localStorage.setItem("branch_token", newToken);
                    } // Assuming the API returns JSON data
                    setTableData(result.clientApplications); // Store fetched data
                    setLoading(false); // Set loading to false once data is fetched
                } else {
                    console.log('Error fetching data:', response.statusText);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchTableData();

    }, [branchData]);


    useEffect(() => {
        if (branchData) {
            const fetchCustomerInfo = async () => {

                const { customer_id, id: branch_id } = branchData;
                const branch_token = localStorage.getItem("branch_token");
                const url = `https://screeningstar-new.onrender.com/branch/customer-info?customer_id=${customer_id}&branch_id=${branch_id}&branch_token=${branch_token}`;

                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        const result = await response.json();
                        const newToken = result.token || result._token || '';
                        if (newToken) {
                            localStorage.setItem("branch_token", newToken);
                        }

                        if (result.status && result.customers.length > 0) {
                            const customerInfo = result.customers[0];
                            const services = customerInfo.services ? JSON.parse(customerInfo.services) : [];
                            setServices(services);
                            setFormData(prevFormData => ({
                                ...prevFormData,
                                organizationName: customerInfo.name || '',

                            }));
                            setSpocIds(customerInfo.client_spoc_id);

                        } else {
                            console.log('Error fetching data:', response.statusText);
                        }
                    } else {
                        console.log('Error fetching data:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchCustomerInfo();
        }
    }, [branchData]);

    useEffect(() => {
        const fetchSpocInfo = async () => {
            const branch_token = localStorage.getItem("branch_token");
            const branch_id = branchData?.id;

            console.log("spocIds:", spocIds);
            console.log("branch_id:", branch_id);
            console.log("branch_token:", branch_token);

            // Convert spocIds to an array if it's a single value
            const spocIdArray = Array.isArray(spocIds) ? spocIds : [spocIds];

            if (spocIdArray.length > 0 && branch_id && branch_token) {
                for (const client_spoc_id of spocIdArray) {
                    const url = `https://screeningstar-new.onrender.com/branch/client-spoc-info?client_spoc_id=${client_spoc_id}&branch_id=${branch_id}&_token=${branch_token}`;

                    try {
                        const response = await fetch(url, { method: "GET" });
                        if (response.ok) {
                            const result = await response.json();
                            console.log(`Data for spoc_id ${client_spoc_id}:`, result);

                            // Extract spocName from the result and set it
                            const spocName = result.client_spoc?.name || 'No name available';
                            console.log('SPOC Name:', spocName);

                            const newToken = result.token || result._token || '';
                            if (newToken) {
                                localStorage.setItem("branch_token", newToken);
                            }

                            setSpocName(spocName); // Set the spocName in state

                        } else {
                            console.error(`Error fetching data for client_spoc_id ${client_spoc_id}:`, response.status, response.statusText);
                        }
                    } catch (error) {
                        console.error(`Error fetching data for client_spoc_id ${client_spoc_id}:`, error);
                    }
                }
            } else {
                console.error("Token, Branch ID, or Spoc IDs are missing or invalid.");
            }
        };

        fetchSpocInfo();
    }, [spocIds, branchData]);

    const handleEdit = (item) => {
        // Set the form data based on the selected item from the table
        setFormData({
            fullName: item.name || '',
            photo: item.photo || '',
            employeeId: item.employee_id || '',
            location: item.location || '',
            spocUploaded: item.spocUploaded || '',
            groupManager: item.groupManager || '',
            package: item.package || [],
            services: item.services || [],
        });
        console.log('editdata', formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const branch_id = branchData?.id;
        const customer_id = branchData?.customer_id;
        const _token = localStorage.getItem("branch_token");

        const validationErrors = {};
        if (!formData.organizationName) validationErrors.organizationName = 'Organization name is required.';
        if (!formData.fullName) validationErrors.fullName = 'Full name is required.';
        if (!formData.employeeId) validationErrors.employeeId = 'Employee ID is required.';
        if (!formData.location) validationErrors.location = 'Location is required.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Collect all selected service IDs into a comma-separated string
        const selectedServiceIds = services
            .flatMap(group => group.services) // Flatten the services array
            .filter(service => service.isSelected) // Filter to only selected services
            .map(service => service.serviceId) // Map to get the service IDs
            .join(','); // Join them into a comma-separated string

        const payload = {
            branch_id,
            customer_id,
            _token,
            name: formData.fullName,
            client_spoc_id: spocName,
            employee_id: formData.employeeId,
            spoc: formData.spoc,
            location: formData.location,
            batch_number: formData.batchNumber,
            sub_client: formData.subClient,
            photo: formData.photo,
            services: selectedServiceIds,  // Send the comma-separated service IDs
            package: formData.package,
        };

        try {
            const response = await fetch("https://screeningstar-new.onrender.com/branch/client-application/create", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const newToken = response.token || response._token || '';
                if (newToken) {
                    localStorage.setItem("branch_token", newToken);
                }
                const data = await response.json();
                setSubmitMessage('Form submitted successfully!');
                setFormData({
                    fullName: '',
                    photo: '',
                    employeeId: '',
                    location: '',
                    spocUploaded: '',
                    groupManager: '',
                    package: [],
                    services: [],
                });
            } else {
                const errorData = await response.json();
                setSubmitMessage(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitMessage('Error submitting form.');
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const selectPackageById = (selectedPackageIds) => {
        // Iterate over the services and update isSelected based on selected package IDs
        services.forEach(group => {
            group.services.forEach(service => {
                // Check if any package within the service matches the selected package ID
                const matchingPackage = service.packages.some(pkg => selectedPackageIds.includes(pkg.name));

                // Update the service's isSelected based on whether any package matches
                service.isSelected = matchingPackage;
            });
        });

        // Optional: Log the updated services to verify
        console.log(services);
    };

    const handlePackageChange = (selectedOptions) => {
        const selectedPackageIds = selectedOptions.map(option => option.value); // Get selected package IDs

        if (selectedPackageIds.length === 0) {
            // If no packages are selected, deselect all services
            services.forEach(group => {
                group.services.forEach(service => {
                    service.isSelected = false;
                });
            });
            console.log("All services have been deselected");
        } else {
            // Otherwise, select services that match the selected package IDs
            selectPackageById(selectedPackageIds);
            console.log(`Selected Package IDs: `, selectedPackageIds);
        }

        // Update the form data with the selected package IDs
        setFormData({
            ...formData,
            package: selectedPackageIds
        });
    };


    const handleCheckboxChange = (serviceIndex, groupIndex) => {
        // Create 
        const updatedServices = [...services];

        // Find the specific service and toggle the 'isSelected' property
        const service = updatedServices[groupIndex].services[serviceIndex];
        service.isSelected = !service.isSelected;

        // Update the state with the modified services array
        setServices(updatedServices); // Assuming 'setServices' is the function to update state
    };



    const uniquePackages = [
        ...new Set(
            services
                .flatMap(group => group.services.flatMap(service =>
                    service.packages.map(pkg => ({ id: pkg.id, name: pkg.name }))
                ))
        )
    ];


    console.log('services data is -', services);
    return (
        <div className="bg-[#c1dff2]">
            <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">CLIENT MANAGER</h2>
            <div className="bg-white p-12 w-full mx-auto">
                <form className="space-y-4 w-full text-center" onSubmit={handleSubmit}>
                    {/* Organization Name */}
                    <div className="w-full">
                        <label htmlFor="organizationName" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Name of the Organization</label>
                        <input
                            type="text"
                            name="organizationName"
                            placeholder="NAME OF THE ORGANIZATION"
                            value={formData.organizationName}
                            readOnly
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

                    {/* Photo */}
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
                    <div className="w-full">
                        <label htmlFor="spocUploaded" className="block text-left w-1/2 m-auto mb-2 text-gray-700">SPOC Case Uploaded</label>
                        <select
                            name="spocUploaded"
                            value={spocName}
                            onChange={handleChange}
                            className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.spocUploaded ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        >
                            <option value="">Select SPOC</option>
                            <option value={spocName}>{spocName}</option>
                        </select>
                        {errors.spocUploaded && <p className="text-red-500 text-sm">{errors.spocUploaded}</p>}
                    </div>

                    <div className="space-y-4 m-auto w-1/2  bg-white rounded-md">
                        <MultiSelect
                            options={Array.from(new Set(uniquePackages.map(pkg => pkg.name)))
                                .map(name => ({ label: name, value: name }))
                            }
                            value={Array.isArray(formData.package) ? formData.package.map(pkg => ({ label: pkg, value: pkg })) : []}
                            onChange={handlePackageChange}
                            isMulti
                            placeholder="--PACKAGE OPTIONS--"
                            className="rounded-md p-2.5"
                        />

                    </div>

                    <table className="m-auto w-1/2 border-collapse border border-black rounded-lg">
                        <thead>
                            <tr className="bg-[#073d88] text-white">
                                <th className="border border-black px-4 py-2">SERVICE</th>
                                <th className="border border-black px-4 py-2">SERVICE CODE</th>
                                <th className="border border-black px-4 py-2">SERVICE NAMES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((group, groupIndex) => (
                                <React.Fragment key={groupIndex}>
                                    {group.services.map((service, serviceIndex) => (
                                        <tr className="text-center" key={service.serviceId}>
                                            <td className="border border-black px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={service.isSelected || false}
                                                    name="services[]"
                                                    onChange={() => handleCheckboxChange(serviceIndex, groupIndex)}

                                                />
                                            </td>
                                            <td className="border border-black px-4 py-2">
                                                {group.group_symbol || group.group_title} {serviceIndex + 1}
                                            </td>
                                            <td className="border border-black px-4 py-2">
                                                {service.serviceTitle}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                    <button
                        type="submit"
                        className="w-1/2 m-auto p-3 mb-[20px] bg-blue-500 text-white rounded-md"
                    >
                        Submit
                    </button>
                    {submitMessage && <p className="text-center text-green-500">{submitMessage}</p>}
                </form>

                <div className='overflow-scroll mt-10'>
                    <table className="m-auto w-1/2 border-collapse border rounded-lg">
                        <thead>
                            <tr className="bg-[#073d88] text-white whitespace-nowrap">
                                <th className="border px-4 py-2">Sl No.</th>
                                <th className="border px-4 py-2">NAME OF THE APPLICANT</th>
                                <th className="border px-4 py-2">Application ID</th>
                                <th className="border px-4 py-2">Document</th>
                                <th className="border px-4 py-2">Employe Id</th>
                                <th className="border px-4 py-2">Location</th>
                                <th className="border px-4 py-2">Service</th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">Docs</th>
                                <th className="border px-4 py-2">Date/Time</th>
                                <th className="border px-4 py-2">Edit</th>
                                <th className="border px-4 py-2">Address Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((item, index) => (
                                <tr key={item.id} className="text-center">
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{item.name}</td>
                                    <td className="border px-4 py-2">{item.application_id}</td>
                                    <td className="border px-4 py-2">{item.attach_documents}</td>
                                    <td className="border px-4 py-2">{item.employee_id}</td>
                                    <td className="border px-4 py-2">{item.location}</td>
                                    <td className="border px-4 py-2">{item.services}</td>
                                    <td className="border px-4 py-2">{item.status}</td>
                                    <td className="border px-4 py-2">
                                        <button className="bg-orange-500 text-white px-2 py-1 rounded whitespace-normal">
                                            Docs View
                                        </button>
                                    </td>
                                    <td className="border px-4 py-2">{item.dateTime}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td className="border px-4 py-2">
                                        <a href="#" className="text-blue-500 underline">
                                            View Address
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
};

export default ClientManager;
