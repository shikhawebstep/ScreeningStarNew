import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminManager = () => {
    const navigate = useNavigate();
    const [clientData, setClientData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCases, setActiveCases] = useState(null);
    const [nonHeadBranchData, setNonHeadBranchData] = useState([]);

    const fetchData = useCallback(() => {
        const adminId = JSON.parse(localStorage.getItem("admin"))?.id;
        const token = localStorage.getItem('_token');

        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: "follow"
        };

        fetch(`https://screeningstar-new.onrender.com/client-master-tracker/list?admin_id=${adminId}&_token=${token}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                const newToken = result.token || result._token || '';
                if (newToken) {
                    localStorage.setItem("_token", newToken);
                }
                setClientData(result.customers);
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCheckIn = (main_id) => {
        if (activeCases && activeCases.main_id === main_id) {
            setActiveCases(null); // Toggle off if the same client is clicked again
            setNonHeadBranchData([]);
            return;
        }

        const adminId = JSON.parse(localStorage.getItem("admin"))?.id;
        const token = localStorage.getItem('_token');

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(`https://screeningstar-new.onrender.com/client-master-tracker/branch-list-by-customer?customer_id=${main_id}&admin_id=${adminId}&_token=${token}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                const newToken = result.token || result._token || '';
                if (newToken) {
                    localStorage.setItem("_token", newToken);
                }
                setActiveCases({ main_id }); // Set the active client
                setNonHeadBranchData(result.customers);
            })
            .catch((error) => console.error(error));
    };

    const handleDelete = (main_id) => {
        // Handle delete functionality here
    };
    const handleCheckInGo = (branch_id,main_id) => {
        navigate(`/admin-chekin?clientId=${main_id}&branchId=${branch_id}`);
    };

    return (
        <div className="bg-[#c1dff2]">
            <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">ADMIN MANAGER</h2>
            <div className="bg-white p-12 w-full mx-auto">
                <table className="min-w-full border-collapse border rounded-lg">
                    <thead>
                        <tr className="bg-[#c1dff2] text-[#4d606b]">
                            <th className="border px-4 py-2">SL</th>
                            <th className="border px-4 py-2">Client ID</th>
                            <th className="border px-4 py-2">Organization Name</th>
                            <th className="border px-4 py-2">Client Spoc</th>
                            <th className="border px-4 py-2">Active Cases</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientData.length > 0 ? clientData.map((item, index) => (
                            <React.Fragment key={item.client_unique_id}>
                                <tr className="text-center">
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{item.client_unique_id}</td>
                                    <td className="border px-4 py-2">{item.name || 'N/A'}</td>
                                    <td className="border px-4 py-2">{item.single_point_of_contact || 'N/A'}</td>
                                    <td className="border px-4 py-2">{item.application_count}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className={`text-white rounded px-4 py-2 ${
                                                activeCases && activeCases.main_id === item.main_id ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                            }`}
                                            onClick={() => handleCheckIn(item.main_id)}
                                        >
                                            {activeCases && activeCases.main_id === item.main_id ? 'Less' : 'View Branches'}
                                        </button>
                                        <button
                                            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 ml-2"
                                            onClick={() => handleDelete(item.main_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                                {activeCases && activeCases.main_id === item.main_id && nonHeadBranchData.length > 0 && (
                                    <tr className="text-center bg-gray-100">
                                        <td colSpan="6" className="border px-4 py-2">
                                            <h3 className="font-bold">Non-Head Branches</h3>
                                            <table className="w-full mt-2">
                                                <thead>
                                                    <tr className="bg-gray-300">
                                                        <th className="border px-4 py-2">SL</th>
                                                        <th className="border px-4 py-2">Branch Name</th>
                                                        <th className="border px-4 py-2">Check in</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {nonHeadBranchData.map((branch, index) => (
                                                        <tr key={branch.branch_id}>
                                                            <td className="border px-4 py-2">{index + 1}</td>
                                                            <td className="border px-4 py-2">{branch.branch_name}</td>
                                                            <td className="border px-4 py-2">
                                                                <button
                                                                    className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 ml-2"
                                                                    onClick={() => handleCheckInGo(branch.branch_id,item.main_id)}
                                                                >
                                                                    Check In
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center p-4">No client data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminManager;
