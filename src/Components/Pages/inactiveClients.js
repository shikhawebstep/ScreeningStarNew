import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InactiveClients = () => {
    const [inactiveClients, setInactiveClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const storedToken = localStorage.getItem('token');

    useEffect(() => {
        const fetchInactiveClients = async () => {
            const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
            const storedToken = localStorage.getItem("_token");
            if (!storedToken) {
                console.error("No token found. Please log in.");
                return;
            }
            try {
                const response = await fetch(`https://screeningstar-new.onrender.com/customer/inactive-list?admin_id=${admin_id}&_token=${storedToken}`, {
                    method: "GET",
                    redirect: "follow"
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const result = await response.text();
                console.log(result);
            } catch (error) {
                console.error("Failed to fetch active accounts:", error);
            }
        };
        fetchInactiveClients();
    }, [storedToken]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            setError(null);
            try {
                await axios.delete(`https://screeningstar.onrender.com/Screeningstar/clients/${id}`);
                setInactiveClients(inactiveClients.filter(client => client.id !== id));
            } catch (err) {
                setError(err);
            }
        }
    };

    const handleUnblock = async (id) => {
        if (window.confirm('Are you sure you want to unblock this client?')) {
            setError(null);
            try {
                await axios.put(
                    `https://screeningstar.onrender.com/Screeningstar/clients/status/${id}`,
                    { status: 'active' },
                    { headers: { 'Authorization': `Bearer ${storedToken}` } }
                );
                setInactiveClients(inactiveClients.filter(client => client.id !== id));
            } catch (err) {
                setError(err);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    return (
        <div className="bg-[#c1dff2]">
            <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">INACTIVE CLIENTS</h2>
            <div className="bg-white p-12 border w-full mx-auto">
                <div className="flex space-x-4">

                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full border-collapse border border-black rounded-lg">
                            <thead className='rounded-lg'>
                                <tr className="bg-[#c1dff2] text-[#4d606b]  rounded-lg whitespace-nowrap">
                                    <th className="py-2 px-4 border">SL</th>
                                    <th className="py-2 px-4 border">Detailed View</th>
                                    <th className="py-2 px-4 border">Company Name</th>
                                    <th className="py-2 px-4 border">Address</th>
                                    <th className="py-2 px-4 border">Mobile</th>
                                    <th className="py-2 px-4 border">Agreement Period</th>
                                    <th className="py-2 px-4 border">Role</th>
                                    <th className="py-2 px-4 border">GST</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inactiveClients.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="py-4 text-center text-gray-500 border">
                                            You have no data
                                        </td>
                                    </tr>
                                ) : (
                                    inactiveClients.map((client, index) => (
                                        <tr key={client.id} className="hover:bg-gray-200">
                                            <td className="py-2 px-4 border">{index + 1}</td>
                                            <td className="py-2 px-4 border">
                                                <button className="bg-orange-500 text-white px-4 py-2 rounded" aria-label={`View details for ${client.organizationName}`}>View</button>
                                            </td>
                                            <td className="py-2 px-4 border">{client.organizationName}</td>
                                            <td className="py-2 px-4 border">{client.registeredAddress}</td>
                                            <td className="py-2 px-4 border">{client.mobileNumber}</td>
                                            <td className="py-2 px-4 border">{client.agreementPeriod}</td>
                                            <td className="py-2 px-4 border">{client.role}</td>
                                            <td className="py-2 px-4 border">{client.gstNumber}</td>
                                            <td className="py-2 px-4 border whitespace-nowrap">
                                                <button
                                                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                                    onClick={() => handleUnblock(client.id)}
                                                    aria-label={`Unblock ${client.organizationName}`}
                                                >
                                                    Unblock
                                                </button>
                                                <button
                                                    className="bg-[#c9302c] text-white px-4 py-2 rounded"
                                                    onClick={() => handleDelete(client.id)}
                                                    aria-label={`Delete ${client.organizationName}`}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    );
};
export default InactiveClients;