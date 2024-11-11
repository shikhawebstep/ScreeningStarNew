import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminManager = () => {
    const navigate = useNavigate();
    const [clientData, setClientData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCases, setActiveCases] = useState(null);
    const [nonHeadBranchData, setNonHeadBranchData] = useState([]);

    const fetchClientData = async () => {
        const storedToken = localStorage.getItem('token');

        try {
            const response = await fetch('https://screeningstar.onrender.com/Screeningstar/getheadBranchescm', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            setClientData(result || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchNonHeadBranchData = async (clientId) => {
        const storedToken = localStorage.getItem('token');

        try {
            const response = await fetch('https://screeningstar.onrender.com/Screeningstar/getnonheadBranchescm', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch non-head branch data');
            }
            const result = await response.json();
            setNonHeadBranchData(result || []);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchClientData();
    }, []);

    const handleCheckIn = (clientId, branchId) => {
        navigate(`/admin-chekin?clientId=${clientId}&branchId=${branchId}`);
    };

    const handleViewActiveCases = (clientId, activeCaseCount) => {
        const fakeEntries = Array.from({ length: activeCaseCount }, (_, index) => ({
            caseId: `Case-${index + 1}`,
            description: `Description for case ${index + 1}`,
        }));
        setActiveCases({ clientId, fakeEntries });

        // Fetch non-head branch data when the "View" button is clicked
        fetchNonHeadBranchData(clientId);
    };

    const handleLess = () => {
        setActiveCases(null);
        setNonHeadBranchData([]); // Clear non-head branch data when collapsing
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-[#c1dff2]">
            <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">ADMIN MANAGER</h2>
            <div className="bg-white p-12 w-full mx-auto">
                <div>
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
                                <React.Fragment key={item.branch.clientId}>
                                    <tr className="text-center">
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{item.branch.clientId}</td>
                                        <td className="border px-4 py-2">{item.clientManagers[0]?.organizationName || 'N/A'}</td>
                                        <td className="border px-4 py-2">{item.clientManagers[0]?.spocUploaded || 'N/A'}</td>
                                        <td className="border px-4 py-2">{item.applicationCount}</td>
                                        <td className="border px-4 py-2">
                                            {activeCases && activeCases.clientId === item.branch.clientId ? (
                                                <button
                                                    className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                                                    onClick={handleLess}
                                                >
                                                    Less
                                                </button>
                                            ) : (
                                                <button
                                                    className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
                                                    onClick={() => handleViewActiveCases(item.branch.clientId, item.applicationCount)}
                                                >
                                                    View
                                                </button>
                                            )}
                                            <button
                                                className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 ml-2"
                                                onClick={() => handleCheckIn(item.branch.clientId, item.branch.id)} // Pass both clientId and branchId
                                            >
                                                Check In
                                            </button>
                                        </td>
                                    </tr>
                                    {activeCases && activeCases.clientId === item.branch.clientId && nonHeadBranchData.length > 0 && (
                                        <tr className="text-center bg-gray-100">
                                            <td colSpan="6" className="border px-4 py-2">
                                                <h3 className="font-bold">Non-Head Branches</h3>
                                                <table className="w-full mt-2">
                                                    <thead>
                                                        <tr className="bg-gray-300">
                                                            <th className="border px-4 py-2">SL</th>
                                                            <th className="border px-4 py-2">Branch Name</th>
                                                            <th className="border px-4 py-2">Email</th>
                                                            <th className="border px-4 py-2">SPoC Uploaded</th>
                                                            <th className="border px-4 py-2">Check in</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {nonHeadBranchData.map((branch) => (
                                                            <tr key={branch.branch.id}>
                                                                <td className="border px-4 py-2">{+1}</td>
                                                                <td className="border px-4 py-2">{branch.branch.branchName}</td>
                                                                <td className="border px-4 py-2">{branch.branch.branchEmail}</td>
                                                                <td className="border px-4 py-2">{branch.clientManagers[0]?.spocUploaded || 'N/A'}</td>
                                                                <td className="border px-4 py-2">
                                                                    <button
                                                                        className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 ml-2"
                                                                        onClick={() => handleCheckIn(branch.branch.clientId, branch.branch.id)} // Pass branchId here too
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
        </div>
    );
};

export default AdminManager;
