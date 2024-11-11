import React, { useState } from 'react';

const UserCreate = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    // Basic validation
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.passwordMatch = 'Your passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitMessage('');
    } else {
      setErrors({});
      setSubmitMessage('User created successfully!');
      // Submit logic here
    }
  };

  return (
    <div className="bg-[#c1dff2]">
    <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">CREATE USER</h2>
      <div className="bg-white p-12 w-full mx-auto">
        <form className="space-y-4 w-full text-center" onSubmit={handleSubmit}>
        
          <div className='w-full'>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={` w-1/2 m-auto p-3 mb-[20px] border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          
          <div className='w-full'>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={` w-1/2 m-auto p-3 mb-[20px] border ${errors.password || errors.passwordMatch ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className='w-full'>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={` w-1/2 m-auto p-3 mb-[20px] border ${errors.confirmPassword || errors.passwordMatch ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          {/* Password match error */}
          {errors.passwordMatch && <p className="text-red-500 text-sm">{errors.passwordMatch}</p>}
         
          <div className="text-center">
            <button type="submit" className="  p-6 py-3 bg-[#2c81ba] text-white font-bold rounded-md hover:bg-blue-600">
              Submit
            </button>
          </div>
        </form>

        {submitMessage && (
          <div className="text-green-500 text-center">
            {submitMessage}
          </div>
        )}

      </div>
    </div>
  );
};

export default UserCreate;
