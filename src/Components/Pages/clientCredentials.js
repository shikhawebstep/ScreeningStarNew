import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const ClientCredentials = () => {
  const [clientData, setClientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewBranchesRow, setViewBranchesRow] = useState(null);
  const [branchesData, setBranchesData] = useState([]);
  const storedToken = localStorage.getItem('token');
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const emailFromQuery = query.get('email') || '';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
      const storedToken = localStorage.getItem("_token");
      if (!storedToken) {
        console.error("No token found. Please log in.");
        return;
      }
      try {
        const response = await fetch(`https://screeningstar-new.onrender.com/external-login-credentials/list?admin_id=${admin_id}&_token=${storedToken}`, {
          method: "GET",
          redirect: "follow"
        });
        const newToken = response.token || response._token || '';
        if (newToken) {
            localStorage.setItem("_token", newToken);
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status) {
          const mappedData = data.customers.map((client, index) => ({
            clientId: client.client_unique_id,
            branchName: client.name,
            branchEmail: client.emails ? JSON.parse(client.emails)[0] : 'N/A',  // Assuming emails are an array
            branchCount: client.branch_count,
            main_id: client.main_id
          }));
          setClientData(mappedData);
          console.log(`clientData - `, clientData);
        } else {
          setError("Unexpected data format received.");
        }
      } catch (error) {
        console.error(error);  // Log error for debugging
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [storedToken]);




  

  const handleViewBranchesClick = async (clientId) => {
    if (viewBranchesRow === clientId) {
      setViewBranchesRow(null);
      setBranchesData([]);  // Clear branches data when hiding
      return;
    }

    try {
      // Retrieve admin_id and token from localStorage
      const adminId = JSON.parse(localStorage.getItem("admin"))?.id;
      const token = localStorage.getItem('_token');

      if (!adminId || !token) {
        throw new Error('Admin ID or Token not found in localStorage');
      }

      const url = `https://screeningstar-new.onrender.com/branch/list-by-customer?customer_id=${clientId}&admin_id=${adminId}&_token=${token}`;

      // Use the GET method with the new API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const newToken = response.token || response._token || '';
      if (newToken) {
          localStorage.setItem("_token", newToken);
      }
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status && data.branches) {
        setViewBranchesRow(clientId);
        setBranchesData(data.branches);  // Set the correct branch data here
      } else {
        setError("Error fetching branches.");
      }
    } catch (error) {
      console.error(error);  // Log error for debugging
      setError(`Error fetching branches: ${error.message}`);
    }
  };



  if (loading) {
    return <div>Loading...</div>; // Consider using a spinner or loader component
  }
  return (
    <div className="w-full bg-[#c1dff2] border overflow-hidden">
      <div className="text-left">
        <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">CLIENT CREDENTIALS</h2>
      </div>

      <div className="space-y-4 py-[30px] px-[51px] bg-white">
        <div className=" overflow-hidden">
          <table className="min-w-full border-collapse border ">
            <thead className="">
              <tr className="bg-[#c1dff2] whitespace-nowrap text-[#4d606b] ">
                <th className="border px-4 py-2">SI</th>
                <th className="border px-4 py-2">Client ID</th>
                <th className="border px-4 py-2">Name of Client Organisation</th>
                <th className="border px-4 py-2">Username</th>
                <th className="border px-4 py-2">Link</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {error ? (
                <tr>
                  <td colSpan={5} className="border px-4 py-2 text-red-500">
                    Error: No Data Found
                  </td>
                </tr>
              ) : clientData.length > 0 ? (
                clientData.map((client, index) => (
                  <React.Fragment key={client.clientId}>
                    <tr>
                      <td className="border px-4 py-2 font-bold">{index + 1}</td>
                      <td className="border px-4 py-2 font-bold">{client.clientId}</td>
                      <td className="border px-4 py-2 font-bold">{client.branchName}</td>
                      <td className="border px-4 flex justify-around p-4 font-bold">
                        <div>{client.branchEmail}</div>
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleViewBranchesClick(client.main_id)}
                          className="ml-2 text-blue-500"
                        >
                          {viewBranchesRow === client.main_id ? 'Less' : 'View Branches'}
                        </button>
                      </td>
                    </tr>

                    {/* Conditionally render branches for the selected row */}
                    {viewBranchesRow === client.main_id && (
                      <tr>
                        <td colSpan={5} className="p-4">
                          <table className="min-w-full border-collapse border ">
                            <thead>
                              <tr className="bg-[#c1dff2] whitespace-nowrap text-[#4d606b]">
                                <th className="border px-4 py-2">Branch ID</th>
                                <th className="border px-4 py-2">Branch Name</th>
                                <th className="border px-4 py-2">Branch Email</th>
                                <th className="border px-4 py-2">Link</th>
                              </tr>
                            </thead>
                            <tbody className="text-center">
                              {branchesData.length > 0 ? (
                                branchesData.map(branch => (
                                  <tr key={branch.id}>
                                    <td className="border px-4 py-2 font-light">{branch.id}</td>
                                    <td className="border px-4 py-2 font-light">{branch.name}</td>
                                    <td className="border px-4 py-2 font-light">{branch.email}</td>
                                    <td className="border px-4 py-2">
                                      <Link
                                        to={`/userLogin?branchEmail=${encodeURIComponent(branch.email)}`}
                                        target='_blank'
                                        className="bg-[#c1dff2] text-[#4d606b] px-4 py-2 rounded"
                                      >
                                        Go
                                      </Link>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={4} className="border px-4 py-2 font-light">
                                    You have no branches.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="border px-4 py-2">
                    No head branches found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientCredentials;
