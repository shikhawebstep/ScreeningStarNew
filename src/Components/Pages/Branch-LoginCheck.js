import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BranchLoginCheck = ({ children }) => {
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      console.log("Checking authentication...");

      const storedBranchData = localStorage.getItem("branch");
      const storedToken = localStorage.getItem("branch_token");
      
      console.log("Stored branch data:", storedBranchData);
      console.log("Stored token:", storedToken);

      if (!storedBranchData || !storedToken) {
        console.log("Branch data or token missing. Clearing localStorage and redirecting to login.");
        
        localStorage.clear();
        redirectToLogin();
        
        return;
      }

      let branchData;
      try {
        console.log(`storedBranchData - `, storedBranchData);
        branchData = JSON.parse(storedBranchData);
        console.log("Parsed branch data:", branchData);
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
        
        redirectToLogin();
        return;
      }

      try {
        console.log("Validating login with API...");
        
        const response = await axios.post(`https://screeningstar-new.onrender.com/branch/verify-branch-login`, {
          branch_id: branchData.id,
          _token: storedToken,
        });
        
        console.log("API response:", response);

        if (response.data.status) {
          console.log("Login validated. Setting loading to false.");
          setLoading(false);

          const newToken = response.data.token || response.data._token || '';
          if (newToken) {
            console.log("New token received. Updating localStorage.");
            localStorage.setItem("branch_token", newToken);
          }
        } else {
          console.log("Login validation failed. Redirecting to login.");
          redirectToLogin();
        }
      } catch (error) {
        console.error("Error validating login:", error);
        localStorage.clear();
        redirectToLogin();
      }
    };

    const redirectToLogin = () => {
      console.log("Redirecting to login page...");
      navigate('/userLogin', { state: { from: location }, replace: true });
    };

    checkAuthentication();
  }, [navigate, setLoading, location]);

  if (loading) {
    return (
      <>
        Loading........
      </>
    );
  }

  return children;
};

export default BranchLoginCheck;
