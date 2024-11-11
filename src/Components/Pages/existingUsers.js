import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';

const ExistingUsers = () => {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [formData, setFormData] = useState({
        employeePhoto: '',
        employeeName: '',
        employeeMobile: '',
        email: '',
        password: '',
        designation: '',
        role: '',
    });
    const storedToken = localStorage.getItem('token');
    const fetchUsers = async () => {
        try {
            const response = await fetch('https://screeningstar.onrender.com/Screeningstar/users', {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            }
            );
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    useEffect(() => {

        fetchUsers();
    }, [fetchUsers]);

    const handleEdit = (user) => {
        setEditingUserId(user.id);
        setFormData({
            employeePhoto: user.employeePhoto || '',
            employeeName: user.employeeName,
            employeeMobile: user.employeeMobile,
            email: user.email,
            password: '',
            designation: user.designation,
            role: user.role,
        });
    };

    const handleCancelEdit = () => {
        setEditingUserId(null);
        setFormData({
            employeePhoto: '',
            employeeName: '',
            employeeMobile: '',
            email: '',
            password: '',
            designation: '',
            role: '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevData) => ({
                    ...prevData,
                    employeePhoto: reader.result,  // Store base64 string for preview
                    employeePhotoName: file.name   // Store the image name separately
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedFormData = {
                ...formData,
                employeePhoto: formData.employeePhotoName  // Send only the image name to API
            };

            const response = await fetch(`https://screeningstar.onrender.com/Screeningstar/Users/${editingUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                },
                body: JSON.stringify(updatedFormData),  // Use updated data
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUsers((prevUsers) =>
                    prevUsers.map((user) => (user.id === editingUserId ? updatedUser : user))
                );
                handleCancelEdit();
                fetchUsers();
                alert('User edited successfully');
            } else {
                console.error('Error saving user:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };


    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            try {
                await fetch(`https://screeningstar.onrender.com/Screeningstar/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${storedToken}`
                    }
                });
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
                alert('user deleted succesfully');
            } catch (error) {
                console.error('Error deleting user:', error);
            }

        }

    };

    return (

        <div className="w-full bg-[#c1dff2] border overflow-hidden">
            <div className="text-left">    
            <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">EXISTING USERS</h2>

            </div>

            <div className="space-y-4 py-[30px] px-[51px] bg-white">
                {editingUserId ? (
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div>
                            <input
                                type="file"
                                name="employeePhoto"
                                className="w-full p-3 border border-gray-300 rounded-md text-left appearance-none"
                                onChange={handleFileChange}
                            />
                            {formData.employeePhoto && (
                                <img
                                    src={formData.employeePhoto}
                                    alt={`${formData.employeeName}'s photo`}
                                    className="w-20 h-20 mt-2 rounded-full"
                                />
                            )}
                        </div>
                        <div>
                            <input
                                type="text"
                                name="employeeName"
                                placeholder="Employee Name"
                                className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                                value={formData.employeeName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="employeeMobile"
                                placeholder="Employee Mobile"
                                className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                                value={formData.employeeMobile}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        {/* <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div> */}
                        <div>
                            <input
                                type="text"
                                name="designation"
                                placeholder="Designation"
                                className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                                value={formData.designation}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <select
                                className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="admin">ADMIN</option>
                                <option value="user">USER</option>
                                <option value="subuser">SUB USER</option>
                                <option value="superuser">SUPER USER</option>
                            </select>
                        </div>
                        <div>
                            <select
                                className="w-full p-3 mb-[20px] border border-gray-300 rounded-md"
                                name="status"  // Use "status" as the name
                                value={formData.status}  // Bind to formData.status
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className='text-left'>
                            <button type="submit" className="p-6 py-3 bg-[#073d88] text-white font-bold rounded-md hover:bg-blue-600">
                                Submit
                            </button>
                            <button type="button" onClick={handleCancelEdit} className="p-6 py-3 ml-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600">
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className=" overflow-x-auto">
                        <table className="min-w-full border-collapse border  ">
                            <thead className=''>
                                <tr className="bg-[#c1dff2] text-[#4d606b] ">
                                    <th className="border  px-4 py-2">SL</th>
                                    <th className="border  px-4 py-2">Employee Photo</th>
                                    <th className="border  px-4 py-2">Name</th>
                                    <th className="border  px-4 py-2">Mobile Number</th>
                                    <th className="border  px-4 py-2">Email</th>
                                    <th className="border  px-4 py-2">Designation</th>
                                    <th className="border  px-4 py-2">Role</th>
                                    <th className="border  px-4 py-2" colSpan={2}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={user.id}>
                                            <td className="border  px-4 py-2">{index + 1}</td>
                                            <td className="border  px-4 py-2">
                                                {user.employeePhoto && (
                                                    <img src={user.employeePhoto} className=" " />
                                                )}
                                            </td>
                                            <td className="border  px-4 py-2">{user.employeeName}</td>
                                            <td className="border  px-4 py-2">{user.employeeMobile}</td>
                                            <td className="border  px-4 py-2">{user.email}</td>
                                            <td className="border  px-4 py-2">{user.designation}</td>
                                            <td className="border  px-4 py-2">{user.role}</td>
                                            <td className="border  px-4 py-2">
                                                <button onClick={() => handleEdit(user)}>
                                                    <MdEdit className="text-blue-500 hover:text-blue-700" />
                                                </button>
                                            </td>
                                            <td className="border  px-4 py-2">
                                                <button onClick={() => handleDelete(user.id)}>
                                                    <MdDelete className="text-red-500 hover:text-red-700" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="border  px-4 py-2 text-center">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExistingUsers;
