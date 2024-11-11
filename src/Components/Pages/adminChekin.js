import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const AdminChekin = () => {
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

    console.log(`Fetching data for clientId: ${clientId}, branchId: ${branchId}`);

    // Fetch data from the main API
    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`https://screeningstar.onrender.com/Screeningstar/getdata/${clientId}/${branchId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setData(result.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const extractedVerificationStatuses = Object.values(reportData).map(item => item.parsedFormData.formData.verificationStatus);
console.log('dayaaaa',extractedVerificationStatuses)
    const generatePDF = async (applicationId) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPosition = 10;

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        try {
            const response = await fetch(`https://screeningstar.onrender.com/Screeningstar/generatereport/${applicationId}`, requestOptions);
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const apiData = await response.json();
            const sideMargin = 10;
            const formJsonData = JSON.parse(apiData.data.formjson);
            const formDataArray = formJsonData.formDataArray;
            const formData = formJsonData.formData;

            // Dynamic data for title and report details
            const mainTitle = "BACKGROUND VERIFICATION REPORT";
            const applicantName = formJsonData.fullName || "Applicant";
            const logoImg = "http://localhost:3000/demo/screening/static/media/admin-logo.705fd0ed553f4768abb4.png?w=771&ssl=1";
            const imgWidth = 60;
            const imgHeight = 20;
            doc.addImage(logoImg, 'PNG', 10, 10, imgWidth, imgHeight);
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
            doc.text(formJsonData.organizationName, imgBoxX + 15, 20, { align: 'center' });
            doc.rect(imgBoxX, 23, 30, 23);
            doc.text(applicantName, imgBoxX + 15, 50, { align: 'center' });
            
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
                ["SCREENINGSTAR REF ID", apiData.data.application_id, "DATE OF BIRTH", formData.dateOfBirth || "N/A"],
                ["EMPLOYEE ID", formJsonData.employeeId || "N/A", "INSUFF CLEARED", formData.insuffClearedDate || "N/A"],
                ["VERIFICATION INITIATED", formData.verificationInitiated || "N/A", "FINAL REPORT DATE", formData.reportDate || "N/A"],
                ["VERIFICATION PURPOSE", formData.verificationPurpose || "Employment", "VERIFICATION STATUS", formData.verificationStatus || "N/A"],
                ["REPORT TYPE", formData.reportType || "Employment", "REPORT STATUS", formData.reportStatus || "N/A"]
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
                margin: { left: sideMargin, right: sideMargin , bottom:20 }
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
                body: formDataArray.map(service => [
                    { content: service.serviceName, styles: { minCellHeight: 20, cellPadding: 5 } },
                    { content: service.infoVerifiedBy, styles: { minCellHeight: 20, cellPadding: 5 } },
                    { content: service.verifyDate, styles: { minCellHeight: 20, cellPadding: 5 } },
                    { content: service.verificationStatus, styles: { minCellHeight: 20, cellPadding: 5 } }
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
                        { content: 'MAJOR DISCREPANCY', styles: { halign: 'center', cellWidth: 'wrap' ,minCellWidth: 10 }},
                        { content: 'MINOR DISCREPANCY', styles: { halign: 'center', cellWidth: 'wrap' ,minCellWidth: 10 }},
                        { content: 'UNABLE TO VERIFY', styles: { halign: 'center', cellWidth: 'wrap',minCellWidth: 10  }},
                        { content: 'PENDING FROM SOURCE', styles: { halign: 'center', cellWidth: 'nowrap',minCellWidth: 10  }},
                        { content: 'ALL CLEAR', styles: { halign: 'center', cellWidth: 'wrap',minCellWidth: 10  }}
                    ]
                ],
                body: [
                    [
                        { content: '', styles: { fillColor: [255, 0, 0], minCellHeight: 20, cellPadding: 3 },cellWidth: 10 }, 
                        { content: '', styles: { fillColor: [255, 255, 0], minCellHeight: 20 , cellPadding: 3 } }, // Yellow
                        { content: '', styles: { fillColor: [255, 165, 0], minCellHeight: 20 , cellPadding: 3 } }, // Orange
                        { content: '', styles: { fillColor: [255, 192, 203], minCellHeight: 20 , cellPadding: 3 } }, // Pink
                        { content: '', styles: { fillColor: [0, 128, 0], minCellHeight: 20 , cellPadding: 3 } } // Green
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




            yPosition = doc.autoTable.previous.finalY + 10;
              

            formDataArray.forEach((service) => {
                let pageWidth = 210;
                let rectWidth = 180;
                let xPosition = (pageWidth - rectWidth) / 2;
            
                doc.setFillColor(246, 246, 246); // Light gray background color
                doc.setDrawColor(0, 0, 0); // Black border color
                doc.rect(xPosition, yPosition, rectWidth, 10, 'FD');
                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.text(service.serviceHeading.toUpperCase(), 85, yPosition + 7); // Adjust yPosition for vertical alignment
                yPosition += 20; // Move position down for the next section
            
                // Prepare service data where the part before ':' is the 'Particulars' and the part after ':' is 'Verified'
                const serviceData = Object.entries(service.inputs).map(([key, value]) => {
                    const parts = key.split(':');  // Split key by ":"
                    const fieldName = parts[0];    // Before ":"
                    const verifiedValue = parts.length > 1 ? value : ''; // After ":"
                    return { fieldName, verifiedValue };
                });
            
                // Group by fieldName and collect all corresponding values for 'Verified' column
                let uniqueData = {};
                formDataArray.forEach((service) => {
                    let pageWidth = 210;
                    let rectWidth = 180;
                    let xPosition = (pageWidth - rectWidth) / 2;
                
                    doc.setFillColor(246, 246, 246); // Light gray background color
                    doc.setDrawColor(0, 0, 0); // Black border color
                    doc.rect(xPosition, yPosition, rectWidth, 10, 'FD');
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(11);
                    doc.text(service.serviceHeading.toUpperCase(), 85, yPosition + 7);
                    yPosition += 20; 
                
                    // Prepare service data where the part before ':' is the 'Particulars' and the part after ':' is 'Verified'
                    const serviceData = Object.entries(service.inputs).map(([key, value]) => {
                        const parts = key.split(':');  // Split key by ":"
                        const fieldName = parts[0];    // Before ":"
                        const verifiedValue = parts.length > 1 ? value : ''; // After ":"
                        return { fieldName, verifiedValue };
                    });
                
                    // Group by fieldName and collect all corresponding values for 'Verified' column
                    let uniqueData = {};
                    serviceData.forEach(({ fieldName, verifiedValue }) => {
                        if (!uniqueData[fieldName]) {
                            uniqueData[fieldName] = { particulars: fieldName, verifiedValues: [] };
                        }
                        if (verifiedValue) {
                            uniqueData[fieldName].verifiedValues.push(verifiedValue);  // Store all verified values
                        }
                    });
                
                    // Prepare the data for the table with "Particulars", "Applicant Details", and "Verified"
                    const tableData = Object.entries(uniqueData).map(([fieldName, { particulars, verifiedValues }]) => {
                        const firstVerifiedValue = verifiedValues.length > 0 ? verifiedValues[0] : 'N/A'; // First value for Applicant Details
                        const remainingVerifiedValues = verifiedValues.slice(1).join(', ') || 'N/A'; // Remaining values for Verified column
                        return [
                            particulars,  // Display field name in "Particulars" column
                            firstVerifiedValue, // First value for "Applicant Details"
                            remainingVerifiedValues // Remaining values for "Verified"
                        ];
                    });
                
                    // Generate the table with the required data
                    doc.autoTable({
                        head: [
                            [{ content: service.serviceName.toUpperCase(), colSpan: 3, styles: { halign: 'center', fontStyle: 'bold', fillColor: [217, 217, 217] } }],
                            ["Particulars", "Applicant Details", "Verified"]
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
                            0: { fontStyle: "bold" }
                        },
                        theme: 'grid',
                        headStyles: {
                            fillColor: [217, 217, 217],
                            textColor: [0, 0, 0],
                            fontStyle: 'bold'
                        }
                    });
                
                    // Update the yPosition for the next section or page
                    yPosition = doc.autoTable.previous.finalY + 10;
                
                    // Check if new page is required, if yes, add a new page and reset yPosition
                    if (yPosition + 20 > doc.internal.pageSize.getHeight()) {
                        doc.addPage();
                        yPosition = 10;
                    }
                });
                
            
                // Prepare the data for the table with "Particulars", "Applicant Details", and "Verified"
                const tableData = Object.entries(uniqueData).map(([fieldName, { particulars, verifiedValues }]) => [
                    particulars,
                    'Applicant Details',
                    verifiedValues.length > 0 ? verifiedValues.join(', ') : 'N/A' // If no verified values, show 'N/A'
                ]);
            
                // Generate the table with the required data
                doc.autoTable({
                    head: [
                        [{ content: service.serviceName.toUpperCase(), colSpan: 3, styles: { halign: 'center', fontStyle: 'bold', fillColor: [217, 217, 217] } }],
                        ["Particulars", "Applicant Details", "Verified"]
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
                        0: { fontStyle: "bold" }
                    },
                    theme: 'grid',
                    headStyles: {
                        fillColor: [217, 217, 217],
                        textColor: [0, 0, 0],
                        fontStyle: 'bold'
                    }
                });
            
                // Update the yPosition for the next section or page
                yPosition = doc.autoTable.previous.finalY + 10;
            
                // Check if new page is required, if yes, add a new page and reset yPosition
                if (yPosition + 20 > doc.internal.pageSize.getHeight()) {
                    doc.addPage();
                    yPosition = 10;
                }
            });
            
            
            

            doc.save('SSCD.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
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

    const handleUpload = (applicationId) => {
        navigate(`/admin-generate-report?applicationId=${applicationId}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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
                                <th className="border px-4 py-2">NAME OF THE APPLICANT</th>
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
                            {data.map((item, index) => {
                                const report = reportData[item.application_id] || {};
                                const parsedData = report.parsedFormData || { formDataArray: [] };
                                const formDataArray = parsedData.formDataArray || [];
                                const fromDataa = parsedData.formData || {}; // Ensure fromDataa is defined
                                return (
                                    <tr key={item.id} className="text-center">
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{item.clientData.tat}</td>
                                        <td className="border px-4 py-2">{item.application_id}</td>
                                        <td className="border px-4 py-2">{item.location}</td>
                                        <td className="border px-4 py-2">{item.fullName}</td>
                                        <td className="border px-4 py-2">{item.employeeId}</td>
                                        <td className="border px-4 py-2">
                                            <img src={item.photo} alt={item.fullName} className="w-10 h-10 rounded-full" />
                                        </td>
                                        <td className="border px-4 py-2">{item.clientData.clientSpoc}</td>
                                        <td className="border px-4 py-2">{item.employeeId}</td>
                                        <td className="border px-4 py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">{new Date(item.updatedAt).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                className="bg-white border border-[#073d88] text-[#073d88] px-4 py-2 rounded hover:bg-[#073d88] hover:text-white"
                                                onClick={() => handleUpload(item.application_id)}
                                            >
                                                Generate Report
                                            </button>
                                        </td>

                                        {/* Displaying `additional_fee` for the first item in formDataArray or fallback to 'N/A' */}
                                        <td className="border px-4 py-2">


                                            <button
                                                onClick={() => generatePDF(item.application_id)}
                                                className="bg-white border border-green-500 text-green-500 px-4 py-2 rounded hover:bg-green-500 hover:text-white"
                                            >
                                                Generate PDF
                                            </button>

                                        </td>
                                        <td className="border px-4 py-2">{fromDataa.overallStatus || 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.reportType || 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.reportDate ? new Date(fromDataa.reportDate).toLocaleDateString() : 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.firstLevelRemarks || 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.firstInsuffRaisedDate ? new Date(fromDataa.firstInsuffRaisedDate).toLocaleDateString() : 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.firstInsuffClearedDate || 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.secondLevelRemarks || 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.remarks || 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.secondInsuffRaisedDate ? new Date(fromDataa.secondInsuffRaisedDate).toLocaleDateString() : 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.secondInsuffClearedDate || 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.thirdLevelRemarks || 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.thirdLevelRemarks || 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.thirdInsuffRaisedDate ? new Date(fromDataa.thirdInsuffRaisedDate).toLocaleDateString() : 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.thirdInsuffClearedDate || 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.reasonForDelay || 'N/A'}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() => handleUpload(item.application_id)}
                                                className="bg-white border border-[#073d88] text-[#073d88] px-4 py-2 rounded hover:bg-[#073d88] hover:text-white"
                                            >
                                                Upload
                                            </button>
                                        </td>
                                        <td className="border px-4 py-2">{fromDataa.reportGeneratedBy || 'N/A'}</td>
                                        <td className="border px-4 py-2">{fromDataa.qcDoneBy || 'N/A'}</td>
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
