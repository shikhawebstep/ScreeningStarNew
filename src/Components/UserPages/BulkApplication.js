import React, { useState } from 'react';
import { FaFolderOpen } from "react-icons/fa";
const BulkApplication = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    fullName: '',
    remarks: '',
    file: null, // For storing the uploaded file
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] }); // Store the uploaded file
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.organizationName) newErrors.organizationName = "Organization name is required.";
    if (!formData.fullName) newErrors.fullName = "SPOC name is required.";
    if (!formData.remarks) newErrors.remarks = "Remarks are required.";
    if (!formData.file) newErrors.file = "Please upload a file.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Implement your form submission logic here
      console.log("Form data submitted:", formData);
    }
  };

  const handleDownload = () => {
    if (formData.file) {
      const url = URL.createObjectURL(formData.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = formData.file.name; // Specify the downloaded file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Please upload a file before downloading.");
    }
  };

  return (
    <div className="bg-[#c1dff2]">
    <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">BULK APPLICATION</h2>
      <div className="bg-white p-12 w-full mx-auto">
        <form className="space-y-4 w-full text-center" onSubmit={handleSubmit}>
          {/* Organization Name */}
          <div className="w-full">
            <label htmlFor="organizationName" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Organisation Name</label>
            <input
              type="text"
              name="organizationName"
              placeholder="Organization Name"
              value={formData.organizationName}
              onChange={handleChange}
              className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.organizationName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.organizationName && <p className="text-red-500 text-sm">{errors.organizationName}</p>}
          </div>

          {/* Full Name */}
          <div className="w-full">
            <label htmlFor="fullName" className="block text-left w-1/2 m-auto mb-2 text-gray-700">SPOC Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="SPOC Name"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>
          <div className="w-full">
            <label htmlFor="file" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Attach Documents (PDF and Images Only)</label>
            <input
              type="file"
              name="file"
              accept=".pdf,image/*" // Accept only PDF and image files
              onChange={handleChange}
              className="w-1/2 m-auto p-3 mb-[20px] border border-gray-300 rounded-md"
            />
            {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
          </div>
          {/* Remarks */}
          <div className="w-full">
            <label htmlFor="remarks" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Remarks</label>
            <input
              type="text"
              name="remarks"
              placeholder="Remarks"
              value={formData.remarks}
              onChange={handleChange}
              className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.remarks ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.remarks && <p className="text-red-500 text-sm">{errors.remarks}</p>}
          </div>

          {/* File Upload */}
         
          <div className='block'>
            <button type="submit" className="bg-[#2c81ba] text-white p-2 px-6 text-2xl rounded-md">Upload</button>
          </div>
        </form>
        <div className='overflow-scroll mt-14' >
        <table className="m-auto w-[1300px] border-collapse border rounded-lg">
  <thead>
    <tr className="bg-[#c1dff2] text-[#4d606b] whitespace-nowrap">
      <th className="border px-4 py-2">Sl No.</th>
      <th className="border px-4 py-2">Organisation Name</th>
      <th className="border px-4 py-2">Spoc Name</th>
      <th className="border px-4 py-2">Date & Time</th>
      <th className="border px-4 py-2">Folder</th>
      <th className="border px-4 py-2">Remarks</th>
      <th className="border px-4 py-2">Edit</th>
      <th className="border px-4 py-2">Address Link</th>
    </tr>
  </thead>
  <tbody>
    <tr className="text-center">
      <td className="border px-4 py-2">1</td>
      <td className="border px-4 py-2">ABC Corporation</td>
      <td className="border px-4 py-2">Jane Smith</td>
      <td className="border px-4 py-2">2024-10-10 10:00 AM</td>
      <td className="border px-4 py-2"><div className='block'>
            <button type="button" className="bg-none text-black p-3 px-2  rounded-md text-2xl whitespace-nowrap" onClick={handleDownload}><FaFolderOpen /></button>
          </div></td>
      <td className="border px-4 py-2">No Remarks</td>
      <td className="border px-4 py-2"><button className="bg-green-500 text-white px-2 py-1 rounded whitespace-normal">Edit</button></td>
      <td className="border px-4 py-2"><a href="#" className="text-blue-500 underline">View Address</a></td>
    </tr>
    {/* Add more rows as needed */}
  </tbody>
</table>

        </div>
      </div>
    </div>
  );
};

export default BulkApplication;
