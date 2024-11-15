import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AdminChekin = () => {
    const [servicesDataInfo, setServicesDataInfo] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState([]);
    const [reportData, setReportData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get clientId and branchId from query parameters
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('clientId');
    const branchId = queryParams.get('branchId');
    const adminId = JSON.parse(localStorage.getItem("admin"))?.id;
    const token = localStorage.getItem('_token');

    // Fetch data from the main API
    const fetchData = useCallback(() => {
        if (!branchId || !adminId || !token) {
            return;
        }
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(`https://screeningstar-new.onrender.com/client-master-tracker/applications-by-branch?branch_id=${branchId}&admin_id=${adminId}&_token=${token}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                // Check if customers data exists, otherwise set to empty array
                setData(result.customers || []);

            })
            .catch((error) => console.error(error));
    }, [branchId, adminId, token, setData]);


    const fetchServicesJson = async (applicationId, servicesList) => {
        const adminId = JSON.parse(localStorage.getItem("admin"))?.id;
        const token = localStorage.getItem('_token');

        if (!servicesList || servicesList.length === 0) {
            return []; // Return an empty array if the list is empty or undefined
        }

        // Convert servicesList to an array of service IDs
        const serviceIds = servicesList.split(",");

        const fetchService = async (serviceId) => {
            try {
                const requestOptions = {
                    method: "GET",
                    redirect: "follow",
                };

                const response1 = await fetch(
                    `https://screeningstar-new.onrender.com/client-master-tracker/report-form-json-by-service-id?service_id=${serviceId}&admin_id=${adminId}&_token=${token}`,
                    requestOptions
                );

                if (response1.ok) {
                    const serviceData = await response1.json();
                    const newToken = response1.token || response1._token || '';
                    if (newToken) {
                        localStorage.setItem("_token", newToken);
                    }

                    // Fetch the application service if the first request is successful
                    const applicationRequestOptions = {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        redirect: "follow",
                    };

                    const response2 = await fetch(
                        `https://screeningstar-new.onrender.com/client-master-tracker/application-service?service_id=${serviceId}&application_id=${applicationId}&admin_id=${adminId}&_token=${token}`,
                        applicationRequestOptions
                    );

                    if (response2.ok) {
                        const newToken = response2.token || response2._token || '';
                        if (newToken) {
                            localStorage.setItem("_token", newToken);
                        }
                        const result2 = await response2.json();
                        serviceData.annexureData = result2.annexureData;
                    } else {
                        serviceData.annexureData = [];
                    }

                    return serviceData; // Return the service data with annexureData
                }
                return null;
            } catch (error) {
                console.error(`Error fetching service ${serviceId}:`, error);
                return null;
            }
        };

        try {
            // Use Promise.all to fetch all services concurrently
            const results = await Promise.all(serviceIds.map(fetchService));

            const filteredResults = results.filter((item) => item != null);
            const newToken = filteredResults.find((result) => result?.token || result?._token);
            if (newToken) {
                localStorage.setItem("_token", newToken.token || newToken._token);
            }

            // Return the filtered results to be used in the calling function
            return filteredResults;
        } catch (error) {
            console.error('Error fetching services:', error);
            return [];
        }
    };

    const getServicesData = async (applicationId, servicesList) => {
        try {
            const servicesData = await fetchServicesJson(applicationId, servicesList);
            return servicesData;
        } catch (error) {
            console.error('Error in getServicesData:', error);
            return [];
        }
    };
    const generatePDF = async (index) => {
        const applicationInfo = data[index];
        const servicesData = await getServicesData(applicationInfo.main_id, applicationInfo.services);
        console.log('servicesData - ', servicesData);

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPosition = 10;

        const sideMargin = 10;

        // const formData = data.formData;

        // Dynamic data for title and report details
        const mainTitle = "BACKGROUND VERIFICATION REPORT";
        const applicantPhoto = applicationInfo.photo
            ? `https://screeningstar-new.onrender.com/${applicationInfo.photo}`
            : 'http://localhost:3000/demo/screening/static/media/admin-logo.705fd0ed553f4768abb4.png?w=771&ssl=1';

        const checkImageExistence = async (imageUrl) => {
            try {
                const response = await fetch(imageUrl, { method: 'HEAD' });
                if (response.ok) {
                    return imageUrl;
                } else {
                    return 'http://localhost:3000/demo/screening/static/media/admin-logo.705fd0ed553f4768abb4.png?w=771&ssl=1';
                }
            } catch (error) {
                // If there is an error (e.g., network issue), use the local fallback image
                return 'http://localhost:3000/demo/screening/static/media/admin-logo.705fd0ed553f4768abb4.png?w=771&ssl=1';
            }
        };

        // Usage
        const imageUrlToUse = await checkImageExistence(applicantPhoto);


        const imgWidth = 60;
        const imgHeight = 20;
        doc.addImage(imageUrlToUse, 'PNG', 10, 10, imgWidth, imgHeight);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Screeningstar Solutions Pvt Ltd", 10, 35);
        doc.setFont("helvetica", "normal");
        doc.text("No 93/9, Varthur Main Road", 10, 40);
        doc.text("Marathahalli, Bangalore, Karnataka,", 10, 45);
        doc.text("India, Pin Code - 560037", 10, 50);

        const imgBoxX = pageWidth - 40;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(applicationInfo.name || '', imgBoxX + 15, 20, { align: 'center' });
        doc.rect(imgBoxX, 23, 30, 23);
        doc.text(applicationInfo.name || '', imgBoxX + 15, 50, { align: 'center' });

        doc.setLineWidth(1);
        doc.line(10, 55, pageWidth - 10, 55);

        const titleWidth = pageWidth - 2 * sideMargin; // Adjust width for equal margins
        doc.setFillColor(246, 246, 246);
        doc.rect(sideMargin, 60, titleWidth, 8, 'F'); // Centered background rectangle with equal side gaps
        doc.setDrawColor(62, 118, 165);
        doc.setLineWidth(0.3);
        doc.rect(sideMargin, 60, titleWidth, 8); // Centered border rectangle with equal side gaps
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(mainTitle, pageWidth / 2, 66, { align: 'center' });

        const headerTableData = [
            ["SCREENINGSTAR REF ID", applicationInfo.application_id, "DATE OF BIRTH", applicationInfo.dob || "N/A"],
            ["EMPLOYEE ID", applicationInfo.employee_id || "N/A", "INSUFF CLEARED", applicationInfo.insuff_cleared_date || "N/A"],
            ["VERIFICATION INITIATED", applicationInfo.verification_initiated || "N/A", "FINAL REPORT DATE", applicationInfo.report_date || "N/A"],
            ["VERIFICATION PURPOSE", applicationInfo.verification_purpose || "Employment", "VERIFICATION STATUS", applicationInfo.final_verification_status || "N/A"],
            ["REPORT TYPE", applicationInfo.report_type || "Employment", "REPORT STATUS", applicationInfo.report_status || "N/A"]
        ];

        doc.autoTable({
            body: headerTableData,
            startY: 75,
            styles: {
                fontSize: 10,
                cellPadding: 2,
                textColor: [0, 0, 0],
            },
            columnStyles: {
                0: { fontStyle: "bold", },
                2: { fontStyle: "bold", },
            },
            theme: 'grid',
            headStyles: {
                fillColor: [62, 118, 165],
                textColor: [0, 0, 0],
                fontStyle: 'bold'
            },
            tableLineColor: [62, 118, 165],
            tableLineWidth: 0.5,
            margin: { left: sideMargin, right: sideMargin, bottom: 20 }
        });

        const SummaryTitle = "SUMMARY OF THE VERIFICATION CONDUCTED";
        const padding = 3;
        const backgroundColor = '#f5f5f5';
        const borderColor = '#3d75a6';
        const xsPosition = 10;
        const ysPosition = 120;
        const fullWidth = pageWidth - 20;
        const rectHeight = 10;

        doc.setFillColor(backgroundColor);
        doc.setDrawColor(borderColor);
        doc.rect(xsPosition, ysPosition, fullWidth, rectHeight, 'FD');
        doc.text(SummaryTitle, pageWidth / 2, ysPosition + 7, { align: 'center' });

        const marginTop = 5;
        const nextContentYPosition = ysPosition + rectHeight + marginTop;

        doc.autoTable({
            head: [
                [
                    { content: 'SCOPE OF SERVICES / COMPONENT', styles: { halign: 'center', cellWidth: 'wrap', minCellWidth: 10 } },
                    { content: 'INFORMATION VERIFIED BY', styles: { halign: 'center', cellWidth: 'wrap', minCellWidth: 10 } },
                    { content: 'VERIFIED DATE', styles: { halign: 'center', cellWidth: 'wrap', minCellWidth: 10 } },
                    { content: 'VERIFICATION STATUS', styles: { halign: 'center', cellWidth: 'wrap', minCellWidth: 10 } },
                ]
            ],
            body: servicesData.map(service => [
                {
                    content: JSON.parse(service.reportFormJson.json).heading, // Adjust as needed based on the JSON structure
                    styles: { minCellHeight: 20, cellPadding: 5 }
                },
                {
                    content: service.annexureData[Object.keys(service.annexureData).find(key => key.endsWith('info_source'))] || "N/A",
                    styles: { minCellHeight: 20, cellPadding: 5 }
                },
                {
                    content: service.annexureData.created_at
                        ? new Date(service.annexureData.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })
                        : "N/A", // Format date as "12 Jan 2024" or "N/A" if missing
                    styles: { minCellHeight: 20, cellPadding: 5 }
                },
                {
                    content: service.annexureData.status || "Not Verified", // Default to "Not Verified" if status is empty
                    styles: { minCellHeight: 20, cellPadding: 5 }
                }
            ]),
            startY: nextContentYPosition,
            styles: {
                fontSize: 8,
                cellPadding: 3,
                halign: 'center',
                valign: 'middle',
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
            },
            theme: 'grid',
            headStyles: {
                fillColor: [246, 246, 246],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.5,
            margin: { left: 10, right: 10 },
            tableWidth: 'auto',
            columnStyles: {
                0: { cellWidth: 47.5 },
                1: { cellWidth: 47.5 },
                2: { cellWidth: 47.5 },
                3: { cellWidth: 47.5 },
            },
        });


        doc.autoTable({
            head: [
                [
                    { content: "COLOR CODE / ADJUDICATION MATRIX", colSpan: 5, styles: { halign: 'center', fontStyle: 'bold', fillColor: [246, 246, 246] } }
                ],
                [
                    { content: 'MAJOR DISCREPANCY', styles: { halign: 'center', cellWidth: 'wrap', minCellWidth: 10 } },
                    { content: 'MINOR DISCREPANCY', styles: { halign: 'center', cellWidth: 'wrap', minCellWidth: 10 } },
                    { content: 'UNABLE TO VERIFY', styles: { halign: 'center', cellWidth: 'wrap', minCellWidth: 10 } },
                    { content: 'PENDING FROM SOURCE', styles: { halign: 'center', cellWidth: 'nowrap', minCellWidth: 10 } },
                    { content: 'ALL CLEAR', styles: { halign: 'center', cellWidth: 'wrap', minCellWidth: 10 } }
                ]
            ],
            body: [
                [
                    { content: '', styles: { fillColor: [255, 0, 0], minCellHeight: 20, cellPadding: 3 }, cellWidth: 10 },
                    { content: '', styles: { fillColor: [255, 255, 0], minCellHeight: 20, cellPadding: 3 } }, // Yellow
                    { content: '', styles: { fillColor: [255, 165, 0], minCellHeight: 20, cellPadding: 3 } }, // Orange
                    { content: '', styles: { fillColor: [255, 192, 203], minCellHeight: 20, cellPadding: 3 } }, // Pink
                    { content: '', styles: { fillColor: [0, 128, 0], minCellHeight: 20, cellPadding: 3 } } // Green
                ]
            ],
            startY: doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 10,
            styles: {
                fontSize: 8,
                cellPadding: 2,
                halign: 'center',
                valign: 'middle',
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
            },
            theme: 'grid',
            headStyles: {
                fillColor: [246, 246, 246],
                textColor: [0, 0, 0],
                fontStyle: 'bold'
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.5,
            margin: { left: 10, right: 10 },
            tableWidth: 'auto',
            columnStyles: {
                0: { cellWidth: 38, cellMargin: 5 }, // Adjust cell width and Margin as needed
                1: { cellWidth: 38, cellMargin: 5 },
                2: { cellWidth: 38, cellMargin: 5 },
                3: { cellWidth: 38, cellMargin: 5 },
                4: { cellWidth: 38, cellMargin: 5 }
            },
        });
        yPosition = doc.autoTable.previous?.finalY ? doc.autoTable.previous.finalY + 20 : 20; // Initial yPosition with spacing


        // Function to detect image extension (moved outside for reusability)
        const getImageFormat = (url) => {
            const ext = url.split('.').pop().toLowerCase();
            if (ext === 'png') return 'PNG';
            if (ext === 'jpg' || ext === 'jpeg') return 'JPEG';
            if (ext === 'webp') return 'WEBP';
            return 'PNG'; // Default to PNG if not recognized
        };

        // Helper function to handle image loading
        // Helper function to handle image loading
        function loadImage(imageUrl) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Error loading image: ' + imageUrl));
                img.src = imageUrl;
            });
        }

            for (const service of servicesData) {
                const reportFormJson = JSON.parse(service.reportFormJson.json);
                const rows = reportFormJson.rows;
                const dbTableHeading = reportFormJson.heading;

                // Add main heading for the service
                doc.setFont("helvetica", "bold");
                doc.setFontSize(14);
                doc.text(dbTableHeading.toUpperCase(), doc.internal.pageSize.width / 2, yPosition, { align: 'center' });
                yPosition += 20; // Slightly larger gap after the heading to avoid overlapping

                // Prepare service data
                const serviceData = [];
                rows.forEach((row) => {
                    row.inputs.forEach((input) => {
                        const inputName = input.name;
                        const value = service.annexureData[inputName] || '';
                        serviceData.push({ label: inputName, value, verified: value }); // Add verified data as same value for now
                    });
                });

                // Prepare the table data to match the format
                const tableData = serviceData.map((data) => [
                    data.label,       // "Particulars" column
                    data.value,       // "Applicant Details" column
                    data.verified     // "Verified Details" column
                ]);

                // Generate the table with adjusted styles
                doc.autoTable({
                    head: [
                        ["PARTICULARS", "APPLICANT DETAILS", "VERIFIED DETAILS"]
                    ],
                    body: tableData,
                    startY: yPosition,
                    styles: {
                        fontSize: 9,
                        cellPadding: 3,
                        lineWidth: 0.5,
                        lineColor: [0, 0, 0]
                    },
                    columnStyles: {
                        0: { fontStyle: "bold", cellWidth: 'auto' },   // Adjust "Particulars" width to auto
                        1: { cellWidth: 'auto' },                      // Adjust "Applicant Details" width
                        2: { cellWidth: 'auto' }                       // Adjust "Verified Details" width
                    },
                    theme: 'grid',
                    headStyles: {
                        fillColor: [255, 255, 255],                  // White background for header
                        textColor: [0, 0, 0],
                        fontStyle: 'bold',
                        halign: 'center',
                        fontSize: 10
                    },
                    bodyStyles: {
                        textColor: [0, 0, 0],
                        halign: 'left'
                    },
                    tableLineColor: [0, 0, 0],
                    tableLineWidth: 0.5,
                    margin: { horizontal: 10 }  // Margin for left and right sides
                });

                // Update yPosition after the table is added
                yPosition = doc.lastAutoTable.finalY + 20;

                // Image handling logic (images after the table)
                const annexureImagesKey = Object.keys(service.annexureData).find(key =>
                    key.toLowerCase().startsWith('annexure') &&
                    !key.includes('[') &&
                    !key.includes(']')
                );

                if (annexureImagesKey) {
                    const annexureImagesStr = service.annexureData[annexureImagesKey];
                    const annexureImagesSplitArr = annexureImagesStr ? annexureImagesStr.split(',') : [];

                    console.log('annexureImagesKey:', annexureImagesKey);

                    // Add images immediately after each service's table
                    for (const imageUrl of annexureImagesSplitArr) {
                        const imageUrlFull = `https://screeningstar-new.onrender.com/${imageUrl.trim()}`;
                        console.log('Image URL:', imageUrlFull); // For debugging

                        const imageFormat = getImageFormat(imageUrlFull);

                        // Wait for the image to load and add it to the PDF
                        await loadImage(imageUrlFull).then((img) => {
                            doc.addImage(imageUrlFull, imageFormat, 10, yPosition, doc.internal.pageSize.width - 20, 80);
                            yPosition += 85; // Adjust spacing after each image
                        }).catch((error) => {
                            console.error("Error loading image:", error);
                        });
                    }
                } else {
                    console.error("No valid 'annexure' key found in annexureData.");
                }

                // Increase spacing after the images and table
                yPosition += 20;
            }

          

        // Save the PDF document
        doc.save("services_report.pdf");


    };



    const fetchReportData = async (applicationId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`https://screeningstar.onrender.com/Screeningstar/generatereport/${applicationId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch report data');
            }

            const result = await response.json();
            const formData = JSON.parse(result.data.formjson); // Parsing formjson
            setReportData(prevState => ({
                ...prevState,
                [applicationId]: {
                    ...result.data,
                    parsedFormData: formData, // Save parsed data for rendering
                },
            }));
        } catch (error) {
            console.error(`Error fetching report data for application ${applicationId}: ${error}`);
        }
    };
    useEffect(() => {
        fetchData();
    }, [clientId, branchId]);

    // Fetch report data for each application after main data is loaded
    useEffect(() => {
        if (data.length > 0) {
            data.forEach(item => {
                fetchReportData(item.application_id);
            });
        }
    }, [data]);

    // Refresh the table data by fetching from the generatereport API after generating a report
    const handleGenerateReport = async (applicationId) => {
        await fetchReportData(applicationId); // Fetch the latest report data
        fetchData(); // Refresh the table data
    };

    const handleUpload = (applicationId, branchid) => {
        navigate(`/admin-generate-report?applicationId=${applicationId}&branchid=${branchid}`);
    };



    return (
        <div className="bg-[#c1dff2]">
            <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">ADMIN CHEKIN</h2>
            <div className="space-y-4 py-[30px] px-[51px] bg-white">
                <div className="rounded-lg overflow-scroll">
                    <table className="min-w-full border-collapse border overflow-scroll rounded-lg whitespace-nowrap">
                        <thead className='rounded-lg'>
                            <tr className="bg-[#c1dff2] text-[#4d606b]">
                                <th className="border px-4 py-2">SL NO</th>
                                <th className="border px-4 py-2">TAT Days</th>
                                <th className="border px-4 py-2">Application Id</th>
                                <th className="border px-4 py-2">Location</th>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Reference ID</th>
                                <th className="border px-4 py-2">Photo</th>
                                <th className="border px-4 py-2">APPLICANT EMPLOYEE ID</th>
                                <th className="border px-4 py-2">Initiation Date</th>
                                <th className="border px-4 py-2">Deadline Date</th>
                                <th className="border px-4 py-2">REPORT DATA</th>
                                <th className="border px-4 py-2">Insuff Documents</th>
                                <th className="border px-4 py-2">Overall Status</th>
                                <th className="border px-4 py-2">Report Type</th>
                                <th className="border px-4 py-2">Report Date</th>
                                <th className="border px-4 py-2">First Level Insuff Remarks</th>
                                <th className="border px-4 py-2">First Insuff Date</th>
                                <th className="border px-4 py-2">First Insuff Cleared</th>
                                <th className="border px-4 py-2">Second Level Insuff</th>
                                <th className="border px-4 py-2">Remarks</th>
                                <th className="border px-4 py-2">Second Insuff Date</th>
                                <th className="border px-4 py-2">Second Insuff Cleared</th>
                                <th className="border px-4 py-2">Third Level Insuff</th>
                                <th className="border px-4 py-2">Remarks</th>
                                <th className="border px-4 py-2">Third Insuff Date</th>
                                <th className="border px-4 py-2">Third Insuff Cleared</th>
                                <th className="border px-4 py-2">Remarks & Reason for Delay</th>
                                <th className="border px-4 py-2">Case-Upload</th>
                                <th className="border px-4 py-2">Report Generated By</th>
                                <th className="border px-4 py-2">QC Done By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((data, index) => {

                                return (
                                    <tr key={data.id} className="text-center">
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{data.tat_days || 'NIL'}</td>
                                        <td className="border px-4 py-2">{data.application_id || 'NIL'}</td>
                                        <td className="border px-4 py-2">{data.location || 'NIL'}</td>
                                        <td className="border px-4 py-2">{data.name || 'NIL'}</td>
                                        <td className="border px-4 py-2">{data.employee_id || 'NIL'}</td>
                                        <td className="border px-4 py-2">
                                            <img src={`https://screeningstar-new.onrender.com${data.photo}`} alt={data.name} className="w-10 h-10 rounded-full" />
                                        </td>
                                        <td className="border px-4 py-2">{data.client_spoc_name || 'NIL'}</td>
                                        <td className="border px-4 py-2">{new Date(data.created_at).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">{new Date(data.updated_at).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                className="bg-white border border-[#073d88] text-[#073d88] px-4 py-2 rounded hover:bg-[#073d88] hover:text-white"
                                                onClick={() => handleUpload(data.id, data.branch_id)}
                                            >
                                                Generate Report
                                            </button>
                                        </td>

                                        {/* Displaying `additional_fee` for the first item in data or fallback to 'N/A' */}
                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() => generatePDF(index)}
                                                className="bg-white border border-green-500 text-green-500 px-4 py-2 rounded hover:bg-green-500 hover:text-white"
                                            >
                                                Generate PDF
                                            </button>
                                        </td>

                                        {/* Accessing properties from cmtData */}
                                        <td className="border px-4 py-2">{data.overall_status || 'N/A'}</td>
                                        <td className="border px-4 py-2">{data.report_type || 'N/A'}</td>
                                        <td className="border px-4 py-2">{data.report_date ? new Date(data.report_date).toLocaleDateString() : 'N/A'}</td>
                                        <td className="border px-4 py-2">{data.first_insufficiency_marks || 'N/A'}</td>
                                        <td className="border px-4 py-2">{data.first_insuff_date ? new Date(data.first_insuff_date).toLocaleDateString() : 'N/A'}</td>
                                        <td className="border px-4 py-2">{data.first_insuff_reopened_date || 'N/A'}</td>
                                        <td className="border px-4 py-2">{data.second_insufficiency_marks || 'N/A'}</td>
                                        <td className="border px-4 py-2">{data.second_insuff_date ? new Date(data.second_insuff_date).toLocaleDateString() : 'N/A'}</td>
                                        <td className="border px-4 py-2">{data.second_insuff_reopened_date || 'N/A'}</td>
                                        <td className="border px-4 py-2">{data.third_insufficiency_marks || 'N/A'}</td>
                                        <td className="border px-4 py-2">{data.third_insuff_date ? new Date(data.third_insuff_date).toLocaleDateString() : 'N/A'}</td>
                                        <td className="border px-4 py-2">{data.third_insuff_reopened_date || 'N/A'}</td>
                                        <td className="border px-4 py-2">{data.delay_reason || 'N/A'}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() => handleUpload(data.application_id)}
                                                className="bg-white border border-[#073d88] text-[#073d88] px-4 py-2 rounded hover:bg-[#073d88] hover:text-white"
                                            >
                                                Upload
                                            </button>
                                        </td>
                                        <td className="border px-4 py-2">{data.report_generate_by || 'N/A'}</td>
                                        <td className="border px-4 py-2">{data.qc_done_by || 'N/A'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>



                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminChekin;
