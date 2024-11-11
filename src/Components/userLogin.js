import React, { useState, useEffect, useCallback } from "react";
import "../App.css";
import Logo from "../imgs/track-master.webp";
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
const UserLogin = () => {
  const [error, setError] = useState('');
  const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
  const storedToken = localStorage.getItem("_token");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const emailFromQuery = query.get('email') || '';
  const usernameFromQuery = query.get('branchEmail') || '';
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    branchEmail: emailFromQuery,
    password: '',
  });

  const fetchPassword = useCallback(async () => {
    console.log("fetchPassword called");
    if (storedToken && loginData.branchEmail) {
      console.log("Stored token exists:", storedToken);
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      try {
        const response = await fetch(`https://screeningstar-new.onrender.com/customer/fetch-branch-password?branch_email=${loginData.branchEmail}&admin_id=${admin_id}&_token=${storedToken}`, requestOptions);
        const result = await response.json();

        if (result.status) {
          console.log("Password fetched:", result.password);
          setLoginData((prevState) => ({
            ...prevState,
            password: result.password || '',
          }));
        } else {
          console.log("Password fetch failed");
        }
      } catch (error) {
        console.error("Error fetching password:", error);
      }
    } else {
      console.log("No stored token or branch email available.");
    }
  }, [loginData.branchEmail, storedToken, admin_id]);

  useEffect(() => {
    console.log("useEffect triggered, usernameFromQuery:", usernameFromQuery);
    if (usernameFromQuery) {
      setLoginData((prevState) => ({
        ...prevState,
        branchEmail: usernameFromQuery,
      }));
      fetchPassword();
    }
  }, [usernameFromQuery, fetchPassword]);

  const handleChange = (e) => {
    console.log("Input changed:", e.target.name, e.target.value);
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      "username": loginData.branchEmail,
      "password": loginData.password,
    });
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    try {
      const loginResponse = await fetch("https://screeningstar-new.onrender.com/branch/login", requestOptions);
      const loginResult = await loginResponse.json();
      console.log("Login result:", loginResult);
  
      if (loginResponse.ok && loginResult.token) {
        console.log("Login successful, storing token.");
        localStorage.setItem('branch_token', loginResult.token);
        localStorage.setItem('branch', JSON.stringify(loginResult.branchData));
        
        // Success message
        Swal.fire({
          title: 'Login Successful!',
          text: 'Welcome back to the dashboard.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate("/user-dashboard");
        });
      } else {
        // Extract error message from response if available
        const errorMessage = loginResult.message || "Invalid login credentials.";
        console.log(errorMessage);
        setError(errorMessage);
  
        // Show error alert with the response message
        Swal.fire({
          title: 'Login Failed!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
  
      // Check if the error has a message (e.g., network error or timeout)
      const errorMessage = error.message || "An unexpected error occurred during login.";
  
      // Show the error message in SweetAlert
      setError(errorMessage);
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="p-[100px] bg-[#e2e2e2]">
      <div className="flex w-full min-h-[800px] shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        <div className="flex w-1/2 bg-[#073d88]">
          <div className="w-full flex flex-col items-start justify-center align-middle p-6">
            <div className="container text-center mx-auto">
              <h1 className="text-white text-7xl mt-2.5">Welcome to the "Track Master"</h1>
              <h3 className="text-white text-2xl mt-2 px-5">
                Verification Portal, presented by <br /> ScreeningStar Solutions Pvt Ltd!
              </h3>
              <div className="border-b border-white border-4 w-[500px] mx-auto rounded-full mt-4"></div>
              <p className="text-white text-[18px] text-center w-[500px] mx-auto mt-8">
                Our Client Servicing Expert, your dedicated point of contact, is available from 9:30 AM to 7:00 PM to assist with any support related to the Background Screening process or the status of any applications.
              </p>
              <p className="text-white text-[18px] text-center w-[500px] mx-auto mt-2">
                “Our Reach extends across all the corners of the world” - India and Global
              </p>
            </div>
          </div>
        </div>

        <div className="flex min-h-[800px] h-screen items-center w-1/2 justify-center bg-white border-[10px] border-[#ee8f1b]">
          <form className="bg-white rounded max-w-[65%] w-full mb-[100px]" onSubmit={handleSubmit}>
            <img src={Logo} className="mb-[50px] w-[450px] m-auto mt-[50px] text-center text-[#073d88]" alt="Logo" />
            <input
              type="email"
              id="username"
              name="branchEmail"
              placeholder="Email ID"
              required
              value={loginData.branchEmail}
              onChange={handleChange}
              style={{ borderLeft: "5px solid #073d88" }}
              className="p-3 mb-4 w-full rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#073d88]"
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              value={loginData.password}
              onChange={handleChange}
              style={{ borderLeft: "5px solid #073d88" }}
              className="p-3 mb-4 w-full rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#073d88]"
            />
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="flex justify-between items-center mb-4 my-6">
              <label className="flex items-center text-gray-500">
                <input type="checkbox" className="mr-2" />
                Keep me signed in
              </label>
             
              <Link
                  to="/user-forgot-password"
                >
                  <span className="text-[#073d88] cursor-pointer">Reset Password?</span>

                </Link>
            </div>
            <button
              type="submit"
              className="text-2xl w-[300px] mx-auto flex justify-center mt-10 bg-[#073d88] text-white p-3 rounded hover:bg-[#073d88] transition duration-200"
            >
              LOG IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
