import React from 'react'

const PrepareReport = () => {
    return (
        <div className="w-full bg-[#c1dff2] border overflow-hidden">
<h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">PREPARE REPORT</h2>
            <div className="bg-white p-12 w-full mx-auto">
                <form className="space-y-4">
                    <div>
                        <label htmlFor="reportDate" className="block mb-1 font-bold">
                            Report Date
                        </label>
                        <input
                            type="date"
                            name="reportDate"
                            id="reportDate"
                            className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="referenceId" className="block mb-1 font-bold">
                            Reference ID
                        </label>
                        <input
                            type="text"
                            name="referenceId"
                            id="referenceId"
                            placeholder="Reference ID"
                            className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="applicantName" className="block mb-1 font-bold">
                            Name of the Applicant
                        </label>
                        <input
                            type="text"
                            name="applicantName"
                            id="applicantName"
                            placeholder="Name of the Applicant"
                            className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="reportAnalystName" className="block mb-1 font-bold">
                            Report Analyst Name
                        </label>
                        <input
                            type="text"
                            name="reportAnalystName"
                            id="reportAnalystName"
                            placeholder="Report Analyst Name"
                            className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="qcAnalystName" className="block mb-1 font-bold">
                            QC Analyst Name
                        </label>
                        <input
                            type="text"
                            name="qcAnalystName"
                            id="qcAnalystName"
                            placeholder="QC Analyst Name"
                            className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="overallStatus" className="block mb-1 font-bold">
                            Overall Status
                        </label>
                        <select
                            name="overallStatus"
                            id="overallStatus"
                            className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                        >
                            <option value="">Select Overall Status</option>
                            <option value="pass">PASS</option>
                            <option value="fail">FAIL</option>
                            <option value="pending">PENDING</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="qcStatus" className="block mb-1 font-bold">
                            QC Status
                        </label>
                        <select
                            name="qcStatus"
                            id="qcStatus"
                            className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                        >
                            <option value="">Select QC Status</option>
                            <option value="approved">APPROVED</option>
                            <option value="rejected">REJECTED</option>
                            <option value="in review">IN REVIEW</option>
                        </select>
                    </div>

                    <div className='text-left'>
                        <button type="submit" className="p-6 py-3 bg-[#2c81ba] text-white font-bold rounded-md hover:bg-blue-600">
                            Submit
                        </button>
                    </div>
                </form>


            </div>
        </div>
    )
}

export default PrepareReport;
