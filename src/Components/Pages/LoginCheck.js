import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LoginCheck = ({ children }) => {
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const checkAuthentication = async () => {
      const storedAdminData = localStorage.getItem("admin");
      const storedToken = localStorage.getItem("_token");



      if (!storedAdminData || !storedToken) {

        localStorage.clear();


        redirectToLogin();


        return;
      }


      let adminData;
      try {


        adminData = JSON.parse(storedAdminData);


      } catch (error) {


        console.error('Error parsing JSON from localStorage:', error);


        redirectToLogin();


        return;
      }



      try {
        const response = await axios.post(`https://screeningstar-new.onrender.com/admin/verify-admin-login`, {
          admin_id: adminData.id,
          _token: storedToken,
        });

        if (response.data.status) {
          setLoading(false);
          const newToken=response._token || response.token
          if(newToken){
            localStorage.setItem("_token",newToken);
          }

        } else {

          redirectToLogin();
        }
      } catch (error) {
        console.error('Error validating login:', error);
        localStorage.clear();

        redirectToLogin();
      }
    };

    const redirectToLogin = () => {
      navigate('/admin-login', { state: { from: location }, replace: true });
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

export default LoginCheck;