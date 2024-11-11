import { React, useState } from "react";
import "../App.css";
import loginImg from "../imgs/login-img.jpg";
import axios from "axios";
import Logo from "../imgs/admin-logo.png";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing eye icons

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const newErr = {};

    if (!input.username) {
      newErr.username = "This field is required";
    } else if (!emailRegex.test(input.username)) {
      newErr.username = "Please enter a valid email address";
    }

    if (!input.password) {
      newErr.password = "Please enter your password correctly";
    }

    return Object.keys(newErr).length > 0 ? newErr : null;
  };


  const handleAdminSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (validationErrors) {
      setError(validationErrors);
      return;
    }
      const loginData = {
        username: input.username,
        password: input.password,
      };

      axios.post(`https://screeningstar-new.onrender.com/admin/login`, loginData)
        .then((response) => {
          if (!response.data.status) {
            Swal.fire({
              title: 'Error!',
              text: `An error occurred: ${response.data.message}`,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
           
          } else {

            const adminData = response.data.adminData;
            const _token = response.data.token;

            localStorage.setItem('admin', JSON.stringify(adminData));
            localStorage.setItem('_token', _token);
            Swal.fire({
              title: "Success",
              text: 'Login Successfull',
              icon: "success",
              confirmButtonText: "Ok"
            })
            

            navigate('/', { state: { from: location }, replace: true });
            setError({});
          }
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error!',
            text: `Error: ${error.response?.data?.message || error.message}`,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        })
      
   
  };

  return (
    <>
      <div className="login-page bg-gradient-to-r from-pink-400 to-purple-900 rounded-lg shadow-lg p-5 w-full md:p-[100px]">
        <div
          className="relative border-white rounded-[18px] md:p-[50px] md:pb-[20px] p-5 bg-cover bg-center md:w-10/12 m-auto"
          style={{
            backgroundImage: `url(${loginImg})`,
            border: "10px solid #fff",
          }}
        >
          <div className="absolute inset-0 backdrop-blur-[4px] rounded-[18px] bg-white bg-opacity-50"></div>

          <div className="max-w-[700px] mx-auto relative z-10 md:pb-40 md:pt-20">
            <img
              src={Logo}
              className="text-[45px] font-medium md:mb-[70px] md:mt-[60px] mb-8 mt-3 text-center w-[600px] mx-auto"
              alt="Logo"
            />

            <form className="md:flex flex-col mb-4" onSubmit={handleAdminSubmit}>
              <div className="md:flex items-center">
                <div className="mr-2 md:flex-1 mb-3 w-full">
                  <input
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    name="username"
                    placeholder="Email"
                    onChange={handleChange}
                    value={input.username}
                  />
                  {error.username && (
                    <p className="text-red-500 text-xs italic">{error.username}</p>
                  )}
                </div>
                <div className="mr-2 md:flex-1 mb-3 w-full relative">
                  <input
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type={passwordVisible ? "text" : "password"} // Change input type based on visibility
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={input.password}
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
                  >
                    {passwordVisible ? <FaEyeSlash className="text-gray-400 mt-1 mr-1" /> : <FaEye FaEyeSlash className="text-gray-400 mt-1 mr-1"/>} {/* Show/hide icon */}
                  </span>
                  {error.password && (
                    <p className="text-red-500 text-xs italic">{error.password}</p>
                  )}
                </div>
                <div className="md:flex-1 mb-3 w-full">
                  <button
                  className="bg-pink-500 hover:bg-pink-700 text-white md:mb-0  font-bold md:py-3 md:px-4 py-2  rounded focus:outline-none focus:shadow-outline w-full"
                    
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center text-gray-500 text-[10px] md:text-base">
                  <input type="checkbox" className="mr-2 " />
                  Stay signed in
                </label>
                <span className="text-[#073d88] cursor-pointer text-[10px] md:text-base">
                  Forgot password?
                </span>
              </div>

              {error.api && (
                <p className="text-red-500 text-xs italic mb-4">{error.api}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
