import { React, useState, useEffect, useCallback } from "react";
import "../../App.css";
import "react-datepicker/dist/react-datepicker.css";
import { MultiSelect } from "react-multi-select-component";
import { State } from "country-state-city";
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css'
import Swal from 'sweetalert2'
import axios from "axios";
import { useClientContext } from "./ClientContext";
const states = State.getStatesOfCountry("IN");
const option = states.map((state) => ({ value: state.isoCode, label: state.name }));
const storedToken = localStorage.getItem("token");
const AddClient = () => {
    const { client_spoc_id, AllSpocs, escalation_manager_id, billing_spoc_id, billing_escalation_id, authorized_detail_id, } = useClientContext();
    const [priceData, setPriceData] = useState({});
    const [files, setFiles] = useState([]);
    const [service, setService] = useState([]);
    const [selectedServices, setSelectedServices] = useState({});
    const [services, setServices] = useState([]);
    const [packageList, setPackageList] = useState([]);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [date, setDate] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selected, setSelected] = useState([]);
    const [errors, setErrors] = useState({});
    const [branches, setBranches] = useState([{ branch_email: "", branch_name: "" }]);
    const [emails, setemails] = useState([]);
    const [fileName, setFileName] = useState("");
    const [apiError, setApiError] = useState("");
    const [clientData, setClientData] = useState({
        company_name: "",
        client_code: "",
        address: "",
        state: "",
        state_code: "",
        gstin: "",
        tat: "",
        date_agreement: "",
        clientProcedure: "",
        agreement_period: "",
        custom_template: "",
        scopeOfServices: [],
        mobile_number: "",
        role: "",
        client_standard: "",
        client_spoc_id: "",
        escalation_manager_id: "",
        billing_spoc_id: "",
        billing_escalation_id: "",
        authorized_detail_id: "",
        username: "",
    });

    const handleFileChange = (fileName, e) => {
        const selectedFiles = Array.from(e.target.files); // Convert FileList to an array

        // Assuming `file` is the state variable holding the files
        setFiles((prevFiles) => {
            return {
                ...prevFiles,
                [fileName]: selectedFiles,
            };
        });
    };
    const uploadCustomerLogo = async (adminId, token, customerInsertId, password) => {


        const fileCount = Object.keys(files).length;
        for (const [index, [key, value]] of Object.entries(files).entries()) {
            const customerLogoFormData = new FormData();
            customerLogoFormData.append('admin_id', adminId);
            customerLogoFormData.append('_token', token);
            customerLogoFormData.append('customer_code', clientData.client_code);
            customerLogoFormData.append('customer_id', customerInsertId);
            for (const file of value) {
                customerLogoFormData.append('images', file);
                customerLogoFormData.append('upload_category', key);
            }
            if (fileCount === (index + 1)) {
                customerLogoFormData.append('send_mail', 1);
                customerLogoFormData.append('company_name', clientData.company_name);
                customerLogoFormData.append('password', password);
            }

            try {
                await axios.post(
                    `https://screeningstar-new.onrender.com/customer/upload`,
                    customerLogoFormData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } catch (err) {
                Swal.fire('Error!', `An error occurred while uploading logo: ${err.message}`, 'error');
            }
        }
    };


    const memoizedAllSpocs = useCallback(() => {
        AllSpocs(); // Call the original AllSpocs function
    }, [AllSpocs]); // Only recreate this function if AllSpocs changes
    
    useEffect(() => {
        memoizedAllSpocs(); // This will now run only once unless AllSpocs itself changes
    }, [memoizedAllSpocs]); 


    const addBranch = () => {
        setBranches([...branches, { branch_email: "", branch_name: "" }]);
    };

    const removeBranch = (index) => {
        const newBranches = branches.filter((_, i) => i !== index);
        setBranches(newBranches);
    };

    const options = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
    ];


    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newBranches = [...branches];
        newBranches[index][name] = value;
        setBranches(newBranches);
    };


    const fetchServices = useCallback(() => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");

        // Check if admin_id or storedToken is missing
        if (!admin_id || !storedToken) {
            console.error('Missing admin_id or _token');
            return;
        }

        // Construct the URL with query parameters
        const url = `https://screeningstar-new.onrender.com/customer/services-packages?admin_id=${admin_id}&_token=${storedToken}`;

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(url, requestOptions)
            .then((response) => response.json()) // Assuming the server returns JSON
            .then((result) => {
                const newToken = result.token || result._token || ''
                if (newToken) {
                    localStorage.setItem("_token", newToken)
                }
                // Log the result to understand its structure
                console.log(result);

                // Extracting services data into separate variables
                const servicesData = result.data;
                setServices(servicesData);
            })
            .catch((error) => console.error('Error fetching services:', error));
    }, []);

    const fetchPackages = useCallback(() => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");

        // Check if admin_id or storedToken is missing
        if (!admin_id || !storedToken) {
            console.error('Missing admin_id or _token');
            return;
        }

        // Construct the URL with query parameters
        const url = `https://screeningstar-new.onrender.com/package/list?admin_id=${admin_id}&_token=${storedToken}`;

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(url, requestOptions)
            .then((response) => response.json()) // Assuming the server returns JSON
            .then((result) => {
                const newToken = result.token || result._token || ''
                if (newToken) {
                    localStorage.setItem("_token", newToken)
                }
                // Log the result to understand its structure
                console.log('package', result);

                // Extracting services data into separate variables
                setPackageList(result.packages);
            })
            .catch((error) => console.error('Error fetching services:', error));
    }, [storedToken]);
    console.log("service", service);

    useEffect(() => {
        fetchServices();
        fetchPackages();
    }, [fetchServices, fetchPackages]);

    // 1. Handle checkbox change (checking/unchecking a service)
    const handleCheckboxChange = ({ group_id, group_symbol, group_name, service_id, service_name, price, selected_packages }) => {
        setSelectedServices(prevSelectedServices => {
            const isSelected = prevSelectedServices[service_id];
            const newSelectedState = !isSelected; // Toggle checkbox state

            // Update priceData and selectedPackages if deselecting
            if (!newSelectedState) {
                setPriceData(prevPriceData => ({
                    ...prevPriceData,
                    [service_id]: { pricingPackages: "" }
                }));
                setSelectedPackages(prevSelectedPackages => ({
                    ...prevSelectedPackages,
                    [service_id]: []
                }));
            }

            // Send the data to server with the current selection status and other details
            sendDataToServer({
                group_id,
                group_symbol,
                group_name,
                service_id,
                service_name,
                price: newSelectedState ? price : "", // Send empty if deselected
                selected_packages: newSelectedState ? selected_packages : [], // Send empty if deselected
                action: "checkbox_change"
            });

            return {
                ...prevSelectedServices,
                [service_id]: newSelectedState
            };
        });
    };


    // 2. Handle price change (focus in/out or typing in the price input)
    const handlePriceChange = (e, service_id) => {
        const newPrice = e.target.value;

        setPriceData(prevPriceData => ({
            ...prevPriceData,
            [service_id]: {
                ...prevPriceData[service_id],
                pricingPackages: newPrice
            }
        }));

        // Send the updated price when user types or focuses out
        sendDataToServer({
            service_id,
            price: newPrice,
            action: "price_change"
        });
    };

    // 3. Handle package selection change (when packages are selected or changed)
    const handlePackageChange = (selectedList, serviceId) => {
        console.log("Selected packages for serviceId", serviceId, ":", selectedList);

        // Create an array of selected packages in the desired format
        const selectedPackagesData = selectedList.map(pkg => ({
            id: pkg.value,
            name: pkg.label
        }));

        setSelectedPackages(prevSelected => ({
            ...prevSelected,
            [serviceId]: selectedList.map(pkg => pkg.value) // Store only the selected package IDs
        }));
        // Now, send the selected packages data
        const dataToSend = {
            action: 'package_change',
            service_id: serviceId,
            selected_packages: selectedPackagesData
        };

        // Call sendDataToServer to handle the update
        sendDataToServer(dataToSend);
    };


    function updateServiceById(serviceId, updatedInfo, services = clientData.scopeOfServices) {
        console.log("Starting updateServiceById with serviceId:", serviceId, "and updatedInfo:", updatedInfo);

        for (let group of services) {
            console.log("Checking group:", group);

            if (group.services) {
                const service = group.services.find(service => service.serviceId === serviceId);
                console.log("Found service:", service);

                if (service) {
                    // Update the fields in the service object with the values in updatedInfo
                    Object.assign(service, updatedInfo);
                    console.log("Service updated:", service);
                    return true;  // Return true if update was successful
                }
            }
        }

        // If service is not found, create a new service and add it to the appropriate group
        console.log("Service not found with serviceId:", serviceId);

        const newService = {
            serviceId,
            serviceTitle: updatedInfo.serviceTitle || '',
            price: updatedInfo.price || '',
            packages: updatedInfo.packages || []  // Assuming updatedInfo includes packages
        };
        console.log("Adding new service:", newService);

        // Add the new service to the correct group
        const groupIndex = services.findIndex(group => group.group_id === updatedInfo.group_id);
        if (groupIndex !== -1) {
            services[groupIndex].services.push(newService);  // Add the new service to the found group
            console.log("New service added to group:", services[groupIndex]);
        } else {
            // If the group is not found, you can add a new group, or handle it differently based on your needs
            console.log("Group not found, creating a new group.");
            services.push({
                group_id: updatedInfo.group_id,
                group_title: updatedInfo.group_name,
                services: [newService]
            });
        }

        // Update the clientData.scopeOfServices directly
        clientData.scopeOfServices = [...services];  // Ensure clientData is updated with the latest services
        setClientData((prev) => ({
            ...prev,
            'scopeOfServices': services,
        }));

        console.log("Updated clientData.scopeOfServices:", clientData.scopeOfServices);

        return true;
    }

    console.log('clientData', clientData);

    // Function to send data to the server (or perform any other action you need)
    const sendDataToServer = (data) => {
        console.log("Sending data to server:", data);

        let sendDataRunning = false;
        let updatedData = {};

        // Handle the different actions
        switch (data.action) {
            case 'package_change':
                console.log("Handling package_change action");
                updatedData = { packages: data.selected_packages };  // Assuming you want to update packages
                sendDataRunning = true;
                break;
            case 'checkbox_change':
                console.log("Handling checkbox_change action");
                const { selected_packages, group_id, group_name, group_symbol, price, service_name } = data;
                updatedData = { selected_packages, group_id, group_name, group_symbol, price, serviceTitle: service_name };
                sendDataRunning = true;
                break;
            case 'price_change':
                console.log("Handling price_change action");
                updatedData = { price: data.price };  // Only updating price
                sendDataRunning = true;
                break;
            default:
                console.log("No matching action found");
                break;
        }

        if (sendDataRunning) {
            console.log("Sending updated data:", updatedData);
            const serviceId = data.service_id;
            const isUpdated = updateServiceById(serviceId, updatedData);  // Update service with serviceId
            console.log("Update result:", isUpdated);  // Should log true if updated successfully
            console.log("Updated clientData.scopeOfServices:", clientData.scopeOfServices);

        } else {
            console.log("No action was processed, data not sent.");
        }
    };


    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setClientData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value, // Handle file input
        }));
    };


    const validateRequiredFields = () => {
        const requiredFields = [
            "company_name", "client_code", "address", "state", "state_code", "gstin",
            "tat", "date_agreement", "clientProcedure", "agreement_period", "custom_template",
            "scopeOfServices", "mobile_number", "role", "client_standard", "client_spoc_id",
            "escalation_manager_id", "billing_spoc_id", "billing_escalation_id", "authorized_detail_id", "username",
        ];

        const newErrors = {};

        // Validate clientData fields
        requiredFields.forEach(field => {
            const fieldValue = clientData[field];

            if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
                newErrors[field] = "This field is required";
            }
        });

        // Validate each branch's branch_email and branch_name
        branches.forEach((branch, index) => {
            if (!branch.branch_email) {
                newErrors[`branch_email_${index}`] = "Branch email is required";
            }
            if (!branch.branch_name) {
                newErrors[`branch_name_${index}`] = "Branch name is required";
            }
        });

        // Validate emails
        if (!emails || emails.length === 0) {
            newErrors.emails = "At least one email is required";
        } else {
            emails.forEach((email, index) => {
                // Check for valid email format using regex
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email)) {
                    newErrors[`email_${index}`] = "Invalid email format";
                }
            });
        }

        setErrors(newErrors);
        return newErrors;
    };



    console.log('errors', errors)


    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent form submission immediately

        // Run validation and get errors
        let validationErrors = validateRequiredFields();

        // If there are validation errors, show an alert and stop submission
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;  // Stop submission if there are validation errors
        }

        try {
            // Retrieve necessary data from localStorage
            const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
            const storedToken = localStorage.getItem("_token");

            // Prepare the payload with all necessary data
            const payload2 = JSON.stringify({
                admin_id: admin_id,
                _token: storedToken,
                ...clientData,
                branches,  // Assuming branches is a state or variable holding branch details
                emails,   // Ensure `date` is correctly defined or passed in
                additional_login: selectedOption, // Assuming this is the additional_login value
            });

            // Set up request headers
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            // Define the request options
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: payload2,
                redirect: "follow",
            };

            // Make the API call
            const response = await fetch("https://screeningstar-new.onrender.com/customer/create", requestOptions);

            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Failed to submit the form');
            }

            // Handle the response
            const result = await response.json();
            Swal.fire('success', result.message)
            const customerInsertId = result.data.customerId; // Ensure the result structure is correct
            const password = result.password; // Similarly, ensure password is returned from the result
            alert(customerInsertId, password)
            // If the response includes a new token, store it
            const newToken = result.token || result._token || '';
            if (newToken) {
                localStorage.setItem("_token", newToken);
            }

            // Proceed with uploading the logo or any other necessary action
            uploadCustomerLogo(admin_id, storedToken, customerInsertId, password);
            console.log('result', result);


            // Reset the form data after successful submission
            setClientData({
                company_name: "",
                client_code: "",
                address: "",
                state: "",
                state_code: "",
                gstin: "",
                tat: "",
                date_agreement: "",
                clientProcedure: "",
                agreement_period: "",
                custom_template: "",
                scopeOfServices: [],
                mobile_number: "",
                role: "",
                client_standard: "",
                username: "",
            });

            setSelected([]); // Clear selected package options
            setBranches([{ branch_email: "", branch_name: "" }]); // Reset branches
            setDate(null); // Reset service agreement date
            setSelectedOption(null); // Reset login requirement option
            setFileName(""); // Reset file name

        } catch (error) {
            // Handle error and set error state
            console.error('Submission error:', error);
            setApiError("There was an error submitting the form. Please try again.");
        }

        // Clear any previous API errors
        setApiError("");
    };







    return (
        <div className="w-full bg-[#c1dff2] border overflow-hidden">
            <div className="text-left ">
                <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 borde">ADD NEW CLIENT</h2>
            </div>

            <form className="space-y-4 py-[30px] px-[51px] bg-white border" onSubmit={handleSubmit}>
                {/* Organization Name */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Name of the Organization</label>
                        <input
                            type="text"
                            name="company_name"
                            placeholder="Enter Organization Name"
                            value={clientData.company_name}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.company_name ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                        {errors.company_name && <span className="text-red-500">{errors.company_name}</span>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Client Unique ID</label>
                        <input
                            type="text"
                            name="client_code"
                            placeholder="Enter Client Unique ID"
                            value={clientData.client_code}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.client_code ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                        {errors.client_code && <span className="text-red-500">{errors.client_code}</span>}
                    </div>
                </div>

                {/* Registered Address */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Registered Address</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="Enter Registered Address"
                            value={clientData.address}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.address ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                        {errors.address && <span className="text-red-500">{errors.address}</span>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">State</label>
                        <div className="relative">
                            <select
                                name="state"
                                value={clientData.state || ""}
                                onChange={handleChange}
                                className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.state ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb] appearance-none pr-8`}
                            >
                                <option value="" className="text-[#989fb3]">
                                    Select State
                                </option>
                                {option.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="text-black">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.state && <span className="text-red-500">{errors.state}</span>}
                        </div>
                    </div>
                </div>

                {/* State Code and GST Number */}
                <div className="grid mb-[30px] grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">State Code</label>
                        <input
                            type="text"
                            name="state_code"
                            placeholder="Enter State Code"
                            value={clientData.state_code}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.state_code ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">GST Number</label>
                        <input
                            type="text"
                            name="gstin"
                            placeholder="Enter GST Number"
                            value={clientData.gstin}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.gstin ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                        {errors.gstin && <span className="text-red-500">{errors.gstin}</span>}
                    </div>
                </div>

                {/* Mobile Number and TAT */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Mobile Number</label>
                        <input
                            type="text"
                            name="mobile_number"
                            placeholder="Enter Mobile Number"
                            value={clientData.mobile_number}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.mobile_number ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                        {errors.mobile_number && <span className="text-red-500">{errors.mobile_number}</span>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Email</label>
                        <input
                            type="text"
                            name="emails"
                            placeholder="Enter Email"
                            value={emails.emails}
                            onChange={(e) => setemails([e.target.value])}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.emails ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                        {errors.emails && <span className="text-red-500">{errors.emails}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Service Agreement Date</label>
                        <input
                            type="date"
                            onChange={handleChange}
                            value={clientData.date_agreement}
                            name='date_agreement'
                            placeholderText="Select Service Agreement Date"
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.date_agreement ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                        {errors.date_agreement && <span className="text-red-500">{errors.date_agreement}</span>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">TAT (Turnaround Time)</label>
                        <input
                            type="text"
                            name="tat"
                            placeholder="Enter TAT"
                            value={clientData.tat}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.tat ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                        {errors.tat && <span className="text-red-500">{errors.tat}</span>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Custom Template</label>
                        <input
                            type="text"
                            name="custom_template"
                            placeholder="Enter Custom Template"
                            value={clientData.custom_template}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.custom_template ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                        {errors.custom_template && <span className="text-red-500">{errors.custom_template}</span>}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Client Procedure</label>
                        <input
                            type="text"
                            name="clientProcedure"
                            placeholder="Enter Client Procedure"
                            value={clientData.clientProcedure}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.clientProcedure ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Agreement Period</label>
                        <select
                            name="agreement_period"
                            value={clientData.agreement_period || ""}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.agreement_period ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        >
                            <option value="" className="text-[#989fb3]">
                                Select Agreement Period
                            </option>
                            <option value="1 Year">1 Year</option>
                            <option value="2 Years">2 Years</option>
                            <option value="3 Years">3 Years</option>
                            {/* Add more options as needed */}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <label className="block mb-1 text-sm font-medium">Client Logo</label>
                        <input type="file" name="logo" onChange={(e) => handleFileChange('logo', e)} className="w-full rounded-md p-2.5 mb-[20px] border border-gray-300 bg-[#f7f6fb]" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Role</label>
                        <input type="text" name="role" onChange={handleChange} className="w-full rounded-md p-2.5 mb-[20px] border border-gray-300 bg-[#f7f6fb]" />
                        {errors.role && <span className="text-red-500">{errors.role}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Escalation Manager</label>
                        <SelectSearch
                            options={escalation_manager_id}
                            value={clientData.escalation_manager_id}
                            name="escalation_manager_id"
                            placeholder="Choose your language"
                            onChange={(value) => handleChange({ target: { name: "escalation_manager_id", value } })}
                            search
                        />
                        {errors.escalation_manager_id && <span className="text-red-500">{errors.escalation_manager_id}</span>}

                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Client Spoc</label>
                        <SelectSearch
                            options={client_spoc_id}
                            value={clientData.client_spoc_id}
                            name="client_spoc_id"
                            placeholder="Choose your language"
                            onChange={(value) => handleChange({ target: { name: "client_spoc_id", value } })}
                            search
                        />
                        {errors.client_spoc_id && <span className="text-red-500">{errors.client_spoc_id}</span>}

                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Billing Spoc</label>
                        <SelectSearch
                            options={billing_spoc_id}
                            value={clientData.billing_spoc_id}
                            name="billing_spoc_id"
                            placeholder="Choose your language"
                            onChange={(value) => handleChange({ target: { name: "billing_spoc_id", value } })}
                            search
                        />
                        {errors.billing_spoc_id && <span className="text-red-500">{errors.billing_spoc_id}</span>}

                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Billing Escalation</label>
                        <SelectSearch
                            options={billing_escalation_id}
                            value={clientData.billing_escalation_id}
                            name="billing_escalation_id"
                            placeholder="Choose your language"
                            onChange={(value) => handleChange({ target: { name: "billing_escalation_id", value } })}
                            search
                        />
                        {errors.billing_escalation_id && <span className="text-red-500">{errors.billing_escalation_id}</span>}

                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Authorized Details</label>

                        <SelectSearch
                            options={authorized_detail_id}
                            value={clientData.authorized_detail_id}
                            name="authorized_detail_id"
                            placeholder="Choose your language"
                            onChange={(value) => handleChange({ target: { name: "authorized_detail_id", value } })}
                            search
                        />
                        {errors.authorized_detail_id && <span className="text-red-500">{errors.billing_escalation_id}</span>}

                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Login Required Option</label>
                        <select
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.additional_login ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        >
                            <option value="">Login Required Option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        {errors.additional_login && <span className="text-red-500">{errors.additional_login}</span>}
                    </div>

                    {/* Conditionally render the username input when "yes" is selected */}
                    {selectedOption === "yes" && (
                        <div className="mt-0">
                            <label className="block mb-1 text-sm font-medium">username</label>
                            <input
                                type="text"
                                name="username"
                                onChange={handleChange}
                                className="w-full rounded-md p-2.5 border border-gray-300 bg-[#f7f6fb]"
                                placeholder="Enter username"
                            />
                        </div>
                    )}


                    <div>
                        <label className="block mb-1 text-sm font-medium">Standard Process</label>
                        <input
                            type="text"
                            name="client_standard"
                            placeholder="Enter Standard Process"
                            value={clientData.client_standard}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.client_standard ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                        {errors.client_standard && <span className="text-red-500">{errors.client_standard}</span>}
                    </div>
                </div>
                <div className="">
                    {branches.map((branch, index) => (
                        <div key={index} className="mb-4 flex items-center w-1/2 grid-cols-2 gap-4">
                            <div className="w-1/2">
                                <input
                                    type="email"
                                    name="branch_email"
                                    value={branch.branch_email}
                                    onChange={(event) => handleInputChange(index, event)}
                                    placeholder="Branch Email"
                                    className="border w-full rounded-md p-2.5 mb-[20px]"

                                />
                                {errors[`branch_email_${index}`] && <span className="text-red-500">{errors[`branch_email_${index}`]}</span>}

                            </div>
                            <div className="flex w-1/2 items-start gap-2">
                                <div> <input type="text" name="branch_name" value={branch.branch_name} onChange={(event) => handleInputChange(index, event)} placeholder="Branch Name" className="border w-full rounded-md p-2.5 mb-[20px]" />
                                    {errors[`branch_name_${index}`] && <span className="text-red-500">{errors[`branch_name_${index}`]}</span>}</div>

                                <button type="button" onClick={() => removeBranch(index)} className="bg-red-500 text-white p-2.5 mb-[20px] rounded">
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addBranch} className="bg-blue-500 text-white p-2 rounded">
                        Add Branch
                    </button>
                </div>


                <div className="clientserviceTable">

                    <div className="overflow-x-auto py-6 px-0 bg-white mt-10 m-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className='bg-[#c1dff2] text-[#4d606b]'>
                                    <th className="py-2 md:py-3 px-4 border-r border-b text-left uppercase whitespace-nowrap">Group</th>
                                    <th className="py-2 md:py-3 px-4 border-r border-b text-left uppercase whitespace-nowrap">Service code</th>
                                    <th className="py-2 md:py-3 px-4 border-r border-b text-left uppercase whitespace-nowrap">Verification Service</th>
                                    <th className="py-2 md:py-3 px-4 border-r border-b text-left uppercase whitespace-nowrap">Price</th>
                                    <th className="py-2 md:py-3 px-4 border-r border-b text-left uppercase whitespace-nowrap">Select Package</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.reduce((acc, item, index) => {
                                    const isSameGroup = index > 0 && item.group_title === services[index - 1].group_title;

                                    if (item.services.length > 0) {
                                        if (!isSameGroup) {
                                            acc.push(
                                                <tr key={`group-${item.group_id}`} className='bg-[#c1dff2] text-[#4d606b]'>
                                                    <th className="py-2 md:py-3 px-4 border-r border-b text-center uppercase whitespace-nowrap">
                                                        {item.symbol}
                                                    </th>
                                                    <th colSpan={4} className="py-2 md:py-3 px-4 border-r border-b text-center uppercase whitespace-nowrap">
                                                        {item.group_title}
                                                    </th>
                                                </tr>
                                            );
                                        }

                                        item.services.forEach((service, serviceIndex) => {
                                            const serviceNumber = serviceIndex + 1;

                                            acc.push(
                                                <tr key={`${item.group_id}-${service.service_id}`}>
                                                    <td className="py-2 md:py-3 px-4 border-l border-r border-b whitespace-nowrap"></td>
                                                    <td className="py-2 md:py-3 px-4 border-l border-r border-b whitespace-nowrap">
                                                        {item.symbol} {serviceNumber}
                                                    </td>
                                                    <td className="py-2 md:py-3 px-4 border-l border-r border-b whitespace-nowrap">
                                                        <div key={service.service_id}>
                                                            <input
                                                                type="checkbox"
                                                                id={`scope_${service.service_id}`}
                                                                name="scopeOfServices"
                                                                checked={selectedServices[service.service_id] || false}
                                                                onChange={() => handleCheckboxChange({
                                                                    group_id: item.group_id,
                                                                    group_symbol: item.symbol,
                                                                    group_name: item.group_title,
                                                                    service_id: service.service_id,
                                                                    service_name: service.service_title,
                                                                    price: priceData[service.service_id]?.pricingPackages || '',
                                                                    selected_packages: selectedPackages[service.service_id] || []
                                                                })}
                                                                className="mr-2"
                                                            />
                                                            <label htmlFor={`scope_${service.service_id}`} className="ml-2">{service.service_title}</label>
                                                        </div>
                                                    </td>

                                                    <td className="py-2 md:py-3 px-4 border-r border-b whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            name="pricingPackages"
                                                            value={priceData[service.service_id]?.pricingPackages || ""}
                                                            onChange={(e) => handlePriceChange(e, service.service_id)}
                                                            className='outline-none'
                                                            disabled={!selectedServices[service.service_id]}
                                                            onBlur={(e) => handlePriceChange(e, service.service_id)}  // Send on blur/focus out
                                                        />
                                                    </td>
                                                    <td className="py-2 md:py-3 px-4 border-r border-b whitespace-nowrap uppercase text-left">
                                                        <MultiSelect
                                                            options={packageList.map(pkg => ({ value: pkg.id, label: pkg.title }))}
                                                            value={selectedPackages[service.service_id]?.map(pkgId => ({
                                                                value: pkgId,
                                                                label: packageList.find(pkg => pkg.id === pkgId)?.title
                                                            })) || []}
                                                            onChange={(selectedList) => handlePackageChange(selectedList, service.service_id)}
                                                            labelledBy="Select"
                                                            disabled={!selectedServices[service.service_id]} // Enable if service is selected

                                                            className='uppercase'
                                                        />
                                                    </td>

                                                </tr>
                                            );
                                        });
                                    }

                                    return acc;
                                }, [])}

                            </tbody>

                        </table>

                    </div>
                </div>

                <div className="text-center">
                    <button type="submit" className="bg-[#c1dff2] text-[#4d606b]  rounded-md px-4 py-2  transition duration-200">
                        Submit
                    </button>

                    {apiError && <div className="text-red-500 mt-4">{apiError}</div>}
                </div>
            </form>
        </div>
    );
};

export default AddClient;
