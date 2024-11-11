import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeePhoto: '',
    employeeName: '',
    employeeMobile: '',
    email: '',
    password: '',
    designation: '',
    role: ''
  });
  const [employeePhotoName, setEmployeePhotoName] = useState('');
  const [errors, setErrors] = useState({}); // For storing validation errors
  const [submitMessage, setSubmitMessage] = useState(''); // For success/error messages
  const [fileName, setFileName] = useState('');
console.log(employeePhotoName);
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent special characters for certain fields
    if (name === 'employeeName' || name === 'designation') {
      const regex = /^[a-zA-Z\s]*$/; // Only allow letters and spaces
      if (!regex.test(value)) return; // If value contains special characters, do not update
    }

    if (name === 'employeeMobile') {
      const regex = /^[0-9]*$/;
      if (!regex.test(value)) return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employeePhoto) newErrors.employeePhoto = "Employee Photo is required.";
    if (!formData.employeeName) newErrors.employeeName = "Employee Name is required.";
    if (!formData.employeeMobile) newErrors.employeeMobile = "Employee Mobile is required.";
    if (!/^\d{10}$/.test(formData.employeeMobile)) newErrors.employeeMobile = "Mobile must be 10 digits.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (!formData.designation) newErrors.designation = "Designation is required.";
    if (!formData.role) newErrors.role = "Role is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      const options = {
        maxSizeMB: 1, // Limit file size to 1MB
        useWebWorker: true,
        initialQuality: 1, // Use initial quality for lossless compression
      };
  
      // Compress the image
      const compressedFile = await imageCompression(formData.employeePhoto, options);
  
      // Convert compressed file to base64 string
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(compressedFile);
      });
  
      // Store the base64 image in state for local use
      setEmployeePhotoName(base64Image);
  
      // Create a unique filename using a timestamp
      const timestamp = Date.now();
      const fileNameWithTimestamp = `${timestamp}_${formData.employeePhoto.name}`;
  
      // Prepare user data
      const userData = {
        employeeName: formData.employeeName,
        employeeMobile: formData.employeeMobile,
        email: formData.email,
        password: formData.password,
        designation: formData.designation,
        role: formData.role,
        employeePhoto: fileNameWithTimestamp,
        // employeePhotoName: base64Image, // This line is now removed
      };
  
      // Send the user data to the server
      await axios.post('https://screeningstar.onrender.com/Screeningstar/createuser', userData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      setSubmitMessage('User created successfully!');
      setFormData({
        employeePhoto: null,
        employeeName: '',
        employeeMobile: '',
        email: '',
        password: '',
        designation: '',
        role: '',
      });
      setFileName('');
      navigate('/admin-existing-users');
    } catch (error) {
      console.error('Error compressing or uploading image:', error);
      setSubmitMessage('Failed to upload image.');
    }
  };
  
  

  const handleChangee = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
      setFileName(files[0].name); // Set the selected file name
      setErrors({ ...errors, [name]: '' }); // Clear any error for this field
    } else {
      setFileName('');
    }
  };

  return (
    <div className="w-full bg-[#c1dff2] border overflow-hidden">
    
    <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">CREATE USER</h2>
      <div className="bg-white text-left  p-12   w-full mx-auto">

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="relative mb-[20px]">
              <input
                type="file"
                name="employeePhoto"
                onChange={handleChangee}
                className={`w-full p-3 border ${errors.employeePhoto ? 'border-red-500' : 'border-gray-300'} rounded-md text-left appearance-none`}
                style={{ opacity: 0, position: 'absolute', zIndex: 2 }} // Hide the actual input
              />
              <label className={`w-full p-3 border ${errors.employeePhoto ? 'border-red-500' : 'border-gray-300'} rounded-md flex items-center ${fileName ? 'bg-white' : 'bg-white text-gray-500'}`}>
                {fileName || 'Employee Photo'} {/* Show file name or placeholder */}
              </label>
            </div>
            {errors.employeePhoto && <p className="text-red-500 text-sm">{errors.employeePhoto}</p>}
          </div>
          <div>
            <input
              type="text"
              name="employeeName"
              placeholder="Employee Name"
              value={formData.employeeName}
              onChange={handleChange}
              className={`w-full p-3 mb-[20px] border ${errors.employeeName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.employeeName && <p className="text-red-500 text-sm">{errors.employeeName}</p>}
          </div>
          <div>
            <input
              type="text"
              name="employeeMobile"
              placeholder="Employee Mobile"
              value={formData.employeeMobile}
              onChange={handleChange}
              className={`w-full p-3 mb-[20px] border ${errors.employeeMobile ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.employeeMobile && <p className="text-red-500 text-sm">{errors.employeeMobile}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 mb-[20px] border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 mb-[20px] border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formData.designation}
              onChange={handleChange}
              className={`w-full p-3 mb-[20px] border ${errors.designation ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}
          </div>
          <div>
            <select
              className={`w-full p-3 mb-[20px] border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="admin">ADMIN</option>
              <option value="user">USER</option>
              <option value="subuser">SUB USER</option>
              <option value="superuser">SUPER USER</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>
          <div className='text-left'>
            <button type="submit" className="p-6 py-3 bg-[#2c81ba] text-white font-bold rounded-md hover:bg-[#0f5381]">
              Submit
            </button>
          </div>
        </form>
        {submitMessage && (
          <div className={errors ? "text-red-500 text-center" : "text-green-500 text-center"}>
            {submitMessage}
          </div>
        )}

      </div>
    </div>
  );
};

export default CreateUser;
