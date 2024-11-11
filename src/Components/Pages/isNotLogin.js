import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const IsNotLogin = ({ children }) => {
  const [loading, setLoading] = useState(true);  // Default loading state to true
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      console.log("Checking authentication...");

      const storedAdminData = localStorage.getItem('admin');
      const storedToken = localStorage.getItem('_token');

      console.log('Stored Admin Data:', storedAdminData);
      console.log('Stored Token:', storedToken);

      // If no authentication data found, clear localStorage and redirect to login page
      if (!storedAdminData || !storedToken) {
        console.log("No authentication data found. Clearing localStorage.");
        localStorage.clear();
      }

      let adminData;
      try {
        adminData = JSON.parse(storedAdminData);  // Parse admin data
        console.log("Parsed Admin Data:", adminData);
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
        localStorage.clear();
      }

      // Verify the admin login using an API request
      try {
        console.log("Sending API request to verify admin login...");
        const response = await axios.post(
          'https://screeningstar-new.onrender.com/admin/verify-admin-login',
          {
            admin_id: adminData.id,
            _token: storedToken,
          }
        );

        console.log('API Response:', response);

        if (response.data.status) {
          console.log("Login verified. Redirecting to home page...");
          navigate('/', { state: { from: location }, replace: true });  // Redirect to index if valid
        } else {
          console.log("Login failed. Setting loading state to false.");
          setLoading(false);  // Set loading to false if the response is invalid
        }
      } catch (error) {
        console.error('Error validating login:', error);
        localStorage.clear();
      }
    };

    checkAuthentication();  // Run authentication check

  }, [navigate, location]);

  if (loading) {
    console.log("Loading state is true, displaying loading message...");
    return <div>Loading...</div>;  // Show loading message while checking authentication
  }

  console.log("Authentication successful. Rendering children components.");
  return children;  // Return the children components if authenticated
};

export default IsNotLogin;
