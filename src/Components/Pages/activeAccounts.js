import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useClientContext } from "./ClientContext";
import { useNavigate } from 'react-router-dom';

const ActiveAccounts = () => {
  const navigate = useNavigate();
  const [activeList, setActiveList] = useState([]);
  const { selectedClient, setSelectedClient} = useClientContext();
  const [expandedServices, setExpandedServices] = useState({});
  const [errors, setErrors] = useState({});

  const storedToken = localStorage.getItem('_token'); // Ensure the token is stored correctly
  const maxVisibleServices = 1;

  const toggleExpanded = (serviceIndex) => {
    setExpandedServices((prevState) => ({
      ...prevState,
      [serviceIndex]: !prevState[serviceIndex], // Toggle the expansion for this specific serviceIndex
    }));
  };

  useEffect(() => {
    const fetchActiveAccounts = async () => {
      const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;

      if (!admin_id || !storedToken) {
        console.error("Admin ID or token not found. Please log in.");
        return;
      }

      try {
        const response = await fetch(`https://screeningstar-new.onrender.com/customer/list?admin_id=${admin_id}&_token=${storedToken}`, {
          method: "GET",
          redirect: "follow"
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        const newToken = result.token || result._token;
        if (newToken) {
          localStorage.setItem('_token', newToken);
        }
        setActiveList(result.customers);
      } catch (error) {
        console.error("Failed to fetch active accounts:", error);
      }
    };

    fetchActiveAccounts();
  }, [storedToken]); // Only run effect when storedToken changes or is initially available

  const handleBlock = async (id) => {
    if (window.confirm('Are you sure you want to block this client?')) {
      try {
        await axios.put(
          `https://screeningstar.onrender.com/Screeningstar/clients/status/${id}`,
          { status: 'inactive' },
          {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setActiveList((prevList) => prevList.filter(client => client.id !== id));
        alert('Client successfully blocked.');
      } catch (error) {
        console.error('Error blocking client:', error);
        alert('An error occurred while trying to block the client.');
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this client?");
    if (confirmDelete) {
      try {
        const response = await fetch(`https://screeningstar.onrender.com/Screeningstar/clients/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
        });

        if (response.ok) {
          setActiveList(prevList => prevList.filter(client => client.id !== id));
          alert("Client successfully deleted.");
        } else {
          const errorText = await response.text();
          console.error("Error deleting client:", errorText);
          alert("Failed to delete the client. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("An error occurred while trying to delete the client.");
      }
    }
  };

  const handleEdit = (client) => {
    navigate('/admin-editclient');
    setSelectedClient(client);
  };

  return (
    <div className="w-full bg-[#c1dff2] overflow-hidden">
      <div className="text-left">
        <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 borde">ACTIVE CLIENTS</h2>
      </div>

      <div className="border space-y-4 py-[30px] px-[51px] bg-white">
        <div className="rounded-lg overflow-scroll">
          <table className="min-w-full border-collapse border rounded-lg">
            <thead className='rounded-lg'>
              <tr className="bg-[#c1dff2] text-[#4d606b] whitespace-nowrap">
                <th className="border px-4 py-2">SL</th>
                <th className="border px-4 py-2">Client ID</th>
                <th className="border px-4 py-2">Organization Name</th>
                <th className="border px-4 py-2">Registered Address</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">State</th>
                <th className="border px-4 py-2">State Code</th>
                <th className="border px-4 py-2">GST Number</th>
                <th className="border px-4 py-2">Mobile Number</th>
                <th className="border px-4 py-2">TAT</th>
                <th className="border px-4 py-2">Date of Agreement</th>
                <th className="border px-4 py-2">Standard Process</th>
                <th className="border px-4 py-2">Agreement Period</th>
                <th className="border px-4 py-2">Custom Template</th>
                <th className="border px-4 py-2">Upload Client logo</th>
                <th className="border px-4 py-2">Scope of Services</th>
                <th className="border px-4 py-2">Additional login required?</th>
                <th className="border px-4 py-2">Created At</th>
                <th className="border px-4 py-2">Updated At</th>
                <th className="border px-4 py-2" colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeList.length === 0 ? (
                <tr>
                  <td colSpan="21" className="text-center py-4 text-gray-500">
                    You have no data.
                  </td>
                </tr>
              ) : (
                activeList.map((client, index) => {
                  const services = client.services ? JSON.parse(client.services).flatMap(group => group.services) : [];

                  return (
                    <tr key={client.clientId} className="text-center border-b border-gray-300">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{client.client_unique_id}</td>
                      <td className="border px-4 py-2 min-w-[200px]">{client.name}</td>
                      <td className="border px-4 py-2">{client.address}</td>
                      <td className="border px-4 py-2">{client.emails ? JSON.parse(client.emails).join(', ') : 'NIL'}</td>
                      <td className="border px-4 py-2">{client.state}</td>
                      <td className="border px-4 py-2">{client.state_code}</td>
                      <td className="border px-4 py-2 min-w-[200px]">{client.gst_number}</td>
                      <td className="border px-4 py-2 min-w-[200px]">{client.mobile}</td>
                      <td className="border px-4 py-2">{client.tat_days}</td>

                      {/* Agreement date */}
                      <td className="border px-4 py-2 min-w-[300px]">
                        {client.agreement
                          ? new Date(client.agreement).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'NIL'}
                      </td>

                      <td className="border px-4 py-2 min-w-[300px]">{client.client_standard}</td>
                      <td className="border px-4 py-2">{new Date(client.agreement_date).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">{client.custom_template || 'NIL'}</td>

                      {/* Client logo */}
                      <td className="border px-4 py-2">
                        <img src={`https://screeningstar-new.onrender.com/${client.logo}`} alt="Client Logo" />
                      </td>
                      <td className="border px-4 py-2">
                        {services.length > 0 ? (
                          services.slice(0, expandedServices[index] ? services.length : maxVisibleServices).map((service, i) => (
                            <div key={i} className="flex flex-col text-left border-b border-gray-300 pb-2 last:border-0">
                              <span className="font-semibold text-gray-700">Service: {service.serviceTitle || 'N/A'}</span>
                              <span className="text-gray-600">Price: {service.price || 'N/A'}</span>
                              <span className="text-gray-600">
                                Packages: {service.packages?.length > 0
                                  ? service.packages.map((pkg, pkgIndex) => (
                                    <span key={pkgIndex}>
                                      {pkg.name}{pkgIndex < service.packages.length - 1 ? ', ' : ''}
                                    </span>
                                  ))
                                  : 'No Packages'}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-center text-gray-500">No Services Available</span>
                        )}

                        {services.length > maxVisibleServices && (
                          <button
                            onClick={() => toggleExpanded(index)}
                            className="text-blue-500 underline text-sm mt-2"
                          >
                            {expandedServices[index] ? 'View Less' : 'View More'}
                          </button>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="border px-4 py-2">{client.additional_login}</td>
                      <td className="border px-4 py-2">{new Date(client.created_at).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">{new Date(client.updated_at).toLocaleDateString()}</td>

                      {/* Action buttons */}
                      <td className="border px-4 py-2 min-w-[300px]">
                        <button onClick={() => handleEdit(client)} className="bg-green-500 text-white px-4 py-2 rounded mr-3">Edit</button>
                        <button onClick={() => handleBlock(client.id)} className="bg-red-500 text-white px-4 py-2 rounded mr-3">Block</button>
                        <button onClick={() => handleDelete(client.id)} className="bg-[#073d88] text-white px-4 py-2 rounded">Delete</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveAccounts;
