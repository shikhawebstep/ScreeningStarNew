import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const AdminUpdatePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the passwords match
        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Passwords do not match.',
            });
            return;
        }

        // Retrieve admin_id and _token from localStorage
        const adminId = JSON.parse(localStorage.getItem("admin"))?.id;
        const token = localStorage.getItem('_token');

        if (!adminId || !token) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Missing admin ID or token.',
            });
            return;
        }

        // Prepare the request body
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        const raw = JSON.stringify({
            new_password: newPassword,
            admin_id: adminId,
            _token: token,
        });

        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        };

        // Make the API request to update the password
        try {
            const response = await fetch('https://screeningstar-new.onrender.com/admin/update-password', requestOptions);
            const result = await response.text();
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Updated',
                    text: 'Your password has been updated successfully.',
                });
                const newToken = response.token || response._token || '';
                if (newToken) {
                    localStorage.setItem("_token", newToken);
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result,
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while updating the password.',
            });
        }
    };

    return (
        <div className="overflow-x-auto py-6 px-0 bg-white mt-10 m-auto">
            <div className="bg-white p-6 border w-1/2 mx-auto">
                <h2 className="text-4xl font-bold text-center text-[#4d606b] px-3">Update Password</h2>
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
            </div>
        </div>
    );
};
export default AdminUpdatePassword;
