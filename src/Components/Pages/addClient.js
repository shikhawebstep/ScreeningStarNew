import { React, useState, useEffect, useCallback } from "react";
import "../../App.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MultiSelect } from "react-multi-select-component";
import { State } from "country-state-city";
import axios from "axios";
import imageCompression from "browser-image-compression";
import ClientManagementData from "./admin-clienttable";
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css'


const states = State.getStatesOfCountry("IN");
const option = states.map((state) => ({ value: state.isoCode, label: state.name }));
const storedToken = localStorage.getItem("token");
const AddClient = () => {
    const [priceData, setPriceData] = useState({});
    const [service, setService] = useState([]);
    const [client_spocs, setclient_spocs] = useState([]);
    const [filtredService, setFiltredService] = useState({});
    const [escalation_manager, Setescalation_manager] = useState([]);
    const [billing_spocs, setbilling_spocs] = useState([]);
    const [billing_escalation, setbilling_escalation] = useState([]);
    const [authorizedDetails, setAuthorizedDetails] = useState([]);
    const [selectedServices, setSelectedServices] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const [services, setServices] = useState([]);
    const [packageList, setPackageList] = useState([]);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [date, setDate] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selected, setSelected] = useState([]);
    const [errors, setErrors] = useState({});
    const [branches, setBranches] = useState([{ branch_email: "", branch_name: "" }]);
    const [fileName, setFileName] = useState("");
    const [apiError, setApiError] = useState("");
    const [error, setError] = useState(null);



    const fetchclient_spoc = useCallback(() => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");

        if (!admin_id || !storedToken) {
            console.error('Missing admin_id or _token');
            return;
        }

        const url = `https://screeningstar-new.onrender.com/client-spoc/list?admin_id=${admin_id}&_token=${storedToken}`;

        fetch(url, { method: "GET", redirect: "follow" })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((result) => {
                const newToken = result.token || result._token || '';
                if (newToken) localStorage.setItem("_token", newToken);
                setclient_spocs(result.client_spocs);
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);
    const fetchescalation_manager = useCallback(() => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");

        if (!admin_id || !storedToken) {
            console.error('Missing admin_id or _token');
            return;
        }

        const url = `https://screeningstar-new.onrender.com/escalation-manager/list?admin_id=${admin_id}&_token=${storedToken}`;

        fetch(url, { method: "GET", redirect: "follow" })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((result) => {
                const newToken = result.token || result._token || '';
                if (newToken) localStorage.setItem("_token", newToken);
                const escalation_manager = result.escalation_managers;
                const escalation_managerOptions = escalation_manager.map(escalation => ({
                    name: escalation.name,
                    value: escalation.id,
                }));
                Setescalation_manager(escalation_managerOptions);
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);
    const fetchbilling_spoc = useCallback(() => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");

        if (!admin_id || !storedToken) {
            console.error('Missing admin_id or _token');
            return;
        }

        const url = `https://screeningstar-new.onrender.com/billing-spoc/list?admin_id=${admin_id}&_token=${storedToken}`;

        fetch(url, { method: "GET", redirect: "follow" })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((result) => {
                const newToken = result.token || result._token || '';
                if (newToken) localStorage.setItem("_token", newToken);
                const escalation_manager = result.billing_spocs;
                const escalation_managerOptions = escalation_manager.map(escalation => ({
                    name: escalation.name,
                    value: escalation.id,
                }));
                setbilling_spocs(escalation_managerOptions);
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);
    const fetchbilling_escalation = useCallback(() => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");

        if (!admin_id || !storedToken) {
            console.error('Missing admin_id or _token');
            return;
        }

        const url = `https://screeningstar-new.onrender.com/billing-escalation/list?admin_id=${admin_id}&_token=${storedToken}`;

        fetch(url, { method: "GET", redirect: "follow" })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((result) => {
                const newToken = result.token || result._token || '';
                if (newToken) localStorage.setItem("_token", newToken);
                const escalation_manager = result.billing_escalations;
                const escalation_managerOptions = escalation_manager.map(escalation => ({
                    name: escalation.name,
                    value: escalation.id,
                }));
                setbilling_escalation(escalation_managerOptions);
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);
    const fetchAuthorizedDetails = useCallback(() => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");

        if (!admin_id || !storedToken) {
            console.error('Missing admin_id or _token');
            return;
        }

        const url = `https://screeningstar-new.onrender.com/authorized-detail/list?admin_id=${admin_id}&_token=${storedToken}`;

        fetch(url, { method: "GET", redirect: "follow" })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((result) => {
                const newToken = result.token || result._token || '';
                if (newToken) localStorage.setItem("_token", newToken);
                const escalation_manager = result.authorized_details;
                const escalation_managerOptions = escalation_manager.map(escalation => ({
                    name: escalation.name,
                    value: escalation.id,
                }));
                setAuthorizedDetails(escalation_managerOptions);
            })
            .catch((error) => console.error('Fetch error:', error));
    }, []);


    

    useEffect(() => {
        fetchclient_spoc();
        fetchescalation_manager();
        fetchbilling_spoc();
        fetchbilling_escalation();
        fetchAuthorizedDetails();
    }, [fetchclient_spoc, fetchescalation_manager, fetchbilling_spoc, fetchbilling_escalation, fetchAuthorizedDetails])





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

    const [clientData, setClientData] = useState({
        company_name: "",
        client_code: "",
        address: "",
        state: "",
        state_code: "",
        gstin: "",
        tat: "",
        emails: "",
        date_agreement: "",
        clientProcedure: "",
        agreement_period: "",
        custom_template: "",
        client_logo: "",
        scopeOfServices: [],
        phone: "",
        role: "",
        standard_process: "",
        client_spoc: "",
        escalation_manager: "",
        billing_spoc: "",
        billing_escalation: "",
        authorizedPerson: "",
        username: "",
    });



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
                // Log the result to understand its structure
                console.log('package', result);

                // Extracting services data into separate variables
                setPackageList(result.packages);
            })
            .catch((error) => console.error('Error fetching services:', error));
    }, [storedToken]);
    console.log("service", service);
    useEffect(() => {
        const updatedServiceData = service.map((item) => {
            const packageObject = (selectedPackages[item.id] || []).reduce((acc, pkgId) => {
                const pkg = packageList.find(p => p.id === pkgId);
                if (pkg) {
                    acc[pkg.id] = pkg.packageName;
                }
                return acc;
            }, {});
            return {
                serviceId: item.id,
                sub_serviceName: item.sub_service_name,
                serviceCode: item.service_code,
                serviceTitle: item.service_name,
                pricingPackages: priceData[item.id]?.pricingPackages || '',
                packages: packageObject,
            };
        });
        const filteredSelectedData = updatedServiceData.filter(item => selectedServices[item.serviceId]);

        setSelectedData(updatedServiceData);
        console.log("us=", updatedServiceData);
        setFiltredService(filteredSelectedData);
        console.log("updatedServiceData=", updatedServiceData);
    }, [service, selectedPackages, priceData, selectedServices, packageList]);

    useEffect(() => {
        fetchServices();
        fetchPackages();
    }, [fetchServices, fetchPackages]);

    // 1. Handle checkbox change (checking/unchecking a service)
    const handleCheckboxChange = ({ group_id, group_symbol, group_name, service_id, service_name, price, selected_packages }) => {
        setSelectedServices(prevSelectedServices => ({
            ...prevSelectedServices,
            [service_id]: !prevSelectedServices[service_id] // Toggle checkbox state
        }));

        // Send the data when checkbox is clicked
        sendDataToServer({
            group_id,
            group_symbol,
            group_name,
            service_id,
            service_name,
            price,
            selected_packages,
            action: "checkbox_change"
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
        console.log("Updated clientData.scopeOfServices:", clientData.scopeOfServices);

        return true;
    }



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
            console.log("Updated clientData.scopeOfServices:", clientData.scopeOfServices);  // The updated scopeOfServices array (from clientData)
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload2 = {
            ...clientData,
            branches, // Assuming branches is a state or variable holding branch details
            date_agreement: date,// Converting selected package options to a comma-separated string
            login_required: selectedOption, // Assuming this is the login_required value
            scopeOfServices: {
                ...filtredService // Assuming this contains filtered service details
            },
        };
        console.log('payload', payload2);
        return;

        setApiError(""); // Clear any previous API errors

        // Validate form before proceeding


        let fileNameWithTimestamp = "";

        try {
            // Image compression options
            const options = {
                maxSizeMB: 1,
                useWebWorker: true,
                initialQuality: 1,
            };

            // Compress client logo
            const compressedFile = await imageCompression(clientData.client_logo, options);
            const timestamp = Date.now();
            fileNameWithTimestamp = `${timestamp}_${compressedFile.name}`;
        } catch (error) {
            console.error("Error compressing or uploading image:", error);
            setApiError("Failed to upload image.");
            return; // Exit if image compression fails
        }

        // Create the payload with 'scopeOfServices' as a nested object
        const payload = {
            ...clientData,
            branches, // Assuming branches is a state or variable holding branch details
            date_agreement: date,// Converting selected package options to a comma-separated string
            login_required: selectedOption, // Assuming this is the login_required value
            client_logo: fileNameWithTimestamp,
            scopeOfServices: {
                ...filtredService // Assuming this contains filtered service details
            },
        };

        try {
            // Submit the form data via POST request
            const response = await axios.post("https://screeningstar.onrender.com/Screeningstar/clients", payload, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedToken}`, // Assuming storedToken is the token retrieved from localStorage
                },
            });

            // Reset the form fields after successful submission
            setClientData({
                company_name: "",
                client_code: "",
                address: "",
                state: "",
                state_code: "",
                gstin: "",
                tat: "",
                emails: "",
                date_agreement: "",
                clientProcedure: "",
                agreement_period: "",
                custom_template: "",
                client_logo: "",
                scopeOfServices: [],
                phone: "",
                role: "",
                standard_process: "",
                username: "",
            });

            setSelected([]); // Clear package options
            setBranches([{ branch_email: "", branch_name: "" }]); // Reset branches
            setDate(null); // Reset service agreement date
            setSelectedOption(null); // Reset login requirement option
            setFileName(""); // Reset file name

        } catch (error) {
            console.error("Error submitting form:", error);
            setApiError("Failed to submit data. Please try again."); // Display error message
        }
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
                            name="phone"
                            placeholder="Enter Mobile Number"
                            value={clientData.phone}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.phone ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                        {errors.phone && <span className="text-red-500">{errors.phone}</span>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Email</label>
                        <input
                            type="text"
                            name="emails"
                            placeholder="Enter Email"
                            value={clientData.emails}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.emails ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                        {errors.emails && <span className="text-red-500">{errors.emails}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Service Agreement Date</label>
                        <DatePicker
                            selected={date}
                            onChange={(date) => setDate(date)}
                            placeholderText="Select Service Agreement Date"
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.date_agreement ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
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
                        <input type="file" name="client_logo" onChange={handleChange} className="w-full rounded-md p-2.5 mb-[20px] border border-gray-300 bg-[#f7f6fb]" />
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
                            options={escalation_manager}
                            value={clientData.escalation_manager}
                            name="escalation_manager"
                            placeholder="Choose your language"
                            onChange={(value) => handleChange({ target: { name: "escalation_manager", value } })}
                            search
                        />

                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Client Spoc</label>
                        <SelectSearch
                            options={client_spocs}
                            value={clientData.client_spoc}
                            name="client_spoc"
                            placeholder="Choose your language"
                            onChange={(value) => handleChange({ target: { name: "client_spoc", value } })}
                            search
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Billing Spoc</label>
                        <SelectSearch
                            options={billing_spocs}
                            value={clientData.billing_spoc}
                            name="billing_spoc"
                            placeholder="Choose your language"
                            onChange={(value) => handleChange({ target: { name: "billing_spoc", value } })}
                            search
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Billing Escalation</label>
                        <SelectSearch
                            options={billing_escalation}
                            value={clientData.billing_escalation}
                            name="billing_escalation"
                            placeholder="Choose your language"
                            onChange={(value) => handleChange({ target: { name: "billing_escalation", value } })}
                            search
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Authorized Details</label>

                        <SelectSearch
                            options={authorizedDetails}
                            value={clientData.authorizedPerson}
                            name="authorizedPerson"
                            placeholder="Choose your language"
                            onChange={(value) => handleChange({ target: { name: "authorizedPerson", value } })}
                            search
                        />

                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Login Required Option</label>
                        <select
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.login_required ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        >
                            <option value="">Login Required Option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        {errors.login_required && <span className="text-red-500">{errors.login_required}</span>}
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
                            name="standard_process"
                            placeholder="Enter Standard Process"
                            value={clientData.standard_process}
                            onChange={handleChange}
                            className={`w-full rounded-md p-2.5 mb-[20px] border ${errors.standard_process ? "border-red-500" : "border-gray-300"} bg-[#f7f6fb]`}
                        />
                        {errors.standard_process && <span className="text-red-500">{errors.standard_process}</span>}
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
                                    required
                                />
                            </div>
                            <div className="flex w-1/2 items-center">
                                <input type="text" name="branch_name" value={branch.branch_name} onChange={(event) => handleInputChange(index, event)} placeholder="Branch Name" className="border w-full rounded-md p-2.5 mb-[20px]" required />
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
