import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { MultiSelect } from "react-multi-select-component";
import axios from 'axios';

const ClientManager = () => {
    const [branchData, setBranchData] = useState(null);
    const [files, setFiles] = useState({});
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
    const [spocNamee, setSpocNamee] = useState('');
    const [spocIds, setSpocIds] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [organisationName, setOrganisationName] = useState('');
    const [handleEditClick, setHandleEditClick] = useState('');
    const [clientApplicationId, setClientApplicationId] = useState('');





    useEffect(() => {
        const branchInfo = JSON.parse(localStorage.getItem("branch"));
        if (branchInfo) {
            setBranchData(branchInfo);
        }
    }, []);

    const handleFileChange = (fileName, e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prevFiles => ({ ...prevFiles, [fileName]: selectedFiles }));
    };
  


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





    }, [branchData]);

    const fetchTableData = useCallback(async () => {
        const branch_id = branchData?.id;
        const token = localStorage.getItem("branch_token");
        const apiUrl = `https://screeningstar-new.onrender.com/branch/client-application/list?branch_id=${branch_id}&_token=${token}`;

        const requestOptions = {
            method: "GET",
            redirect: "follow",
        };

        try {
            setLoading(true);
            const response = await fetch(apiUrl, requestOptions);
            if (response.ok) {
                const result = await response.json();
                const newToken = result.token || result._token || '';
                if (newToken) {
                    localStorage.setItem("branch_token", newToken);
                }
                setTableData(result.clientApplications);

            } else {
                console.error('Error fetching data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [branchData, setTableData]);

    // Use useEffect to call fetchTableData on component mount or dependency change
    useEffect(() => {
        fetchTableData();
    }, [fetchTableData]);


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
                            const spocName = result.client_spoc?.id || 'No name available';
                            const spocNamee = result.client_spoc?.name || 'No name available';

                            console.log('SPOC Name:', spocName);

                            const newToken = result.token || result._token || '';
                            if (newToken) {
                                localStorage.setItem("branch_token", newToken);
                            }

                            setSpocName(spocName); // Set the spocName in state
                            setSpocNamee(spocNamee);
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
        setHandleEditClick('Update');
        const selectedServices = (item.services || "")
            .split(",")
            .map(service => {
                const trimmedService = service.trim();  // Trim each service string
                const serviceNumber = parseInt(trimmedService, 10);  // Convert to number
                console.log(`Trimmed Service: "${trimmedService}", Parsed Number: ${serviceNumber}`);
                return serviceNumber; // Return the converted number
            });

        // Log the final array of selected service IDs
        console.log("selectedServices -", selectedServices);

        // Map over services and set isSelected based on selectedServices array
        const updatedServices = services.map(group => {
            console.log(`Processing group: ${group.group_title} (ID: ${group.group_id})`);

            return {
                ...group, // Keep the existing properties of the group
                services: group.services.map(service => {
                    console.log(`Processing service: ${service.serviceTitle} (ID: ${service.serviceId})`);

                    // Check if the serviceId is in selectedServices array
                    const isSelected = selectedServices.includes(service.serviceId);
                    console.log(`Is service ${service.serviceTitle} selected? ${isSelected}`);

                    // Return the updated service object with isSelected property
                    return {
                        ...service, // Keep the existing properties of the service
                        isSelected: isSelected // Mark as selected or not based on condition
                    };
                })
            };
        });

        // Log the final updated services array
        console.log("Updated Services: ", updatedServices);
        setServices(updatedServices);
        // Update the form data with the new services
        setFormData({
            id: item.id,
            organizationName: organisationName,
            fullName: item.name || '',
            photo: item.photo || '',
            employeeId: item.employee_id || '',
            location: item.location || '',
            spocUploaded: item.spocUploaded || '',
            groupManager: item.groupManager || '',
            applicationId: item.application_id || '',
            services: updatedServices || [], // Ensure services are passed correctly
        });
        setClientApplicationId(item.id);

        // Log formData (Note: This might not show the updated state immediately due to setState's async nature)
        console.log('editdata (after setFormData):', setFormData);
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
            .map(service => service.serviceId) // Extract service IDs
            .join(','); // Join them into a comma-separated string
    
        const uploadCustomerLogo = async (insertedId, new_application_id) => {
            if (branchData) {
                const { customer_id, id: branch_id } = branchData;
                const branch_token = localStorage.getItem("branch_token");
                const fileCount = Object.keys(files).length;
                const serviceData = JSON.stringify(selectedServiceIds);
    
                for (const [index, [key, value]] of Object.entries(files).entries()) {
                    const customerLogoFormData = new FormData();
                    customerLogoFormData.append('branch_id', branch_id);
                    customerLogoFormData.append('_token', branch_token);
                    customerLogoFormData.append('customer_code', 'customer_code');
                    customerLogoFormData.append('client_application_id', insertedId);
    
                    for (const file of value) {
                        customerLogoFormData.append('images', file);
                        customerLogoFormData.append('upload_category', key);
                    }
    
                    if (fileCount === (index + 1)) {
                        customerLogoFormData.append('send_mail', handleEditClick ? 0 : 1);
                        customerLogoFormData.append('services', serviceData);
                        customerLogoFormData.append('client_application_name', 'clientInput.name');
                        customerLogoFormData.append('client_application_generated_id', new_application_id);
                    }
    
                    try {
                        await axios.post(`https://screeningstar-new.onrender.com/branch/client-application/upload`, customerLogoFormData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        });
                    } catch (err) {
                        Swal.fire('Error!', `An error occurred while uploading logo: ${err.message}`, 'error');
                    }
                }
            }
        };
    
        const fileCount = Object.keys(files).length;
        let payload;
        console.log(`formData - `, formData);
    
        if (fileCount === 0) {
            payload = {
                client_application_id: formData.id,
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
                photo: formData.photo, // Ensure photo is passed for update
                services: selectedServiceIds,
                package: formData.package,
                send_mail: 1,
            };
        } else {
            payload = {
                client_application_id: formData.id,
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
                photo: formData.photo, // Include photo if it's being updated
                services: selectedServiceIds,
                package: formData.package,
                send_mail: 0,
            };
        }
    
        const apiUrl = handleEditClick
            ? "https://screeningstar-new.onrender.com/branch/client-application/update"
            : "https://screeningstar-new.onrender.com/branch/client-application/create";
    
        const method = handleEditClick ? "PUT" : "POST";
    
        try {
            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                const data = await response.json();
                let insertedId;
                let new_application_id;
                if (handleEditClick) {
                    insertedId = formData.id;
                    new_application_id = formData.applicationId;
                } else {
                    insertedId = data.result.results.insertId;
                    new_application_id = data.result.new_application_id;
                }
                const newToken = data.token || data._token || '';
                if (newToken) {
                    localStorage.setItem("branch_token", newToken);
                }

                fetchTableData();
                setSubmitMessage('Form submitted successfully!');
                setFormData({
                    fullName: '',
                    employeeId: '',
                    location: '',
                    spocUploaded: '',
                    groupManager: '',
                    package: [],
                    services: '',
                    photo: '',
                });
    
                // Call image upload after form submission
                if (fileCount !== 0) {
                    await uploadCustomerLogo(insertedId, new_application_id);
                }else{
                    await uploadCustomerLogo(insertedId, new_application_id);
                }
            } else {
                const errorData = await response.json();
                setSubmitMessage(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitMessage('Error submitting form.');
        }
        fetchTableData();
    };
    

    const handleDelete = async (id) => {
        const branch_id = branchData?.id;
        const _token = localStorage.getItem("branch_token");
        const formdata = new FormData();
        const requestOptions = {
            method: "DELETE",
            body: formdata,
            redirect: "follow"
        };

        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this item?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://screeningstar-new.onrender.com/branch/client-application/delete?id=${id}&branch_id=${branch_id}&_token=${_token}`, requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        const newToken = result.token || result._token || ''
                        if (newToken) {
                            localStorage.setItem("_token", newToken)
                        }
                        Swal.fire("Deleted!", "The item has been deleted.", "success");
                        formData();
                        services();
                    })
                    .catch((error) => console.error(error));
            }
        });
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
        <div className="bg-[#c1dff2]  " id="clientedit">
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
                            onChange={(e) => handleFileChange('photo', e)}
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
                            onChange={handleChange}
                            className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.spocUploaded ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        >
                            <option value="">Select SPOC</option>
                            <option value={spocName}>{spocNamee}</option>
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
                        {handleEditClick ? 'Edit' : 'Submit'}
                    </button>

                    {submitMessage && <p className="text-center text-green-500">{submitMessage}</p>}
                </form>

                <div className='overflow-scroll mt-10'>
                    <table className="m-auto w-1/2 border-collapse border rounded-lg">
                        <thead>
                            <tr className="bg-[#073d88] text-white whitespace-nowrap">
                                <th className="border px-4 py-2">Sl No.</th>
                                <th className="border px-4 py-2">photo</th>
                                <th className="border px-4 py-2">NAME OF THE APPLICANT</th>
                                <th className="border px-4 py-2">Application ID</th>
                                <th className="border px-4 py-2">Employe Id</th>
                                <th className="border px-4 py-2">Location</th>
                                <th className="border px-4 py-2">Service</th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">Edit</th>
                                <th className="border px-4 py-2">Delete</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((item, index) => (
                                <tr key={item.id} className="text-center">
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">
                                        {item.photo ? (
                                            <img src={`https://screeningstar-new.onrender.com/${item.photo}`} alt="Photo" className="h-10 w-10 object-cover" />
                                        ) : (
                                            'null'
                                        )}
                                    </td>

                                    <td className="border px-4 py-2">{item.name}</td>
                                    <td className="border px-4 py-2">{item.application_id}</td>
                                    <td className="border px-4 py-2">{item.employee_id}</td>
                                    <td className="border px-4 py-2">{item.location}</td>
                                    <td className="border px-4 py-2">{item.services}</td>
                                    <td className="border px-4 py-2">{item.status}</td>
                                  
                                    <td className="border px-4 py-2">

                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>

                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            delete
                                        </button></td>
                                    
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
