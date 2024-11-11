import React, { useState, useEffect, useCallback } from "react";
import "../App.css";
import Logo from "../imgs/track-master.webp";
import { useLocation, useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [error, setError] = useState('');
  const storedToken = localStorage.getItem('token');
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const emailFromQuery = query.get('email') || '';
  const usernameFromQuery = query.get('branchEmail') || ''; // Fetch username from query params
  const navigate = useNavigate();

  // Manage both email and password in the input state
  const [loginData, setLoginData] = useState({
    branchEmail: emailFromQuery,
    password: '',
  });

  // Fetch password for the given branch email
  const fetchData = useCallback(() => {
    fetch('https://screeningstar.onrender.com/Screeningstar/fetchPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedToken}`,
      },
      body: JSON.stringify({ branchEmail: loginData.branchEmail }), 
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch password');
        return res.json();
      })
      .then((data) => {
        setLoginData((prevState) => ({
          ...prevState,
          password: data.password || '', // Ensure password is correctly set
        }));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [loginData.branchEmail, storedToken]);

  // Fetch login data when component mounts or when the branch email changes
  useEffect(() => {
    if (usernameFromQuery) {
      setLoginData((prevState) => ({
        ...prevState,
        branchEmail: usernameFromQuery, 
      }));
      fetchData(); // Fetch password immediately after setting branchEmail
    }
  }, [usernameFromQuery, fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await fetch("https://screeningstar.onrender.com/Screeningstar/loginClient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${storedToken}`,
        },
        body: JSON.stringify(loginData),
      });

      const loginResult = await loginResponse.json();

      if (loginResponse.ok && loginResult.token) {
        // Store the token in localStorage
        localStorage.setItem('token', loginResult.token);

        // Step 2: Verify login credentials using the second API
        const verifyResponse = await fetch("https://screeningstar.onrender.com/Screeningstar/clients/verif-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${loginResult.token}`,
          },
          body: JSON.stringify(loginData),
        });

        if (verifyResponse.ok) {
          navigate("/user-dashboard");
        } else {
          setError("Invalid email or password.");
        }
      } else {
        setError("Login failed.");
      }
    } catch (error) {
      setError(`Error during login: ${error.message}`);
    }
  };

  return (
    <div className="p-[100px] bg-[#e2e2e2]">
      <div className="flex w-full min-h-[800px] shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        <div className="flex w-1/2 bg-[#073d88]">
          <div className="w-full flex flex-col items-start justify-center align-middle p-6">
            <div className="container text-center mx-auto">
              <h1 className="text-white text-7xl mt-2.5">Welcome to the "Track Master" </h1>
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
              value={loginData.password} // Updated to use loginData.password
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
              <span className="text-[#073d88] cursor-pointer">Reset Password?</span>
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
