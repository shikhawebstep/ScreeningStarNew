import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AdminForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the email input
        if (!email) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Please enter your email.',
            });
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({ email });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("https://screeningstar-new.onrender.com/admin/forgot-password-request", requestOptions);
            const result = await response.json();

            if (response.ok) {
                // Success Alert with API message
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: result.message || 'Reset instructions have been sent to your email.',
                });
                const newToken = response.token || response._token || '';
                if (newToken) {
                    localStorage.setItem("_token", newToken);
                }
            } else {
                // Error Alert with API message
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message || 'An error occurred. Please try again.',
                });
            }
        } catch (error) {
            console.error(error);
            
            // Network Error Alert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'A network error occurred. Please try again later.',
            });
        }
    };

    return (
        <div className="overflow-x-auto py-6 px-0 bg-white mt-10 m-auto">
            <div className="bg-white p-6 border w-1/2 mx-auto">
                <h2 className="text-4xl font-bold text-left text-[#4d606b] px-3">Forgot Password</h2>
                <h4 className="text-base py-3 text-left text-[#4d606b] px-3">We'll send you reset instructions.</h4>
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="py-1">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full my-3 rounded-md p-2.5 border border-gray-300"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full my-3 rounded-md text-white p-2.5 border bg-[#2c81ba] border-gray-300"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
                
                <h3 className="text-lg text-center font-semibold">
                    <a href="/" className="text-[#61c0ff] hover:text-blue-800 no-underline">Back to Login</a>
                </h3>
            </div>
        </div>
    );
};

export default AdminForgotPassword;
