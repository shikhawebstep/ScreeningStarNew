import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const AdminSetPassword = () => {
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [passwordToken, setPasswordToken] = useState('');

    useEffect(() => {
        // Extract email and password_token from the URL query string
        const queryParams = new URLSearchParams(window.location.search);
        const emailFromUrl = queryParams.get('email');
        const passwordTokenFromUrl = queryParams.get('token');

        if (emailFromUrl && passwordTokenFromUrl) {
            setEmail(emailFromUrl);
            setPasswordToken(passwordTokenFromUrl);
        } else {
            // Handle error if query parameters are not available
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Missing email or password token in the URL.',
            });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords do not match!',
            });
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            email: email,
            password_token: passwordToken,
            new_password: newPassword, // Add the new password to the request body
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("https://screeningstar-new.onrender.com/admin/forgot-password", requestOptions);
            const result = await response.json();

            if (response.ok) {
                const newToken = response.token || response._token || '';
                if (newToken) {
                    localStorage.setItem("_token", newToken);
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Password Reset Successful',
                    text: 'Your password has been changed.',
                    confirmButtonText: 'OK',  // Custom button text

                }).then((result) => {
                    if (result.isConfirmed) {
                        // Navigate directly to the desired page after clicking OK
                        navigate('/admin-login'); // Change '/login' to your desired path
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message || 'Something went wrong, please try again.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to communicate with the server.',
            });
        }
    };

    return (
        <div className="overflow-x-auto py-6 px-0 bg-white mt-10 m-auto">
            <div className="bg-white p-6 border w-1/2 mx-auto">
                <h2 className="text-4xl font-bold text-center text-[#4d606b] px-3">Set New Password</h2>
                <h4 className="text-xl py-3 text-center text-[#4d606b] px-3">Must be at least 8 characters</h4>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="py-1">Password:</label>
                        <input
                            type="password"
                            name="new_password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full my-3 rounded-md p-2.5 border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className="py-1">Confirm Password:</label>
                        <input
                            type="password"
                            name="confirm_password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Enter your password again"
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

export default AdminSetPassword;
