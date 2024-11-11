import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx'; // Ensure you have xlsx installed
import axios from 'axios';
const storedToken = localStorage.getItem('token');




const CandidateManager = () => {
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const fetchServices = async () => {
    try {
      const response = await fetch("https://screeningstar.onrender.com/Screeningstar/service", {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Ensure data is an array before setting the state
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        console.warn("Expected an array but received:", data);
        setServices([]); // Set to an empty array if the data is not an array
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]); // Optionally, set services to an empty array on error
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get('https://screeningstar.onrender.com/Screeningstar/package', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        },
      });
      setPackages(response.data); // Assuming response.data contains your packages
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchServices();
  }, []);



  const [formData, setFormData] = useState({
    organizationName: '',
    fullName: '',
    photo: null,
    employeeId: '',
    location: '',
    spocUploaded: '',
    groupManager: ''
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.photo) newErrors.photo = 'Photo upload is required';
    if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.spocUploaded) newErrors.spocUploaded = 'SPOC case uploaded is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setSubmitMessage('Form submitted successfully');
    }
  };

  return (
   
    <div className="bg-[#c1dff2]">
    <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">CANDIDATE MANAGER</h2>
      <div className="bg-white p-12 w-full mx-auto">
        <form className="space-y-4 w-full text-center" onSubmit={handleSubmit}>
          {/* Organization Name */}
          <div className="w-full">
            <label htmlFor="organizationName" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Name of the Applicant</label>
            <input
              type="text"
              name="organizationName"
              placeholder="NAME OF THE Applicant"
              value={formData.organizationName}
              onChange={handleChange}
              className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.organizationName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.organizationName && <p className="text-red-500 text-sm">{errors.organizationName}</p>}
          </div>

          {/* Full Name */}
          <div className="w-full">
            <label htmlFor="fullName" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Full Name of the Applicant</label>
            <input
              type="number"
              name="fullName"
              placeholder="MOBILE NUMBER*"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>
          <div className="w-full">
            <label htmlFor="employeeId" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Email ID</label>
            <input
              type="email"
              name="emailId"
              placeholder="Email ID"
              value={formData.emailId}
              onChange={handleChange}
              className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.emailId ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.emailId && <p className="text-red-500 text-sm">{errors.emailId}</p>}
          </div>
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

          <div className="w-full">
            <label htmlFor="organizationName" className="block text-left w-1/2 m-auto mb-2 text-gray-700">Name of the Organization</label>
            <input
              type="text"
              name="organizationName"
              placeholder="NAME OF THE ORGANISATION"
              value={formData.organizationName}
              onChange={handleChange}
              className={`w-1/2 m-auto p-3 mb-[20px] border ${errors.organizationName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.organizationName && <p className="text-red-500 text-sm">{errors.organizationName}</p>}
          </div>
          <div className="space-y-4 py-[30px] px-[51px] bg-white rounded-md">
            <select
              name="packageselection"
              className="m-auto w-1/2 rounded-md p-2.5 border bg-[#c1dff2] text-[#4d606b] border-gray-300 "
            >
              <option value="">--PACKAGE OPTIONS--</option>
              <option value="all">ALL</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.packageName}>
                  {pkg.packageName}
                </option>
              ))}
            </select>
          </div>

          <table className="m-auto border-collapse border  rounded-lg">
            <thead>
              <tr className="bg-[#c1dff2] text-[#4d606b]">
                <th className="border  px-4 py-2">SERVICE</th>
                <th className="border  px-4 py-2">SERVICE CODE</th>
                <th className="border  px-4 py-2">SERVICE NAMES</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr className="text-center" key={index}>
                  <td className="border  px-4 py-2">
                    <input type="checkbox" name="services[]" value={`${service.id}#${service.serviceName}`} />
                  </td>
                  <td className="border  px-4 py-2">{service.id}</td>
                  <td className="border  px-4 py-2">{service.serviceName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='block'>
            <button type="submit" className="bg-{#2c81ba} text-white p-5 px-28 text-2xl rounded-md">Submit</button>
            <h4 className='text-xl'>Or</h4>
            <button type="button" className="bg-green-500 text-white p-5 px-20 text-2xl rounded-md">Bulk Upload</button>
          </div>
          <div className="flex text-left space-x-4 py-4">
            <div>
              <div className='show pages '> show pages 10</div>
              <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-md">Export Excel</button>
            </div>
            <div>
              <input type="search" />
            </div>
          </div>


          {submitMessage && <p className="text-green-500">{submitMessage}</p>}
        </form>
        <div className='overflow-scroll'>
          <table className="m-auto w-1/2 border-collapse border  rounded-lg">
            <thead>
              <tr className="bg-[#073d88] text-white whitespace-nowrap">
                <th className="border  px-4 py-2">Sl No.</th>
                <th className="border  px-4 py-2">NAME OF THE APPLICANT</th>
                <th className="border  px-4 py-2">Email ID</th>
                <th className="border  px-4 py-2">Mobile NO</th>
                <th className="border  px-4 py-2">STANDARD BGV</th>
                <th className="border  px-4 py-2">FRESHER BGV</th>
                <th className="border  px-4 py-2">EXPERIENCE BGV</th>
                <th className="border  px-4 py-2">SPECIAL BGV</th>
                <th className="border  px-4 py-2">PACKAGE BGV</th>
                <th className="border  px-4 py-2">Docs</th>
                <th className="border  px-4 py-2">Date/Time</th>
                <th className="border  px-4 py-2">Edit</th>
                <th className="border  px-4 py-2">Address Link</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border  px-4 py-2">1</td>
                <td className="border  px-4 py-2">John Doe</td>
                <td className="border  px-4 py-2">john.doe@example.com</td>
                <td className="border  px-4 py-2">123-456-7890</td>
                <td className="border  px-4 py-2">Yes</td>
                <td className="border  px-4 py-2">No</td>
                <td className="border  px-4 py-2">Yes</td>
                <td className="border  px-4 py-2">No</td>
                <td className="border  px-4 py-2">Yes</td>
                <td className="border  px-4 py-2"><button className="bg-orange-500 text-white px-2 py-1 rounded whitespace-normal">Docs View</button></td>
                <td className="border  px-4 py-2">2024-10-10 10:00 AM</td>
                <td className="border  px-4 py-2"><button className="bg-blue-500 text-white px-2 py-1 rounded whitespace-normal">Edit</button></td>
                <td className="border  px-4 py-2"><a href="#" className="text-blue-500 underline">View Address</a></td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>

        </div>

      </div>
    </div>
  );
};

export default CandidateManager;


