import React, { useState, useEffect, useCallback } from 'react';

const GenerateReport = () => {
    const [submittedData, setSubmittedData] = useState(null); // State to hold submitted data

    const [loading, setLoading] = useState(true);
    const [servicesForm, setServicesForm] = useState('');
    const [servicesDataInfo, setServicesDataInfo] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [referenceId, setReferenceId] = useState("");
    const [formValues, setFormValues] = useState({}); // To store form values dynamically

    const [formData, setFormData] = useState({
        applicantName: '',
        application_id: '',
        contactNumber: '',
        monthYear: '',
        initiationDate: '',
        clientOrganization: '',
        verificationPurpose: '',
        applicantEmployeeID: '',
        clientCode: '',
        contactNumber2: '',
        fatherFullName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        nationality: '',
        insuffClearedDate: '',
        full_address: '',
        stay_from: '',
        stay_to: '',
        landmark: '',
        pin_code: '',
        state: '',
        ca_full_address: '',
        ca_landmark: '',
        ca_residence_mobile_no: '',
        ca_state: '',
        firstLevelRemarks: '',
        firstInsuffRaisedDate: '',
        firstInsuffClearedDate: '',
        secondLevelRemarks: '',
        secondInsuffRaisedDate: '',
        secondInsuffClearedDate: '',
        thirdLevelRemarks: '',
        thirdInsuffRaisedDate: '',
        thirdInsuffClearedDate: '',
        overallStatus: '',
        reportDate: '',
        reportStatus: '',
        reportType: '',
        reportGeneratedBy: '',
        qcDoneBy: '',
        verificationStatus: '',
        verificationInitiated: '',
        deadlineDate: '',
        qualityTeamVerification: '',
        remarks: '',
        reasonForDelay: '',
    });


    const [date, setDate] = useState('');
    const [inputType, setInputType] = useState('text');
    const handleFocus = () => setInputType('date');
    const handleBlur = () => !date && setInputType('text');

    const applicationId = new URLSearchParams(window.location.search).get('applicationId');
    const branchid = new URLSearchParams(window.location.search).get('branchid');

    // Set referenceId only once when applicationId changes
    useEffect(() => {
        if (applicationId) setReferenceId(applicationId);
    }, [applicationId]);

    const fetchApplicationData = useCallback(() => {
        const adminId = JSON.parse(localStorage.getItem("admin"))?.id;
        const token = localStorage.getItem('_token');

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(`https://screeningstar-new.onrender.com/client-master-tracker/application-by-id?application_id=${applicationId}&branch_id=${branchid}&admin_id=${adminId}&_token=${token}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                const newToken = result.token || result._token || '';
                if (newToken) {
                    localStorage.setItem("_token", newToken);
                }
                const application = result.application;
                const formDataa = result.cmtData || [];
                const services = application.services;
                console.log(`services - `, services);
                fetchServicesJson(services);
                setServicesForm(services);
                console.log(`ServicesForm - `, servicesForm);
                setServicesData(result);

                setFormData({
                    applicantName: formData.applicantName || application.name || '',
                    application_id: formData.application_id || application.application_id || '',
                    contactNumber: formData.contactNumber || application.contactNumber || '',
                    monthYear: formData.monthYear || '',
                    initiationDate: formData.initiationDate || application.created_at || '',
                    clientOrganization: formData.clientOrganization || application.name || '',
                    verificationPurpose: formData.verificationPurpose || formDataa.verificationPurpose || '',
                    applicantEmployeeID: formData.applicantEmployeeID || application.employee_id || '',
                    clientCode: formData.clientCode || '',
                    contactNumber2: formData.contactNumber2 || formDataa.contactNumber2 || '',
                    fatherFullName: formData.fatherFullName || formDataa.fatherFullName || '',
                    dateOfBirth: formData.dateOfBirth || formDataa.dateOfBirth || '',
                    gender: formData.gender || formDataa.gender || '',
                    maritalStatus: formData.maritalStatus || formDataa.maritalStatus || '',
                    nationality: formData.nationality || formDataa.nationality || '',
                    insuffClearedDate: formData.insuffClearedDate || formDataa.insuffClearedDate || '',
                    full_address: formData.full_address || formDataa.full_address || '',
                    stay_from: formData.stay_from || formDataa.stay_from || '',
                    stay_to: formData.stay_to || formDataa.stay_to || '',
                    landmark: formData.landmark || formDataa.landmark || '',
                    pin_code: formData.pin_code || formDataa.pin_code || '',
                    state: formData.state || formDataa.state || '',
                    ca_full_address: formData.ca_full_address || formDataa.ca_full_address || '',
                    ca_landmark: formData.ca_landmark || formDataa.ca_landmark || '',
                    ca_residence_mobile_no: formData.ca_residence_mobile_no || formDataa.ca_residence_mobile_no || '',
                    ca_state: formData.ca_state || formDataa.ca_state || '',
                    firstLevelRemarks: formData.firstLevelRemarks || formDataa.firstLevelRemarks || '',
                    firstInsuffRaisedDate: formData.firstInsuffRaisedDate || formDataa.firstInsuffRaisedDate || '',
                    firstInsuffClearedDate: formData.firstInsuffClearedDate || formDataa.firstInsuffClearedDate || '',
                    secondLevelRemarks: formData.secondLevelRemarks || formDataa.secondLevelRemarks || '',
                    secondInsuffRaisedDate: formData.secondInsuffRaisedDate || formDataa.secondInsuffRaisedDate || '',
                    secondInsuffClearedDate: formData.secondInsuffClearedDate || formDataa.secondInsuffClearedDate || '',
                    thirdLevelRemarks: formData.thirdLevelRemarks || formDataa.thirdLevelRemarks || '',
                    thirdInsuffRaisedDate: formData.thirdInsuffRaisedDate || formDataa.thirdInsuffRaisedDate || '',
                    thirdInsuffClearedDate: formData.thirdInsuffClearedDate || formDataa.thirdInsuffClearedDate || '',
                    overallStatus: formData.overallStatus || formDataa.overallStatus || '',
                    reportDate: formData.reportDate || formDataa.reportDate || '',
                    verificationInitiated: formData.verificationInitiated || formDataa.verificationInitiated || '',
                    deadlineDate: formData.deadlineDate || formDataa.deadlineDate || '',
                    reportStatus: formData.reportStatus || formDataa.reportStatus || '',
                    reportType: formData.reportType || formDataa.reportType || '',
                    reportGeneratedBy: formData.reportGeneratedBy || formDataa.reportGeneratedBy || '',
                    qcDoneBy: formData.qcDoneBy || formDataa.reportTyqcDoneBype || '',
                    verificationStatus: formData.verificationStatus || formDataa.verificationStatus || '',
                    qualityTeamVerification: formData.qualityTeamVerification || formDataa.qualityTeamVerification || '',
                    remarks: formData.remarks || formDataa.remarks || '',
                    reasonForDelay: formData.reasonForDelay || formDataa.reasonForDelay || '',
                });
                setLoading(false); // Set loading to false after data is loaded
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, [applicationId, branchid]);

    const fetchServicesJson = useCallback((servicesList) => {
        const adminId = JSON.parse(localStorage.getItem("admin"))?.id;
        const token = localStorage.getItem('_token');
        console.log(`servicesList - `, servicesList);
        if (!servicesList || servicesList.length === 0) {
            console.log("No services available.");
            return; // Exit the function if the string is empty or undefined
        }

        // If servicesList is a non-empty string, continue processing
        const serviceIds = servicesList.split(",");
        // Ensure this is a string
        console.log(`serviceIds - `, serviceIds);

        const fetchService = (serviceId) => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };

            return fetch(`https://screeningstar-new.onrender.com/client-master-tracker/report-form-json-by-service-id?service_id=${serviceId}&admin_id=${adminId}&_token=${token}`, requestOptions)
                .then((response) => {
                    if (response.ok && response.status) {
                        return response.json();  // Only parse JSON if response is successful and status is 200
                    }
                })
                .catch((error) => console.error(`Error fetching service ${serviceId}:`, error));
        };

        Promise.all(serviceIds.map((id) => fetchService(id)))
            .then((results) => {
                const newToken = results.token || results._token || '';
                if (newToken) {
                    localStorage.setItem("_token", newToken);
                }
                const filteredResults = results.filter(item => item != null);
                console.log(`results - `, filteredResults); // Log all results at once
                setServicesDataInfo( filteredResults || []);

            })
            .catch((error) => console.error('Error fetching services:', error));
        console.log(`ServicesDataInfo - `, servicesDataInfo);
    }, []);  // Adding servicesForm as a dependency


    useEffect(() => {
        fetchApplicationData();
    }, [fetchApplicationData]);
    useEffect(() => {
        fetchServicesJson();
    }, [fetchServicesJson]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const submissionData = servicesDataInfo.map((serviceData) => {
            if (serviceData.status) {
                const formJson = JSON.parse(serviceData.reportFormJson.json);
                if (formJson) {
                    const annexure = {}; // Initialize annexure for nested fields

                    formJson.rows.forEach((row) => {
                        row.inputs.forEach((input) => {
                            const fieldName = input.name;
                            const fieldValue = formValues[fieldName] || '';
                            const tableKey = formJson.db_table;

                            if (fieldName.startsWith('annexure.')) {
                                // Handle annexure fields (e.g., annexure.court_verification.court_name)
                                const [, category, key] = fieldName.split('.');
                                if (!annexure[category]) {
                                    annexure[category] = {}; // Create the annexure table if not exists
                                }
                                annexure[category][key] = fieldValue;
                            } else {
                                // For non-annexure fields, add directly under annexure[db_table]
                                if (!annexure[tableKey]) {
                                    annexure[tableKey] = {};
                                }
                                annexure[tableKey][fieldName] = fieldValue;
                            }
                        });
                    });

                    return { annexure };
                }

            }
        });

        setSubmittedData(submissionData);
        const filteredData = submissionData.filter(item => item != null);
        console.log('Submitted Data:', filteredData); // Log to console
    };




    return (
        <div className="bg-[#c1dff2] p-6">
            <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">GENERATE REPORT</h2>
            <div className="bg-white p-12 w-full mx-auto">
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <form className="space-y-4" autoComplete="off" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="apid" className="block text-gray-700">Reference ID</label>
                            <input
                                type="text"
                                name="application_id"
                                id="apidoo"
                                value={formData.application_id}
                                readOnly
                                className="w-full p-3 mb-4 border border-gray-300 rounded-md"
                            />
                            <input type="hidden" name="apid" id="apid" value={referenceId} />
                        </div>
                        <div className=" form start space-y-4 py-[30px] px-[51px] bg-white rounded-md" id="client-spoc">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col ">
                                    <label htmlFor="monthYear" className="mb-1 text-sm font-semibold">Month - Year*</label>
                                    <input
                                        type="text"
                                        name="monthYear"
                                        id="monthYear"
                                        placeholder="Month - Year*"
                                        value={formData.monthYear}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"

                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="initiationDate" className="mb-1 text-sm font-semibold">Inflation Date</label>
                                    <input
                                        type={inputType}
                                        name="initiationDate"
                                        id="initiationDate"
                                        placeholder={inputType === 'text' ? 'Inflation Date' : ''}
                                        value={formData.initiationDate}
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"

                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="clientOrganization" className="mb-1 text-sm font-semibold">Name of the Client Organization</label>
                                    <input
                                        type="text"
                                        name="clientOrganization"
                                        id="clientOrganization"
                                        value={formData.clientOrganization}
                                        onChange={handleChange}
                                        placeholder="Name of the Client Organization"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"

                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="verificationPurpose" className="mb-1 text-sm font-semibold">Verification Purpose*</label>
                                    <input
                                        type="text"
                                        name="verificationPurpose"
                                        id="verificationPurpose"
                                        value={formData.verificationPurpose}
                                        onChange={handleChange}
                                        placeholder="Verification Purpose*"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"

                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="applicantEmployeeID" className="mb-1 text-sm font-semibold">Applicant Employee ID</label>
                                    <input
                                        type="text"
                                        name="applicantEmployeeID"
                                        id="applicantEmployeeID"
                                        value={formData.applicantEmployeeID}
                                        onChange={handleChange}
                                        placeholder="Applicant Employee ID"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="clientCode" className="mb-1 text-sm font-semibold">Client Code</label>
                                    <input
                                        type="text"
                                        name="clientCode"
                                        id="clientCode"
                                        value={formData.clientCode}
                                        onChange={handleChange}
                                        placeholder="Client Code"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"

                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="applicantName" className="mb-1 text-sm font-semibold">Name of the Applicant*</label>
                                    <input
                                        type="text"
                                        name="applicantName"
                                        id="applicantName"
                                        value={formData.applicantName}
                                        onChange={handleChange}
                                        placeholder="Name of the Applicant*"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"

                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="contactNumber" className="mb-1 text-sm font-semibold">Contact Number</label>
                                    <input
                                        type="number"
                                        name="contactNumber"
                                        id="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        placeholder="Contact Number"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="contactNumber2" className="mb-1 text-sm font-semibold">Contact Number 2</label>
                                    <input
                                        type="number"
                                        name="contactNumber2"
                                        id="contactNumber2"
                                        value={formData.contactNumber2}
                                        onChange={handleChange}
                                        placeholder="Contact Number 2"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="fatherFullName" className="mb-1 text-sm font-semibold">Father Full Name</label>
                                    <input
                                        type="text"
                                        name="fatherFullName"
                                        id="fatherFullName"
                                        value={formData.fatherFullName}
                                        onChange={handleChange}
                                        placeholder="Father Full Name"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="dateOfBirth" className="mb-1 text-sm font-semibold">Date Of Birth</label>
                                    <input
                                        type={inputType}
                                        name="dateOfBirth"
                                        id="dateOfBirth"
                                        placeholder={inputType === 'text' ? 'Date Of Birth' : ''}
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="gender" className="mb-1 text-sm font-semibold">Gender</label>
                                    <select
                                        name="gender"
                                        id="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb]  border-gray-300"
                                    >
                                        <option value="" disabled>Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="maritalStatus" className="mb-1 text-sm font-semibold">Marital Status</label>
                                    <select
                                        name="maritalStatus"
                                        id="maritalStatus"
                                        value={formData.maritalStatus}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb]  border-gray-300"
                                    >
                                        <option value="" disabled>Marital Status</option>
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="nationality" className="mb-1 text-sm font-semibold">Nationality</label>
                                    <input
                                        type="text"
                                        name="nationality"
                                        id="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        placeholder="Nationality"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="insuffClearedDate" className="mb-1 text-sm font-semibold">Insuff Cleared Date / Re-Opened Date*</label>
                                    <input
                                        type="date"
                                        name="insuffClearedDate"
                                        id="insuffClearedDate"
                                        value={formData.insuffClearedDate}
                                        onChange={handleChange}
                                        placeholder="Insuff Cleared Date / Re-Opened Date*"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"

                                    />
                                </div>
                            </div>

                            <div className='permanentaddress '>
                                <div className='my-4'>permanent address</div>
                                <div className="space-y-4 py-[30px]  border border-[#3e76a5] px-[51px] bg-white rounded-md" id="address-form"
                                >
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex flex-col">
                                            <label htmlFor="full_address" className="mb-1 text-sm font-semibold">Full Address*</label>
                                            <input
                                                type="text"
                                                name="full_address"
                                                id="full_address"
                                                value={formData.full_address}
                                                onChange={handleChange}
                                                placeholder="Full Address*"
                                                className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"

                                            />
                                        </div>
                                    </div>

                                    <h5 className="font-semibold text-lg">Period of Stay</h5>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <label htmlFor="stay_from" className="mb-1 text-sm font-semibold">From:</label>
                                            <input
                                                type="text"
                                                name="stay_from"
                                                id="stay_from"
                                                value={formData.stay_from}
                                                onChange={handleChange}
                                                placeholder="From"
                                                className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label htmlFor="stay_to" className="mb-1 text-sm font-semibold">To:</label>
                                            <input
                                                type="text"
                                                name="stay_to"
                                                id="stay_to"
                                                value={formData.stay_to}
                                                onChange={handleChange}
                                                placeholder="To"
                                                className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex flex-col">
                                            <label htmlFor="landmark" className="mb-1 text-sm font-semibold">Landmark:</label>
                                            <input
                                                type="text"
                                                name="landmark"
                                                id="landmark"
                                                value={formData.landmark}
                                                onChange={handleChange}
                                                placeholder="Landmark"
                                                className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex flex-col">
                                            <label htmlFor="pin_code" className="mb-1 text-sm font-semibold">Pin Code:</label>
                                            <input
                                                type="number"
                                                name="pin_code"
                                                id="pin_code"
                                                value={formData.pin_code}
                                                onChange={handleChange}
                                                placeholder="Pin Code"
                                                className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex flex-col">
                                            <label htmlFor="state" className="mb-1 text-sm font-semibold">State:</label>
                                            <input
                                                type="text"
                                                name="state"
                                                id="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                placeholder="State"
                                                className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                            />
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div className='currentaddress '>
                                <div className='my-4'>Current address </div>
                                <div class="addresses border border-[#3e76a5] p-5 mb-5 rounded-md">
                                    <div class="grid grid-cols-1 gap-4">

                                        <div class="flex flex-col">
                                            <label for="ca_full_address" class="mb-1 text-sm font-semibold">Full Address</label>
                                            <input
                                                type="text"
                                                class="w-full rounded-md mb-5 p-2.5 border bg-[#f7f6fb] border-gray-300"
                                                name="ca_full_address"
                                                id="ca_full_address"
                                                value={formData.ca_full_address}
                                                onChange={handleChange}
                                                placeholder="Full Address"
                                            />
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 gap-4">

                                        <div class="flex flex-col">
                                            <label for="ca_landmark" class="mb-1 text-sm font-semibold">Landmark</label>
                                            <input
                                                type="text"
                                                class="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                                name="ca_landmark"
                                                id="ca_landmark"
                                                value={formData.ca_landmark}
                                                onChange={handleChange}
                                                placeholder="Landmark"
                                            />
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 gap-4">

                                        <div class="flex flex-col">
                                            <label for="ca_residence_mobile_no" class="mb-1 text-sm font-semibold">Residence Mobile No</label>
                                            <input
                                                type="number"
                                                class="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                                name="ca_residence_mobile_no"
                                                id="ca_residence_mobile_no"
                                                value={formData.ca_residence_mobile_no}
                                                onChange={handleChange}
                                                placeholder="Residence Mobile No"
                                            />
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 gap-4">

                                        <div class="flex flex-col">
                                            <label for="ca_state" class="mb-1 text-sm font-semibold">State</label>
                                            <input
                                                type="text"
                                                class="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                                name="ca_state"
                                                id="ca_state"
                                                value={formData.ca_state}
                                                onChange={handleChange}
                                                placeholder="State"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='SelectedServices'>
                            <h1 className='text-center text-2xl'> SELECTED SERVICES </h1>
                            {servicesData && Object.entries(servicesData).map(([key, service]) => (
                                service?.formjson ? (
                                    <div key={service.serviceId} class="servdesc flex flex-col mb-4">
                                        <label for="sta__police_verification_pa" class="mb-1 text-sm font-semibold">{service.serviceTitle}</label>
                                        <select
                                            id="sta__police_verification_pa"
                                            name="sta__police_verification_pa"
                                            class="w-full rounded-md p-2.5 border bg-[#f7f6fb] text-[#a5a3af] border-gray-300"

                                        >
                                            <option disabled selected>{service.sub_serviceName}</option>
                                            <option value="initiated" data-sname="police-verification-pa">INITIATED</option>
                                            <option value="hold" data-sname="police-verification-pa">HOLD</option>
                                        </select>
                                    </div>
                                ) : null
                            ))}
                        </div>
                        {servicesDataInfo && servicesDataInfo.map((serviceData, index) => {
                            if (serviceData.status) {
                                const formJson = JSON.parse(serviceData.reportFormJson.json);
                                return (
                                    <div key={index} className="p-6 bg-white shadow-md rounded-lg mb-6">
                                        <h2 className="text-2xl text-center font-semibold text-gray-800 mb-4">{formJson.heading}</h2>
                                        {formJson.rows.map((row, rowIndex) => (
                                            <div key={rowIndex} className="space-y-4">
                                                <label className="block text-gray-700 font-medium">{row.label}</label>
                                                {row.inputs.map((input, inputIndex) => (
                                                    <div key={inputIndex} className="mb-4">
                                                        {input.type !== "dropdown" ? (
                                                            <input
                                                                type={input.type}
                                                                name={input.name}
                                                                value={formValues[input.name] || ""}
                                                                onChange={handleInputChange}
                                                                placeholder={input.name}
                                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            />
                                                        ) : (
                                                            <select
                                                                name={input.name}
                                                                value={formValues[input.name] || ""}
                                                                onChange={handleInputChange}
                                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            >
                                                                {input.options.map((option, optionIndex) => (
                                                                    <option key={optionIndex} value={option.value}>
                                                                        {option.showText}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                );
                            } else {
                                return (
                                    <p key={index} className="text-red-500 font-semibold">
                                        Error fetching form data for service: {serviceData.message}
                                    </p>
                                );
                            }
                        })}


                        <div className='form2'>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="firstLevelRemarks" className="mb-1 text-sm font-semibold">First Level Insufficiency Remarks:</label>
                                    <input
                                        type="text"
                                        name="firstLevelRemarks"
                                        id="firstLevelRemarks"
                                        value={formData.firstLevelRemarks}
                                        onChange={handleChange}
                                        placeholder="Enter remarks"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="firstInsuffRaisedDate" className="mb-1 text-sm font-semibold">First Insuff Raised Date:</label>
                                    <input
                                        type="date"
                                        name="firstInsuffRaisedDate"
                                        id="firstInsuffRaisedDate"
                                        value={formData.firstInsuffRaisedDate}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="firstInsuffClearedDate" className="mb-1 text-sm font-semibold">First Insuff Cleared Date / Re-Opened date:</label>
                                    <input
                                        type="date"
                                        name="firstInsuffClearedDate"
                                        id="firstInsuffClearedDate"
                                        value={formData.firstInsuffClearedDate}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="secondLevelRemarks" className="mb-1 text-sm font-semibold">Second Level Insufficiency Remarks:</label>
                                    <input
                                        type="text"
                                        name="secondLevelRemarks"
                                        id="secondLevelRemarks"
                                        value={formData.secondLevelRemarks}
                                        onChange={handleChange}
                                        placeholder="Enter remarks"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="secondInsuffRaisedDate" className="mb-1 text-sm font-semibold">Second Insuff Raised Date:</label>
                                    <input
                                        type="date"
                                        name="secondInsuffRaisedDate"
                                        id="secondInsuffRaisedDate"
                                        value={formData.secondInsuffRaisedDate}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="secondInsuffClearedDate" className="mb-1 text-sm font-semibold">Second Insuff Cleared Date / Re-Opened date:</label>
                                    <input
                                        type="date"
                                        name="secondInsuffClearedDate"
                                        id="secondInsuffClearedDate"
                                        value={formData.secondInsuffClearedDate}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="thirdLevelRemarks" className="mb-1 text-sm font-semibold">Third Level Insufficiency Remarks:</label>
                                    <input
                                        type="text"
                                        name="thirdLevelRemarks"
                                        id="thirdLevelRemarks"
                                        value={formData.thirdLevelRemarks}
                                        onChange={handleChange}
                                        placeholder="Enter remarks"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="thirdInsuffRaisedDate" className="mb-1 text-sm font-semibold">Third Insuff Raised Date:</label>
                                    <input
                                        type="date"
                                        name="thirdInsuffRaisedDate"
                                        id="thirdInsuffRaisedDate"
                                        value={formData.thirdInsuffRaisedDate}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="thirdInsuffClearedDate" className="mb-1 text-sm font-semibold">Third Insuff Cleared Date / Re-Opened date:</label>
                                    <input
                                        type="date"
                                        name="thirdInsuffClearedDate"
                                        id="thirdInsuffClearedDate"
                                        value={formData.thirdInsuffClearedDate}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="overallStatus" className="mb-1 text-sm font-semibold">Overall Status*:</label>
                                    <select
                                        name="overallStatus"
                                        id="overallStatus"
                                        value={formData.overallStatus}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"

                                    >
                                        <option value="">Select an option</option>
                                        <option value="RED">RED</option>
                                        <option value="YELLOW">YELLOW</option>
                                        <option value="ORANGE">ORANGE</option>
                                        <option value="GREEN">GREEN</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="reportDate" className="mb-1 text-sm font-semibold">Report Date:</label>
                                    <input
                                        type="date"
                                        name="reportDate"
                                        id="reportDate"
                                        value={formData.reportDate}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="reportStatus" className="mb-1 text-sm font-semibold">Report Status:</label>
                                    <select
                                        name="reportStatus"
                                        id="reportStatus"
                                        value={formData.reportStatus}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="OPEN">OPEN</option>
                                        <option value="CLOSED">CLOSED</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="reportType" className="mb-1 text-sm font-semibold">Report Type:</label>
                                    <select
                                        name="reportType"
                                        id="reportType"
                                        value={formData.reportType}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="INTERVAL REPORT">INTERVAL REPORT</option>
                                        <option value="FINAL REPORT">FINAL REPORT</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="verificationStatus" className="mb-1 text-sm font-semibold">Final Verification Status:</label>
                                    <select
                                        name="verificationStatus"
                                        id="verificationStatus"
                                        value={formData.verificationStatus}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="GREEN">GREEN</option>
                                        <option value="RED">RED</option>
                                        <option value="YELLOW">YELLOW</option>
                                        <option value="ORANGE">ORANGE</option>
                                        <option value="PINK">PINK</option>

                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="verificationInitiated" className="mb-1 text-sm font-semibold">VERIFICATION INITIATED </label>
                                    <input
                                        type="date"
                                        name="verificationInitiated"
                                        id="verificationInitiated"
                                        value={formData.verificationInitiated}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="deadlineDate" className="mb-1 text-sm font-semibold">DeadLine Date </label>
                                    <input
                                        type="date"
                                        name="deadlineDate"
                                        id="deadlineDate"
                                        value={formData.deadlineDate}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="reportGeneratedBy" className="mb-1 text-sm font-semibold">Report Generated By</label>
                                    <select
                                        name="reportGeneratedBy"
                                        id="reportGeneratedBy"
                                        value={formData.reportGeneratedBy}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="Aman">Aman</option>
                                        <option value="Akash">Akash </option>
                                        <option value="Ram">Ram </option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="qcDoneBy" className="mb-1 text-sm font-semibold">Qc Done By</label>
                                    <select
                                        name="qcDoneBy"
                                        id="qcDoneBy"
                                        value={formData.qcDoneBy}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="Aman">Aman</option>
                                        <option value="Akash">Akash </option>
                                        <option value="Ram">Ram </option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="qualityTeamVerification" className="mb-1 text-sm font-semibold">Is verified by quality team?</label>
                                    <select
                                        name="qualityTeamVerification"
                                        id="qualityTeamVerification"
                                        value={formData.qualityTeamVerification}
                                        onChange={handleChange}
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="reasonForDelay" className="mb-1 text-sm font-semibold">Reason For Delay</label>
                                    <textarea
                                        name="reasonForDelay"
                                        id="reasonForDelay"
                                        rows="4"
                                        value={formData.reasonForDelay}
                                        onChange={handleChange}
                                        placeholder="Reason For delay"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="remarks" className="mb-1 text-sm font-semibold">Additional Remarks:</label>
                                    <textarea
                                        name="remarks"
                                        id="remarks"
                                        rows="4"
                                        value={formData.remarks}
                                        onChange={handleChange}
                                        placeholder="Enter any additional remarks here"
                                        className="w-full rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="">
                                    <input
                                        type="checkbox"
                                        name="reportDate"
                                        id="reportDate"
                                        value={formData.reportDate}
                                        onChange={handleChange}
                                        className=" align-middle mr-4 rounded-md p-2.5 border bg-[#f7f6fb] border-gray-300"
                                    />
                                    <label htmlFor="reportDate" className="mb-1 text-sm font-semibold">Not Mandatory Fields</label>

                                </div>
                            </div>
                        </div>
                        <div className="text-right mt-4">
                            <button
                                type="submit"
                                className="bg-[#2c81ba] text-white rounded-md p-2.5"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div >
    );
};

export default GenerateReport;
