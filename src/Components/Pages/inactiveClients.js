import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
const InactiveClients = () => {
    const [inactiveClients, setInactiveClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const storedToken = localStorage.getItem('token');
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
        
            const result = await response.json();
            const newToken = result.token || result._token || '';
            if (newToken) {
                localStorage.setItem("_token", newToken);
            }
            console.log(result);
            setInactiveClients(result.customers);
        } catch (error) {
            console.error("Failed to fetch active accounts:", error);
        }
    };
    useEffect(() => {
      
        fetchInactiveClients();
    }, [fetchInactiveClients]);



    const handleUnblock = async (id) => {
        const admin_id = JSON.parse(localStorage.getItem("admin"))?.id;
        const storedToken = localStorage.getItem("_token");
      
        // Check if admin_id or storedToken is missing
        if (!admin_id || !storedToken) {
          console.error("Missing admin_id or _token");
          return;
        }
      
        // Show confirmation alert
        const confirmation = await Swal.fire({
          title: "Are you sure?",
          text: "You are about to unblock this customer.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, unblock it!",
        });
      
        if (confirmation.isConfirmed) {
          try {
            const response = await fetch(
              `https://screeningstar-new.onrender.com/customer/active?customer_id=${id}&admin_id=${admin_id}&_token=${storedToken}`,
              {
                method: "GET",
                redirect: "follow",
              }
            );
      
            if (!response.ok) {
              throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
      
            const result = await response.json();
            const newToken = result.token || result._token;
            if (newToken) {
              localStorage.setItem("_token", newToken);
            }
      
            Swal.fire("Unblocked!", "The customer has been unblocked successfully.", "success");
      
            fetchInactiveClients(); // Refresh active accounts
          } catch (error) {
            console.error("Failed to unblock customer:", error);
          }
        }
      };
      

   
    return (
        <div className="bg-[#c1dff2]">
            <h2 className="text-2xl font-bold py-3 text-left text-[#4d606b] px-3 border">INACTIVE CLIENTS</h2>
            <div className="bg-white p-12 border w-full mx-auto">
                <div className="flex space-x-4">

                    <div className="w-full overflow-x-auto">
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
                                    <th className="border px-4 py-2">Additional login required?</th>
                                    
                                    <th className="border px-4 py-2" colSpan={2}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inactiveClients.length === 0 ? (
                                    <tr>
                                        <td colSpan="21" className="text-center py-4 text-gray-500">
                                            You have no data.
                                        </td>
                                    </tr>
                                ) : (
                                    inactiveClients.map((client, index) => {

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

                                                {/* Action buttons */}
                                                <td className="border px-4 py-2">{client.additional_login==1 ? 'yes' :'no'}</td>
                                               

                                                {/* Action buttons */}
                                                <td className="border px-4 py-2 min-w-[300px]">
                                                    <button onClick={() => handleUnblock(client.id)} className="bg-red-500 text-white px-4 py-2 rounded mr-3">Unblock</button>
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
        </div>

    );
};
export default InactiveClients;