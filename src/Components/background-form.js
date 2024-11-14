import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaGraduationCap, FaBriefcase, FaIdCard } from 'react-icons/fa';

const BackgroundVerificationForm = () => {
    const [employmentType, setEmploymentType] = useState("Experienced");
    const [mobileNumber, setMobileNumber] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [spouseName, setSpouseName] = useState("");
    const [servicesIds, setServicesIds] = useState([]);
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [pan, setPan] = useState("");
    const [aadhar, setAadhar] = useState("");
    const [ssn, setSsn] = useState("");
    const [nationality, setNationality] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [govtIdFiles, setGovtIdFiles] = useState([]);
    const [isValidApplication, setIsValidApplication] = useState(true);
    const [serviceData, setServiceData] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const location = useLocation();
  const [branchId, setBranchId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [annexure, setAnnexure] = useState({});


  const [formData, setFormData] = useState({
    full_name: "",
    former_name: "",
    mb_no: "",
    father_name: "",
    husband_name: "",
    dob: "",
    gender: "",
    pan: "",
    aadhar: "",
    social_security_number: "",
    nationality: "",
    marital_status: "",
    signature: "",
    name_declaration: "",
    declaration_date: ""
});
    const currentURL = location.pathname + location.search;
   
    function getValuesFromUrl(currentURL) {
        const result = {};
        const keys = [
            "YXBwX2lk",
            "YnJhbmNoX2lk",
            "Y3VzdG9tZXJfaWQ="
        ];

        keys.forEach(key => {
            const regex = new RegExp(`${key}=([^&]*)`);
            const match = currentURL.match(regex);
            result[key] = match && match[1] ? match[1] : null;
        });

        function isValidBase64(str) {
            const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
            return base64Pattern.test(str) && (str.length % 4 === 0);
        }

        function decodeKeyValuePairs(obj) {
            return Object.entries(obj).reduce((acc, [key, value]) => {
                const decodedKey = isValidBase64(key) ? atob(key) : key;
                const decodedValue = value && isValidBase64(value) ? atob(value) : null;
                acc[decodedKey] = decodedValue;
                return acc;
            }, {});
        }

        return decodeKeyValuePairs(result);
    }

    const decodedValues = getValuesFromUrl(currentURL);

    const isApplicationExists = useCallback(() => {
        if (isValidApplication && decodedValues.app_id && decodedValues.branch_id && decodedValues.customer_id) {
            fetch(`https://screeningstar-new.onrender.com/branch/candidate-application/backgroud-verification/is-application-exist?candidate_application_id=${decodedValues.app_id}&branch_id=${decodedValues.branch_id}&customer_id=${decodedValues.customer_id}`)
                .then(res => res.json())
                .then(result => {
                    if (!result.status) {
                        setIsValidApplication(false);
                        const form = document.getElementById('bg-form');
                        Swal.fire({
                            title: 'Error',
                            text: result.message,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                        if (form) form.remove();
                    } else {
                        const services = result.data.services.split(',').map(service => service.trim());
                        setServicesIds(services);
                        
                    }
                })
                .catch(err => {
                    Swal.fire({
                        title: 'Error',
                        text: err.message,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                });
        }
    }, [isValidApplication, decodedValues.app_id, decodedValues.branch_id, decodedValues.customer_id]);

    useEffect(() => {
        isApplicationExists();
    }, [isApplicationExists]);

    const fetchServices = useCallback(() => {
        if (servicesIds.length > 0) {
            Promise.all(servicesIds.map(serviceId =>
                fetch(`https://screeningstar-new.onrender.com/branch/candidate-application/backgroud-verification/service-form-json?service_id=${serviceId}`)
                    .then(res => res.json())
                    .catch(err => {
                        Swal.fire({
                            title: 'Error',
                            text: `Service ${serviceId}: ${err.message}`,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                        return null;
                    })
            )).then(results => {
                const fetchedServices = results
                    .filter(result => result && result.status && result.formJson)
                    .flatMap(result => result.formJson);
                setServiceData(fetchedServices);
            });
        }
    }, [servicesIds]);

    useEffect(() => {
        if (servicesIds.length > 0) {
            fetchServices();
        }
    }, [servicesIds, fetchServices]);

    const parseJsonSafely = (jsonString) => {
        try {
            const sanitizedString = jsonString.replace(/\\/g, '\\\\');
            return JSON.parse(sanitizedString);
        } catch (error) {
            console.error("Failed to parse JSON", error);
            return null;
        }
    };

    const handleCheckboxChange = (serviceId, isChecked) => {
        setSelectedServices((prevSelectedServices) =>
            isChecked
              ? [...prevSelectedServices, serviceId]
              : prevSelectedServices.filter((id) => id !== serviceId)
          );
    };

    const handleCloseForm = (serviceId) => {
        setSelectedServices((prevSelectedServices) =>
            prevSelectedServices.filter((id) => id !== serviceId)
          );
        
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
    
        // If input is of type 'file', handle it differently
        if (type === "file") {
            setFormData(prevFormData => ({
                ...prevFormData,
                annexure: {
                    ...prevFormData.annexure,
                    [name]: files[0] ? files[0].name : ""
                }
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };
  
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const raw = JSON.stringify({
            branch_id: decodedValues.branch_id,
            customer_id: decodedValues.customer_id,
            application_id: decodedValues.app_id,
            personal_information: {
                ...formData
            },
            annexure: annexure
        });

        // Set headers
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // API request options
        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        // Make the API call
        fetch("https://screeningstar-new.onrender.com/branch/candidate-application/backgroud-verification/submit", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to submit data');
                }
                return response.text();
            })
            .then((result) => {
                console.log(result);

            })
            .catch((error) => {
                console.error('Error:', error);

            });
    };
      const handleInputChange = (category, key, value) => {
        setAnnexure(prevAnnexure => ({
            ...prevAnnexure,
            [category]: {
                ...prevAnnexure[category],
                [key]: value
            }
        }));
    };
    
    return (
        <div className=" min-h-screen flex flex-col items-center ">
            <div className="text-center bg-[#c1dff2] flex w-full flex-col py-5 ">
                <a href="https://screeningstar.in/" className="text-4xl font-bold text-center text-[#4d606b]">
                    <p>Support Call - 88289382</p>
                </a>
            </div>

            <div className="bg-white w-full shadow-lg">
                <h2 className="text-4xl font-bold text-center text-[#4d606b] mb-5 mt-2">Background Verification Form</h2>
                <form method="post" encType="multipart/form-data" id="bg-form" onSubmit={handleSubmit}>
                    <input type="hidden" name="client_id" value="BRB1000" />
                    <input type="hidden" name="candidate_id" value="249" />
                    <input type="hidden" name="company_name" value="Individual Verification" />
                    <input type="hidden" name="candidate_email" value="vanshwebstep@gmail.com" />
                    <input type="hidden" name="company_email" value="khuranakaran2000@gmail.com" />

                    <h3 className="text-3xl mb-5 font-semibold text-gray-700">Company Name: Individual Verification</h3>

                    <div className="mb-5">
                        <label className="block text-gray-600 font-medium">Applicant’s CV:</label>
                        <input
                            type="file"
                            name="resume_file"
                            className="border rounded p-2 w-full"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-600 font-medium">Attach Govt. ID Proof:</label>
                        <input
                            type="file"
                            name="govt_id"
                            multiple
                            className="border rounded p-2 w-full"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex">
                        <div className="w-full md:w-2/3 mx-auto">
                            {selectedServices.map((serviceId) => {
                                const service = serviceData.find(s => s.id === serviceId);
                                const parsedJson = parseJsonSafely(service.json);
                                return parsedJson ? (
                                    <div key={serviceId} className="service-form-container bg-white shadow-lg rounded-lg p-6 mb-8">

                                        <div className="form-content bg-gray-50 relative p-8 rounded-lg shadow-inner">
                                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{parsedJson.heading}</h3>
                                            <button
                                                type="button"
                                                className="close-btn absolute right-6 top-6 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                                onClick={() => handleCloseForm(serviceId)}
                                            >
                                                X
                                            </button>
                                            {parsedJson.rows.map((row, rowIndex) => {
                                                const numInputs = row.inputs.length;
                                                const inputWidthClass = numInputs === 1 ? 'w-full' : numInputs === 2 ? 'w-1/2' : numInputs === 3 ? 'w-1/3' : 'w-full';

                                                return (
                                                    <div key={rowIndex} className="form-row flex gap-6 mb-6">
                                                        {row.inputs.map((input, inputIndex) => (
                                                            <div key={inputIndex} className={`input-container p-4 ${inputWidthClass}`}>
                                                                <div className="mb-2">
                                                                    <label className="text-lg font-medium text-gray-700">{input.label}</label>
                                                                </div>
                                                                <div>
                                                                    {input.type === 'checkbox' ? (
                                                                        <div className="flex items-center space-x-2">
                                                                            <input
                                                                                type={input.type}
                                                                                name={input.name}
                                                                                required={input.required}
                                                                                onChange={(e) => handleInputChange(parsedJson.db_table, input.name, e.target.value)}
                                                                                className="form-checkbox h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-400"
                                                                            />
                                                                            <span className="text-lg text-gray-800">{input.label}</span>
                                                                        </div>
                                                                    ) : input.type === 'select' ? (
                                                                        <select
                                                                            name={input.name}
                                                                            required={input.required}
                                                                            onChange={(e) => handleInputChange(parsedJson.db_table, input.name, e.target.value)}
                                                                            className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        >
                                                                            {input.options.map((option, optionIndex) => (
                                                                                <option key={optionIndex} value={option}>
                                                                                    {option}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    ) : input.type === 'file' ? (
                                                                        <input
                                                                            type={input.type}
                                                                            name={input.name}
                                                                            required={input.required}
                                                                            multiple={input.multiple}
                                                                            onChange={(e) => handleInputChange(parsedJson.db_table, input.name, e.target.value)}
                                                                            className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        />
                                                                    ) : (
                                                                        <input
                                                                            type={input.type}
                                                                            name={input.name}
                                                                            required={input.required}
                                                                            placeholder={input.label}
                                                                            onChange={(e) => handleInputChange(parsedJson.db_table, input.name, e.target.value)}
                                                                            className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : null;
                            })}
                        </div>

                        <div className="w-full md:w-1/3">
                            <div className=" text-gray-700 p-3">
                                <table className="border table border-gray-400 w-full">
                                    <thead>
                                        <tr>
                                            <th className="p-3 bg-[#3e76a5] text-white border">Service</th>
                                            <th className="p-3 bg-[#3e76a5] text-white border">Service Names</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {serviceData.map((service, index) => {
                                            const parsedJson = parseJsonSafely(service.json);
                                            if (!parsedJson) return null;

                                            return (
                                                <tr key={service.id}>
                                                    <td className="p-3 text-center border">
                                                        <input
                                                            type="checkbox"
                                                            name="candi_services[]"
                                                            className="candidate_servlist"
                                                            value={service.id}
                                                            checked={selectedServices.includes(service.id)}
                                                            onChange={(e) => handleCheckboxChange(service.id, e.target.checked)}
                                                        />
                                                    </td>
                                                    <td className="p-3 border">
                                                        <label htmlFor={`candi_services_${service.id}`}>
                                                            {parsedJson.heading || `Service ${index + 1}`}
                                                        </label>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>

                    <h4 className="text-3xl font-semibold text-center text-gray-700 my-4">Personal Information</h4>
                    <div className="flex flex-wrap bg-gray-100">
                        <div className="w-full md:w-1/2 p-2">
                            <label className="block text-gray-600 font-medium">Full Name as per Govt ID:</label>
                            <input
                                type="text"
                                className="border rounded p-2 w-full"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/2 p-2">
                            <label className="block text-gray-600 font-medium">Former Name (if applicable):</label>
                            <input
                             type="text"
                             name="former_name"
                             className="border rounded p-2 w-full"
                             value={formData.former_name}
                             onChange={handleChange}
                             required
                             />
                        </div>
                        <div className="w-full md:w-1/3 p-2">
                            <label className="block text-gray-600 font-medium">Mobile Number:</label>
                            <input
                                type="text"
                                name="mb_no"
                                className="border rounded p-2 w-full"
                                value={formData.mb_no}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3 p-2">
                            <label className="block text-gray-600 font-medium">Father's Name:</label>
                            <input
                                type="text"
                                 name="father_name"
                                className="border rounded p-2 w-full"
                                value={formData.father_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3 p-2">
                            <label className="block text-gray-600 font-medium">Spouse's Name:</label>
                            <input
                                type="text"
                                 name="husband_name"
                                className="border rounded p-2 w-full"
                                value={formData.husband_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="w-full md:w-1/3 p-2">
                            <label className="block text-gray-600 font-medium">DOB:</label>
                            <input
                                type="date"
                                 name="dob"
                                className="border rounded p-2 w-full"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3 p-2">
                            <label className="block text-gray-600 font-medium">Gender:</label>
                            <input
                                type="text"
                                 name="gender"
                                className="border rounded p-2 w-full"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3 p-2">
                            <label className="block text-gray-600 font-medium">PAN Card No:</label>
                            <input
                                type="text"
                                 name="pan"
                                className="border rounded p-2 w-full"
                                value={formData.pan}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3 p-2">
                            <label className="block text-gray-600 font-medium">Aadhar No:</label>
                            <input
                                type="text"
                                 name="aadhar"
                                className="border rounded p-2 w-full"
                                value={formData.aadhar}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3 p-2">
                            <label className="block text-gray-600 font-medium">SSN (if applicable):</label>
                            <input
                                type="text"
                                 name="social_security_number"
                                className="border rounded p-2 w-full"
                                value={formData.social_security_number}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="w-full md:w-1/3 p-2">
                            <label className="block text-gray-600 font-medium">Nationality:</label>
                            <input
                                type="text"
                                 name="nationality"
                                className="border rounded p-2 w-full"
                                value={formData.nationality}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3 p-2">
                            <label className="block text-gray-600 font-medium">Marital Status:</label>
                            <select
                                 value={formData.marital_status}
                                  name="marital_status"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            >
                                <option value="">Select...</option>
                                <option value="Married">Married</option>
                                <option value="Single">Single</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-center mt-5">
                        <button type="submit" className="bg-blue-400 text-white py-2 px-6 rounded hover:bg-blue-600">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default BackgroundVerificationForm;